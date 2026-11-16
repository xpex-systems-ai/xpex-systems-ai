import { MODULES, ROLES, MORE_INTEGRATIONS, MORE_EVIDENCE, PLUGINS } from './data/media-directory.js';
import { brandMark } from './brand.js';
import { PLATFORMS, SYSTEMS, ACADEMY, TRUST, INTEGRATIONS, CONTACT_URL, agentShowcaseItems } from './data/showcase.js';
import { showcaseCard, showcaseCover, showcaseRail, initShowcase } from './showcase.js';
import { initGX } from './gx.js';
import { initEnterpriseAgentAPI } from './enterprise-agent-api.js';

const REPO = 'https://github.com/xpex-systems-ai/xpex-systems-ai';
const LOGO = '/brand/v3/xpex-systems-ai-mark.webp';
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow = '<span aria-hidden="true">↗</span>';
const ext = (href, label, cls='xp-link') => `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${label} ${arrow}</a>`;
const pill = text => `<span class="xp-pill">${text}</span>`;
const icon = id => `<span class="xp-icon">${brandMark(id)}</span>`;

export function publicHeader(ecosystem = false) {
  const nav = ecosystem ?
    '<a href="#eco-three-pillars">Plataformas</a><a href="/#systems">Sistemas</a><a href="#eco-integrations">Integrações</a><a href="#eco-business">Contato</a><a href="#eco-evidence">Evidências</a>' :
    '<a href="/?view=company">Empresa</a><a href="/?view=ecosystem">Ecossistema</a><a href="/#systems">Sistemas</a><a href="/?view=agents">Agentes</a><a href="/#evidencias">Evidências</a><a href="/?view=developers">Desenvolvedores</a>';
  return `<a class="xp-skip" href="#main-content">Ir para o conteúdo</a><header class="xp-header xp-shell">
    <a class="xp-brand" href="/" aria-label="XPeX Systems AI — início"><img src="${LOGO}" width="140" height="102" alt=""><span><b>XPeX</b> Systems AI</span></a>
    <button class="xp-menu-toggle" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="xp-navigation">Menu <span aria-hidden="true">☰</span></button>
    <nav id="xp-navigation" aria-label="Navegação principal">${nav}</nav>
    ${ext(CONTACT_URL,'Contato enterprise','xp-button xp-gold xp-demo-link')}
  </header>`;
}
export function publicFooter() {
  return `<footer class="xp-footer xp-shell"><div class="xp-footer-top"><a class="xp-brand" href="/" aria-label="XPeX Systems AI — início"><img src="${LOGO}" width="140" height="102" alt=""><span><b>XPeX</b> Systems AI</span></a><p>Engenharia para a economia de agentes.</p></div><div class="xp-footer-links"><a href="/?view=company">Empresa</a><a href="/?view=radar">Radar de agentes</a><a href="/?view=brand">Identidade visual</a><a href="/?view=plugins">Plugins</a><a href="/#academy">Academy</a><a href="/?view=developers">Documentação</a>${ext('https://www.linkedin.com/in/ceojuniorsena','LinkedIn')}${ext(REPO,'GitHub')}<a href="/?view=privacy">Privacidade</a><a href="/?view=terms">Termos</a></div><div class="xp-footer-bottom"><span>© ${new Date().getFullYear()} XPeX Systems AI</span><span>Build. Connect. Operate. Prove.</span></div></footer>`;
}

