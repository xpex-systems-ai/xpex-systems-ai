# GX-02.0 — Acceptance ledger

Execution verified on 2026-10-28 at corporate functional HEAD `096e96a9858bbd2c61a75281bd5e2b02a45cae90` and engine HEAD `23b981d3fd30d73e8351965d2762afca3aa07c45`. Final recommendation: **BLOCKED** for overall release. No human acceptance, merge, customer opening or production deployment is represented by this ledger. Subsequent corporate changes consolidate receipts only; consult the draft PR for its current documentation HEAD.

| Gate | State | Evidence / remaining condition |
|---|---|---|
| P01 Institutional preservation | PASS | 86 frozen files protected; 15 live pages retain content/links; 4 agents, 7 slugs, 20 lineages preserved |
| P02 Visual identity | PASS | Robot/Earth/logo/orbits/styles unchanged; source, actual PNGs, pixels and layout comparisons verified |
| P03 Corporate OMNIX | PASS | Existing route/menu/home/sample reused; no duplicate product site |
| P04 Architectural relationship | PASS | Contextual links at Audit OS and Audit Engineer; reciprocal technical link with Powered by wording |
| P05 Reused engine | PASS | No second audit implementation; existing #456 engine retained |
| P06 Existing APIs | PASS | 24 live JSON/MCP observations across production/initial/current preview; 8 enterprise tools / 11 GX tools / 7 offers |
| P07 Security | PARTIAL | No new runtime privileges/proxy/secrets; global engine dependency audit remains FAIL |
| P08 Regression | PASS | Six corporate commands + 3 source checks + 32 browser tests; engine 7 core CI jobs, 24 PGlite / 25 PostgreSQL / 1 grants test, 14 staging checks; legacy failures disclosed separately |
| P09 Real desktop/mobile visuals | PASS | 304 PNGs at 320/375/390/768/900/1024/1150/1440, dimensions asserted; original production and two real Git previews; comparison limits explicit |
| P10 Demonstration | PASS | Real Chromium download matches frozen 4185-byte synthetic report hash; controlled failure and unsent/inert local draft tested |
| P11 Remote frontend/API/DB | BLOCKED — AUTHORIZATION REQUIRED | No exact approved server/domain/access/conditions; synthetic corporate preview is not a remote audit runtime |
| P12 Commercial truth | PASS | Local draft remains unsent; no real registration, payment or revenue claim |
| P13 Production | BLOCKED — AUTHORIZATION REQUIRED | Specific release approval and operational acceptance absent |

Evidence: [local executions/failures](evidence/local-checks.json), [final corporate local commands](evidence/corporate-final-local.json), [32-test CI source/parents and all screenshot hashes](evidence/preservation-proof.json), [final engine CI](evidence/engine-final-ci.json), [engine artifact/source proof](evidence/engine-final-proof.json), [portable package](evidence/portable-package.json). The corporate CI checkout fcf75cbc has main + 096e96a parents; engine 50985847 has main + 23b981d parents. Both are clean synthetic CI merge checkouts, never actual PR merges. Engine status inventory: 42 complete external statuses, 12 success / 30 failure; 7 core jobs pass, but the entire repository is not green. Prior GX019 counts are not used as new proof. Test identities and automated distinct reviewer roles are synthetic, never independent human approval.
