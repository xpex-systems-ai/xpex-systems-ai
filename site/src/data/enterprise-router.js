import { ENTERPRISE_OFFERINGS, BUYER_PROFILES, ENTERPRISE_CONTACT } from './enterprise-offerings.js';
import { SYSTEM_INTELLIGENCE } from './system-intelligence.js';

const STOP = new Set(['the','a','an','and','or','of','to','for','in','on','with','we','our','need','want','company','empresa','de','da','do','e','para','com','uma','um','nosso','nossa']);

export function normalize(value=''){
  return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s./_-]/g,' ');
}

export function tokens(value=''){
  return [...new Set(normalize(value).split(/\s+/).filter(x=>x.length>1 && !STOP.has(x)))];
}

function scoreText(query, values){
  const q=tokens(query);
  const hay=normalize(values.flat(Infinity).filter(Boolean).join(' '));
  let score=0;
  for(const token of q){
    if(hay.includes(token)) score += token.length >= 7 ? 4 : token.length >= 4 ? 2 : 1;
  }
  return score;
}

export function matchEnterpriseNeed({need='', company_type='', goals='', constraints=''}={}){
  const query=[need,company_type,goals,constraints].filter(Boolean).join(' ');
  const ranked=ENTERPRISE_OFFERINGS.map(offering=>{
    let score=scoreText(query,[offering.name,offering.category,offering.buyers,offering.needs,offering.promise,offering.engagement]);
    if(normalize(company_type) && offering.buyers.some(b=>normalize(b).includes(normalize(company_type)) || normalize(company_type).includes(normalize(b)))) score += 8;
    return {...offering,score};
  }).sort((a,b)=>b.score-a.score);

  const selected=ranked.filter(x=>x.score>0).slice(0,4);
  return selected.length ? selected : ranked.slice(0,3);
}

export function matchBuyerProfile(input=''){
  const ranked=BUYER_PROFILES.map(profile=>({
    ...profile,
    score:scoreText(input,[profile.title,profile.signals])
  })).sort((a,b)=>b.score-a.score);
  return ranked[0]?.score>0 ? ranked[0] : null;
}

export function getOffering(id){
  return ENTERPRISE_OFFERINGS.find(x=>x.id===id) || null;
}

export function systemProof(slugs=[]){
  return slugs.map(slug=>{
    const s=SYSTEM_INTELLIGENCE.find(x=>x.slug===slug);
    if(!s) return null;
    return {
      slug:s.slug,
      name:s.name,
      role:s.role,
      tier:s.tier,
      status:s.status,
      runtime:s.runtime,
      limits:s.limits,
      evidence:s.evidence,
      intelligence_page:`https://xpex-systems-ai.vercel.app/?system=${encodeURIComponent(s.slug)}`
    };
  }).filter(Boolean);
}

export function solutionPack(id){
  const offering=getOffering(id);
  if(!offering) return null;
  return {
    offering,
    systems:systemProof(offering.systems),
    contact:ENTERPRISE_CONTACT,
    truth_boundary:'A solution pack is a matched XPeX capability set, not a claim of an existing customer deployment or commercial contract.'
  };
}

export function preparePilot({offering_id, need='', company_type='', constraints=''}={}){
  const offering=offering_id ? getOffering(offering_id) : matchEnterpriseNeed({need,company_type,constraints})[0];
  if(!offering) return null;
  return {
    offering_id:offering.id,
    title:`${offering.name} — Evidence-First Pilot`,
    objective:offering.promise,
    phase_1:'Discovery: map target workflow, systems, data classes, identities and success criteria.',
    phase_2:'Design: define capability graph, tools/MCP surfaces, permission boundaries and human approvals.',
    phase_3:'Build: implement the smallest useful integration in a bounded preview/staging scope.',
    phase_4:'Verify: run tests, security/evidence checks, runtime validation and operator review.',
    phase_5:'Promote: move only verified capabilities forward under explicit approval.',
    deliverables:[
      'current-state map',
      'target workflow / capability blueprint',
      'system or agent integration prototype',
      'evidence pack',
      'risk / open-gate list',
      'next-step production admission plan'
    ],
    prohibited_claims:[
      'No guaranteed ROI',
      'No guaranteed automation percentage',
      'No customer, revenue or partnership claim without evidence'
    ],
    contact:ENTERPRISE_CONTACT
  };
}

export function discoveryManifest(){
  return {
    schema_version:'1.0',
    name:'XPeX Enterprise Agent API',
    description:'Machine-readable enterprise discovery and solution-matching interface for XPeX Systems AI.',
    policy:'Evidence First',
    purpose:'Help companies, accelerators, agent platforms and enterprise AI teams discover which XPeX systems, platforms and agent capabilities match a real need.',
    endpoints:{
      rest:'https://xpex-systems-ai.vercel.app/api/agent-api',
      mcp:'https://xpex-systems-ai.vercel.app/api/mcp/enterprise',
      knowledge:'https://xpex-systems-ai.vercel.app/data/system-intelligence-v1.json',
      launch_radar:'https://xpex-systems-ai.vercel.app/data/global-launch-radar-v1.json'
    },
    offerings:ENTERPRISE_OFFERINGS.map(x=>({id:x.id,name:x.name,category:x.category,maturity:x.maturity})),
    contact:ENTERPRISE_CONTACT,
    privacy:'Stateless public discovery endpoint. Do not send secrets, credentials, private customer data or regulated data.',
    action_boundary:'The public Enterprise Agent API does not execute production changes, financial actions, outreach campaigns or account mutations.'
  };
}
