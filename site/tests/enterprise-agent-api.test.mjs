import assert from 'node:assert/strict';
import agentHandler from '../api/agent-api.js';
import mcpHandler from '../api/mcp/enterprise.js';
import { ENTERPRISE_OFFERINGS } from '../src/data/enterprise-offerings.js';
import { matchEnterpriseNeed, discoveryManifest } from '../src/data/enterprise-router.js';

function invoke(handler,method,body={}){
  return new Promise((resolve,reject)=>{
    const req={method,body,headers:{},socket:{remoteAddress:'127.0.0.1'}};
    const state={status:200,headers:{},body:null};
    const res={
      setHeader(k,v){state.headers[String(k).toLowerCase()]=v;},
      status(code){state.status=code;return this;},
      json(value){state.body=value;resolve(state);return this;},
      end(){resolve(state);return this;}
    };
    Promise.resolve(handler(req,res)).catch(reject);
  });
}

assert.equal(ENTERPRISE_OFFERINGS.length,7);
assert.equal(new Set(ENTERPRISE_OFFERINGS.map(x=>x.id)).size,7);

const match=matchEnterpriseNeed({
  need:'We need AI agents integrated with GitHub and cloud deployments with human approval',
  company_type:'enterprise AI'
});
assert.ok(match.length>=1);
assert.ok(['agentic-engineering','company-intelligence','digital-worker-composition'].includes(match[0].id));

const manifest=discoveryManifest();
assert.equal(manifest.name,'XPeX Enterprise Agent API');
assert.equal(manifest.endpoints.rest,'https://xpex-systems-ai.vercel.app/api/agent-api');
assert.equal(manifest.endpoints.mcp,'https://xpex-systems-ai.vercel.app/api/mcp/enterprise');

const health=await invoke(agentHandler,'GET');
assert.equal(health.status,200);
assert.equal(health.body.offerings.length,7);

const restMatch=await invoke(agentHandler,'POST',{
  action:'match',
  need:'We are an agent marketplace that needs MCP services and agent distribution',
  company_type:'agent platform'
});
assert.equal(restMatch.status,200);
assert.ok(restMatch.body.matches.length>=1);
assert.equal(restMatch.body.matches[0].id,'agent-distribution');

const mcpHealth=await invoke(mcpHandler,'GET');
assert.equal(mcpHealth.status,200);
assert.equal(mcpHealth.body.name,'xpex-enterprise-agent-api');
assert.equal(mcpHealth.body.tools,8);
assert.equal(mcpHealth.body.offerings,7);

const list=await invoke(mcpHandler,'POST',{
  jsonrpc:'2.0',id:1,method:'tools/list',params:{}
});
assert.equal(list.status,200);
assert.equal(list.body.result.tools.length,8);
assert.ok(list.body.result.tools.some(t=>t.name==='xpex_enterprise_match_need'));
assert.ok(list.body.result.tools.some(t=>t.name==='xpex_enterprise_prepare_pilot'));

const pilot=await invoke(mcpHandler,'POST',{
  jsonrpc:'2.0',id:2,method:'tools/call',
  params:{name:'xpex_enterprise_prepare_pilot',arguments:{offering_id:'company-intelligence'}}
});
assert.equal(pilot.status,200);
assert.equal(pilot.body.result.structuredContent.offering_id,'company-intelligence');
assert.ok(pilot.body.result.structuredContent.prohibited_claims.length>=3);

const payload=JSON.stringify({ENTERPRISE_OFFERINGS,manifest}).toLowerCase();
for(const forbidden of ['guaranteed roi','guaranteed revenue','partnered with','customer of xpex']){
  assert.equal(payload.includes(forbidden),false,'unsupported claim: '+forbidden);
}

console.log('Enterprise Agent API Validation OK — 7 offerings / 8 MCP tools / stateless evidence-backed routing');
