#!/usr/bin/env python3
"""Fail-closed structural validation for GXEON agent identity, permissions and containment."""

from __future__ import annotations
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
errors: list[str] = []

NON_PRODUCTION_RUNTIME_STATUSES = {
    "NOT_DEPLOYED_AS_PERSISTENT_AUTONOMOUS_SERVICE",
    "NOT_DEPLOYED",
    "DESIGN_ONLY",
    "DISABLED",
}

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
permission_matrix = load("data/agents/permission-matrix-v1.json")

agents = registry.get("agents")
if not isinstance(agents, list) or not agents:
    errors.append("agent registry must contain at least one governed agent")
    agents = []

policies = policies_doc.get("policies")
if not isinstance(policies, list) or not policies:
    errors.append("permission policy document must contain at least one policy")
    policies = []

kill_switches = kill_doc.get("kill_switches")
if not isinstance(kill_switches, list) or not kill_switches:
    errors.append("kill-switch registry must contain at least one kill switch")
    kill_switches = []

high_risk_classes = permission_matrix.get("high_risk_action_classes")
if not isinstance(high_risk_classes, list) or not high_risk_classes:
    errors.append("permission matrix must define non-empty high_risk_action_classes")
    high_impact: set[str] = set()
else:
    high_impact = set(high_risk_classes)

policy_map = {p.get("subject_id"): p for p in policies if p.get("subject_id")}
kill_map = {k.get("agent_id"): k for k in kill_switches if k.get("agent_id")}

seen: set[str] = set()

for agent in agents:
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
        passport = {}
    else:
        passport = load(passport_ref)
        if passport.get("agent_id") != aid:
            errors.append(f"{aid}: Trust Passport agent_id mismatch or missing passport")

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
        policy_allow = set(policy.get("allow") or [])
        if high_impact & policy_allow:
            errors.append(f"{aid}: permission policy allows high-impact action directly")
        if not policy_allow.issubset(capabilities):
            errors.append(
                f"{aid}: permission policy allows actions outside manifest capabilities: "
                f"{sorted(policy_allow - capabilities)}"
            )
        approved_envs = set(manifest.get("approved_environments") or [])
        policy_envs = set(policy.get("environments") or [])
        if not policy_envs:
            errors.append(f"{aid}: permission policy has no environments")
        elif not policy_envs.issubset(approved_envs):
            errors.append(
                f"{aid}: permission policy environments exceed manifest boundary: "
                f"{sorted(policy_envs - approved_envs)}"
            )

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

    runtime = agent.get("runtime_status")
    if runtime not in NON_PRODUCTION_RUNTIME_STATUSES:
        errors.append(
            f"{aid}: runtime_status {runtime!r} is not an explicitly approved non-production state; "
            "production-capable states require dedicated runtime evidence and tested containment"
        )

orphan_policies = set(policy_map) - seen
if orphan_policies:
    errors.append(f"orphan permission policies without governed agents: {sorted(orphan_policies)}")

orphan_kill_switches = set(kill_map) - seen
if orphan_kill_switches:
    errors.append(f"orphan kill switches without governed agents: {sorted(orphan_kill_switches)}")

revenue = next((x for x in agents if x.get("agent_id") == "GXEON-REVENUE-001"), None)
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
