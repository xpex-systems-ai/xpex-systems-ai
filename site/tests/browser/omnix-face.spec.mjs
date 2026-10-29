import {test,expect} from '@playwright/test';

for(const width of [375,768,1440])test(`OMNIX official face is navigable and honest at ${width}px`,async({page},testInfo)=>{
  await page.setViewportSize({width,height:1000});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/?view=omnix');
  await expect(page.locator('.of-public-brand img')).toBeVisible();
  expect(await page.locator('.of-public-brand img').evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
  await expect(page.locator('#omnix-specialists article')).toHaveCount(6);
  await expect(page.locator('#omnix-specialists')).toContainText('RELEASE_BLOCKED');
  expect(await page.locator('#omnix-specialists .xp-pill').allTextContents()).toEqual(['RELEASE_BLOCKED','PLANNED','PLANNED','PLANNED','PLANNED','PLANNED']);
  await page.getByRole('navigation',{name:'Explorar OMNIX'}).getByRole('link',{name:'Especialistas'}).click();
  await expect(page).toHaveURL(/#omnix-specialists$/);
  const planned=page.locator('#omnix-specialists article').nth(1);
  await planned.locator('summary').click();await expect(planned.locator('details')).toHaveAttribute('open','');
  await expect(planned.locator('details')).toContainText('não concede acesso');
  await page.locator('#omnix-specialists').getByRole('link',{name:'Verificar exemplo de configuração'}).click();
  await expect(page).toHaveURL(/#omnix-example$/);
  await expect(page.locator('#omnix-example')).toContainText(/sintético/i);
  await expect(page.locator('#omnix-engineer li')).toHaveCount(8);
  await page.getByRole('navigation',{name:'Explorar OMNIX'}).getByRole('link',{name:'Evidence Lab'}).click();
  await expect(page.locator('#omnix-lab article')).toHaveCount(7);
  const canonical=await page.locator('#omnix-lab a[href^="/?system="]').evaluateAll(links=>links.map(a=>a.getAttribute('href')));
  expect(new Set(canonical).size).toBe(7);expect(canonical.every(href=>href.startsWith('/?system='))).toBe(true);
  await expect(page.locator('#omnix-lab .of-evidence-details')).toHaveCount(7);
  await expect(page.locator('#omnix-lab .of-dossier-details')).toHaveCount(7);
  await page.locator('#omnix-lab .of-dossier-details').first().locator('summary').click();
  await expect(page.locator('#omnix-lab .of-dossier-details').first()).toContainText('Engenharia registrada');
  await expect(page.locator('#omnix-lab .of-dossier-details').first()).toContainText('não constitui certificação');
  await page.getByRole('navigation',{name:'Explorar OMNIX'}).getByRole('link',{name:'Como contratar'}).click();
  await expect(page).toHaveURL(/#omnix-client-path$/);
  await expect(page.locator('#omnix-client-path')).toContainText('não enviam uma contratação real');
  await expect(page.locator('#omnix-client-path a[href="/?view=company#contact"]')).toHaveCount(1);
  await expect(page.locator('#omnix-lab')).toContainText('Sem revalidação remota nesta página');
  await page.locator('#omnix-lab .of-evidence-details').nth(1).locator('summary').click();
  const references=page.locator('#omnix-lab .of-evidence-details').nth(1).locator('a');
  expect(await references.count()).toBeGreaterThan(0);
  for(const href of await references.evaluateAll(links=>links.map(a=>a.getAttribute('href')))) {
    expect(new URL(href).protocol).toBe('https:');
  }
  // The private Systems Command repo and its private source docs must not be linked publicly.
  await page.locator('#omnix-lab .of-evidence-details').first().locator('summary').click();
  const firstLinks=await page.locator('#omnix-lab .of-evidence-details').first().locator('a').evaluateAll(a=>a.map(x=>x.href));
  expect(firstLinks.some(x=>x.includes('/xpex-systems-ai/xpex-systems-command/'))).toBe(false);
  await expect(page.locator('#omnix-lab')).toContainText('não são casos de clientes');
  await page.locator('#omnix-connections summary').click();
  await expect(page.locator('#omnix-connections details')).toContainText('não verificada');
  expect(await page.locator('.of-public input').count()).toBe(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(errors).toEqual([]);
  await page.screenshot({path:testInfo.outputPath(`omnix-official-${width}.png`),fullPage:true});
});
