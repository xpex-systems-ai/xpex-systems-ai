# XPeX Systems AI — Security Policy

XPeX Systems AI follows an **Evidence First** security model governed by the XPeX AI Governance Framework (XAGF).

## Security principles

- least privilege;
- defense in depth;
- fail closed for uncertain high-risk authorization;
- separation of duties;
- bounded autonomy;
- traceability;
- reversible operations where practical;
- independent verification for material actions.

## Never commit

- passwords;
- API keys;
- access tokens;
- private keys;
- database credentials;
- service-role credentials;
- OAuth client secrets;
- payment secrets;
- production signing material.

Use provider-native secret stores or managed environment variables.

## AI / agent security

Production-capable agents must have:
- explicit identity;
- bounded capabilities;
- approved tools;
- data-class restrictions;
- execution limits;
- escalation route;
- kill-switch / revocation path;
- material-action audit trail.

Untrusted webpage, email, retrieved document, user file, model output and tool output are treated as untrusted content and cannot override trusted policy.

## Public release gate

A system cannot be promoted to public `VERIFIED_LIVE` while a material unresolved blocker exists, including:
- active secret exposure;
- unclear source/ownership for a critical component;
- unverified production runtime;
- failed critical AI/security evaluation;
- absent rollback/containment for high-risk execution.

## Incident handling

Use the XAGF incident process:
1. contain;
2. preserve evidence;
3. assess impact;
4. remediate;
5. independently verify;
6. restore;
7. complete post-incident review.

## Reporting

Do **not** open a public issue containing:
- secrets;
- exploit details against active production;
- customer/private data;
- private keys or credentials.

Use a private security reporting mechanism or GitHub private vulnerability reporting / security advisory workflow when enabled.

## Framework

See:
- `AI_GOVERNANCE_CHARTER.md`
- `docs/governance/`
- `data/governance/xagf-controls-v1.json`

Adopting XAGF does not itself constitute external certification or guarantee absolute security.
