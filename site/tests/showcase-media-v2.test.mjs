import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import pack from '../public/data/showcase-media-pack-v2.json' with { type:'json' };
import clientIndex from '../src/data/media-index-v2.json' with { type:'json' };
import { showcaseCard } from '../src/showcase.js';

const read = path => readFile(new URL('../public' + path, import.meta.url));

test('V2 covers the complete editorial directory and pairs cover and icon files', async () => {
  assert.equal(pack.schemaVersion, '2.0.0');
  const groups = { systems:20, agents:10, plugins:4, integrations:12, evidence:14, fallbacks:3 };
  assert.equal(new Set(pack.items.map(item => item.id)).size, 63);
  assert.deepEqual(pack.items.map(item => item.id), clientIndex.map(row => row[0]));
  for (const [group, count] of Object.entries(groups)) {
    assert.equal(pack.items.filter(item => item.kind === group).length, count);
  }
  for (const item of pack.items) {
    const { cover, icon } = item;
    assert.ok(item.category && item.statusBadge && item.runtimeStatus && item.access && item.notes);
    assert.equal(cover.width / cover.height, 16 / 9);
    assert.ok(cover.alt);
    assert.equal((await read(cover.src)).toString('ascii', 8, 12), 'WEBP');
    for (const file of [icon.src,icon.mono,icon.simplified]) {
      const svg = (await read(file)).toString('utf8');
      assert.match(svg, /<svg/);
      assert.doesNotMatch(svg, /<script|<foreignObject|onload=/i);
    }
    const source = item.derivedFrom[0];
    await read(source.path);
    if (source.kind === 'REAL_SCREENSHOT') assert.ok(Date.parse(source.capturedAt));
    if (item.kind === 'fallbacks') {
      assert.equal(cover.kind, 'FALLBACK_OFFICIAL');
    } else {
      const markup = showcaseCard({ id:item.id, title:item.title, category:item.category, status:item.statusBadge,
        href:'/', action:'Consultar', symbol:'xpex' });
      assert.ok(markup.includes(cover.src) && markup.includes(icon.src));
    }
  }
  assert.equal(pack.items.find(item => item.id === 'super-admin').cover.kind, 'CONCEPT_PREVIEW');
  assert.equal(pack.items.find(item => item.id === 'academy-support').cover.kind, 'CONCEPT_PREVIEW');
});
