import assert from 'node:assert/strict';
import { SYSTEM_INTELLIGENCE, MATERIAL_LINEAGES, getSystem } from '../src/data/system-intelligence.js';

assert.equal(SYSTEM_INTELLIGENCE.length,7,'exactly seven public system intelligence pages');
assert.equal(MATERIAL_LINEAGES.length,20,'twenty material lineages');

const slugs=SYSTEM_INTELLIGENCE.map(x=>x.slug);
assert.equal(new Set(slugs).size,slugs.length,'system slugs must be unique');

for(const system of SYSTEM_INTELLIGENCE){
  assert.ok(system.id && system.name && system.role && system.status);
  assert.ok(system.runtime?.provider);
  assert.ok(system.source?.repo && system.source?.url?.startsWith('https://'));
  assert.ok(Array.isArray(system.architecture) && system.architecture.length>=4);
  assert.ok(Array.isArray(system.security) && system.security.length>=1);
  assert.ok(Array.isArray(system.limits) && system.limits.length>=1);
  assert.ok(Array.isArray(system.evidence) && system.evidence.length>=2);
  assert.equal(getSystem(system.slug)?.id,system.id);
}

const academy=getSystem('academy');
assert.equal(academy.runtime.state,'UNVERIFIED_CURRENT_RUNTIME');
assert.equal(Boolean(academy.runtime.url),false,'Academy must not invent a canonical public runtime');

const wallet=getSystem('wallet-command');
assert.equal(wallet.status,'HARDENING');
assert.ok(wallet.limits.some(x=>x.includes('url.parse')));

const payload=JSON.stringify(SYSTEM_INTELLIGENCE).toLowerCase();
for(const forbidden of ['soc 2 certified','iso 27001 certified','pentagon-level','cia-level','guaranteed revenue']){
  assert.equal(payload.includes(forbidden),false,'unsupported claim: '+forbidden);
}

console.log('System Intelligence Validation OK — 7 pages / 20 material lineages');
