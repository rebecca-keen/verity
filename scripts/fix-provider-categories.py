#!/usr/bin/env python3
"""Audit and fix provider treatment/category assignments in *-real-spas.ts seed files."""
from __future__ import annotations

import json
import re
from collections import Counter
from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SEED_FILES = sorted(ROOT.glob("lib/*-real-spas.ts"))
REPORT_PATH = ROOT / "scripts" / "category-fix-report.json"

GENERIC_LISTS = {
    tuple(sorted(["botox", "laser", "facial"])),
    tuple(sorted(["botox", "fillers", "laser", "facial"])),
    tuple(sorted(["botox", "fillers", "laser", "facial", "microneedling"])),
}

BOILERPLATE_DESCRIPTION_RE = re.compile(
    r"is a verified med spa in .+ offering medical-grade injectables, laser, and skin rejuvenation",
    re.I,
)

LASER_ONLY_NAME_RE = re.compile(
    r"milan laser|perfectly bare|ideal image|laser away|laser.?hub|smooth\s+laser|body\s+detail\s+laser|"
    r"clean\s+slate\s+laser|laser\s+clinic|laser\s+center|laser\s+hair\s+removal|laser\s+&?\s*skin\s+center|"
    r"cosmetic\s+laser\s+center|laser\s+med\s+spa(?!.*inject)|bare\s+laser",
    re.I,
)

TREATMENT_ORDER = [
    "botox",
    "fillers",
    "laser",
    "facial",
    "microneedling",
    "body-contouring",
    "weight-loss",
    "hormone-therapy",
    "hair-restoration",
    "wellness",
    "iv-therapy",
    "mens-health",
    "womens-health",
]

CATEGORY_ORDER = [
    "injectables",
    "lasers",
    "beauty",
    "body",
    "wellness",
    "iv-therapy",
    "weight-loss",
    "hormone-therapy",
    "mens-health",
    "womens-health",
    "hair-restoration",
]

VERIFIED_COPY_OVERRIDES: dict[str, dict[str, str]] = {
    "padgett-medical-center-tampa": {
        "tagline": "Medical weight loss, hormone therapy, and aesthetics in Tampa.",
        "description": (
            "Padgett Medical Center Tampa offers physician-supervised medical weight loss with compounded "
            "Semaglutide and Tirzepatide, hormone replacement and testosterone therapy (HRT/TRT), NAD+ wellness "
            "treatments, and med-spa aesthetics including Botox, dermal fillers, laser treatments, and facial "
            "rejuvenation. Google rating 4.9 from 981 reviews."
        ),
        "treatments": [
            "botox",
            "fillers",
            "laser",
            "facial",
            "weight-loss",
            "hormone-therapy",
            "wellness",
            "iv-therapy",
            "mens-health",
            "womens-health",
        ],
    },
}


@dataclass
class ProviderBlock:
    slug: str
    start: int
    end: int
    text: str
    name: str = ""
    description: str = ""
    tagline: str = ""
    website: str = ""
    highlights: list[str] = field(default_factory=list)
    treatments: list[str] | None = None


def parse_string_field(block: str, field: str) -> str:
    match = re.search(rf'{field}:\s*"((?:\\.|[^"\\])*)"', block, re.S)
    return match.group(1).replace('\\"', '"') if match else ""


def parse_treatments(block: str) -> list[str] | None:
    match = re.search(r"treatments:\s*\[(.*?)\]", block, re.S)
    if not match:
        return None
    return re.findall(r'"([^"]+)"', match.group(1))


def parse_highlights(block: str) -> list[str]:
    match = re.search(r"highlights:\s*\[(.*?)\]", block, re.S)
    if not match:
        return []
    return re.findall(r'"((?:\\.|[^"\\])*)"', match.group(1))


def is_generic_treatments(treatments: list[str]) -> bool:
    return tuple(sorted(treatments)) in GENERIC_LISTS


def is_boilerplate_description(description: str) -> bool:
    return bool(BOILERPLATE_DESCRIPTION_RE.search(description))


