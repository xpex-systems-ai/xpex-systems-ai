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
| Enterprise Control Plane V2 | **Established / validated on main** |
| System admission gates | **G0→G7 established** |
| Public Trust Center | Engineering view established; product implementation pending |
| Portfolio Registry V1 | **Established / evidence-gated** |
| Vercel provider inventory | **3 connected accounts / 103 observed projects** |
| Consolidation target | **20 asset lineages → 10 systems → 5–7 flagships** |

## Automated assurance

Main-branch verification has passed these core checks on the current trust/security foundation:

- **Governance Validation — PASS**
- **Public Truth Validation — PASS**
- **System Registry Validation — PASS**
- **Trust Passport Validation — PASS**
- **Agent Policy Validation — PASS**
- **Agent Security Validation — PASS**
- **Enterprise Control Plane Validation — PASS**
- **Portfolio Registry Validation — PASS**
- **Secret Hygiene Validation — PASS**
- **Secret Pattern Scan — PASS**
- **Assurance Tests — PASS**
- **Action Supply-chain Validation — PASS**
- **Workflow Supply Chain Validation — PASS**
- **CodeQL / Python — PASS**

Additional controls:

- **OpenSSF Scorecard — PASS** on main.
- **Release Provenance Attestation** — configured for version tags/manual execution.
- **GitHub Dependency Review** — workflow prepared, but GitHub Dependency Graph is not currently enabled for this repository; the official action correctly refused to run.
- **Dependabot for GitHub Actions** — configured.

A passing badge means the corresponding workflow executed successfully. It is not an external certification.

## Runtime evidence

### XPeX Systems Command
- Canonical status: `CANONICAL`
- Environment: staging
- Provider: Railway
- Verified deployment: `13013067-a3e1-45b5-8bab-c747e87c3c35`
- State at verification: `SUCCESS`
- Trust Passport: `TP1_DOCUMENTED`
- AI-BOM: present

### XPeX API Fabric
- Canonical status: `CANONICAL_CANDIDATE`
- Environment: production
- Provider: Vercel
- Latest verified production deployment: `dpl_F3m3QDdobj76KgM7iBNYi4udEwyZ`
- State at verification: `READY`
- Source commit: `eb76188996c00604cd2d50aa89e7fd7bf9417f3c`
- Trust Passport: `TP1_DOCUMENTED`
- AI-BOM: present
- Brand-ready: **No** — legacy branding/domain cleanup remains

### Demo-ready portfolio signals
- **GXEON Audit OS:** Vercel production READY; no runtime error group observed in the latest 7-day query.
- **XPeX Studio AI:** Vercel production READY; no runtime error group observed in the latest 7-day query.
- **XPeX Plugin Factory / GXEON Agent Gateway:** Railway deployment SUCCESS; public Railway domains present.
- **GXEON Wallet Command Center:** Vercel production READY; one repeated Node `url.parse()` deprecation warning remains a demo hardening item.
- **XPeX Academy:** legacy Vercel deployments are intentionally CANCELED after decommissioning that path; canonical Firebase/Railway runtime still requires provider-backed correlation.

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

1. Enable/verify GitHub admin security controls and required main-branch enforcement.
2. Consolidate 103 observed Vercel projects into 20 material lineages, 10 portfolio systems and 5–7 flagships.
3. Remove the Wallet Command Center runtime deprecation warning and run a clean external-demo smoke pass.
4. Resolve XPeX API/Marketplace canonical identity + Supabase lineage and connect/verify the canonical XPeX Academy Firebase/Railway runtime.
5. Build public case pages for the flagship set and the founder engineering profile.
6. Convert verified System Packs and Trust Passports into the public XPeX Systems Command / Trust Center dashboard.
7. Run release provenance attestation on the first versioned enterprise-assurance release.
