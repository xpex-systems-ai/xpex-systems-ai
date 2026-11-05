import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/public-site.js', import.meta.url), 'utf8');

test('GX-10 stages Agents AI offering and retains legacy public identity', () => {
  assert.match(source, /XPeX AGENTS AI \/ SERVIÇOS B2B/);
  assert.match(source, /<b>XPeX<\/b> Systems AI/);
  assert.match(source, /document\.title=`XPeX Systems AI/);
  assert.match(source, /systems-command/);
  assert.match(source, /wallet-command/);
});

test('GX-10 commercial presentation cannot be mistaken for a live checkout or submitted contract', () => {
  assert.match(source, /id="enterprise-services"/);
  for (const name of ['Agent Engineering','Agent Audit & Security','Agent Operations']) {
    assert.ok(source.includes(name), name);
  }
  assert.match(source, /mailto:gxeon\.ai@gmail\.com\?subject=/);
  assert.match(source, /Não envia dados automaticamente, não cria contrato/);
  assert.match(source, /não confirma pagamento/);
});

test('GX-10 preserves Earth robot and animated orbit source without modifications', () => {
  assert.match(source, /src="\/media\/gxeon-earth\.jpg"/);
  assert.match(source, /function orbitSVG\(\)/);
  assert.match(source, /xp-orbit-trail/);
  assert.match(source, /data-motion/);
});

test('GX-10 approved lion asset appears in enterprise service products only, preserving the Earth hero', () => {
  assert.equal((source.match(/class="xp-card gx10-product"/g) || []).length, 3);
  assert.equal((source.match(/src="\/brand\/v4\/xpex-agents-ai-lion.webp"/g) || []).length, 4);
  assert.match(source, /src="\/media\/gxeon-earth\.jpg"/);
  assert.match(source, /function orbitSVG\(\)/);
});

test('GX-10 financially honest Coinbase, Mercado Pago and Mercado Livre discovery', () => {
  assert.match(source, /Coinbase · USDC \/ Base/);
  assert.match(source, /Mercado Pago · PIX \/ BRL/);
  assert.match(source, /Mercado Livre · Canal de vendas/);
  assert.match(source, /Integração a homologar/);
  assert.match(source, /Cobrança live ainda não comprovada/);
  assert.match(source, /não confirma pagamento/);
});

test('GX-10 public catalog does not advertise live payment or listings', () => {
  const catalog = JSON.parse(fs.readFileSync(new URL('../public/data/gx10-enterprise-services.json', import.meta.url), 'utf8'));
  assert.equal(catalog.products.length, 3);
  assert.equal(catalog.sales_route.lead_import, 'not_automated');
  assert.equal(catalog.channels.coinbase.checkout_live, false);
  assert.equal(catalog.channels.mercadopago.checkout_live, false);
  assert.equal(catalog.channels.mercadolivre.listing_active, false);
  assert.ok(catalog.products.every(item => item.requires_contract));
});
