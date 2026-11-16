import { chromium } from 'playwright';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const publicFile = path => new URL('../public' + path, import.meta.url);
const repo = 'https://github.com/xpex-systems-ai/xpex-systems-ai';
const evidence = JSON.parse(await readFile(publicFile('/data/showcase-evidence-v1.json'), 'utf8'));
const groups = {
  systems: [
    ['xpex-company','XPeX Systems AI','xpex','/media/gxeon-earth-mobile.webp'],
    ['xpex-evidence','Portfólio de Evidências','audit-os'],
    ['xpex-academy','XPeX Academy','academy',null,'academy'],
    ['systems-command','XPeX Systems Command','systems-command'],
    ['audit-os','GXEON Audit OS','audit-os',null,'audit-os'],
    ['plugin-factory','XPeX Plugin Factory','plugin-factory'],
    ['wallet-command','GXEON Wallet Command Center','wallet-command',null,'wallet-command'],
    ['studio-ai','XPeX Studio AI','studio-ai',null,'studio-ai'],
    ['api-fabric','XPeX API Fabric','api-fabric'],
    ['academy','XPeX Academy · Polo Kelle','academy',null,'academy'],
  ],
  agents: [
    ['neural-copilot','GX Neural Copilot','gxeon'],
    ['evidence-concierge','GX Evidence Concierge','gxeon',null,null,'neural-copilot'],
    ['audit-engineer','GXEON Audit Engineer','audit-os'],
    ['plugin-factory-agent','XPeX Plugin Factory Agent','plugin-factory'],
    ['api-mcp','API & MCP Runtime','api-fabric'],
    ['enterprise-evidence','Enterprise Evidence Concierge','gxeon',null,null,'neural-copilot'],
    ['academy-support','Academy Support Agent','academy',null,null,null,true],
  ],
  evidence: [
    ['three-pillars-pr','PR #57 · Three Pillars Blueprint','plugin-factory'],
    ['enterprise-v2','Enterprise Experience V2','xpex'],
    ['trust-center','Trust / Evidence Layer','audit-os'],
    ['system-registry','System Registry / Public Truth','systems-command'],
  ],
  fallbacks: [
    ['system','Prévia de sistema','xpex'],
    ['agent','Prévia conceitual de agente','gxeon'],
    ['evidence','Documento de evidência','audit-os'],
  ],
};
const browser = await chromium.launch({ channel: process.env.SHOWCASE_CHROME_CHANNEL || undefined });
const items = [];
try {
  const page = await browser.newPage();
  for (const [group, rows] of Object.entries(groups)) {
    const folder = '/media/showcase/' + group;
    await mkdir(publicFile(folder), { recursive: true });
    for (const [id, title, symbol, artwork, screenshot, aliasOf, concept] of rows) {
      const base = screenshot && evidence.media[screenshot];
      const symbolPath = '/brand/v2/' + symbol + '-symbol.svg';
      const sourcePath = base?.path || artwork || symbolPath;
      const mime = sourcePath.endsWith('.svg') ? 'image/svg+xml' : 'image/webp';
      const source = 'data:' + mime + ';base64,' + (await readFile(publicFile(sourcePath))).toString('base64');
      const path = folder + '/' + (group === 'fallbacks' ? 'fallback-' + id + '-premium-v1' : id + '-cover-v1') + '.webp';
      const hue = {systems:221,agents:210,evidence:235,fallbacks:221}[group];
      const data = await page.evaluate(async ({ source, isCapture, isPhoto, index, hue, group }) => {
        const image = new Image();
        image.src = source;
        await image.decode();
        const canvas = Object.assign(document.createElement('canvas'), { width: 800, height: 450 });
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#070c16';
        ctx.fillRect(0, 0, 800, 450);
        const light = ctx.createRadialGradient(552, 182, 12, 552, 182, 540);
        light.addColorStop(0, 'hsl(' + (hue + index * 4) + ' 45% 29%)');
        light.addColorStop(1, '#070c16');
        ctx.fillStyle = light;
        ctx.fillRect(0, 0, 800, 450);
        ctx.strokeStyle = '#8ea9d235';
        for (let radius = 96; radius < 460; radius += 43) {
          ctx.beginPath();
          ctx.ellipse(470, 208, radius, radius * .59, -.29, 0, Math.PI * 2);
          ctx.stroke();
        }
        if (isCapture) {
          ctx.fillStyle = '#080e17';
          ctx.strokeStyle = '#d6b5739c';
          ctx.beginPath();
          ctx.roundRect(112, 53, 627, 351, 14);
          ctx.fill();
          ctx.stroke();
          ctx.save();
          ctx.clip();
          ctx.drawImage(image, 113, 54, 625, 349);
          ctx.restore();
        } else if (isPhoto) {
          ctx.drawImage(image, 0, -41, 800, 533);
        } else {
          ctx.shadowColor = '#e5be5e47';
          ctx.shadowBlur = 34;
          ctx.drawImage(image, 354, 98, 218, 218);
          ctx.shadowBlur = 0;
        }
        const shade = ctx.createLinearGradient(0, 130, 0, 450);
        shade.addColorStop(0, '#070c1600');
        shade.addColorStop(1, '#070c16df');
        ctx.fillStyle = shade;
        ctx.fillRect(0, 130, 800, 320);
        ctx.fillStyle = '#d6b573';
        ctx.fillRect(37, 408, 62, 2);
        ctx.fillStyle = '#d6b57340';
        ctx.fillRect(99, 408, 663, 1);
        return canvas.toDataURL('image/webp', .86).split(',')[1];
      }, { source, isCapture: Boolean(base), isPhoto: Boolean(artwork), index: items.length % 5, hue, group });
      await writeFile(publicFile(path), Buffer.from(data, 'base64'));
      items.push({
        id, title, group, ...(aliasOf && { aliasOf }),
        image: {
          path, width: 800, height: 450,
          kind: concept || group === 'fallbacks' ? 'CONCEPT_COVER' : 'CURATED_COVER',
          alt: (base ? 'Composição com captura pública de ' : 'Capa editorial com identidade XPeX para ') + title,
          derivedFrom: [{
            kind: base?.kind || 'OFFICIAL_ASSET', path: sourcePath,
            sourceUrl: base?.sourceUrl || repo + '/blob/ba20c129c4385ed653551dc549fc468b94349b06/site/public' + sourcePath,
            ...(base && { capturedAt: base.capturedAt, classification: base.classification, review: base.review,
              environment: screenshot === 'academy' ? 'PREVIEW' : 'PUBLIC_SURFACE',
              redacted: screenshot === 'audit-os' }),
          }],
          publication: 'REVIEWED_FOR_PR',
        }
      });
    }
  }
  await writeFile(publicFile('/data/showcase-media-pack-v1.json'), JSON.stringify({
    schemaVersion: '1.0.0',
    updatedAt: new Date().toISOString(),
    scope: 'Editorial media for preview review. Operational state remains in the system and pillars registries.',
    items,
  }, null, 2) + '\n');
} finally {
  await browser.close();
}
