import { ENTERPRISE_OFFERINGS, ENTERPRISE_CONTACT } from '../../src/data/enterprise-offerings.js';
import { matchEnterpriseNeed, solutionPack, preparePilot, discoveryManifest, systemProof, getOffering } from '../../src/data/enterprise-router.js';

const SERVER={name:'xpex-enterprise-agent-api',version:'1.0.0'};
const PROTOCOL='2025-03-26';

function textContent(v){return [{type:'text',text:typeof v==='string'?v:JSON.stringify(v,null,2)}];}
function ok(v){return {content:textContent(v),structuredContent:v};}
function fail(message,details={}){const v={error:message,...details};return {content:textContent(v),structuredContent:v,isError:true};}
function rpcError(id,code,message){return {jsonrpc:'2.0',id:id??null,error:{code,message}};}

const tools=[
  {
    name:'xpex_enterprise_discover',
    description:'Return the machine-readable XPeX Enterprise Agent API manifest, available solution categories, endpoints and public contact handoff.',
    inputSchema:{type:'object',properties:{},additionalProperties:false}
  },
  {
    name:'xpex_enterprise_match_need',
    description:'Match a company, enterprise AI team, accelerator, agent platform or operator need to the strongest XPeX systems, platforms and agent capabilities.',
    inputSchema:{
      type:'object',
      properties:{
        need:{type:'string',maxLength:1200},
        company_type:{type:'string',maxLength:300},
        goals:{type:'string',maxLength:1200},
        constraints:{type:'string',maxLength:1200}
      },
      required:['need'],
      additionalProperties:false
    }
  },
  {
    name:'xpex_enterprise_get_solution_pack',
    description:'Get one evidence-backed XPeX solution pack with system/runtime proof, maturity and engagement model.',
    inputSchema:{
      type:'object',
      properties:{offering_id:{type:'string'}},
      required:['offering_id'],
      additionalProperties:false
    }
  },
  {
    name:'xpex_enterprise_get_agent_assets',
    description:'Get machine-consumable XPeX agent/plugin/MCP assets that are relevant to enterprise or agent-platform integration.',
    inputSchema:{type:'object',properties:{},additionalProperties:false}
  },
  {
    name:'xpex_enterprise_get_demo_pack',
    description:'Return the strongest public demo and technical evidence links for enterprise evaluation without inflating maturity.',
    inputSchema:{
      type:'object',
      properties:{offering_id:{type:'string'}},
      additionalProperties:false
    }
  },
  {
    name:'xpex_enterprise_prepare_pilot',
    description:'Prepare a bounded Evidence First pilot blueprint for a company need. This produces a plan, not a contract or guaranteed result.',
    inputSchema:{
      type:'object',
      properties:{
        offering_id:{type:'string'},
        need:{type:'string',maxLength:1200},
        company_type:{type:'string',maxLength:300},
        constraints:{type:'string',maxLength:1200}
      },
      additionalProperties:false
    }
  },
  {
    name:'xpex_enterprise_get_fit',
    description:'Explain why a specific XPeX offering fits a buyer profile and where its current maturity limits are.',
    inputSchema:{
      type:'object',
      properties:{offering_id:{type:'string'},buyer:{type:'string'}},
      required:['offering_id'],
      additionalProperties:false
    }
  },
  {
    name:'xpex_enterprise_contact_handoff',
    description:'Return the canonical public handoff for an interested company, accelerator, investor or agent platform to inspect XPeX and contact the founder.',
    inputSchema:{
      type:'object',
      properties:{context:{type:'string',maxLength:500}},
      additionalProperties:false
    }
  }
];

