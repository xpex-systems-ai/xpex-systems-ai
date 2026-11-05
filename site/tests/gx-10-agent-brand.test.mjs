import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/public-site.js', import.meta.url), 'utf8');

test('GX-10 public branding is Agents AI while historic system identities remain', () => {
  assert.match(source, /<b>XPeX<\/b> Agents AI/);
  assert.match(source, /document\.title=`XPeX Agents AI/);
  assert.match(source, /marca empresarial em transição da XPeX Systems AI/);
  assert.match(source, /systems-command/);
  assert.match(source, /wallet-command/);
});

test('GX-10 commercial presentation cannot be mistaken for a live checkout or submitted contract', () => {
  assert.match(source, /id="enterprise-services"/);
  for (const name of ['Agent Engineering','Agent Audit & Security','Agent Operations']) {
    assert.ok(source.includes(name), name);
  }
  assert.match(source, /Contato conduz ao canal institucional existente/);
  assert.match(source, /Não é formulário de contratação, checkout/);
  assert.match(source, /href="\/\?view=company#contact"/);
});

test('GX-10 preserves Earth robot and animated orbit source without modifications', () => {
  assert.match(source, /src="\/media\/gxeon-earth\.jpg"/);
  assert.match(source, /function orbitSVG\(\)/);
  assert.match(source, /xp-orbit-trail/);
  assert.match(source, /data-motion/);
});
