# GXEON 16 — One-cent OpenAI API project hard-spend preflight

**Review time:** 2026-10-10 (Brazil local) | **State: SOURCE-ONLY / FAKE-ADMIN TESTED / BLOCKED FOR LIVE INFERENCE**

## User intent
Founder authorized preparation for **one synthetic OpenAI Responses inference at no more than US$0.01** conditional on project hard spend enforcement, server-only credentials, isolated runtime and independent review, and expressly requested a separate final confirmation BEFORE execution.

No final go/no-go was supplied. **No paid API inference, real admin API project GET or payment performed.**

## Technical outcome
- [Source draft PR #448](https://github.com/xpex-systems-ai/GXEON-AI/pull/448), stacked on [#447](https://github.com/xpex-systems-ai/GXEON-AI/pull/447) and previous draft chain.
- Implemented `projectBillingPreflight.ts`: strict check of official OpenAI admin response `project.spend_limit`, `threshold_amount:1` (one cent), `currency:"USD"`, `interval:"month"`, `enforcement.status:"enforcing"`.
- Optional **GET-only** administrative check for `/v1/organization/projects/{project_id}/spend_limit` with exact API hostname, no redirects, short timeout, no provider writes, no model tools, no paid inference. It is DISABLED by default and needs separately protected privileged administration credentials; nothing real was configured or read.
- `scripts/gxeon16-billing-preflight.mjs` returns `BLOCKED_ADMIN_READ_DISABLED` with zero remote/provider inference calls when not explicitly enabled.
- Even a hypothetical matching hard limit produces `BLOCKED_PENDING_OPERATOR_REVIEW`: current spend, credits, key security, isolation, independent review, provider propagation and final Go are not verified.

## Initial observed CI
- [GXEON16 offline billing preflight #38102142387](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38102142387): **SUCCESS 12/12** fake-provider tests; default-disabled CLI prints no real admin call and zero inference calls.
- [Genesis #38102142457](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38102142457): SUCCESS.
- [Monorepo Health #38102142424](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38102142424): SUCCESS.
- [Typecheck #38102142377](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38102142377): pending at initial documentation.
- [Build #38102142359](https://github.com/xpex-systems-ai/GXEON-AI/actions/runs/38102142359): pending at initial documentation.

## Operator-side next verification
1. Independent review of stacked code PRs (no merge or promotion).
2. Dedicated OpenAI API project with no other actors, valid billing/project access and **actual spend observed**, noting the ChatGPT subscription is separate.
3. Provider admin GET or manual operator dashboard inspection of **one-cent monthly hard limit actively enforcing**. A spend alert is not a hard limit.
4. Separate secured short-lived project API key. A privileged admin key must not be shared in any repository or public cloud service and need not be used if safer manual verification is available.
5. Verify a single-process server sandbox, no outgoing effects other than allowlisted model call, no retries, current pricing and model permission.
6. **New explicit founder confirmation** immediately before one possible paid synthetic Responses call; if even small provider spending overshoot is unacceptable, leave blocked.
7. Review actual token usage, reconcile provider billing, destroy short-lived keys and close proof record.

Current state: `HARD_LIMIT_NOT_VERIFIED`, `READY_FOR_INFERENCE=false`. **The system did not assert success from fake account data.**

Provider docs:
- https://developers.openai.com/api/docs/guides/spend-limits
- https://developers.openai.com/api/reference/typescript/resources/admin/subresources/organization/subresources/projects

Evidence First — no executor self-approval.