export function publicIntegrations() {
  return `<section class="xp-shell xp-section" id="integration-channels">${sectionHead('INTEGRAÇÕES E CANAIS','Conexões que ampliam o ecossistema.')}<p class="xp-section-intro">Interfaces, distribuição e caminhos de participação. Consulte a fonte de cada canal para conferir sua função e disponibilidade.</p><div class="xp-three">${[
    ['TensorBlock','Distribuição MCP','A contribuição da XPeX ao catálogo está registrada no GitHub. Catálogo e venda são etapas distintas.','https://github.com/TensorBlock/awesome-mcp-servers/pull/2949','Ver contribuição'],
    ['Glama','Descoberta de ferramentas','Página pública do GXEON Agent Marketplace, com ferramentas e histórico de inspeções.','https://glama.ai/mcp/connectors/io.github.xpex-systems-ai/gxeon-agent-marketplace','Ver listagem'],
    ['API empresarial','Interface própria','Descoberta de sistemas, catálogo de capacidades e correspondência de necessidades.','/api/agent-api','Consultar API'],
    ['MCP empresarial','Interface própria','Ferramentas de descoberta para clientes e runtimes compatíveis com MCP.','/api/mcp/enterprise','Consultar MCP'],
    ['Speedbot','Fonte externa','Documentação para explorar trabalho, serviços e colaboração entre agentes.','https://speedbot.dev/docs','Abrir documentação'],
    ['BasedAgents','Fonte externa','Documentação sobre identidade, tarefas e entregas de agentes.','https://basedagents.ai/docs/agents','Abrir documentação']
  ].map(([name,state,copy,url,label])=>`<article class="xp-card xp-radar-card">${pill(state)}<h3 style="margin-top:24px">${name}</h3><p>${copy}</p>${ext(url,label)}</article>`).join('')}</div><p class="xp-small-note">A presença em um diretório não comprova parceria, contratação ou pagamento.</p></section>`;
}

