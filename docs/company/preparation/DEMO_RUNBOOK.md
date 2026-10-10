# XPeX — Guided Company Demonstration

Target length: 12–15 minutes. Public review scope. No credentials, financial actions, third-party writes or customer data.

## Preparation

Open https://xpex-systems-ai.vercel.app/?view=company. Inspect the dated observation at `/data/company-demo-observations-v1.json` and confirm which checks actually ran. Repeat observations before a high-stakes live presentation. Available pages and declared provider states are not tests of every product workflow.

## Sequence

| Time | Surface | Show | Boundary |
| --- | --- | --- | --- |
| 0–2 min | Company preparation | Buyer hypothesis, proposed diagnostic and current evidence | Customer/revenue validation remains open |
| 2–5 min | Systems Command dossier | Source, runtime, identity, architecture and open gates | Staging; use operator access only in an authorized private session |
| 5–7 min | Audit OS | Audit interface and evidence/review model | A full customer diagnostic is a separate test |
| 7–11 min | Plugin Factory | Sample blueprint, validation, preview, generated ZIP and deterministic hash | Stateless compilation; no publication/installation/payment |
| 11–13 min | GXEON ecosystem | Actual public integration metadata and money boundaries | Coinbase/ledger authentication remains gated |
| 13–15 min | Company preparation | Dossiers, costs, next milestones and requested review | No acquisition approval or financial return claimed |

## Factory execution

The sample is at `/company/factory-demo.blueprint.json`. Its source is the Factory's public blueprint example. It contains public product metadata and no credentials.

The bounded verifier `python scripts/verify-company-demo.py`:

1. Requests six fixed public HTTP surfaces without authentication.
2. Calls Factory `/v1/validate` and requires a valid policy report.
3. Calls `/v1/preview` and records the preview paths.
4. Calls `/v1/package` twice and compares exact bytes.
5. Checks ZIP integrity, safe paths and expected manifests.
6. Submits the same sample with a loopback HTTP MCP URL and requires rejection.
7. Stores only public-safe observations and the generated demonstration artifact.

This verifier does not install or publish a plugin, call a paid x402 service, create a checkout or move assets. Generated artifacts require review before installation. Warnings in the recorded validation report remain visible.

## Stop conditions

If a step is unavailable or a policy check fails, show the failure and its scope. Use the dated dossier to explain the state, and leave the failed capability unverified. Avoid showing private documents or unredacted screenshots to a public audience.

## Independent acceptance

Ask a reviewer to repeat the sequence, record the timestamp and output hashes and note any discrepancy. Engineering execution is recorded separately from independent acceptance; the executor does not approve its own delivery.

## Factory correction and production boundary

A repeated public compilation exposed ZIP directory entries with the current clock. [Factory PR #23](https://github.com/xpex-systems-ai/XPeX-Plugin-Factory-/pull/23) removes those automatic entries; the regression test compiles the same blueprint under two different dates. All 34 local tests and three GitHub checks passed before merge (source commit `30d31b4d5ce5b31eebf43c0b5a07d360d239f367`).

The production observation is reported separately in `company-demo-observations-v1.json`. The connected Railway account does not expose the Factory project, so deployment control and exact source/runtime correlation remain unavailable. A valid sample ZIP demonstrates compilation only; if `repeat_identical` is false, deterministic production output has not passed acceptance. No unrelated service was redeployed.
