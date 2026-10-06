# Security Policy

XPeX Systems AI follows an Evidence First security model.

## Never commit
- passwords
- API keys
- access tokens
- private keys
- database credentials
- service-role credentials
- OAuth client secrets
- payment secrets

Use managed environment variables and provider-native secret stores.

## Public release gate

A system cannot be promoted to public `VERIFIED_LIVE` while an unresolved secret-exposure or ownership blocker remains.

## Reporting

Security findings should be documented privately with:
- affected system;
- evidence source;
- severity;
- remediation status;
- verification date.

Do not open public issues containing secrets or exploitable production details.
