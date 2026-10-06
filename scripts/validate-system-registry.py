#!/usr/bin/env python3
"""Fail-closed validation for the XPeX public system registry."""

from __future__ import annotations
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
INDEX = ROOT / "data/company/system-index-v1.json"

errors: list[str] = []

def load_json(path: pathlib.Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        errors.append(f"invalid JSON {path.relative_to(ROOT)}: {exc}")
        return {}

if not INDEX.exists():
    errors.append("missing data/company/system-index-v1.json")
    index = {}
else:
    index = load_json(INDEX)

seen_ids: set[str] = set()
seen_slugs: set[str] = set()

for item in index.get("systems", []):
    sid = item.get("system_id")
    slug = item.get("slug")
    if not sid:
        errors.append("system index entry missing system_id")
        continue
    if sid in seen_ids:
        errors.append(f"duplicate system_id: {sid}")
    seen_ids.add(sid)

    if not slug:
        errors.append(f"{sid}: missing slug")
        continue
    if slug in seen_slugs:
        errors.append(f"duplicate slug: {slug}")
    seen_slugs.add(slug)

    pack = item.get("system_pack")
    if pack:
        pack_dir = ROOT / pack
        card_path = pack_dir / "system-card.json"
        readme_path = pack_dir / "README.md"
        if not card_path.exists():
            errors.append(f"{sid}: missing system card: {card_path.relative_to(ROOT)}")
            continue
        if not readme_path.exists():
            errors.append(f"{sid}: missing system README: {readme_path.relative_to(ROOT)}")

        card = load_json(card_path)
        if card.get("system_id") != sid:
            errors.append(f"{sid}: index/card system_id mismatch")
        if card.get("product_id") != slug:
            errors.append(f"{sid}: index slug/card product_id mismatch")

        runtime_status = card.get("runtime_status")
        if runtime_status == "VERIFIED_LIVE":
            source = card.get("source") or {}
            runtime = card.get("runtime") or {}
            evidence = card.get("evidence") or []
            if source.get("verification_status") not in {"VERIFIED","VERIFIED_REPOSITORY"}:
                errors.append(f"{sid}: VERIFIED_LIVE without verified source")
            if runtime.get("state_at_verification") not in {"READY","SUCCESS"}:
                errors.append(f"{sid}: VERIFIED_LIVE without ready/success runtime state")
            if not runtime.get("deployment_id"):
                errors.append(f"{sid}: VERIFIED_LIVE missing deployment_id")
            if not evidence:
                errors.append(f"{sid}: VERIFIED_LIVE missing evidence list")

        for rel in card.get("evidence", []):
            ep = pack_dir / rel
            if not ep.exists():
                errors.append(f"{sid}: referenced evidence missing: {ep.relative_to(ROOT)}")
                continue
            ev = load_json(ep)
            if ev.get("system_id") != sid:
                errors.append(f"{sid}: evidence system_id mismatch in {ep.relative_to(ROOT)}")
            if ev.get("public_safe") is not True:
                errors.append(f"{sid}: public system pack references evidence not marked public_safe: {ep.relative_to(ROOT)}")

        # Prevent secret material from being stored in public evidence files.
        for ep in (pack_dir / "evidence").glob("*.json") if (pack_dir / "evidence").exists() else []:
            raw = ep.read_text(encoding="utf-8").lower()
            for token in ["private_key", "service_role_key", "client_secret", "access_token", "refresh_token"]:
                if token in raw:
                    errors.append(f"{sid}: possible secret-bearing field in public evidence: {ep.relative_to(ROOT)} ({token})")

truth = index.get("truth") or {}
systems = index.get("systems", [])
calc_live = sum(1 for x in systems if x.get("runtime_status") == "VERIFIED_LIVE")
calc_staging = sum(1 for x in systems if x.get("runtime_status") == "VERIFIED_STAGING")
if truth.get("total_entries") != len(systems):
    errors.append(f"truth.total_entries={truth.get('total_entries')} but actual={len(systems)}")
if truth.get("verified_live") != calc_live:
    errors.append(f"truth.verified_live={truth.get('verified_live')} but actual={calc_live}")
if truth.get("verified_staging") != calc_staging:
    errors.append(f"truth.verified_staging={truth.get('verified_staging')} but actual={calc_staging}")

if errors:
    print("System Registry Validation FAILED")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print("System Registry Validation OK")
print(f"Systems: {len(systems)}")
print(f"Verified live: {calc_live}")
print(f"Verified staging: {calc_staging}")
