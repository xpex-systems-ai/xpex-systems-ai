# XPeX Enterprise System Admission Gates — V1

## Purpose

Every application, marketplace, agent platform, API, database-backed product or internal control system enters the XPeX portfolio through the same evidence gates.

A gate may be **PASS**, **BLOCKED**, **NOT_APPLICABLE** or **NOT_EVALUATED**.

## Gate G0 — Discovery

Required:
- provider/account;
- provider object ID when available;
- project/repository/deployment name;
- timestamps;
- non-secret metadata;
- discovery evidence.

Outcome: a candidate exists. No ownership or production claim is implied.

## Gate G1 — Identity, source and ownership

Required:
- stable System ID;
- canonical candidate name;
- official source repository or explicit source position;
- fork/upstream lineage;
- license/ownership classification;
- source commit where available.

Blocking examples:
- unclear ownership;
- unknown source lineage;
- duplicate/colliding system identity.

## Gate G2 — Identity, data and access

Required:
- human/machine identity boundary;
- production/non-production separation;
- database/data-store inventory;
- data classification;
- least-privilege access model;
- secret-store location;
- tenant boundary where applicable.

Blocking examples:
- production secrets in source;
- shared unrestricted service credentials;
- unknown customer-data boundary.

## Gate G3 — Software supply chain

Required:
- dependency inventory;
- GitHub Actions pinning;
- CodeQL or applicable static analysis;
- secret scan;
- build provenance where available;
- SBOM target for enterprise-critical releases.

Blocking examples:
- unresolved critical vulnerability;
- untrusted mutable build dependency;
- unverifiable release source.

## Gate G4 — Runtime and resilience

Required:
- provider;
- environment;
- deployment ID;
- runtime URL/domain where public;
- source/deployment correlation;
- health observation;
- rollback/restore path;
- recovery expectations for critical services.

Blocking examples:
- unknown production deployment;
- no rollback for material write path;
- staging represented as production.

## Gate G5 — AI and agent security

Applies to AI/agentic systems.

Required:
- AI-BOM;
- model/provider registry references;
- Agent IDs;
- permission boundaries;
- high-risk approval policy;
- prompt-injection/tool-abuse evaluation where applicable;
- budget/time/step limits;
- kill-switch or revocation path.

Blocking examples:
- direct high-risk tool authority without approval;
- unbounded autonomous loop;
- production agent without tested containment.

## Gate G6 — Production assurance

Required:
- System Pack;
- Trust Passport;
- applicable XAGF controls;
- no unresolved critical blocker;
- evidence-backed `VERIFIED_LIVE` state;
- independent verification appropriate to risk.

Outcome: production state may be promoted.

## Gate G7 — Public and commercial promotion

Required:
- approved public name;
- public-safe URL;
- approved description;
- sanitized evidence;
- commercial status;
- founder/product approval;
- no unsupported partnership/certification claim.

Outcome: system may enter the public flagship/commercial portfolio.

## Admission sequence

```text
G0 DISCOVER
 -> G1 IDENTIFY
 -> G2 BOUND ACCESS & DATA
 -> G3 VERIFY SUPPLY CHAIN
 -> G4 VERIFY RUNTIME
 -> G5 VERIFY AI / AGENTS
 -> G6 ASSURE PRODUCTION
 -> G7 PUBLISH / COMMERCIALIZE
```

## Rule

**A system advances because evidence satisfies a gate, not because the system looks finished.**
