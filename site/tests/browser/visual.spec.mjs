import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';

const production='https://xpex-systems-ai.vercel.app';
const initial='https://xpex-systems-aggjdj7jx-xpex-neural.vercel.app';
const preview=process.env.PRESERVATION_PREVIEW_URL;
const widths=[320,375,390,768,900,1024,1150,1440];
const routes=['/','/?view=omnix','/?view=agents','/?view=agents&agent=audit-engineer','/?view=ecosystem','/?view=systems','/?system=audit-os','/?system=plugin-factory','/?view=plugins','/?view=developers','/?view=radar','/?view=company','/?view=brand','/?view=privacy','/?view=terms'];
const dynamic='[data-eco-status],[data-eco-evidence],[data-eco-integrations],[data-eco-radar],[data-eco-catalog],[data-eco-services]';

async function ready(page,url){
  const response=await page.goto(url,{waitUntil:'domcontentloaded'});expect(response.status()).toBe(200);
  await expect(page.locator('main h1').first()).toBeVisible();
  await page.evaluate(()=>document.fonts.ready);
  await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important} iframe{visibility:hidden!important}'});
  for(const image of await page.locator('img').all()){
    await image.evaluate(async el=>{el.loading='eager';await el.decode();});
    expect(await image.evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
  }
}
async function dom(page){
  return page.evaluate(selector=>{
    const main=document.querySelector('main').cloneNode(true);
    main.querySelectorAll(selector+',.ox-entry,[data-omnix-context],.ox-hero>.xp-small-note').forEach(el=>el.remove());
    const norm=value=>value.replace(/\s+/g,' ').trim();
    return {title:document.title,heading:document.querySelector('h1')?.textContent,text:norm(main.textContent),links:[...document.querySelectorAll('a[href]')].filter(a=>!a.closest('[data-omnix-context]')).map(a=>({href:a.getAttribute('href'),text:norm(a.textContent)})),width:innerWidth,documentWidth:document.documentElement.scrollWidth};
  },dynamic);
}
test.skip(!preview,'Remote visual gate needs the exact verified public Git preview URL; local rendering is not remote proof.');

test('live public REST and MCP contracts remain JSON and retain discovery counts',async({request},info)=>{
  test.setTimeout(120_000);const records=[];
  try{
    for(const origin of [production,initial,preview]){
      for(const route of ['/api/agent-api','/api/mcp/enterprise','/api/mcp/gx','/api/gx','/api/ecosystem','/.well-known/xpex-agent-api.json']){
        const response=await request.get(origin+route);expect(response.status()).toBe(200);expect(response.headers()['content-type']).toContain('application/json');
        const json=await response.json();if(route==='/api/agent-api')expect(json.offerings).toHaveLength(7);
        records.push({url:origin+route,status:response.status(),body:json});
      }
      for(const [route,count]of [['/api/mcp/enterprise',8],['/api/mcp/gx',11]]){
        const response=await request.post(origin+route,{data:{jsonrpc:'2.0',id:1,method:'tools/list',params:{}}});
        expect(response.status()).toBe(200);const json=await response.json();expect(json.result.tools).toHaveLength(count);
        records.push({url:origin+route,method:'tools/list',status:response.status(),toolCount:json.result.tools.length});
      }
    }
  }finally{await fs.writeFile(info.outputPath('public-contracts.json'),JSON.stringify({capturedAt:new Date().toISOString(),records},null,2));}
});

