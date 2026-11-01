import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {connectorsPage} from '../src/connectors-page.js';
import {XPEX_CONNECT_SURFACES,XPEX_ENTERPRISE_PRODUCT} from '../src/data/xpex-connect.js';

test('catalogue lists five truthful connection surfaces without treating them as universal',()=>{
  assert.deepEqual(XPEX_CONNECT_SURFACES.map(x=>x.id),['rest','mcp','plugin','cli','skill']);
  assert.equal(new Set(XPEX_CONNECT_SURFACES.map(x=>x.id)).size,5);
  assert.equal(XPEX_ENTERPRISE_PRODUCT.canonical,'OMNIX AI');
  for(const s of XPEX_CONNECT_SURFACES){
    assert.match(s.stage,/disponível|pública|revisão/);
    assert.match(s.repo,/^https:\/\/github\.com\/xpex-systems-ai\//);
  }
});

test('public page has exactly five cards, no secret or real billing claims',()=>{
  const html=connectorsPage();
  assert.equal((html.match(/data-connect-surface=/g)||[]).length,5);
  assert.match(html,/MCP/);
  assert.match(html,/CLI/);
  assert.match(html,/skills/);
  assert.match(html,/sem autorização adequada/i);
  assert.match(html,/Não afirmamos conexão universal/);
  assert.doesNotMatch(html,/drive\.google\.com|service_role|sk_live_|SECRET_KEY|receita confirmada/i);
  assert.match(html,/OMNIX AI/);
  assert.match(html,/Growth OS/);
});

test('route and navigation are present without replacing existing pages',()=>{
  const src=readFileSync(new URL('../src/public-site.js',import.meta.url),'utf8');
  assert.match(src,/case 'connectors':content=connectorsPage\(\)/);
  assert.match(src,/\['home','agents','systems','plugins','developers','connectors','radar'/);
  assert.match(src,/view=developers/);
  assert.match(src,/view=plugins/);
  assert.match(src,/view=connectors/);
});
