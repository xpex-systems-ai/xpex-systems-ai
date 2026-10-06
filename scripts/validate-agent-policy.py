#!/usr/bin/env python3
from __future__ import annotations
import json, pathlib, sys

ROOT=pathlib.Path(__file__).resolve().parents[1]
MANIFESTS=ROOT/"data/agents/manifests"
REGISTRY=ROOT/"data/agents/agent-registry-v1.json"
MATRIX=ROOT/"data/agents/permission-matrix-v1.json"
errors=[]

def load(p):
    try: return json.loads(p.read_text(encoding="utf-8"))
    except Exception as e:
        errors.append(f"invalid JSON {p.relative_to(ROOT)}: {e}"); return {}

registry=load(REGISTRY)
matrix=load(MATRIX)
known={a.get("agent_id"):a for a in registry.get("agents",[])}
matrix_agents={a.get("agent_id"):a for a in matrix.get("agents",[])}

high=set(matrix.get("high_risk_action_classes",[]))
for p in sorted(MANIFESTS.glob("*.json")):
    m=load(p); aid=m.get("agent_id")
    if aid not in known: errors.append(f"{p.name}: agent not present in registry")
    if aid not in matrix_agents: errors.append(f"{p.name}: agent not present in permission matrix")
    if not m.get("owner"): errors.append(f"{p.name}: missing owner")
    if m.get("risk_tier") not in {"R0","R1","R2","R3","R4"}: errors.append(f"{p.name}: invalid risk tier")
    allow=set(m.get("capabilities",[])); deny=set(m.get("denied_capabilities",[]))
    if allow & deny: errors.append(f"{p.name}: same capability allowed and denied: {sorted(allow&deny)}")
    if high & allow:
        required=set((m.get("human_approval") or {}).get("required_for",[]))
        uncovered=(high & allow)-required
        if uncovered: errors.append(f"{p.name}: high-risk allowed without approval gate: {sorted(uncovered)}")
    limits=m.get("limits") or {}
    for key in ("max_steps","max_runtime_seconds","max_retries"):
        if key not in limits: errors.append(f"{p.name}: missing limit {key}")
    if not m.get("kill_switch"): errors.append(f"{p.name}: missing kill switch")
    if m.get("status")=="ACTIVE" and str(known.get(aid,{}).get("runtime_status","")).startswith("NOT_DEPLOYED"):
        errors.append(f"{p.name}: ACTIVE manifest conflicts with non-deployed runtime status")

if len(list(MANIFESTS.glob("*.json"))) != len(known):
    errors.append("manifest count does not match governed agent registry")

if errors:
    print("Agent Policy Validation FAILED")
    [print(f"- {e}") for e in errors]
    sys.exit(1)

print("Agent Policy Validation OK")
print(f"Validated agents: {len(known)}")
print("Policy: DENY_BY_DEFAULT")
