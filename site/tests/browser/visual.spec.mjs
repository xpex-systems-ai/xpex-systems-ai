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
  for(const image of await page.locator('img').all())expect(await image.evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
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
        const region=await page.locator(selector).screenshot({path:info.outputPath(`${stage}-${name}-region-${index}-${width}.png`),animations:'disabled'});
        const key=`${name}-region-${index}-${width}.png`;
        if(stage==='production'){
          const target=info.snapshotPath(key);await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,region);
        }else expect.soft(region,`${stage} preserved ${selector} at ${width}`).toMatchSnapshot(key,{threshold:0.2,maxDiffPixelRatio:0.001});
      }
    }
    expect(errors).toEqual([]);
  }finally{await fs.writeFile(info.outputPath('visual-receipt.json'),JSON.stringify({capturedAt:new Date().toISOString(),normalized:'same Chromium, viewport, fonts ready, reduced motion; animations/transitions disabled; live iframe content hidden',dynamicFields:dynamic,records,errors},null,2));await context.close();}
});
