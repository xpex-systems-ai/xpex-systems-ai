# GXEON 15 — Real Provider Sandbox P3: gated transport, NOT ACTIVATED

Date: 2026-10-10 (America/Sao_Paulo, work initiated).
Status: **DRAFT SOURCE / GATED REAL RESPONSES TRANSPORT / NO PAID MODEL CALL / NO DEPLOY / NO CUSTOMER DATA**.

## Project chain
- [Draft GXEON source PR #447](https://github.com/xpex-systems-ai/GXEON-AI/pull/447), stacked on draft #446 → #444 → #443 → #442 → #440 → #439 → #438 → #436.
- Source head (approval-aligned preflight): `f25e10bebec1edc26ef898c0f8e25c58c9fa89cd`. Check for additional changes before declaring final CI.
- Live provider connection is an **operator-only CLI integration capability**, not an active service or deployed public endpoint.
- Provider selection: OpenAI Responses API, fixed `gpt-5.6-luna`, only 3 fictional Systems Command-shaped systems, strict JSON schema, no model tools.

## Delivered
- `artifacts/api-server/src/agentos/realModelSandbox.ts`: fixed HTTPS API endpoint, 15-second AbortSignal timeout, one request per process, zero retry, no redirect, no user-supplied prompt/endpoint or external tools.
- Operator-approved budget gate: explicit opt-in, synthetic-only environment, one-shot confirmation string, independently fresh (24h) pricing attestation, separate private API key, positive operator cap limited to **<= US$0.01**, matching the user's conditional authorization; requires explicit project ID bound in `OpenAI-Project` header, required preflight conservative reservation estimate.
- Provider usage is checked and reported as estimated cost **not reconciled invoice/billing**. If request aborts/timeout occurs, provider might still charge; process-local one-shot gate is **not** a distributed hard spending cap. Vendor-side project budget/limit required before production.
- `scripts/agentos-real-model-once.mjs`: server-side CLI unavailable to public HTTP clients, disabled if env gates are absent.
- `scripts/tests/agentos-real-provider-contracts.test.mjs`: 18 fake-provider tests against injected fetch, no network or API-key in CI.
- `.github/workflows/agentos-real-provider-gate.yml`: no-network safety CI + negative command-startup test.
- `docs/agentos/REAL_MODEL_SANDBOX_P3.md`: release gates, pricing and credential instructions. No secrets stored in repository.

## Verified initial CI at corrected commit
- [Provider Safety #38101184856](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38101184856): **SUCCESS; 18/18 tests and operator CLI denial without approval**.
- [Genesis Safety #38101184868](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38101184868): SUCCESS.
- [Monorepo Health #38101184881](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38101184881): SUCCESS.
- [Typecheck #38101184860](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38101184860): **SUCCESS on corrected head**.
- [Build #38101184852](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38101184852): **SUCCESS on corrected head**.

## Admission and safety facts
- NO paid OpenAI API call, no real model output obtained. Validation used fake transport in GitHub CI only.
- NO API key was read from a connected account, used or committed.
- No remote Systems Command contact, production deploy, customer data, money movement, wallet signing, Stripe checkout, real invoice, sale or revenue.
- No live authenticated operator/tenant model, durable idempotent journal, cloud sandbox attestation, egress firewall or provider cost reconciliation implemented in this PR.
- G0–G7 NOT approved; all draft PRs still require code review and ordered merge before release.

## Follow-up gates
1. Obtain independent approval of code PR stack and risk controls; complete staging GXEON 11 smoke and provider access review.
2. Ask operator to explicitly approve an amount in USD for **one** paid synthetic model call, with separate limited-billing provider project and private API key. Do not enable by mere presence of a ChatGPT account.
3. Check model availability, prices, API/retention policy and project quota at execution date. Confirm operator-side spending safeguards and actual charge reconciliation.
4. Only after signed consent and environment verification, execute one provider request from isolated server-only process; capture redacted response status, usage and provider-side invoice evidence.
5. Re-test security injection, failure/aborts, tenancy and independent verification. Only then advance toward non-synthetic read-only data.
6. No production promotion without independent G0–G7 gate approvals.

External technical references:
- https://developers.openai.com/api/docs/models/gpt-5.6-luna
- https://developers.openai.com/api/reference/resources/responses/methods/create
- https://developers.openai.com/api/docs/guides/structured-outputs

Evidence First. THE EXECUTOR DOES NOT APPROVE ITS OWN DELIVERY.

## Operator authorization update: one paid call up to US$0.01, still NOT executable

The user conditionally authorized **only one synthetic paid request** up to **US$0.01**, subject to reviewing the code, setting the project billing hard spend limit, protecting an ephemeral API key and obtaining **a final confirmation before executing**.

Code adjusted on source draft PR #447: local budget ceiling is now US$0.01 (previously US$0.05), an explicit `GXEON15_OPENAI_PROJECT_ID` environment variable is required to bind accounting, and negative tests cover higher caps/missing project header. [Updated provider-gate CI #38101552326](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38101552326): SUCCESS, 18/18 fake-provider tests and negative CLI start. Updated Typecheck/Build are pending as of this report revision.

**Provider project ID, actual hard spend-limit enforcement, available API billing, valid key, project isolation and price update timestamp have not been independently verified.** The current connection set does not provide an authenticated OpenAI API billing/project admin tool. Do not set a credential, invoke the CLI, merge, deploy or make a charge on this evidence alone.

Hard spend limits are available but can allow a small amount of overshoot during propagation: https://developers.openai.com/api/docs/guides/spend-limits.
