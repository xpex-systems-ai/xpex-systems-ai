# GX-05.0 — entrada separada de leads

Estado desta entrega: **fundação preparada; coleta real desligada; aprovação do canal e operação pendentes**. Os testes usam contatos fictícios e referências TEST DATA. Um ensaio com o formato de contato real não demonstra um cliente real, leitura humana, banco remoto ou aprovação comercial.

## Limite de dados e finalidade

A entrada recebe somente nome do contato, empresa, e-mail, tipo de necessidade e descrição geral (até 1.000 caracteres), com consentimento e versão de aviso. Não recebe arquivo, vercel.json, credencial, configuração, alvo técnico ou dados financeiros. Campos extras, autoridade, destinatário, organização, assinatura e pagamento enviados pelo cliente são recusados. Segredos/configurações reconhecíveis são recusados; a instrução de não enviar dados de terceiros continua necessária.

Leads residem em `omnix_leads`, no mesmo PostgreSQL canônico. Não são casos, evidências técnicas ou resultados de auditoria. O formulário local, exemplo congelado e intake sintético GX040 continuam separados. `leadDataAllowed` jamais implica `auditCustomerDataAllowed`; este último permanece `false` neste contrato. Nenhuma flag deste módulo abre arquivos reais no Audit OS.

## Gates de abertura

O padrão do router e proxy é HTTP503/`LEAD_ADMISSION_CLOSED`. Nenhum canal é criado pela migration `0005_omnix_lead_intake.sql`. O papel da aplicação pode somente **ler** `omnix_lead_channels`; não pode criar, alterar ou aprovar seu próprio canal.

Antes da abertura, o fundador e a operação devem revisar e registrar:

1. ID de canal e modo explícito (`synthetic` ou `real`); `off` sempre recusa admissão.
2. Destinatário institucional exato, organização e vínculo atual owner/admin no banco canônico. O adaptador do runtime resolve esses registros ativos a cada operação; um nome no ambiente não comprova titularidade ou acesso.
3. Referências verificáveis de aprovação do fundador e do destinatário, com data e validade de até 90 dias.
4. Aviso de privacidade específico desta entrada, versão `gx050-lead-v1`, URL HTTPS institucional exata e referência de revisão aprovada. Identificar o controlador institucional efetivo, finalidade, base legal avaliada, contato para direitos dos titulares, retenção e procedimento de exclusão. O aviso institucional genérico não deve ser presumido suficiente. Código, consentimento ou checkbox não certificam conformidade com LGPD ou outra norma.
5. Referência de banco durável aprovado, com operação, restore, retenção e acesso definidos. Uma fixture PGlite, um segredo ou um healthcheck não é prova de durabilidade remota.
6. Aprovação explícita da proteção institucional contra abuso. Ela usa challenge de uso único, idade mínima de 2s, validade de 5min, hash persistido, honeypot vazio e orçamento compartilhado de 8 challenges/minuto/canal. Não é CAPTCHA nem prova de identidade. Se a avaliação de abuso exigir CAPTCHA, mantenha o canal fechado até integrar e testar o mecanismo aprovado.
7. Origem pública e backend HTTPS exatos, token exclusivo no servidor e autorização live do inbox. Não reutilizar token do operador, revisor, intake sintético ou sessão do cliente.

A aplicação não insere essa aprovação. A equipe registra o canal pelo processo administrativo aprovado, usando referências existentes e sem inventar aprovações. O runtime compara seu modo explícito ao modo persistido. O proxy consulta prontidão antes de ler dados de contato e usa cache de cinco segundos; o backend repete os gates nas mutações. Revogação de identidade/destinatário ou expiração do canal fecha novas admissões. A consulta pública nunca apresenta `humanDeliveryVerified:true`.

## Contratos e integração

Backend: `artifacts/api-server/src/omnixLeadIntake.ts`, `omnixLeadIntakeRouter.ts`. Reutiliza a conexão canônica injetada; não cria banco, pool externo ou SDK de comunicação.

`createLeadIntakeService(connect, {channelId, mode, resolveRecipient, resolveEvidence?})`: o resolver de destinatário consulta identidade/vínculo atual e retorna somente o owner/admin exato. O resolver de evidência é opcional e permanece ausente até existir um verificador autorizado de registros e revisão humana. Sem ele, avanços comerciais falham com HTTP503.

| Endpoint backend | Autoridade | Resultado |
|---|---|---|
| GET `/api/omnix-leads/status` | Token técnico de servidor | Gates e persistência, sem dados de contato |
| POST `/api/omnix-leads/challenge` com `{}` | Token técnico e origem exata | Challenge real persistido, sem dados pessoais |
| POST `/api/omnix-leads/requests` | Token técnico, origem, challenge e consentimento | Recibo somente após COMMIT; idempotência por requestId/payload |
| GET `/api/omnix-leads/inbox` | Principal enterprise validado e destinatário exato | Até 25 leads não expirados |
| POST `/api/omnix-leads/requests/:id/ack` | Mesmo destinatário owner/admin | ACK persistido; não prova leitura humana |
| POST `/api/omnix-leads/requests/:id/state` | Mesmo destinatário e resolver de evidências | Próximo estado com referência humana validada |
| POST `/api/omnix-leads/inbox/purge-expired` | Mesmo destinatário e confirmação explícita | Exclusão e recibo SQL verificável |

