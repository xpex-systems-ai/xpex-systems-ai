/**
 * GXEON 19 — standalone pilot-offer microsite in the existing corporate site.
 * Intent: REQUEST ONLY. No payment link, form backend, tracking pixel,
 * third-party scripts, autonomous agent claims or unapproved customer access.
 */
const CONTACT = 'https://www.linkedin.com/in/ceojuniorsena';
const SYSTEMS = 'https://github.com/xpex-systems-ai/xpex-systems-ai';
export const AUDIT_PILOT = Object.freeze({
  id: 'gxeon-audit-engineer-pilot-v1',
  status: 'PILOT_ENQUIRIES_ONLY',
  salesState: 'NO_CHECKOUT_OR_LIVE_CHARGE',
  priceState: 'CUSTOM_QUOTE_NOT_PUBLISHED',
  currency: 'BRL',
  deliveryMode: 'HUMAN_REVIEWED_WITH_READ_ONLY_TECHNICAL_ASSISTANCE',
  publicLeadChannel: CONTACT,
  dataPolicy: 'NO_SECRETS_OR_CUSTOMER_DATA_IN_UNSOLICITED_MESSAGES',
  paidAutonomousAgentsClaimed: false,
  customersClaimed: 0,
  revenueClaimedBrl: 0,
  pilotScope: Object.freeze([
    'Um repositório ou uma aplicação escolhida e autorizada pelo cliente',
    'Leitura assistida de arquitetura, dependências e controles básicos de segurança',
    'Registro dos achados com referências reproduzíveis e limitações',
    'Relatório priorizado e reunião de devolutiva, após revisão humana',
  ]),
  excluded: Object.freeze([
    'Acesso sem autorização, credenciais ou dados pessoais enviados por mensagem',
    'Pentest invasivo, exploração de vulnerabilidades ou auditoria certificada',
    'Alteração, merge, deploy, pagamento ou correção automática em produção',
    'Garantia de eliminação integral de riscos, disponibilidade ou conformidade',
  ]),
});

const item = (text) => `<li>${text}</li>`;
export function auditPilotMarkup() {
  return `
    <div class="noise"></div>
    <header class="nav shell ap-nav">
      <a class="brand" href="/" aria-label="Voltar para XPeX Systems AI">XPeX <span>Systems AI</span></a>
      <nav aria-label="Navegação do piloto">
        <a href="#entrega">Entregáveis</a>
        <a href="#metodo">Método</a>
        <a href="#seguranca">Segurança</a>
        <a href="#conversa">Contato</a>
      </nav>
      <a class="button ghost" href="/">Voltar ao site ↗</a>
    </header>
    <main class="ap-main" lang="pt-BR">
      <section class="shell ap-hero">
        <p class="kicker">XPEX SYSTEMS AI / GXEON AUDIT ENGINEER</p>
        <p class="ap-state">PILOTO SOB AVALIAÇÃO · ATENDIMENTO HUMANO</p>
        <h1>Entenda o que seu sistema precisa <em>antes de colocar em produção.</em></h1>
        <p class="ap-lead">Auditoria técnica assistida por IA e revisada por profissionais: arquitetura, evidências, riscos e prioridades para a próxima entrega. Uma avaliação com escopo e consentimento definidos.</p>
        <div class="ap-actions">
          <a class="button primary" href="#conversa">Solicitar avaliação do piloto →</a>
          <a class="button" href="#entrega">Ver entregáveis</a>
        </div>
        <p class="ap-disclosure">Não é uma ferramenta autônoma de correção, pentest, certificação ou promessa de resultado financeiro. Contratação e preço dependem de proposta aprovada.</p>
      </section>

      <section id="entrega" class="shell ap-block">
        <p class="kicker">01 / O QUE VOCÊ RECEBE</p>
        <h2>Uma análise delimitada. Evidências claras.</h2>
        <ul class="ap-grid">
          <li><b>Mapa técnico</b><span>Componentes e dependências relevantes do projeto avaliado.</span></li>
          <li><b>Riscos priorizados</b><span>Achados com gravidade contextual e referência de verificação.</span></li>
          <li><b>Plano de ação</b><span>Correções sugeridas e próximos passos sob responsabilidade do cliente.</span></li>
          <li><b>Revisão humana</b><span>Resultado conferido antes da entrega, com registro das limitações.</span></li>
        </ul>
      </section>

      <section id="metodo" class="ap-band">
        <div class="shell ap-block">
          <p class="kicker">02 / COMO FUNCIONA O PILOTO</p>
          <h2>Escopo → Leitura → Evidência → Revisão → Entrega.</h2>
          <ol class="ap-steps">
            <li><b>Triagem</b><p>Conversamos sobre seu objetivo e verificamos se o piloto se encaixa.</p></li>
            <li><b>Autorização</b><p>Definimos por escrito quais ativos podem ser analisados e as regras de acesso.</p></li>
            <li><b>Análise assistida</b><p>Trabalhamos em modo de leitura e organizamos achados verificáveis.</p></li>
            <li><b>Validação</b><p>Uma revisão humana independente confronta evidências e conclusões.</p></li>
            <li><b>Devolutiva</b><p>Entregamos relatório e prioridades acordadas, sem realizar alterações de produção.</p></li>
          </ol>
        </div>
      </section>

      <section id="seguranca" class="shell ap-block">
        <p class="kicker">03 / GOVERNANÇA PRIMEIRO</p>
        <h2>O que este piloto não faz.</h2>
        <ul class="ap-exclusions">${AUDIT_PILOT.excluded.map(item).join('')}</ul>
        <p class="ap-small">Sem envio de segredos ou dados privados no primeiro contato. O escopo, o tratamento de dados, as responsabilidades e as condições comerciais precisam ser aprovados antes de qualquer acesso. O executor não aprova a própria entrega.</p>
      </section>

      <section id="conversa" class="ap-cta">
        <div class="shell ap-block">
          <p class="kicker">04 / SOLICITE UMA CONVERSA</p>
          <h2>Vamos avaliar se seu projeto se encaixa.</h2>
          <p>O piloto tem disponibilidade, prazo e preço definidos por proposta individual. O contato abaixo abre um canal humano e <strong>não realiza pagamento nem contratação automática.</strong></p>
          <div class="ap-actions">
            <a class="button primary" href="${CONTACT}" target="_blank" rel="noopener noreferrer">Conversar sobre o piloto ↗</a>
            <a class="button" href="${SYSTEMS}" target="_blank" rel="noopener noreferrer">Conhecer a XPeX ↗</a>
          </div>
          <p class="ap-small">Na primeira mensagem, informe apenas o tipo de projeto, o objetivo e a forma preferida de contato. Não envie tokens, senhas, dados de clientes ou códigos privados sem um processo autorizado.</p>
        </div>
      </section>
    </main>
    <footer class="shell ap-footer">XPeX Systems AI · GXEON Audit Engineer · Solicitações sob avaliação · Build. Verify. Prove.</footer>
  `;
}

export function maybeRenderAuditPilotPage(app, search) {
  const params = new URLSearchParams(search);
  if (params.get('view') !== 'audit-pilot') return false;
  document.title = 'GXEON Audit Engineer — Piloto supervisionado | XPeX Systems AI';
  app.innerHTML = auditPilotMarkup();
  return true;
}
