const WALLET = 'https://gxeon-wallet-command-center.vercel.app';
const REPO = 'https://github.com/xpex-systems-ai/xpex-systems-ai';
const CONTACT = 'https://www.linkedin.com/in/ceojuniorsena';
const esc = (v = '') => String(v).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[c]));
const stamps = v => v && Number.isFinite(Date.parse(v)) ? new Intl.DateTimeFormat('pt-BR', { dateStyle:'short', timeStyle:'short', timeZone:'America/Sao_Paulo' }).format(new Date(v)) + ' BRT' : 'NÃO VERIFICADO';
const labels = { AVAILABLE:'CONSULTADO', STALE:'DESATUALIZADO', UNAVAILABLE:'INDISPONÍVEL', NOT_VERIFIED:'NÃO VERIFICADO', SETUP_REQUIRED:'CONFIGURAÇÃO PENDENTE', CONFIGURED_NOT_SYNCED:'CONFIGURADO · SINCRONIZAÇÃO NÃO VERIFICADA', STAGING_AVAILABLE:'STAGING · ACESSO AUTENTICADO', DEGRADED:'CONSULTA PARCIAL' };
const badge = state => `<span class="eco-badge ${state === 'AVAILABLE' ? 'eco-good' : ''}">${esc(labels[state] || 'NÃO VERIFICADO')}</span>`;
const link = (url, text, primary = false) => `<a class="button${primary ? ' primary' : ''}" href="${url}" target="_blank" rel="noreferrer">${text} ↗</a>`;

export function ecosystemEntry() {
  return `<section id="ecosystem" class="shell eco-entry" lang="pt-BR">
    <div><p class="kicker">XPEX SYSTEMS AI / GXEON AGENT ECONOMY</p><h2>Uma empresa.<br/><em>Um ecossistema conectado.</em></h2><p>Integrações, serviços para agentes e operações de receita agora têm uma entrada oficial. Explore a demonstração pública com dados consultados, fontes e limites visíveis.</p></div>
    <div class="eco-entry-panel"><span class="eco-badge">DEMONSTRAÇÃO PÚBLICA · SOMENTE LEITURA</span><h3>GXEON Enterprise</h3><p>Wallet Command Center · Comunidades · Coinbase · Revenue Operations</p><a class="button primary" href="/?view=ecosystem">Abrir o ecossistema →</a><a class="text-link" href="#agent-api">Avaliar um piloto empresarial →</a></div>
  </section>`;
}

