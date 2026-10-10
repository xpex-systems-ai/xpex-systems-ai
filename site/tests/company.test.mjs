import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import { COMPANY_PLAN, companySnapshot, getPreparation, preparationCounts, calculatePilotEconomics } from '../src/data/company-readiness.js';
import { SYSTEM_INTELLIGENCE } from '../src/data/system-intelligence.js';
import handler from '../api/company.js';

const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8'));

test('seven unique dossiers preserve canonical stages and financial unknowns',()=>{
  const snapshot=companySnapshot();
  assert.equal(snapshot.systems.length,7);
  assert.equal(new Set(snapshot.systems.map(s=>s.slug)).size,7);
  for(const s of SYSTEM_INTELLIGENCE){
    const p=snapshot.systems.find(x=>x.slug===s.slug);
    assert.equal(p.status,s.status);
    assert.deepEqual(p.runtime,s.runtime);
    assert.deepEqual(p.limits,s.limits);
    assert.equal(p.verified_transfer,false);
    assert.equal(p.operating_cost,null);
    assert.equal(getPreparation(s.slug).system,s);
  }
  assert.equal(getPreparation('unknown'),null);
  for(const k of ['customers','settled_revenue','valuation','costs']) assert.equal(snapshot.commercial[k],null);
  assert.equal(snapshot.data_room.private_documents_uploaded,false);
  assert.equal(snapshot.assurance.level,'AL1');
  assert.equal(snapshot.assurance.independent_certification,'NOT_ASSERTED');
});

test('public and corporate plan mirrors agree; counts represent artifacts not readiness',()=>{
  assert.deepEqual(read('../../data/company/company-readiness-v1.json'),COMPANY_PLAN);
  assert.deepEqual(read('../public/company/company-review.json'),companySnapshot());
  assert.deepEqual(preparationCounts(),{systems:7,dossiers:7,openGates:9,publicMaterials:6});
  for(const p of COMPANY_PLAN.systems){
    for(const file of ['README.md','system-card.json','ai-bom.json','preparation.json','evidence/preparation-observation.json']){
      assert.ok(fs.existsSync(new URL('../../'+p.pack+'/'+file,import.meta.url)),`${p.slug}: missing ${file}`);
    }
    const packed=read(`../public/company/packs/${p.slug}.json`);
    assert.equal(packed.status,getPreparation(p.slug).system.status);
    assert.equal(packed.preparation.source_legal_title,'NOT_VERIFIED');
    assert.equal(packed.preparation.independent_acceptance,'PENDING');
  }
});

test('scenario economics compute contribution and allow loss without a revenue claim',()=>{
  const input={price:'1500',hours:'8',hourlyCost:'75',apiCost:'50',allocatedInfra:'100',fees:'50'};
  assert.deepEqual(calculatePilotEconomics(input),{cost:800,contribution:700,margin:700/1500,scenario:'USER_INPUT_ESTIMATE_NOT_ACTUAL_REVENUE'});
  const loss=calculatePilotEconomics({...input,price:'500'});
  assert.equal(loss.contribution,-300);
  assert.equal(loss.margin,-0.6);
});

test('missing, invalid and nonnumeric inputs never become a zero-based estimate',()=>{
  const good={price:'100',hours:'1',hourlyCost:'25',apiCost:'0',allocatedInfra:'0',fees:'0'};
  for(const value of ['', '  ', null, undefined, 'invalid', Infinity, '-1',true,[]]){
    assert.equal(calculatePilotEconomics({...good,apiCost:value}),null);
  }
  assert.equal(calculatePilotEconomics({...good,price:'0'}),null);
  assert.equal(calculatePilotEconomics(good).cost,25,'explicit zero costs are permitted');
});

test('the company API is stateless GET only and ignores private input',()=>{
  for(const method of ['POST','PUT','PATCH','DELETE','OPTIONS','HEAD']){
    const state={headers:{}};
    const res={setHeader(k,v){state.headers[k]=v;},status(v){state.status=v;return this;},json(v){state.body=v;return this;}};
    handler({method,body:{private_account:'fixture-private-account'},headers:{authorization:'fixture'}},res);
    assert.equal(state.status,405);
    assert.equal(state.headers.Allow,'GET');
    assert.equal(state.body.error,'PUBLIC_READ_ONLY_ENDPOINT');
  }
  const state={headers:{}};
  const res={setHeader(k,v){state.headers[k]=v;},status(v){state.status=v;return this;},json(v){state.body=v;return this;}};
  handler({method:'GET',query:{account:'fixture-private-account'}},res);
  assert.equal(state.status,200);
  assert.equal(state.headers['Cache-Control'],'no-store');
  assert.equal(JSON.stringify(state.body).includes('fixture-private-account'),false);
  assert.deepEqual(state.body,companySnapshot());
});
