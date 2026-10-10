import assert from 'node:assert/strict';
import { test } from 'node:test';
import handler, { SOURCES, readEcosystem } from '../api/ecosystem.js';
const now = Date.parse('2026-10-10T02:00:00Z');
const at = new Date(now).toISOString();
const data = () => ({
  integrations: { observedAt: at, coinbase: { mode:'READ_ONLY', runtimeConfigured:false, operatorAuthConfigured:false, historyConfigured:false, connectorVerifiedAt:'2026-10-09T05:52:02Z' }, communityCommand: {status:'AVAILABLE', environment:'staging'} },
  revenue: { mode:'READ_ONLY', observedAt: at, sources:[{id:'unified',status:'AVAILABLE',observedAt:at,count:10},{id:'basebounty',status:'AVAILABLE',observedAt:at,count:0}] },
  services: { services:[{ serviceId:'gxeon_json_validate_v1',status:'AVAILABLE',unitPriceCredits:2,unit:'payload' }] }
});
const json = value => new Response(JSON.stringify(value), { headers:{'content-type':'application/json'} });
function fetcher(input, calls = []) {
  return async (url, options) => {
    calls.push({url,options});
    const id = Object.keys(SOURCES).find(k => SOURCES[k] === url);
    assert.ok(id, 'only exact fixed GXEON endpoints');
    return json(input[id]);
  };
}
test('fixed GET-only sources; no credential forwarding or financial leak', async () => {
  const input=data(), calls=[];
  input.integrations.coinbase.account='private-account';
  input.integrations.coinbase.balance=999;
  input.revenue.privateLedger=[{received:100}];
  input.revenue.opportunities=[{privateNote:'fixture-private-note'}];
  const result=await readEcosystem({fetcher:fetcher(input,calls),now});
  assert.equal(result.mode,'PUBLIC_READ_ONLY');
  assert.equal(result.status,'AVAILABLE');
  assert.equal(calls.length,3);
  for(const call of calls) {
    assert.equal(call.options.method,'GET');
    assert.equal(call.options.redirect,'error');
    assert.deepEqual(call.options.headers,{Accept:'application/json'});
  }
  const encoded=JSON.stringify(result);
  for(const text of ['private-account','fixture-private-note','privateLedger']) assert.equal(encoded.includes(text),false);
  assert.equal(result.modules.integrations.coinbase.balance,null);
  assert.equal(result.modules.integrations.coinbase.status,'SETUP_REQUIRED');
  assert.equal(result.modules.revenue.financials.confirmed,null);
  assert.equal(result.modules.revenue.sources[1].count,0, 'verified empty result retains zero');
});
test('configured Coinbase is not reported as synchronized', async () => {
  const input=data();
  Object.assign(input.integrations.coinbase,{runtimeConfigured:true,operatorAuthConfigured:true,historyConfigured:true});
  const result=await readEcosystem({fetcher:fetcher(input),now});
  assert.equal(result.modules.integrations.coinbase.status,'CONFIGURED_NOT_SYNCED');
  assert.equal(result.modules.integrations.coinbase.usdc,null);
  assert.equal(result.modules.integrations.coinbase.network,null);
});
test('stale and future timestamps never become fresh', async () => {
  const input=data();
  input.revenue.sources[0].observedAt='2026-10-10T01:30:00Z';
  input.revenue.sources[1].observedAt='2026-10-10T03:00:00Z';
  input.integrations.observedAt='2026-10-10T01:30:00Z';
  const result=await readEcosystem({fetcher:fetcher(input),now});
  assert.equal(result.modules.revenue.sources[0].status,'STALE');
  assert.equal(result.modules.revenue.sources[1].status,'UNAVAILABLE');
  assert.equal(result.modules.revenue.sources[1].count,null);
  assert.equal(result.modules.integrations.coinbase.status,'NOT_VERIFIED');
  assert.equal(result.modules.integrations.command.status,'NOT_VERIFIED');
  assert.equal(result.status,'DEGRADED');
});
test('duplicate sources invalidate the module and arbitrary amounts are rejected', async () => {
  const input=data();
  input.revenue.sources.push({...input.revenue.sources[0]});
  input.services.services[0].unitPriceCredits=-1;
  const result=await readEcosystem({fetcher:fetcher(input),now});
  assert.equal(result.modules.revenue.status,'UNAVAILABLE');
  assert.equal(result.modules.services.status,'UNAVAILABLE');
  assert.equal(result.status,'DEGRADED');
});
test('one upstream failure does not suppress other real data', async () => {
  const input=data(), reader=fetcher(input);
  const result=await readEcosystem({fetcher:async(url,o)=>url===SOURCES.revenue ? new Response('offline',{status:503}) : reader(url,o),now});
  assert.equal(result.status,'DEGRADED');
  assert.equal(result.modules.revenue.status,'UNAVAILABLE');
  assert.equal(result.modules.services.count,1);
});
test('non-JSON, oversized streams and failed fetches remain unavailable', async () => {
  for(const f of [
    async()=>new Response('<html>sign-in</html>',{headers:{'content-type':'text/html'}}),
    async()=>new Response(' '.repeat(129*1024),{headers:{'content-type':'application/json'}}),
    async()=>{throw new Error('fixture upstream failure');}
  ]) {
    const result=await readEcosystem({fetcher:f,now});
    assert.equal(result.status,'UNAVAILABLE');
    assert.equal(result.modules.services.count,undefined);
    assert.equal(JSON.stringify(result).includes('fixture upstream failure'),false);
  }
});
test('catalog names are allowlisted and presence is not execution or money', async () => {
  const input=data();
  input.services.services[0].name='<script>fixture</script>';
  input.services.services.push({serviceId:'private-custom-service',name:'private service'});
  const result=await readEcosystem({fetcher:fetcher(input),now});
  assert.equal(result.modules.services.count,1);
  assert.equal(result.modules.services.catalog[0].name,'GXEON JSON Validate');
  assert.equal(result.modules.services.catalog[0].execution,'NOT_TESTED');
  assert.equal(result.modules.services.catalog[0].status,'CATALOG_LISTED');
  assert.equal(result.modules.revenue.agenticTrade,'ACCOUNT_AND_PUBLICATION_NOT_VERIFIED');
});
test('write methods fail before calling any upstream', async () => {
  const previous=globalThis.fetch;
  let calls=0; globalThis.fetch=async()=>{calls++;throw new Error('must not run');};
  try {
    for(const method of ['POST','PUT','PATCH','DELETE','OPTIONS']) {
      const state={headers:{}};
      const res={setHeader(k,v){state.headers[k]=v;},status(code){state.code=code;return this;},json(body){state.body=body;return this;}};
      await handler({method,query:{url:'http://localhost/admin'},headers:{Authorization:'fixture'}},res);
      assert.equal(state.code,405);
      assert.equal(state.headers.Allow,'GET');
      assert.equal(state.body.error,'PUBLIC_READ_ONLY_ENDPOINT');
    }
    assert.equal(calls,0);
  } finally {globalThis.fetch=previous;}
});
