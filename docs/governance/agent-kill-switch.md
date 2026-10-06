# Agent Kill Switch & Containment Standard

Every production-capable GXEON agent must have a tested containment path.

## Minimum kill-switch actions

A production kill switch should be able to perform, as applicable:

1. disable the agent identity;
2. revoke tool access;
3. revoke/rotate scoped credentials;
4. freeze write-capable actions;
5. stop schedules and autonomous loops;
6. quarantine memory/state if compromise is suspected;
7. preserve logs and evidence.

## Activation

Kill-switch activation authority must be explicit.

High-risk agents should support more than one containment path so a single failed provider does not prevent shutdown.

## States

- `DESIGN` — containment behavior documented.
- `READY` — implementation exists.
- `TESTED` — implementation has been exercised with evidence.
- `RETIRED` — agent no longer active.

An agent cannot be promoted to a persistent production runtime if its kill switch remains only `DESIGN`.

## Evidence

A kill-switch test should record:
- agent ID;
- trigger;
- activation identity;
- time to containment;
- tools/tokens revoked;
- write paths blocked;
- scheduled work stopped;
- log/evidence preservation;
- restoration/recovery steps.

## Rule

Containment is a first-class capability, not an emergency document.
