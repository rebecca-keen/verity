#!/usr/bin/env python3
"""Audit and fix provider logos that are photos, favicons, or OG images instead of wordmarks."""
from __future__ import annotations

import importlib.util
import json
import mimetypes
import re
import ssl
import struct
import sys
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from io import BytesIO
from pathlib import Path
from typing import Dict, List, Optional, Tuple

ROOT = Path(__file__).resolve().parent.parent
LIB = ROOT / "lib"
LOGO_DIR = ROOT / "public" / "provider-logos"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 VerityPhotoLogoFix/1.0"
ssl_ctx = ssl.create_default_context()

AUDIT_PATH = ROOT / "scripts" / "audit-fix-logos.py"
spec = importlib.util.spec_from_file_location("audit_fix_logos", AUDIT_PATH)
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)

HEADSHOT_LOGO_URL_RE = re.compile(
    r"(?:headshot|portrait|(?:^|[/_-])team(?:[/_-]|$)|(?:^|[/_-])staff(?:[/_-]|$)|"
    r"(?:^|[/_-])(?:doctor|physician|nurse|injector|employee)(?:[/_-]|$)|profile|"
    r"cutout|hair\.|dr[-_]|screenshot|screen[-_]shot|servicios|(?:^|[/_-])service(?:[/_-]|$)|"
    r"product|xeomin|botox|filler|hydra|laser[-_]hair|instagram[-_]post|bodystyler|before[-_]after|"
    r"(?:^|[/_-])treatment(?:[/_-]|$))",
    re.I,
)
PHOTO_LOGO_URL_RE = re.compile(
    r"(?:og[-_](?:feat|image|default)|social/og|open[-_]?graph|screenshot|hero|masthead|banner|"
    r"gallery|incollage|collage|facility|interior|exterior|lobby|before[-_]?after|"
    r"headshot|portrait|team|staff|scaled\.|(?:^|[/_-])photo[-_]?\d|dsc[-_]?\d|share[-_]?(?:image|logo)|"
    r"1200x630|1500x1500|1024x1024)",
    re.I,
)

WORDMARK_URL_RE = re.compile(
    r"(?:^|[/_-])logo(?:[._-]|$)|[-_]logo[-_.]|logo[-_]?(?:white|dark|mark|icon|full|primary|secondary|"
    r"wordmark|horizontal|vertical|stacked)|(?:^|[/_-])brand(?:[._-]|$)|wordmark|logotype|site[-_]?logo",
    re.I,
)


def media_key(url: str) -> str:
    if not url:
        return ""
    if url.startswith("/"):
        return url.lower()
    parsed = urllib.parse.urlparse(url)
    return f"{parsed.hostname or ''}{parsed.path}".lower()


def is_photo_logo_url(url: str) -> bool:
    if not url:
        return False
    if WORDMARK_URL_RE.search(url):
        return False
    if HEADSHOT_LOGO_URL_RE.search(url):
        return True
    return bool(PHOTO_LOGO_URL_RE.search(url))


def image_dimensions(data: bytes) -> Optional[Tuple[int, int]]:
    """Read PNG/JPEG/WebP/GIF/SVG dimensions."""
    try:
        from PIL import Image

        with Image.open(BytesIO(data)) as img:
            return img.size
    except Exception:
        pass
    if len(data) < 24:
        return None
    # PNG
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        w, h = struct.unpack(">II", data[16:24])
        return w, h
    # GIF
    if data[:6] in (b"GIF87a", b"GIF89a"):
        w, h = struct.unpack("<HH", data[6:10])
        return w, h
    return None


def analyze_logo_bytes(data: bytes, ext: str) -> List[str]:
    """Return issue tags for downloaded logo bytes."""
    if ext == ".svg":
        return []
    dims = image_dimensions(data)
    if not dims:
        return ["unreadable-bytes"]
    w, h = dims
    aspect = w / max(h, 1)
    issues: List[str] = []
    if w <= 200 and h <= 200 and abs(aspect - 1.0) < 0.2:
        issues.append("favicon-sized")
    if w >= 1150 and h >= 600 and 1.75 <= aspect <= 2.05:
        issues.append("og-image-dimensions")
    if w >= 400 and h >= 400 and abs(aspect - 1.0) < 0.12:
        issues.append("square-photo-dimensions")
    if w >= 800 and h >= 500 and aspect < 2.0:
        issues.append("landscape-photo-dimensions")
    if w >= 600 and h >= 600 and aspect < 1.5:
        issues.append("large-square-photo")
    return issues


def analyze_local_logo(path: Path) -> List[str]:
    if not path.exists():
        return ["missing-local-file"]
    if path.suffix.lower() == ".svg":
        return []
    try:
        data = path.read_bytes()
    except OSError:
        return ["unreadable-local"]
    return analyze_logo_bytes(data, path.suffix.lower())