export const agents = [
  {id:'audit-engineer',name:'GXEON Audit Engineer',icon:'audit-os',state:'Em validação',kind:'Auditoria',summary:'Diagnóstico de APIs e integrações, com evidências e limites claros.',for:'Desenvolvedores e empresas que precisam compreender a confiabilidade de uma integração.',delivery:'Verificações documentadas, achados priorizados, links de evidência e limites do escopo.',limits:'A oferta está em validação. O Audit OS é uma superfície de demonstração existente; esta página não executa varreduras de segurança nem promete certificação.',system:'audit-os',action:'Explorar Audit OS'},
  {id:'plugin-factory',name:'XPeX Plugin Factory',icon:'plugin-factory',state:'Demonstração',kind:'Integração',summary:'Ferramentas, plugins e MCP. Do blueprint ao pacote para revisão.',for:'Equipes que querem transformar capacidades em ferramentas utilizáveis por agentes.',delivery:'Blueprint estruturado, pacote compilado e validações de política conforme os recursos do sistema.',limits:'Compilar um pacote não significa publicar em uma loja ou obter aprovação externa.',system:'plugin-factory',action:'Conhecer a Factory'},
  {id:'api-mcp',name:'API & MCP',icon:'api-fabric',state:'Descoberta pública',kind:'Integração',summary:'Interfaces para outros sistemas descobrirem as capacidades da XPeX.',for:'Desenvolvedores de aplicações e operadores de agentes.',delivery:'Catálogo legível por máquina, documentação de descoberta e correspondência de necessidades empresariais.',limits:'Descoberta e recomendação de capacidades não são contratação, execução ou comprovação de pagamento.',system:'api-fabric',action:'Acessar documentação'},
  {id:'neural-copilot',name:'GX Neural Copilot',icon:'gxeon',state:'Consulta pública',kind:'Conhecimento',summary:'Entenda a empresa e os sistemas a partir de registros e evidências.',for:'Quem quer avaliar a arquitetura, o portfólio e os limites da XPeX.',delivery:'Respostas do GX Evidence Concierge com as fontes públicas disponíveis.',limits:'A interface pública não acessa memória privada, credenciais ou dados internos e não opera os sistemas.',system:'systems-command',action:'Perguntar ao GX'}
];
const roadmap = [
  ['GXEON Agent Evaluator','Avaliação de agentes com critérios definidos.'],
  ['GXEON Access Auditor','Revisão de permissões de ferramentas e conectores.'],
  ['GXEON Delivery Verifier','Verificação de entregas frente ao escopo.'],
  ['XPeX Operations Agent','Investigação de disponibilidade e incidentes.'],
  ['GXEON Knowledge Memory','Recuperação de conhecimento com fonte e acesso controlado.'],
  ['GXEON Payment Reconciler','Conciliação de pedidos, entregas e pagamentos.']
];
function sectionHead(kicker, title, href, label) { return `<div class="xp-section-head"><div><p class="xp-kicker">${kicker}</p><h2>${title}</h2></div>${href?`<a class="xp-link" href="${href}">${label} <span aria-hidden="true">→</span></a>`:''}</div>`; }
function orbitSVG() {
  return `<svg class="xp-orbit-art" viewBox="0 0 1536 1024" fill="none" aria-hidden="true"><defs><filter id="orbit-glow"><feGaussianBlur stdDeviation="2"/></filter></defs><g class="xp-orbit xp-orbit-a"><ellipse cx="780" cy="410" rx="242" ry="102" stroke="#e9c77b" stroke-opacity=".65" stroke-width="1"/><ellipse class="xp-orbit-trail" cx="780" cy="410" rx="242" ry="102" stroke="#ffe1a0" stroke-width="2" stroke-dasharray="24 1100"/><circle cx="1022" cy="410" r="4" fill="#ffe3a6"/><circle cx="1022" cy="410" r="10" fill="#f5cf79" opacity=".5" filter="url(#orbit-glow)"/></g><g class="xp-orbit xp-orbit-b"><ellipse cx="780" cy="410" rx="226" ry="120" stroke="#e9c77b" stroke-opacity=".5"/><circle cx="554" cy="410" r="4" fill="#ffe3a6"/></g><g class="xp-orbit xp-orbit-c"><ellipse cx="780" cy="410" rx="240" ry="92" stroke="#e9c77b" stroke-opacity=".4"/><circle cx="1020" cy="410" r="3" fill="#fff0cb"/></g></svg>`;
}
function hero() {
  return `<section class="xp-hero xp-enterprise-hero" aria-labelledby="hero-heading">
    <div class="xp-hero-scene" aria-hidden="true">
      <picture>
        <source media="(max-width: 600px)" srcset="/media/gxeon-earth-mobile.webp">
        <img src="/media/gxeon-earth.jpg" width="1536" height="1024" alt="" fetchpriority="high">
      </picture>
      ${orbitSVG()}
    </div>
    <div class="xp-shell xp-hero-inner">
      <div class="xp-hero-copy">
        <p class="xp-kicker"><span></span> Build. Connect. Operate. Prove.</p>
        <h1 id="hero-heading">XPeX <span>Systems AI</span></h1>
        <p class="xp-enterprise-tagline">Agentes especializados.<br><em>Execução verificável.</em></p>
        <p class="xp-hero-description">Engenharia de IA, integração de sistemas e auditoria. Explore nossos produtos, as evidências por trás deles e o piloto da Academy.</p>
        <div class="xp-actions">
          <a class="xp-button xp-gold" href="/?view=ecosystem">Explorar ecossistema <span aria-hidden="true">→</span></a>
          <a class="xp-button" href="#systems">Conhecer sistemas <span aria-hidden="true">↓</span></a>
        </div>
        <div class="xp-enterprise-proofs">
          <a href="#evidencias">Ver evidências <span aria-hidden="true">↓</span></a>
          <a href="/data/xpex-ecosystem-three-pillars-v1.json">Diretório dos três pilares <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </div>
    <button class="xp-motion-button" type="button" data-motion aria-pressed="false">Pausar animação <span aria-hidden="true">Ⅱ</span></button>
  </section>`;
}

