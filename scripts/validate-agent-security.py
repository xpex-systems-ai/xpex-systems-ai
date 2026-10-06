#!/usr/bin/env python3
"""Fail-closed structural validation for GXEON agent identity, permissions and containment."""

from __future__ import annotations
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
errors: list[str] = []

def load(rel: str):
    path = ROOT / rel
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        errors.append(f"{rel}: invalid or missing JSON: {exc}")
        return {}

registry = load("data/agents/agent-registry-v1.json")
policies_doc = load("data/agents/permission-policies-v1.json")
kill_doc = load("data/agents/kill-switch-registry-v1.json")

policy_map = {p.get("subject_id"): p for p in policies_doc.get("policies", [])}
kill_map = {k.get("agent_id"): k for k in kill_doc.get("kill_switches", [])}

seen: set[str] = set()
high_impact = {
    "payment.execute","wallet.transfer","trade.execute","credential.rotate",
    "repository.delete","database.delete","production.delete","account.owner.change",
    "contract.commit","resource.delete"
}

for agent in registry.get("agents", []):
    aid = agent.get("agent_id")
    if not aid:
        errors.append("agent missing agent_id")
        continue
    if aid in seen:
        errors.append(f"duplicate agent_id: {aid}")
    seen.add(aid)

    risk = agent.get("risk_tier")
    if risk not in {"R0","R1","R2","R3","R4"}:
        errors.append(f"{aid}: invalid risk_tier {risk!r}")

    if agent.get("permission_default") != "DENY":
        errors.append(f"{aid}: permission_default must be DENY")

    manifest_ref = agent.get("manifest_ref")
    passport_ref = agent.get("trust_passport_ref")
    if not manifest_ref:
        errors.append(f"{aid}: missing manifest_ref")
        continue
    if not passport_ref:
        errors.append(f"{aid}: missing trust_passport_ref")

    manifest = load(manifest_ref)
    if manifest.get("agent_id") != aid:
        errors.append(f"{aid}: manifest agent_id mismatch")
    if manifest.get("owner") != "XPeX Systems AI":
        errors.append(f"{aid}: unexpected manifest owner")
    if manifest.get("status") not in {"DRAFT","ACTIVE","PAUSED","RETIRED"}:
        errors.append(f"{aid}: invalid manifest status")
    if manifest.get("risk_tier") != risk:
        errors.append(f"{aid}: registry/manifest risk mismatch")

    capabilities = set(manifest.get("capabilities") or [])
    denied = set(manifest.get("denied_capabilities") or [])
    approvals = set((manifest.get("human_approval") or {}).get("required_for") or [])
    if not capabilities:
        errors.append(f"{aid}: manifest has no capabilities")
    if not denied:
        errors.append(f"{aid}: manifest has no denied capabilities")
    direct_high_impact = high_impact & capabilities
    if direct_high_impact:
        errors.append(f"{aid}: high-impact actions directly allowed: {sorted(direct_high_impact)}")
    if risk in {"R2","R3","R4"} and not approvals:
        errors.append(f"{aid}: elevated-risk agent without approval boundary")

    limits = manifest.get("limits") or {}
    if int(limits.get("max_steps", 0) or 0) <= 0:
        errors.append(f"{aid}: max_steps must be positive")
    if int(limits.get("max_runtime_seconds", 0) or 0) <= 0:
        errors.append(f"{aid}: max_runtime_seconds must be positive")
    if int(limits.get("max_retries", -1) if limits.get("max_retries") is not None else -1) < 0:
        errors.append(f"{aid}: max_retries must be zero or positive")

    policy = policy_map.get(aid)
    if not policy:
        errors.append(f"{aid}: missing permission policy")
    else:
        if policy.get("policy_id") != agent.get("permission_policy_id"):
            errors.append(f"{aid}: permission policy ID mismatch")
        if policy.get("default_effect") != "DENY":
            errors.append(f"{aid}: permission policy must be default-deny")
        if high_impact & set(policy.get("allow") or []):
            errors.append(f"{aid}: permission policy allows high-impact action directly")

    ks = kill_map.get(aid)
    if not ks:
        errors.append(f"{aid}: missing kill switch record")
    else:
        if ks.get("kill_switch_id") != agent.get("kill_switch_id"):
            errors.append(f"{aid}: kill switch ID mismatch")
        if ks.get("status") not in {"DESIGN","READY","TESTED","RETIRED"}:
            errors.append(f"{aid}: invalid kill-switch status")
        if not ks.get("actions"):
            errors.append(f"{aid}: kill switch has no actions")
        if not ks.get("activation_authority"):
            errors.append(f"{aid}: kill switch has no activation authority")

    runtime = agent.get("runtime_status", "")
    if runtime in {"ACTIVE","DEPLOYED","AUTONOMOUS","PRODUCTION"}:
        errors.append(f"{aid}: persistent runtime claim requires dedicated runtime evidence")

revenue = next((x for x in registry.get("agents", []) if x.get("agent_id") == "GXEON-REVENUE-001"), None)
if revenue and "payment.execute" not in set(revenue.get("approval_required") or []):
    errors.append("GXEON-REVENUE-001 must require approval for payment.execute")

if errors:
    print("Agent Security Validation FAILED")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print("Agent Security Validation OK")
print(f"Governed agent roles: {len(seen)}")
print(f"Permission policies: {len(policy_map)}")
print(f"Kill switches: {len(kill_map)}")
