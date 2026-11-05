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
