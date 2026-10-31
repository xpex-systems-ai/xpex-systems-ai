import assert from 'node:assert/strict';
import test from 'node:test';
import {SYSTEM_INTELLIGENCE} from '../src/data/system-intelligence.js';
import {PORTFOLIO_SHOWCASE,PORTFOLIO_GROUPS,publicProofUrl} from '../src/data/portfolio-showcase.js';
import {portfolioLabMarkup,initPortfolioLab} from '../src/portfolio-lab.js';
import {omnixOfficialFace} from '../src/omnix-face.js';

test('showcase contains each canonical system exactly once, no invented products',()=>{
  const slugs=PORTFOLIO_SHOWCASE.map(x=>x.slug);
  assert.equal(slugs.length,7);
  assert.equal(new Set(slugs).size,7);
  assert.deepEqual([...slugs].sort(),SYSTEM_INTELLIGENCE.map(x=>x.slug).sort());
  assert.equal(PORTFOLIO_GROUPS[0],'Todos');
  for(const x of PORTFOLIO_SHOWCASE){
    assert.ok(SYSTEM_INTELLIGENCE.some(s=>s.slug===x.slug&&s.id===x.id&&s.status===x.status));
    assert.equal(x.stages.length,3);
    assert.ok(x.context.length>40);
  }
});

test('gallery markup is bounded, accessible, explicitly illustrative and contains no private Drive URLs',()=>{
  const html=portfolioLabMarkup();
  assert.equal((html.match(/class="xp-ev-card" data-portfolio-card/g)||[]).length,7);
  assert.equal((html.match(/data-portfolio-filter="/g)||[]).length,PORTFOLIO_GROUPS.length);
  assert.match(html,/id="omnix-lab"/);
  assert.match(html,/role="status" aria-live="polite"/);
  assert.match(html,/ESQUEMA ILUSTRATIVO/);
  assert.match(html,/capturas originais e vídeos/);
  assert.match(html,/class="xp-ev-details"/);
  assert.doesNotMatch(html,/drive\.google\.com|docs\.google\.com|supabase_service_role|sk_live_|private_key/i);
  for(const s of SYSTEM_INTELLIGENCE) assert.match(html,new RegExp('href="/\\?system='+s.slug+'"'));
  const face=omnixOfficialFace();
  assert.match(face,/xp-ev-lab/);
  assert.equal((face.match(/id="omnix-lab"/g)||[]).length,1);
});

test('public evidence links require allowlisted HTTPS host and suppress private source',()=>{
  const privateSystem={source:{visibility:'PRIVATE',url:'https://github.com/xpex-systems-ai/private-example'}};
  assert.equal(publicProofUrl('https://github.com/xpex-systems-ai/private-example/docs/README.md',privateSystem),null);
  assert.equal(publicProofUrl('https://github.com/xpex-systems-ai/public-repo/blob/main/README.md',privateSystem),
    'https://github.com/xpex-systems-ai/public-repo/blob/main/README.md');
  for(const url of ['http://github.com/a/b','https://evil.example/private','javascript:alert(1)','https://github.com/a?token=123',
    'https://user:password@github.com/xpex-systems-ai/GXEON-AI', 'https://drive.google.com/file/d/private/view']){
    assert.equal(publicProofUrl(url,privateSystem),null,url);
  }
});

test('filter control only hides unmatched cards; never requests network access',()=>{
  const filters=PORTFOLIO_GROUPS.map(group=>({
    dataset:{portfolioFilter:group},handlers:{},attrs:{},
    classList:{toggle(){}},addEventListener(event,callback){this.handlers[event]=callback;},
    setAttribute(k,v){this.attrs[k]=v;}
  }));
  const cards=PORTFOLIO_SHOWCASE.map(x=>({dataset:{group:x.group},hidden:false}));
  const count={textContent:''};
  const lab={querySelectorAll(q){return q==='[data-portfolio-filter]'?filters:cards;},querySelector(){return count;}};
  assert.equal(initPortfolioLab({querySelector:()=>lab}),true);
  filters.find(x=>x.dataset.portfolioFilter==='Agentes').handlers.click();
  assert.equal(cards.filter(x=>!x.hidden).length,2);
  assert.match(count.textContent,/2 sistemas exibidos/);
  assert.equal(filters.find(x=>x.dataset.portfolioFilter==='Agentes').attrs['aria-pressed'],'true');
  filters[0].handlers.click();
  assert.equal(cards.filter(x=>!x.hidden).length,7);
  assert.equal(initPortfolioLab({querySelector:()=>null}),false);
});
