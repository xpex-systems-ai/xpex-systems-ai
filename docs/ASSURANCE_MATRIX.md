# XPeX Assurance Matrix

This view separates **policy**, **implementation**, **verification** and **external assurance**.

| Assurance area | Current state | Evidence |
| --- | --- | --- |
| Corporate governance | POLICY_DEFINED / IMPLEMENTED | XAGF, control catalog |
| Public truth controls | VERIFIED by CI execution | GitHub Actions workflow |
| System registry integrity | VERIFIED by CI execution | GitHub Actions workflow |
| Trust Passport structure | IMPLEMENTED | schemas + passports + validation |
| Agent identity & permission profiles | IMPLEMENTED | manifests + permission matrix |
| Agent runtime security tests | NOT VERIFIED | runtime activation pending |
| Secret hygiene in this repository | automated validation being added | workflow + scanner |
| Source-to-runtime evidence | PARTIAL / VERIFIED for registered deployments | System Packs |
| AI-BOM | IMPLEMENTED as evidence structure | per-system AI-BOM |
| SBOM / dependency provenance | PARTIAL | external workflow controls being added |
| Branch protection / required checks | NOT VERIFIED | repository admin enforcement pending |
| External penetration test | NOT PERFORMED | future independent assurance |
| SOC 2 | NOT CERTIFIED | future path if commercially justified |
| ISO/IEC 27001 | NOT CERTIFIED | future path if commercially justified |
| ISO/IEC 42001 | NOT CERTIFIED | future path if commercially justified |

## Rule

A green CI badge means the corresponding automated workflow passed.

It does **not** mean GitHub, NIST, ISO, OWASP or another organization certified XPeX.

## Progression

```text
Policy
  → Implementation
  → Automated Test
  → Independent Verification
  → External Assurance
  → Continuous Assurance
```
