#!/usr/bin/env python3
"""Validate the public XPeX portfolio registry without inflating evidence."""

from __future__ import annotations
import json
import pathlib
import sys

ROOT=pathlib.Path(__file__).resolve().parents[1]
errors=[]

def load(rel):
    try:
        return json.loads((ROOT/rel).read_text(encoding="utf-8"))
    except Exception as exc:
        errors.append(f"{rel}: {exc}")
        return {}

doc=load("data/company/portfolio-registry-v1.json")

if doc.get("schema_version")!="1.0":
    errors.append("portfolio registry schema_version must be 1.0")

if doc.get("company")!="XPeX Systems AI":
    errors.append("company must be XPeX Systems AI")

snapshot=doc.get("inventory_snapshot") or {}
if snapshot.get("connected_vercel_accounts") != 3:
    errors.append("connected_vercel_accounts snapshot must currently equal 3")
if int(snapshot.get("vercel_projects_observed",0)) < 100:
    errors.append("vercel inventory snapshot unexpectedly below 100 projects")

flagships=doc.get("flagship_set")
if not isinstance(flagships,list) or not (5 <= len(flagships) <= 7):
    errors.append("flagship_set must contain 5 to 7 systems")
    flagships=[]

allowed_demo_states={
    "DEMO_READY",
    "DEMO_READY_WITH_WARNING",
    "TECHNICALLY_READY_BRAND_BLOCKED",
    "STAGING_NOT_PUBLIC_FLAGSHIP",
    "RECOVERY_REQUIRED",
}
seen=set()
for system in flagships:
    sid=system.get("id")
    if not sid:
        errors.append("flagship missing id")
        continue
    if sid in seen:
        errors.append(f"duplicate flagship id: {sid}")
    seen.add(sid)
    if system.get("public_demo_status") not in allowed_demo_states:
        errors.append(f"{sid}: invalid public_demo_status")
    runtime=system.get("runtime")
    if not isinstance(runtime,dict) or not runtime.get("provider"):
        errors.append(f"{sid}: runtime/provider evidence missing")
    if system.get("public_demo_status")=="DEMO_READY":
        state=(runtime.get("production_state") or runtime.get("state"))
        if state not in {"READY","SUCCESS"}:
            errors.append(f"{sid}: DEMO_READY requires READY/SUCCESS provider state")

systems=doc.get("portfolio_systems")
if not isinstance(systems,list) or len(systems)!=10:
    errors.append("portfolio_systems must contain exactly 10 ranked systems")
else:
    ranks=[x.get("rank") for x in systems]
    if ranks != list(range(1,11)):
        errors.append("portfolio_systems ranks must be 1..10")

assets=doc.get("material_asset_lineages")
if not isinstance(assets,list) or len(assets)!=20:
    errors.append("material_asset_lineages must contain exactly 20 entries")
elif len(set(assets))!=20:
    errors.append("material_asset_lineages must be unique")

for forbidden in ("SOC 2 certified","ISO 27001 certified","Pentagon-level","CIA-level","Palantir-level"):
    payload=json.dumps(doc)
    if forbidden.lower() in payload.lower():
        errors.append(f"unsupported assurance phrase present: {forbidden}")

if errors:
    print("Portfolio Registry Validation FAILED")
    for e in errors:
        print(f"- {e}")
    sys.exit(1)

print("Portfolio Registry Validation OK")
print(f"Flagship surfaces: {len(flagships)}")
print(f"Portfolio systems: {len(systems or [])}")
print(f"Material asset lineages: {len(assets or [])}")
