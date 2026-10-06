# Repository Security Controls

## Target baseline

The public corporate repository should use:

- pull requests for material changes;
- required CI checks;
- least-privilege GitHub Actions permissions;
- dependency review;
- static analysis;
- secret hygiene scanning;
- supply-chain scorecard;
- immutable or reviewed provenance for releases;
- CODEOWNERS and separation of duties;
- Dependabot;
- no credentials in Git.

## Current enforcement truth

Some controls can be defined in source and verified through Actions.

Some controls require GitHub repository/organization administration, including branch protection/rulesets and certain security settings.

The connected GitHub integration currently exposes read-only ruleset visibility but not administrative branch-protection mutation. Therefore those controls must not be described as enforced until repository settings are independently confirmed.

## Required checks target

For `main`, the intended required checks are:

- Governance Validation
- Public Truth Validation
- System Registry Validation
- Trust Passport Validation
- Agent Policy Validation
- Secret Hygiene Validation
- CodeQL
- Dependency Review (on pull requests)
- OpenSSF Scorecard

## Merge policy target

- no direct production-critical change without review;
- no merge when required checks fail;
- executor must not be sole approver of material change;
- force pushes to protected canonical branches disabled;
- branch deletion controlled;
- signed/verified provenance encouraged for release artifacts.

## Security features

Where supported by the GitHub plan/account settings, enable:
- Dependabot alerts;
- Dependabot security updates;
- secret scanning;
- push protection;
- private vulnerability reporting;
- code scanning / CodeQL.

These settings must be verified in GitHub itself before being claimed as active.