def infer_treatments(
    name: str,
    description: str,
    tagline: str,
    website: str,
    highlights: list[str],
) -> list[str]:
    if "padgett medical" in f"{name} {website}".lower():
        return list(VERIFIED_COPY_OVERRIDES["padgett-medical-center-tampa"]["treatments"])

    is_boilerplate = is_boilerplate_description(description)
    effective_description = "" if is_boilerplate else description
    blob = " ".join([effective_description, tagline, name, website, " ".join(highlights)]).lower()
    treatments: set[str] = set()

    if (
        re.search(
            r"milan laser|laser hair removal clinic|laser hair removal specialist|laser removal clinic",
            blob,
        )
        or (
            LASER_ONLY_NAME_RE.search(f"{name} {website}")
            and not re.search(r"\bbotox\b|\bfiller|\binject|med\s+spa.*aesthetic|dermal filler", blob)
        )
    ):
        return ["laser"]

    if re.search(
        r"weight\s*loss|semaglutide|tirzepatide|glp-?1|ozempic|wegovy|mounjaro|phentermine|bariatric",
        blob,
    ):
        treatments.add("weight-loss")

    if re.search(
        r"testosterone therapy|\btrt\b|low testosterone|andropause|men'?s health|male hormone|testosterone replacement",
        blob,
    ):
        treatments.add("mens-health")
        treatments.add("hormone-therapy")

    if re.search(
        r"women'?s health|women'?s hormone|menopause|perimenopause|bio-identical hormone.*women|bioidentical.*women|gynecolog",
        blob,
    ):
        treatments.add("womens-health")
        treatments.add("hormone-therapy")

    if re.search(
        r"hormone therapy|hormone replacement|\bbhrt\b|testosterone|bioidentical hormone|\bhrt\b|hormone optimization|hormone pellet",
        blob,
    ):
        treatments.add("hormone-therapy")

    if re.search(
        r"iv therapy|vitamin drip|iv drip|hydration drip|myers cocktail|vitamin infusion|mobile iv|iv lounge|iv bar|iv hydration",
        blob,
    ):
        treatments.add("iv-therapy")

    if re.search(
        r"\bwellness\b|peptide therapy|functional medicine|vitamin injection|wellness program|\bnad\+|\bnad therapy",
        blob,
    ):
        treatments.add("wellness")

    if re.search(r"medical center|medical clinic|health center|wellness center|total wellness", blob):
        treatments.add("weight-loss")
        treatments.add("hormone-therapy")
        treatments.add("wellness")

    if re.search(
        r"\bbotox\b|\bdysport\b|\bxeomin\b|\bjeuveau\b|\binjectable|\bneurotoxin|\bfiller|\bjuvederm\b|\brestylane\b|\bsculptra\b|\bkybella\b|\bdermal filler|\blip filler|\bcheek filler|\bradiesse\b",
        blob,
    ):
        if re.search(r"\bbotox\b|\bdysport\b|\bxeomin\b|\bjeuveau\b|\binjectable|\bneurotoxin", blob):
            treatments.add("botox")
        if re.search(
            r"\bfiller|\bjuvederm\b|\brestylane\b|\bsculptra\b|\bkybella\b|\bdermal filler|\blip filler|\bcheek filler|\bradiesse\b",
            blob,
        ):
            treatments.add("fillers")
        if not treatments & {"botox", "fillers"}:
            treatments.update(["botox", "fillers"])

    if re.search(
        r"\blaser|\bipl\b|\bbbl\b|\bhalo\b|\bresurfacing|\bhair removal|\bphotofacial|\bfraxel|\bmoxi\b|\butherapy\b|\bsofwave|\bcosmetic laser|\blaser treatment|\baesthetics\s*&?\s*med-?spa",
        blob,
    ):
        treatments.add("laser")

    if re.search(
        r"\bfacial|\bhydrafacial|\bchemical peel|\bpeel\b|\bskin rejuvenation|\bdermaplaning|\bmicrodermabrasion|\bmedical-grade facial|\bmedical facial|\bmedical-grade skincare|\bmed-?spa aesthetic|\bfacial rejuvenation|\bacne treatments?|\bfine-line|\bsun-damage|\btherapeutic facial",
        blob,
    ):
        treatments.add("facial")

    if re.search(
        r"\bmicroneedling|\brf microneedling|\bmorpheus8|\bprp facial|\bcollagen induction|\bsylfirm|\bpotenza\b",
        blob,
    ):
        treatments.add("microneedling")

    if re.search(
        r"\bbody contour|\bcoolsculpt|\bemsculpt|\bbody sculpt|\bcellulite|\bcooltone|\btru sculpt|\bemsella|\bnon-surgical body|\bbody treatment|\bbody contouring|\bskin tightening",
        blob,
    ):
        treatments.add("body-contouring")

    if (
        re.search(
            r"hair restoration|hair transplant|prp hair|hair loss treatment|neograft|\bartas\b|follicular unit|hair regrowth",
            blob,
        )
        and "hair removal" not in blob
    ):
        treatments.add("hair-restoration")

    if not treatments:
        if re.search(r"med\s*spa|medspa|aesthetic|cosmetic center|beauty lab|\binject", blob):
            treatments.update(["botox", "fillers", "laser", "facial"])
        elif re.search(r"wellness|day spa|massage|skincare|skin care|facial spa", blob):
            treatments.update(["facial", "wellness"])

    return [t for t in TREATMENT_ORDER if t in treatments]


