#!/usr/bin/env python3
"""Audit and fix provider logos in *-real-spas.ts seed files."""
import json
import re
from typing import Dict, List, Optional, Tuple
import ssl
import sys
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LIB = ROOT / "lib"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 VerityLogoAudit/1.0"

SEED_FILES = [
    "nationwide-real-spas.ts",
    "florida-real-spas.ts",
    "florida-coastal-real-spas.ts",
    "tampa-bay-real-spas.ts",
    "miami-metro-real-spas.ts",
]

IMAGE_BLOCK = {
    "nationwide-real-spas.ts": "NATIONWIDE_REAL_SPA_IMAGES",
    "florida-real-spas.ts": "FLORIDA_REAL_SPA_IMAGES",
    "florida-coastal-real-spas.ts": "FLORIDA_COASTAL_REAL_SPA_IMAGES",
    "tampa-bay-real-spas.ts": "TAMPA_BAY_REAL_SPA_IMAGES",
    "miami-metro-real-spas.ts": "MIAMI_METRO_REAL_SPA_IMAGES",
}

PARTNER_BADGE_RE = re.compile(
    r"alle[-+]|allergan|galderma|cobrand|proud[-_]?member|member[-_]?logo|fb-icon|"
    r"cropped-diamond|diamond\d|care[-_]?credit|synchrony|spacc_|tec-logo|medspascout",
    re.I,
)
LOGO_URL_RE = re.compile(
    r"(?:^|[/_-])logo(?:[._-]|$)|[-_]logo[-_.]|logo[-_]?(?:white|dark|mark|icon|full|primary|secondary)|"
    r"(?:^|[/_-])brand(?:[._-]|$)",
    re.I,
)
HEADSHOT_URL_RE = re.compile(
    r"(?:^|[/_-])(?:team|staff|provider|doctor|physician|nurse|injector|about(?:-us)?|headshot|portrait|bio|"
    r"employee|profile|meet-the|our-team|faculty|practitioner|expert|cutout|head-shot)(?:[/_-]|$)|"
    r"(?:team|staff|provider|doctor|headshot|portrait|bio|cutout|profile)[_-]|[-_]cutout[-_.]",
    re.I,
)
FAVICON_ONLY_RE = re.compile(r"favicon|site-icon|siteicon|webclip|apple-touch-icon|android-chrome|cropped-\d", re.I)
SOCIAL_RE = re.compile(r"facebook|instagram|twitter|linkedin|youtube|tiktok|social", re.I)
STOCK_RE = re.compile(r"unsplash|placeholder|stock|shutterstock|medspascout", re.I)
HTTP_RE = re.compile(r"^http://", re.I)

ssl_ctx = ssl.create_default_context()


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def parse_spas(content: str) -> Dict[str, dict]:
    spas = {}
    for m in re.finditer(
        r'slug:\s*"([^"]+)"[\s\S]*?website:\s*"([^"]+)"',
        content,
    ):
        slug, website = m.group(1), m.group(2)
        block = m.group(0)
        name_m = re.search(r'name:\s*"([^"]+)"', block)
        spas[slug] = {
            "slug": slug,
            "website": website,
            "name": name_m.group(1) if name_m else slug,
        }
    return spas


def parse_image_block(content: str, block_name: str) -> Dict[str, dict]:
    start = content.find(f"export const {block_name}")
    if start < 0:
        return {}
    # Find opening brace of the object literal after the type annotation
    type_end = content.find("> = {", start)
    if type_end < 0:
        return {}
    obj_start = type_end + 4  # points at '{'
    depth = 0
    obj_end = None
    for i in range(obj_start, len(content)):
        ch = content[i]
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                obj_end = i
                break
    if obj_end is None:
        return {}
    block = content[obj_start + 1 : obj_end]
    images = {}
    for m in re.finditer(r'"([^"]+)":\s*\{', block):
        slug = m.group(1)
        entry_start = m.end() - 1
        depth = 0
        entry_end = None
        for i in range(entry_start, len(block)):
            if block[i] == "{":
                depth += 1
            elif block[i] == "}":
                depth -= 1
                if depth == 0:
                    entry_end = i + 1
                    break
        if entry_end is None:
            continue
        entry = block[entry_start:entry_end]
        hero_m = re.search(r'hero:\s*"((?:\\.|[^"\\])*)"', entry)
        logo_m = re.search(r'logo:\s*"((?:\\.|[^"\\])*)"', entry)
        gallery_part = entry.split("gallery:", 1)[1].split("source:", 1)[0] if "gallery:" in entry else ""
        gallery = re.findall(r'"((?:\\.|[^"\\])*)"', gallery_part)
        source_m = re.search(r'source:\s*"((?:\\.|[^"\\])*)"', entry)
        images[slug] = {
            "hero": hero_m.group(1) if hero_m else "",
            "logo": logo_m.group(1) if logo_m else None,
            "gallery": gallery,
            "source": source_m.group(1) if source_m else "",
        }
    return images


