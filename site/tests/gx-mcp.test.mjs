import assert from 'node:assert/strict';
import handler from '../api/mcp/gx.js';

function invoke(method, body={}) {
  return new Promise((resolve,reject)=>{
    const req={method,body,headers:{},socket:{remoteAddress:'127.0.0.1'}};
    const state={status:200,headers:{},body:null,ended:false};
    const res={
      setHeader(k,v){state.headers[k.toLowerCase()]=v;},
      status(code){state.status=code; return this;},
      json(value){state.body=value; state.ended=true; resolve(state); return this;},
      end(){state.ended=true; resolve(state); return this;}
    };
    Promise.resolve(handler(req,res)).catch(reject);
  });
}

const health=await invoke('GET');
assert.equal(health.status,200);
assert.equal(health.body.name,'xpex-gx-neural-copilot');
assert.equal(health.body.scope,'public-evidence-read-only');
assert.equal(health.body.knowledge.systems,7);
assert.equal(health.body.knowledge.materialLineages,20);
assert.equal(health.body.tools,11);

const init=await invoke('POST',{jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2025-03-26'}});
assert.equal(init.status,200);
assert.equal(init.body.result.serverInfo.name,'xpex-gx-neural-copilot');
assert.equal(init.body.result.capabilities.tools.listChanged,false);

const list=await invoke('POST',{jsonrpc:'2.0',id:2,method:'tools/list',params:{}});
assert.equal(list.status,200);
assert.equal(list.body.result.tools.length,11);
assert.ok(list.body.result.tools.some(t=>t.name==='xpex_gx_get_system'));
assert.ok(list.body.result.tools.some(t=>t.name==='xpex_gx_prepare_audit'));

const system=await invoke('POST',{jsonrpc:'2.0',id:3,method:'tools/call',params:{name:'xpex_gx_get_system',arguments:{slug:'plugin-factory'}}});
assert.equal(system.status,200);
assert.equal(system.body.result.structuredContent.name,'XPeX Plugin Factory');
assert.equal(system.body.result.structuredContent.status,'DEMO READY');

const graph=await invoke('POST',{jsonrpc:'2.0',id:4,method:'tools/call',params:{name:'xpex_gx_get_ecosystem_graph',arguments:{}}});
assert.equal(graph.body.result.structuredContent.counts.detailed_systems,7);
assert.equal(graph.body.result.structuredContent.counts.material_lineages,20);

const audit=await invoke('POST',{jsonrpc:'2.0',id:5,method:'tools/call',params:{name:'xpex_gx_prepare_audit',arguments:{slug:'wallet-command'}}});
assert.equal(audit.body.result.structuredContent.mode,'READ_ONLY_PREPARATION');
assert.ok(audit.body.result.structuredContent.prohibited_actions.includes('self-approval'));

console.log('GX Neural Copilot MCP Validation OK — 11 read-only tools / 7 systems / 20 lineages');
