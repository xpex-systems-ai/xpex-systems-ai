import {createHash} from "node:crypto";
import {SOURCES,search} from "./core.js";
const hash=x=>createHash("sha256").update(JSON.stringify(x)).digest("hex");
function invalid(s){throw Object.assign(new Error(s),{status:400});}
export function inspectSource(id){
 if(typeof id!=="string"||id.length>90)invalid("ID inválido.");
 const s=SOURCES.find(s=>s.id===id);
 if(!s)invalid("Fonte não autorizada pelo catálogo.");
 return {id:s.id,title:s.title,publisher:s.agency,url:s.url,trust:"catalogued_official_reference",
 registryMatch:true,websiteCheckedLive:false,documentTextVerified:false,documentVersionVerified:false,contentHashVerified:false,
 legalApplicabilityVerified:false,decision:"reference_only",
 next:["Conferir o documento original","Confirmar a vigência","Submeter a análise a profissional habilitado"],
 notice:"A URL consta no catálogo; o conteúdo remoto e a vigência NÃO foram verificados."};
}
export function evidencePack(query){
 const r=search(query),sources=r.citations.map(s=>inspectSource(s.id));
 const claims=[
 {id:"official_references",label:"Referências oficiais encontradas no catálogo",verified:sources.length>0},
 {id:"full_cosit",label:"Atos COSIT integralmente indexados",verified:false},
 {id:"legal_validity",label:"Vigência e aplicabilidade analisadas",verified:false},
 {id:"omniX_rag",label:"OMNIX RAG homologado",verified:false},
 {id:"settlement",label:"Pagamento liquidado",verified:false}
 ];
 const canonical={schema:"cosivant.evidence.v1",query:r.query,sourceIds:sources.map(s=>s.id),claims:claims.map(c=>[c.id,c.verified])};
 const digest=hash(canonical);
 return {schema:"cosivant.evidence.v1",reportId:"cv-"+digest.slice(0,20),sha256:digest,hashScope:"canonical_metadata_only",
 generatedAt:new Date().toISOString(),input:{query:r.query},
 summary:{referenceCount:sources.length,verifiedClaims:claims.filter(c=>c.verified).length,totalClaims:claims.length,corpusIndexed:0,professionalDecisionReady:false,monetized:false},
 claims,sources,decision:"NOT_APPROVED_FOR_TAX_ADVICE",
 hashNotice:"O hash identifica metadados locais, não prova conteúdo remoto, vigência ou pagamento.",
 nextStep:"Consultar os atos originais, verificar atualizações e obter revisão de especialista."};
}