def derive_categories(treatments: list[str]) -> list[str]:
    cats: list[str] = []
    if any(t in treatments for t in ("botox", "fillers")):
        cats.append("injectables")
    if "laser" in treatments:
        cats.append("lasers")
    if any(t in treatments for t in ("facial", "microneedling")):
        cats.append("beauty")
    if "body-contouring" in treatments:
        cats.append("body")
    if "wellness" in treatments:
        cats.append("wellness")
    if "iv-therapy" in treatments:
        cats.append("iv-therapy")
    if "weight-loss" in treatments:
        cats.append("weight-loss")
    if "hormone-therapy" in treatments:
        cats.append("hormone-therapy")
    if "mens-health" in treatments:
        cats.append("mens-health")
    if "womens-health" in treatments:
        cats.append("womens-health")
    if "hair-restoration" in treatments:
        cats.append("hair-restoration")
    return [c for c in CATEGORY_ORDER if c in cats]


def format_treatments(treatments: list[str]) -> str:
    quoted = ", ".join(f'"{t}"' for t in treatments)
    return f"treatments: [{quoted}]"


def upsert_string_field(block_text: str, field: str, value: str) -> str:
    escaped = value.replace("\\", "\\\\").replace('"', '\\"')
    pattern = rf'{field}:\s*"((?:\\.|[^"\\])*)"'
    if re.search(pattern, block_text):
        return re.sub(pattern, f'{field}: "{escaped}"', block_text, count=1)
    return block_text


def upsert_treatments(block_text: str, treatments: list[str]) -> str:
    formatted = format_treatments(treatments)
    if re.search(r"treatments:\s*\[", block_text):
        return re.sub(r"treatments:\s*\[[^\]]*\]", formatted, block_text, count=1)
    insert_after = re.search(r"yearsOpen:\s*\d+,?\n", block_text)
    if insert_after:
        pos = insert_after.end()
        return block_text[:pos] + f"    {formatted},\n" + block_text[pos:]
    insert_after = re.search(r"reviewCount:\s*\d+,?\n", block_text)
    if insert_after:
        pos = insert_after.end()
        return block_text[:pos] + f"    {formatted},\n" + block_text[pos:]
    return block_text


def find_provider_blocks(content: str) -> list[ProviderBlock]:
    blocks: list[ProviderBlock] = []
    slug_iter = list(re.finditer(r'slug:\s*"([^"]+)"', content))
    for index, slug_match in enumerate(slug_iter):
        slug = slug_match.group(1)
        start = slug_match.start()
        end = slug_iter[index + 1].start() if index + 1 < len(slug_iter) else len(content)

        prefix = content[max(0, start - 400) : start]
        seed_start = prefix.rfind("seed({")
        object_start = prefix.rfind("\n  {")
        block_start = start
        if seed_start != -1 and (object_start == -1 or seed_start > object_start):
            block_start = max(0, start - 400) + seed_start
        elif object_start != -1:
            block_start = max(0, start - 400) + object_start + 1

        block_text = content[block_start:end]
        blocks.append(
            ProviderBlock(
                slug=slug,
                start=block_start,
                end=end,
                text=block_text,
                name=parse_string_field(block_text, "name"),
                description=parse_string_field(block_text, "description"),
                tagline=parse_string_field(block_text, "tagline"),
                website=parse_string_field(block_text, "website"),
                highlights=parse_highlights(block_text),
                treatments=parse_treatments(block_text),
            )
        )
    return blocks


