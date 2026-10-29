import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';

const routes=['/','/?view=omnix','/?view=agents','/?view=agents&agent=audit-engineer','/?view=ecosystem','/?view=systems','/?system=audit-os','/?system=plugin-factory','/?view=plugins','/?view=developers','/?view=radar','/?view=company','/?view=brand','/?view=privacy','/?view=terms'];
for(const route of routes)test('institutional page '+route,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  expect((await page.goto(route)).status()).toBe(200);
  await expect(page.locator('main h1').first()).toBeVisible();
  await expect(page.locator('.xp-footer')).toBeVisible();
  await expect(page.locator('#xp-navigation a')).toHaveCount(6);
  for(const a of await page.locator('a[target="_blank"]').all())expect(await a.getAttribute('rel')).toContain('noreferrer');
  expect(errors).toEqual([]);
});

test('navigation opens, closes, Escape restores focus and all target widths fit',async({page})=>{
  for(const width of [320,375,390,768,900,901,1024,1150,1440]){
    await page.setViewportSize({width,height:900});await page.goto('/');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    const toggle=page.locator('.xp-menu-toggle');
    if(await toggle.isVisible()){
      await toggle.click();await expect(toggle).toHaveAttribute('aria-expanded','true');
      await expect(page.locator('#xp-navigation a').first()).toBeVisible();
      await page.keyboard.press('Escape');await expect(toggle).toHaveAttribute('aria-expanded','false');await expect(toggle).toBeFocused();
      await toggle.click();await page.locator('#xp-navigation a[href="/?view=omnix"]').click();
      await expect(page).toHaveURL(/view=omnix/);await expect(page.locator('.xp-menu-toggle')).toHaveAttribute('aria-expanded','false');
    }else{
      const rects=await page.locator('.xp-header>.xp-brand,#xp-navigation,.xp-demo-link').evaluateAll(xs=>xs.map(x=>{const r=x.getBoundingClientRect();return {left:r.left,right:r.right};}));
      expect(rects[0].right).toBeLessThanOrEqual(rects[1].left);expect(rects[1].right).toBeLessThanOrEqual(rects[2].left);
      await page.locator('#xp-navigation a[href="/?view=omnix"]').click();await expect(page).toHaveURL(/view=omnix/);
    }
  }
});

test('all agents, availability, filters and seven system pages remain usable',async({page})=>{
  await page.goto('/?view=agents');await expect(page.locator('[data-agent-kind]:visible')).toHaveCount(4);
  for(const [filter,count]of [['Auditoria',1],['Integração',2],['Conhecimento',1],['Todos',4]]){
    await page.getByRole('button',{name:filter,exact:true}).click();await expect(page.locator('[data-agent-kind]:visible')).toHaveCount(count);
  }
  for(const agent of ['audit-engineer','plugin-factory','api-mcp','neural-copilot']){
    await page.goto('/?view=agents&agent='+agent);await expect(page.getByRole('heading',{name:'Disponibilidade e escopo'})).toBeVisible();
    await expect(page.locator('[data-omnix-context]')).toHaveCount(agent==='audit-engineer'?1:0);
  }
  for(const slug of ['systems-command','wallet-command','audit-os','plugin-factory','studio-ai','api-fabric','academy']){
    await page.goto('/?system='+slug);await expect(page.locator('.sip-hero h1')).toBeVisible();await expect(page.getByRole('heading',{name:'Inspect the proof directly.'})).toBeVisible();
    await expect(page.locator('.sip-evidence-card').first()).toBeVisible();await expect(page.locator('[data-omnix-context]')).toHaveCount(slug==='audit-os'?1:0);
  }
});

test('public REST/MCP contracts and safe errors execute actual handlers',async({request})=>{
  for(const route of ['/api/agent-api','/api/mcp/enterprise','/api/mcp/gx','/api/gx','/api/ecosystem','/.well-known/xpex-agent-api.json']){
    const response=await request.get(route);expect(response.status()).toBe(200);expect(response.headers()['content-type']).toContain('application/json');await response.json();
  }
  expect((await(await request.get('/api/agent-api')).json()).offerings).toHaveLength(7);
  for(const [route,count]of [['/api/mcp/enterprise',8],['/api/mcp/gx',11]]){
    const response=await request.post(route,{data:{jsonrpc:'2.0',id:1,method:'tools/list',params:{}}});
    expect((await response.json()).result.tools).toHaveLength(count);
    const denied=await request.put(route,{data:{}});expect(denied.status()).toBe(405);expect(denied.headers()['content-type']).toContain('application/json');
  }
  const missing=await request.get('/api/omnix/not-exposed');expect(missing.status()).toBe(404);expect(missing.headers()['content-type']).toContain('application/json');
});

