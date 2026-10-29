import test from 'node:test';
import assert from 'node:assert/strict';
import {SYSTEM_INTELLIGENCE} from '../src/data/system-intelligence.js';
import {OMNIX_SPECIALISTS,omnixSpecialistsMarkup,renderOmnixPortfolio,omnixPortfolioMarkup} from '../src/omnix-specialists.js';
import {omnixPage} from '../src/omnix.js';

test('GX051 six specialists remain browseable without claiming live provider connections',()=>{
  assert.equal(OMNIX_SPECIALISTS.length,6);
  assert.equal(new Set(OMNIX_SPECIALISTS.map(x=>x.id)).size,6);
  assert.deepEqual(OMNIX_SPECIALISTS.map(x=>x.id),['vercel','github','railway','agent-economy','web-api','commerce']);
  assert.equal(OMNIX_SPECIALISTS[0].state,'SYNTHETIC_PREVIEW');
  assert.equal(OMNIX_SPECIALISTS.slice(1).every(x=>x.state==='PLANNED'),true);
  const html=omnixSpecialistsMarkup();
  assert.equal((html.match(/data-omnix-specialist="/g)||[]).length,6);
  assert.equal((html.match(/data-connection-state="NOT_CONNECTED"/g)||[]).length,6);
  assert.equal((html.match(/<button type="button" disabled/g)||[]).length,6);
  assert.equal((html.match(/href="#omnix-example"/g)||[]).length,1);
  assert.equal((html.match(/href="#omnix-lead"/g)||[]).length,1);
  assert.equal((html.match(/href="\/\?system=/g)||[]).length,4);
  assert.ok(html.includes('Nenhuma conta será conectada'));
  assert.ok(html.includes('Conectar Vercel (indisponível)'));
  assert.ok(!html.includes('Integração ativa'));
  for(const item of OMNIX_SPECIALISTS)assert.ok(html.includes('id="ox-specialist-note-'+item.id+'"'));
});

test('GX051 evidence gallery reuses exact seven registered systems, without claiming new OMNIX audits',()=>{
  const html=omnixPortfolioMarkup();
  assert.equal(SYSTEM_INTELLIGENCE.length,7);
  assert.equal((html.match(/data-omnix-system="/g)||[]).length,7);
  for(const system of SYSTEM_INTELLIGENCE){
    assert.ok(html.includes('data-omnix-system="'+system.slug+'"'),system.slug);
    assert.ok(html.includes('href="/?system='+system.slug+'"'),system.slug);
    assert.ok(html.includes('Estado do catálogo: '+system.status),system.slug);
  }
  assert.equal((html.match(/sem nova auditoria OMNIX declarada/g)||[]).length,7);
  assert.ok(html.includes('não equivalem a auditoria independente'));
  assert.ok(!html.includes('AUDITADO E CERTIFICADO'));
});

test('GX051 portfolio metadata is escaped and invalid slugs cannot produce unsafe links',()=>{
  const forged={...SYSTEM_INTELLIGENCE[0],slug:'javascript:alert(1)',name:'<img src=x onerror=alert(1)>'};
  assert.equal((renderOmnixPortfolio([forged]).match(/data-omnix-system="/g)||[]).length,0);
  const valid={...forged,slug:'safe-slug',status:'<script>bad</script>'};
  const html=renderOmnixPortfolio([valid]);
  assert.ok(!html.includes('<script>'));assert.ok(!html.includes('<img'));
  assert.ok(html.includes('&lt;script&gt;bad&lt;/script&gt;'));
  assert.ok(html.includes('href="/?system=safe-slug"'));
  assert.throws(()=>renderOmnixPortfolio(null),/OMNIX_PORTFOLIO_INPUT_REQUIRED/);
});

test('GX051 OMNIX page contains anchored integration gallery, seven evidence dossiers and existing lead flow',()=>{
  const page=omnixPage();
  for(const id of ['omnix-specialists','omnix-evidence','omnix-example','omnix-request','omnix-lead'])
    assert.ok(page.includes('id="'+id+'"'),id);
  assert.ok(page.includes('data-omnix-specialist="vercel"'));
  assert.ok(page.includes('data-omnix-system="academy"'));
  assert.ok(page.includes('data-omnix-lead'));
  assert.ok(page.toLowerCase().includes('dados sintéticos'));
});
