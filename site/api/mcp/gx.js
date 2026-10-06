import { GX_EVIDENCE } from '../../src/data/gx-evidence.js';
import { SYSTEM_INTELLIGENCE, MATERIAL_LINEAGES, getSystem } from '../../src/data/system-intelligence.js';

const SERVER = {
  name: 'xpex-gx-neural-copilot',
  version: '1.0.0'
};

const PROTOCOL_VERSION = '2025-03-26';
const MAX_QUERY = 500;
const GITHUB_REPO = 'xpex-systems-ai/xpex-systems-ai';

function normalize(value='') {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s./_-]/g, ' ');
}

function textContent(value) {
  return [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }];
}

function ok(payload) {
  return { content: textContent(payload), structuredContent: payload };
}

function fail(message, details={}) {
  const payload = { error: message, ...details };
  return { content: textContent(payload), structuredContent: payload, isError: true };
}

function systemView(system) {
  if (!system) return null;
  return {
    slug: system.slug,
    id: system.id,
    name: system.name,
    role: system.role,
    tier: system.tier,
    status: system.status,
    tagline: system.tagline,
    summary: system.summary,
    problem: system.problem,
    built: system.built,
    tech: system.tech,
    architecture: system.architecture,
    security: system.security,
    limits: system.limits,
    runtime: system.runtime,
    source: system.source,
    evidence: system.evidence,
    media: system.media,
    related: system.related,
    intelligence_page: `https://xpex-systems-ai.vercel.app/?system=${encodeURIComponent(system.slug)}`
  };
}

function compactSystem(system) {
  return {
    slug: system.slug,
    id: system.id,
    name: system.name,
    role: system.role,
    tier: system.tier,
    status: system.status,
    runtime: system.runtime,
    intelligence_page: `https://xpex-systems-ai.vercel.app/?system=${encodeURIComponent(system.slug)}`
  };
}

function rankEvidence(query) {
  const q = normalize(query).split(/\s+/).filter(Boolean);
  const records = [];

  for (const e of GX_EVIDENCE) {
    const hay = normalize([e.title,e.kind,e.summary,...(e.keywords || [])].join(' '));
    let score = 0;
    for (const token of q) if (hay.includes(token)) score += token.length > 5 ? 3 : 1;
    if (score) records.push({score,source:'GX_EVIDENCE',title:e.title,status:e.status,url:e.url,summary:e.summary});
  }

  for (const s of SYSTEM_INTELLIGENCE) {
    const hay = normalize([
      s.slug,s.id,s.name,s.role,s.tier,s.status,s.tagline,s.summary,s.problem,s.built,
      ...(s.tech||[]),...(s.architecture||[]),...(s.security||[]),...(s.limits||[])
    ].join(' '));
    let score = 0;
    for (const token of q) if (hay.includes(token)) score += token.length > 5 ? 3 : 1;
    if (normalize(query).includes(normalize(s.name))) score += 10;
    if (score) records.push({
      score,
      source:'SYSTEM_INTELLIGENCE',
      title:s.name,
      status:s.status,
      url:`https://xpex-systems-ai.vercel.app/?system=${encodeURIComponent(s.slug)}`,
      summary:s.summary,
      evidence:s.evidence
    });
  }

  return records.sort((a,b)=>b.score-a.score);
}

