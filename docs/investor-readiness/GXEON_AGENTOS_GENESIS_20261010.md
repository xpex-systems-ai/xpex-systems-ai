# GXEON 12 — AgentOS Genesis P0: engineering evidence

Date: 2026-10-10
State: **DRAFT CODE / SYNTHETIC DEMONSTRATION VERIFIED / NOT A DEPLOYED DIGITAL WORKER**

## Decision

XPeX Systems AI will standardize the ecosystem on a **single governed mission-execution layer** rather than introducing another unrelated product. The proposed AgentOS is a control plane and run-time integration target, not a new legal entity or an already-homologated service.

Existing roles are kept:
- **XPeX Systems Command**: company identity, assets, ownership and evidence index.
- **GXEON**: bounded mission orchestration, specialized roles and independent verification.
- **Broker P0 / Home Center Registry**: preview routing and permissions, not live agents.
- **Plugin Factory / Enterprise MCP / Agent API**: governed capability discovery and distribution.
- **Railway / Vercel / PostgreSQL**: infrastructure; provider READY does not equal application admission.
- **GXEON Audit OS**: proposed first commercial wedge.
- **NEXARA**: model routing design target, not an approved production product.

## Implemented source evidence

[Draft PR #443](https://github.com/xpex-systems-ai/GXEON-AI/pull/443) in GXEON-AI, stacked after [PR #442](https://github.com/xpex-systems-ai/GXEON-AI/pull/442).

Source: `artifacts/api-server/src/agentos/missionKernel.ts`
Read-only API: `artifacts/api-server/src/routes/agentosGenesis.ts` (mounted by `routes/index.ts`). Only `GET /api/agentos/genesis/status` and `GET /api/agentos/genesis/synthetic-demo`, fixed fixture response, no input or writes.
Demo: `scripts/agentos-genesis-demo.mjs`
Tests: `scripts/tests/agentos-genesis-contracts.test.mjs`
Runbook: `docs/agentos/GENESIS_P0.md`

The synthetic lifecycle is:
```text
CREATED (AUDITOR)
 → AUDITED (AUDITOR)
 → DRAFTED (ENGINEER, independent actor ID)
 → AWAITING_HUMAN_APPROVAL (VERIFIER, independent actor ID)
```
Rejected and cancelled states also exist; human approval or external execution are intentionally unavailable.

**Safety:** fixtures only, risk R0/R1, no model requests, no network tools, no payments, no wallet signing, no GitHub writes, no client messages, no deployment, no secrets, no autonomous actions, USD 0 synthetic budget. SHA-256 event digests are tamper-evident for the example snapshots but do not provide persisted or authenticated proof-of-custody. Test actor IDs are not authenticated identities.

## Initial verification

GitHub Actions [AgentOS Genesis Safety #38070509974](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38070509974): **SUCCESS, 14/14 tests**; synthetic demo emitted `AWAITING_HUMAN_APPROVAL`, `verifiedChain: true`, `actualExternalAgentActions: 0`, `reportedRevenueBrl: 0`. GitHub Actions [Monorepo Health #38070509963](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38070509963): **SUCCESS**.

[Typecheck #38070509948](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38070509948): **SUCCESS on exact head SHA**. [Build #38070509946](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38070509946): **PENDING at report update**, check before declaring exact-head CI fully green.

## Next gates before actual tool-calling agents

1. Review and merge code PR stack in dependency order; reviewers must not self-approve execution.
2. Authorized end-to-end UI/API, tenancy, CORS, SSO and source-to-deployment evidence.
3. Implement authenticated identities and isolated tenant permissions; prevent forged reviewer identity.
4. Store mission events durably with atomic append, idempotency and independently anchored signatures.
5. Implement genuine read-only AI/tool execution in sandbox with provider costs, model usage, evals and observability.
6. Exercise failure, prompt injection, exfiltration attempts, timeouts, cancellation, rollback and revocation.
7. Commercial pilot with real customer permission and measurement, independently reconciled invoices and revenue if any.
8. Evaluate G0–G7; **none is automatically approved by this document or the CI checks**.

No production change, financial operation, customer outreach, legal ownership assertion or published partnership is authorized by this artifact.
