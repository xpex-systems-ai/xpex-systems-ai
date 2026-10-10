# XPeX Enterprise Investor Readiness — Working Pack
Date: 2026-10-10. Status: DRAFT / EVIDENCE-GATED / NOT LEGAL ADVICE.

## Scope
Prepare XPeX for professional product demos, commercial validation, investor due diligence and potential asset/business sale. This is not a claim of investor readiness, business valuation, legal compliance or ownership.

## Operating facts and constraints
- Operating brand: XPeX Systems AI. Public founder-provided CNPJ: 63.369.339/0001-80; current MEI/individual entrepreneur treatment needs official updated verification.
- Founder supplied a Nubank PJ account declaration. Do not publish account identifiers, account statements or other financial secrets.
- No transfer of assets, banking actions, corporate changes, deploys or production writes authorized by this document.
- Keep company brand, registered legal name and ownership chain distinct.
- Equity sale cannot be assumed available within an MEI/individual entrepreneur structure; obtain independent legal/accounting review.
- Agent settlement funds, custody or third-party property must not be counted as enterprise assets without legal proof.

## Canonical sources
- docs/SYSTEM_ADMISSION_GATES.md (G0-G7)
- docs/DEMO_READINESS.md
- docs/PUBLIC_LAUNCH_CHECKLIST.md
- docs/PORTFOLIO.md
- docs/ASSURANCE.md

## Review sequence
1. Verify official business registration, occupation and tax suitability; retain official certificate privately.
2. Verify each repository, domain, cloud account, authorship, licenses, customer rights and contractual ownership.
3. Verify systems G0–G7 individually. Treat documented GREEN as demo candidate, not enterprise production.
4. Record finance, customers, revenue, costs, liabilities, traffic and proofs without guessed numbers.
5. Select one commercial wedge: evidence-driven inventory/audit with an authorized customer pilot.
6. Record security blockers and independent reviewer sign-off.
7. Build two tiers of diligence: sanitized public investor package and restricted confidential data room.

## Gate rules
PASS requires linked, dated evidence and reviewer. NOT_EVALUATED is never PASS. An executor cannot approve their own delivery. No investor-verified status without independent due diligence.

## Runtime evidence update — 2026-10-10
- [Provider Runtime Reconciliation](PROVIDER_RUNTIME_RECONCILIATION_20261010.md): Railway health-access log evidence, deployment/source correlation, Vercel source/production mapping, known security and integration blockers. HTTP public probes inconclusive; no G0–G7 gates promoted.

## Frontend / API integration review
- [Audit OS frontend ↔ backend review](AUDIT_OS_FRONTEND_BACKEND_REVIEW_20261010.md) documents current Vercel environment metadata, source route alignment, open security gates and the unmerged draft code patch in GXEON-AI#434.

## Mission 07 — Backend TypeScript recovery
- [Audit OS Backend TypeScript Recovery](AUDIT_OS_BACKEND_TYPE_RECOVERY_20261010.md): scoped draft PR, dedicated test suite, measured 68 → 45 diagnostics and remaining global CI blockers.

## Mission 08 — Operator preview route typing
- [Operator Route Type Recovery](OPERATOR_ROUTE_TYPE_RECOVERY_20261010.md): stacked PR #438, 9 resolved TS7030 errors, 36 remaining global errors; full release still blocked.

## Mission 09 — Operator Handoff & Client Offer
- [Operator Handoff Safety Recovery](OPERATOR_HANDOFF_SAFETY_RECOVERY_20261010.md): draft PR #439; contract tests pass 4/4; 36 → 19 TypeScript diagnostics; overall CI still blocked.

## Mission 10 — Sensitive R100 contracts
- [R100 Sensitive Contract Recovery](R100_SENSITIVE_CONTRACT_RECOVERY_20261010.md): backend TS errors 19→0, safety checks 8/8 pass, frontend release still blocked by 10 dashboard errors.
