import assert from 'node:assert/strict';
import fs from 'node:fs';
import { deadlineLabel } from '../src/global-launch.js';

const radar=JSON.parse(fs.readFileSync(new URL('../public/data/global-launch-radar-v1.json', import.meta.url),'utf8'));

assert.equal(radar.schema_version,'1.0');
assert.equal(radar.snapshot_date,'2026-10-07');
assert.ok(Array.isArray(radar.priority_targets));
assert.ok(radar.priority_targets.length >= 10);

const ids=radar.priority_targets.map(x=>x.id);
assert.equal(new Set(ids).size,ids.length,'target ids must be unique');

const yc=radar.priority_targets.find(x=>x.id==='yc-w27');
assert.equal(yc.status,'OPEN');
assert.equal(yc.deadline,'2026-11-02T20:00:00-08:00');

const alchemist=radar.priority_targets.find(x=>x.id==='alchemist');
assert.equal(alchemist.status,'ROLLING');
assert.equal(alchemist.fit,'VERY_HIGH');

for(const target of radar.priority_targets){
  assert.ok(/^https:\/\//.test(target.source),target.id+' must have HTTPS official source');
  assert.ok(['P0','P1','P2'].includes(target.priority),target.id+' invalid priority');
  assert.ok(['VERY_HIGH','HIGH','MEDIUM','LOW','REVIEW_REQUIRED'].includes(target.fit),target.id+' invalid fit');
}

for(const zone of ['America/Sao_Paulo','America/Los_Angeles','Asia/Tokyo','UTC']) {
  assert.equal(deadlineLabel({deadline:'2026-11-18'},{timeZone:zone}),'Nov 18, 2026','calendar dates must not shift in '+zone);
}
assert.equal(deadlineLabel(yc,{timeZone:'America/Sao_Paulo'}),'Nov 3, 2026','YC timestamp keeps its real timezone conversion');
assert.equal(deadlineLabel(yc,{timeZone:'America/Los_Angeles'}),'Nov 2, 2026');
assert.equal(deadlineLabel({deadline:'invalid'}),'invalid');
assert.equal(deadlineLabel({deadline:null,status:'ROLLING'}),'Rolling intake');
const nvidia=radar.priority_targets.find(x=>x.id==='nvidia-inception');
assert.equal(nvidia.status,'ELIGIBILITY_REVIEW_REQUIRED');
assert.ok(nvidia.rationale.includes('cryptocurrency'));

const payload=JSON.stringify(radar).toLowerCase();
for(const forbidden of ['accepted by','partnered with','funded by y combinator','yc-backed','techstars-backed']){
  assert.equal(payload.includes(forbidden),false,'unsupported affiliation claim: '+forbidden);
}

console.log(`Global Launch Radar Validation OK — ${radar.priority_targets.length} tracked programs / ${radar.investor_watch.length} investor targets`);
