#!/usr/bin/env python3
"""Fail-closed structural validation for GXEON agent identity, permissions and containment."""

from __future__ import annotations
import json
import pathlib
import sys
from typing import Any

ROOT = pathlib.Path(__file__).resolve().parents[1]
errors: list[str] = []

NON_PRODUCTION_RUNTIME_STATUSES = {
    "NOT_DEPLOYED_AS_PERSISTENT_AUTONOMOUS_SERVICE",
    "NOT_DEPLOYED",
    "DESIGN_ONLY",
    "DISABLED",
}
STAGING_RUNTIME_STATUSES = {"STAGING", "VERIFIED_STAGING"}
PRODUCTION_RUNTIME_STATUSES = {
    "VERIFIED_LIVE",
    "ACTIVE",
    "DEPLOYED",
    "AUTONOMOUS",
    "PRODUCTION",
}
VALID_RUNTIME_STATUSES = (
    NON_PRODUCTION_RUNTIME_STATUSES
    | STAGING_RUNTIME_STATUSES
    | PRODUCTION_RUNTIME_STATUSES
)
VALID_KILL_SWITCH_STATES = {"DESIGN", "READY", "TESTED", "RETIRED"}
MANDATORY_KILL_SWITCH_ACTIONS = {
    "DISABLE_AGENT",
    "REVOKE_TOOLS",
    "FREEZE_WRITES",
    "STOP_SCHEDULES",
    "PRESERVE_LOGS",
}
PRODUCTION_TRUST_STATES = {"TP3_VERIFIED", "TP4_CONTINUOUSLY_ASSURED"}
VERIFIED_DIMENSION_STATUS = "VERIFIED"
VALID_GOVERNANCE_STATUSES = {"REGISTERED", "ACTIVE", "PAUSED", "RETIRED"}


def safe_repo_path(rel: str) -> pathlib.Path | None:
    if not isinstance(rel, str) or not rel.strip():
        errors.append(f"invalid empty repository reference: {rel!r}")
        return None
    candidate = (ROOT / rel).resolve()
    try:
        candidate.relative_to(ROOT.resolve())
    except ValueError:
        errors.append(f"repository reference escapes root: {rel}")
        return None
    return candidate


def load(rel: str) -> dict[str, Any]:
    path = safe_repo_path(rel)
    if path is None:
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        errors.append(f"{rel}: invalid or missing JSON: {exc}")
        return {}


def require_unique(records: list[dict[str, Any]], field: str, label: str) -> None:
    seen: set[str] = set()
    for record in records:
        value = record.get(field)
        if not value:
            errors.append(f"{label} missing {field}")
            continue
        if value in seen:
            errors.append(f"duplicate {label} {field}: {value}")
        seen.add(value)


def dimension(passport: dict[str, Any], name: str) -> dict[str, Any]:
    value = (passport.get("dimensions") or {}).get(name)
    if not isinstance(value, dict):
        errors.append(f"{passport.get('agent_id', '<unknown>')}: missing Trust Passport dimension {name}")
        return {}
    return value


registry = load("data/agents/agent-registry-v1.json")
policies_doc = load("data/agents/permission-policies-v1.json")
kill_doc = load("data/agents/kill-switch-registry-v1.json")
permission_matrix = load("data/agents/permission-matrix-v1.json")

if registry.get("schema_version") != "1.0":
    errors.append("agent registry schema_version must be 1.0")
if policies_doc.get("schema_version") != "1.0":
    errors.append("permission policies schema_version must be 1.0")
if kill_doc.get("schema_version") != "1.0":
    errors.append("kill-switch registry schema_version must be 1.0")
if permission_matrix.get("schema_version") != "1.0":
    errors.append("permission matrix schema_version must be 1.0")
if policies_doc.get("default_effect") != "DENY":
    errors.append("permission policy document default_effect must be DENY")
if permission_matrix.get("policy") != "DENY_BY_DEFAULT":
    errors.append("permission matrix policy must be DENY_BY_DEFAULT")

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

