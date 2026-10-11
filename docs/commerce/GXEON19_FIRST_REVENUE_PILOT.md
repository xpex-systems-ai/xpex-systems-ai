# GXEON 19 — LIVE Stripe checkout for human-supervised audit pilot

**State as of 2026-10-10:** Owner-confirmed LIVE Stripe merchant, product, BRL 497 price and active hosted Payment Link CREATED and read-back VERIFIED. Corporate landing source in draft PR #38, **not yet merged/deployed**. **No customer charge initiated by the assistant and no revenue verified.**

## Seller and authorization

- Connected Stripe LIVE account display name: **Xmente I.A** (Brazil, individual business type).
- The user explicitly confirmed ownership and authorization to sell XPeX Systems AI services through this account, and approved the **R$ 497.00 one-time price**.
- User authorization confirms permission to use this merchant; **it does not constitute an independent tax/legal certification** of the seller, nor verify a specific bank payout or refund process.
- Stripe reports `charges_enabled:true`, `payouts_enabled:true`.
- Payment method configuration read-back: **Card ON**, **Pix OFF**, **boleto OFF**. The account has a boleto capability but the default Checkout configuration does not enable it. Payment methods dynamically depend on customer eligibility and account settings.

## Verified LIVE Stripe objects

| Object | Value |
|---|---|
| Product name | GXEON Audit Engineer — Piloto Supervisionado |
| Product ID | `prod_VQ2NBeH0rvgnrJ` |
| Price ID | `price_1UPCIpHDcsx7lyoomYWYWzQf` |
| Price | BRL 497.00 **(49700 centavos)**, `one_time`, active |
| Payment Link ID | `plink_1UPCJMHDcsx7lyooR1D1d1kI` |
| Payment Link | https://buy.stripe.com/aFacN58mf8YXgjj0s91B60g |
| Link state | `active:true`, `livemode:true`, single quantity |
| Taxes | Stripe automatic tax `enabled:false`; tax/invoicing duties remain seller responsibilities |
| Recurring subscription | None |
| Promotions | Disabled |
| Provider customer charge | **None initiated by this execution** |
| Revenue recognized | **Not verified** |

Stripe accepted the product with default one-time price, and the live Payment Link was created separately. The system then retrieved the price, Payment Link and its line item from the LIVE Stripe account. The hosted checkout will create payment processing only when a **customer opens the link and completes checkout**.

## Product scope and customer expectations

GXEON Audit Engineer is a **human-supervised consulting service**, not a production autonomous agent, security certification, penetration test, on-chain product or guarantee of technical outcome.

The advertised offer covers **one authorized project/repository**; high-level architecture and dependency review, risks with reproducible evidence, prioritized remediation advice, human quality review and agreed handoff. No write access, automatic patches/merges, privileged account use or exploitation.

**Before execution:** Customer and seller must agree in writing on scope, assets, read-only permissions, delivery schedule, privacy/security treatment and cancellation/refund rules. The hosted link already permits voluntary payment, but payment **never** authorizes unscoped access or automatic work. If a customer pays before the scope is accepted, the seller must promptly agree a suitable scope or handle refund/cancellation according to applicable rules. Avoid collecting secrets through LinkedIn or Stripe custom fields.

## Payment reconciliation and fulfillment safety

The link is a **real payment entry point**. It is NOT a reliable signal that anyone has already paid:
1. The customer voluntarily pays through Stripe hosted Checkout.
2. Use a secure, independently verified Stripe event and/or read-only Stripe PaymentIntent/Checkout Session reconciliation to confirm successful payment, currency BRL, amount 49700, product/price ID and account identity. For delayed methods, wait until `paid`, not just `checkout.session.completed`.
3. Attach a receipt reference to an authorized customer order with idempotency; prevent duplicates and cross-customer linking.
4. Human owner confirms the customer scope, terms and authorized environment before any audit actions.
5. Independent reviewer validates the technical report and records accepted delivery.
6. Only then recognize verified payment and fulfillment in commercial records.

**Webhook status:** Not independently verified/deployed for this product; no automatic paid-status propagation claimed. Until a signed webhook is built and validated, rely on secure **manual Stripe dashboard/API reconciliation** and human review before fulfillment. The checkout includes descriptive metadata, but that does not replace event signature verification.

## Corporate integration

- Draft site route: `/?view=audit-pilot` (after independent PR review, merge and deploy).
- Draft page code: `site/src/audit-pilot.js` — approved price and verified checkout URL.
- Machine-readable source: `site/public/data/gxeon-audit-pilot-v1.json` — namespaced Stripe product/price/link identifiers, real checkout enabled but `verified_revenue_brl:null` and `webhook_verified:false`.
- Tests: `site/tests/gxeon19-audit-pilot.test.mjs` + corporate site build and security workflows.

### Pending before company-site launch

- Independent review of PR #38, all new CI checks PASS, accessibility/mobile smoke in Vercel preview, and owner approval to merge/deploy.
- Public privacy notice, service/consumer cancellation rules, legal seller identification and customer support details confirmed as necessary for this service.
- Stripe webhook reconciliation for scalable auto-processing (not needed to keep a hosted link active, but required before enabling automated fulfillment).
- First actual customer, invoice/tax document if applicable, accepted scope, human-reviewed report and verified paid receipt.

**Evidence First — Stripe LIVE link != successful customer payment, and the executor never approves its own delivery.**