def is_placeholder_website(website: str) -> bool:
    return bool(re.search(r"slug\.com|example\.com|placeholder|yourwebsite|domain\.com|pending\.com", website, re.I))


def is_valid_website(website: str) -> bool:
    if not website or not website.strip() or is_placeholder_website(website):
        return False
    try:
        p = urllib.parse.urlparse(website)
        return p.scheme in ("http", "https") and bool(p.netloc)
    except Exception:
        return False


def root_domain(host: str) -> str:
    h = re.sub(r"^www\.", "", host.lower())
    parts = h.split(".")
    return ".".join(parts[-2:]) if len(parts) > 2 else h


CDN_HOST_SUFFIXES = (
    ".cloudfront.net",
    ".squarespace-cdn.com",
    ".wixstatic.com",
    ".wp.com",
    ".website-files.com",
    ".pcdn.co",
    ".filesafe.space",
)
CDN_HOSTS = {
    "images.unsplash.com",
    "img1.wsimg.com",
    "datocms-assets.com",
    "content.app-sources.com",
    "i.ytimg.com",
    "static.showit.co",
    "static1.squarespace.com",
}


def url_allowed_for_website(url: str, website: str) -> bool:
    if not url:
        return False
    if "images.unsplash.com" in url:
        return True
    site_root = root_domain(urllib.parse.urlparse(website).netloc)
    if not site_root:
        return False
    try:
        host = urllib.parse.urlparse(url).netloc.replace("www.", "").lower()
    except Exception:
        return False
    if not host:
        return False
    if root_domain(host) == site_root:
        return True
    if host in CDN_HOSTS:
        return True
    for suffix in CDN_HOST_SUFFIXES:
        if host.endswith(suffix):
            return True
    if "cdn." in host and site_root.split(".")[0] in host:
        return True
    if "amazonaws.com" in host:
        return True
    return False


def is_partner_badge(url: Optional[str]) -> bool:
    return bool(url and PARTNER_BADGE_RE.search(url))


def is_generic_stock(url: Optional[str]) -> bool:
    return bool(url and STOCK_RE.search(url))


def categorize_logo(slug: str, logo: Optional[str], website: str) -> List[str]:
    issues = []
    if is_valid_website(website) and not logo:
        issues.append("missing-logo")
        return issues
    if not logo:
        return ["ok-no-website"]
    if is_partner_badge(logo):
        issues.append("bad-logo")
    if is_generic_stock(logo):
        issues.append("bad-logo")
    if HTTP_RE.match(logo):
        issues.append("http-logo")
    if HEADSHOT_URL_RE.search(logo):
        issues.append("suspicious-headshot")
    elif FAVICON_ONLY_RE.search(logo) and not LOGO_URL_RE.search(logo):
        issues.append("suspicious-favicon")
    if SOCIAL_RE.search(logo):
        issues.append("suspicious-social")
    if is_valid_website(website) and not url_allowed_for_website(logo, website):
        issues.append("cross-domain-logo")
    if not issues:
        issues.append("ok")
    return issues


