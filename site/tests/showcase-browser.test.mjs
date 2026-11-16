import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { test } from 'node:test';
import { chromium } from 'playwright';

const root = process.env.SHOWCASE_BASE_URL || 'http://127.0.0.1:4174';
const screenshots = process.env.SHOWCASE_SCREENSHOTS;

async function waitForPreview() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const ready = await fetch(root, { signal: AbortSignal.timeout(1500) }).then(r => r.ok, () => false);
    if (ready) return;
    await delay(250);
  }
  throw new Error('Vite preview did not start. Run npm run build first.');
}

async function snapshot(page, name) {
  if (!screenshots) return;
  await mkdir(screenshots, { recursive: true });
  await page.screenshot({ path: resolve(screenshots, name + '.jpg'), type: 'jpeg', quality: 88, animations: 'disabled' });
}

const railIds = ['ecosystem', 'systems', 'agents', 'evidencias', 'academy', 'integration-channels'];

test('public journeys, carousel accessibility and failures', { timeout: 120000 }, async t => {
  if (!process.env.SHOWCASE_BASE_URL) {
    const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4174', '--strictPort'], { stdio: 'ignore' });
    t.after(() => server.kill());
    await waitForPreview();
  }
  const browser = await chromium.launch({ channel: process.env.SHOWCASE_CHROME_CHANNEL || undefined });
  t.after(() => browser.close());

  await t.test('renders six shelves and preserves section and detail entry points', async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 850 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    try {
      const response = await page.goto(root);
      assert.equal(response.status(), 200);
      assert.deepEqual(await page.locator('[data-showcase-rail]').evaluateAll(rails => rails.map(rail => rail.id)), railIds);
      assert.equal(await page.locator('#systems [data-showcase-item]').count(), 7);
      assert.equal(await page.locator('#agents [data-showcase-item]').count(), 7);
      assert.equal(await page.locator('#ecosystem [data-showcase-item]').count(), 3);
      const motion = page.locator('[data-motion]');
      const orbit = page.locator('.xp-orbit').first();
      assert.equal(await motion.getAttribute('aria-pressed'), 'true');
      assert.equal(await orbit.evaluate(node => getComputedStyle(node).animationName), 'none');
      assert.equal(await motion.isHidden(), true);
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.getByRole('button', { name: 'Pausar animação' }).click();
      assert.equal(await orbit.evaluate(node => getComputedStyle(node).animationPlayState), 'paused');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      assert.equal(await page.locator('h1').innerText(), 'XPeX Systems AI');
      await snapshot(page, 'depois-home-desktop');
      await page.locator('#ecosystem').scrollIntoViewIfNeeded();
      await page.locator('#ecosystem [data-showcase-image]').evaluateAll(images => Promise.all(images.map(image => image.decode())));
      await snapshot(page, 'depois-plataformas-desktop');

      await page.getByRole('link', { name: 'Explorar ecossistema' }).click();
      assert.equal(new URL(page.url()).searchParams.get('view'), 'ecosystem');
      assert.equal(await page.locator('#eco-three-pillars [data-showcase-item]').count(), 3);
      await page.locator('[data-eco-status]').filter({ hasText: /^(CONSULTADO|CONSULTA PARCIAL|INDISPONÍVEL) · consulta / }).waitFor({ timeout: 22000 });
      assert.equal(await page.locator('[data-eco-refresh]').isEnabled(), true);
      await snapshot(page, 'depois-ecossistema-desktop');

      for (const id of ['systems-command', 'wallet-command', 'audit-os', 'plugin-factory', 'studio-ai', 'api-fabric', 'academy']) {
        await page.goto(root + '/?system=' + id);
        assert.equal(await page.locator('.sip-hero h1').count(), 1);
        assert.equal(await page.locator('iframe').count(), 0);
        if (['systems-command', 'plugin-factory'].includes(id)) {
          assert.equal(await page.getByRole('link', { name: 'Open public surface' }).count(), 0);
        }
      }
      await page.goto(root);
      const gxCard = page.locator('#agents [data-showcase-item="neural-copilot"] h3');
      assert.equal(await gxCard.innerText(), 'GX Neural Copilot');
      await page.goto(root + '/?view=agents&agent=neural-copilot');
      assert.equal(await page.locator('h1').innerText(), 'GX Neural Copilot');
      await page.goto(root + '/#agent-api');
      assert.equal(await page.locator('#agent-api form').count(), 1);
      await page.goto(root + '/?view=company');
      await page.goto(root + '/#gx');
      await page.locator('#gx form').waitFor();
      assert.deepEqual(errors, []);
    } finally {
      await page.close();
    }
  });

  await t.test('fits desktop, tablet and phone widths and operates by keyboard', async () => {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    try {
      for (const width of [1920, 1440, 1024, 768, 430, 390, 320]) {
        await page.setViewportSize({ width, height: 844 });
        await page.goto(root);
        const bodyWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        assert.ok(bodyWidth <= width, 'document overflows at ' + width + 'px');
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(root);
      await page.locator('.xp-hero-scene img').evaluate(image => image.decode());
      assert.match(await page.locator('.xp-hero-scene img').evaluate(image => image.currentSrc), /gxeon-earth-mobile\.webp$/);
      await snapshot(page, 'depois-home-mobile');
      const menu = page.getByRole('button', { name: 'Abrir menu' });
      await menu.focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('#xp-navigation').isVisible(), true);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#xp-navigation').isVisible(), false);
      assert.equal(await menu.evaluate(button => document.activeElement === button), true);

      const track = page.locator('#systems-items');
      const prev = page.locator('#systems [data-showcase-prev]');
      const next = page.locator('#systems [data-showcase-next]');
      await track.focus();
      assert.equal(await prev.getAttribute('aria-disabled'), 'true');
      await page.keyboard.press('ArrowRight');
      assert.ok(await track.evaluate(element => element.scrollLeft) > 0);
      await page.keyboard.press('End');
      await page.waitForFunction(() => document.querySelector('#systems [data-showcase-next]').getAttribute('aria-disabled') === 'true');
      await page.keyboard.press('Home');
      await page.waitForFunction(() => document.querySelector('#systems-items').scrollLeft === 0);
      await page.waitForFunction(() => document.querySelector('#systems [data-showcase-next]').getAttribute('aria-disabled') === 'false');
      await next.focus();
      await page.keyboard.press('Enter');
      await page.waitForFunction(() => document.querySelector('#systems-items').scrollLeft > 2);
      await prev.click();
      await page.waitForFunction(() => document.querySelector('#systems-items').scrollLeft < 3);
      await snapshot(page, 'depois-sistemas-mobile');
    } finally {
      await page.close();
    }
  });

  await t.test('shows a brand fallback for failed media and recovers the refresh control after API failure', async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 850 } });
    try {
      await page.route('**/media/showcase/systems/xpex-academy-cover-v1.webp', route => route.abort());
      await page.goto(root);
      const card = page.locator('#ecosystem [data-showcase-item="xpex-academy"]');
      await card.scrollIntoViewIfNeeded();
      await card.getByText('Prévia visual pendente de verificação').waitFor();
      assert.equal(await card.locator('img').isHidden(), true);
      assert.equal(await card.locator('.xp-showcase-fallback').isVisible(), true);
      await page.route('**/api/ecosystem', route => route.abort());
      await page.goto(root + '/?view=ecosystem');
      const result = page.locator('[data-eco-status]').filter({ hasText: /^INDISPONÍVEL/ });
      await result.waitFor();
      await page.getByRole('button', { name: 'Atualizar evidências' }).click();
      await result.waitFor();
      assert.equal(await page.getByRole('button', { name: 'Atualizar evidências' }).isEnabled(), true);
    } finally {
      await page.close();
    }
  });
});
