# GXEON 13 — Read-only Worker / Systems Command Contract

**Date:** 2026-10-10
**Evidence state:** Draft source; isolated *synthetic* worker exercised by GitHub Actions. NOT live LLM, not deployed, not admitted to G0–G7.
**Code PR:** [GXEON-AI #444](https://github.com/xpex-systems-ai/GXEON-AI/pull/444), stacked on [#443](https://github.com/xpex-systems-ai/GXEON-AI/pull/443), in turn stacked behind #442 → #440 → #439 → #438 → #436.
**Exact tested source head:** `6f986147a4b232ffa3cf70e74936c5ec1475cecf`.

## Verified result
- [Dedicated worker CI #38100294173](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38100294173): SUCCESS, **12/12 focused tests**, plus runnable deterministic worker demonstration.
- [Typecheck CI #38100294123](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38100294123): SUCCESS (backend and monorepo types).
- [Genesis Safety CI #38100294159](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38100294159): SUCCESS.
- [Health CI #38100294162](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38100294162): SUCCESS.
- [Build CI #38100294170](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38100294170): **IN PROGRESS at initial reporting**; check before stating success on exact head.

## Actual P1 technical contribution
- `artifacts/api-server/src/agentos/readOnlyWorker.ts`: deterministic **in-process read-only tool invocation** against three hardcoded synthetic Systems Command-shaped systems. Captures 4 risk flags including UNKNOWN_OWNERSHIP, EVIDENCE_NOT_VERIFIED and PRODUCTION_UNPROVEN. Tool call count = 2.
- `artifacts/api-server/src/routes/agentosGenesis.ts`: new **GET only** `/api/agentos/genesis/read-only-worker-demo`, fixed input, draft source, *not currently deployed*.
- `scripts/tests/agentos-readonly-worker-contracts.test.mjs`: 12 tests for immutable fixtures, counterfeit test grant denial, no real provider access, independent verifier recomputing findings, safe controls and report truth.
- `scripts/agentos-readonly-worker-demo.mjs`: runnable offline demonstration.
- `docs/agentos/SYSTEMS_COMMAND_READ_CONTRACT_V1.md`: source model mapping with the actual Systems Command Prisma `System`, `OwnershipClass` and `Evidence.verificationStatus` types, plus live connection security gates.

The successful demo inspects **3 synthetic systems** and derives **4 findings**. The mission stops at `AWAITING_HUMAN_APPROVAL` with an independent *logical* verifier, but **this is not an authenticated security boundary**.

## Explicit limits and claims not made
- No OpenAI Agents API/Responses API/LLM provider invocation; worker is deterministic, not model-driven.
- No call to actual Systems Command services or database. The bridge is a **contract**, not live API wiring.
- No persistence, real tenant authorization, key vault, policy decision point, or independently signed provenance.
- No GitHub provider reads/writes, customer data, real work, invoices, payment receipts, deploys, wallet actions or claimed revenue.
- Test fixed grant is not a legitimate credential and cannot authorize future real operations.
- Typecheck/Build and fixture CI success do not meet enterprise runtime, auth, security or release gates.

## Next release gates
1. Independent review/merge of stack in correct dependency order.
2. Authorized integration smoke from GXEON 11 and source ↔ runtime correlation on staging.
3. Versioned, least-privilege server-to-server Systems Command read API with validated tenant-scoped identity.
4. Durable, idempotent and authenticated mission event journal, cancellation, retries and failure recovery.
5. Genuine model-powered, read-only agent adapter in isolated sandbox with cost limits, prompt-injection and exfiltration tests, with separate approval.
6. Independent verifications, human approval flow and G0–G7 admission.
7. A valid pilot with customer permission and recorded costs/results before commercial claims.

**GXEON — Evidence First. Build. Verify. Prove.**