def check_url(url: str, timeout: int = 12) -> dict:
    if not url:
        return {"ok": False, "status": 0}
    if url.startswith("/"):
        return {"ok": True, "status": 200}
    if HTTP_RE.match(url):
        url = "https://" + url.split("://", 1)[1]
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=ssl_ctx) as resp:
            ct = resp.headers.get("Content-Type", "")
            if resp.status < 400 and (ct.startswith("image/") or re.search(r"\.(jpg|jpeg|png|webp|gif|svg|ico)", url, re.I)):
                return {"ok": True, "status": resp.status}
    except Exception:
        pass
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Range": "bytes=0-2048"})
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=ssl_ctx) as resp:
            ct = resp.headers.get("Content-Type", "")
            return {"ok": resp.status < 400 and ct.startswith("image/"), "status": getattr(resp, "status", 0)}
    except urllib.error.HTTPError as e:
        return {"ok": False, "status": e.code}
    except Exception:
        return {"ok": False, "status": 0}


def fetch_html(url: str) -> Optional[str]:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=15, context=ssl_ctx) as resp:
            return resp.read().decode("utf-8", errors="replace")
    except Exception:
        return None


def extract_og_image(html: str, base: str) -> Optional[str]:
    patterns = [
        r'property=["\']og:image(?::secure_url)?["\']\s+content=["\']([^"\']+)["\']',
        r'content=["\']([^"\']+)["\']\s+property=["\']og:image(?::secure_url)?["\']',
        r'name=["\']twitter:image["\']\s+content=["\']([^"\']+)["\']',
    ]
    for p in patterns:
        m = re.search(p, html, re.I)
        if m:
            return urllib.parse.urljoin(base, m.group(1))
    return None


PHOTO_LOGO_URL_RE = re.compile(
    r"(?:og[-_](?:feat|image|default)|social/og|open[-_]?graph|screenshot|hero|masthead|banner|"
    r"gallery|incollage|collage|facility|interior|exterior|lobby|treatment|service|before[-_]?after|"
    r"headshot|portrait|team|staff|scaled\.|photo[-_]?\d|dsc[-_]?\d|share[-_]?(?:image|logo)|"
    r"1200x630|1500x1500|1024x1024)",
    re.I,
)


def is_photo_logo_url(url: Optional[str]) -> bool:
    if not url:
        return False
    if LOGO_URL_RE.search(url):
        return False
    return bool(PHOTO_LOGO_URL_RE.search(url))


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
            if src_m and not is_partner_badge(src_m.group(1)):
                add(src_m.group(1), 1000, "header-logo")

    for tag in re.findall(r"<img[^>]+>", html, re.I):
        src_m = re.search(r'(?:src|data-src|data-lazy-src)=["\']([^"\']+)["\']', tag, re.I)
        if not src_m or is_partner_badge(src_m.group(1)):
            continue
        src = src_m.group(1)
        if LOGO_URL_RE.search(src) or LOGO_URL_RE.search(tag):
            add(src, 900 if LOGO_URL_RE.search(src) else 850, "logo-img")

    for tag in re.findall(r"<link[^>]+>", html, re.I):
        if not re.search(r'rel=["\'][^"\']*(?:apple-touch-icon|icon|shortcut icon|mask-icon)', tag, re.I):
            continue
        href_m = re.search(r'href=["\']([^"\']+)["\']', tag, re.I)
        if not href_m:
            continue
        href = href_m.group(1)
        if LOGO_URL_RE.search(href):
            add(href, 820, "link-icon")
        else:
            add(href, 120, "link-icon")

    og = extract_og_image(html, base)
    if og and not is_partner_badge(og):
        if LOGO_URL_RE.search(og):
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


def fetch_site_logo(website: str) -> Optional[str]:
    candidates: List[Tuple[str, int, str]] = []
    seen_html = set()
    for path in ("", "/"):
        url = urllib.parse.urljoin(website, path)
        html = fetch_html(url)
        if not html:
            continue
        sig = html[:500]
        if sig in seen_html:
            continue
        seen_html.add(sig)
        candidates.extend(extract_logo_candidates(html, url))

    for url, _, _ in candidates:
        if is_partner_badge(url) or is_generic_stock(url):
            continue
        if not url_allowed_for_website(url, website):
            continue
        if HEADSHOT_URL_RE.search(url):
            continue
        if check_url(url)["ok"]:
            if url.startswith("http://"):
                url = "https://" + url.split("://", 1)[1]
            return url

    try:
        domain = root_domain(urllib.parse.urlparse(website).netloc)
        clearbit = f"https://logo.clearbit.com/{domain}"
        if check_url(clearbit)["ok"]:
            return clearbit
    except Exception:
        pass
    return None


