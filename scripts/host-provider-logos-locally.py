#!/usr/bin/env python3
"""Download provider logos to public/provider-logos/ and point seed files at local paths."""
from __future__ import annotations

import importlib.util
import json
import mimetypes
import re
import ssl
import sys
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LIB = ROOT / "lib"
LOGO_DIR = ROOT / "public" / "provider-logos"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 VerityLogoHost/1.0"
ssl_ctx = ssl.create_default_context()

AUDIT_PATH = ROOT / "scripts" / "audit-fix-logos.py"
spec = importlib.util.spec_from_file_location("audit_fix_logos", AUDIT_PATH)
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)


def ext_for(content_type: str, url: str) -> str:
    ct = (content_type or "").split(";")[0].strip().lower()
    mapping = {
        "image/png": ".png",
        "image/jpeg": ".jpg",
        "image/jpg": ".jpg",
        "image/webp": ".webp",
        "image/gif": ".gif",
        "image/svg+xml": ".svg",
        "image/x-icon": ".ico",
        "image/vnd.microsoft.icon": ".ico",
    }
    if ct in mapping:
        return mapping[ct]
    path = urllib.parse.urlparse(url).path.lower()
    for ext in (".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".ico"):
        if path.endswith(ext):
            return ext if ext != ".jpeg" else ".jpg"
    guess = mimetypes.guess_extension(ct or "")
    return guess or ".png"


def download_logo(url: str) -> tuple[bytes, str] | None:
    if not url or url.startswith("/"):
        return None
    if url.startswith("http://"):
        url = "https://" + url.split("://", 1)[1]
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=20, context=ssl_ctx) as resp:
            data = resp.read()
            if len(data) < 200:
                return None
            ct = resp.headers.get("Content-Type", "")
            if ct and not ct.startswith("image/") and "octet-stream" not in ct:
                return None
            return data, ext_for(ct, url)
    except Exception:
        return None


def should_host(item: dict) -> bool:
    logo = item.get("logo") or ""
    if logo.startswith("/provider-logos"):
        return False
    cats = set(item.get("categories") or [])
    if cats & {"broken-logo", "missing-logo", "bad-logo", "suspicious-favicon"}:
        return True
    if "--all-remote" in sys.argv and logo.startswith("http"):
        return True
    return False


def resolve_logo_url(item: dict, images: dict | None) -> str | None:
    website = item.get("website") or ""
    current = (images or {}).get("logo") or item.get("logo")
    if current and not audit.is_partner_badge(current) and audit.check_url(current)["ok"]:
        if "suspicious-favicon" not in item.get("categories", []):
            return current
    fetched = audit.fetch_site_logo(website) if audit.is_valid_website(website) else None
    if fetched and audit.check_url(fetched)["ok"]:
        return fetched
    if current and audit.check_url(current)["ok"]:
        return current
    return None


def host_one(item: dict, all_images: dict, slug_file: dict) -> dict | None:
    slug = item["slug"]
    fname = slug_file.get(slug)
    if not fname:
        return {"slug": slug, "status": "no-seed-file"}

    images = dict(all_images.get(slug) or {})
    logo_url = resolve_logo_url(item, images)
    if not logo_url:
        return {"slug": slug, "status": "no-downloadable-logo"}

    downloaded = download_logo(logo_url)
    if not downloaded:
        return {"slug": slug, "status": "download-failed", "url": logo_url}

    data, ext = downloaded
    LOGO_DIR.mkdir(parents=True, exist_ok=True)
    out_path = LOGO_DIR / f"{slug}{ext}"
    out_path.write_bytes(data)

    local_path = f"/provider-logos/{slug}{ext}"
    images.setdefault("hero", "")
    images.setdefault("gallery", images.get("gallery") or [])
    images.setdefault("source", images.get("source") or f"{item.get('name', slug)} official website")
    images["logo"] = local_path
    audit.write_image_entry(fname, slug, images)
    return {"slug": slug, "status": "hosted", "path": local_path, "from": logo_url}


def extra_slugs() -> list[str]:
    extras = []
    for arg in sys.argv[1:]:
        if arg.startswith("--slug="):
            extras.append(arg.split("=", 1)[1])
    return extras


def main() -> None:
    dry_run = "--dry-run" in sys.argv
    all_spas, all_images, slug_file = audit.load_all_data()
    report_path = ROOT / "scripts" / "logo-audit-report.json"
    if report_path.exists():
        report = json.loads(report_path.read_text(encoding="utf-8"))
        audit_items = report.get("items") or []
    else:
        audit_items = []

    targets: dict[str, dict] = {}
    for item in audit_items:
        if should_host(item):
            targets[item["slug"]] = item

    for slug in extra_slugs():
        spa = all_spas.get(slug)
        if not spa:
            continue
        images = all_images.get(slug)
        logo = (images or {}).get("logo") or ""
        if logo.startswith("/provider-logos"):
            continue
        targets[slug] = {
            "slug": slug,
            "name": spa.get("name"),
            "website": spa.get("website"),
            "logo": logo,
            "categories": ["manual"],
            "file": slug_file.get(slug),
        }

    print(f"Hosting {len(targets)} provider logos locally...")
    if dry_run:
        for slug in sorted(targets):
            print(f"  would host {slug}")
        return

    results = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = {
            pool.submit(host_one, item, all_images, slug_file): slug
            for slug, item in sorted(targets.items())
        }
        for fut in as_completed(futures):
            slug = futures[fut]
            try:
                result = fut.result()
                if result:
                    results.append(result)
                    if result.get("status") == "hosted":
                        print(f"  hosted {slug} -> {result['path']}")
                    else:
                        print(f"  skip {slug}: {result.get('status')}")
            except Exception as exc:
                results.append({"slug": slug, "status": "error", "error": str(exc)})
                print(f"  error {slug}: {exc}")

    hosted = [r for r in results if r.get("status") == "hosted"]
    out = {
        "requested": len(targets),
        "hosted": len(hosted),
        "results": results,
    }
    out_path = ROOT / "scripts" / "host-logos-report.json"
    out_path.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print(f"\nHosted {len(hosted)} / {len(targets)} logos")
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main()