test('GX grounding, enterprise matching, URL copy and evidence refresh',async({page,context})=>{
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.goto('/?view=developers');await page.getByRole('button',{name:'Copiar URL da API'}).click();
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('https://xpex-systems-ai.vercel.app/api/agent-api');
  await page.locator('[data-agent-api-need]').fill('We need evidence backed company intelligence and governed agents');
  await page.locator('[data-agent-api-submit]').click();await expect(page.locator('[data-agent-api-result]')).toContainText('CAPACIDADE SUGERIDA');
  await page.goto('/?view=company#gx');await page.locator('[data-gx-input]').fill('Explain GXEON Audit OS and its public evidence');
  await page.locator('[data-gx-send]').click();await expect(page.locator('[data-gx-mode]')).toHaveText('EVIDENCE ONLY');
  await expect(page.locator('.gx-sources a').first()).toBeVisible();
  await page.goto('/?view=ecosystem');const refresh=page.locator('[data-eco-refresh]');await expect(refresh).toBeEnabled({timeout:30_000});
  const response=page.waitForResponse(r=>r.url().endsWith('/api/ecosystem'));await refresh.click();expect((await response).status()).toBe(200);await expect(refresh).toBeEnabled({timeout:30_000});
  await expect(page.locator('[data-eco-status]')).not.toContainText('Aguardando');await expect(page.locator('[data-eco-evidence] a')).toHaveCount(3);
});

test('OMNIX sample download matches frozen bytes; local draft stays inert and unsent',async({page})=>{
  await page.addInitScript(()=>{window.__omnixPublicEvents=[];document.addEventListener('omnix:public-event',event=>window.__omnixPublicEvents.push(event.detail));});
  await page.goto('/?view=omnix');await expect(page.locator('.ox-hero')).toContainText('OMNIX AI — Powered by');
  await page.getByRole('link',{name:'Preparar solicitação (sem envio)',exact:true}).click();
  await page.locator('[data-omnix-example]').click();await expect(page.locator('[data-omnix-example-download]')).toBeVisible();
  const event=page.waitForEvent('download');await page.locator('[data-omnix-example-download]').click();const download=await event;
  const bytes=await fs.readFile(await download.path());expect(createHash('sha256').update(bytes).digest('hex')).toBe('86c87f8f879615afe538d4f567af96a9c26b95b7648dc37ca2bf4214d3b6dff2');
  expect(JSON.parse(bytes).report.testData).toBe(true);
  const requests=[];page.on('request',r=>requests.push({method:r.method(),url:r.url()}));
  await page.locator('#omnix-scope').fill('<img src=x onerror="alert(1)"> synthetic scope');await page.locator('[data-omnix-request] button').click();
  await expect(page.locator('[data-omnix-draft]')).toContainText('RASCUNHO LOCAL — NÃO ENVIADO');await expect(page.locator('[data-omnix-draft] img')).toHaveCount(0);expect(requests).toEqual([]);
  expect(await page.evaluate(()=>window.__omnixPublicEvents)).toEqual([
    {name:'product_visit',product:'omnix',stage:'preview',outcome:'interaction'},
    {name:'commercial_click',product:'omnix',stage:'preview',outcome:'interaction'},
    {name:'request_started',product:'omnix',stage:'preview',outcome:'local_draft'},
  ]);
  await page.route('**/examples/omnix-synthetic-report.json',r=>r.fulfill({status:503,body:'Unavailable'}));await page.locator('[data-omnix-example]').click();
  await expect(page.locator('[data-omnix-example-status]')).toContainText('não pôde');await expect(page.locator('[data-omnix-example-download]')).toBeHidden();
});

test('orbital animation, pause and reduced motion retain their existing behavior',async({page})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');
  expect(await page.locator('.xp-orbit').first().evaluate(el=>getComputedStyle(el).animationName)).not.toBe('none');
  const motion=page.locator('[data-motion]');await motion.click();await expect(page.locator('.xp-hero-scene')).toHaveClass(/xp-motion-paused/);
  expect(await page.locator('.xp-orbit').first().evaluate(el=>getComputedStyle(el).animationPlayState)).toBe('paused');
  await page.emulateMedia({reducedMotion:'reduce'});await expect(motion).toHaveAttribute('aria-pressed','true');
  expect(await page.locator('.xp-orbit').first().evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
});

