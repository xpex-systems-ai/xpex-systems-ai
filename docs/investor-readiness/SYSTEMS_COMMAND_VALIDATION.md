# XPeX Systems Command — Enterprise Validation Runbook
Date: 2026-10-10. Status: NOT_EXECUTED / REVIEW REQUIRED.

## Evidence boundary
Prior docs/DEMO_READINESS.md says staging (Railway + PostgreSQL), AMBER. This file does not claim new live verification, independent review or legal software ownership.

## Safe validation sequence
1. G0: collect Railway project/service/deployment identifiers, timestamp, environment name and redacted provider inventory.
2. G1: correlate xpex-systems-command canonical GitHub repo, branch/commit, any forks, contributor/license ledger, and legal ownership. No assumption that personal-account commits belong to the CNPJ.
3. G2: record staging-vs-prod network/auth boundaries, least-privilege access, database classification, secret manager location (never values), and access revoke test.
4. G3: link dependency scan, SAST, secret scan, CI run and release provenance for the exact commit.
5. G4: verify safe health URL, repository-to-deploy correlation, a read-only sample registry query, DB connectivity, error-state demo, backup/restore plan and rollback procedure. Do not change prod.
6. G5: map agent execution functions, tool permissions, high-risk approval gates, budget/step/time limits and kill switch; mark N/A only if justified.
7. G6: attach dated output proofs, no critical blocker statement and independent reviewer signature; until then NOT_EVALUATED.
8. G7: verify branded public-safe demo script and sanitized evidence. No public production claims while staging-only.

## 3–5-minute investor demo acceptance script
- Problem (30s): fragmented assets across code, cloud, databases and agents.
- Registry (60s): show sanitized system and source link.
- Evidence graph (60s): show observed vs verified state, linked source, timestamp.
- Governance (60s): blocked promotion, independent reviewer and audit trace.
- Outcome (30s): priority remediation action and explicit evidence gaps.
Pass requires a continuous screen recording, sample data provenance and no exposed personal/customer secrets.

## Acceptance record template
Run date: TBD
Exact source SHA: TBD
Provider deployment ID: TBD
Recorded demo proof: TBD
G0–G7 evidence URLs: TBD
Blocking findings: TBD
Independent reviewer: TBD
Decision: NOT_EVALUATED