def apply_verified_copy(block: ProviderBlock) -> tuple[list[str], str]:
    override = VERIFIED_COPY_OVERRIDES.get(block.slug)
    if not override:
        return block.treatments or [], block.text

    new_block = block.text
    if "tagline" in override:
        new_block = upsert_string_field(new_block, "tagline", override["tagline"])
    if "description" in override:
        new_block = upsert_string_field(new_block, "description", override["description"])
    treatments = override.get("treatments") or infer_treatments(
        block.name, override.get("description", block.description), override.get("tagline", block.tagline), block.website, block.highlights
    )
    new_block = upsert_treatments(new_block, treatments)
    return treatments, new_block


def process_file(path: Path) -> tuple[str, list[dict]]:
    content = path.read_text()
    blocks = find_provider_blocks(content)
    changes: list[dict] = []
    updated = content

    for block in reversed(blocks):
        old = block.treatments or []

        if block.slug in VERIFIED_COPY_OVERRIDES:
            inferred, new_block = apply_verified_copy(block)
        else:
            inferred = infer_treatments(
                block.name, block.description, block.tagline, block.website, block.highlights
            )
            new_block = block.text
            should_update = (
                inferred
                and (
                    tuple(sorted(old)) != tuple(sorted(inferred))
                    or is_generic_treatments(old)
                    or is_boilerplate_description(block.description)
                )
            )
            if should_update:
                new_block = upsert_treatments(new_block, inferred)

        old_sorted = tuple(sorted(old))
        new_sorted = tuple(sorted(inferred))

        if not inferred:
            changes.append(
                {
                    "slug": block.slug,
                    "file": path.name,
                    "status": "manual_review",
                    "old_treatments": old,
                    "new_treatments": inferred,
                    "categories": [],
                    "description": block.description[:160],
                }
            )
            continue

        if old_sorted != new_sorted or new_block != block.text:
            updated = updated[: block.start] + new_block + updated[block.end :]
            changes.append(
                {
                    "slug": block.slug,
                    "file": path.name,
                    "status": "updated",
                    "old_treatments": old,
                    "new_treatments": inferred,
                    "categories": derive_categories(inferred),
                }
            )
        else:
            changes.append(
                {
                    "slug": block.slug,
                    "file": path.name,
                    "status": "unchanged",
                    "old_treatments": old,
                    "new_treatments": inferred,
                    "categories": derive_categories(inferred),
                }
            )

    if updated != content:
        path.write_text(updated)
    return updated, list(reversed(changes))


def main() -> None:
    all_changes: list[dict] = []
    for path in SEED_FILES:
        _, changes = process_file(path)
        all_changes.extend(changes)

    updated = [c for c in all_changes if c["status"] == "updated"]
    manual = [c for c in all_changes if c["status"] == "manual_review"]
    category_counts = Counter(cat for c in all_changes for cat in c.get("categories", []))

    report = {
        "total_providers": len(all_changes),
        "updated": len(updated),
        "unchanged": len(all_changes) - len(updated) - len(manual),
        "manual_review": manual,
        "category_counts": dict(category_counts),
        "sample_updates": updated[:25],
    }
    REPORT_PATH.write_text(json.dumps(report, indent=2))

    print(f"Total providers: {report['total_providers']}")
    print(f"Updated: {report['updated']}")
    print(f"Unchanged: {report['unchanged']}")
    print(f"Manual review: {len(manual)}")
    print("Category counts:", report["category_counts"])
    print(f"Report: {REPORT_PATH}")


if __name__ == "__main__":
    main()