test('commercial receiver is actually unavailable by default: disabled synthetic form, no fabricated receipt or POST',async({page})=>{
  const posted=[];page.on('request',request=>{if(request.method()==='POST'&&request.url().endsWith('/api/omnix-request'))posted.push(request.url());});
  await page.setViewportSize({width:375,height:900});
  const statusResponse=page.waitForResponse(response=>response.url().endsWith('/api/omnix-request'));
  await page.goto('/?view=omnix');
  const response=await statusResponse;expect(response.status()).toBe(503);expect(response.headers()['content-type']).toContain('application/json');
  const status=await response.json();expect(status.syntheticOnly).toBe(true);expect(status.customerDataAllowed).toBe(false);
  await expect(page.locator('[data-omnix-commercial-state]')).toContainText('Receptor indisponível ou não configurado');
  await expect(page.locator('[data-omnix-commercial-fields]')).toHaveAttribute('disabled','');
  for(const selector of ['[name="name"]','[name="company"]','[name="email"]','[name="problem"]','[name="consent"]','button[type="submit"]']){
    await expect(page.locator('[data-omnix-commercial] '+selector)).toBeDisabled();
  }
  await expect(page.locator('[data-omnix-commercial] input[type="file"]')).toHaveCount(0);
  await expect(page.locator('[data-omnix-commercial-receipt]')).toHaveText('');
  await expect(page.locator('[data-omnix-commercial-section] a[href="/?view=company#contact"]')).toBeVisible();
  await page.locator('[data-omnix-commercial]').evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  expect(posted).toEqual([]);await expect(page.locator('[data-omnix-commercial-receipt]')).toHaveText('');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.locator('#omnix-scope').fill('TEST DATA local draft remains available');await page.locator('[data-omnix-request] button').click();
  await expect(page.locator('[data-omnix-draft]')).toContainText('RASCUNHO LOCAL — NÃO ENVIADO');expect(posted).toEqual([]);
});

test('institutional anchors and historical entry links reach their content',async({page})=>{
  for(const [route,target]of [['/#top','#top'],['/#systems','#systems'],['/#agents','#agents'],['/#ecosystem','#ecosystem'],['/#gx','#gx'],['/#investors','#investors'],['/#founder','#founder'],['/#trust','#trust'],['/#contact','#contact'],['/#agent-api','#agent-api'],['/?view=developers#agent-api','#agent-api'],['/?view=omnix#omnix-example','#omnix-example'],['/?view=omnix#omnix-request','#omnix-request']]){
    await page.goto(route);await expect(page.locator(target),route).toHaveCount(1);
    if(target==='#contact')await expect(page.locator('.xp-founder a[href*="linkedin.com"]')).toBeVisible();
  }
});

test('separate lead intake stays closed by actual handler: no approval, contact POST, upload or invented receipt',async({page})=>{
  const posted=[];page.on('request',request=>{if(request.method()==='POST'&&request.url().endsWith('/api/omnix-lead'))posted.push(request.url());});
  await page.setViewportSize({width:375,height:900});
  const statusResponse=page.waitForResponse(response=>response.url().endsWith('/api/omnix-lead'));
  await page.goto('/?view=omnix');const response=await statusResponse;
  expect(response.status()).toBe(503);expect(response.headers()['content-type']).toContain('application/json');
  expect(await response.json()).toEqual({ok:false,code:'LEAD_ADMISSION_CLOSED',leadDataAllowed:false,auditCustomerDataAllowed:false,humanDeliveryVerified:false});
  await expect(page.locator('[data-omnix-lead-state]')).toContainText('Coleta de leads reais fechada');
  await expect(page.locator('[data-omnix-lead-fields]')).toHaveAttribute('disabled','');
  for(const selector of ['[name="name"]','[name="company"]','[name="email"]','[name="needType"]','[name="description"]','[name="consent"]','button[type="submit"]']){
    await expect(page.locator('[data-omnix-lead] '+selector)).toBeDisabled();
  }
  await expect(page.locator('[data-omnix-lead] input[type="file"]')).toHaveCount(0);
  await expect(page.locator('[data-omnix-lead-receipt]')).toHaveText('');
  await expect(page.locator('[data-omnix-lead-privacy]')).toHaveAttribute('href','/?view=privacy');
  await page.locator('[data-omnix-lead]').evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  expect(posted).toEqual([]);await expect(page.locator('[data-omnix-lead-receipt]')).toHaveText('');
  await expect(page.locator('[data-omnix-commercial-fields]')).toHaveAttribute('disabled','');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
