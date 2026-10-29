import fs from 'node:fs';
import {selectVercelBotPreview, selectVercelBotAlias, verifiedPreviewSource} from './preview-source.mjs';
// Read-only discovery from this repository's actual deployment records. Never invent an origin.
const sha=process.env.PRESERVATION_HEAD;
if(!/^[a-f0-9]{40}$/.test(sha??''))throw Error('HEAD_REQUIRED');
const repo='xpex-systems-ai/xpex-systems-ai';
const api=async route=>{
  const response=await fetch(`https://api.github.com/repos/${repo}/${route}`,{headers:{Authorization:`Bearer ${process.env.GITHUB_TOKEN}`,Accept:'application/vnd.github+json'},signal:AbortSignal.timeout(20_000)});
  if(!response.ok)throw Error('DEPLOYMENT_METADATA_'+response.status);return response.json();
};
const eventPath=process.env.GITHUB_EVENT_PATH;
let prNumber;
try { const event=JSON.parse(fs.readFileSync(eventPath,'utf8')); prNumber=event.pull_request?.number; }
catch { prNumber=undefined; }
function record(receipt) {
  fs.mkdirSync('preservation-results',{recursive:true});
  fs.writeFileSync('preservation-results/deployment.json',JSON.stringify({...receipt,head:sha,observedAt:new Date().toISOString()},null,2));
  fs.appendFileSync(process.env.GITHUB_ENV,'PRESERVATION_PREVIEW_URL='+receipt.url+'\n');
  console.log(JSON.stringify({...receipt,head:sha}));
  process.exit(0);
}
// GitHub deployments can be absent even for a READY Vercel preview.
// Use the commit-scoped successful Vercel status + official PR bot row as
// a second independently cross-checked, read-only discovery path.
async function officialBotPreview() {
  if (!Number.isInteger(prNumber) || prNumber < 1) return;
  const [status,comments]=await Promise.all([
    api('commits/'+sha+'/status'),
    api('issues/'+prNumber+'/comments?per_page=100')
  ]);
  return selectVercelBotPreview(sha,status,comments);
}
// GitHub statuses can lag behind a Vercel READY deployment. Resolve the
// official PR branch alias, but trust it only if the deployed preview runtime
// confirms this exact Git SHA, project, repository and branch.
async function sourceAttestedPreview() {
  if (!Number.isInteger(prNumber) || prNumber < 1) return;
  const comments=await api('issues/'+prNumber+'/comments?per_page=100');
  const url=selectVercelBotAlias(comments);
  if (!url) return;
  try {
    const response=await fetch(url+'/api/omnix-preview-source',{redirect:'error',
      headers:{Accept:'application/json','Cache-Control':'no-cache'},signal:AbortSignal.timeout(7000)});
    if (!response.ok || !response.headers.get('content-type')?.includes('application/json') ||
        Number(response.headers.get('content-length')??0)>2048) return;
    const body=await response.text();
    if (body.length>2048 || !verifiedPreviewSource(sha,JSON.parse(body))) return;
    return {url,provenance:'Vercel-public-runtime-exact-source',status:'success',sourceCommitVerified:true};
  } catch { return; }
}
for(let attempt=0;attempt<24;attempt++){
  const source = await sourceAttestedPreview();
  if (source) record(source);
  const official = await officialBotPreview();
  if (official) record({...official,status:'success',source:'commit-bound-Vercel-bot'});
  const deployments=await api(`deployments?ref=${sha}&per_page=100`);
  for(const d of deployments.filter(d=>d.sha===sha&&d.environment==='Preview')){
    const status=(await api(`deployments/${d.id}/statuses?per_page=10`))[0];
    if(status?.state!=='success')continue;
    const url=new URL(status.environment_url);
    if(url.protocol!=='https:'||!/^xpex-systems-[a-z0-9]+-xpex-neural\.vercel\.app$/.test(url.hostname)||url.username||url.password||url.search)throw Error('UNAPPROVED_PREVIEW_ORIGIN');
    const receipt={head:sha,deploymentId:d.id,url:url.origin,status:status.state,observedAt:new Date().toISOString()};
    fs.mkdirSync('preservation-results',{recursive:true});fs.writeFileSync('preservation-results/deployment.json',JSON.stringify(receipt,null,2));
    fs.appendFileSync(process.env.GITHUB_ENV,`PRESERVATION_PREVIEW_URL=${url.origin}\n`);console.log(JSON.stringify(receipt));process.exit(0);
  }
  await new Promise(resolve=>setTimeout(resolve,10_000));
}
throw Error('VERIFIED_PUBLIC_PREVIEW_NOT_AVAILABLE_WITHIN_4_MINUTES');
