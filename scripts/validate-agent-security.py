#!/usr/bin/env python3
"""Structural agent-governance validation for GXEON roles."""

from __future__ import annotations
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
errors: list[str] = []

registry_path = ROOT / "data/agents/agent-registry-v1.json"
registry = json.loads(registry_path.read_text(encoding="utf-8"))

seen: set[str] = set()
for agent in registry.get("agents", []):
    aid = agent.get("agent_id")
    if not aid:
        errors.append("agent missing agent_id")
        continue
    if aid in seen:
        errors.append(f"duplicate agent_id: {aid}")
    seen.add(aid)

    if agent.get("risk_tier") not in {"R0","R1","R2","R3","R4"}:
        errors.append(f"{aid}: invalid risk_tier")

    allowed = set(agent.get("allowed") or [])
    approvals = set(agent.get("approval_required") or [])
    if not allowed:
        errors.append(f"{aid}: no allowed capabilities defined")
    if not approvals:
        errors.append(f"{aid}: no approval boundaries defined")

    runtime = agent.get("runtime_status", "")
    if runtime in {"ACTIVE","DEPLOYED","AUTONOMOUS","PRODUCTION"}:
        errors.append(f"{aid}: persistent runtime claim requires dedicated runtime evidence")

    forbidden_direct = {
        "payment.execute",
        "credential.rotate",
        "resource.delete",
        "production.delete",
        "contract.commit",
        "wallet.transfer",
        "trade.execute",
    }
    overlap = forbidden_direct & allowed
    if overlap:
        errors.append(f"{aid}: high-impact capabilities directly allowed: {sorted(overlap)}")

revenue = next((x for x in registry.get("agents", []) if x.get("agent_id") == "GXEON-REVENUE-001"), None)
if revenue and "payment.execute" not in set(revenue.get("approval_required") or []):
    errors.append("GXEON-REVENUE-001 must require approval for payment.execute")

if errors:
    print("Agent Security Validation FAILED")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print("Agent Security Validation OK")
print(f"Registered governed agent roles: {len(seen)}")
