# AI & Platform Security Baseline

## Identity and access
- MFA for privileged human accounts.
- SSO where enterprise capability exists.
- Separate human and machine identities.
- No shared privileged accounts.
- Least privilege and periodic access review.
- Short-lived/scoped credentials where supported.
- Immediate revocation path for compromised identities.

## Secrets
- No secrets committed to Git.
- Use provider-native secret stores or managed environment variables.
- Sensitive values must not be placed in prompts, model memory or public logs.
- Rotate after exposure, personnel change or material incident.
- Separate production and non-production secrets.
- Treat service-role and payment credentials as high-risk assets.

## Code and software supply chain
- Protected default branches for critical repositories.
- Review required for material changes.
- Dependency and vulnerability scanning.
- License and fork/upstream attribution.
- Lockfiles and reproducible builds where practical.
- Build provenance and commit/deployment linkage.
- SBOM generation for enterprise releases where practical.
- Do not execute untrusted generated code directly in privileged production contexts.

## Runtime
- Separate staging and production.
- Health checks and rollback.
- Network exposure minimized.
- Database access scoped by service.
- Production admin interfaces protected.
- Rate limits and abuse controls on public endpoints.
- Egress restrictions for high-risk autonomous workloads where practical.

## AI-specific controls
- Prompt-injection resistance at trust boundaries.
- Untrusted retrieved content clearly separated from system policy.
- Tool parameter validation.
- Output validation before side effects.
- Sensitive-data detection/redaction where required.
- Model/provider allowlist for regulated or sensitive workloads.
- Model-version change review for material systems.
- Evaluation before privilege expansion.

## Logging
Material operations should record:
- identity;
- agent;
- model/provider;
- tool;
- action;
- resource;
- authorization;
- result;
- error;
- timestamp;
- relevant evidence ID.

Logs must avoid unnecessary secret or sensitive-content capture.

## Data protection
- classify data before use;
- minimize collection;
- encrypt in transit;
- encrypt sensitive data at rest where applicable;
- enforce tenant boundaries;
- define retention;
- support deletion obligations where applicable;
- document third-party processing.

## Availability and recovery
- backups for critical state;
- restore tests;
- deployment rollback;
- provider-outage fallback for critical paths;
- clear RTO/RPO targets for enterprise services.

## Security assurance
Security is not a one-time checklist. Controls must be re-evaluated after material architecture, model, provider, permission or data changes.
