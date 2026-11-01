import {XPEX_CONNECT_SURFACES,XPEX_ENTERPRISE_PRODUCT} from './data/xpex-connect.js';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const flow=[
  ['01','Autorize','Identidade, permissões e escopo delimitado'],
  ['02','Conecte','API e MCP seguros'],
  ['03','Audite','OMNIX verifica e registra evidências'],
  ['04','Revise','Resultado revisado por humano']
];

export function connectorsPage(){
  const surfaces=XPEX_CONNECT_SURFACES.map(item=>`<article class="xp-card xp-plugin-card" data-connect-surface="${esc(item.id)}">
  <span class="xp-pill">${esc(item.stage)}</span><h3>${esc(item.name)}</h3><p>${esc(item.purpose)}</p>
  <a class="xp-link" rel="noopener noreferrer" target="_blank" href="${esc(item.repo)}">Código e documentação ↗</a>
  ${item.publicEndpoint?`<p class="xp-small-note">Descoberta pública: <code>${esc(item.publicEndpoint)}</code></p>`:'<p class="xp-small-note">Publicação/instalação externa não confirmada.</p>'}
  </article>`).join('');
  const steps=flow.map(([i,name,desc])=>`<article class="xp-card"><p class="xp-kicker">${esc(i)}</p><h3>${esc(name)}</h3><p>${esc(desc)}</p></article>`).join('');
  return `<section class="xp-section" aria-labelledby="xp-connectors-title">
  <div class="xp-section-head"><div>
    <p class="xp-kicker">XPEX CONNECT / ENGINEERING FOR AGENTS</p>
    <h1 id="xp-connectors-title">Seu software.<br/><em>Conectado à inteligência artificial.</em></h1>
    <p class="xp-section-intro">Engenharia de conectores para APIs, MCP, plugins, CLI e skills com permissões, auditoria e evidências verificáveis. Cada plataforma define as próprias condições de compatibilidade.</p>
  </div></div>
  <div class="xp-notice"><strong>ESTÁGIO:</strong> ${esc(XPEX_ENTERPRISE_PRODUCT.state)}. Componentes implementados no código não implicam aprovação em marketplaces nem integrações operacionais para todos os clientes.</div>
  <section class="xp-section"><p class="xp-kicker">SUPERFÍCIES TECNOLÓGICAS</p><h2>Um núcleo. Múltiplas entradas.</h2>
   <div class="xp-catalog-grid">${surfaces}</div></section>
  <section class="xp-section"><p class="xp-kicker">JORNADA DE IMPLEMENTAÇÃO</p><h2>Da autorização à prova.</h2>
   <div class="xp-three">${steps}</div></section>
  <section class="xp-section"><p class="xp-kicker">ARQUITETURA DE PRODUTO</p><h2>Componentes com funções claras.</h2>
   <div class="xp-three">
    <article class="xp-card"><h3>OMNIX AI</h3><p>Produto principal: auditoria inteligente, achados e relatórios.</p></article>
    <article class="xp-card"><h3>XPeX Connect</h3><p>Serviço de conectores empresariais, APIs e MCP autorizados.</p></article>
    <article class="xp-card"><h3>GXEON</h3><p>Orquestração governada de agentes e políticas de execução.</p></article>
    <article class="xp-card"><h3>Plugin Factory</h3><p>Compilação de manifests, CLI e skills para revisão e homologação.</p></article>
    <article class="xp-card"><h3>Evidence OS</h3><p>Proveniência e trilhas auditáveis de decisões e execução.</p></article>
    <article class="xp-card"><h3>Growth OS</h3><p>CRM e campanhas internas, ainda em protótipo.</p></article>
   </div></section>
  <section class="xp-section"><article class="xp-card"><p class="xp-kicker">PARCERIAS E INTEGRAÇÕES</p><h2>Quer conectar seu sistema?</h2>
   <p>Começamos pela documentação, permissões, escopo e viabilidade técnica. Implementação exige contrato e aceite antes do trabalho.</p>
   <div class="xp-actions">
     <a class="xp-button xp-gold" href="/?view=developers">Consultar REST e MCP →</a>
     <a class="xp-button" href="https://github.com/xpex-systems-ai/XPeX-Plugin-Factory-" target="_blank" rel="noopener noreferrer">Conhecer Plugin Factory ↗</a>
     <a class="xp-button" href="https://www.linkedin.com/in/ceojuniorsena" target="_blank" rel="noopener noreferrer">Conversar com a XPeX ↗</a>
   </div><p class="xp-small-note">Não afirmamos conexão universal, parceria oficial ou segurança certificada. Nenhum dado ou sistema privado é acessado sem autorização adequada.</p>
  </article></section></section>`;
}