async function recentCommits(limit=5) {
  const count = Math.max(1, Math.min(Number(limit)||5, 10));
  const controller = new AbortController();
  const timeout = setTimeout(()=>controller.abort(), 3500);
  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/commits?sha=main&per_page=${count}`, {
      headers: {
        'Accept':'application/vnd.github+json',
        'User-Agent':'XPeX-GX-Neural-Copilot/1.0'
      },
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`GitHub public API ${response.status}`);
    const data = await response.json();
    return data.map(item=>({
      sha:item.sha,
      message:item.commit?.message?.split('\n')[0] || '',
      date:item.commit?.committer?.date || item.commit?.author?.date || null,
      url:item.html_url
    }));
  } finally {
    clearTimeout(timeout);
  }
}

const tools = [
  {
    name:'xpex_gx_list_systems',
    description:'List the evidence-backed XPeX system intelligence catalog with current public status and runtime truth.',
    inputSchema:{
      type:'object',
      properties:{
        status:{type:'string',description:'Optional case-insensitive status filter.'},
        tier:{type:'string',description:'Optional case-insensitive tier filter.'}
      },
      additionalProperties:false
    }
  },
  {
    name:'xpex_gx_get_system',
    description:'Get the complete public System Intelligence record for one canonical XPeX system.',
    inputSchema:{
      type:'object',
      properties:{slug:{type:'string',description:'Canonical system slug, for example systems-command, wallet-command, plugin-factory.'}},
      required:['slug'],
      additionalProperties:false
    }
  },
  {
    name:'xpex_gx_search_evidence',
    description:'Search approved XPeX public evidence and system intelligence records. Returns only evidence already admitted to the public knowledge plane.',
    inputSchema:{
      type:'object',
      properties:{
        query:{type:'string',minLength:1,maxLength:500},
        limit:{type:'integer',minimum:1,maximum:10,default:5}
      },
      required:['query'],
      additionalProperties:false
    }
  },
  {
    name:'xpex_gx_get_runtime_truth',
    description:'Return provider/environment/runtime state for one system or all evidence-backed systems. Deployment state is not treated as external certification.',
    inputSchema:{
      type:'object',
      properties:{slug:{type:'string'}},
      additionalProperties:false
    }
  },
  {
    name:'xpex_gx_get_trust_status',
    description:'Return public security boundaries, truth limits and evidence for one XPeX system or the corporate Trust layer.',
    inputSchema:{
      type:'object',
      properties:{slug:{type:'string'}},
      additionalProperties:false
    }
  },
  {
    name:'xpex_gx_get_assets',
    description:'Return governed public media/asset metadata for a system, including evidence class and publication state.',
    inputSchema:{
      type:'object',
      properties:{slug:{type:'string'}},
      required:['slug'],
      additionalProperties:false
    }
  },
  {
    name:'xpex_gx_get_architecture',
    description:'Return technology stack, architecture flow and connected-system relationships for a canonical XPeX system.',
    inputSchema:{
      type:'object',
      properties:{slug:{type:'string'}},
      required:['slug'],
      additionalProperties:false
    }
  },
  {
    name:'xpex_gx_get_open_gates',
    description:'Return explicitly recorded limitations, admission gates and hardening items. Unknowns remain unknown.',
    inputSchema:{
      type:'object',
      properties:{slug:{type:'string'}},
      additionalProperties:false
    }
  },
  {
    name:'xpex_gx_get_recent_changes',
    description:'Read recent public commits on the XPeX corporate main branch from GitHub. This is read-only public source evidence.',
    inputSchema:{
      type:'object',
      properties:{limit:{type:'integer',minimum:1,maximum:10,default:5}},
      additionalProperties:false
    }
  },
  {
    name:'xpex_gx_prepare_audit',
    description:'Prepare a read-only evidence-first audit plan for a system. This tool never changes code, deploys infrastructure, approves a delivery or performs financial actions.',
    inputSchema:{
      type:'object',
      properties:{slug:{type:'string'}},
      required:['slug'],
      additionalProperties:false
    }
  },
  {
    name:'xpex_gx_get_ecosystem_graph',
    description:'Return the seven detailed public systems, twenty material asset lineages and canonical cross-system relationships in the XPeX knowledge plane.',
    inputSchema:{
      type:'object',
      properties:{},
      additionalProperties:false
    }
  }
];

async function callTool(name,args={}) {
  if (name === 'xpex_gx_list_systems') {
    const status = normalize(args.status || '');
    const tier = normalize(args.tier || '');
    const systems = SYSTEM_INTELLIGENCE
      .filter(s => !status || normalize(s.status).includes(status))
      .filter(s => !tier || normalize(s.tier).includes(tier))
      .map(compactSystem);
    return ok({policy:'Evidence First',count:systems.length,systems});
  }

  if (name === 'xpex_gx_get_system') {
    const system = getSystem(String(args.slug || ''));
    return system ? ok(systemView(system)) : fail('Unknown canonical system slug.',{available:SYSTEM_INTELLIGENCE.map(s=>s.slug)});
  }

  if (name === 'xpex_gx_search_evidence') {
    const query = String(args.query || '').trim();
    if (!query || query.length > MAX_QUERY) return fail(`query must contain 1-${MAX_QUERY} characters`);
    const limit = Math.max(1,Math.min(Number(args.limit)||5,10));
    return ok({query,count:Math.min(limit,rankEvidence(query).length),results:rankEvidence(query).slice(0,limit)});
  }

  if (name === 'xpex_gx_get_runtime_truth') {
    if (args.slug) {
      const s = getSystem(String(args.slug));
      return s ? ok({slug:s.slug,name:s.name,status:s.status,runtime:s.runtime,limits:s.limits,intelligence_page:`https://xpex-systems-ai.vercel.app/?system=${s.slug}`}) : fail('Unknown canonical system slug.');
    }
    return ok({
      invariant:'A provider state such as READY/SUCCESS proves observed runtime state only; it is not external certification or universal production assurance.',
      systems:SYSTEM_INTELLIGENCE.map(s=>({slug:s.slug,name:s.name,status:s.status,runtime:s.runtime}))
    });
  }

  if (name === 'xpex_gx_get_trust_status') {
    if (args.slug) {
      const s=getSystem(String(args.slug));
      return s ? ok({slug:s.slug,name:s.name,status:s.status,security:s.security,limits:s.limits,evidence:s.evidence.filter(e=>['SECURITY','GOVERNANCE','TRUTH'].includes(e.kind))}) : fail('Unknown canonical system slug.');
    }
    const trust=GX_EVIDENCE.find(e=>e.id==='trust');
    return ok({
      policy:'Evidence First',
      corporate_trust:trust || null,
      invariants:[
        'THE EXECUTOR DOES NOT APPROVE ITS OWN DELIVERY.',
        'Passing automated controls are engineering evidence, not external certification.',
        'Knowledge permission and action permission are separate.',
        'Watched value is not settled money.',
        'Concept art is not runtime evidence.'
      ]
    });
  }

  if (name === 'xpex_gx_get_assets') {
    const s=getSystem(String(args.slug || ''));
    return s ? ok({slug:s.slug,name:s.name,media:s.media || [],rule:'Media classification and publication state must be preserved. REDACT_FIRST is not public-ready.'}) : fail('Unknown canonical system slug.');
  }

  if (name === 'xpex_gx_get_architecture') {
    const s=getSystem(String(args.slug || ''));
    if (!s) return fail('Unknown canonical system slug.');
    const related=(s.related||[]).map(slug=>getSystem(slug)).filter(Boolean).map(compactSystem);
    return ok({slug:s.slug,name:s.name,tech:s.tech,architecture:s.architecture,related});
  }

  if (name === 'xpex_gx_get_open_gates') {
    if (args.slug) {
      const s=getSystem(String(args.slug));
      return s ? ok({slug:s.slug,name:s.name,status:s.status,gates:s.limits}) : fail('Unknown canonical system slug.');
    }
    return ok({systems:SYSTEM_INTELLIGENCE.map(s=>({slug:s.slug,name:s.name,status:s.status,gates:s.limits}))});
  }

  if (name === 'xpex_gx_get_recent_changes') {
    try {
      return ok({repository:GITHUB_REPO,branch:'main',commits:await recentCommits(args.limit)});
    } catch (error) {
      return fail('Recent public GitHub changes are temporarily unavailable.',{reason:error?.message || 'fetch failed'});
    }
  }

  if (name === 'xpex_gx_prepare_audit') {
    const s=getSystem(String(args.slug || ''));
    if (!s) return fail('Unknown canonical system slug.');
    return ok({
      slug:s.slug,
      name:s.name,
      mode:'READ_ONLY_PREPARATION',
      current_truth:{status:s.status,runtime:s.runtime,source:s.source},
      known_limits:s.limits,
      audit_plan:[
        'Confirm canonical identity and source lineage.',
        'Verify current provider/runtime state independently.',
        'Review recent source changes and CI/security evidence.',
        'Inspect public architecture and trust boundaries.',
        'Compare observed behavior with the System Intelligence manifest.',
        'Classify findings as proven, inferred, blocked or unknown.',
        'Collect evidence before recommending promotion or remediation.',
        'Require independent approval for any delivery/promotion decision.'
      ],
      prohibited_actions:['code mutation','deployment','financial action','credential access','self-approval']
    });
  }

  if (name === 'xpex_gx_get_ecosystem_graph') {
    return ok({
      policy:'Evidence First',
      detailed_systems:SYSTEM_INTELLIGENCE.map(s=>({
        slug:s.slug,name:s.name,role:s.role,status:s.status,related:s.related,
        intelligence_page:`https://xpex-systems-ai.vercel.app/?system=${s.slug}`
      })),
      material_lineages:MATERIAL_LINEAGES,
      counts:{detailed_systems:SYSTEM_INTELLIGENCE.length,material_lineages:MATERIAL_LINEAGES.length},
      rule:'Material lineages are discovery/portfolio nodes and are not all promoted as independent products.'
    });
  }

  return fail('Unknown tool.',{available:tools.map(t=>t.name)});
}

