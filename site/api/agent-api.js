import { matchEnterpriseNeed, matchBuyerProfile, solutionPack, preparePilot, discoveryManifest } from '../src/data/enterprise-router.js';

const MAX_LEN=1200;

function sanitize(value=''){
  return String(value).trim().slice(0,MAX_LEN);
}

function cors(res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');
  res.setHeader('Cache-Control','no-store');
}

export default async function handler(req,res){
  cors(res);
  if(req.method==='OPTIONS') return res.status(204).end();

  if(req.method==='GET'){
    return res.status(200).json(discoveryManifest());
  }

  if(req.method!=='POST'){
    res.setHeader('Allow','GET, POST, OPTIONS');
    return res.status(405).json({error:'Method not allowed'});
  }

  const body=req.body || {};
  const need=sanitize(body.need);
  const company_type=sanitize(body.company_type);
  const goals=sanitize(body.goals);
  const constraints=sanitize(body.constraints);
  const action=sanitize(body.action || 'match');

  if(action==='match'){
    if(!need && !goals && !company_type) return res.status(400).json({error:'Provide need, goals or company_type.'});
    const matches=matchEnterpriseNeed({need,company_type,goals,constraints});
    const buyer_profile=matchBuyerProfile([company_type,need,goals].join(' '));
    return res.status(200).json({
      mode:'enterprise-solution-match',
      buyer_profile,
      matches:matches.map(x=>({
        id:x.id,name:x.name,category:x.category,maturity:x.maturity,promise:x.promise,engagement:x.engagement,proof:x.proof
      })),
      best_match:matches[0] ? solutionPack(matches[0].id) : null,
      contact:discoveryManifest().contact,
      truth_boundary:'Matching is advisory and evidence-backed. It does not imply a customer relationship, deployment, contract or guaranteed outcome.'
    });
  }

  if(action==='pilot'){
    const pilot=preparePilot({
      offering_id:sanitize(body.offering_id),
      need,company_type,constraints
    });
    return pilot ? res.status(200).json(pilot) : res.status(404).json({error:'No matching offering found.'});
  }

  return res.status(400).json({error:'Unsupported action. Use match or pilot.'});
}
