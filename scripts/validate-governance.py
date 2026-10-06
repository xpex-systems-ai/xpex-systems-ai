#!/usr/bin/env python3
"""Fail-closed structural validation for XPeX AI Governance Framework artifacts."""

from __future__ import annotations
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]

REQUIRED = [
    "AI_GOVERNANCE_CHARTER.md",
    "docs/governance/README.md",
    "docs/governance/control-catalog.md",
    "docs/governance/agent-governance.md",
    "docs/governance/security-baseline.md",
    "docs/governance/human-oversight.md",
    "docs/governance/model-provider-governance.md",
    "docs/governance/data-privacy-governance.md",
    "docs/governance/evaluation-red-team.md",
    "docs/governance/incident-response.md",
    "docs/governance/secure-sdlc.md",
    "docs/governance/third-party-supply-chain.md",
    "docs/governance/threat-modeling.md",
    "docs/governance/exceptions-risk-acceptance.md",
    "docs/governance/business-continuity.md",
    "docs/governance/audit-evidence-standard.md",
    "data/governance/xagf-controls-v1.json",
    "schemas/agent-manifest.schema.json",
    "schemas/ai-system-card.schema.json",
    "schemas/evidence-record.schema.json",
    "schemas/risk-assessment.schema.json",
    "schemas/provider-registry.schema.json",
    "schemas/policy-exception.schema.json",
]

FORBIDDEN_BASENAMES = {
    ".env",
    "id_rsa",
    "id_ed25519",
    "credentials.json",
    "service-account.json",
}

CONTROL_ID = re.compile(r"^XAGF-[A-Z]{3}-\d{3}$")

errors: list[str] = []

for rel in REQUIRED:
    if not (ROOT / rel).exists():
        errors.append(f"missing required governance artifact: {rel}")

for path in ROOT.rglob("*.json"):
    try:
        with path.open("r", encoding="utf-8") as fh:
            json.load(fh)
    except Exception as exc:
        errors.append(f"invalid JSON: {path.relative_to(ROOT)}: {exc}")

for path in (ROOT / "schemas").glob("*.schema.json"):
    try:
        obj = json.loads(path.read_text(encoding="utf-8"))
        if "$schema" not in obj:
            errors.append(f"schema missing $schema: {path.relative_to(ROOT)}")
        if obj.get("type") != "object":
            errors.append(f"top-level schema type must be object: {path.relative_to(ROOT)}")
    except Exception:
        pass

catalog_path = ROOT / "data/governance/xagf-controls-v1.json"
if catalog_path.exists():
    catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
    seen: set[str] = set()
    for domain in catalog.get("domains", []):
        for control in domain.get("controls", []):
            cid = control.get("id", "")
            if not CONTROL_ID.match(cid):
                errors.append(f"invalid control id: {cid!r}")
            if cid in seen:
                errors.append(f"duplicate control id: {cid}")
            seen.add(cid)
            if not control.get("statement"):
                errors.append(f"control missing statement: {cid}")
            if not control.get("evidence"):
                errors.append(f"control missing evidence expectation: {cid}")

for path in ROOT.rglob("*"):
    if path.is_file() and path.name.lower() in FORBIDDEN_BASENAMES:
        errors.append(f"forbidden secret-bearing filename committed: {path.relative_to(ROOT)}")
    if path.is_file() and path.suffix.lower() in {".pem", ".p12", ".pfx", ".key"}:
        errors.append(f"forbidden key/certificate file committed: {path.relative_to(ROOT)}")

if errors:
    print("XAGF validation FAILED")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print("XAGF validation OK")
print(f"Validated {len(REQUIRED)} required artifacts.")
