# GXEON Kill-Switch Standard

## Objective

Every privileged persistent agent must have a practical containment mechanism before production activation.

## Required containment actions

The default GXEON containment design includes:
- `DISABLE_AGENT`
- `REVOKE_TOOLS`
- `FREEZE_WRITES`
- `STOP_SCHEDULES`
- `PRESERVE_LOGS`

Additional actions may include:
- revoke provider token;
- rotate credentials;
- quarantine memory;
- disable outbound network access;
- freeze financial capability;
- rollback deployment.

## States

- `DESIGN` — containment is documented but not runtime-tested.
- `READY` — technical mechanism exists.
- `TESTED` — mechanism has passed a controlled test.
- `RETIRED` — agent/runtime is retired.

Current GXEON persistent-agent roles remain in `DESIGN` until runtime infrastructure exists.

## Runtime assurance state machine

The validator treats runtime state as an explicit state machine instead of relying on a blacklist.

- **Design / not deployed** — policy and containment design may remain documented-only.
- **Staging** — requires an `ACTIVE` manifest, a `READY` or `TESTED` kill switch, and runtime evidence in the Trust Passport.
- **Production / verified live** — requires an `ACTIVE` manifest, a `TESTED` kill switch with test timestamp, `TP3_VERIFIED` or stronger overall trust, and verified evidence for runtime, containment, evaluation and human oversight.
- **Unknown runtime state** — fails closed.

This keeps future runtime promotion possible without weakening today's non-production truth.

## Authority

Kill-switch activation is controlled by authorized XPeX human operators.

An agent cannot silently remove or weaken its own containment path.

## Evidence

A production activation gate should require:
- kill-switch ID;
- mechanism;
- activation authority;
- last tested time;
- test evidence;
- recovery procedure.

## Rule

No R2+ persistent autonomous agent reaches production without a tested containment path.
