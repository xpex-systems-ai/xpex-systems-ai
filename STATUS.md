# XPeX Systems AI — Public Technical Status

**Snapshot:** 2026-10-06  
**Policy:** Evidence First

This page summarizes only status supported by current repository, workflow and deployment evidence.

## Corporate foundation

| Area | Status |
| --- | --- |
| Official corporate repository | **PUBLIC / Established** |
| Corporate manifesto | Established |
| Product architecture | Established |
| XAGF governance framework | **59 controls / 11 domains** |
| Verified System Standard | Established |
| Public System Packs | **2** |
| System Trust Passports | **2** |
| Agent Trust Passports | **6** |
| Governed GXEON target roles | **6** |
| Public product registry | Established |
| Provider relationship registry | Established |
| Public website | Not yet launched |
| Public Trust Center | Specification complete; implementation pending |

## Automated assurance

PR #9 pre-merge verification has passed these core checks on the current trust/security foundation:

- **Governance Validation — PASS**
- **Public Truth Validation — PASS**
- **System Registry Validation — PASS**
- **Trust Passport Validation — PASS**
- **Agent Policy Validation — PASS**
- **Secret Hygiene Validation — PASS**
- **Assurance Tests — PASS**
- **Action Supply-chain Validation — PASS**
- **CodeQL / Python — PASS**

Additional controls:

- **OpenSSF Scorecard** — configured; first main-branch execution pending.
- **Release Provenance Attestation** — configured for version tags/manual execution.
- **GitHub Dependency Review** — workflow prepared, but GitHub Dependency Graph is not currently enabled for this repository; the official action correctly refused to run.
- **Dependabot for GitHub Actions** — configured.

A passing badge means the corresponding workflow executed successfully. It is not an external certification.

## Runtime evidence

### XPeX Systems Command
- Canonical status: `CANONICAL`
- Environment: staging
- Provider: Railway
- Verified deployment: `13013067-a3e1-45fa-b2a7-124fd5198797`
- State at verification: `SUCCESS`
- Trust Passport: `TP1_DOCUMENTED`
- AI-BOM: present

### XPeX API Fabric
- Canonical status: `CANONICAL_CANDIDATE`
- Environment: production
- Provider: Vercel
- Deployment: `dpl_2Shq2ceHdj12tZzJ6HPv8RdPYPJb`
- State at verification: `READY`
- HTTP verification: `200 OK`
- Source commit: `5ba2e886a997c97c410e4bbabada659187912538`
- Trust Passport: `TP1_DOCUMENTED`
- AI-BOM: present
- Brand-ready: **No** — legacy branding/domain cleanup remains

## Agent truth

The six GXEON roles now have:
- stable Agent IDs;
- machine-readable permission manifests;
- deny-by-default capability policy;
- risk tiers;
- approved data classes/environments;
- step/time/retry/budget ceilings;
- explicit human-approval boundaries;
- kill-switch requirement;
- Trust Passports.

They are **not** represented as continuously autonomous production services. Runtime activation requires identity, tool scopes, evaluation, containment testing and approval.

## Repository-admin controls still pending verification

The GitHub integration used for this build cannot mutate or fully inspect administration-only security settings.

Current evidence shows:
- repository rulesets observed: **0**;
- branch protection: **not verified**;
- GitHub-native secret scanning: **not verified**;
- push protection: **not verified**;
- private vulnerability reporting: **not verified**;
- Dependency Graph: **not enabled at the latest official Dependency Review attempt**.

See `docs/GITHUB_SECURITY_SETUP.md`.

## Assurance truth

Overall XAGF foundation remains **AL1 — Documented**.

Individual controls may already be implemented or technically verified, but XPeX does not self-upgrade the whole company to AL2/AL3 until the required material controls are completed and independently assessed.

No external certification is currently claimed.

## Operating loop

```text
BUILD → CONNECT → OPERATE → PROVE → IMPROVE
```

## Next gates

1. Enable/verify GitHub admin security controls.
2. Complete first OpenSSF Scorecard run on `main`.
3. Run release provenance attestation on the first versioned assurance release.
4. Harden the public flagship runtime/brand.
5. Launch the public XPeX platform + Trust Center.
6. Apply the Verified System Standard to every new Vercel/Replit/Railway/Supabase system.