function developerCTA() { return `<section class="xp-shell xp-developer-cta"><div><p class="xp-kicker">CONSTRUA COM A XPeX</p><h2>Integre sua próxima operação.</h2><p>Documentação, APIs e padrões para conectar seus agentes.</p></div><div class="xp-actions"><a class="xp-button" href="/?view=developers">▤ Documentação →</a><a class="xp-button" href="/api/agent-api">⌘ API ↗</a><a class="xp-button" href="/api/mcp/enterprise">◇ MCP ↗</a></div></section>`; }
function radarCards() { return `<div class="xp-radar-cards">${[
  ['01','Speedbot','Trabalho e colaboração','Explore trabalhos, serviços e colaboração entre agentes.','https://speedbot.dev/jobs'],
  ['02','BasedAgents','Tarefas para agentes','Conheça o fluxo de identidade, entrega e aceite de tarefas.','https://basedagents.ai/docs/agents'],
  ['03','RustChain','Contribuições técnicas','Explore bounties e contribuições com recompensas declaradas em RTC.','https://github.com/Scottcjn/Rustchain']
].map(([n,name,type,copy,url])=>`<article class="xp-card xp-radar-card"><div class="xp-radar-top"><span>${n}</span>${pill(type)}</div><h3>${name}</h3><p>${copy}</p>${ext(url,'Explorar a fonte')}</article>`).join('')}</div>`; }
function systemsRail(shell = true) {
  return showcaseRail({
    id: 'systems', title: 'Sistemas em destaque', label: 'Produtos', items: [...SYSTEMS, ...MODULES], shell
  });
}

function home() {
  return `${hero()}
    ${showcaseRail({
      id: 'ecosystem', label: 'Plataformas', title: 'Três portas de entrada',
      summary: 'Conheça a empresa, consulte o Portfólio e o Radar, ou explore o piloto educacional. Cada plataforma tem seu próprio acesso.',
      items: PLATFORMS
    })}
    ${systemsRail()}
    ${showcaseRail({
      id: 'agents', label: 'Capacidades', title: 'Agentes especializados', items: [...agentShowcaseItems(agents), ...ROLES],
      more: { href: '/?view=agents', label: 'Catálogo de agentes' }
    })}
    ${showcaseRail({
      id: 'evidencias', label: 'Evidence First', title: 'Cases e evidências', items: [...TRUST, ...MORE_EVIDENCE],
      more: { href: '/?view=radar', label: 'Radar de agentes' }
    })}
    ${showcaseRail({
      id: 'academy', label: 'Aprendizagem aplicada', title: 'XPeX Academy', items: [ACADEMY]
    })}
    ${showcaseRail({
      id: 'integration-channels', label: 'APIs e distribuição', title: 'Integrações e canais', items: [...INTEGRATIONS, ...MORE_INTEGRATIONS],
      more: { href: '/?view=developers', label: 'Documentação' }
    })}
    <section id="enterprise-contact" class="xp-shell xp-developer-cta xp-enterprise-contact" aria-labelledby="enterprise-contact-title">
      <div><h2 id="enterprise-contact-title">Falar com a XPeX</h2><p>Converse com Junior Sena sobre engenharia de IA, integrações ou um piloto para sua empresa.</p></div>
      ${ext(CONTACT_URL, 'Contato enterprise', 'xp-button xp-gold')}
    </section>`;
}

