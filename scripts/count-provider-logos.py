#!/usr/bin/env python3
"""Count provider logo coverage through the lib/data.ts pipeline (getSpaImages simulation)."""
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
LIB = ROOT / "lib"

SEED_FILES_ORDER = [
    "florida-real-spas.ts",
    "florida-coastal-real-spas.ts",
    "tampa-bay-real-spas.ts",
    "miami-metro-real-spas.ts",
    "nationwide-real-spas.ts",
]

IMAGE_BLOCKS = {
    "florida-real-spas.ts": "FLORIDA_REAL_SPA_IMAGES",
    "florida-coastal-real-spas.ts": "FLORIDA_COASTAL_REAL_SPA_IMAGES",
    "tampa-bay-real-spas.ts": "TAMPA_BAY_REAL_SPA_IMAGES",
    "miami-metro-real-spas.ts": "MIAMI_METRO_REAL_SPA_IMAGES",
    "nationwide-real-spas.ts": "NATIONWIDE_REAL_SPA_IMAGES",
    "website-fetched-spa-images.ts": "WEBSITE_FETCHED_SPA_IMAGES",
}

PARTNER_BADGE_RE = re.compile(
    r"alle[-+]|allergan|galderma|cobrand|proud[-_]?member|member[-_]?logo|fb-icon|"
    r"cropped-diamond|diamond\d|care[-_]?credit|synchrony|spacc_|tec-logo|medspascout",
    re.I,
)
PLACEHOLDER_WEBSITE_RE = re.compile(
    r"slug\.com|example\.com|placeholder|yourwebsite|domain\.com|pending\.com", re.I
)


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def parse_spas(content: str) -> Dict[str, dict]:
    spas = {}
    for m in re.finditer(r'slug:\s*"([^"]+)"[\s\S]*?website:\s*"([^"]*)"', content):
        slug, website = m.group(1), m.group(2)
        block = m.group(0)
        name_m = re.search(r'name:\s*"([^"]+)"', block)
        spas[slug] = {
            "slug": slug,
            "website": website,
            "name": name_m.group(1) if name_m else slug,
        }
    return spas


def parse_object_block(content: str, block_name: str) -> Dict[str, dict]:
    start = content.find(f"export const {block_name}")
    if start < 0:
        return {}
    type_end = content.find("> = {", start)
    if type_end < 0:
        type_end = content.find("= {", start)
    if type_end < 0:
        return {}
    obj_start = content.index("{", type_end)
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


def parse_spa_image_sets(content: str) -> Dict[str, dict]:
    start = content.find("export const SPA_IMAGE_SETS")
    if start < 0:
        return {}
    obj_start = content.index("{", start)
    depth = 0
    obj_end = None
    for i in range(obj_start, len(content)):
        if content[i] == "{":
            depth += 1
        elif content[i] == "}":
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


def parse_brand_images(content: str) -> Dict[str, dict]:
    block = parse_object_block(content, "BRAND_WEBSITE_IMAGES")
    return {host: data for host, data in block.items()}


def hostname_from_website(website: str) -> Optional[str]:
    if not website or not website.strip():
        return None
    try:
        host = urlparse(website.strip()).netloc.lower()
        return host[4:] if host.startswith("www.") else host
    except Exception:
        return None


def get_brand_images(website: str, brands: Dict[str, dict]) -> Optional[dict]:
    host = hostname_from_website(website)
    if not host:
        return None
    if host in brands:
        return brands[host]
    for brand_host, images in brands.items():
        if host.endswith(f".{brand_host}"):
            return images
    return None


def is_valid_website(website: str) -> bool:
    if not website or not website.strip() or PLACEHOLDER_WEBSITE_RE.search(website):
        return False
    try:
        p = urlparse(website.strip())
        return p.scheme in ("http", "https") and bool(p.netloc)
    except Exception:
        return False


def is_partner_badge(url: Optional[str]) -> bool:
    return bool(url and PARTNER_BADGE_RE.search(url))