async function callTool(name,args={}){
  if(name==='xpex_enterprise_discover') return ok(discoveryManifest());

  if(name==='xpex_enterprise_match_need'){
    const matches=matchEnterpriseNeed(args);
    return ok({
      query:{need:args.need||'',company_type:args.company_type||'',goals:args.goals||'',constraints:args.constraints||''},
      matches:matches.map(x=>({
        id:x.id,name:x.name,category:x.category,maturity:x.maturity,promise:x.promise,engagement:x.engagement,score:x.score,proof:x.proof
      })),
      recommended_next_step:matches[0] ? `Inspect solution pack: ${matches[0].id}` : null,
      truth_boundary:'A match is a capability recommendation, not proof of a customer relationship, procurement decision or guaranteed result.'
    });
  }

  if(name==='xpex_enterprise_get_solution_pack'){
    const pack=solutionPack(String(args.offering_id||''));
    return pack ? ok(pack) : fail('Unknown offering_id.',{available:ENTERPRISE_OFFERINGS.map(x=>x.id)});
  }

  if(name==='xpex_enterprise_get_agent_assets'){
    return ok({
      assets:[
        {
          name:'GX Neural Copilot',
          type:'plugin+mcp',
          purpose:'Evidence-backed interface between ChatGPT/Codex and XPeX Company Intelligence.',
          endpoint:'https://xpex-systems-ai.vercel.app/api/mcp/gx',
          state:'PRODUCTION READY / READ ONLY'
        },
        {
          name:'XPeX Plugin Factory',
          type:'compiler',
          purpose:'Compile strict blueprints into plugin, MCP and skill packages with security-policy gates.',
          endpoint:'https://xpex-plugin-factory-production.up.railway.app',
          state:'DEMO READY'
        },
        {
          name:'XPeX Enterprise Agent API',
          type:'rest+mcp',
          purpose:'Machine-readable discovery and enterprise solution matching for XPeX systems, platforms and agents.',
          endpoint:'https://xpex-systems-ai.vercel.app/api/agent-api',
          mcp:'https://xpex-systems-ai.vercel.app/api/mcp/enterprise',
          state:'PUBLIC DISCOVERY'
        }
      ],
      policy:'Evidence First',
      note:'Public machine access does not grant production mutation, financial authority or private-data access.'
    });
  }

  if(name==='xpex_enterprise_get_demo_pack'){
    const offering=args.offering_id ? getOffering(String(args.offering_id)) : null;
    const systems=offering ? systemProof(offering.systems) : ENTERPRISE_OFFERINGS.slice(0,4).flatMap(x=>systemProof(x.systems)).filter((x,i,a)=>a.findIndex(y=>y.slug===x.slug)===i);
    return ok({
      offering:offering ? {id:offering.id,name:offering.name,maturity:offering.maturity} : null,
      systems,
      flagship_cases:'https://github.com/xpex-systems-ai/xpex-systems-ai/blob/main/docs/FLAGSHIP_CASES.md',
      company_site:'https://xpex-systems-ai.vercel.app',
      neural_workforce:'https://github.com/xpex-systems-ai/xpex-systems-ai/blob/main/NEURAL_WORKFORCE_MANIFESTO.md'
    });
  }

  if(name==='xpex_enterprise_prepare_pilot'){
    const pilot=preparePilot(args);
    return pilot ? ok(pilot) : fail('Unable to prepare pilot from the supplied input.');
  }

  if(name==='xpex_enterprise_get_fit'){
    const offering=getOffering(String(args.offering_id||''));
    if(!offering) return fail('Unknown offering_id.',{available:ENTERPRISE_OFFERINGS.map(x=>x.id)});
    return ok({
      offering:{id:offering.id,name:offering.name,maturity:offering.maturity},
      buyer:args.buyer||'unspecified enterprise evaluator',
      why_fit:offering.promise,
      buyer_profiles:offering.buyers,
      engagement:offering.engagement,
      evidence:systemProof(offering.systems),
      current_limits:'Inspect each system evidence record and open gates before production or procurement claims.'
    });
  }

  if(name==='xpex_enterprise_contact_handoff'){
    return ok({
      context:args.context||null,
      contact:ENTERPRISE_CONTACT,
      recommended_message:'I reviewed the XPeX evidence pack and would like to discuss an enterprise/agent integration or pilot.',
      inspection_order:[
        ENTERPRISE_CONTACT.website,
        ENTERPRISE_CONTACT.case_pack,
        'https://xpex-systems-ai.vercel.app/api/mcp/gx',
        ENTERPRISE_CONTACT.linkedin
      ]
    });
  }

  return fail('Unknown tool.',{available:tools.map(x=>x.name)});
}

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Accept, MCP-Protocol-Version, Mcp-Session-Id');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');

  if(req.method==='OPTIONS') return res.status(204).end();
  if(req.method==='GET'){
    return res.status(200).json({
      name:SERVER.name,version:SERVER.version,status:'ready',
      transport:'streamable-http-json',
      scope:'enterprise-discovery-read-only',
      protocolVersion:PROTOCOL,
      tools:tools.length,
      offerings:ENTERPRISE_OFFERINGS.length,
      endpoint:'https://xpex-systems-ai.vercel.app/api/mcp/enterprise'
    });
  }
  if(req.method!=='POST'){
    res.setHeader('Allow','GET, POST, OPTIONS');
    return res.status(405).json({error:'Method not allowed'});
  }

  const {jsonrpc,id,method,params={}}=req.body||{};
  if(jsonrpc!=='2.0'||!method) return res.status(400).json(rpcError(id,-32600,'Invalid Request'));

  if(method==='initialize'){
    return res.status(200).json({
      jsonrpc:'2.0',id,
      result:{
        protocolVersion:params.protocolVersion||PROTOCOL,
        capabilities:{tools:{listChanged:false}},
        serverInfo:SERVER,
        instructions:'Use XPeX enterprise discovery tools to match real company needs to evidence-backed systems, platforms and agent capabilities. Do not invent customers, partnerships, procurement intent, revenue or guaranteed outcomes.'
      }
    });
  }
  if(method==='notifications/initialized') return res.status(204).end();
  if(method==='ping') return res.status(200).json({jsonrpc:'2.0',id,result:{}});
  if(method==='tools/list') return res.status(200).json({jsonrpc:'2.0',id,result:{tools}});

  if(method==='tools/call'){
    try{
      const result=await callTool(params?.name,params?.arguments||{});
      return res.status(200).json({jsonrpc:'2.0',id,result});
    }catch(error){
      return res.status(200).json({jsonrpc:'2.0',id,result:fail('Tool execution failed safely.',{reason:error?.message||'unknown'})});
    }
  }

  return res.status(200).json(rpcError(id,-32601,'Method not found'));
}
