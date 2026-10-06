# XPeX Enterprise Control Plane — V2

## Mission

XPeX Systems AI is evolving from a collection of software products into an **evidence-driven enterprise control plane for AI systems and agents**.

The design target is high-assurance engineering: explicit identity, least privilege, default-deny authorization, bounded autonomy, separated duties, verifiable runtime state, containment, provenance and continuous evidence.

This document describes an internal engineering standard. It does **not** claim equivalence to government, defense, intelligence, financial or other externally certified environments.

## Operating model

```text
HUMAN / ENTERPRISE
        |
        v
IDENTITY + ORGANIZATION POLICY
        |
        v
XPeX Systems Command
        |
        +-------------------+
        |                   |
        v                   v
XAGF Policy Engine      Evidence Graph
        |                   ^
        v                   |
GXEON Agent Runtime --------+
        |
        v
NEXARA / Approved Models
        |
        v
TOOLS / MCP / CLOUD / DATA
        |
        v
RUNTIME RESULT
```

## Security architecture

### 1. Identity plane
Every material human, machine, agent and system receives a stable identity.

Required properties:
- owner;
- subject type;
- environment;
- risk tier;
- authorization boundary;
- lifecycle state;
- evidence reference.

Machine identity must not silently inherit human authority.

### 2. Policy plane
XAGF is the policy layer.

Core rules:
- deny by default;
- least privilege;
- explicit allowlists;
- high-risk actions require approval;
- untrusted content cannot override trusted policy;
- production promotion requires evidence;
- exceptions are explicit, time-bounded and attributable.

### 3. Agent execution plane
GXEON agents operate inside bounded capability envelopes.

Every production-capable agent requires:
- Agent ID;
- manifest;
- permission policy;
- Trust Passport;
- tool scopes;
- time/step/budget limits;
- audit trail;
- tested containment;
- independent promotion decision.

### 4. Intelligence plane
Models provide reasoning capability, not authority.

Model selection must remain subordinate to:
- data classification;
- provider policy;
- task risk;
- capability requirements;
- cost/latency budgets;
- evaluation state.

A stronger model does not receive broader permissions automatically.

### 5. Data plane
Data access is governed independently from model capability.

Target controls:
- classification;
- tenant isolation;
- purpose limitation;
- retention/deletion;
- retrieval authorization;
- provenance;
- encryption through provider-native mechanisms;
- production/non-production separation.

### 6. Runtime plane
Deployments must be tied back to source and policy.

A production record should eventually answer:
- what code is running;
- which commit produced it;
- which environment it belongs to;
- which identities can change it;
- which data stores it reaches;
- which agents/models/tools it invokes;
- how to stop or roll it back;
- what evidence proves its current state.

### 7. Evidence plane
Material claims are represented as evidence records.

Target chain:

```text
CLAIM
  -> CONTROL
  -> IMPLEMENTATION
  -> TEST
  -> EXECUTION
  -> RESULT
  -> EVIDENCE
  -> INDEPENDENT VERIFICATION
  -> PROMOTION
```

## High-assurance engineering invariants

1. **No implicit authority.**
2. **No public claim stronger than its evidence.**
3. **No privileged agent without containment.**
4. **No production promotion from name recognition or screenshots alone.**
5. **No executor self-approves a material delivery.**
6. **No secret belongs in source control.**
7. **No unknown runtime state is treated as verified.**
8. **No third-party integration implies partnership without evidence.**
9. **No high-risk action bypasses its approval boundary.**
10. **Every material change must be attributable and reviewable.**

## Defense in depth

XPeX uses multiple independent layers:
- repository validation;
- source provenance;
- dependency/supply-chain validation;
- secret hygiene;
- CodeQL;
- OpenSSF Scorecard;
- agent permission validation;
- Trust Passports;
- runtime verification;
- human approval;
- kill switches;
- evidence preservation.

No single green badge is treated as complete security assurance.

## Production promotion standard

A system cannot reach `VERIFIED_LIVE` only because it responds over HTTP.

Required evidence includes, as applicable:
- canonical identity;
- source provenance;
- ownership/license position;
- production deployment evidence;
- healthy runtime observation;
- secret posture;
- supply-chain posture;
- rollback/containment;
- data-boundary review;
- agent/tool permission review;
- Trust Passport;
- unresolved blocker review.

## Enterprise boundaries

### Public
- sanitized system identity;
- verified status;
- approved architecture;
- public-safe evidence;
- assurance state;
- product documentation.

### Private
- credentials;
- customer data;
- security-sensitive findings;
- unrestricted infrastructure metadata;
- internal incident evidence;
- privileged runtime controls.

## Next operating phase

The next phase is **system admission**.

Priority discovery sources:
1. Vercel accounts and deployments;
2. official GitHub repositories;
3. Railway services;
4. databases and managed data platforms;
5. approved external integrations.

The first priority candidate is the **GXEON Agent Marketplace**. It remains a candidate until provider IDs, source lineage, runtime state, data stores and security evidence are observed.

See:
- `docs/SYSTEM_ADMISSION_GATES.md`
- `data/company/system-admission-queue-v1.json`
- `docs/TRUST_CENTER.md`

## Governance rule

> **THE EXECUTOR DOES NOT APPROVE ITS OWN DELIVERY.**
