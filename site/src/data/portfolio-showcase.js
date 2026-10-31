// Curadoria PUBLICÁVEL, separada do cofre privado de evidências.
// Inventário/documento não representa execução em tempo real ou cliente confirmado.
import {SYSTEM_INTELLIGENCE} from './system-intelligence.js';

const CATALOG = [
  {slug:'audit-os',group:'Auditoria',short:'AUDIT / 01',stages:['Escopo','Achados','Revisão'],context:'Fluxo de auditoria assistida. Resultados reais exigem autorização, execução registrada e revisão humana.'},
  {slug:'systems-command',group:'Governança',short:'GOV / 02',stages:['Fontes','Identidade','Prova'],context:'Registro de ativos e proveniência. Visualização do modelo; não concede acesso a sistemas conectados.'},
  {slug:'wallet-command',group:'Agentes',short:'AGENT / 03',stages:['Descoberta','Controle','Ledger'],context:'Arquitetura de agentes e acompanhamento financeiro. Saldos e receitas não são certificados por esta página.'},
  {slug:'plugin-factory',group:'Agentes',short:'AGENT / 04',stages:['Especificação','Build','Teste'],context:'Engenharia de ferramentas e plugins. Disponibilidade comercial depende de aceite e testes da versão.'},
  {slug:'api-fabric',group:'Integrações',short:'API / 05',stages:['Contrato','Auth','Validação'],context:'Linhas de produto API. Links de código e demonstração são cadastrados, não monitoramento ao vivo.'},
  {slug:'studio-ai',group:'Criação',short:'STUDIO / 06',stages:['Briefing','Produção','Revisão'],context:'Experiência e protótipos criativos. Materiais de terceiros exigem direitos de uso e aprovação.'},
  {slug:'academy',group:'Educação',short:'EDU / 07',stages:['Curso','Prática','Avaliação'],context:'Projetos educacionais. Não representa certificação externa de cursos ou alunos.'}
];

export const PORTFOLIO_GROUPS = ['Todos','Auditoria','Agentes','Governança','Integrações','Criação','Educação'];

export const PORTFOLIO_SHOWCASE = CATALOG.map(entry=>{
  const system=SYSTEM_INTELLIGENCE.find(item=>item.slug===entry.slug);
  if(!system)throw new Error('PORTFOLIO_CANONICAL_SYSTEM_MISSING:'+entry.slug);
  return Object.freeze({...entry,id:system.id,name:system.name,role:system.role,summary:system.summary,
    status:system.status,source:system.source,limits:system.limits||[],evidence:system.evidence||[]});
});

export function publicProofUrl(raw,system){
  if(typeof raw!=='string')return null;
  let url;
  try{url=new URL(raw);}catch{return null;}
  if(url.protocol!=='https:'||url.username||url.password||url.searchParams.has('token')||url.searchParams.has('key'))return null;
  if(!['github.com','xpex-systems-ai.vercel.app','glama.ai'].includes(url.hostname))return null;
  if(system?.source?.visibility==='PRIVATE'){
    const privateRoot=system.source.url?.replace(/\/+$/,'');
    if(privateRoot&&(url.href===privateRoot||url.href.startsWith(privateRoot+'/')))return null;
  }
  return url.href;
}
