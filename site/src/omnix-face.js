import './omnix-face.css';
import {SYSTEM_INTELLIGENCE} from './data/system-intelligence.js';
import {portfolioLabMarkup} from './portfolio-lab.js';
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeEvidenceUrl=(url,system)=>{
  try {
    const parsed=new URL(url);
    if(parsed.protocol!=='https:'||parsed.username||parsed.password||!parsed.hostname)return null;
    const privateRepo=system.source?.visibility==='PRIVATE' ? system.source?.url : null;
    if(privateRepo&&(url===privateRepo||url.startsWith(privateRepo+'/')))return null;
    return parsed.href;
  } catch { return null; }
};
function evidenceSnippet(system){
  const references=(system.evidence||[]).map(item=>({item,url:safeEvidenceUrl(item.url,system)})).filter(x=>x.url).slice(0,3);
  const runtime=system.runtime||{};
  const technologies=Array.isArray(system.tech)?system.tech.slice(0,6):[];
  const limitations=Array.isArray(system.limits)?system.limits.slice(0,3):[];
  const dossier=`<details class="of-dossier-details"><summary>Dossiê técnico e limitações</summary>
      <p><strong>Problema abordado:</strong> ${escape(system.problem||'Não descrito no inventário.')}</p>
      <p><strong>Engenharia registrada:</strong> ${escape(system.built||'Sem descrição no inventário.')}</p>
      <p><strong>Tecnologias declaradas:</strong> ${technologies.map(escape).join(' · ')||'Não identificadas'}</p>
      <p><strong>Limitações publicáveis:</strong></p><ul>${limitations.map(item=>`<li>${escape(item)}</li>`).join('')||'<li>Limitações não detalhadas no inventário.</li>'}</ul>
      <p class="xp-small-note">Resumo documental do inventário próprio; não constitui certificação, resultado de uma nova auditoria OMNIX ou referência de cliente.</p>
    </details>`;
  return `<p class="xp-small-note">Estado registrado: <strong>${escape(system.status)}</strong> · Ambiente declarado: ${escape(runtime.provider||'não identificado')}. Sem revalidação remota nesta página.</p>
    ${dossier}
    <details class="of-evidence-details"><summary>Consultar fontes cadastradas (${references.length})</summary>
      <ul>${references.map(({item,url})=>`<li><a class="xp-link" href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(item.label)} (${escape(item.kind)})</a></li>`).join('')||'<li>Não há fonte pública adicional elegível neste dossiê.</li>'}</ul>
      <p class="xp-small-note">Links do inventário institucional; acessibilidade e conteúdo devem ser revalidados antes de uso comercial.</p>
    </details>`;
}

export function omnixOfficialFace(){
  const specialists=[['Vercel','RELEASE_BLOCKED','Dois checks estáticos de configuração. Testado com dados sintéticos.'],['GitHub','PLANNED','Repositórios, CI/CD e governança. Conector empresarial pendente.'],['Railway','PLANNED','Projetos e serviços. Integração por organização em preparação.'],['Commerce','PLANNED','Operações de comércio. Nenhuma conta ou cobrança conectada.'],['Web & API','PLANNED','Aplicações e contratos. Sem varredura remota ativa.'],['Agent Economy','PLANNED','Agentes, MCPs e permissões. Execução externa ainda não disponível.']];
  return `<div class="of-public"><nav aria-label="Explorar OMNIX" class="of-public-nav"><a href="#omnix-specialists">Especialistas</a><a href="#omnix-engineer">Audit Engineer</a><a href="#omnix-lab">Evidence Lab</a><a href="#omnix-connections">Integrações</a><a href="#omnix-client-path">Como contratar</a></nav>
  <section id="omnix-engineer" class="of-public-engineer"><p class="xp-kicker">UM MOTOR · ESCOPO AUTORIZADO · EVIDÊNCIAS</p><h2>OMNIX Audit Engineer</h2><p>Organiza o percurso da configuração ao relatório, com revisão distinta e permissões explícitas.</p><ol>${['Identificar','Autorizar','Planejar','Confirmar','Executar','Evidenciar','Revisar','Entregar'].map(s=>`<li>${s}</li>`).join('')}</ol><a class="xp-button xp-gold" href="#omnix-example">Examinar demonstração sintética →</a><p class="xp-small-note">Fluxo implementado e testado em ambiente sintético. Abertura a clientes bloqueada pelos gates operacionais.</p></section>
  <section id="omnix-specialists" class="xp-section"><p class="xp-kicker">SPECIALIST CONSOLE</p><h2>Especialização com limites claros.</h2><div class="of-public-grid">${specialists.map(([name,state,description])=>`<article class="of-public-card"><span class="xp-pill">${state}</span><h3>${name} Specialist</h3><p>${description}</p>${name==='Vercel'?'<a class="xp-button" href="#omnix-example">Verificar exemplo de configuração →</a><p class="xp-small-note">vercel_api_routing · vercel_security_headers</p>':'<details><summary>Ver requisitos</summary><p>Conector validado, identidade por organização, permissões mínimas, revogação e teste de integração. Este cartão não concede acesso.</p></details>'}</article>`).join('')}</div></section>
  <section id="omnix-connections" class="of-public-engineer"><p class="xp-kicker">AGENT WORKFORCE & INTEGRAÇÕES</p><h2>Permissões antes das operações.</h2><p>O coordenador reutiliza o GXEON Audit OS. Ferramentas MCP privadas consultam os registros autorizados; publicação externa e agentes autônomos permanecem bloqueados.</p><details><summary>Preparar uma integração</summary><p>Defina plataforma, organização, ativo e escopo de leitura. A equipe precisa validar identidade, conector e revogação antes de habilitar uma conexão. Não envie credenciais neste site. Saúde das integrações: não verificada.</p><a class="xp-link" href="/?view=company#contact">Consultar canal institucional →</a></details></section>
  <section id="omnix-client-path" class="of-client-path" aria-labelledby="omnix-client-path-title"><p class="xp-kicker">PRIMEIRO SERVIÇO EMPRESARIAL / ESCOPO DELIMITADO</p><h2 id="omnix-client-path-title">Conheça a entrega antes de contratar.</h2><p>OMNIX Audit Express começa com análise estática autorizada de um arquivo vercel.json sanitizado, dois checks documentados e relatório com evidências e revisão distinta.</p><ol><li>Veja o exemplo sintético e os limites técnicos.</li><li>Consulte o canal institucional para discutir escopo, condições e preço com a equipe.</li><li>Somente após acordo e liberação operacional, o cliente recebe um caminho seguro para a auditoria real.</li></ol><a class="xp-button" href="/?view=company#contact">Consultar contato institucional →</a><p class="xp-small-note">A prévia não recebe arquivos de clientes nem confirma pedidos comerciais. Os formulários de teste e rascunho abaixo não enviam uma contratação real.</p></section>
  ${portfolioLabMarkup()}</div>`;
}
