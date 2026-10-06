#!/usr/bin/env python3
"""Fail-closed validation for public XPeX company registries and claims."""

from __future__ import annotations
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
errors: list[str] = []

def load(rel: str):
    path = ROOT / rel
    if not path.exists():
        errors.append(f"missing required file: {rel}")
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        errors.append(f"invalid JSON {rel}: {exc}")
        return {}

products = load("data/products/public-product-registry-v1.json")
agents = load("data/agents/agent-registry-v1.json")
providers = load("data/providers/provider-registry-v1.json")

product_ids: set[str] = set()
for item in products.get("products", []):
    pid = item.get("product_id")
    if not pid:
        errors.append("product missing product_id")
        continue
    if pid in product_ids:
        errors.append(f"duplicate product_id: {pid}")
    product_ids.add(pid)

    status = item.get("status")
    if status == "VERIFIED_LIVE":
        runtime = item.get("runtime") or {}
        source = item.get("source") or {}
        if runtime.get("state") not in {"READY", "SUCCESS"}:
            errors.append(f"{pid}: VERIFIED_LIVE without verified-ready runtime")
        if not runtime.get("deployment_id"):
            errors.append(f"{pid}: VERIFIED_LIVE missing deployment_id")
        if source.get("evidence") not in {"VERIFIED", "VERIFIED_REPOSITORY"}:
            errors.append(f"{pid}: VERIFIED_LIVE without verified source evidence")

for item in agents.get("agents", []):
    aid = item.get("agent_id")
    if not aid:
        errors.append("agent missing agent_id")
        continue
    runtime = item.get("runtime_status", "")
    if runtime in {"ACTIVE", "DEPLOYED", "AUTONOMOUS"}:
        errors.append(f"{aid}: runtime status claims deployment without runtime evidence schema")

formal = {"FORMAL_PARTNER", "COSELL_PARTNER"}
for item in providers.get("providers", []):
    if item.get("public_partner_claim") is True and item.get("relationship_status") not in formal:
        errors.append(
            f"{item.get('provider_id')}: public partner claim requires FORMAL_PARTNER or COSELL_PARTNER"
        )

readme = (ROOT / "README.md").read_text(encoding="utf-8") if (ROOT / "README.md").exists() else ""
for banned in ["100% secure", "total security", "guaranteed investment", "official partner of OpenAI"]:
    if banned.lower() in readme.lower():
        errors.append(f"README contains disallowed unsupported claim: {banned}")

if errors:
    print("Public company truth validation FAILED")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print("Public company truth validation OK")
print(f"Products: {len(product_ids)}")
print(f"Agents: {len(agents.get('agents', []))}")
print(f"Providers: {len(providers.get('providers', []))}")
