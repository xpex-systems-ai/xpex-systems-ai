# XPeX Assurance Chain

## Policy → Test → Execution → Result → Evidence

XPeX Systems AI treats governance as an executable system.

A policy alone is not proof.

A test alone is not proof.

A deployment alone is not proof.

A trustworthy claim is built from the full chain:

```text
POLICY
  ↓
CONTROL
  ↓
IMPLEMENTATION
  ↓
TEST
  ↓
EXECUTION
  ↓
RESULT
  ↓
EVIDENCE
  ↓
INDEPENDENT VERIFICATION
  ↓
APPROVAL / PROMOTION
```

## 1. Policy

Defines what must be true.

Example:

> High-risk agent actions require explicit approval boundaries.

Policy source:
- XAGF Charter
- Agent Governance Standard
- Financial Agent Controls

## 2. Control

Turns policy into a stable requirement.

Example:

`XAGF-AGT-004 — High-risk tool calls require approval policy.`

Control source:
- `data/governance/xagf-controls-v1.json`

## 3. Implementation

Represents the actual technical or procedural mechanism.

Examples:
- default-deny permission policy;
- agent manifest;
- kill-switch registry;
- environment separation;
- secret store;
- branch review.

## 4. Test

Checks the implementation.

Examples:
- Agent Security Validation;
- Trust Passport Validation;
- System Registry Validation;
- Secret Hygiene;
- CodeQL;
- Dependency Review;
- Supply-chain pinning validation.

## 5. Execution

Records the real operation.

Examples:
- GitHub Actions workflow run;
- Vercel deployment;
- Railway deployment;
- tool execution;
- agent task.

## 6. Result

Records what happened.

Examples:
- PASS / FAIL;
- deployment READY;
- HTTP 200;
- policy denied;
- rollback completed.

## 7. Evidence

Links result to a source that can be inspected.

Examples:
- commit SHA;
- deployment ID;
- provider API record;
- workflow run;
- System Pack evidence record;
- Trust Passport.

## 8. Independent verification

For material claims, the verifier is separate from the executor where practical.

> **THE EXECUTOR DOES NOT APPROVE ITS OWN DELIVERY.**

## 9. Promotion

Only after the chain is strong enough does XPeX promote a claim such as:
- `VERIFIED_LIVE`;
- `TP3_VERIFIED`;
- public flagship;
- formal partner;
- confirmed revenue.

## Example — current verified live system

### XPeX API Fabric lineage

**Policy:** public live claims require evidence.  
**Source:** official XPeX GitHub repository + source commit.  
**Execution:** Vercel production deployment.  
**Result:** READY + public HTTP 200.  
**Evidence:** System Pack records.  
**Trust state:** TP1_DOCUMENTED overall because security, containment and supply-chain assurance are still incomplete.

That distinction is deliberate.

A system can be live without being fully assured.

## Goal

The long-term XPeX platform should make this chain queryable:

```text
claim
  → control
  → system
  → test
  → run
  → evidence
  → verifier
  → current status
```

This is the foundation for the future public Trust Center and enterprise assurance dashboard.
