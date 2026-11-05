import {search,health} from "../lib/core.js";
const version="2025-03-26";
function out(id,result){return {jsonrpc:"2.0",id,result};}
function fail(id,code,message){return {jsonrpc:"2.0",id,error:{code,message}};}
const tools=[{name:"normaris_search_official_references",description:"Read-only search of a limited list of verified official source links. NOT the complete COSIT corpus; no tax opinion.",inputSchema:{type:"object",properties:{query:{type:"string",minLength:4,maxLength:500}},required:["query"]}},{name:"normaris_get_demo_status",description:"Accurate demonstration status including ingestion and RAG integration.",inputSchema:{type:"object",properties:{}}}];
export default function handler(req,res){res.setHeader("Cache-Control","no-store");res.setHeader("MCP-Protocol-Version",version);
 if(req.method!=="POST")return res.status(405).json({error:"Use POST para JSON-RPC"});
 const b=req.body||{},id=b.id??null;
 if(b.jsonrpc!=="2.0"||typeof b.method!=="string")return res.status(400).json(fail(id,-32600,"Invalid request"));
 if(b.method==="notifications/initialized")return res.status(202).end();
 if(b.method==="initialize")return res.json(out(id,{protocolVersion:version,capabilities:{tools:{}},serverInfo:{name:"normaris-demo",version:"0.1.0"},instructions:"Official reference links only; no full live fiscal corpus."}));
 if(b.method==="ping")return res.json(out(id,{}));
 if(b.method==="tools/list")return res.json(out(id,{tools}));
 if(b.method==="tools/call"){try{let n=b.params?.name;if(n==="normaris_get_demo_status")return res.json(out(id,{content:[{type:"text",text:JSON.stringify(health())}]}));if(n==="normaris_search_official_references")return res.json(out(id,{content:[{type:"text",text:JSON.stringify(search(b.params?.arguments?.query))}]}));return res.status(404).json(fail(id,-32601,"Unknown tool"));}catch(e){return res.status(e.status||500).json(fail(id,-32602,e.status?e.message:"Internal error"));}}
 return res.status(404).json(fail(id,-32601,"Unknown method"));
}