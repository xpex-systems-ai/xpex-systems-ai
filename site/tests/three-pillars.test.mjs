import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { ecosystemThreePillars } from '../src/ecosystem.js';

test('three entry points have explicit destinations and truthful access states', () => {
  const html = ecosystemThreePillars();
  assert.match(html, /data-three-pillars/);
  assert.match(html, /href="\/"[^>]*>Explorar a empresa/);
  assert.match(html, /https:\/\/xpex-portfolio-evidencias\.juniorsenax\.chatgpt\.site\/cases/);
  assert.match(html, /https:\/\/xpex-academy-mmpzzek1w-xpex-neural\.vercel\.app\/academia/);
  assert.match(html, /LOGIN CHATGPT/);
  assert.match(html, /PREVIEW RESTRITO/);
  assert.match(html, /não cria login compartilhado/);
  assert.match(html, /sem homologação para alunos reais/);
  assert.doesNotMatch(html, /<form|<input|service_role|secret_key/i);
});

test('public registry distinguishes access, stage, and limits without pretending SSO', async () => {
  const p = new URL('../public/data/xpex-ecosystem-three-pillars-v1.json', import.meta.url);
  const d = JSON.parse(await readFile(p, 'utf8'));
  assert.equal(d.schemaVersion,'1.0.0');
  assert.equal(d.pillars.length,3);
  assert.deepEqual(d.pillars.map(x=>x.id), ['xpex-company','xpex-evidence','xpex-academy']);
  assert.ok(d.pillars.every(x=>x.integration==='LINK_ONLY'));
  assert.equal(d.noAutomaticWrites,true);
  assert.equal(d.monetizationVerified,false);
  assert.equal(d.pillars[2].access,'invited-supabase-preview');
  assert.match(d.pillars[2].status,/E2E_PENDING/);
});
