import { SYSTEM_INTELLIGENCE } from './data/system-intelligence.js';

// Presentation-only catalog. No token exchange, OAuth callback, provider API
// request, audit execution or customer data is initiated by these controls.
export const OMNIX_SPECIALISTS = Object.freeze([
  {id:'vercel',name:'Vercel',state:'SYNTHETIC_PREVIEW',proof:'Dois checks estáticos em vercel.json fornecido com autorização.',reference:'Exemplo sintético do Audit OS',referenceHref:'#omnix-example'},
  {id:'github',name:'GitHub',state:'PLANNED',proof:'Conector legado somente leitura; conexão multiempresa ainda não liberada.',reference:'Ver sistema relacionado',referenceHref:'/?system=systems-command'},
  {id:'railway',name:'Railway',state:'PLANNED',proof:'Leitor legado candidato, sem credencial por cliente no OMNIX.',reference:'Ver tecnologia relacionada',referenceHref:'/?system=plugin-factory'},
  {id:'agent-economy',name:'Agent Economy',state:'PLANNED',proof:'Inventário de agentes e ferramentas MCP é uma especialização futura.',reference:'Ver referência de plugins',referenceHref:'/?system=plugin-factory'},
  {id:'web-api',name:'Web & API',state:'PLANNED',proof:'Verificações externas exigem alvo, autorização e rede restrita.',reference:'Explorar API corporativa',referenceHref:'/?view=developers'},
  {id:'commerce',name:'Commerce',state:'PLANNED',proof:'APIs de comércio e operações exigem escopo e consentimento do provedor.',reference:'Ver referência do ecossistema',referenceHref:'/?system=wallet-command'},
].map(item=>Object.freeze(item)));

const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slugValid=value=>typeof value==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const stateLabel=state=>state==='SYNTHETIC_PREVIEW'?'Exemplo sintético':'Integração planejada';

export function omnixSpecialistsMarkup(){
  const cards=OMNIX_SPECIALISTS.map(item=>{
    const id=escapeHtml(item.id), name=escapeHtml(item.name), desc=escapeHtml(item.proof);
    return '<article class="ox-specialist-card" data-omnix-specialist="'+id+'" data-connection-state="NOT_CONNECTED">'+
      '<span class="ox-specialist-state">'+stateLabel(item.state)+'</span>'+
      '<h3>'+name+'</h3><p>'+desc+'</p>'+
      '<p class="ox-specialist-note" id="ox-specialist-note-'+id+'">Conexão OAuth/API para clientes ainda não disponível. Nenhuma conta será conectada por esta página.</p>'+
      '<div class="ox-specialist-actions"><a class="xp-button" href="'+escapeHtml(item.referenceHref)+'">'+escapeHtml(item.reference)+' →</a>'+
      '<button type="button" disabled aria-describedby="ox-specialist-note-'+id+'">Conectar '+name+' (indisponível)</button></div>'+
      '</article>';
  }).join('');
  return '<section id="omnix-specialists" class="xp-section ox-specialists" aria-labelledby="omnix-specialists-title">'+
    '<p class="xp-kicker">OMNIX AI / CATÁLOGO DE ESPECIALISTAS</p>'+
    '<h2 id="omnix-specialists-title">Seis ecossistemas.<br><em>Uma inteligência de auditoria.</em></h2>'+
    '<p class="xp-section-intro">Explore os especialistas e suas referências. Os atalhos funcionam como navegação; não executam uma conexão nem solicitam credenciais. O único escopo técnico demonstrável hoje é a inspeção estática de um vercel.json sintético.</p>'+
    '<div class="ox-specialists-grid">'+cards+'</div>'+
    '<p class="xp-small-note">Integrações de provedor só serão habilitadas após autorização, revisão de segurança, autenticação apropriada e testes remotos. <a class="xp-link" href="#omnix-lead">Consultar a situação da entrada empresarial →</a></p></section>';
}

export function renderOmnixPortfolio(systems=SYSTEM_INTELLIGENCE){
  if(!Array.isArray(systems))throw Error('OMNIX_PORTFOLIO_INPUT_REQUIRED');
  const cards=systems.filter(item=>slugValid(item?.slug)).map(system=>{
    const slug=encodeURIComponent(system.slug), name=escapeHtml(system.name);
    const status=escapeHtml(system.status), role=escapeHtml(system.role);
    const count=Array.isArray(system.evidence)?system.evidence.filter(ref=>typeof ref?.url==='string'&&ref.url.startsWith('https://')).length:0;
    return '<article class="ox-proof-card" data-omnix-system="'+escapeHtml(system.slug)+'">'+
      '<span class="ox-proof-state">Estado do catálogo: '+status+'</span>'+
      '<h3>'+name+'</h3><p>'+role+'</p>'+
      '<p class="ox-proof-count">'+count+' referências registradas · sem nova auditoria OMNIX declarada</p>'+
      '<a class="xp-button" href="/?system='+slug+'">Abrir dossiê e evidências →</a>'+
      '</article>';
  }).join('');
  return '<section id="omnix-evidence" class="xp-section ox-evidence" aria-labelledby="omnix-evidence-title">'+
    '<p class="xp-kicker">XPEX SYSTEMS AI / EVIDENCE LAB</p>'+
    '<h2 id="omnix-evidence-title">Sete sistemas.<br><em>Provas para inspecionar.</em></h2>'+
    '<p class="xp-section-intro">Este catálogo reutiliza os dossiês corporativos e seus estados registrados. Referências de código, documentos e deploys não equivalem a auditoria independente nem garantem disponibilidade em tempo real.</p>'+
    '<div class="ox-evidence-grid">'+cards+'</div>'+
    '<p class="xp-small-note">As evidências e limitações de cada sistema estão na página individual. Só publicaremos resultados de auditorias OMNIX após execução e revisão comprovadas.</p></section>';
}
export const omnixPortfolioMarkup=()=>renderOmnixPortfolio();
