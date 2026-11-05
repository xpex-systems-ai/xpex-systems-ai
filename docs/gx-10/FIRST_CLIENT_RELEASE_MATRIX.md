# GX-10 / First customer operational release matrix

**Updated:** 2026-11-04 (read-only audit + changes committed to draft PR #52).
**Scope:** XPeX Agents AI corporate discovery and a narrowly scoped first B2B audit/integration pilot.
**Rule:** no production activation, no real client data, no payment, no external claim without evidence.

| Control | Observed | Release gate | Decision |
|---|---|---|---|
| Institutional site | Public code and Vercel preview flow exist | preservation + browser + exact-SHA preview | PENDING_CI |
| Earth hero | Source asset `/media/gxeon-earth.jpg` and orbital SVG untouched by GX-10 | pixel comparison at 8 viewports | PENDING_CI |
| Agent service inventory | Four agent-facing public descriptions, seven system profiles | keep maturity and limitations explicit | DISCOVERY_READY |
| First paid offer | `docs/gx-10/FIRST_CLIENT_OFFER_AND_ACCEPTANCE.md` | approve scope, price, legal terms | REVIEW_REQUIRED |
| OMNIX | Synthetic `vercel.json` sample, 2 bounded checks | independent operator/client-data gate | DEMO_ONLY |
| Public contact | `mailto:gxeon.ai@gmail.com` opens message in visitor email client | founder tests inbound delivery and replies | MANUAL_ROUTE |
| Growth OS | Supabase `cmtengsethiklxkjmxzd` ACTIVE_HEALTHY; commercial tables had 0 rows | establish owner/tenant membership, auth and tests | BLOCKED_REAL_INTAKE |
| OMNIX database | `bdxqxunosdkdvnxuamid` INACTIVE | review restoration, isolation and costs | BLOCKED |
| Coinbase | Wallet card and read-only connector; Base address ownership not verified | managed credentials + verified wallet and receipts | NOT_PAYMENT_READY |
| Mercado Pago | PIX adapter/webhook/ledger code in GXEON-AI; historical production report failed | secrets, signed webhook, DB, real provider-confirmed settlement | NOT_PAYMENT_READY |
| GXEON engine | PR #456 draft; global dependency audit failed | remediate audit and review | BLOCKED |
| Data protection | Public synthetic sample only | consent, DPA/LGPD and secure intake | NO_CUSTOMER_FILES |

## Launch scope safe to promote after CI
- Corporate presentation for XPeX Agents AI in an additive company section.
- Honest description of three service lines.
- Contact by an existing business email.
- Public read-only portfolio and OMNIX synthetic demo.
- No claim that a customer is contracted or that payment links are live.

## Operating procedure for first lead
1. Founder receives an inquiry to the mailbox and verifies the sender.
2. Qualify business problem and minimum technical scope using only non-sensitive descriptions.
3. Confirm buyer authority, needs, budget and agreed next step.
4. Create a lead in **verified authenticated** Growth OS; if missing, track privately outside public code until it is ready.
5. Send a scoped commercial proposal after human review; no work before acceptance.
6. Sign/accept written terms and grant least-privilege access for the approved scope.
7. Execute bounded checks, record source version/test receipts and have an independent reviewer.
8. Obtain delivery acceptance and issue approved payment request through validated provider.
9. Reconcile payment with customer/contract; update stage to PAID only on verified evidence.
10. Preserve only necessary evidence, with clear retention and access control.

## Security and finance stop conditions
- Any request to email secrets or upload client files to a public demo.
- Any provider without valid authentication/identity and verified payment state.
- Any attempt to grant agents signing keys or unbounded production access.
- Any request for fabricated customers, certifications, payments or audit outcomes.
- Any non-authorized change to existing protected systems or the institutional Earth animation.

## First customer handoff checklist
- [ ] Human reviews business name and company registration/contracting entity.
- [ ] Founder tests `mailto` end-to-end.
- [ ] CI preservation all green.
- [ ] Founder approves proposal template and commercial price after discovery.
- [ ] Data security handling approved.
- [ ] CRM intake/tenant auth validated OR first customer managed manually.
- [ ] Payment collection details verified independently; not based on screenshots.
- [ ] Owner confirms launch GO/NO-GO and keeps merge separated from financial actions.
