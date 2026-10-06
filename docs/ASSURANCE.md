# XPeX Assurance Layer

XPeX separates **policy**, **implementation**, **verification** and **external certification**.

## Current assurance gates

| Gate | Purpose |
| --- | --- |
| Governance Validation | Validates XAGF structure and control catalog |
| Public Truth Validation | Blocks unsupported public product/partner claims |
| System Registry Validation | Validates System Packs, evidence and runtime truth |
| Trust Passport Validation | Validates System/Agent Trust Passports and AI-BOMs |
| Agent Security Validation | Validates GXEON role boundaries and high-risk gates |
| Secret Pattern Scan | Detects high-confidence secret patterns in the public repository |
| Workflow Supply Chain Validation | Requires immutable SHA pins for third-party GitHub Actions |
| CodeQL Security Analysis | Static security analysis for repository Python code |
| Dependency Review Readiness | Manual `workflow_dispatch` check; not a PR gate until Dependency Graph enforcement is enabled |

## GitHub-native vs XPeX-native

GitHub provides the execution and audit trail for GitHub Actions.

XPeX defines many of the validation rules.

A green badge means the configured workflow passed; it does **not** mean GitHub certified the company or the system.

## Trust Passport

Each flagship system and governed agent receives a Trust Passport across:

- identity;
- source/ownership;
- permissions;
- policy;
- secrets;
- evaluation;
- containment;
- runtime;
- evidence;
- supply chain;
- human oversight.

## External assurance

Future independent assurance may include:
- penetration testing;
- external AI red-team;
- SOC 2 audit path;
- ISO/IEC 27001 path;
- ISO/IEC 42001 path;
- legal/privacy reviews.

No external certification is claimed until formally earned.
