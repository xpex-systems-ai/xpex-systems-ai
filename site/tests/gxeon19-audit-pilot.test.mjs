import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { AUDIT_PILOT, auditPilotMarkup, maybeRenderAuditPilotPage } from '../src/audit-pilot.js';

const offer=JSON.parse(readFileSync(new URL('../public/data/gxeon-audit-pilot-v1.json',import.meta.url),'utf8'));
const landing=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const page=auditPilotMarkup();

test('pilot metadata clearly shows enquiry only and no charge or autonomous agents',()=>{
  assert.equal(offer.offer_id,AUDIT_PILOT.id);
  assert.equal(offer.product_status,'PILOT_ENQUIRIES_ONLY');
  assert.equal(offer.sale_status,'NO_ACTIVE_CHECKOUT');
  assert.equal(offer.payments_enabled,false);
  assert.equal(offer.checkout_url,null);
  assert.equal(offer.published_price_brl,null);
  assert.equal(offer.verified_revenue_brl,null);
  assert.equal(AUDIT_PILOT.revenueClaimedBrl,0);
  assert.equal(AUDIT_PILOT.paidAutonomousAgentsClaimed,false);
});
test('draft pilot price exists only as an internal hypothesis, not a public price',()=>{
  assert.equal(offer.proposed_pilot_price_brl,497);
  assert.equal(offer.proposed_pilot_price_status,'INTERNAL_HYPOTHESIS_NOT_APPROVED_OR_PUBLISHED');
  assert.doesNotMatch(page,/R\$\s*497|US\$|checkout\.stripe\.com/i);
  assert.match(page,/preço definidos por proposta individual/i);
});
test('site routes pilot view first and exposes legitimate navigation links',()=>{
  assert.match(landing,/maybeRenderAuditPilotPage\(app, location\.search\)/);
  assert.match(landing,/href="\/\?view=audit-pilot"/);
  assert.ok(landing.indexOf('maybeRenderAuditPilotPage(app, location.search)') <
    landing.indexOf('maybeRenderBrandPage(app)'));
});
test('contact is a verifiable manual inquiry and not a fabricated checkout',()=>{
  assert.equal(AUDIT_PILOT.publicLeadChannel,offer.customer_intake_channel);
  assert.match(page,/linkedin\.com\/in\/ceojuniorsena/);
  assert.match(page,/não realiza pagamento nem contratação automática/i);
  assert.doesNotMatch(page,/<form|<input|<script|payment_intent|payment_link|stripe\.com/);
});
test('service scope is bounded, read-only, consent-first and subject to human review',()=>{
  assert.equal(offer.requires_written_customer_authorization,true);
  assert.equal(offer.requires_independent_human_review,true);
  assert.equal(offer.requires_verified_merchant_owner,true);
  assert.match(page,/autorização/i);
  assert.match(page,/revisão humana/i);
  assert.match(page,/sem realizar alterações de produção/i);
  assert.match(page,/Não envie tokens, senhas/i);
});
test('no false customer, payment, certified security or revenue claims are made',()=>{
  assert.equal(offer.customer_count_claimed,0);
  assert.equal(offer.requires_explicit_final_live_billing_approval,true);
  assert.equal(offer.requires_payment_webhook_and_reconciliation_before_paid_status,true);
  assert.doesNotMatch(page,/clientes pagantes|certificada por|receita comprovada|autonomous worker live/i);
});
test('router only activates with the exact requested view',()=>{
  assert.equal(maybeRenderAuditPilotPage({innerHTML:''},'?view=other'),false);
  assert.equal(maybeRenderAuditPilotPage({innerHTML:''},'?view=audit-pilot-other'),false);
});
test('page anchors are accessible and keep no private-data intake fields',()=>{
  for(const id of ['entrega','metodo','seguranca','conversa']) {
    assert.match(page,new RegExp('id="'+id+'"'));
  }
  assert.match(page,/lang="pt-BR"/);
  assert.match(page,/rel="noopener noreferrer"/);
});
