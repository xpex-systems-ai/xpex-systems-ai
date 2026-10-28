# GX040 — solicitação comercial com recibo verificável

Estado: **código preparado, receptor remoto e canal humano ainda não comprovados**. Sem produção, contato externo, contrato, cobrança, CRM inventado ou arquivo de cliente. O formulário local anterior e o exemplo congelado permanecem disponíveis. A oferta candidata passa a ser apresentada como **OMNIX Audit Express — Configuration Integrity**; a hipótese anterior de R$490 continua em minuta e exige aprovação do fundador, com revisão de esforço, margem, prazo e responsabilidade humana.

## Caminho implementado

`formulário sintético → /api/omnix-request (Vercel) → /api/omnix-commercial (backend canônico) → PostgreSQL → inbox do responsável autorizado`.

Não há banco separado no site. O proxy valida uma origem pública exata configurada no servidor; Host, X-Forwarded-Host, token do navegador e IDs de organização não concedem autoridade. A URL do backend, seu Origin técnico e seu token são exclusivamente configuração do servidor. Redirects externos são recusados. A ausência de configuração responde503 e mantém o novo formulário desabilitado.

O novo formulário recebe nome, empresa, e-mail, necessidade geral e consentimento com versão de aviso; não recebe upload. Nesta fase, nomes/empresas devem começar com `TEST DATA ` e o contato deve terminar em `@example.invalid`, além de `testData:true`. Não existe flag nesta entrega que aceite interessados reais. Esses marcadores reduzem entrada acidental; não constituem verificação de identidade ou mecanismo infalível para detectar dados pessoais.

No servidor, os campos são limitados e validados novamente. Honeypot, limite de corpo4KB, limite de concorrência, quota global por processo, origem exata e recusa de padrões comuns de segredo/configuração protegem o intake. A detecção é limitada e não garante sanitização universal. Dados são gravados por SQL parametrizado com consentimento, destino definido no servidor e identificador idempotente. O navegador não envia prompt/organização como autorização.

## Registro não é recebimento humano

- `QUEUED`: houve commit no PostgreSQL e existe recibo; ninguém é declarado como tendo lido ou aprovado.
- `ACKNOWLEDGED`: um principal autenticado, autorizado como owner/admin e igual ao destinatário configurado, confirmou aquele recibo. Não significa contrato, aceite da auditoria, pagamento ou autenticação do interessado.
- Erro/timeout/HTML/contrato inválido: o proxy não declara envio nem recebimento. Retry com os mesmos campos usa o mesmo requestId; mudança de conteúdo com o mesmo ID é409.

GET/status exige token técnico antes de verificar SQL; probe de cinco segundos compartilhado sem enfileirar trabalho concorrente. `configured` e `persistenceReady` são distintos de verificação de entrega humana. Nenhum nome, e-mail, problema, token, header ou erro bruto é incluído nos recibos públicos/logs deste módulo.

A inbox é privada. Consulta e ACK exigem principal derivado pelo backend a cada request; destinatário e organização vêm da configuração e das permissões, não do corpo ou cabeçalhos arbitrários. O mesmo dono em outra organização e outro admin sem delegação são negados. A lista retorna no máximo25registros do destino autorizado.

Dados sintéticos expiram para consulta em14dias. A operação de descarte existente só remove registros sintéticos já expirados do responsável autorizado, com confirmação explícita. Nenhum cron foi criado; o agendamento/operador e a política definitiva ainda precisam ser aprovados. Não afirmar que o dado foi apagado apenas porque ficou invisível após a expiração.

## Integração para o operador

Site: `OMNIX_COMMERCIAL_ENABLED`, `OMNIX_COMMERCIAL_BACKEND_ORIGIN`, `OMNIX_COMMERCIAL_PUBLIC_ORIGIN`, `OMNIX_COMMERCIAL_PROXY_TOKEN`. Nenhum desses valores foi configurado remotamente nesta tarefa.

Backend: montar `omnixCommercialRouter` em `/api/omnix-commercial`, com serviço usando a mesma conexão PostgreSQL autorizada, token técnico distinto e `authorizeInbox` fornecido pela autenticação empresarial. O Origin técnico é o origin aprovado do backend; a origem do navegador é validada pelo proxy e não é encaminhada como autoridade.

Schema: `lib/db/drizzle/0004_omnix_commercial_intake.sql`. Privilégios mínimos adicionais somente sobre `omnix_commercial_requests`: SELECT, INSERT, UPDATE de `delivery`/`acknowledged_at`; DELETE somente para o procedimento de expiração sintética. Não ampliar privilégios das tabelas de auditoria.

Rotas canônicas: GET `/status`, POST `/requests`, GET `/inbox`, POST `/requests/:receiptId/ack`, POST `/inbox/purge-expired`. As três últimas exigem autenticação/autoridade do destinatário; o token técnico do proxy não abre a inbox. Não há e-mail, proposta ou mensagem automática.

## Testes e limitações

Testes específicos em `site/tests/omnix-commercial.test.mjs` e `artifacts/api-server/src/tests/auditCommercial.test.ts`: configuração ausente, origem forjada, limites/honeypot/segredos, recibo incoerente, sanitização de erro, idempotência concorrente, inbox/ACK entre destinos, expiração e descarte restritos, prontidão com autenticação e cache. O branch SQL usa PGlite local e PostgreSQL17 quando `TEST_AUDIT_DATABASE_URL` é fornecida no ambiente isolado de testes. Fixtures de principal autenticado não são prova de SSO real ou canal comercial humano.

Antes da abertura real: validar destino e responsável, IdP empresarial, canal de suporte, armazenamento/backup, retenção/descarte, privacidade e termos, além de executar E2E no endereço remoto. O canal institucional publicado continua sendo a página da empresa; sua existência não comprova recebimento de mensagens. Nenhuma abordagem foi enviada a HostGator, agências, SaaS ou integradores.
