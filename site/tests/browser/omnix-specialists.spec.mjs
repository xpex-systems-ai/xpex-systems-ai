import { test, expect } from '@playwright/test';

test('OMNIX specialist controls navigate to real references but never initiate a provider connection', async ({page}) => {
  await page.goto('/?view=omnix');
  const cards=page.locator('[data-omnix-specialist]');
  await expect(cards).toHaveCount(6);
  await expect(page.locator('[data-connection-state="NOT_CONNECTED"]')).toHaveCount(6);
  await expect(page.locator('[data-omnix-specialist] button:disabled')).toHaveCount(6);
  await expect(page.locator('[data-omnix-specialist="vercel"]')).toContainText('Exemplo sintético');
  await expect(page.locator('[data-omnix-specialist="github"]')).toContainText('Integração planejada');
  await page.locator('[data-omnix-specialist="vercel"] a').click();
  await expect(page).toHaveURL(/view=omnix#omnix-example$/);
  await expect(page.locator('#omnix-example')).toBeVisible();
  await page.goto('/?view=omnix');
  await page.locator('[data-omnix-specialist="railway"] a').click();
  await expect(page).toHaveURL(/\?system=plugin-factory$/);
  await expect(page.locator('.sip-hero h1')).toBeVisible();
});

test('OMNIX evidence gallery opens all seven canonical system dossiers', async ({page}) => {
  await page.goto('/?view=omnix');
  const gallery=page.locator('[data-omnix-system]');
  await expect(gallery).toHaveCount(7);
  for(const slug of ['systems-command','wallet-command','audit-os','plugin-factory','studio-ai','api-fabric','academy']){
    const card=page.locator('[data-omnix-system="'+slug+'"]');
    await expect(card).toContainText('sem nova auditoria OMNIX declarada');
    await expect(card.locator('a')).toHaveAttribute('href','/?system='+slug);
  }
  await page.locator('[data-omnix-system="academy"] a').click();
  await expect(page).toHaveURL(/\?system=academy$/);
  await expect(page.locator('.sip-hero h1')).toBeVisible();
  await expect(page.locator('.sip-evidence-card').first()).toBeVisible();
});
