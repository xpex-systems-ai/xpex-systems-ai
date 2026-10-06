# XPeX Systems Registry

This directory is the public-facing system catalog for XPeX Systems AI.

The corporate repository does **not** copy every product's source code into one monorepo.

Instead, each system receives a canonical identity pack that links:

```text
System
  → Product role
  → Source repository
  → Source commit
  → Runtime / deployment
  → Infrastructure
  → Governance
  → Evidence
  → Public status
```

## Why this structure exists

XPeX operates many systems across multiple engineering platforms.

A company-level registry prevents:
- duplicate product identities;
- version confusion;
- stale deployment claims;
- accidental ownership claims over forks;
- disconnected evidence;
- investor/customer confusion.

## Admission lifecycle

```text
DISCOVERED
  ↓
CLASSIFIED
  ↓
CORROBORATED
  ↓
CANONICAL_CANDIDATE
  ↓
CANONICAL
  ↓
DEPLOYED
  ↓
VERIFIED_LIVE
  ↓
COMMERCIAL
```

A runtime may be VERIFIED_LIVE even while its final public product name is still a CANONICAL_CANDIDATE. These dimensions are tracked separately.

## Current system packs

### XPeX Systems Command
Company Intelligence & Evidence OS.

[Open system pack](xpex-systems-command/README.md)

### XPeX API Fabric
Public canonical-name candidate for the first independently verified live API/marketplace system lineage.

[Open system pack](xpex-api-fabric/README.md)

## Future systems

New systems should enter through the standard onboarding pipeline, not by manually adding a marketing card.

See:
- `docs/SYSTEM_ONBOARDING.md`
- `templates/system-onboarding/`
- `schemas/system-registry-entry.schema.json`
