#!/usr/bin/env python3
"""Validate the XPeX enterprise control-plane baseline and system-admission queue."""

from __future__ import annotations

import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
errors: list[str] = []


def load_json(rel: str):
    try:
        return json.loads((ROOT / rel).read_text(encoding="utf-8"))
    except Exception as exc:
        errors.append(f"{rel}: invalid or missing JSON: {exc}")
        return {}


def require_file(rel: str) -> None:
    if not (ROOT / rel).is_file():
        errors.append(f"required file missing: {rel}")


required_files = [
    "docs/ENTERPRISE_CONTROL_PLANE.md",
    "docs/SYSTEM_ADMISSION_GATES.md",
    "docs/TRUST_CENTER.md",
    "data/company/enterprise-control-plane-v1.json",
    "data/company/system-admission-queue-v1.json",
    "schemas/system-admission-record.schema.json",
    ".github/CODEOWNERS",
    ".github/pull_request_template.md",
]
for rel in required_files:
    require_file(rel)

baseline = load_json("data/company/enterprise-control-plane-v1.json")
queue = load_json("data/company/system-admission-queue-v1.json")
schema = load_json("schemas/system-admission-record.schema.json")

if baseline.get("schema_version") != "1.0":
    errors.append("enterprise baseline schema_version must be 1.0")
if baseline.get("owner") != "XPeX Systems AI":
    errors.append("enterprise baseline owner must be XPeX Systems AI")
if baseline.get("external_equivalence_claimed") is not False:
    errors.append("external_equivalence_claimed must remain false without independent evidence")
if baseline.get("external_certifications_claimed") != []:
    errors.append("external_certifications_claimed must be empty until independently earned")
if baseline.get("governance_rule") != "THE EXECUTOR DOES NOT APPROVE ITS OWN DELIVERY.":
    errors.append("separation-of-duties governance rule is missing or changed")

invariants = set(baseline.get("security_invariants") or [])
mandatory_invariants = {
    "DENY_BY_DEFAULT",
    "LEAST_PRIVILEGE",
    "SEPARATION_OF_DUTIES",
    "FAIL_CLOSED_HIGH_RISK_AUTHORIZATION",
    "BOUNDED_AUTONOMY",
    "SOURCE_TO_RUNTIME_PROVENANCE",
    "NO_PUBLIC_CLAIM_ABOVE_EVIDENCE",
    "SECRETS_OUTSIDE_SOURCE_CONTROL",
    "MATERIAL_ACTIONS_ARE_AUDITABLE",
}
missing_invariants = mandatory_invariants - invariants
if missing_invariants:
    errors.append(f"missing mandatory security invariants: {sorted(missing_invariants)}")

admin = baseline.get("repository_admin_enforcement") or {}
if admin.get("rulesets") not in {"NOT_ENFORCED_AT_LAST_VERIFIED_SNAPSHOT","VERIFIED_ENFORCED"}:
    errors.append("rulesets state must be evidence-bound")
for key in ("branch_protection","native_secret_scanning","push_protection","private_vulnerability_reporting"):
    if admin.get(key) not in {"NOT_VERIFIED","VERIFIED_ENFORCED","VERIFIED_ENABLED"}:
        errors.append(f"{key}: invalid repository-admin evidence state")

if queue.get("schema_version") != "1.0":
    errors.append("system admission queue schema_version must be 1.0")
candidates = queue.get("candidates")
if not isinstance(candidates, list) or not candidates:
    errors.append("system admission queue must contain at least one candidate")
    candidates = []

seen: set[str] = set()
priorities = {"P0","P1","P2","P3"}
statuses = {"PENDING_DISCOVERY","DISCOVERED","CORROBORATING","READY_FOR_ADMISSION","ADMITTED","REJECTED"}
for item in candidates:
    cid = item.get("candidate_id")
    if not cid:
        errors.append("candidate missing candidate_id")
        continue
    if cid in seen:
        errors.append(f"duplicate candidate_id: {cid}")
    seen.add(cid)
    if item.get("priority") not in priorities:
        errors.append(f"{cid}: invalid priority")
    status = item.get("discovery_status")
    if status not in statuses:
        errors.append(f"{cid}: invalid discovery_status")
    sources = item.get("intended_sources")
    if not isinstance(sources, list) or not sources:
        errors.append(f"{cid}: intended_sources must be non-empty")
    refs = item.get("evidence_refs")
    if not isinstance(refs, list):
        errors.append(f"{cid}: evidence_refs must be a list")
    if status == "PENDING_DISCOVERY" and refs:
        errors.append(f"{cid}: pending discovery candidate cannot claim evidence refs yet")
    forbidden = {"runtime_status","deployment_id","verified_live","canonical_status"}
    unexpected = forbidden & set(item)
    if status == "PENDING_DISCOVERY" and unexpected:
        errors.append(f"{cid}: pending discovery candidate contains premature verified fields: {sorted(unexpected)}")

if schema.get("properties",{}).get("gate_states",{}).get("required") != ["G0","G1","G2","G3","G4","G5","G6","G7"]:
    errors.append("system admission schema must require gates G0 through G7")

enterprise_doc = (ROOT / "docs/ENTERPRISE_CONTROL_PLANE.md").read_text(encoding="utf-8")
for phrase in (
    "No implicit authority.",
    "No public claim stronger than its evidence.",
    "THE EXECUTOR DOES NOT APPROVE ITS OWN DELIVERY.",
):
    if phrase not in enterprise_doc:
        errors.append(f"enterprise control-plane invariant missing from documentation: {phrase}")

if errors:
    print("Enterprise Control Plane Validation FAILED")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print("Enterprise Control Plane Validation OK")
print(f"Admission candidates: {len(candidates)}")
print(f"Security invariants: {len(invariants)}")
print("External equivalence/certification claims: none")
