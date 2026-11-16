import { MODULES, ROLES, MORE_INTEGRATIONS, MORE_EVIDENCE, PLUGINS } from '../src/data/media-directory.js';
import { SYSTEMS, PLATFORMS, TRUST, INTEGRATIONS } from '../src/data/showcase.js';
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
const v2 = process.argv.includes('--v2');
const fromItem = item => [item.id,item.title,item.symbol,null,null,null,item.concept];
const inventory = [...PLATFORMS,...SYSTEMS,...TRUST,...INTEGRATIONS,...MODULES,...ROLES,...MORE_INTEGRATIONS,...MORE_EVIDENCE,...PLUGINS];
const providerSlugs = {github:'github',vercel:'vercel',supabase:'supabase',firebase:'firebase',railway:'railway',
  'google-ai-studio':'google',chatgpt:'openai',coinbase:'coinbase','mercado-pago':'mercadopago',stripe:'stripe',mcp:'modelcontextprotocol'};
if (v2) {
  groups.systems.push(...MODULES.map(fromItem));
  groups.agents.push(...ROLES.map(fromItem));
  groups.evidence.push(...[...TRUST,...MORE_EVIDENCE].filter(item => !groups.evidence.some(([id]) => id === item.id)).map(fromItem));
  groups.integrations = [...INTEGRATIONS,...MORE_INTEGRATIONS].map(fromItem);
  groups.plugins = PLUGINS.map(fromItem);
  await mkdir(publicFile('/media/showcase/icons'), {recursive:true});
}
const index = new Map(inventory.map(item => [item.id,item]));
const browser = await chromium.launch({ channel: process.env.SHOWCASE_CHROME_CHANNEL || undefined });
const items = [];
try {
  const page = await browser.newPage();
  for (const [group, rows] of Object.entries(groups)) {
    const folder = '/media/showcase/' + group;
    await mkdir(publicFile(folder), { recursive: true });
    for (const [id, title, symbol, artwork, screenshot, aliasOf, concept] of rows) {
      const base = screenshot && evidence.media[screenshot];
      const originalSymbol = '/brand/v2/' + symbol + '-symbol.svg';
      const vendor = group === 'integrations' && providerSlugs[id];
      const vendorPath = vendor && '/media/showcase/icons/providers/' + vendor + '.svg';
      const vendorArt = vendorPath && await readFile(publicFile(vendorPath), 'utf8').catch(error => {
        if (error.code !== 'ENOENT') throw error;
        return '';
      });
      const symbolPath = vendorArt ? vendorPath : originalSymbol;
      const iconPath = '/media/showcase/icons/' + id + '-icon.svg';
      const monoPath = '/media/showcase/icons/' + id + '-icon-mono.svg';
      let icon;
      if (v2) {
        const raw = vendorArt || await readFile(publicFile(originalSymbol), 'utf8');
        const viewBox = raw.match(/viewBox="([^"]+)"/)[1];
        const glyph = raw.slice(raw.indexOf('>') + 1, raw.lastIndexOf('</svg>')).replace(/<title>.*?<\/title>/g, '');
        const framed = color => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="${color}" color="${color}"><rect x="2" y="2" width="60" height="60" rx="16" fill="#111d33" stroke="${color}" stroke-opacity=".55"/><svg x="14" y="14" width="36" height="36" viewBox="${viewBox}">${glyph}</svg></svg>\n`;
        icon = framed(group === 'integrations' ? '#d5e8ff' : '#ead19a');
        await writeFile(publicFile(iconPath), icon);
        await writeFile(publicFile(monoPath), framed('#f3f6fa'));
      }
      const sourcePath = base?.path || artwork || symbolPath;
      const mime = sourcePath.endsWith('.svg') ? 'image/svg+xml' : 'image/webp';
      const source = 'data:' + mime + ';base64,' + (v2 && !base && !artwork ? Buffer.from(icon) : await readFile(publicFile(sourcePath))).toString('base64');
      const version = v2 ? 'v2' : 'v1';
      const path = folder + '/' + (group === 'fallbacks' ? 'fallback-' + id + '-premium-' : id + '-cover-') + version + '.webp';
      const hue = {systems:221,agents:210,evidence:235,fallbacks:221,integrations:213,plugins:230}[group];
      const data = await page.evaluate(async ({ source, isCapture, isPhoto, index, hue, group, v2 }) => {
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
        if (v2) {
          ctx.save();
          ctx.translate(432,210);
          ctx.rotate(-.2);
          for (let offset = -120; offset <= 125; offset += 44) {
            ctx.fillStyle = '#799ac613';
            ctx.beginPath();
            ctx.roundRect(-294 + offset, -115 + offset / 5, 460, 220, 18);
            ctx.fill();
            ctx.stroke();
          }
          ctx.restore();
        }
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
      }, { source, isCapture: Boolean(base), isPhoto: Boolean(artwork), index: items.length % 5, hue, group, v2 });
      await writeFile(publicFile(path), Buffer.from(data, 'base64'));
      const entry = index.get(id);
      if (v2) {
        const kind = group === 'fallbacks' ? 'FALLBACK_OFFICIAL' : concept ? 'CONCEPT_PREVIEW' : base || artwork ? 'CURATED_COVER' : 'EDITORIAL_ART';
        items.push({
          id, title, kind: group, category: entry?.category || ({agents:'Capacidade',fallbacks:'Fallback'}[group] || 'Catálogo'),
          statusBadge: entry?.status || (concept ? 'Prévia conceitual' : group === 'agents' ? 'Capacidade catalogada' : 'Referência editorial'),
          runtimeStatus: entry?.status || 'UNSPECIFIED',
          access: entry?.access || 'Referência pública',
          ...(aliasOf && { aliasOf }),
          cover: { src:path, kind, width:800, height:450, alt:(base ? 'Composição com captura pública de ' : 'Composição editorial para ') + title },
          icon: { src:iconPath, mono:monoPath, simplified: symbolPath, kind:vendorArt ? 'VENDOR_MARK_IN_XPEX_FRAME' : 'XPEX_GLYPH' },
          derivedFrom: [{
            kind:base?.kind || 'OFFICIAL_ASSET',
            path:sourcePath,
            sourceUrl:base?.sourceUrl || (vendorArt ? 'https://github.com/simple-icons/simple-icons/blob/17cd4ee07612198a1d8777a060d4100423762a8b/icons/' + vendor + '.svg' :
              repo + '/blob/617edfa/site/public' + sourcePath),
            ...(base && {capturedAt:base.capturedAt,classification:base.classification,review:base.review,redacted:screenshot === 'audit-os'})
          }],
          approvedForPublicUse: false,
          notes: concept ? 'Papel ou módulo conceitual. Disponibilidade operacional pendente de comprovação.' :
            vendorArt ? 'Marca do provedor via Simple Icons. Presença editorial sem declaração de parceria.' : 'Composição revisável no preview. Aprovação pública pendente.'
        });
        continue;
      }
      items.push({
        id, title, group, ...(aliasOf && { aliasOf }),
        image: {
          path, width: 800, height: 450,
          kind: concept || group === 'fallbacks' ? 'CONCEPT_COVER' : 'CURATED_COVER',
          alt: (base ? 'Composição com captura pública de ' : 'Capa editorial com identidade XPeX para ') + title,
          artOverlay: {
            path: '/media/showcase/art/' + id + '-editorial-v1.svg',
            kind: 'EDITORIAL_VECTOR_ART',
            evidence: false,
            source: 'Original deterministic vector concept artwork in the XPeX media repository; not a screenshot and not proof of runtime',
          },
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
  if (v2) {
    await writeFile(publicFile('/data/showcase-media-pack-v2.json'), JSON.stringify({
      schemaVersion:'2.0.0', scope:'Preview editorial sujeito a revisão independente do GXEON', items
    }, null, 2) + '\n');
    await writeFile(new URL('../src/data/media-index-v2.json', import.meta.url), JSON.stringify(
      items.map(({id,kind,cover,icon,derivedFrom}) => [id,kind,cover.kind,cover.alt,Number(derivedFrom.some(source => source.kind === 'REAL_SCREENSHOT'))])
    ) + '\n');
  } else await writeFile(publicFile('/data/showcase-media-pack-v1.json'), JSON.stringify({
    schemaVersion: '1.0.0',
    updatedAt: new Date().toISOString(),
    scope: 'Editorial media for preview review. 24 decorative SVG art layers are concept artwork, not real system captures. The four previously approved screenshots retain separate provenance; operational state remains in the system and pillars registries.',
    items,
  }, null, 2) + '\n');
} finally {
  await browser.close();
}
