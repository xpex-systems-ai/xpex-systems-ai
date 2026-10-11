import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { AUDIT_PILOT, auditPilotMarkup, maybeRenderAuditPilotPage } from '../src/audit-pilot.js';

const offer=JSON.parse(readFileSync(new URL('../public/data/gxeon-audit-pilot-v1.json',import.meta.url),'utf8'));
const landing=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const page=auditPilotMarkup();
const stripeUrl='https://buy.stripe.com/aFacN58mf8YXgjj0s91B60g';

test('owner-approved live Stripe product has exact one-time BRL 497 amount',()=>{
  assert.equal(offer.offer_id,AUDIT_PILOT.id);
  assert.equal(offer.product_status,'PILOT_LIVE_CHECKOUT_AVAILABLE');
  assert.equal(offer.payments_enabled,true);
  assert.equal(offer.sale_status,'LIVE_LINK_ACTIVE_CUSTOMER_PAYMENT_REQUIRED');
  assert.equal(offer.stripe_livemode,true);
  assert.equal(offer.published_price_brl,497);
  assert.equal(offer.stripe_checkout_amount_minor,49700);
  assert.equal(offer.stripe_checkout_currency,'brl');
  assert.equal(offer.stripe_product_id,'prod_VQ2NBeH0rvgnrJ');
  assert.equal(offer.stripe_price_id,'price_1UPCIpHDcsx7lyoomYWYWzQf');
  assert.equal(offer.stripe_payment_link_id,'plink_1UPCJMHDcsx7lyooR1D1d1kI');
});
test('only the verified Stripe link is displayed, no alternate checkout or higher price',()=>{
  assert.equal(offer.checkout_url,stripeUrl);
  assert.equal(AUDIT_PILOT.checkoutUrl,stripeUrl);
  assert.equal(AUDIT_PILOT.priceBrl,497);
  assert.match(page,/R\$ 497,00/);
  assert.match(page,/sem assinatura/);
  assert.equal((page.match(/https:\/\/buy\.stripe\.com\//g)||[]).length,2);
  assert.ok(page.includes(stripeUrl));
  assert.doesNotMatch(page,/R\$\s*1\.497|R\$\s*197/);
});
test('merchant authorization is user-confirmed, never presented as independent legal certification',()=>{
  assert.equal(offer.merchant_display_name,'Xmente I.A');
  assert.equal(offer.merchant_owner_authorization,'CONFIRMED_BY_USER_2026_10_10');
  assert.equal(offer.live_billing_approval_received,true);
  assert.equal(offer.requires_verified_merchant_owner,true);
  assert.doesNotMatch(page,/auditado juridicamente|certificado pela Stripe/i);
});
test('site routes audit pilot first and exposes navigation',()=>{
  assert.match(landing,/maybeRenderAuditPilotPage\(app, location\.search\)/);
  assert.match(landing,/href="\/\?view=audit-pilot"/);
  assert.ok(landing.indexOf('maybeRenderAuditPilotPage(app, location.search)') <
    landing.indexOf('maybeRenderBrandPage(app)'));
});
test('checkout requires voluntary customer action with scoped human review',()=>{
  assert.match(page,/Pagamento real processado pela Stripe/);
  assert.match(page,/após acordo do escopo, prazo e acesso autorizado/);
  assert.match(page,/revisão humana/);
  assert.match(page,/sem realizar alterações de produção/);
  assert.match(page,/href="https:\/\/buy\.stripe\.com\//);
  assert.doesNotMatch(page,/<form|<input|<script|payment_intent|api\/checkout/);
});
test('do not claim Pix or boleto enabled or fabricate recurring billing',()=>{
  assert.match(page,/Cartão habilitado; Pix e boleto não estavam habilitados/);
  assert.doesNotMatch(page,/Pix habilitado|Boleto habilitado|assinatura mensal/);
  assert.match(offer.payment_methods_note,/Pix\/Boleto OFF/);
});
test('public pilot does not claim actual sales, webhook reconciliation or autonomous workers',()=>{
  assert.equal(offer.customer_count_claimed,0);
  assert.equal(offer.verified_revenue_brl,null);
  assert.equal(offer.actual_payment_claimed,false);
  assert.equal(offer.webhook_verified,false);
  assert.equal(offer.paid_status_auto_reconciliation_enabled,false);
  assert.equal(AUDIT_PILOT.revenueClaimedBrl,0);
  assert.equal(AUDIT_PILOT.paidAutonomousAgentsClaimed,false);
  assert.equal(offer.requires_payment_webhook_and_reconciliation_before_paid_status,true);
  assert.doesNotMatch(page,/clientes pagantes|certificada por|receita comprovada|autonomous worker live/i);
});
test('service requires explicit project authorization and protects customer secrets',()=>{
  assert.equal(offer.requires_written_customer_authorization,true);
  assert.equal(offer.requires_independent_human_review,true);
  assert.match(page,/autorização/i);
  assert.match(page,/Não envie tokens, senhas/i);
});
test('router only activates on exact view',()=>{
  assert.equal(maybeRenderAuditPilotPage({innerHTML:''},'?view=other'),false);
  assert.equal(maybeRenderAuditPilotPage({innerHTML:''},'?view=audit-pilot-other'),false);
});
test('checkout and contact use safe external links and accessible navigation anchors',()=>{
  for(const id of ['entrega','metodo','seguranca','conversa']){
    assert.match(page,new RegExp('id="'+id+'"'));
  }
  assert.match(page,/lang="pt-BR"/);
  assert.match(page,/rel="noopener noreferrer"/);
  assert.match(page,/linkedin\.com\/in\/ceojuniorsena/);
});
