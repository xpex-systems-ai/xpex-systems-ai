# Autonomy Levels & Operating Boundaries

XPeX separates intelligence from authority.

## L0 — Assistant
Can analyze and recommend. No external side effects.

## L1 — Read-Only Agent
Can inspect approved systems, files, APIs, logs and registries. No writes.

## L2 — Bounded Operator
Can perform reversible, low-risk writes inside explicitly approved scope.

Requirements:
- allowlisted tools;
- step/time limits;
- audit log;
- rollback where applicable.

## L3 — Workflow Agent
Can execute approved multi-step workflows with defined branching.

Requirements:
- risk classification;
- bounded permissions;
- failure policy;
- spend/time ceilings;
- human escalation;
- independent verification for material outcomes.

## L4 — Autonomous Domain Agent
Can operate continuously within a defined domain and standing mandate.

Requirements:
- narrow domain;
- continuous monitoring;
- budget controls;
- kill switch;
- policy engine;
- periodic access review;
- anomaly detection;
- evidence generation;
- human override.

## L5 — Strategic Autonomy
May affect broad strategy or multiple high-impact domains.

**Not enabled by default.**

Requires explicit executive governance, legal/security review, strong independent assurance and tightly defined authority.

## Principle

Autonomy is never inferred from model capability.

Authority is granted separately, explicitly and revocably.
