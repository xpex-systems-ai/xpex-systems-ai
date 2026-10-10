import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYSTEM_INTELLIGENCE } from '../site/src/data/system-intelligence.js';
import { COMPANY_PLAN as plan, companySnapshot } from '../site/src/data/company-readiness.js';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const at='2026-10-10T04:10:49.399Z';
const write=(rel,data)=>{const p=path.join(ROOT,rel);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof data==='string'?data:JSON.stringify(data,null,2)+'\n');};
const read=rel=>JSON.parse(fs.readFileSync(path.join(ROOT,rel),'utf8'));
const observations=read('data/company/preparation-source-observations-v1.json');
const index=read('data/company/system-index-v1.json');
const publicSnapshot=companySnapshot();

for(const prep of plan.systems){
  const s=SYSTEM_INTELLIGENCE.find(s=>s.slug===prep.slug);
  const source=observations.repositories.find(x=>x.repository===s.source.repo);
  const pack=prep.pack;
  const product=pack.split('/').at(-1);
  const cardPath=`${pack}/system-card.json`;
  const existing=fs.existsSync(path.join(ROOT,cardPath));
  const sid=existing?read(cardPath).system_id:s.id;
  const status=s.runtime.url?'DEPLOYED':'UNKNOWN';
  const evidencePath=`${pack}/evidence/preparation-observation.json`;
  const evidence={system_id:sid,public_safe:true,observed_at:observations.observed_at,evidence_type:'SOURCE_METADATA_AND_PUBLISHED_INTELLIGENCE',scope:'Source default-branch observation and existing public System Intelligence. Not legal title or a fresh provider/deployed-commit attestation.',source,published_status:s.status,published_runtime:s.runtime,published_limits:s.limits,source_runtime_commit_correlation:'NOT_VERIFIED',reference:`https://xpex-systems-ai.vercel.app/?system=${s.slug}`};
  write(evidencePath,evidence);
  const preparation={schema_version:'1.0',system_id:sid,display_slug:s.slug,preparation_status:'DOCUMENTED',prepared_at:at,source_observation:source,source_legal_title:'NOT_VERIFIED',buyer_hypothesis:prep.buyer_hypothesis,expected_result:prep.expected_result,published_stage:s.status,operating_cost:null,operating_cost_status:'NOT_VERIFIED',settled_revenue:null,revenue_status:'NOT_VERIFIED',transfer_readiness:'REVIEW_AND_REHEARSAL_REQUIRED',next_actions:prep.next_actions,standards:plan.standards.map(x=>({...x,status:'DOCUMENTED_REQUIREMENT',implementation_verification:'PENDING'})),open_gates:s.limits,independent_acceptance:'PENDING'};
  write(`${pack}/preparation.json`,preparation);
  if(!existing){
    write(cardPath,{schema_version:'1.0',system_id:sid,product_id:product,name:s.name,role:s.role,owner:'XPeX Systems AI',owner_basis:'Published corporate operational identity; legal title not verified.',canonical_status:'CANONICAL_CANDIDATE',runtime_status:status,assurance_level:'AL1',source:{organization:'xpex-systems-ai',repository:s.source.repo.split('/')[1],commit:source?.commit??null,verification_status:'OBSERVED_REPOSITORY_METADATA'},runtime:{provider:s.runtime.provider,environment:s.runtime.environment,state_at_verification:s.runtime.state,deployment_id:s.runtime.deployment??null,public_alias:s.runtime.url??null},commercial_status:'NOT_ASSERTED',governance_framework:'XAGF',evidence:['evidence/preparation-observation.json'],updated_at:at,trust_passport:`data/trust/system-passports/${product}.json`,ai_bom:`${pack}/ai-bom.json`,standard:'XPEX_VERIFIED_SYSTEM_STANDARD_V1',preparation_standard:'XPEX_COMPANY_PREPARATION_V1'});
    write(`${pack}/ai-bom.json`,{aibom_id:`AIBOM-${sid}`,system_id:sid,version:'1.0',source_commit:source?.commit??null,deployment_id:s.runtime.deployment??null,models:[],agents:[],tools:[],providers:['GitHub',s.runtime.provider],data_sources:[],policies:['XAGF','Evidence First'],unknowns:['Models, running agents, exact tools, data classes and credential scopes require application-level inventory. Empty lists represent unverified inventory, not a claim that these dependencies do not exist.'],generated_at:at});
    const dimensions={};
    for(const dim of ['IDENTITY','SOURCE_OWNERSHIP','PERMISSIONS','POLICY','SECRETS','EVALUATION','CONTAINMENT','RUNTIME','EVIDENCE','SUPPLY_CHAIN','HUMAN_OVERSIGHT']){
      const documented=['IDENTITY','POLICY','EVIDENCE','HUMAN_OVERSIGHT'].includes(dim);
      dimensions[dim]={status:documented?'POLICY_DEFINED':'NOT_VERIFIED',summary:dim==='SOURCE_OWNERSHIP'?'Source location observed; legal title and upstream/dependency obligations require review.':dim==='RUNTIME'?'Published runtime metadata and reachability are distinct from independent workflow verification.':'Preparation requirements documented; independent verification remains pending.',evidence_refs:documented?[`${pack}/preparation.json`]:[]};
    }
    write(`data/trust/system-passports/${product}.json`,{passport_version:'1.0',passport_id:`TP-${sid}`,subject_type:'SYSTEM',system_id:sid,name:s.name,overall_trust_state:'TP1_DOCUMENTED',dimensions,blockers:s.limits,legal_ownership_status:'NOT_VERIFIED',transfer_readiness:'NOT_VERIFIED',issued_at:at,last_verified_at:null,evidence_refs:[`${pack}/preparation.json`]});
    index.systems.push({system_id:sid,slug:product,intelligence_slug:s.slug,name:s.name,role:s.role,canonical_status:'CANONICAL_CANDIDATE',runtime_status:status,system_pack:`${pack}/`});
  }else{
    const tp=`data/trust/system-passports/${product}.json`;
    const passport=read(tp);
    passport.legal_ownership_status='NOT_VERIFIED';passport.transfer_readiness='NOT_VERIFIED';
    passport.ownership_scope='Existing SOURCE_OWNERSHIP evidence establishes repository/source correlation, not complete legal title or transaction rights.';
    write(tp,passport);
  }
  const readme=`# ${s.name} — Company Preparation Pack\n\nPrepared 10 October 2026. Public stage: **${s.status}**. Preparation: **DOCUMENTED**. Independent acceptance: **PENDING**.\n\n## Function and proposed buyer\n\n${s.summary}\n\n- Buyer hypothesis: ${prep.buyer_hypothesis}.\n- Expected result: ${prep.expected_result}.\n- Next milestone: ${prep.next_milestone}.\n\nThese commercial statements are hypotheses, not verified customer outcomes.\n\n## Identity, source and runtime\n\n- Source: ${s.source.url} (${s.source.visibility}).\n- Observed default branch: ${source?.default_branch??'NOT_VERIFIED'}.\n- Source head: ${source?.commit??'NOT_VERIFIED'}; observed ${source?.observed_at??'NOT_VERIFIED'}.\n- Provider/environment: ${s.runtime.provider} / ${s.runtime.environment}.\n- Published provider state: ${s.runtime.state}.\n- Public endpoint: ${s.runtime.url??'NOT_VERIFIED_CANONICAL_ENDPOINT'}.\n- Deployed-commit correlation: NOT_VERIFIED in this preparation observation.\n\nExisting runtime evidence retains its original scope and dates. Source metadata does not establish legal ownership.\n\n## Architecture and AI dependencies\n\n${s.architecture.map(x=>'- '+x).join('\n')}\n\nDeclared stack: ${s.tech.join(', ')}. The AI-BOM distinguishes verified inventory from unknown dependencies.\n\n## Demonstration\n\nUse the [company runbook](../../docs/company/preparation/DEMO_RUNBOOK.md). Open the system evidence page at https://xpex-systems-ai.vercel.app/?system=${s.slug}. Public availability and workflow acceptance remain separate.\n\n## Security boundaries\n\n${s.security.map(x=>'- '+x).join('\n')}\n\nOpen gates:\n\n${s.limits.map(x=>'- '+x).join('\n')}\n\n## Operations and economics\n\nInstall/build/start/rollback/restore procedures require application-specific verification. A second authorized operator must rehearse the handover with their own access.\n\n- Operating cost: **NOT_VERIFIED**.\n- Customer/revenue attribution: **NOT_VERIFIED**.\n- Pricing: scoped proposal and acceptance required.\n\n## Transfer review\n\nGitHub license metadata: **${source?.license??'NOT_IDENTIFIED_IN_METADATA'}**. Inspect license text, upstream/fork lineage, dependencies, contributors and provider terms; this metadata is not a completed license audit.\n\nLegal title, rights to transfer, contract assignments, data permissions and obligations are **NOT_VERIFIED**. Credentials and personal sessions are excluded from the public package. See [transfer criteria](../../docs/company/preparation/TRANSFER_READINESS.md).\n\n## Next actions\n\n${prep.next_actions.map((x,i)=>`${i+1}. ${x}`).join('\n')}\n\n## Evidence files\n\n- [System card](system-card.json)\n- [Preparation matrix](preparation.json)\n- [AI-BOM](ai-bom.json)\n- [Source/published-state observation](evidence/preparation-observation.json)\n- Trust Passport: data/trust/system-passports/${product}.json\n\nWritten preparation does not promote a runtime or approve its own delivery.\n`;
  write(`${pack}/README.md`,readme);
  write(`site/public/company/packs/${s.slug}.json`,{...publicSnapshot.systems.find(x=>x.slug===s.slug),preparation,architecture:s.architecture,security:s.security,evidence:s.evidence});
}
index.updated_at=at;
index.truth={...index.truth,total_entries:index.systems.length,verified_live:index.systems.filter(x=>x.runtime_status==='VERIFIED_LIVE').length,verified_staging:index.systems.filter(x=>x.runtime_status==='VERIFIED_STAGING').length,canonical:index.systems.filter(x=>x.canonical_status==='CANONICAL').length,canonical_candidates:index.systems.filter(x=>x.canonical_status==='CANONICAL_CANDIDATE').length};
write('data/company/system-index-v1.json',index);
write('site/public/company/company-review.json',publicSnapshot);
const docs=['SYSTEM_STANDARD.md',...plan.public_materials.map(x=>x.path.replace('docs/',''))];
for(const rel of docs){const src=`docs/${rel}`;write(`site/public/company/documents/${path.basename(rel)}`,fs.readFileSync(path.join(ROOT,src),'utf8'));}
console.log(`Company preparation built: ${plan.systems.length} packs / seven public dossiers. Stages preserved; independent acceptance pending.`);
