# XPeX AI Governance Framework — XAGF v1.0

**Status:** Proposed corporate standard  
**Owner:** XPeX Systems AI  
**Scope:** All AI systems, agents, models, connectors, datasets, infrastructure, products and third parties operated by or on behalf of XPeX Systems AI.

> **Build. Connect. Operate. Prove.**

## 1. Purpose

The XPeX AI Governance Framework (XAGF) establishes a single operating standard for trustworthy, secure and evidence-backed AI across the XPeX ecosystem.

XAGF is designed as an enterprise control framework, not a marketing claim and not a claim of certification.

It draws from internationally recognized practices including:
- NIST AI Risk Management Framework and Generative AI Profile;
- ISO/IEC 42001 AI management system principles;
- OWASP guidance for generative and agentic AI security;
- EU AI Act risk, transparency, human-oversight, logging, robustness and cybersecurity concepts;
- established secure-software, privacy, identity and incident-response practices.

## 2. Prime governance rule

> **THE EXECUTOR DOES NOT APPROVE ITS OWN DELIVERY.**

Execution, verification and approval are separate functions whenever risk is material.

## 3. Non-negotiable principles

1. **Evidence First** — important claims require evidence.
2. **Human Sovereignty** — humans retain authority over critical business, legal, financial, safety and access decisions.
3. **Least Privilege** — every person, model, agent and connector receives only the minimum permissions required.
4. **Bounded Autonomy** — autonomous action is constrained by scope, budget, tools, time and policy.
5. **Traceability** — material actions must be attributable to an identity, model, agent, tool, version and evidence trail.
6. **Defense in Depth** — no single control is assumed sufficient.
7. **Fail Closed** — when authorization, identity, policy or evidence is uncertain, high-risk execution stops.
8. **Separation of Duties** — creation, execution, verification and approval are separated for material risk.
9. **Provider Independence** — XPeX governance applies regardless of model or cloud provider.
10. **Continuous Assurance** — systems are re-evaluated when models, code, tools, data, permissions or context materially change.
11. **Truthful Transparency** — public claims never exceed verified internal evidence.
12. **Reversibility by Default** — prefer actions that can be rolled back, quarantined or revoked.

## 4. Governance lifecycle

```text
DISCOVER
  ↓
CLASSIFY
  ↓
ASSESS RISK
  ↓
AUTHORIZE
  ↓
BUILD / CONNECT
  ↓
EVALUATE
  ↓
DEPLOY
  ↓
MONITOR
  ↓
VERIFY
  ↓
REVIEW
  ↓
IMPROVE / RETIRE
```

No AI system becomes `VERIFIED_LIVE` solely because it deployed successfully.

## 5. Risk tiers

### R0 — Informational
No external side effect. Examples: summarization, internal search, read-only analysis.

### R1 — Low
Reversible internal actions with limited scope and no sensitive effect.

### R2 — Moderate
External writes, customer-facing content, production configuration, non-critical data changes, or actions with meaningful business impact.

### R3 — High
Credentials, sensitive personal data, financial commitments, production security, identity, legal commitments, critical infrastructure or large-scale autonomous actions.

### R4 — Critical
Actions that may materially affect safety, fundamental rights, major financial assets, irreversible infrastructure, regulated high-risk use cases or broad public impact.

Higher risk requires stronger identity, evaluation, logging, human oversight and approval.

## 6. Autonomous action classes

| Class | Example | Default control |
| --- | --- | --- |
| READ_ONLY | inspect repo, logs, dashboards | allowed within approved scope + audit trail |
| REVERSIBLE_INTERNAL | create draft, branch, temporary artifact | bounded autonomy + verification |
| EXTERNAL_WRITE | publish, message, change customer-facing state | policy gate + review according to risk |
| PRODUCTION_CHANGE | deploy/configure live system | pre-deploy checks + rollback + independent verification |
| CREDENTIAL / ACCESS | change permission, secret, identity | explicit authorized workflow + strong authentication |
| FINANCIAL | trade, transfer, payment, binding purchase | explicit approval or documented standing mandate with limits |
| DESTRUCTIVE | delete data, repo, service, production resource | explicit approval + backup/rollback evidence |
| SAFETY / RIGHTS CRITICAL | healthcare, employment, biometrics, critical services | specialized review and applicable legal controls |

## 7. Mandatory evidence

For material AI operations, the evidence record should capture where applicable:
- system ID;
- agent ID;
- human operator / approver;
- model/provider;
- model/version or routing policy;
- prompt/policy version;
- tool and connector;
- input classification;
- action performed;
- source-code commit;
- deployment/runtime identity;
- timestamps;
- authorization;
- cost;
- result;
- verification outcome;
- rollback state;
- incident linkage.

## 8. Minimum deployment gates

Before a system can be promoted to public `VERIFIED_LIVE`:
- canonical identity is known;
- code/source position is known;
- ownership/license status is known;
- security findings are within accepted tolerance;
- secrets are appropriately protected;
- required evaluations pass;
- production runtime is verified;
- logs and rollback exist;
- public claims are evidence-backed;
- high-risk actions have human-oversight policy;
- third-party dependencies are recorded.

## 9. Continuous governance

Governance is re-triggered by:
- model/provider change;
- new tool or connector;
- new permission;
- new sensitive data;
- major prompt/policy change;
- deployment architecture change;
- material incident;
- regulatory scope change;
- significant scale increase;
- new autonomous financial or external-write capability.

## 10. Security truth

No organization can promise absolute or “total” security.

XPeX commits instead to measurable controls, continuous verification, rapid containment, independent review and transparent evidence.

That is stronger than claiming perfection.
