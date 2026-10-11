# GXEON 19 — Product Launch & First Revenue

**Status: PILOT OFFER SOURCE IMPLEMENTED / NOT LAUNCHED / NO CUSTOMER CONTRACTED / NO VERIFIED REVENUE**

## Product positioning

**GXEON Audit Engineer**: a narrow technical assessment of **one customer-authorized repository or application**, using read-only inspection with human review, delivered as a written evidence report and remediation priorities.

The GXEON AgentOS runtime is not yet independently approved as a production-grade autonomous worker. This offer MUST NOT claim autonomous remediation or invasive security certification. Commercial service, if approved, will be a **supervised consulting engagement**.

## Proposed pilot product (NOT YET PRICE-APPROVED)

Internal trial pricing hypothesis: **R$497 one time** for an extremely bounded first engagement (one authorized project, standard report, one handoff call). This is a proposed price for unit-economics testing only. Published site must NOT state this price, and Stripe must NOT create a product/price/checkout until the owner explicitly approves scope, price, merchant account and billing terms. Unusual projects and security-sensitive access require separate quoting.

## Sales funnel — four evidence gates

| Stage | Minimum proof | Rule |
|---|---|---|
| LEAD | Message received from real requester, timestamp and intended scope | No identity assumptions, secrets or production access |
| QUALIFIED | Contact and ownership confirmed, authorized project and acceptance criteria | Treat as opportunity only, no fabricated client |
| OFFER_APPROVED | Signed or accepted scope, fee/currency, due date, access boundaries, privacy/cancellation policy | No provider tool usage before written authorization |
| CONTRACTED | Merchant verified, payment method/terms agreed and contract accepted | Never call the deal paid on checkout link or session creation |
| PAYMENT_CONFIRMED | Stripe verified webhook **plus** read-only Stripe API reconciliation of paid status, matching event, amount and currency | Independent human approves financial status |
| DELIVERED | Human-reviewed report and signed-off acceptance with reproducible evidence | No executor self-approval |

The public lead channel is an existing public LinkedIn profile. We do not publish a personal email, phone, or pretend an automated CRM exists.

## Deliverable contract

**In scope:** one authorized system; desktop/read-only assessment of architecture and project metadata; prioritized security/operations findings; citations to files/commits where possible; manual 30-minute handoff/consultation if separately agreed. Record unverified and out-of-scope conditions explicitly.

**Out of scope:** exploit testing, penetration tests, certification, privileged account access, merging, publishing production changes, access to unrelated tenants, guaranteed ROI or 24/7 monitoring. Any data processing requires a separate DPA/privacy review appropriate to customer situation.

**Acceptance:** reviewer different from initial executor verifies evidence sources and scope; customer receives document with inventory, findings, severity rationale, reproducibility, recommended actions and limits; deliverable marked accepted only after client approval.

## Customer intake and quote template

```
GXEON-AUDIT-PILOT (proposta ainda sob avaliação)
Cliente / responsável: [validar antes de preencher]
Projeto a auditar: [identificador público ou repositório autorizado; NÃO enviar segredos por mensagem]
Objetivo: [risco ou entrega priorizada]
Escopo de leitura autorizado: [arquivos, ambiente e horário]
Fora do escopo: [deixar explícito]
Preço e moeda: [aprovação separada]
Prazo: [acordo separado]
Privacidade e tratamento de dados: [validar política e consentimentos]
Revisor humano responsável: [pessoa distinta do executor]
Aceite e pagamento: [termos escritos + conciliação Stripe após confirmação de merchant]
```

## Accounting / Stripe LIVE gate

A connected LIVE Stripe merchant is **displayed as "Xmente I.A"**; this is NOT evidence that the entity or payout beneficiary is legally XPeX Systems AI. A future checkout must be independently authorized by the merchant owner and should use Stripe Checkout or Payment Links only after approving price and legal sale terms. No test-versus-live mismatch may be silently hidden.

Before writing to Stripe or making a payment link:
- [ ] Confirm legal owner, seller entity/registration, bank payout beneficiary and permission for XPeX-branded sale.
- [ ] Approve precise price, BRL currency, taxes, refund/cancellation rules, delivery schedule and customer service contact.
- [ ] Record Stripe live merchant/account ID privately and verify bank payouts; do not expose sensitive details to the public website.
- [ ] Implement/test idempotent Checkout Session or Payment Link creation and webhook verification with a secret from private server-side vault. Reject webhook replay, invalid signature, wrong product ID, currency/amount mismatch and duplicate receipt.
- [ ] Require Stripe payment reconciled before marking invoice or job PAID; paid Checkout URL does **not** prove money received.
- [ ] Get human go/no-go for live creation; keep financial actions separate from the existing AgentOS US$0.01 model-inference cost experiment.

No merchant mutation, Stripe product, Checkout Session, payment link, charge, invoice, payout or customer outreach is performed by this PR.

## Launch admission G0–G7 (not approved here)

G0: scope, legal seller identity and privacy. G1: customer authorization and tenancy. G2: model/runtime boundaries and no automatic write. G3: reproducible evidence and human reviewer. G4: controlled finances and processor webhook. G5: complaint/refund/contact policy. G6: integration smoke from staging. G7: founder approval and public-release provenance.

**Pilot launch should remain in draft until these gates are explicitly reviewed.**

## Links

- Draft microsite after approval and deploy: `https://xpex-systems-ai.vercel.app/?view=audit-pilot`.
- Machine-readable draft offer: `site/public/data/gxeon-audit-pilot-v1.json`.
- Source runbook and tests: `site/tests/gxeon19-audit-pilot.test.mjs`.
- Stripe checkout planning guidance: https://docs.stripe.com/payments/checkout and https://docs.stripe.com/payment-links.
- Independent release blocker: [GXEON-AI Issue #445](https://github.com/xpex-systems-ai/GXEON-AI/issues/445).

Evidence First — the executor does not approve its own delivery.