Proxy: `site/api/omnix-lead.js`, GET para prontidão e POST com `action:challenge` ou `action:request`. Só chama o backend fixado no servidor; não aceita URL, destinatário, organização ou Authorization do navegador. Não segue redirects, não usa Host/forwarded como autoridade, limita corpo a 4KiB/5s e resposta a 8KiB. Orçamento local: 20 requisições/minuto/processo, até duas simultâneas. A quota SQL de challenges também limita múltiplos processos. JSON, origem e body fields são estritos. Erros privados são substituídos por códigos seguros.

Variáveis do proxy, somente nomes: `OMNIX_LEAD_ENABLED`, `OMNIX_LEAD_MODE`, `OMNIX_LEAD_BACKEND_ORIGIN`, `OMNIX_LEAD_PUBLIC_ORIGIN`, `OMNIX_LEAD_PROXY_TOKEN`. Nenhum segredo usa prefixo VITE ou vai para frontend/logs. O runtime backend recebe token/origem/modo/ID pelo contrato de configuração central revisado; o registro persistido e os resolvers são obrigatórios além da configuração.

## Privilégios mínimos novos

| Tabela | Privilégios da aplicação |
|---|---|
| `omnix_lead_channels` | SELECT; nenhum INSERT/UPDATE/DELETE |
| `omnix_lead_challenges` | SELECT/INSERT/UPDATE/DELETE; lock transacional de orçamento |
| `omnix_leads` | SELECT/INSERT/DELETE; UPDATE apenas delivery, acknowledged_at, commercial_state |
| `omnix_lead_events` | SELECT/INSERT; nenhum UPDATE/DELETE direto |
| `omnix_lead_purge_receipts` | SELECT/INSERT/DELETE para expiração de recibos |

Esses grants não modificam `audit_*`, financeiro ou credenciais de outros produtos. A exclusão de lead expirado elimina seus eventos pela FK CASCADE. A migration é aditiva; não altera dados de auditoria nem semeia canal real. O lock compartilhado de orçamento exige UPDATE ou DELETE na tabela de challenges, conforme a [documentação PostgreSQL17 de LOCK](https://www.postgresql.org/docs/17/sql-lock.html); não exige UPDATE na configuração de canais.

## Retenção e descarte verificável

Contato e descrição expiram em **30 dias** após criação. Mudança de estado não estende esse prazo. Leads expirados saem do inbox e não avançam de estado. O proprietário pode executar purge mesmo com admissão desligada; sua identidade/vínculo atual continua obrigatório.

O purge requer `{confirmLeadRetentionPurge:true, reviewReference:REFERENCIA_OPACA_APROVADA}`. Em uma transação: exclui leads expirados do canal e seus eventos, verifica que restam zero expirados e persiste um recibo com UUID, contagem e instante. Não guarda IDs, nomes ou e-mails dos leads excluídos. Recibos operacionais expiram em 90 dias e são removidos em execução posterior da rotina. Challenges expirados também são descartados. O recibo comprova exclusão nesse banco ativo; não comprova descarte de backups, logs de infraestrutura ou arquivos externos.

**Não há agendamento automático nesta entrega.** Antes de habilitar modo real, designar responsável e frequência para purge, tratamento de backups, solicitações de exclusão e incidentes. Não publicar promessa de apagamento automático enquanto isso não estiver implementado. Contratos/comprovantes não são armazenados neste intake: precisam de arquivo institucional aprovado e política própria antes de transações reais; o módulo guarda referências e não substitui esse arquivo.

## Estados e verificação

Sequência proposta: `leadReceived → proposalPrepared → contractSigned → accessAuthorized → auditInReview → reportDelivered → clientAccepted → paymentConfirmed`. `leadReceived` decorre de persistência do contato e não de leitura humana. ACK do inbox é um fato separado.

Cada avanço exige principal autorizado, próximo estado exato e um resolver de evidência que lê registro canônico/operacional já existente, confere escopo, SHA256, tipo de prova e referência de revisão humana autorizada. A entrada aceita somente IDs e referência opaca; booleans `signed`, `paid` ou `verified` são recusados. Eventos são append-only. Assinatura, liquidação bancária, consentimento do cliente e entrega humana não são verificados automaticamente por esta fundação. Um resolver sintético de testes não pode ser usado para liberar operações reais.

## Evidências de testes

`site/tests/omnix-lead.test.mjs` cobre padrão fechado, corpo não lido sem prontidão, origem forjada, validação, limites, timeout, challenge/recibo e ausência de vazamento. `artifacts/api-server/src/tests/auditLeadIntake.test.ts` cobre contratos separados, autorização HTTP, SQL/idempotência, challenge de uso único, isolamento, estados/evidência e purge. O teste usa PostgreSQL17 isolado quando `TEST_AUDIT_DATABASE_URL` aponta para o banco local `gx01_test`; caso contrário usa PGlite com transações serializadas. Nenhum contato real é necessário. Resultados executados pertencem à matriz de validação desta entrega; preparação de código não equivale a sucesso remoto ou aprovação humana.
