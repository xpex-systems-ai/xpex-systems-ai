# GitHub Repository Security — Admin Setup

These controls require repository/organization administration and cannot be truthfully claimed as enforced until GitHub itself confirms them.

## 1. Dependency Graph

Repository → **Settings → Security & analysis**

Enable:
- Dependency graph
- Dependabot alerts
- Dependabot security updates

After Dependency Graph is enabled, run the `Dependency Review Readiness` workflow and restore it as a required pull-request check if supported.

## 2. Secret Scanning

Repository → **Settings → Security & analysis**

Enable where available:
- Secret scanning
- Push protection
- Validity checks / partner patterns when offered

XPeX already runs an independent repository-level Secret Hygiene Validation, but GitHub-native secret scanning adds provider-aware detection and push-time blocking.

## 3. Private Vulnerability Reporting

Repository → **Settings → Security → Code security and analysis** (wording may vary)

Enable private vulnerability reporting so external researchers can report sensitive findings without opening a public issue.

## 4. Main Branch Ruleset

Repository → **Settings → Rules → Rulesets**

Create a branch ruleset targeting `main`.

Recommended:
- restrict deletions;
- block force pushes;
- require a pull request before merging;
- require at least 1 independent approval for material changes;
- dismiss stale approvals when new commits materially change the PR;
- require conversation resolution;
- require status checks to pass;
- require branch to be up to date where practical.

Target required checks after they have successful runs:
- Governance Validation
- Public Truth Validation
- System Registry Validation
- Trust Passport Validation
- Agent Policy Validation
- Secret Hygiene Validation
- Assurance Tests
- Action Supply-chain Validation
- CodeQL / Python

Add Dependency Review after GitHub Dependency Graph is enabled and the workflow passes.

## 5. Actions policy

Organization/repository Actions settings should prefer:
- allowed trusted actions;
- immutable commit SHA pinning;
- minimal GITHUB_TOKEN permissions;
- no write permission unless a workflow requires it;
- manual review for first-time external contributors where appropriate.

## 6. Verification

After settings are changed, re-audit through GitHub API/UI and update:

`data/security/security-posture-v1.json`

Do not convert `NOT_VERIFIED` to `VERIFIED` based only on intention.