function rpcError(id,code,message,data) {
  return {jsonrpc:'2.0',id:id ?? null,error:{code,message,...(data!==undefined?{data}:{})}};
}

export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Accept, MCP-Protocol-Version, Mcp-Session-Id');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    return res.status(200).json({
      name:SERVER.name,
      version:SERVER.version,
      status:'ready',
      transport:'streamable-http-json',
      scope:'public-evidence-read-only',
      protocolVersion:PROTOCOL_VERSION,
      tools:tools.length,
      knowledge:{systems:SYSTEM_INTELLIGENCE.length,materialLineages:MATERIAL_LINEAGES.length,evidenceNodes:GX_EVIDENCE.length + SYSTEM_INTELLIGENCE.length},
      endpoint:'https://xpex-systems-ai.vercel.app/api/mcp/gx'
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow','GET, POST, OPTIONS');
    return res.status(405).json({error:'Method not allowed'});
  }

  const message=req.body || {};
  const {jsonrpc,id,method,params={}}=message;
  if (jsonrpc !== '2.0' || !method) return res.status(400).json(rpcError(id,-32600,'Invalid Request'));

  if (method === 'initialize') {
    return res.status(200).json({
      jsonrpc:'2.0',
      id,
      result:{
        protocolVersion:params.protocolVersion || PROTOCOL_VERSION,
        capabilities:{tools:{listChanged:false}},
        serverInfo:SERVER,
        instructions:'Read-only XPeX company intelligence. Use evidence-backed tools. Never infer private access or execution permission.'
      }
    });
  }

  if (method === 'notifications/initialized') return res.status(204).end();
  if (method === 'ping') return res.status(200).json({jsonrpc:'2.0',id,result:{}});

  if (method === 'tools/list') {
    return res.status(200).json({jsonrpc:'2.0',id,result:{tools}});
  }

  if (method === 'tools/call') {
    const toolName=params?.name;
    if (!toolName) return res.status(400).json(rpcError(id,-32602,'Missing tool name'));
    try {
      const result=await callTool(toolName,params?.arguments || {});
      return res.status(200).json({jsonrpc:'2.0',id,result});
    } catch (error) {
      return res.status(200).json({jsonrpc:'2.0',id,result:fail('Tool execution failed safely.',{reason:error?.message || 'unknown error'})});
    }
  }

  return res.status(200).json(rpcError(id,-32601,'Method not found'));
}