function integrationsMarkup(module = {}) {
  const c = module.coinbase || {};
  const command = module.command || {};
  return `<article class="eco-card eco-coinbase"><div class="eco-card-top"><span class="eco-icon">C</span>${badge(c.status)}</div><h3>Coinbase</h3><p class="eco-caption">Wallet, USDC & Agent Payments</p><p>A camada financeira autorizada do GXEON. A conexão do conector é uma evidência histórica; consultas do backend dependem da configuração e da autenticação do operador.</p><dl class="eco-definition"><div><dt>Conta / rede / saldo</dt><dd>NÃO VERIFICADO</dd></div><div><dt>USDC / receitas confirmadas</dt><dd>NÃO VERIFICADO</dd></div><div><dt>Blockchain Base</dt><dd>Integração planejada</dd></div><div><dt>Conector verificado em</dt><dd>${stamps(c.connectorVerifiedAt)}</dd></div></dl><div class="eco-actions">${link(WALLET + '/?tab=integrations', 'Abrir integrações')}${link('https://www.coinbase.com', 'Coinbase oficial')}</div></article>
    <article class="eco-card"><div class="eco-card-top"><span class="eco-icon">GX</span>${badge(command.status)}</div><h3>Comunidades & Command</h3><p class="eco-caption">Distribuição, participação e evidências</p><p>O diretório de comunidades está no módulo de integrações. Participação, perfil público e parceria comercial têm níveis de evidência diferentes.</p><dl class="eco-definition"><div><dt>Command interno</dt><dd>Ambiente staging</dd></div><div><dt>Sincronização de dados</dt><dd>Sessão autenticada exigida</dd></div><div><dt>Parcerias e contratos</dt><dd>NÃO VERIFICADO</dd></div></dl><div class="eco-actions">${link(WALLET + '/?tab=integrations', 'Ver diretório')}${link('https://xpex-systems-command-staging-web-production.up.railway.app/communities', 'Acesso do operador')}</div></article>`;
}
function radarMarkup(module = {}) {
  const names = { unified:'Radar GXEON', basebounty:'BaseBounty' };
  const rows = (module.sources || ['unified','basebounty'].map(id => ({ id, status:'UNAVAILABLE' }))).map(s => `<tr><th scope="row">${names[s.id]}</th><td>${badge(s.status)}</td><td>${s.count == null ? 'NÃO VERIFICADO' : esc(s.count)}</td><td>${stamps(s.observedAt)}</td></tr>`).join('');
  return `<div class="eco-table-wrap"><table><caption>Registros públicos consultados · contagens por fonte, sem soma financeira</caption><thead><tr><th>Fonte</th><th>Estado</th><th>Registros</th><th>Atualização da fonte</th></tr></thead><tbody>${rows}</tbody></table></div><p class="eco-note">Registros desatualizados exigem nova verificação antes de qualquer proposta. Uma recompensa anunciada é uma oportunidade, até que entrega, pagamento e conciliação sejam comprovados.</p>`;
}
function catalogMarkup(module = {}) {
  const desc = { gxeon_json_validate_v1:'Validação de estrutura JSON', gxeon_csv_audit_v1:'Qualidade e consistência de CSV', gxeon_url_verify_v1:'Verificação de URLs públicas', gxeon_api_health_v1:'Disponibilidade de APIs' };
  const units = { payload:'payload', file:'arquivo', url:'URL', endpoint:'endpoint' };
  if (module.status !== 'AVAILABLE') return '<p class="eco-empty">Catálogo indisponível nesta consulta. Os serviços continuam NÃO VERIFICADOS nesta demonstração.</p>';
  if (!module.catalog.length) return '<p class="eco-empty">A fonte retornou um catálogo vazio nesta consulta.</p>';
  return module.catalog.map(s => `<article class="eco-service"><span class="eco-service-label">DECLARADO NO CATÁLOGO</span><h3>${esc(s.name.replace('GXEON ',''))}</h3><p>${desc[s.id]}</p><strong>${esc(s.credits)} <small>créditos / ${units[s.unit]}</small></strong><p class="eco-note">Execução e pagamento não testados nesta demonstração.</p></article>`).join('');
}
function evidenceMarkup(snapshot) {
  const modules = snapshot.modules || {};
  return `<div class="eco-evidence-grid">${[['integrations','Integrações'],['revenue','Revenue Operations'],['services','Catálogo de serviços']].map(([id,name]) => `<article class="eco-evidence-item"><div><b>${name}</b>${badge(modules[id]?.status)}</div><span>Observado: ${stamps(modules[id]?.observedAt)}</span><a class="text-link" href="${id === 'integrations' ? WALLET + '/api/integration-status?view=ecosystem' : id === 'revenue' ? WALLET + '/api/integration-status?view=revenue-operations' : WALLET + '/api/v1/services'}" target="_blank" rel="noreferrer">Inspecionar a fonte pública ↗</a></article>`).join('')}</div>`;
}

