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
    tuple(sorted(["botox", "fillers", "laser", "facial"])),
    tuple(sorted(["botox", "fillers", "laser", "facial", "microneedling"])),
}

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
]


@dataclass
class ProviderBlock:
    slug: str
    start: int
    end: int
    text: str
    name: str = ""
    description: str = ""
    tagline: str = ""
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


def infer_treatments(name: str, description: str, tagline: str, highlights: list[str]) -> list[str]:
    blob = " ".join([name, description, tagline, " ".join(highlights)]).lower()
    treatments: set[str] = set()

    if re.search(
        r"milan laser|laser hair removal clinic|laser hair removal specialist|laser removal clinic",
        blob,
    ):
        return ["laser"]

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
        r"\blaser|\bipl\b|\bbbl\b|\bhalo\b|\bresurfacing|\bhair removal|\bphotofacial|\bfraxel|\bmoxi\b|\butherapy\b|\bsofwave|\bcosmetic laser|\blaser suite|\blaser treatment",
        blob,
    ):
        treatments.add("laser")

    if re.search(
        r"\bfacial|\bhydrafacial|\bchemical peel|\bpeel\b|\bskin rejuvenation|\bdermaplaning|\bmicrodermabrasion|\bmedical-grade facial|\bmedical facial|\bmedical-grade skincare",
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

    if re.search(
        r"weight loss|semaglutide|tirzepatide|glp-?1|ozempic|wegovy|mounjaro|phentermine|medical weight loss|weight management",
        blob,
    ):
        treatments.add("weight-loss")

    if re.search(
        r"hormone therapy|hormone replacement|\bbhrt\b|testosterone|bioidentical hormone|\bhrt\b|hormone optimization|hormone pellet",
        blob,
    ):
        treatments.add("hormone-therapy")

    if (
        re.search(
            r"hair restoration|hair transplant|prp hair|hair loss treatment|neograft|\bartas\b|follicular unit|hair regrowth",
            blob,
        )
        and "hair removal" not in blob
    ):
        treatments.add("hair-restoration")

    if re.search(
        r"\bwellness\b|iv therapy|vitamin drip|\bnad\+|\bnad therapy|peptide therapy|functional medicine|vitamin injection|iv drip|wellness program",
        blob,
    ):
        treatments.add("wellness")

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
    if "weight-loss" in treatments:
        cats.append("weight-loss")
    if "hormone-therapy" in treatments:
        cats.append("hormone-therapy")
    if "hair-restoration" in treatments:
        cats.append("hair-restoration")
    return cats


def format_treatments(treatments: list[str]) -> str:
    quoted = ", ".join(f'"{t}"' for t in treatments)
    return f"treatments: [{quoted}]"


def find_provider_blocks(content: str) -> list[ProviderBlock]:
    blocks: list[ProviderBlock] = []
    slug_iter = list(re.finditer(r'slug:\s*"([^"]+)"', content))
    for index, slug_match in enumerate(slug_iter):
        slug = slug_match.group(1)
        start = slug_match.start()
        end = slug_iter[index + 1].start() if index + 1 < len(slug_iter) else len(content)

        # Expand backward to include seed({ or opening brace for this object.
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
                highlights=parse_highlights(block_text),
                treatments=parse_treatments(block_text),
            )
        )
    return blocks


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


def process_file(path: Path) -> tuple[str, list[dict]]:
    content = path.read_text()
    blocks = find_provider_blocks(content)
    changes: list[dict] = []
    updated = content

    # Process from end to start so offsets stay valid.
    for block in reversed(blocks):
        inferred = infer_treatments(block.name, block.description, block.tagline, block.highlights)
        old = block.treatments or []
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

        if old_sorted != new_sorted:
            new_block = upsert_treatments(block.text, inferred)
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
        "sample_updates": updated[:20],
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