def logo_matches_hero_or_gallery(logo: str, hero: str, gallery: List[str]) -> bool:
    lk = media_key(logo)
    if lk and lk == media_key(hero):
        return True
    return any(media_key(g) == lk for g in gallery)


def is_photo_as_logo(
    logo: Optional[str],
    hero: str,
    gallery: List[str],
    website: str,
) -> Tuple[bool, List[str]]:
    """Detect logos that are facility photos, OG images, favicons, or hero duplicates."""
    if not logo:
        return False, []
    reasons: List[str] = []
    if logo_matches_hero_or_gallery(logo, hero, gallery):
        reasons.append("logo-equals-hero-or-gallery")
    if not logo.startswith("/provider-logos/"):
        if is_photo_logo_url(logo):
            reasons.append("photo-url-pattern")
        if audit.is_partner_badge(logo):
            reasons.append("partner-badge")
    if logo.startswith("/provider-logos/"):
        local = ROOT / "public" / logo.lstrip("/")
        reasons.extend(analyze_local_logo(local))
    elif logo.startswith("http"):
        if audit.FAVICON_ONLY_RE.search(logo) and not WORDMARK_URL_RE.search(logo):
            reasons.append("favicon-url")
        if audit.HEADSHOT_URL_RE.search(logo):
            reasons.append("headshot-url")
    if not reasons and logo.startswith("/provider-logos/"):
        local = ROOT / "public" / logo.lstrip("/")
        if local.exists() and local.suffix.lower() != ".svg":
            data = local.read_bytes()
            dims = image_dimensions(data)
            if dims:
                w, h = dims
                aspect = w / max(h, 1)
                if w > 128 and h > 128 and aspect >= 1.4 and h <= 350:
                    return False, []
    return bool(reasons), reasons


def extract_logo_candidates(html: str, base: str) -> List[Tuple[str, int, str]]:
    """Prefer header wordmarks over favicons and OG social preview images."""
    candidates: List[Tuple[str, int, str]] = []

    def add(url: Optional[str], score: int, kind: str):
        if not url:
            return
        abs_url = urllib.parse.urljoin(base, url)
        if is_photo_logo_url(abs_url) and kind not in ("header-logo", "logo-img"):
            return
        if re.search(r"\.(?:gif)(?:\?|$)", abs_url, re.I) and kind != "header-logo":
            return
        candidates.append((abs_url, score, kind))

    for tag in re.findall(r"<img[^>]+>", html, re.I):
        if re.search(r'(?:class|id|alt)=["\'][^"\']*logo[^"\']*["\']', tag, re.I):
            src_m = re.search(r'(?:src|data-src|data-lazy-src)=["\']([^"\']+)["\']', tag, re.I)
            if src_m and not audit.is_partner_badge(src_m.group(1)):
                add(src_m.group(1), 1000, "header-logo")

    for tag in re.findall(r"<img[^>]+>", html, re.I):
        src_m = re.search(r'(?:src|data-src|data-lazy-src)=["\']([^"\']+)["\']', tag, re.I)
        if not src_m or audit.is_partner_badge(src_m.group(1)):
            continue
        src = src_m.group(1)
        if WORDMARK_URL_RE.search(src) or WORDMARK_URL_RE.search(tag):
            add(src, 900 if WORDMARK_URL_RE.search(src) else 850, "logo-img")

    for tag in re.findall(r"<link[^>]+>", html, re.I):
        if not re.search(r'rel=["\'][^"\']*(?:apple-touch-icon|icon|shortcut icon|mask-icon)', tag, re.I):
            continue
        href_m = re.search(r'href=["\']([^"\']+)["\']', tag, re.I)
        if not href_m:
            continue
        href = href_m.group(1)
        if WORDMARK_URL_RE.search(href):
            add(href, 820, "link-icon")
        else:
            add(href, 120, "link-icon")

    og = audit.extract_og_image(html, base)
    if og and not audit.is_partner_badge(og):
        if WORDMARK_URL_RE.search(og):
            add(og, 800, "og-image")
        elif not is_photo_logo_url(og):
            add(og, 150, "og-image")

    candidates.sort(key=lambda x: -x[1])
    seen = set()
    out = []
    for url, score, kind in candidates:
        key = urllib.parse.urlparse(url).path.lower()
        if key in seen:
            continue
        seen.add(key)
        out.append((url, score, kind))
    return out


