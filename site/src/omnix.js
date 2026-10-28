// Committed portable runtime instructions; public hosting remains pending an identified XPeX host.
export const OMNIX_INSTALL_URL = 'https://github.com/xpex-systems-ai/GXEON-AI/blob/5432b1d3a8423e81b1be3a915edb828de64f70e0/deploy/self-hosted/README.md';

export function omnixEntry() {
  return `<section class="xp-shell xp-section ox-entry"><p class="xp-kicker">OMNIX AI / CONFIGURATION INTEGRITY AUDIT</p><h2>Da configuração<br/><em>à evidência.</em></h2><p>Conheça o produto de auditoria da XPeX. Um arquivo vercel.json, duas verificações estáticas e um relatório rastreável.</p><a class="xp-button xp-gold" href="/?view=omnix">Conheça o OMNIX <span aria-hidden="true">→</span></a><p class="xp-small-note">Prévia de engenharia · Dados sintéticos · Abertura a clientes pendente</p></section>`;
}
export function omnixPage() {
  const demo = `<a class="xp-button xp-gold" href="#omnix-example">Explorar exemplo sintético →</a>`;
  return `<section class="ox-hero"><p class="xp-kicker">XPeX SYSTEMS AI / OMNIX AI</p><span class="xp-pill">Prévia controlada · Somente dados sintéticos</span><h1>Inteligência e Auditoria<br/><em>para Sistemas Digitais.</em></h1><p class="ox-lead">Analise configurações digitais, identifique achados técnicos e acompanhe evidências em um ambiente organizado.</p><div class="xp-actions">${demo}<a class="xp-button" href="#omnix-request">Solicite uma auditoria</a></div><p class="xp-small-note">Motor GXEON Audit OS · Runtime portátil para infraestrutura controlada pela XPeX. Publicação em domínio próprio pendente. Envie somente dados de teste nesta etapa.</p></section>
  <section class="xp-section"><p class="xp-kicker">ESTADO DA PRÉVIA</p><h2>O que você pode abrir hoje.</h2><p><strong>Página e exemplo sintético disponíveis.</strong> O portal integrado com resultados persistidos ainda não está publicado em um endereço confirmado. Login online, envio de arquivos e histórico remoto aguardam essa ativação. Não envie arquivos de empresas nesta página.</p><p>O exemplo abaixo explica achados e evidências de teste. Ele não cria uma auditoria nem representa resultados da sua sessão.</p></section>
  <section class="xp-section"><p class="xp-kicker">CONTROLE DA OPERAÇÃO</p><h2>Seu host.<br/><em>Seu núcleo de auditoria.</em></h2><p>Portal e API podem executar juntos com Node24 e PostgreSQL17 privado, HTTPS, papéis restritos e relatório exportável. O núcleo não exige conta Railway, Vercel ou chave de IA. O pacote inclui Compose e opção standalone para servidor próprio.</p><p>Software aberto, hardware, rede e DNS continuam necessários. A instalação atual usa identidades sintéticas; a operação pública e a abertura a clientes aguardam validação do servidor, revisão humana e aceite operacional. Outros módulos do ecossistema seguem seus contratos e dependências existentes.</p><details><summary>Informações para a equipe técnica</summary><p><a class="xp-link" href="${OMNIX_INSTALL_URL}" target="_blank" rel="noreferrer">Instruções de instalação independente →</a></p></details></section>
  <section class="xp-section"><p class="xp-kicker">DISPONÍVEL NO NÚCLEO ATUAL</p><h2>Escopo pequeno.<br/><em>Entrega verificável.</em></h2><div class="xp-three">${[
    ['01 / ENTRADA','Um vercel.json','Configuração sanitizada, autorização explícita e tamanho limitado. Não buscamos URLs nem arquivos privados.'],
    ['02 / VERIFICAÇÃO','Dois checks estáticos','Conflito específico entre fallback SPA e rewrite de API; presença de declarações globais de CSP e X-Content-Type-Options.'],
    ['03 / EVIDÊNCIA','Um relatório rastreável','Casos, achados, evidências, revisão e exportação JSON. Hashes ajudam a conferir integridade, sem certificação ou assinatura independente.']
  ].map(([n,title,copy])=>`<article class="xp-card"><p class="xp-kicker">${n}</p><h3>${title}</h3><p>${copy}</p></article>`).join('')}</div></section>
  <section class="xp-section ox-process"><p class="xp-kicker">DO ESCOPO AO RELATÓRIO</p><h2>Uma auditoria, em quatro passos.</h2><ol>${['Entre com uma identidade de teste autorizada.','Envie a configuração sintética e confirme o escopo.','Execute as verificações e consulte os achados persistidos.','Solicite revisão de teste distinta e exporte o relatório após o fechamento.'].map(x=>`<li>${x}</li>`).join('')}</ol></section>
  <section id="omnix-example" class="xp-section"><div class="xp-section-head"><div><p class="xp-kicker">EXEMPLO SINTÉTICO / NÃO É UMA AUDITORIA DESTA SESSÃO</p><h2>Veja o tipo de resultado.</h2></div></div><div class="xp-card"><h3>Fallback SPA antes da API</h3><p>O arquivo de exemplo declara um catch-all que envia caminhos para index.html. Esse padrão pode interceptar /api quando não há rewrite anterior reconhecido.</p><pre class="ox-code"><code>{"rewrites":[{"source":"/(.*)","destination":"/index.html"}]}</code></pre><p>Recomendação delimitada: revisar a ordem das regras e verificar o backend separadamente. Headers entregues, disponibilidade, qualidade da CSP e infraestrutura não foram medidos por esses checks.</p><button type="button" class="xp-button" data-omnix-example>Preparar exemplo JSON ↓</button><a class="xp-button" data-omnix-example-download download="omnix-exemplo-sintetico.json" hidden>Baixar exemplo JSON ↓</a><p role="status" aria-live="polite" data-omnix-example-status></p><p class="xp-small-note">Arquivo congelado de teste, idêntico ao exemplo do portal. Não representa uma auditoria desta sessão, revisão humana ou disponibilidade da API online.</p></div></section>
  <section class="xp-section xp-two-paths"><article class="xp-card"><p class="xp-kicker">DADOS E LIMITES</p><h2>Controle desde a entrada.</h2><p>A prévia usa identidades sintéticas e não abre cadastro empresarial. Envie somente vercel.json de teste sem tokens, senhas, dados pessoais ou conteúdo de clientes. Limites: 16.000 caracteres de configuração e corpo de requisição de até32KB.</p><p>O portal informa falhas, estado do backend e revisão. Um exemplo estático nunca substitui resultados persistidos. Acesso real, retenção, revogação, suporte e contrato dependem da aprovação de abertura.</p><a class="xp-link" href="/?view=privacy">Política institucional de privacidade →</a></article><article class="xp-card"><p class="xp-kicker">O PRÓXIMO HORIZONTE</p><h2>Universal na visão.<br/>Delimitado hoje.</h2><p>Sites, APIs, infraestrutura, redes sociais, e-commerce, agentes, Mercado Livre e MCP fazem parte do roadmap. Não estão disponíveis como verificações do MVP atual.</p><p>Não oferecemos pentest, auditoria universal, certificação de segurança ou garantia de resultados comerciais. A prévia integrada com login, banco e exportação online aguarda a definição do servidor autorizado. O exemplo nesta página permanece disponível.</p></article></section>
  <section id="omnix-request" class="xp-section"><p class="xp-kicker">PRIMEIRA OFERTA CANDIDATA</p><h2>Configuration Integrity Audit.</h2><p>Um arquivo sanitizado, dois checks, achados, evidências e relatório. Escopo, aceite, prazo, revisão, suporte e pagamento precisam ser acordados antes da execução comercial. Preço sob aprovação; nenhuma cobrança automática.</p><div class="xp-card"><h3>Prepare uma conversa empresarial.</h3><p>Este formulário prepara um rascunho somente no seu navegador. Não envia um pedido, cria contrato ou registra pagamento.</p><form data-omnix-request><label for="omnix-kind">Objetivo</label><select id="omnix-kind" name="kind"><option>Solicitar auditoria</option><option>Solicitar proposta empresarial</option></select><label for="omnix-scope">Escopo pretendido, sem dados privados</label><textarea id="omnix-scope" name="scope" maxlength="1000" required placeholder="Descreva apenas a necessidade geral; não cole configurações ou credenciais."></textarea><button class="xp-button xp-gold" type="submit">Preparar rascunho →</button></form><pre data-omnix-draft class="ox-code" hidden></pre><p data-omnix-receipt role="status" aria-live="polite"></p><a class="xp-link" href="/?view=company#contact">Consultar o canal institucional →</a></div><div class="ox-commercial">${['SOLICITAÇÃO RECEBIDA — somente após confirmação da equipe','PROPOSTA PENDENTE — escopo e condições em análise','CONTRATO ACORDADO — após aceite das partes','PAGAMENTO CONFIRMADO — somente com comprovante'].map(t=>`<p>${t}</p>`).join('')}</div></section>`;
}
export function initOmnixRequest(root = document) {
  const prepare = root.querySelector('[data-omnix-example]');
  if (prepare) {
    const link = root.querySelector('[data-omnix-example-download]');
    const receipt = root.querySelector('[data-omnix-example-status]');
    let url;
    prepare.addEventListener('click', async () => {
      if (prepare.disabled) return;
      prepare.disabled = true;
      link.hidden = true;
      if (url) { URL.revokeObjectURL(url); url = undefined; }
      receipt.textContent = 'Conferindo o exemplo congelado de teste…';
      try {
        const response = await fetch('/examples/omnix-synthetic-report.json', {cache:'no-store',signal:AbortSignal.timeout(10000)});
        if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw new Error('EXAMPLE_UNAVAILABLE');
        const text = await response.text();
        if (new TextEncoder().encode(text).length > 16384 || JSON.parse(text)?.report?.testData !== true) throw new Error('EXAMPLE_INVALID');
        url = URL.createObjectURL(new Blob([text], {type:'application/json'}));
        link.href = url;
        link.hidden = false;
        receipt.textContent = 'Exemplo de teste preparado. Use o link para baixar; não é uma auditoria desta sessão.';
      } catch {
        link.removeAttribute('href');
        receipt.textContent = 'O exemplo não pôde ser preparado. Tente novamente; nenhum resultado de auditoria é declarado.';
      } finally { prepare.disabled = false; }
    });
  }
  const form = root.querySelector('[data-omnix-request]');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const values = new FormData(form), scope = String(values.get('scope') ?? '').trim().slice(0,1000);
    const draft = root.querySelector('[data-omnix-draft]');
    draft.textContent = `RASCUNHO LOCAL — NÃO ENVIADO\nOMNIX AI — ${values.get('kind')}\nEscopo: ${scope}\nAguardar proposta, contrato e instruções antes de enviar qualquer configuração.`;
    draft.hidden = false;
    root.querySelector('[data-omnix-receipt]').textContent = 'Rascunho preparado. Nada foi enviado ou contratado. Use o canal institucional para iniciar a conversa.';
  });
}