matrix_agents = permission_matrix.get("agents")
if not isinstance(matrix_agents, list) or not matrix_agents:
    errors.append("permission matrix must contain at least one agent")
    matrix_agents = []

high_risk_classes = permission_matrix.get("high_risk_action_classes")
if not isinstance(high_risk_classes, list) or not high_risk_classes:
    errors.append("permission matrix must define non-empty high_risk_action_classes")
    high_impact: set[str] = set()
else:
    high_impact = set(high_risk_classes)

require_unique(agents, "agent_id", "agent")
require_unique(policies, "policy_id", "policy")
require_unique(policies, "subject_id", "policy subject")
require_unique(kill_switches, "kill_switch_id", "kill switch")
require_unique(kill_switches, "agent_id", "kill-switch agent")
require_unique(matrix_agents, "agent_id", "permission-matrix agent")

policy_map = {p.get("subject_id"): p for p in policies if p.get("subject_id")}
kill_map = {k.get("agent_id"): k for k in kill_switches if k.get("agent_id")}
matrix_map = {m.get("agent_id"): m for m in matrix_agents if m.get("agent_id")}
seen: set[str] = set()
passport_ids: set[str] = set()

for agent in agents:
    aid = agent.get("agent_id")
    if not aid:
        continue
    seen.add(aid)

    risk = agent.get("risk_tier")
    if risk not in {"R0", "R1", "R2", "R3", "R4"}:
        errors.append(f"{aid}: invalid risk_tier {risk!r}")

    if agent.get("permission_default") != "DENY":
        errors.append(f"{aid}: permission_default must be DENY")

    governance_status = agent.get("governance_status")
    if governance_status not in VALID_GOVERNANCE_STATUSES:
        errors.append(f"{aid}: invalid governance_status {governance_status!r}")

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
        passport_id = passport.get("passport_id")
        if not passport_id:
            errors.append(f"{aid}: Trust Passport missing passport_id")
        elif passport_id in passport_ids:
            errors.append(f"{aid}: duplicate Trust Passport ID {passport_id}")
        else:
            passport_ids.add(passport_id)
        if passport.get("subject_type") != "AGENT":
            errors.append(f"{aid}: Trust Passport subject_type must be AGENT")
        if passport.get("risk_tier") != risk:
            errors.append(f"{aid}: registry/passport risk mismatch")
        if passport.get("runtime_status") != agent.get("runtime_status"):
            errors.append(f"{aid}: registry/passport runtime mismatch")
        if set(passport.get("approval_required") or []) != set(agent.get("approval_required") or []):
            errors.append(f"{aid}: registry/passport approval boundary mismatch")

    manifest = load(manifest_ref)
    if manifest.get("agent_id") != aid:
        errors.append(f"{aid}: manifest agent_id mismatch")
    if manifest.get("owner") != "XPeX Systems AI":
        errors.append(f"{aid}: unexpected manifest owner")
    if manifest.get("status") not in {"DRAFT", "ACTIVE", "PAUSED", "RETIRED"}:
        errors.append(f"{aid}: invalid manifest status")
    if manifest.get("risk_tier") != risk:
        errors.append(f"{aid}: registry/manifest risk mismatch")

    capabilities = set(manifest.get("capabilities") or [])
    denied = set(manifest.get("denied_capabilities") or [])
    manifest_approvals = set((manifest.get("human_approval") or {}).get("required_for") or [])
    registry_allow = set(agent.get("allowed") or [])
    registry_approvals = set(agent.get("approval_required") or [])
    if not capabilities:
        errors.append(f"{aid}: manifest has no capabilities")
    if not denied:
        errors.append(f"{aid}: manifest has no denied capabilities")
    if not registry_allow:
        errors.append(f"{aid}: registry has no allowed capabilities")
    registry_high_impact = high_impact & registry_allow
    if registry_high_impact:
        errors.append(f"{aid}: registry directly allows high-impact actions: {sorted(registry_high_impact)}")
    if not registry_allow.issubset(capabilities):
        errors.append(
            f"{aid}: registry allows actions outside manifest capabilities: "
            f"{sorted(registry_allow - capabilities)}"
        )
    if not registry_approvals.issubset(manifest_approvals):
        errors.append(
            f"{aid}: registry approval boundary exceeds/contradicts manifest: "
            f"{sorted(registry_approvals - manifest_approvals)}"
        )
    capability_deny_overlap = capabilities & denied
    if capability_deny_overlap:
        errors.append(f"{aid}: manifest both allows and denies actions: {sorted(capability_deny_overlap)}")
    direct_high_impact = high_impact & capabilities
    if direct_high_impact:
        errors.append(f"{aid}: high-impact actions directly allowed in manifest: {sorted(direct_high_impact)}")
    if risk in {"R2", "R3", "R4"} and not manifest_approvals:
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
        if policy.get("status") not in {"DRAFT", "ACTIVE", "PAUSED", "RETIRED"}:
            errors.append(f"{aid}: invalid permission policy status")
        policy_allow = set(policy.get("allow") or [])
        policy_deny = set(policy.get("deny") or [])
        policy_approvals = set(policy.get("approval_required") or [])
        policy_effect_overlap = policy_allow & policy_deny
        if policy_effect_overlap:
            errors.append(f"{aid}: permission policy both allows and denies actions: {sorted(policy_effect_overlap)}")
        if high_impact & policy_allow:
            errors.append(f"{aid}: permission policy allows high-impact action directly")
        if policy_allow != registry_allow:
            errors.append(
                f"{aid}: registry/policy allowed capabilities differ: "
                f"registry_only={sorted(registry_allow - policy_allow)}, "
                f"policy_only={sorted(policy_allow - registry_allow)}"
            )
        if policy_approvals != registry_approvals:
            errors.append(
                f"{aid}: registry/policy approval boundaries differ: "
                f"registry_only={sorted(registry_approvals - policy_approvals)}, "
                f"policy_only={sorted(policy_approvals - registry_approvals)}"
            )
        if not policy_allow.issubset(capabilities):
            errors.append(
                f"{aid}: permission policy allows actions outside manifest capabilities: "
                f"{sorted(policy_allow - capabilities)}"
            )
        if not policy_approvals.issubset(manifest_approvals):
            errors.append(
                f"{aid}: permission policy approval boundary exceeds/contradicts manifest: "
                f"{sorted(policy_approvals - manifest_approvals)}"
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
        approved_data = set(manifest.get("approved_data_classes") or [])
        policy_data = set(policy.get("data_classes") or [])
        if not policy_data:
            errors.append(f"{aid}: permission policy has no data classes")
        elif not policy_data.issubset(approved_data):
            errors.append(
                f"{aid}: permission policy data classes exceed manifest boundary: "
                f"{sorted(policy_data - approved_data)}"
            )

    matrix = matrix_map.get(aid)
    if not matrix:
        errors.append(f"{aid}: missing permission matrix entry")
    else:
        if matrix.get("risk_tier") != risk:
            errors.append(f"{aid}: registry/permission-matrix risk mismatch")
        matrix_allow = set(matrix.get("allow") or [])
        matrix_deny = set(matrix.get("deny") or [])
        matrix_approvals = set(matrix.get("human_approval_required") or [])
        matrix_effect_overlap = matrix_allow & matrix_deny
        if matrix_effect_overlap:
            errors.append(f"{aid}: permission matrix both allows and denies actions: {sorted(matrix_effect_overlap)}")
        matrix_high_impact = high_impact & matrix_allow
        if matrix_high_impact:
            errors.append(f"{aid}: permission matrix directly allows high-impact actions: {sorted(matrix_high_impact)}")
        if not registry_allow.issubset(matrix_allow):
            errors.append(
                f"{aid}: registry allows actions outside canonical permission matrix: "
                f"{sorted(registry_allow - matrix_allow)}"
            )
        if not registry_approvals.issubset(matrix_approvals):
            errors.append(
                f"{aid}: registry approval boundary is not represented in permission matrix: "
                f"{sorted(registry_approvals - matrix_approvals)}"
            )

    ks = kill_map.get(aid)
    if not ks:
        errors.append(f"{aid}: missing kill switch record")
    else:
        if ks.get("kill_switch_id") != agent.get("kill_switch_id"):
            errors.append(f"{aid}: kill switch ID mismatch")
        if ks.get("owner") != "XPeX Systems AI":
            errors.append(f"{aid}: unexpected kill-switch owner")
        if ks.get("status") not in VALID_KILL_SWITCH_STATES:
            errors.append(f"{aid}: invalid kill-switch status")
        actions = set(ks.get("actions") or [])
        missing_actions = MANDATORY_KILL_SWITCH_ACTIONS - actions
        if missing_actions:
            errors.append(f"{aid}: kill switch missing mandatory actions: {sorted(missing_actions)}")
        if not ks.get("activation_authority"):
            errors.append(f"{aid}: kill switch has no activation authority")

    runtime = agent.get("runtime_status")
    if runtime not in VALID_RUNTIME_STATUSES:
        errors.append(f"{aid}: unknown runtime_status {runtime!r}; fail-closed")
    elif runtime in NON_PRODUCTION_RUNTIME_STATUSES:
        if governance_status == "ACTIVE":
            errors.append(f"{aid}: ACTIVE governance status is incompatible with non-production runtime {runtime!r}")
    elif runtime in STAGING_RUNTIME_STATUSES:
        if governance_status not in {"REGISTERED", "ACTIVE"}:
            errors.append(f"{aid}: staging runtime requires REGISTERED or ACTIVE governance status")
        if manifest.get("status") != "ACTIVE":
            errors.append(f"{aid}: staging runtime requires ACTIVE manifest")
        if not ks or ks.get("status") not in {"READY", "TESTED"}:
            errors.append(f"{aid}: staging runtime requires READY or TESTED kill switch")
        runtime_dim = dimension(passport, "RUNTIME")
        if runtime_dim.get("status") not in {"IMPLEMENTED", "VERIFIED"}:
            errors.append(f"{aid}: staging runtime requires implemented/verified runtime passport dimension")
        if not runtime_dim.get("evidence_refs"):
            errors.append(f"{aid}: staging runtime requires runtime evidence")
    elif runtime in PRODUCTION_RUNTIME_STATUSES:
        if governance_status != "ACTIVE":
            errors.append(f"{aid}: production runtime requires ACTIVE governance status")
        if manifest.get("status") != "ACTIVE":
            errors.append(f"{aid}: production runtime requires ACTIVE manifest")
        if not ks or ks.get("status") != "TESTED":
            errors.append(f"{aid}: production runtime requires TESTED kill switch")
        if not ks or not ks.get("last_tested_at"):
            errors.append(f"{aid}: production runtime requires kill-switch last_tested_at")
        if passport.get("overall_trust_state") not in PRODUCTION_TRUST_STATES:
            errors.append(f"{aid}: production runtime requires TP3_VERIFIED or TP4_CONTINUOUSLY_ASSURED")
        for dim_name in ("RUNTIME", "CONTAINMENT", "EVALUATION", "HUMAN_OVERSIGHT"):
            dim = dimension(passport, dim_name)
            if dim.get("status") != VERIFIED_DIMENSION_STATUS:
                errors.append(f"{aid}: production runtime requires VERIFIED {dim_name} dimension")
            if not dim.get("evidence_refs"):
                errors.append(f"{aid}: production runtime requires evidence for {dim_name}")

orphan_policies = set(policy_map) - seen
if orphan_policies:
    errors.append(f"orphan permission policies without governed agents: {sorted(orphan_policies)}")

orphan_kill_switches = set(kill_map) - seen
if orphan_kill_switches:
    errors.append(f"orphan kill switches without governed agents: {sorted(orphan_kill_switches)}")

orphan_matrix_entries = set(matrix_map) - seen
if orphan_matrix_entries:
    errors.append(f"orphan permission-matrix entries without governed agents: {sorted(orphan_matrix_entries)}")

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
print(f"Permission-matrix entries: {len(matrix_map)}")
print("Cross-document bindings: registry ↔ manifest ↔ policy ↔ matrix ↔ passport ↔ kill switch")