def upscale_logo_url(url: str) -> List[str]:
    """Try WordPress / CDN variants without dimension suffixes."""
    urls = [url]
    stripped = re.sub(r"-\d+x\d+(?=\.(?:png|jpe?g|webp|gif))", "", url, flags=re.I)
    if stripped != url:
        urls.append(stripped)
    stripped2 = re.sub(r"/(?:w_\d+,h_\d+|w=\d+,h=\d+)[^/]*/", "/", url)
    if stripped2 != url:
        urls.append(stripped2)
    return urls


def fetch_site_logo(website: str) -> Optional[str]:
    candidates: List[Tuple[str, int, str]] = []
    seen_html = set()
    for path in ("", "/"):
        url = urllib.parse.urljoin(website, path)
        html = audit.fetch_html(url)
        if not html:
            continue
        sig = html[:500]
        if sig in seen_html:
            continue
        seen_html.add(sig)
        candidates.extend(extract_logo_candidates(html, url))

    for url, _, kind in candidates:
        if audit.is_partner_badge(url) or audit.is_generic_stock(url):
            continue
        if HEADSHOT_LOGO_URL_RE.search(url) and not WORDMARK_URL_RE.search(url):
            continue
        if not audit.url_allowed_for_website(url, website):
            continue
        if audit.HEADSHOT_URL_RE.search(url):
            continue
        if is_photo_logo_url(url) and kind not in ("header-logo", "logo-img"):
            continue

        for try_url in upscale_logo_url(url):
            if try_url.startswith("http://"):
                try_url = "https://" + try_url.split("://", 1)[1]
            if not audit.check_url(try_url)["ok"]:
                continue
            downloaded = download_logo(try_url)
            if not downloaded:
                continue
            data, ext = downloaded
            issues = analyze_logo_bytes(data, ext)
            if WORDMARK_URL_RE.search(try_url):
                if any(i in issues for i in ("og-image-dimensions", "landscape-photo-dimensions")):
                    continue
            elif issues:
                if kind not in ("header-logo", "logo-img"):
                    continue
                if any(
                    i in issues
                    for i in (
                        "og-image-dimensions",
                        "landscape-photo-dimensions",
                        "square-photo-dimensions",
                        "large-square-photo",
                        "favicon-sized",
                    )
                ):
                    continue
            return try_url

    try:
        domain = audit.root_domain(urllib.parse.urlparse(website).netloc)
        clearbit = f"https://logo.clearbit.com/{domain}"
        if audit.check_url(clearbit)["ok"]:
            return clearbit
    except Exception:
        pass
    return None


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
    }
    if ct in mapping:
        return mapping[ct]
    path = urllib.parse.urlparse(url).path.lower()
    for ext in (".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".ico"):
        if path.endswith(ext):
            return ext if ext != ".jpeg" else ".jpg"
    guess = mimetypes.guess_extension(ct or "")
    return guess or ".png"


def download_logo(url: str) -> Optional[Tuple[bytes, str]]:
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
            if ct and not ct.startswith("image/") and "octet-stream" not in ct and "svg" not in ct:
                return None
            return data, ext_for(ct, url)
    except Exception:
        return None


def host_logo(slug: str, logo_url: str) -> Optional[str]:
    downloaded = download_logo(logo_url)
    if not downloaded:
        return None
    data, ext = downloaded
    if HEADSHOT_LOGO_URL_RE.search(logo_url) and not WORDMARK_URL_RE.search(logo_url):
        return None
    issues = analyze_logo_bytes(data, ext)
    if issues and WORDMARK_URL_RE.search(logo_url):
        # Accept wordmark URLs unless clearly OG/landscape photo dimensions
        if not any(i in issues for i in ("og-image-dimensions", "landscape-photo-dimensions")):
            issues = []
    if issues and not WORDMARK_URL_RE.search(logo_url):
        if any(i in issues for i in ("og-image-dimensions", "landscape-photo-dimensions", "square-photo-dimensions", "large-square-photo", "favicon-sized")):
            return None
    LOGO_DIR.mkdir(parents=True, exist_ok=True)
    out_path = LOGO_DIR / f"{slug}{ext}"
    out_path.write_bytes(data)
    # Remove stale extensions
    for old_ext in (".png", ".jpg", ".webp", ".gif", ".svg", ".ico"):
        if old_ext != ext:
            stale = LOGO_DIR / f"{slug}{old_ext}"
            if stale.exists():
                stale.unlink()
    return f"/provider-logos/{slug}{ext}"


def audit_all() -> dict:
    all_spas, all_images, slug_file = audit.load_all_data()
    items = []
    photo_as_logo = []
    for slug, spa in sorted(all_spas.items()):
        images = all_images.get(slug) or {}
        logo = images.get("logo")
        hero = images.get("hero", "")
        gallery = images.get("gallery") or []
        website = spa.get("website", "")
        is_bad, reasons = is_photo_as_logo(logo, hero, gallery, website)
        entry = {
            "slug": slug,
            "name": spa.get("name"),
            "website": website,
            "logo": logo,
            "hero": hero,
            "reasons": reasons,
            "file": slug_file.get(slug),
            "has_images": bool(images),
        }
        items.append(entry)
        if is_bad:
            photo_as_logo.append(entry)

    report = {
        "total_providers": len(all_spas),
        "photo_as_logo_count": len(photo_as_logo),
        "audit_criteria": [
            "logo URL equals hero or gallery image",
            "logo URL matches photo patterns (og-image, hero, gallery, collage, screenshot, treatment, etc.)",
            "local file is favicon-sized (≤128px square)",
            "local file has OG dimensions (~1200×630)",
            "local file is large square or landscape photo dimensions",
            "partner badge or headshot URL patterns",
        ],
        "photo_as_logo": photo_as_logo,
        "items": items,
    }
    out = ROOT / "scripts" / "photo-logo-audit-report.json"
    out.write_text(json.dumps(report, indent=2), encoding="utf-8")
    return report


def fix_one(entry: dict, all_images: dict, slug_file: dict) -> Optional[dict]:
    slug = entry["slug"]
    website = entry.get("website") or ""
    fname = slug_file.get(slug)
    if not fname or not audit.is_valid_website(website):
        return {"slug": slug, "status": "skipped", "reason": "no-website-or-file"}

    images = dict(all_images.get(slug) or {})
    images.setdefault("hero", "")
    images.setdefault("gallery", images.get("gallery") or [])
    images.setdefault("source", images.get("source") or f"{entry.get('name', slug)} official website")

    before = images.get("logo")
    logo_url = fetch_site_logo(website)
    if not logo_url:
        return {"slug": slug, "status": "failed", "before": before, "reason": "no-logo-found"}

    local_path = host_logo(slug, logo_url)
    if not local_path:
        return {"slug": slug, "status": "failed", "before": before, "reason": "download-rejected", "url": logo_url}

    is_bad, reasons = is_photo_as_logo(local_path, images.get("hero", ""), images.get("gallery") or [], website)
    if is_bad:
        return {"slug": slug, "status": "failed", "before": before, "reason": "still-photo-as-logo", "reasons": reasons, "url": logo_url}

    images["logo"] = local_path
    audit.write_image_entry(fname, slug, images)
    return {
        "slug": slug,
        "status": "fixed",
        "before": before,
        "after": local_path,
        "from": logo_url,
    }


def main() -> None:
    fix_mode = "--fix" in sys.argv
    slug_filter = None
    if "--slug" in sys.argv:
        idx = sys.argv.index("--slug")
        if idx + 1 < len(sys.argv):
            slug_filter = sys.argv[idx + 1]

    report = audit_all()
    photo_items = report["photo_as_logo"]
    if slug_filter:
        photo_items = [p for p in photo_items if p["slug"] == slug_filter]

    print(f"Audited {report['total_providers']} providers")
    print(f"  Photo-as-logo: {report['photo_as_logo_count']}")
    print(f"Wrote {ROOT / 'scripts' / 'photo-logo-audit-report.json'}")

    if not fix_mode:
        print("\nTop photo-as-logo issues:")
        for item in photo_items[:30]:
            print(f"  {item['slug']}: {', '.join(item['reasons'])}")
        if len(photo_items) > 30:
            print(f"  ... and {len(photo_items) - 30} more")
        print("\nRun with --fix to download wordmarks and update seed data")
        return

    all_spas, all_images, slug_file = audit.load_all_data()
    print(f"\nFixing {len(photo_items)} providers...")
    fixed = []
    failed = []

    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(fix_one, item, all_images, slug_file): item for item in photo_items}
        for fut in as_completed(futures):
            item = futures[fut]
            try:
                result = fut.result()
                if result and result.get("status") == "fixed":
                    fixed.append(result)
                    print(f"  fixed {result['slug']}: {result.get('before')} -> {result.get('after')}")
                elif result:
                    failed.append(result)
                    print(f"  failed {result['slug']}: {result.get('reason')}")
            except Exception as exc:
                failed.append({"slug": item["slug"], "status": "error", "error": str(exc)})
                print(f"  error {item['slug']}: {exc}")

    fix_report = {
        "fixed_count": len(fixed),
        "failed_count": len(failed),
        "fixed": fixed,
        "failed": failed,
    }
    out = ROOT / "scripts" / "photo-logo-fix-report.json"
    out.write_text(json.dumps(fix_report, indent=2), encoding="utf-8")
    print(f"\nFixed {len(fixed)} / {len(photo_items)} photo-as-logo providers")
    print(f"Wrote {out}")


if __name__ == "__main__":
    main()