def is_stock_url(url: str) -> bool:
    lower = url.lower()
    return (
        "images.unsplash.com" in lower
        or re.search(r"[-_/]unsplash[-_.]", lower)
        or re.search(r"unsplash-image", lower)
        or re.search(r"placeholder\.png", lower)
    )


def is_weak_logo(url: Optional[str]) -> bool:
    if not url:
        return True
    favicon_re = re.compile(r"favicon|site-icon|siteicon|webclip|apple-touch-icon|android-chrome|cropped-\d", re.I)
    og_re = re.compile(r"og[-_](?:feat|image|default)|social/og|open[-_]?graph", re.I)
    logo_url_re = re.compile(
        r"(?:^|[/_-])logo(?:[._-]|$)|[-_]logo[-_.]|logo[-_]?(?:white|dark|mark|icon|full|primary|secondary)|(?:^|[/_-])brand(?:[._-]|$)",
        re.I,
    )
    if is_partner_badge(url):
        return True
    if favicon_re.search(url) and not logo_url_re.search(url):
        return True
    if og_re.search(url) and not logo_url_re.search(url):
        return True
    return False


def resolve_provider_logo(entry_logo: Optional[str], brand_logo: Optional[str]) -> Optional[str]:
    entry_ok = entry_logo and not is_weak_logo(entry_logo)
    brand_ok = brand_logo and not is_weak_logo(brand_logo)
    if entry_ok:
        return entry_logo
    if brand_ok:
        return brand_logo
    if entry_logo and not is_partner_badge(entry_logo):
        return entry_logo
    if brand_logo and not is_partner_badge(brand_logo):
        return brand_logo
    return None


def get_spa_images(slug: str, website: str, spa_sets: Dict[str, dict], brands: Dict[str, dict]) -> dict:
    brand = get_brand_images(website, brands)
    entry = spa_sets.get(slug)
    if entry:
        gallery = [u for u in entry.get("gallery", []) if u and not is_stock_url(u)]
        hero = entry.get("hero", "")
        if hero and is_stock_url(hero):
            hero = next((u for u in gallery if not is_stock_url(u)), "")
        logo = resolve_provider_logo(entry.get("logo"), brand.get("logo") if brand else None)
        if hero or gallery or logo:
            return {"hero": hero, "gallery": gallery, "source": entry.get("source", ""), "logo": logo}
    if brand:
        logo = resolve_provider_logo(None, brand.get("logo"))
        return {
            "hero": brand.get("hero", ""),
            "gallery": brand.get("gallery", []),
            "source": f"{brand.get('source', '')} — brand imagery",
            "logo": logo,
        }
    return {"hero": "", "gallery": [], "source": "Verity placeholder — pending spa upload", "logo": None}


def build_spa_image_sets() -> Dict[str, dict]:
    spa_images_content = read_text(LIB / "spa-images.ts")
    sets = parse_spa_image_sets(spa_images_content)

    for fname, block_name in IMAGE_BLOCKS.items():
        content = read_text(LIB / fname)
        for slug, images in parse_object_block(content, block_name).items():
            sets[slug] = images

    nationwide_content = read_text(LIB / "nationwide-real-spas.ts")
    nationwide = parse_object_block(nationwide_content, "NATIONWIDE_REAL_SPA_IMAGES")
    fallbacks_m = re.search(
        r"export const NATIONWIDE_SPA_IMAGE_FALLBACKS[^=]*=\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}",
        nationwide_content,
        re.S,
    )
    fallbacks = {}
    if fallbacks_m:
        for m in re.finditer(r'"([^"]+)":\s*"([^"]+)"', fallbacks_m.group(1)):
            fallbacks[m.group(1)] = m.group(2)

    nationwide_slugs = set(nationwide.keys())
    for slug in fallbacks:
        if slug not in sets:
            if slug in nationwide_slugs:
                logo = nationwide.get(slug, {}).get("logo")
                sets[slug] = {
                    "hero": "",
                    "gallery": [],
                    "source": "Verity placeholder — pending business photo upload",
                    **({"logo": logo} if logo else {}),
                }

    for slug, images in nationwide.items():
        if images.get("hero") or images.get("logo"):
            sets[slug] = images

    return sets