def format_image_entry(slug: str, entry: dict) -> str:
    gallery_lines = "\n".join(
        f'      "{g.replace(chr(92), chr(92)*2).replace(chr(34), chr(92)+chr(34))}",' for g in entry.get("gallery", [])
    )
    logo_line = ""
    if entry.get("logo"):
        logo = entry["logo"].replace("\\", "\\\\").replace('"', '\\"')
        logo_line = f'\n    logo: "{logo}",'
    hero = entry["hero"].replace("\\", "\\\\").replace('"', '\\"')
    source = entry.get("source", "").replace("\\", "\\\\").replace('"', '\\"')
    return f'''  "{slug}": {{
    hero: "{hero}",{logo_line}
    gallery: [
{gallery_lines}
    ],
    source: "{source}",
  }}'''


def write_image_entry(filename: str, slug: str, entry: dict) -> None:
    path = LIB / filename
    content = read_text(path)
    block_name = IMAGE_BLOCK[filename]
    formatted = format_image_entry(slug, entry) + ",\n"
    slug_re = re.compile(
        rf'"{re.escape(slug)}":\s*\{{[\s\S]*?\}},?\n',
        re.M,
    )
    if slug_re.search(content):
        content = slug_re.sub(formatted, content, count=1)
    else:
        start = content.find(f"export const {block_name}")
        close_idx = content.index("};", content.index("> = {", start))
        content = content[:close_idx] + formatted + content[close_idx:]
    path.write_text(content, encoding="utf-8")


def load_brand_images() -> Dict[str, dict]:
    return parse_image_block(read_text(LIB / "brand-website-images.ts"), "BRAND_WEBSITE_IMAGES")


def get_brand_logo(website: str, brands: Dict[str, dict]) -> Optional[str]:
    try:
        host = urllib.parse.urlparse(website.strip()).netloc.lower()
        host = host[4:] if host.startswith("www.") else host
    except Exception:
        return None
    if host in brands:
        return brands[host].get("logo")
    for brand_host, data in brands.items():
        if host.endswith(f".{brand_host}"):
            return data.get("logo")
    return None


def load_all_data() -> Tuple[dict, dict, dict]:
    all_spas = {}
    all_images = {}
    slug_file = {}
    for fname in SEED_FILES:
        content = read_text(LIB / fname)
        spas = parse_spas(content)
        images = parse_image_block(content, IMAGE_BLOCK[fname])
        for slug, spa in spas.items():
            all_spas[slug] = spa
            slug_file[slug] = fname
        for slug, img in images.items():
            all_images[slug] = img
            if slug not in slug_file:
                slug_file[slug] = fname
    return all_spas, all_images, slug_file


def needs_fix(cats: List[str]) -> bool:
    fixable = {"missing-logo", "bad-logo", "http-logo", "broken-logo", "suspicious-favicon"}
    return any(c in fixable for c in cats)