function pageIntro(kicker,title,copy) {return `<div class="xp-page-intro"><p class="xp-kicker">${kicker}</p><h1>${title}</h1><p>${copy}</p></div>`;}
function agentsPage(params) {
  const a=agents.find(x=>x.id===params.get('agent'));
  if(a) return `${pageIntro('AGENTE / '+a.kind,a.name,a.summary)}<div class="xp-media-detail">${showcaseCover(agentShowcaseItems(agents).find(item => item.href.endsWith('agent='+a.id)), false, true)}<a class="xp-link" href="/data/showcase-media-pack-v2.json">Origem da capa →</a></div><div class="xp-detail-layout"><div class="xp-card xp-detail-main">${icon(a.icon)}${pill(a.state)}<h2>Para quem é</h2><p>${a.for}</p><h2>O que entrega</h2><p>${a.delivery}</p><h2>Disponibilidade e escopo</h2><p>${a.limits}</p><div class="xp-actions"><a class="xp-button xp-gold" href="${a.id==='api-mcp'?'/?view=developers':a.id==='neural-copilot'?'/?view=company#gx':'/?system='+a.system}">${a.action} →</a><a class="xp-button" href="/?view=agents">Voltar ao catálogo</a></div></div><aside class="xp-card xp-detail-aside"><p class="xp-kicker">COMO FUNCIONA</p><ol><li>Entenda a capacidade e o estágio.</li><li>Explore a demonstração disponível.</li><li>Confira documentação e evidências.</li><li>Defina o escopo antes de contratar.</li></ol><p>Preço e contratação serão exibidos quando o fluxo correspondente estiver validado.</p></aside></div>`;
  return `${pageIntro('CATÁLOGO / GXEON','Agentes especializados.<br/><em>Capacidades com propósito.</em>','Conheça o que cada capacidade faz, para quem serve e qual é seu estágio de disponibilidade.')}<div class="xp-filters" role="group" aria-label="Filtrar agentes">${['Todos','Auditoria','Integração','Conhecimento'].map((f,i)=>`<button class="xp-filter${!i?' active':''}" type="button" data-agent-filter="${f}" aria-pressed="${!i}">${f}</button>`).join('')}</div><div class="xp-catalog-grid">${[...agentShowcaseItems(agents), ...ROLES].map(a=>`<div data-agent-kind="${a.category}">${showcaseCard(a)}</div>`).join('')}</div><div class="xp-notice">Cada página apresenta o estágio e os limites da capacidade. Uma demonstração não representa contratação ou execução automática.</div>${developerCTA()}`;
}
function pluginsPage() { return `${pageIntro('PLUGINS PARA OPENAI','Ferramentas que<br/><em>ampliam possibilidades.</em>','Uma linha de produtos próprios para conectar conhecimento, sistemas e execução verificável ao trabalho com agentes.')}${showcaseRail({id:'plugin-catalog', title:'Plugins e capacidades', label:'Catálogo XPeX', items:PLUGINS, shell:false})}<section class="xp-section">${sectionHead('PORTFÓLIO EM FORMAÇÃO','O próximo horizonte.')}<div class="xp-roadmap">${roadmap.map(([name,copy])=>`<article><div><h3>${name}</h3><p>${copy}</p></div>${pill('Planejado')}</article>`).join('')}</div></section><div class="xp-notice">Produtos independentes da XPeX. Os estados acima não indicam parceria, publicação ou aprovação oficial da OpenAI. Instalação privada, permissões e instruções dependem da validação de cada pacote.</div>`; }
function developersPage() { return `${pageIntro('DEVELOPER PLATFORM','Sua próxima conexão<br/><em>começa aqui.</em>','Explore as interfaces públicas da XPeX e encontre capacidades para integrar aos seus agentes e aplicações.')}<div class="xp-developer-grid"><article class="xp-card"><p class="xp-kicker">01 / REST</p><h2>Descoberta empresarial</h2><p>Consulte o catálogo público e descubra como necessidades se relacionam com as capacidades da XPeX.</p><div class="xp-code"><code>GET /api/agent-api</code><button type="button" data-copy="https://xpex-systems-ai.vercel.app/api/agent-api" aria-label="Copiar URL da API">Copiar</button></div><pre><code>curl https://xpex-systems-ai.vercel.app/api/agent-api</code></pre>${ext('/api/agent-api','Abrir resposta JSON')}<p class="xp-small-note">Descoberta pública sem credenciais. Outros serviços podem exigir autenticação e condições próprias.</p></article><article class="xp-card"><p class="xp-kicker">02 / MCP</p><h2>Conecte um agente</h2><p>A interface empresarial permite descobrir sistemas e capacidades por ferramentas MCP.</p><div class="xp-code"><code>/api/mcp/enterprise</code><button type="button" data-copy="https://xpex-systems-ai.vercel.app/api/mcp/enterprise" aria-label="Copiar URL do MCP">Copiar</button></div><pre><code>{
  "mcpServers": {
    "xpex-enterprise": {
      "url": "https://xpex-systems-ai.vercel.app/api/mcp/enterprise"
    }
  }
}</code></pre>${ext('/api/mcp/enterprise','Inspecionar MCP')}</article></div><section class="xp-section" id="agent-api"><div class="xp-section-head"><div><p class="xp-kicker">EXPLORE AS CAPACIDADES</p><h2>Descreva sua necessidade.</h2></div></div><div class="xp-matcher xp-card" data-agent-api><form data-agent-api-form><label for="xp-company">Perfil da operação</label><select id="xp-company" data-agent-api-company><option value="developer">Desenvolvedor / plataforma de agentes</option><option value="enterprise">Empresa</option><option value="education">Educação</option></select><label for="xp-need">O que você quer integrar?</label><textarea id="xp-need" data-agent-api-need required maxlength="1200" placeholder="Ex.: auditar minhas integrações e organizar evidências dos sistemas."></textarea><button class="xp-button xp-gold" type="submit" data-agent-api-submit>Encontrar capacidades →</button><p class="xp-small-note">Consulta pública. Envie apenas uma descrição geral da necessidade.</p></form><div data-agent-api-result aria-live="polite"><p>O resultado da consulta aparecerá aqui, com as capacidades e fontes disponíveis.</p></div></div></section><div class="xp-resource-links">${ext('/.well-known/xpex-agent-api.json','Manifesto de descoberta')}${ext('/data/enterprise-agent-catalog-v1.json','Catálogo de agentes')}${ext('/llms.txt','Índice para agentes')}${ext(REPO+'/tree/main/site','Código e testes')}</div><div class="xp-notice">A correspondência de capacidades é informativa. Autenticação, limites, escopo de execução e cobrança devem ser conferidos na documentação de cada serviço antes do uso.</div>`; }
function radarPage() {return `${pageIntro('RADAR / ECONOMIA DE AGENTES','Descubra onde<br/><em>seu agente pode atuar.</em>','Uma porta de entrada para explorar trabalho, colaboração e distribuição de capacidades.')}<div class="xp-two-paths"><div class="xp-card"><span>01 / TRABALHAR</span><h2>Encontrar trabalho para meu agente.</h2><p>Compare requisitos, condições de aceite e custos antes de assumir uma tarefa.</p></div><div class="xp-card"><span>02 / PUBLICAR</span><h2>Disponibilizar uma capacidade.</h2><p>Documente a ferramenta, publique uma interface e torne sua entrega demonstrável.</p></div></div>${radarCards()}<section class="xp-section"><p class="xp-kicker">COMO USAR O RADAR</p><div class="xp-roadmap">${[['Descubra','Acesse a plataforma pela fonte oficial e leia os requisitos.'],['Verifique','Confira financiamento, elegibilidade, custos, prazo e condições de aceite.'],['Execute','Assuma apenas tarefas compatíveis com as permissões e capacidades do seu agente.'],['Comprove','Registre a entrega, o aceite e o pagamento como etapas separadas.']].map(([a,b])=>`<article><div><h3>${a}</h3><p>${b}</p></div></article>`).join('')}</div></section><div class="xp-notice"><b>Diretório editorial · Fontes conferidas em 17/10/2026 (UTC).</b> Este radar aponta para plataformas externas; não apresenta um feed automático de tarefas, saldo ou garantia de remuneração. Disponibilidade e regras são determinadas pela fonte.</div>`;}
function concierge() {return `<section id="gx" class="xp-section"><div class="xp-section-head"><div><p class="xp-kicker">GX / EVIDENCE CONCIERGE</p><h2>Pergunte à XPeX.<br/><em>Confira as fontes.</em></h2></div></div><div class="gx-console" data-gx-console><aside class="gx-rail"><div class="gx-identity"><div class="gx-core">${brandMark('gxeon')}</div><div><b>GX Evidence Concierge</b><small>Consulta pública · Somente leitura</small></div></div><div class="gx-state"><span>Modo de resposta</span><span data-gx-mode>PRONTO</span></div><div class="gx-quick-list"><button class="gx-quick" data-gx-quick="Quem é Junior Sena e o que ele construiu?">Quem construiu a XPeX?</button><button class="gx-quick" data-gx-quick="Quais sistemas estão prontos para demonstração?">Conhecer as demonstrações</button><button class="gx-quick" data-gx-quick="Quais são os limites de segurança e governança?">Segurança e governança</button></div></aside><div class="gx-chat"><div class="gx-log" data-gx-log aria-live="polite"></div><form class="gx-form" data-gx-form><input data-gx-input maxlength="900" autocomplete="off" required placeholder="Pergunte sobre a empresa ou um sistema…" aria-label="Sua pergunta ao GX"/><button class="xp-button xp-gold" data-gx-send type="submit">Perguntar →</button></form></div></div></section>`;}
function companyPage() {return `${pageIntro('XPeX SYSTEMS AI','Uma empresa.<br/><em>Inteligência conectada.</em>','Engenharia de agentes, integração de sistemas e auditoria orientada por evidências.')}<div class="xp-company-grid"><article class="xp-card"><h2>Trabalho útil. Execução verificável.</h2><p>A XPeX Systems AI, fundada por Júnior Sena, desenvolve agentes especializados e integrações para pessoas, empresas, desenvolvedores e outros agentes.</p><p>GXEON coordena capacidades; Plugin Factory prepara ferramentas e conexões; Systems Command organiza sistemas e evidências. Studio AI e Academy ampliam o ecossistema para criação e educação.</p><p>A experiência técnica inclui interfaces API e MCP, sistemas publicados e controles documentados. Aceite comercial e pagamento são acompanhados com evidências próprias.</p><div class="xp-actions" id="investors">${ext(REPO+'/blob/main/docs/INVESTOR_BRIEF_V2.md','Apresentação para investidores','xp-button')}${ext(REPO+'/blob/main/docs/FOUNDER_PROFILE.md','Perfil do fundador','xp-button')}</div></article><aside class="xp-card xp-founder" id="founder"><span class="xp-founder-monogram">JS</span><p class="xp-kicker">FUNDADOR</p><h2>Júnior Sena</h2><p>Engenharia de IA aplicada,<br/>sistemas agênticos e auditoria.</p><div id="contact">${ext(CONTACT_URL,'LinkedIn')}</div><div id="trust">${ext(REPO+'/blob/main/docs/TRUST_CENTER.md','Governança e evidências')}</div></aside></div>${concierge()}`;}
function policyPage(privacy) {return `${pageIntro('INFORMAÇÕES DO SITE',privacy?'Privacidade.':'Termos de uso.',privacy?'Uma visão clara das interações disponíveis nesta superfície pública.':'Escopo das demonstrações e do conteúdo apresentado.')}<article class="xp-card xp-policy"><h2>${privacy?'Consultas e dados enviados':'Demonstrações e disponibilidade'}</h2><p>${privacy?'As consultas ao GX e à API empresarial enviam o texto informado para os endpoints da XPeX. O GX pode usar um provedor de IA quando essa integração estiver configurada. Use descrições gerais; não envie credenciais, dados financeiros ou dados pessoais de terceiros.':'As páginas descrevem sistemas e capacidades com estágios próprios. Demonstrações, fontes de código, cadastros e catálogos não constituem certificação, contratação ou garantia de resultado. O estágio de um serviço deve ser conferido antes de seu uso.'}</p><h2>${privacy?'Plataformas externas':'Contratação e pagamentos'}</h2><p>${privacy?'Links externos levam a serviços com políticas e condições próprias. A consulta a uma carteira pública não demonstra titularidade ou autorização para movimentação.':'A contratação depende de escopo, preço e condições definidos no serviço correspondente. Este site não movimenta fundos automaticamente. Oportunidades de plataformas externas obedecem às regras dessas plataformas.'}</p><h2>Contato e esclarecimentos</h2><p>O canal público do fundador está disponível para dúvidas sobre o site e os serviços.</p>${ext('https://www.linkedin.com/in/ceojuniorsena','Acessar o canal do fundador')}<p class="xp-small-note">Atualizado em outubro de 2026.</p></article>`;}

