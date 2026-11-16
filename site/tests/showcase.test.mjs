import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { ACADEMY, INTEGRATIONS, PLATFORMS, SYSTEMS, TRUST, agentShowcase, mediaFor, runtimeObservation } from '../src/data/showcase.js';
import { showcaseCard, showcaseRail, coverPalette } from '../src/showcase.js';
import { SYSTEM_INTELLIGENCE } from '../src/data/system-intelligence.js';
import { ecosystemThreePillars } from '../src/ecosystem.js';
import { agents } from '../src/public-site.js';

const file = path => new URL('../public' + path, import.meta.url);
const safeUrl = /^(?:\/(?!\/)|https:\/\/)/;
const readJson = async path => JSON.parse(await readFile(file(path), 'utf8'));

test('renders the public rail template and their controls with safe, actionable destinations', () => {
  const rails = [PLATFORMS, SYSTEMS, TRUST, [ACADEMY], INTEGRATIONS];
  for (const [index, items] of rails.entries()) {
    const id = 'sample-' + index;
    const html = showcaseRail({ id, title: 'A & B', label: 'Catálogo', items });
    assert.ok(html.includes('aria-labelledby="' + id + '-heading"'));
    assert.ok(html.includes('aria-controls="' + id + '-items"'));
    assert.equal((html.match(/data-showcase-item=/g) || []).length, items.length);
    assert.match(html, /A &amp; B/);
    for (const item of items) {
      assert.match(item.href, safeUrl);
      if (item.evidenceUrl) assert.match(item.evidenceUrl, safeUrl);
    }
    assert.doesNotMatch(html, /<iframe|<form|href="#"|javascript:/i);
  }
});

test('system projection retains canonical identities and distinguishes public and restricted use', () => {
  assert.deepEqual(SYSTEMS.map(item => item.title), SYSTEM_INTELLIGENCE.map(system => system.name));
  for (const item of SYSTEMS) assert.equal(item.href, '/?system=' + item.id);
  assert.equal(SYSTEMS.find(item => item.id === 'api-fabric').runtimeAvailable, false);
  for (const id of ['plugin-factory', 'systems-command']) {
    const item = SYSTEMS.find(system => system.id === id);
    assert.equal(runtimeObservation(id).httpStatus, 404);
    assert.equal(item.runtimeAvailable, false);
    assert.equal(item.status, 'Runtime indisponível');
    assert.ok(item.verifiedAt);
    assert.match(showcaseCard(item), /Prévia visual pendente de verificação/);
  }
  assert.equal(ACADEMY.status, 'Preview restrito');
  assert.equal(ACADEMY.access, 'Login por convite');
  assert.match(ACADEMY.summary, /aguardam homologação/);
  assert.match(ecosystemThreePillars(), /cada ambiente|acessos independentes/);
});

test('the GX agent shelf and detail share one canonical title', () => {
  for (const agent of agents) {
    const card = agentShowcase(agent);
    assert.equal(card.title, agent.name, 'card and detail must use the same name');
    assert.equal(card.href, '/?view=agents&agent=' + agent.id);
    if (agent.id === 'neural-copilot') assert.ok(showcaseCard(card).includes('<h3 class="xp-cover-title">GX Neural Copilot</h3>'));
  }
  const copilot = agents.find(agent => agent.id === 'neural-copilot');
  assert.equal(copilot.name, 'GX Neural Copilot');
  assert.match(copilot.delivery, /GX Evidence Concierge/);
});

test('public machine-readable sources and every public visual file are traceable', async () => {
  const pillars = await readJson('/data/xpex-ecosystem-three-pillars-v1.json');
  assert.deepEqual(PLATFORMS.map(item => item.canonicalUrl), pillars.pillars.map(pillar => pillar.url));
  const registry = await readJson('/data/showcase-evidence-v1.json');
  assert.equal(registry.schemaVersion, '1.0.0');
  for (const [id, asset] of Object.entries(registry.media)) {
    assert.deepEqual(mediaFor(id), asset);
    const bytes = await readFile(file(asset.path));
    assert.ok(bytes.length > 0);
    assert.match(asset.sourceUrl, /^https:\/\//);
    assert.ok(asset.alt && asset.review && asset.publication);
    if (asset.kind === 'REAL_SCREENSHOT') {
      assert.equal(asset.sourceUrl, runtimeObservation(id).url);
      assert.ok(Number.isFinite(Date.parse(asset.capturedAt)));
      assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
      assert.equal(asset.publication, 'REVIEWED_FOR_PR');
    }
  }
});

test('every approved cover has a distinct editorial signature without falsifying screenshot evidence', async () => {
  const pack = await readJson('/data/showcase-media-pack-v1.json');
  const expected = pack.items.map(item => item.id).sort();
  assert.deepEqual(Object.keys(coverPalette).sort(), expected);
  assert.equal(new Set(expected).size, 24);
  const academy = showcaseCard(PLATFORMS.find(item => item.id === 'xpex-academy'));
  assert.match(academy, /data-cover-id="xpex-academy"/);
  assert.match(academy, /Capa com captura real/);
  assert.match(academy, /class="xp-cover-signature"/);
  const agent = agents.find(item => item.id === 'neural-copilot');
  const agentCover = showcaseCard(agentShowcase(agent));
  assert.match(agentCover, /data-cover-id="neural-copilot"/);
  assert.match(agentCover, /Capa editorial/);
  assert.doesNotMatch(agentCover, /Captura real/);
});

test('media pack covers the requested catalog and preserves image provenance', async () => {
  const pack = await readJson('/data/showcase-media-pack-v1.json');
  assert.equal(pack.schemaVersion, '1.0.0');
  assert.equal(pack.items.length, 24);
  const ids = new Map(pack.items.map(item => [item.id, item]));
  assert.equal(ids.size, pack.items.length);
  assert.equal(ids.get('academy-support').image.kind, 'CONCEPT_COVER');
  for (const { image: asset, aliasOf } of pack.items) {
    assert.ok(asset.alt);
    assert.equal(asset.width / asset.height, 16 / 9);
    const bytes = await readFile(file(asset.path));
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
    assert.ok(bytes.length < 100_000);
    if (aliasOf) assert.ok(ids.has(aliasOf));
    for (const source of asset.derivedFrom) {
      await readFile(file(source.path));
      if (source.kind === 'REAL_SCREENSHOT') assert.ok(Number.isFinite(Date.parse(source.capturedAt)));
    }
  }
  assert.match(showcaseCard(PLATFORMS[2]), /Capa com captura real/);
  assert.match(showcaseCard(PLATFORMS[2]), /loading="lazy"/);
});