def load_all_spas() -> Dict[str, dict]:
    by_slug = {}
    for fname in SEED_FILES_ORDER:
        spas = parse_spas(read_text(LIB / fname))
        for slug, spa in spas.items():
            if slug not in by_slug:
                by_slug[slug] = spa
    return by_slug


def classify_missing(
    slug: str, spa: dict, images: dict, spa_sets: Dict[str, dict], brands: Dict[str, dict]
) -> str:
    website = spa.get("website", "")
    entry = spa_sets.get(slug)
    brand = get_brand_images(website, brands)

    if not is_valid_website(website):
        return "no-valid-website"

    if entry and entry.get("logo"):
        if is_partner_badge(entry["logo"]):
            return "bad-logo-partner-badge"
        return "has-direct-logo-but-dropped"

    if brand and brand.get("logo"):
        return "brand-missing-inheritance"

    if not entry:
        return "no-image-entry"

    if entry and not entry.get("hero") and not entry.get("gallery"):
        if entry.get("logo") is None:
            return "logo-only-entry-missing"

    if brand and not brand.get("logo"):
        return "brand-missing-logo"

    return "fetch-needed"


def main():
    spas = load_all_spas()
    spa_sets = build_spa_image_sets()
    brands = parse_brand_images(read_text(LIB / "brand-website-images.ts"))

    results = []
    for slug, spa in sorted(spas.items()):
        website = spa.get("website", "")
        images = get_spa_images(slug, website, spa_sets, brands)
        logo = images.get("logo")
        if logo and is_partner_badge(logo):
            logo = None
        results.append(
            {
                "slug": slug,
                "name": spa.get("name"),
                "website": website,
                "logo": logo,
                "has_valid_website": is_valid_website(website),
                "resolved_logo": bool(logo),
            }
        )

    total = len(results)
    with_valid_website = [r for r in results if r["has_valid_website"]]
    with_logo = [r for r in results if r["resolved_logo"]]
    without_logo = [r for r in results if not r["resolved_logo"]]
    with_website_no_logo = [r for r in with_valid_website if not r["resolved_logo"]]
    no_website = [r for r in results if not r["has_valid_website"]]

    missing_patterns = Counter(
        classify_missing(r["slug"], spas[r["slug"]], get_spa_images(r["slug"], r["website"], spa_sets, brands), spa_sets, brands)
        for r in with_website_no_logo
    )

    report = {
        "total_providers": total,
        "with_valid_website": len(with_valid_website),
        "with_logo": len(with_logo),
        "without_logo": len(without_logo),
        "with_website_no_logo": len(with_website_no_logo),
        "no_valid_website": len(no_website),
        "missing_patterns": dict(missing_patterns),
        "missing_with_website": [
            {
                "slug": r["slug"],
                "name": r["name"],
                "website": r["website"],
                "pattern": classify_missing(
                    r["slug"], spas[r["slug"]], get_spa_images(r["slug"], r["website"], spa_sets, brands), spa_sets, brands
                ),
            }
            for r in with_website_no_logo
        ],
    }

    out = ROOT / "scripts" / "logo-coverage-report.json"
    out.write_text(json.dumps(report, indent=2), encoding="utf-8")

    print("=== Provider Logo Coverage (data.ts pipeline) ===")
    print(f"Total providers:           {total}")
    print(f"With valid website:        {len(with_valid_website)}")
    print(f"With logo (resolved):      {len(with_logo)}")
    print(f"Without logo:              {len(without_logo)}")
    print(f"With website, no logo:     {len(with_website_no_logo)}")
    print(f"No valid website:          {len(no_website)}")
    print("\nMissing logo patterns (providers with website):")
    for pattern, count in missing_patterns.most_common():
        print(f"  {pattern}: {count}")
    print(f"\nWrote {out}")

    if "--json" in sys.argv:
        print(json.dumps({k: v for k, v in report.items() if k != "missing_with_website"}, indent=2))


if __name__ == "__main__":
    main()