export function renderPublicSite(app) {
  const params=new URLSearchParams(location.search);
  let view=params.get('view')||'home';
  if(!params.has('view')&&location.hash==='#agent-api') view='developers';
  if(!params.has('view')&&(params.has('ask')||['#gx','#trust','#investors','#contact','#founder'].includes(location.hash))) view='company';
  if(params.has('system')||!['home','agents','systems','plugins','developers','radar','company','privacy','terms'].includes(view)) return false;
  const titles={home:'Agentes especializados. Execução verificável.',agents:'Agentes e capacidades',systems:'Nossos sistemas',plugins:'Plugins para OpenAI',developers:'Desenvolvedores',radar:'Radar da economia de agentes',company:'Empresa e fundador',privacy:'Privacidade',terms:'Termos de uso'};
  document.documentElement.lang='pt-BR';
  document.title=`XPeX Systems AI — ${titles[view]}`;
  document.body.classList.add('xpex-public');
  let content;
  switch(view){case 'agents':content=agentsPage(params);break;case 'systems':content=pageIntro('ECOSSISTEMA / PORTFÓLIO','Sistemas que se conectam.<br/><em>Identidades que permanecem.</em>','Explore os sete sistemas do portfólio e confira arquitetura, acessos e evidências de cada um.')+systemsRail(false);break;case 'plugins':content=pluginsPage();break;case 'developers':content=developersPage();break;case 'radar':content=radarPage();break;case 'company':content=companyPage();break;case 'privacy':content=policyPage(true);break;case 'terms':content=policyPage(false);break;default:content=home();}
  app.innerHTML=`${publicHeader()}<main id="main-content" tabindex="-1" class="${view==='home'?'xp-home':'xp-shell xp-page'}">${content}</main>${publicFooter()}<div class="xp-toast" role="status" aria-live="polite"></div>`;
  initPublicNavigation();
  initShowcase(app);
  initGX();initEnterpriseAgentAPI();
  document.querySelectorAll('[data-agent-filter]').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('[data-agent-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
    document.querySelectorAll('[data-agent-kind]').forEach(card=>{card.hidden=button.dataset.agentFilter!=='Todos'&&card.dataset.agentKind!==button.dataset.agentFilter;});
  }));
  document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(button.dataset.copy);button.textContent='Copiado ✓';}catch{button.textContent='Selecione e copie a URL';}
  }));
  const motion=document.querySelector('[data-motion]'),scene=document.querySelector('.xp-hero-scene');
  if(motion&&scene){
    const media=matchMedia('(prefers-reduced-motion: reduce)');let paused=media.matches;
    const sync=()=>{scene.classList.toggle('xp-motion-paused',paused);motion.setAttribute('aria-pressed',String(paused));motion.innerHTML=paused?'Ativar animação <span aria-hidden="true">▷</span>':'Pausar animação <span aria-hidden="true">Ⅱ</span>';};
    sync();motion.addEventListener('click',()=>{paused=!paused;sync();});
    media.addEventListener('change',()=>{paused=media.matches;sync();});
    const observer=new IntersectionObserver(([entry])=>scene.classList.toggle('xp-motion-offscreen',!entry.isIntersecting));observer.observe(scene);
    document.addEventListener('visibilitychange',()=>scene.classList.toggle('xp-motion-hidden',document.hidden));
  }
  if(location.hash) requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());
  return true;
}
export function initPublicNavigation(){
  const button=document.querySelector('.xp-menu-toggle'),nav=document.querySelector('#xp-navigation');
  if(!button||!nav)return;
  const close=()=>{button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Abrir menu');nav.classList.remove('xp-nav-open');};
  button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');nav.classList.toggle('xp-nav-open',open);});
  nav.addEventListener('click',event=>{if(event.target.closest('a'))close();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&button.getAttribute('aria-expanded')==='true'){close();button.focus();}});
}
