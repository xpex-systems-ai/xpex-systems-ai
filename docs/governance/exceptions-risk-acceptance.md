# Exceptions & Risk Acceptance

## Principle

A policy exception is not a silent bypass.

Any material exception must be explicit, bounded, owned, time-limited and reviewable.

## Required fields

- exception ID;
- system / control ID;
- reason;
- business justification;
- affected assets;
- risk tier;
- compensating controls;
- residual risk;
- owner;
- approver;
- start date;
- expiration date;
- remediation plan;
- evidence links.

## Rules

- High and critical risks require authorized human approval.
- An executor cannot approve its own exception.
- Permanent exceptions are discouraged; use review dates.
- Expired exceptions automatically return to non-compliant status until renewed.
- Public VERIFIED_LIVE status cannot hide an unresolved critical exception.
- Legal/regulatory obligations cannot be waived by internal policy.

## Decision states

`PROPOSED → REVIEWING → ACCEPTED_TEMPORARILY → REMEDIATED / EXPIRED / REJECTED`

## Evidence

Each accepted exception must be linked to:
- the affected control;
- the approving identity;
- the expiry;
- the remediation owner;
- the risk register.