def main():
    fix_mode = "--fix" in sys.argv
    all_spas, all_images, slug_file = load_all_data()
    brands = load_brand_images()

    audit = []
    for slug, spa in sorted(all_spas.items()):
        website = spa.get("website", "")
        images = all_images.get(slug)
        logo = images.get("logo") if images else None
        cats = categorize_logo(slug, logo, website)
        if logo and is_valid_website(website):
            check = check_url(logo if not logo.startswith("http://") else "https://" + logo.split("://", 1)[1])
            if not check["ok"]:
                cats = [c for c in cats if c != "ok"] + ["broken-logo"]
        audit.append({
            "slug": slug,
            "name": spa.get("name"),
            "website": website,
            "logo": logo,
            "categories": cats,
            "file": slug_file.get(slug),
            "has_images": bool(images),
        })

    with_website = [a for a in audit if is_valid_website(a["website"])]
    missing = [a for a in with_website if "missing-logo" in a["categories"]]
    bad = [a for a in with_website if "bad-logo" in a["categories"]]
    suspicious = [a for a in with_website if any(c.startswith("suspicious") for c in a["categories"])]
    ok = [a for a in with_website if "ok" in a["categories"]]
    problematic = [a for a in with_website if needs_fix(a["categories"]) or "broken-logo" in a["categories"]]

    report = {
        "total_providers": len(all_spas),
        "with_website": len(with_website),
        "ok": len(ok),
        "missing_logo": len(missing),
        "bad_logo": len(bad),
        "suspicious": len(suspicious),
        "problematic": len(problematic),
        "items": audit,
    }
    out_path = ROOT / "scripts" / "logo-audit-report.json"
    out_path.write_text(json.dumps(report, indent=2), encoding="utf-8")

    print(f"Audited {len(all_spas)} providers ({len(with_website)} with website)")
    print(f"  OK: {len(ok)}")
    print(f"  Missing logo: {len(missing)}")
    print(f"  Bad logo: {len(bad)}")
    print(f"  Suspicious: {len(suspicious)}")
    print(f"  Need fix: {len(problematic)}")

    if not fix_mode:
        print("\nTop issues:")
        for a in problematic[:40]:
            print(f"  {a['slug']}: {', '.join(a['categories'])}")
        if len(problematic) > 40:
            print(f"  ... and {len(problematic) - 40} more")
        print(f"\nWrote {out_path}")
        return

    fixed = []
    still_problematic = []

    def fix_one(item):
        slug = item["slug"]
        website = item["website"]
        fname = item["file"]
        if not fname or not is_valid_website(website):
            return None
        images = all_images.get(slug)
        if not images:
            images = {
                "hero": "",
                "gallery": [],
                "source": f"{item['name']} official website — services",
            }
        else:
            images = dict(images)
        existing = images.get("logo")
        cats = item["categories"]

        if (
            existing
            and not is_partner_badge(existing)
            and "bad-logo" not in cats
            and "broken-logo" not in cats
            and "suspicious-favicon" not in cats
            and not existing.startswith("http://")
        ):
            if check_url(existing)["ok"]:
                return None

        brand_logo = get_brand_logo(website, brands)
        if brand_logo and not is_partner_badge(brand_logo) and not FAVICON_ONLY_RE.search(brand_logo):
            if check_url(brand_logo)["ok"] and existing != brand_logo:
                images["logo"] = brand_logo
                write_image_entry(fname, slug, images)
                return {"slug": slug, "logo": brand_logo, "source": "brand"}

        new_logo = fetch_site_logo(website)
        if not new_logo:
            return {"slug": slug, "reason": "could-not-fetch"}

        if existing == new_logo:
            return None

        images["logo"] = new_logo
        write_image_entry(fname, slug, images)
        return {"slug": slug, "logo": new_logo}

    to_fix = problematic
    print(f"\nFixing {len(to_fix)} providers...")
    with ThreadPoolExecutor(max_workers=6) as ex:
        futures = {ex.submit(fix_one, item): item for item in to_fix}
        for fut in as_completed(futures):
            item = futures[fut]
            try:
                result = fut.result()
                if result and "logo" in result:
                    fixed.append(result)
                    print(f"  Fixed {result['slug']}")
                elif result:
                    still_problematic.append(result)
            except Exception as e:
                still_problematic.append({"slug": item["slug"], "reason": str(e)})

    # Fix http:// logos to https:// where possible
    for item in audit:
        logo = item.get("logo")
        if logo and logo.startswith("http://"):
            https_logo = "https://" + logo.split("://", 1)[1]
            if check_url(https_logo)["ok"]:
                images = all_images.get(item["slug"])
                fname = item.get("file")
                if images and fname:
                    images = dict(images)
                    images["logo"] = https_logo
                    write_image_entry(fname, item["slug"], images)
                    fixed.append({"slug": item["slug"], "logo": https_logo, "note": "http-to-https"})
                    print(f"  HTTPS fix {item['slug']}")

    fix_report = {
        "fixed_count": len(fixed),
        "still_problematic_count": len(still_problematic),
        "fixed": fixed,
        "still_problematic": still_problematic,
    }
    (ROOT / "scripts" / "logo-fix-report.json").write_text(json.dumps(fix_report, indent=2), encoding="utf-8")
    print(f"\nFixed {len(fixed)} logos; {len(still_problematic)} still problematic")


if __name__ == "__main__":
    main()
