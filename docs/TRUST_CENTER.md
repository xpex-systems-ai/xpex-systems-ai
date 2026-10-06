# XPeX Trust Center — Engineering View

## What this page is

This is the public-safe engineering view of how XPeX represents trust.

XPeX separates:
- **policy** — what must be true;
- **implementation** — the mechanism;
- **verification** — the check/result;
- **external assurance** — independent certification or assessment.

## Current verified repository controls

The corporate repository currently uses automated controls for:
- governance validation;
- public-truth validation;
- system-registry validation;
- Trust Passport validation;
- agent-policy validation;
- agent-security validation;
- secret hygiene;
- secret-pattern scanning;
- assurance invariant tests;
- GitHub Actions supply-chain validation;
- workflow pin validation;
- CodeQL;
- OpenSSF Scorecard.

The current result of any control should be read from its GitHub workflow status, not assumed from this document.

## What XPeX does not claim

Unless independently earned and explicitly evidenced, XPeX does not claim:
- SOC 2 certification;
- ISO/IEC 27001 certification;
- ISO/IEC 42001 certification;
- government/defense accreditation;
- equivalence to any named public or private institution;
- absolute security.

## Trust states

### TP1 — DOCUMENTED
Identity, policy and known boundaries are documented.

### TP2 — CONTROLLED
Relevant technical/procedural controls are implemented.

### TP3 — VERIFIED
Material controls and runtime claims have verifiable evidence.

### TP4 — CONTINUOUSLY_ASSURED
Automated and/or recurring evidence continuously supports the current trust state.

## Public evidence rule

A public claim must be:
- attributable;
- current enough for its purpose;
- supported by inspectable evidence;
- downgraded when evidence expires or contradicts it.

## Security reporting

Sensitive findings should not be posted as public issues.

See `SECURITY.md` and GitHub private vulnerability reporting when enabled.

## Enterprise target

The future XPeX Systems Command Trust Center should make the following graph queryable:

```text
Company
 -> System
 -> Source
 -> Deployment
 -> Database
 -> Agent
 -> Model
 -> Tool
 -> Policy
 -> Control
 -> Test
 -> Evidence
 -> Trust State
```

That graph is the foundation for customer due diligence, system onboarding, agent governance and future continuous assurance.
