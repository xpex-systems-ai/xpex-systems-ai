import {test} from "node:test";import assert from "node:assert/strict";
import {evidencePack,inspectSource} from "../lib/evidence.js";import {commerce} from "../lib/commerce.js";
import checkout from "../api/checkout.js";import mcp from "../api/mcp.js";
function res(){return {statusCode:200,body:null,status(x){this.statusCode=x;return this},setHeader(){return this},json(x){this.body=x;return this},end(){return this}}}
test("report has references, explicit unknown validity",()=>{const v=evidencePack("pesquisa COSIT");assert.ok(v.sources.length);assert.equal(v.decision,"NOT_APPROVED_FOR_TAX_ADVICE");assert.equal(v.summary.corpusIndexed,0);assert.equal(v.sha256.length,64)});
test("metadata hash deterministic",()=>{assert.equal(evidencePack("vigência de normas").sha256,evidencePack("vigência de normas").sha256)});
test("source allowlist disallows arbitrary URLs",()=>{assert.throws(()=>inspectSource("http://127.0.0.1"));assert.equal(inspectSource("rfb-cosit").websiteCheckedLive,false)});
test("commerce remains off",()=>{const s=commerce();assert.equal(s.enabled,false);assert.equal(s.settlementsVerified,0);assert.equal(s.receivingWalletVerified,false)});
test("checkout always fails closed",()=>{const r=res();checkout({method:"POST"},r);assert.equal(r.statusCode,503);assert.equal(r.body.paid,false)});
test("MCP offers new audit tools",()=>{const r=res();mcp({method:"POST",body:{jsonrpc:"2.0",id:1,method:"tools/list"}},r);assert.equal(r.statusCode,200);assert.ok(r.body.result.tools.find(x=>x.name==="cosivant_evidence_audit"))});
test("MCP audit results have proof metadata only",()=>{const r=res();mcp({method:"POST",body:{jsonrpc:"2.0",id:2,method:"tools/call",params:{name:"cosivant_evidence_audit",arguments:{query:"soluções COSIT"}}}},r);assert.equal(r.statusCode,200);assert.equal(JSON.parse(r.body.result.content[0].text).summary.corpusIndexed,0)});
test("MCP rejects unlisted tools",()=>{const r=res();mcp({method:"POST",body:{jsonrpc:"2.0",id:3,method:"tools/call",params:{name:"steal_keys"}}},r);assert.equal(r.statusCode,404)});
