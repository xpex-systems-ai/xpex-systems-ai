import assert from 'node:assert/strict';
import { GX_EVIDENCE, GX_PUBLIC_RULES } from '../src/data/gx-evidence.js';

assert.ok(Array.isArray(GX_EVIDENCE));
assert.ok(GX_EVIDENCE.length >= 10);

const ids = GX_EVIDENCE.map(x => x.id);
assert.equal(new Set(ids).size, ids.length, 'Evidence IDs must be unique');

for (const item of GX_EVIDENCE) {
  assert.ok(item.title);
  assert.ok(item.summary);
  assert.ok(item.status);
  assert.ok(item.url.startsWith('https://'), `${item.id} must use HTTPS evidence URL`);
  assert.ok(Array.isArray(item.keywords) && item.keywords.length >= 2);
}

const payload = JSON.stringify(GX_EVIDENCE).toLowerCase();
for (const forbidden of [
  'private key:',
  'password:',
  'api_key=',
  'secret=',
  'soc 2 certified',
  'iso 27001 certified',
  'pentagon-level',
  'cia-level'
]) {
  assert.equal(payload.includes(forbidden), false, `Forbidden public claim/secret pattern: ${forbidden}`);
}

assert.ok(GX_PUBLIC_RULES.some(x => x.includes('Never expose credentials')));
assert.ok(GX_PUBLIC_RULES.some(x => x.includes('Do not execute actions')));

console.log(`GX Evidence Registry Validation OK — ${GX_EVIDENCE.length} public evidence items`);
