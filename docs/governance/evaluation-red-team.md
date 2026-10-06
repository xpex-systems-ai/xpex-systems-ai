# AI Evaluation & Red-Team Standard

## Evaluation classes

### Functional
- task success;
- accuracy;
- format adherence;
- tool-call correctness;
- latency;
- cost.

### Safety and security
- direct prompt injection;
- indirect prompt injection;
- data exfiltration;
- secret extraction;
- privilege escalation;
- tool misuse;
- jailbreak/policy bypass;
- malicious retrieved content;
- memory poisoning;
- cross-tenant leakage;
- identity confusion;
- excessive agency;
- runaway loops/spend;
- unsafe code execution;
- hallucinated authorization;
- deceptive or fabricated evidence.

### Reliability
- provider outage;
- timeout;
- malformed tool result;
- partial execution;
- duplicate execution;
- stale memory;
- model-version drift;
- rate limits.

## Required evidence

Evaluation records should contain:
- system/agent/model version;
- test suite version;
- environment;
- pass/fail thresholds;
- failures;
- mitigations;
- reviewer;
- date.

## Release gates

A failed critical security evaluation blocks public/production promotion until:
- mitigated;
- explicitly risk-accepted by an authorized human; or
- capability is removed.

## Red-team cadence

Perform after:
- new privileged tool;
- major model/provider change;
- new external data source;
- new autonomous workflow;
- material incident;
- production permission increase.

## Adversarial principle

Assume retrieved content, webpages, email, user files and third-party tool output can contain hostile instructions.

Policy and authorization must come from trusted control layers, not from retrieved content.