export function maybeRenderEcosystem(app) {
  if (new URLSearchParams(location.search).get('view') !== 'ecosystem') return false;
  document.documentElement.lang = 'pt-BR';
  document.title = 'GXEON Enterprise — XPeX Systems AI';
  app.innerHTML = `<div class="noise"></div>
    <header class="nav shell eco-nav"><a class="brand" href="/" aria-label="XPeX Systems AI — empresa"><span class="brand-mark">X</span><span><b>XPeX</b><small>SYSTEMS AI</small></span></a><nav aria-label="Ecossistema"><a href="#eco-overview">Visão geral</a><a href="#eco-integrations">Integrações</a><a href="#eco-business">Negócios</a><a href="#eco-evidence">Evidências</a></nav><a class="button ghost" href="/">← Empresa</a></header>
    <main class="eco-page">
      <section id="eco-overview" class="shell eco-hero"><div class="eco-hero-copy"><p class="kicker">XPEX SYSTEMS AI / GXEON AGENT ECONOMY</p><div class="eco-meta"><span class="eco-badge">DEMONSTRAÇÃO PÚBLICA</span><span class="eco-badge">SOMENTE LEITURA</span></div><h1>A economia dos agentes.<br/><em>Dentro da empresa.</em></h1><p>O ecossistema GXEON conecta integrações, demanda, serviços e evidências em uma interface oficial da XPeX Systems AI. Consulte o que existe hoje e avalie um piloto com a empresa.</p><div class="eco-actions"><a class="button primary" href="#eco-integrations">Explorar integrações ↓</a><a class="button" href="#eco-business">Discutir um piloto ↓</a></div></div><aside class="eco-identity"><div class="eco-monogram">GX</div><span>GXEON ENTERPRISE</span><b>Build. Connect.<br/>Earn. Verify.</b><p>Uma arquitetura existente.<br/>Uma entrada corporativa.</p><a class="text-link" href="/?system=wallet-command">Arquitetura do Wallet →</a></aside></section>
      <section class="shell eco-console" aria-label="Consulta pública do ecossistema"><div class="eco-console-head"><div><span class="eco-live-dot"></span><b>Observatório público</b><p data-eco-status role="status" aria-live="polite">Aguardando consulta das fontes…</p></div><button class="button" type="button" data-eco-refresh>Atualizar evidências</button></div><div class="eco-metrics"><div><strong data-eco-services>—</strong><span>serviços no catálogo consultado</span></div><div><strong>Somente leitura</strong><span>consulta pública de metadados</span></div><div><strong>NÃO VERIFICADO</strong><span>saldo e USDC disponíveis</span></div><div><strong>NÃO VERIFICADO</strong><span>receita conciliada</span></div></div><p class="eco-note">Valores não consultados permanecem NÃO VERIFICADOS. Créditos internos, saldos, oportunidades e receitas têm origens e estados próprios.</p></section>
      <section id="eco-integrations" class="shell eco-block"><div class="eco-heading"><div><p class="kicker">INTEGRAÇÕES / CONTROLE HUMANO</p><h2>Conectar. Observar.<br/>Comprovar.</h2></div><p>Dados financeiros e ações do operador exigem autorização. Esta demonstração consulta apenas os estados públicos de integração.</p></div><div class="eco-grid" data-eco-integrations>${integrationsMarkup()}</div></section>
      <section class="shell eco-block"><div class="eco-heading"><div><p class="kicker">REVENUE OPERATIONS</p><h2>Demanda identificada.<br/>Receita verificada.</h2></div><p>O radar existente alimenta a avaliação de tarefas remuneradas. A empresa decide sobre escopo, custos, elegibilidade e execução antes de assumir compromissos.</p></div><div data-eco-radar>${radarMarkup()}</div><ol class="eco-flow"><li><b>01 / Identificar</b><span>Fonte, prazo e demanda</span></li><li><b>02 / Revisar</b><span>Escopo, custo e autorização</span></li><li><b>03 / Entregar</b><span>Execução técnica aprovada</span></li><li><b>04 / Verificar</b><span>Liquidação + conciliação</span></li></ol><div class="eco-actions">${link(WALLET + '/?tab=revenue-operations', 'Abrir Revenue Operations')}<a class="text-link" href="${REPO}/blob/main/docs/GXEON_ENTERPRISE_DEMO.md" target="_blank" rel="noreferrer">Roteiro e limites da demonstração ↗</a></div></section>
      <section class="shell eco-block"><div class="eco-heading"><div><p class="kicker">SERVIÇOS PARA AGENTES / CATÁLOGO EXISTENTE</p><h2>Capacidades para empresas<br/>e plataformas de agentes.</h2></div><p>Os preços consultados são em créditos do catálogo GXEON. Disponibilidade declarada não comprova execução, compra ou receita. Publicação no AgenticTrade e preços USDC seguem não verificados.</p></div><div class="eco-services" data-eco-catalog><p class="eco-empty">Consultando o catálogo público…</p></div><div class="eco-actions">${link(WALLET + '/market', 'Explorar marketplace')}<a class="text-link" href="/#agent-api">Descoberta empresarial e MCP →</a></div></section>
      <section id="eco-business" class="eco-business-band"><div class="shell eco-block"><div class="eco-heading"><div><p class="kicker">NEGÓCIOS / PARCERIAS / PILOTOS</p><h2>Da demonstração<br/>a uma proposta concreta.</h2></div><p>Engenharia com escopo definido, critérios de aceitação e revisão humana. Contratos, preços finais, SLA e responsabilidades são discutidos antes de qualquer operação comercial.</p></div><div class="eco-offers"><article class="eco-offer"><span>01 / DIAGNÓSTICO</span><h3>Company Intelligence</h3><p>Mapeamento de sistemas, integrações e evidências para orientar uma decisão técnica.</p><a class="text-link" href="/?system=systems-command">Ver arquitetura →</a></article><article class="eco-offer"><span>02 / PILOTO</span><h3>Integrações & agentes</h3><p>Um fluxo delimitado com APIs, MCP, governança e entrega verificável.</p><a class="text-link" href="/#agent-api">Avaliar a necessidade →</a></article><article class="eco-offer"><span>03 / DISTRIBUIÇÃO</span><h3>Serviços para plataformas</h3><p>Pacotes de capacidades com descoberta técnica e admissão comercial para marketplaces.</p><a class="text-link" href="/?system=wallet-command">Inspecionar o sistema →</a></article></div><div class="eco-commercial-cta"><div><h3>Vamos definir o próximo passo da sua empresa.</h3><p>Converse com Junior Sena sobre um piloto, uma integração ou uma parceria. Esta página não envia propostas nem aceita contratos automaticamente.</p></div>${link(CONTACT, 'Falar com o fundador', true)}</div></div></section>
      <section id="eco-evidence" class="shell eco-block"><div class="eco-heading"><div><p class="kicker">EVIDENCE FIRST</p><h2>A prova permanece acessível.</h2></div><p>Consulta direta aos módulos já implantados. Cada fonte mantém seu próprio horário e estado; uma fonte indisponível não vira um número fictício.</p></div><div data-eco-evidence>${evidenceMarkup({})}</div><div class="eco-actions">${link(REPO, 'Repositório corporativo')}${link(REPO + '/blob/main/docs/TRUST_CENTER.md', 'Trust Center')}<a class="button" href="/api/ecosystem" target="_blank" rel="noreferrer">API pública desta demonstração ↗</a></div><p class="eco-note">Esta apresentação não altera o nível de assurance AL1 da empresa nem representa certificação externa. O Command interno continua em staging; a consulta financeira requer autenticação e conciliação.</p></section>
    </main><footer class="shell footer"><a href="/">XPeX Systems AI</a><p>Build. Connect. Operate. Prove.</p><p>© 2026 XPeX Systems AI</p></footer>`;
  const refresh = app.querySelector('[data-eco-refresh]');
  const status = app.querySelector('[data-eco-status]');
  let inFlight = false;
  const update = async () => {
    if (inFlight) return;
    inFlight = true; refresh.disabled = true;
    status.textContent = 'Consultando os módulos GXEON…';
    let snapshot;
    try {
      const response = await fetch('/api/ecosystem', { method:'GET', credentials:'omit', signal:AbortSignal.timeout(18000), cache:'no-store' });
      snapshot = await response.json();
      if (snapshot.mode !== 'PUBLIC_READ_ONLY' || !snapshot.modules || !['AVAILABLE','DEGRADED','UNAVAILABLE'].includes(snapshot.status)) throw new Error('Invalid projection');
    } catch { snapshot = { status:'UNAVAILABLE', modules:{} }; }
    const modules = snapshot.modules;
    app.querySelector('[data-eco-services]').textContent = modules.services?.status === 'AVAILABLE' ? String(modules.services.count) : 'NÃO VERIFICADO';
    app.querySelector('[data-eco-integrations]').innerHTML = integrationsMarkup(modules.integrations);
    app.querySelector('[data-eco-radar]').innerHTML = radarMarkup(modules.revenue);
    app.querySelector('[data-eco-catalog]').innerHTML = catalogMarkup(modules.services);
    app.querySelector('[data-eco-evidence]').innerHTML = evidenceMarkup(snapshot);
    status.textContent = `${labels[snapshot.status] || 'NÃO VERIFICADO'} · consulta ${stamps(snapshot.observedAt)}`;
    refresh.disabled = false; inFlight = false;
  };
  refresh.addEventListener('click', update);
  void update();
  return true;
}
