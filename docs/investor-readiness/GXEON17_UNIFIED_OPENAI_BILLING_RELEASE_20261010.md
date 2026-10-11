# GXEON 17 — OpenAI API billing release gates unified (NOT activated)

Date of engineering: 2026-10-10 Brazil local. Status: **DRAFT CODE / OFFLINE TESTS PASSED / NO PAID INFERENCE / NO DEPLOY**.

## Purpose and scope

Consolidate the existing GXEON 12–16 mission framework into a *single* model-execution preflight path rather than leaving the paid model CLI independent of the billing inspection controls. The user's conditional permission remains **exactly one synthetic inference up to US$0.01, contingent on verified API project billing and a separate final Go**.

[Source draft PR #449](https://github.com/xpex-systems-ai/GXEON-AI/pull/449) is stacked on #448 → #447 → #446 → #444 → #443 → #442 → #440 → #439 → #438 → #436.

## What changed

- `artifacts/api-server/src/agentos/unifiedBillingGate.ts`: an operator-only, privileged read path that first verifies OpenAI project hard spend limit of **1 cent USD, month, enforcing** and then verifies a complete, project-scoped page of **monthly organization cost records** reporting zero for that project.
- The OpenAI API `GET /v1/organization/costs` call is filtered/grouped by the exact project, beginning on the UTC month's first day. Any positive, negative, malformed or foreign-project cost entry, HTTP error or pagination leads to fail-closed denial.
- `scripts/agentos-real-model-once.mjs`: now **requires** `verifyProjectBillingBeforePaidCall` before it can call the model provider. Existing per-call US$0.01 cap, synthetic-only data, explicit final Go and project-scoped API token restrictions remain.
- `scripts/tests/gxeon17-unified-billing-release.test.mjs` and dedicated offline workflow: fake-admin/provider tests confirm the read checks' order and the denied paid CLI.
- `docs/agentos/GXEON17_BILLING_RELEASE_GATES.md`: operating and risk runbook.

## Evidence from CI at source PR #449

- [Unified Billing Gate #38102829803](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38102829803): SUCCESS, **11/11 tests**.
- [GXEON16 Project Billing #38102829889](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38102829889): SUCCESS, **13/13 tests**.
- [Real Provider Contract #38102829798](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38102829798): SUCCESS, **18/18 tests**.
- [Genesis Safety #38102829781](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38102829781): SUCCESS.
- [Health #38102829808](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38102829808): SUCCESS.
- [Typecheck #38102829800](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38102829800): pending on initial report.
- [Build #38102829805](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38102829805): pending on initial report.

## Unverified / blocked (must not be claimed as completed)

1. No authenticated connector action to the user's OpenAI API Platform project, funding, billing balance, current spend or API keys is available in this flow.
2. No real OpenAI organization Admin GET or paid Responses API call was made; all successful checks used synthetic injected provider responses.
3. Provider usage/cost aggregation can lag, and **enforced spend limits are not instantaneous**. Zero reported monthly cost is not proof of zero in-flight usage; one-cent enforced limit is not a mathematically guaranteed absolute bill cap.
4. Short-lived project key, admin key, restricted isolated egress, independently reviewed G0–G7 admission, approved code merge and staging smoke remain outstanding.
5. **Final explicit user go/no-go** before the single paid request has not been provided. The previous US$0.01 maximum is a conditional authorization, not permission to execute.
6. There is no Stripe customer checkout/PIX invoice or revenue collection in this mission: an OpenAI API inference charge is an **operating cost**, not XPeX sales revenue.

The source is ready for independent review and controlled future pilot setup, **not ready for live billing execution** without above evidence.

## Official references
- https://developers.openai.com/api/docs/guides/spend-limits
- https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/projects
- https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/usage/methods/costs
- https://developers.openai.com/api/docs/models/gpt-5.6-luna

Evidence First. The executor does not approve its own delivery.
