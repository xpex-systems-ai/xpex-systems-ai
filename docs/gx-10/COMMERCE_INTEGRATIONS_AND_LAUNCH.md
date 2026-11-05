# GX-10 — Commercial storefront and provider integration runbook

**Status:** Enterprise preview implemented, buyer onboarding via email only. No unverified payment, marketplace listing or OAuth connection is claimed.

## Prospect path
Growth OS campaign/referral -> `/enterprise.html` (Black & Gold landing) -> inspect 3 scoped service products -> OMNIX synthetic demo or business email -> human qualification -> negotiated proposal -> written acceptance -> authorized execution -> independently reviewed evidence -> verified payment.

A deployment SHA/URL must be confirmed before the landing is put in an email campaign. After an approved production merge and smoke checks, canonical destination is `https://xpex-systems-ai.vercel.app/enterprise.html`.

Public machine-readable offer state: `/data/gx10-enterprise-services.json`. This JSON is NOT a live checkout catalog.

## Approved visual boundaries
- Keep `/media/gxeon-earth.jpg`, `orbitSVG()`, original home hero and animation controls unchanged.
- Product/enterprise lion badge: `site/public/brand/v4/xpex-agents-ai-lion.webp`.
- Derived from the founder-approved black/gold lion + blue-eye art, reduced to small display resolution. Retain the high-resolution original as offline source; do not scale the badge as a print master.
- Corporate global rename and replacing historic product logos is a separate brand migration approval.

## Coinbase — digital treasury
Existing: `GXEON-Wallet-Command-Center`, read-only connector/observation and ledger candidate.
- Separate custodial portfolio data from verifiable Base on-chain wallet address.
- Confirm corporate control, account access, USDC contract/network and permitted jurisdiction/fees.
- Configure read-only keys only inside managed secrets; deny signing by agents.
- For checkout, require explicit payment request, address verification, transaction receipt, confirmation status and contract reconciliation.
- Do not present portfolio trades, internal transfers or open orders as company revenue.
- No actual Coinbase products/catalog listings are created by the corporate page; commercial services are billed with independently verified payments.

## Mercado Pago — domestic treasury
Existing: `GXEON-AI/server/runtime/mercadoPagoAdapter.cjs`, `mercadoWebhookRuntime.cjs`, `paymentRuntime.cjs`, `financialDb.cjs`.
- Verify correct account and production credentials without exposing values.
- Validate approved PIX charge and server-side provider status, webhook signature, idempotency, replay and refund/chargeback states.
- Prevent simulated or pending charges from changing the Growth OS lead to PAID.
- This backend is distinct from Mercado Livre product listings. Do not reuse tokens or mix application scopes.

## Mercado Livre — separate marketplace channel
Existing GXEON code search did not establish an authorized seller OAuth application or active listings.
- Set up a **separate seller-owned application** in Mercado Livre DevCenter and verify account/entity eligibility.
- Use supported OAuth 2.0 authorization-code flow server-side; tokens stored encrypted, scoped, access controlled, rotated and revocable.
- Verify regional seller profile, categories and suitability of each product. Do NOT presume that digital courses, services, AI subscriptions or API credits qualify for arbitrary Mercado Livre listings.
- After eligible catalogue records are reviewed, build an isolated listing-draft adapter that validates listing attributes, allowed categories, commercial terms and product ownership.
- Require explicit approval of each draft before **any** external publication. Track provider ID and moderations after publication.
- Mercado Livre is a **sales marketplace**; Mercado Pago is the **Brazilian payments platform**. They require separate authorized applications/scopes.

Official documentation:
- https://developers.mercadolivre.com.br/crie-uma-aplicacao-no-mercado-livre
- https://developers.mercadolivre.com.br/autenticacao-e-autorizacao
- https://developers.mercadolivre.com.br/pt_br/tendencias/desenvolvimento-in-house
- https://developers.mercadolivre.com.br/pt_br/publicacao-de-produtos

## Growth OS integration
Project: `cmtengsethiklxkjmxzd` (previously ACTIVE_HEALTHY).
- Prior review found no CRM leads/organizations/users and no Vercel env configuration in the inspected project.
- Do not insert personal data or cross-tenant email records without verified organization membership, authentication, RLS policies and a consent/legitimate-interest assessment.
- No automatic lead import from the mailto button; the operator initially qualifies responses and records them manually once the CRM intake is customer-safe.
- Define immutable outcome fields: lead source, stage, contact consent, proposal acceptance, delivery acceptance, invoice reference, settlement evidence and currency.
- Suggested stage sequence: DISCOVERED -> QUALIFIED -> CONTACTED -> REPLIED -> PROPOSAL -> CONTRACTED -> DELIVERY -> ACCEPTED -> INVOICED -> PAID. Do not skip gates.

## Release gate
1. Source and images committed, CI green, preview READY and preview-source verified.
2. Check `/enterprise.html`, `/brand/v4/xpex-agents-ai-lion.webp`, `/?view=company#enterprise-services`, `/data/gx10-enterprise-services.json` with browser/mobile.
3. Founder confirms email inbound and approves business positioning/pricing.
4. No live payment/marketplace operations until provider-specific acceptance tests, identity/ownership, auth and settlement verification pass.
5. Merge only after human GO decision.
