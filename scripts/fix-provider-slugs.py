#!/usr/bin/env python3
"""Fix duplicate city segments in provider slugs and emit redirect map."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIB = ROOT / "lib"

FILES = [
    LIB / "nationwide-real-spas.ts",
    LIB / "tampa-bay-real-spas.ts",
    LIB / "miami-metro-real-spas.ts",
]

# Manual redirects where slugs were renamed beyond dedupe (Skin Laundry).
MANUAL_REDIRECTS: dict[str, str] = {
    "skin-laundry-los-los-angeles": "skin-laundry-manhattan-beach-los-angeles",
    "skin-laundry-los-los-angeles-2": "skin-laundry-pasadena-los-angeles",
    "skin-laundry-los-los-angeles-3": "skin-laundry-irvine",
    "skin-laundry-san-san-diego": "skin-laundry-downtown-san-diego",
    "skin-laundry-san-san-diego-2": "skin-laundry-la-jolla-san-diego",
    "skin-laundry-san-san-francisco": "skin-laundry-downtown-san-francisco",
    "skin-laundry-san-san-jose": "skin-laundry-willow-glen-san-jose",
    "skin-laundry-palo-palo-alto": "skin-laundry-downtown-palo-alto",
    "skin-laundry-walnut-walnut-creek": "skin-laundry-downtown-walnut-creek",
    "skin-laundry-scottsdale-scottsdale": "skin-laundry-old-town-scottsdale",
    "skin-laundry-dallas-dallas": "skin-laundry-uptown-dallas",
    "skin-laundry-houston-houston": "skin-laundry-galleria-houston",
    "skin-laundry-austin-austin": "skin-laundry-downtown-austin",
    "skin-laundry-chicago-chicago": "skin-laundry-river-north-chicago",
    "skin-laundry-new-new-york": "skin-laundry-flatiron-new-york",
    "skin-laundry-nyc-new-york": "skin-laundry-midtown-new-york",
    "skin-laundry-boston-boston": "skin-laundry-back-bay-boston",
    "skin-laundry-seattle-seattle": "skin-laundry-capitol-hill-seattle",
    "skin-laundry-denver-denver": "skin-laundry-lodo-denver",
    "skin-laundry-denver-denver-2": "skin-laundry-boulder",
    "skin-laundry-atlanta-atlanta": "skin-laundry-buckhead-atlanta",
    "skin-laundry-miami-miami": "skin-laundry-brickell-miami",
    "skin-laundry-nashville-nashville": "skin-laundry-gulch-nashville",
    "skin-laundry-charlotte-charlotte": "skin-laundry-southpark-charlotte",
    "skin-laundry-philadelphia-philadelphia": "skin-laundry-rittenhouse-philadelphia",
    "skin-laundry-washington-washington": "skin-laundry-georgetown-washington",
    "skin-laundry-washington-washington-2": "skin-laundry-bethesda",
    "skin-laundry-washington-washington-3": "skin-laundry-tysons",
    "skin-laundry-las-las-vegas": "skin-laundry-summerlin-las-vegas",
    "skin-laundry-portland-portland": "skin-laundry-pearl-district-portland",
    "skin-laundry-newport-newport-beach": "skin-laundry-fashion-island-newport-beach",
    "skin-laundry-bethesda-bethesda": "skin-laundry-bethesda",
    "skin-laundry-tysons-tysons": "skin-laundry-tysons",
    "skin-laundry-irvine-irvine": "skin-laundry-irvine",
    "skin-laundry-boulder-boulder": "skin-laundry-boulder",
}


def fix_slug(slug: str) -> str:
    parts = slug.split("-")
    changed = True
    while changed:
        changed = False
        if len(parts) >= 2 and parts[-1] == parts[-2]:
            parts = parts[:-1]
            changed = True
            continue
        for city_len in range(1, len(parts) // 2 + 1):
            city = parts[-city_len:]
            prev = parts[-2 * city_len : -city_len]
            if city == prev and len(parts) > 2 * city_len:
                parts = parts[:-city_len]
                changed = True
                break
    return "-".join(parts)


def replace_slug_keys(text: str, mapping: dict[str, str]) -> str:
    for old, new in sorted(mapping.items(), key=lambda x: -len(x[0])):
        text = text.replace(f'"{old}"', f'"{new}"')
        text = text.replace(f"slug: {old}", f"slug: {new}")  # noop safety
    return text


def main() -> None:
    auto_redirects: dict[str, str] = {}

    for path in FILES:
        if not path.exists():
            continue
        text = path.read_text()
        slugs = set(re.findall(r'slug:\s*"([^"]+)"', text))
        mapping = {s: fix_slug(s) for s in slugs if fix_slug(s) != s}
        if not mapping:
            continue
        auto_redirects.update(mapping)
        updated = replace_slug_keys(text, mapping)
        path.write_text(updated)
        print(f"{path.name}: fixed {len(mapping)} slugs")

    all_redirects = {**auto_redirects, **MANUAL_REDIRECTS}
    # Resolve chains: if key redirects to intermediate that's also redirected
    for _ in range(5):
        for old, new in list(all_redirects.items()):
            if new in all_redirects:
                all_redirects[old] = all_redirects[new]

    out = ROOT / "lib" / "provider-slug-redirects.ts"
    lines = [
        "/** Legacy provider slugs → canonical slugs (301 via next.config). Auto-generated; do not edit by hand. */",
        "export const PROVIDER_SLUG_REDIRECTS: ReadonlyArray<readonly [string, string]> = [",
    ]
    for old, new in sorted(all_redirects.items()):
        lines.append(f'  ["{old}", "{new}"],')
    lines.append("];")
    lines.append("")
    out.write_text("\n".join(lines))
    print(f"Wrote {len(all_redirects)} redirects to {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