test('all required live pages retain baseline content and links',async({browser},info)=>{
  test.setTimeout(180_000);
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  const page=await context.newPage(),records=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
    for(const route of routes){
      const states={};for(const [stage,origin]of [['production',production],['initialPreview',initial],['candidate',preview]]){
        if(stage==='production'&&route==='/?view=omnix')continue;
        await ready(page,origin+route);states[stage]=await dom(page);
      }
      const current=states.candidate;
      for(const [stage,before]of Object.entries(states))if(stage!=='candidate'){
        expect(current.heading,route+' heading').toBe(before.heading);
        expect(current.text,route+' retained text').toContain(before.text);
        const links=new Set(current.links.map(x=>JSON.stringify(x)));
        for(const link of before.links)expect(links.has(JSON.stringify(link)),route+' retained '+link.href).toBe(true);
      }
      records.push({route,states});
    }
    expect(errors).toEqual([]);
  }finally{await fs.writeFile(info.outputPath('live-dom.json'),JSON.stringify({capturedAt:new Date().toISOString(),records,errors},null,2));await context.close();}
});

for(const width of widths)test(`real production / initial preview / candidate at ${width}px`,async({browser},info)=>{
  test.setTimeout(150_000);
  const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await context.newPage(),records=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
  const regionSets={home:['.xp-hero','#agents','#systems','.xp-footer'],agents:['.xp-catalog-grid'],systems:['.xp-page>.xp-three'],ecosystem:['#integration-channels']};
  try{
    for(const [stage,origin]of [['production',production],['initialPreview',initial],['candidate',preview]])for(const [name,route]of [['home','/'],['agents','/?view=agents'],['systems','/?view=systems'],['ecosystem','/?view=ecosystem'],['omnix','/?view=omnix']]){
      if(stage==='production'&&name==='omnix')continue;
      await ready(page,origin+route);
      const state=await dom(page);expect(state.width).toBe(width);expect(state.documentWidth,stage+' '+name+' overflow').toBeLessThanOrEqual(width);
      if(name==='ecosystem')await expect(page.locator('[data-eco-refresh]')).toBeEnabled({timeout:30_000});
      const file=info.outputPath(`${stage}-${name}-${width}.png`),image=await page.screenshot({path:file,fullPage:true,animations:'disabled'});
      expect(image.readUInt32BE(16),'actual PNG width').toBe(width);
      records.push({stage,url:origin+route,width,pngWidth:image.readUInt32BE(16),pngHeight:image.readUInt32BE(20),sha256:createHash('sha256').update(image).digest('hex'),...state});
      if(name==='home')await page.locator('.xp-header').screenshot({path:info.outputPath(`${stage}-navbar-${width}.png`),animations:'disabled'});
      for(const [index,selector]of(regionSets[name]??[]).entries()){
        const locator=page.locator(selector);
        // Additive sections shift later regions by fractional CSS pixels. Align only
        // the capture origin, preserving all dimensions, content, fonts and styles.
        const alignment=await locator.evaluate(el=>{const r=el.getBoundingClientRect(),y=r.top+scrollY,x=r.left+scrollX;const previous=el.style.transform;const dx=Math.round(x)-x,dy=Math.round(y)-y;el.style.transform=`translate(${dx}px,${dy}px)`;return {previous,dx,dy};});
        let region;try{region=await locator.screenshot({path:info.outputPath(`${stage}-${name}-region-${index}-${width}.png`),animations:'disabled'});}finally{await locator.evaluate((el,previous)=>{el.style.transform=previous;},alignment.previous);}
        records.push({stage,region:selector,captureOriginAlignment:{dx:alignment.dx,dy:alignment.dy},width});
        const key=`${name}-region-${index}-${width}.png`;
        if(stage==='production'){
          const target=info.snapshotPath(key);await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,region);
        }else expect.soft(region,`${stage} preserved ${selector} at ${width}`).toMatchSnapshot(key,{threshold:0.2,maxDiffPixelRatio:0.001});
      }
    }
    expect(errors).toEqual([]);
  }finally{await fs.writeFile(info.outputPath('visual-receipt.json'),JSON.stringify({capturedAt:new Date().toISOString(),normalized:'same Chromium, viewport, fonts ready, reduced motion; animations/transitions disabled; live iframe content hidden',dynamicFields:dynamic,records,errors},null,2));await context.close();}
});
