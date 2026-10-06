# XPeX Trust Passport

The XPeX Trust Passport is a machine-readable and human-readable assurance record for systems and agents.

It does **not** replace external certification. It provides a transparent internal assurance layer that can be independently checked against evidence.

## Trust dimensions

Every passport separates these dimensions:

1. **Identity** — is the system/agent uniquely identified?
2. **Ownership / source** — is origin and lineage known?
3. **Permissions** — are allowed and denied capabilities explicit?
4. **Policy** — which XAGF controls apply?
5. **Secrets** — are secret-handling requirements defined and current findings known?
6. **Evaluation** — have relevant functional/security tests run?
7. **Kill switch / containment** — can execution be stopped?
8. **Runtime** — is a deployment/runtime independently observed?
9. **Evidence** — are claims linked to evidence?
10. **Supply chain** — are source/dependencies/provenance tracked?
11. **Human oversight** — are approval boundaries explicit?

## Status vocabulary

- `VERIFIED` — backed by current evidence.
- `IMPLEMENTED` — control exists but independent verification is incomplete.
- `POLICY_DEFINED` — requirement is documented but implementation is not yet proven.
- `CONDITIONAL` — evidence exists but a blocker or limitation remains.
- `NOT_VERIFIED` — no sufficient evidence yet.
- `NOT_APPLICABLE` — dimension does not apply to the current role.

## Overall Trust States

- `TP0_UNASSESSED`
- `TP1_DOCUMENTED`
- `TP2_CONTROLLED`
- `TP3_VERIFIED`
- `TP4_CONTINUOUSLY_ASSURED`

A passport cannot self-promote. Overall state is computed conservatively from its weakest material dimensions.

## System passport rule

A system may be technically `VERIFIED_LIVE` while still being below `TP3_VERIFIED` overall if security, supply-chain or governance controls have not been independently verified.

## Agent passport rule

An agent may have a complete identity and policy profile while remaining `NOT_DEPLOYED`.

That is intentional: **capability is not authority**.

## Public projection

Public passports contain only sanitized evidence.

Secrets, customer data, exploitable findings and internal credentials are excluded.
