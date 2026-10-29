import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {SYSTEM_INTELLIGENCE,MATERIAL_LINEAGES} from '../src/data/system-intelligence.js';
import {ENTERPRISE_OFFERINGS} from '../src/data/enterprise-offerings.js';

const root=new URL('../../',import.meta.url);
test('frozen institutional assets, registries, APIs and presentation remain byte identical',()=>{
  const baseline=JSON.parse(fs.readFileSync(new URL('docs/omnix-ai/gx-02-0/evidence/baseline.json',root)));
  const files=baseline.repositories.find(r=>r.name==='xpex-systems-ai').canonicalFiles;
  const additive=new Set(['site/package.json','site/package-lock.json','site/src/omnix.js','site/src/public-site.js','site/src/system-page.js']);
  let checked=0;for(const [file,hash]of Object.entries(files)){
    if(additive.has(file))continue;
    const bytes=fs.readFileSync(new URL(file,root));
    const canonical=/\.(js|mjs|css|json|svg|md|html|txt)$/.test(file)?Buffer.from(bytes.toString('utf8').replaceAll('\r\n','\n')):bytes;
    assert.equal(createHash('sha256').update(canonical).digest('hex'),hash,file);
    checked++;
  }
  assert.ok(checked>=80);
});
test('canonical system slugs, material lineages and enterprise offers stay available',()=>{
  assert.deepEqual(SYSTEM_INTELLIGENCE.map(s=>s.slug).sort(),['systems-command','wallet-command','audit-os','plugin-factory','studio-ai','api-fabric','academy'].sort());
  assert.equal(MATERIAL_LINEAGES.length,20);
  assert.equal(ENTERPRISE_OFFERINGS.length,7);
});
test('download remains the frozen, explicitly synthetic portal report',()=>{
  const file=fs.readFileSync(new URL('../public/examples/omnix-synthetic-report.json',import.meta.url));
  assert.equal(JSON.parse(file).report.testData,true);
  assert.equal(createHash('sha256').update(file).digest('hex'),'86c87f8f879615afe538d4f567af96a9c26b95b7648dc37ca2bf4214d3b6dff2');
});
