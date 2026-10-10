# XPeX Systems AI — Technical Due Diligence Index

This document is a navigation layer for technical reviewers.

## 1. Corporate architecture
- `README.md`
- `docs/ARCHITECTURE.md`
- `COMPANY_MANIFESTO.md`
- `data/company/company-registry-v1.json`
- `data/company/company-graph-v1.json`

## 2. Verified systems
- `systems/README.md`
- `systems/xpex-systems-command/`
- `systems/xpex-api-fabric/`
- `data/company/system-index-v1.json`

## 3. Governance
- `AI_GOVERNANCE_CHARTER.md`
- `docs/governance/control-catalog.md`
- `data/governance/xagf-controls-v1.json`
- `data/governance/control-status-v1.json`

## 4. Agent model
- `docs/AGENTS.md`
- `docs/governance/agent-governance.md`
- `docs/governance/autonomy-levels.md`
- `data/agents/agent-registry-v1.json`
- `schemas/agent-manifest.schema.json`

## 5. Security
- `SECURITY.md`
- `docs/governance/security-baseline.md`
- `docs/governance/secure-sdlc.md`
- `docs/governance/threat-modeling.md`
- `docs/governance/evaluation-red-team.md`
- `docs/governance/incident-response.md`

## 6. AI/provider governance
- `docs/governance/model-provider-governance.md`
- `data/providers/provider-registry-v1.json`
- `schemas/provider-registry.schema.json`
- `schemas/ai-bom.schema.json`

## 7. Evidence
- `docs/governance/audit-evidence-standard.md`
- `schemas/evidence-record.schema.json`
- individual `systems/*/evidence/` packs.

## 8. Software/process gates
GitHub Actions validates:
- governance structure;
- public claim truth;
- system registry consistency.

## 9. Known limitations

The company is in an early technical/company-foundation stage.

Current limitations include:
- not all product families are canonicalized;
- XAGF is AL1 overall, not external certification;
- governed GXEON roles are not all persistent autonomous production services;
- NEXARA is an architecture target;
- some audited legacy systems require secret/configuration hardening;
- the corporate public platform is deployed; the Trust Center presents documented/engineering evidence, not independent certification;
- company preparation, legal title, financial actuals and operational transfer require separate review.

## 10. Current company preparation

See `docs/company/preparation/MISSION_PLAN.md`, `data/company/company-readiness-v1.json`, the seven System Packs and https://xpex-systems-ai.vercel.app/?view=company. Public source-head observations are not deployed-commit or legal-ownership proof.

These limitations are explicit because due diligence is strongest when current maturity is clear.
