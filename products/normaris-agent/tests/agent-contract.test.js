import {test} from "node:test";import assert from "node:assert/strict";import {auditAgentContract} from "../lib/agent-contract.js";
const good={name:"public_sample_agent",endpoint:"https://api.example.com/mcp",auth:"oauth2",writeActions:false,sensitiveData:false,tools:["search_public"]};
test("valid manifest is review candidate, never certified",()=>{let x=auditAgentContract(good);assert.equal(x.status,"REVIEW_CANDIDATE");assert.equal(x.certified,false);assert.equal(x.liveProbePerformed,false)});
test("write actions need human approval",()=>{let x=auditAgentContract({...good,writeActions:true,requiresHumanApproval:false});assert.equal(x.status,"NEEDS_REMEDIATION");assert.ok(x.checks.some(c=>c.id==="human_approval"&&!c.passed))});
test("reject localhost and private IP",()=>{for(let endpoint of ["http://localhost:8000/mcp","https://127.0.0.1:443/mcp","https://192.168.1.8/mcp"]){let x=auditAgentContract({...good,endpoint});assert.equal(x.status,"NEEDS_REMEDIATION")}});
test("reject sensitive public access",()=>{const x=auditAgentContract({...good,auth:"none",sensitiveData:true});assert.equal(x.status,"NEEDS_REMEDIATION")});
test("secret fields are prohibited",()=>{assert.throws(()=>auditAgentContract({...good,apiKey:"NEVER"}),/credenciais/)});
test("manifest audit hash stable",()=>{assert.equal(auditAgentContract(good).sha256,auditAgentContract(good).sha256)});
