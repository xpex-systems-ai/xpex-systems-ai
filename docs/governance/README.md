# XPeX AI Governance Framework (XAGF) v1.0

XAGF is the company-wide governance and assurance system for AI, agents, models, data, infrastructure and third-party integrations.

It is designed to be operational: policies should map to controls, controls to evidence, evidence to reviews, and reviews to decisions.

## Framework map

### Charter
- `AI_GOVERNANCE_CHARTER.md`

### Core control domains
- Agent Governance
- Human Oversight
- Model & Provider Governance
- Data & Privacy Governance
- AI Evaluation & Red Team
- Security Baseline
- Secure SDLC
- Third-Party & Supply-Chain Governance
- Incident Response
- Exceptions & Risk Acceptance
- Business Continuity & Recovery
- Audit & Evidence

### Control lifecycle

```text
Policy
  ↓
Control
  ↓
Owner
  ↓
Implementation
  ↓
Evidence
  ↓
Test
  ↓
Finding
  ↓
Remediation / Risk Acceptance
  ↓
Re-test
```

## Assurance levels

### AL0 — Unassessed
System discovered but governance status unknown.

### AL1 — Documented
Owner, purpose, data class and capabilities documented.

### AL2 — Controlled
Required baseline controls implemented.

### AL3 — Verified
Controls independently tested and evidence linked.

### AL4 — Continuously Assured
Monitoring, periodic re-evaluation and automated evidence collection are active.

No system may self-declare its assurance level.

## Framework references

XAGF is informed by recognized practices such as:
- NIST AI RMF and Generative AI Profile;
- ISO/IEC 42001 concepts for AI management systems;
- OWASP guidance for generative AI and agentic systems;
- secure software development and incident-response practices;
- applicable privacy and AI regulatory obligations.

XAGF does **not** claim certification, legal compliance or regulatory approval merely by adopting this framework.

## Operating rule

**THE EXECUTOR DOES NOT APPROVE ITS OWN DELIVERY.**
