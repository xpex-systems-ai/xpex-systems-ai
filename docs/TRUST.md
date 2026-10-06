# XPeX Trust & Assurance

## Our position

Trust is not a slogan and security is not absolute.

XPeX Systems AI uses an evidence-first assurance model.

## XAGF

The XPeX AI Governance Framework currently defines:
- 59 machine-readable controls;
- 11 control domains;
- R0–R4 risk tiers;
- AL0–AL4 assurance levels;
- human oversight;
- bounded autonomy;
- agent governance;
- model/provider governance;
- privacy and data controls;
- AI security and evaluation;
- software supply-chain controls;
- incident response;
- business continuity.

## Assurance levels

| Level | Meaning |
| --- | --- |
| AL0 | Unassessed |
| AL1 | Documented |
| AL2 | Controlled |
| AL3 | Independently verified |
| AL4 | Continuously assured |

The current corporate governance foundation is at **AL1 overall**. Individual technical controls may be implemented, partial, blocked or verified separately.

## What we do not claim

We do not claim, without evidence:
- absolute security;
- ISO certification;
- SOC 2 certification;
- regulatory approval;
- universal legal compliance;
- formal partnerships merely because technology is used.

## Public evidence principle

```text
Internal Evidence
      ↓
Verification
      ↓
Security Review
      ↓
Disclosure Approval
      ↓
Public Trust Record
```

## Security reporting

Do not post credentials, private customer information or active exploit details in public issues.

See `SECURITY.md`.

## Governance validation

The repository contains automated structural validation for XAGF artifacts in GitHub Actions.

Policy documentation is not automatically counted as implementation.

## Long-term Trust Center

The public Trust Center is planned to include:
- governance overview;
- security posture;
- approved system cards;
- approved agent capability summaries;
- control coverage;
- verification dates;
- certifications only when actually earned.


## Trust Passports

XPeX now maintains machine-readable Trust Passports for:

- verified system packs;
- governed GXEON agent roles.

The passport records identity, source/ownership, permissions, policy, secrets, evaluation, containment, runtime, evidence, supply chain and human oversight.

See:
- `docs/TRUST_PASSPORT.md`
- `data/trust/system-passports/`
- `data/trust/agent-passports/`

## Executable assurance

Current executable controls include:
- Governance Validation;
- Public Truth Validation;
- System Registry Validation;
- Trust Passport Validation;
- Agent Policy Validation;
- Secret Hygiene Validation;
- Assurance Tests;
- Action Supply-chain Validation;
- CodeQL.

OpenSSF Scorecard and release provenance are configured as additional supply-chain / release controls.

See `docs/VALIDATION_BADGES.md` for the exact meaning of a passing badge.

## Improvement loop

```text
BUILD → CONNECT → OPERATE → PROVE → IMPROVE
```

See `docs/governance/continuous-assurance.md`.
