# Model & Provider Governance

## Purpose

XPeX is provider-agnostic. Models and providers are selected by evidence, capability, risk, cost, latency, availability and contractual constraints.

## Provider registry

Every approved AI provider should have:
- provider ID;
- services used;
- regions where relevant;
- data-handling notes;
- retention/training terms where known;
- security/compliance evidence;
- contract/status;
- outage/fallback plan;
- approved data classes;
- review date.

## Model registry

Every material model used in production should record where practical:
- model name/version;
- provider;
- intended use;
- prohibited use;
- evaluation baseline;
- context-window/tool capability;
- known limitations;
- cost profile;
- release/change date;
- replacement/fallback.

## Routing governance

NEXARA-style routing must never be based only on lowest cost.

Routing policy may consider:
- capability;
- data sensitivity;
- jurisdiction;
- reliability;
- latency;
- price;
- safety/evaluation results;
- tool support;
- provider availability.

Sensitive workloads may restrict eligible providers.

## Change management

A material model version change should trigger re-evaluation when it can affect:
- accuracy;
- safety;
- tool behavior;
- output format;
- refusal behavior;
- latency/cost;
- privacy;
- regulated use.

## Third-party truth

Using OpenAI, Hugging Face, OpenRouter, Vercel or another provider does not imply formal partnership.

XPeX tracks relationship status separately:
`TECHNOLOGY_USED → INTEGRATION_AVAILABLE → PROGRAM_MEMBER → FORMAL_PARTNER → COSELL_PARTNER`.

## Fallback

Fallback must preserve policy.

A lower-cost or backup model cannot receive data or permissions that the primary model was prohibited from receiving.
