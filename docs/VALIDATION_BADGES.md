# XPeX Validation Badges

The badges displayed in the XPeX corporate README are live GitHub Actions workflow status badges.

## What a green badge means

A green `passing` badge means:

1. the workflow exists in this repository;
2. GitHub Actions executed it;
3. the workflow finished successfully for its latest applicable run.

Examples:
- Governance Validation;
- Public Truth Validation;
- System Registry Validation;
- Trust Passport Validation;
- Agent Policy Validation;
- Secret Hygiene Validation;
- Assurance Tests;
- Action Supply-chain Validation;
- CodeQL.

## What a green badge does **not** mean

It does not mean:
- GitHub certified XPeX;
- ISO certified XPeX;
- NIST approved XPeX;
- OWASP certified XPeX;
- the entire company is secure;
- every external system passed the same test.

The workflow logic is part of XPeX's own control system. GitHub Actions is the execution and evidence infrastructure for those workflows.

## Evidence model

```text
POLICY
  ↓
TEST / VALIDATOR
  ↓
GITHUB ACTIONS EXECUTION
  ↓
PASS / FAIL
  ↓
WORKFLOW RUN + LOGS
  ↓
EVIDENCE
  ↓
IMPROVEMENT
```

## Stronger assurance

XPeX's target progression is:

```text
Internal policy
→ automated controls
→ independent verification
→ external assessment
→ formal certification where useful
→ continuous assurance
```

Badges are therefore **operational signals**, not decorative claims.
