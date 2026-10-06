import assert from 'node:assert/strict';
import { SYSTEM_INTELLIGENCE } from '../src/data/system-intelligence.js';
const s=SYSTEM_INTELLIGENCE.systems;
assert.equal(SYSTEM_INTELLIGENCE.schema_version,'2.0');
assert.equal(s.length,7);
assert.equal(new Set(s.map(x=>x.id)).size,s.length);
for(const x of s){assert.ok(x.name&&x.summary&&x.status&&x.provider);assert.ok(Array.isArray(x.proof)&&x.proof.length);assert.ok(x.links&&Object.keys(x.links).length);}
assert.equal(s.find(x=>x.id==='wallet').media_class,'E2');
assert.equal(s.find(x=>x.id==='systems-command').media_class,'E1');
console.log('GX System Intelligence V2 OK — '+s.length+' canonical system records');
