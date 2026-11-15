import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { ACADEMY, INTEGRATIONS, PLATFORMS, SYSTEMS, TRUST, mediaFor, runtimeObservation } from '../src/data/showcase.js';
import { showcaseCard, showcaseRail } from '../src/showcase.js';
import { SYSTEM_INTELLIGENCE } from '../src/data/system-intelligence.js';
import { ecosystemThreePillars } from '../src/ecosystem.js';

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
