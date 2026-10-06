# XAGF Technical Enforcement Roadmap

Policy is only the first layer. This roadmap converts XAGF from documentation into enforceable controls.

## P0 — Before public platform launch

- require pull-request review for material changes where repository settings support it;
- enable MFA for privileged accounts;
- establish production/staging separation;
- eliminate unresolved production secret-exposure findings;
- inventory service and agent identities;
- create kill-switch procedures for privileged agents;
- validate `XAGF` artifacts in CI;
- define public-claim evidence source;
- require source-commit ↔ deployment linkage;
- test rollback for flagship products.

## P1 — Before enterprise customer onboarding

- SSO / stronger organization access controls where supported;
- customer tenant isolation tests;
- centralized audit/evidence retention;
- dependency vulnerability scanning;
- SBOM for enterprise releases;
- formal provider registry;
- data retention/deletion implementation;
- incident-response tabletop exercise;
- backup restore test;
- agent budget/spend telemetry;
- prompt-injection and excessive-agency test suite.

## P2 — Before high-autonomy agents

- policy engine at tool-call boundary;
- explicit action authorization tokens;
- high-risk action approval service;
- autonomous loop watchdog;
- per-agent budgets;
- anomaly detection;
- tool-call replay protection/idempotency;
- model/provider routing policy enforcement;
- automated quarantine;
- continuous control monitoring.

## P3 — External assurance

Evaluate, as commercially justified:
- independent penetration test;
- formal privacy/legal review;
- SOC 2 readiness / audit path;
- ISO/IEC 27001 path;
- ISO/IEC 42001 readiness / certification path;
- customer security questionnaires;
- external AI red-team assessment.

These are future assurance targets, not current certifications.
