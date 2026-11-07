import {search,health} from "../lib/core.js";
import {evidencePack,inspectSource} from "../lib/evidence.js";
import {commerce} from "../lib/commerce.js";
const protocol="2025-03-26";
const tools=[
 {name:"cosivant_search_official_references",description:"Busca links oficiais catalogados. Não consulta acervo COSIT integral nem oferece parecer.",inputSchema:{type:"object",properties:{query:{type:"string",minLength:4,maxLength:500}},required:["query"],additionalProperties:false}},
 {name:"cosivant_evidence_audit",description:"Relatório de referências catalogadas, lacunas e hash local de metadados. Não verifica documento remoto, vigência ou pagamento.",inputSchema:{type:"object",properties:{query:{type:"string",minLength:4,maxLength:500}},required:["query"],additionalProperties:false}},
 {name:"cosivant_inspect_source",description:"Inspeciona os limites da referência catalogada sem buscar URL arbitrária.",inputSchema:{type:"object",properties:{sourceId:{type:"string"}},required:["sourceId"],additionalProperties:false}},
 {name:"cosivant_list_offers",description:"Propostas de serviços com preços hipotéticos, sem cobrança ativa.",inputSchema:{type:"object",properties:{},additionalProperties:false}},
 {name:"cosivant_get_demo_status",description:"Saúde da demonstração, sem afirmar RAG ou pagamento homologado.",inputSchema:{type:"object",properties:{},additionalProperties:false}}
];
const ok=(id,result)=>({jsonrpc:"2.0",id,result});
const fail=(id,code,message)=>({jsonrpc:"2.0",id,error:{code,message}});
export default function handler(req,res){
 res.setHeader("Cache-Control","no-store");res.setHeader("MCP-Protocol-Version",protocol);
 if(req.method!=="POST")return res.status(405).json({error:"Use POST JSON-RPC"});
 const b=req.body||{},id=b.id??null;
 if(b.jsonrpc!=="2.0"||typeof b.method!=="string")return res.status(400).json(fail(id,-32600,"Invalid request"));
 if(b.method==="notifications/initialized")return res.status(202).end();
 if(b.method==="initialize")return res.status(200).json(ok(id,{protocolVersion:protocol,capabilities:{tools:{}},serverInfo:{name:"cosivant-agent",version:"0.2.0"},instructions:"Read-only public reference preview, no full COSIT corpus, certified RAG or payments."}));
 if(b.method==="ping")return res.status(200).json(ok(id,{}));
 if(b.method==="tools/list")return res.status(200).json(ok(id,{tools}));
 if(b.method==="tools/call"){
  const name=b.params?.name,args=b.params?.arguments||{};
  if(!tools.some(t=>t.name===name))return res.status(404).json(fail(id,-32601,"Unknown tool"));
  try{
   let r;
   if(name==="cosivant_search_official_references")r=search(args.query);
   if(name==="cosivant_evidence_audit")r=evidencePack(args.query);
   if(name==="cosivant_inspect_source")r=inspectSource(args.sourceId);
   if(name==="cosivant_list_offers")r=commerce();
   if(name==="cosivant_get_demo_status")r=health();
   return res.status(200).json(ok(id,{content:[{type:"text",text:JSON.stringify(r)}],isError:false}));
  }catch(e){return res.status(e.status||500).json(fail(id,-32602,e.status?e.message:"Internal error"));}
 }
 return res.status(404).json(fail(id,-32601,"Unknown method"));
}
