# GXEON Agent Trust

XPeX separates an agent's **identity**, **permission profile**, **runtime activation** and **trust assurance**.

## Current governed roster

| Agent | Risk | Governance identity | Runtime | Trust state |
| --- | --- | --- | --- | --- |
| GXEON Auditor | R1 | Active policy profile | Not persistent production | TP1 Documented |
| GXEON Engineer | R2 | Active policy profile | Not persistent production | TP1 Documented |
| GXEON Security | R2 | Active policy profile | Not persistent production | TP1 Documented |
| GXEON Research | R1 | Active policy profile | Not persistent production | TP1 Documented |
| GXEON Revenue | R2 | Active policy profile | Not persistent production | TP1 Documented |
| GXEON Operations | R2 | Active policy profile | Not persistent production | TP1 Documented |

## Before runtime activation

Each agent must pass:

```text
Identity
  → Permission Manifest
  → Tool Scopes
  → Data Classes
  → Budget / Step / Time Limits
  → Human Approval Boundaries
  → Security Evaluation
  → Kill-Switch Test
  → Runtime Evidence
  → Trust Passport Re-evaluation
```

## Trust Passport

Every agent has a machine-readable passport in:

`data/trust/agent-passports/`

A passport reports what is verified and what is still only policy-defined.

## Deny by default

If a capability is not explicitly allowed, it is denied.

Financial, destructive, credential and binding legal actions remain separately gated.

## Runtime truth

Registering an agent does not mean the agent is continuously autonomous in production.

XPeX will only describe an agent as production autonomous when its runtime identity, permissions, evaluation, evidence and containment are verified.
