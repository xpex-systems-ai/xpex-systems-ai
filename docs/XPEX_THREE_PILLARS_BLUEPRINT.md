# XPeX Systems AI — Blueprint de Integração dos Três Pilares
**Versão:** 1.0 • **Snapshot:** 15/11/2026 • **Estado:** proposta de arquitetura em revisão (não é prova de SSO, integração bidirecional ou produção liberada)

## Manifesto
**Uma empresa. Três portas. Uma cadeia de valor com evidências.**

A XPeX Systems AI não é uma coleção de 100 sites. É uma empresa de engenharia de sistemas de IA que converte necessidades em soluções verificáveis, conhecimento em habilidade, habilidade em projeto e projeto em resultado demonstrável.

- **XPeX Systems AI — vitrine pública:** quem somos, o que resolvemos, como contratar e quais sistemas podem ser inspecionados.
- **Portfólio / Radar / Evidence OS — cadeia da verdade:** cada afirmação tem fonte, data, status, responsável e evidência; oportunidades não são contratos; contratos não são receita.
- **XPeX Academy — fábrica de capacidades:** professores e alunos aprendem, criam projetos e geram conquistas acadêmicas comprováveis, com consentimento para exportação de evidências.

**GXEON** é a camada transversal de orquestração, tarefas, políticas e integrações assistidas. **XPeX Systems Command** é o inventário canônico da empresa. **XAGF** define os gates de risco e promoção. Nenhum deles deve virar uma segunda base com senhas, matrículas ou pagamentos duplicados.

## Links e estados auditados
| Sistema | Endereço | Observação de 15/11/2026 |
| --- | --- | --- |
| Institucional | https://xpex-systems-ai.vercel.app | HTTP 200, menus e links públicos navegáveis no navegador; deploy corporativo READY |
| Portfólio privado no ChatGPT | https://xpex-portfolio-evidencias.juniorsenax.chatgpt.site/cases | Site exige ChatGPT sign-in antes de revelar cases; plugin privado XPeX disponibiliza consulta de cases, radar e Cash Engine |
| Portfólio Vercel separado | https://xpex-evidence-portfolio.vercel.app | Implantação READY, mas SSO da própria Vercel bloqueia navegação pública |
| Academy / Polo Kelle no preview | https://xpex-academy-mmpzzek1w-xpex-neural.vercel.app/academia | Vercel READY, formulário Supabase Auth aberto; **login, matrícula e progresso autenticados ainda não homologados** |
| Fonte oficial Academy | https://github.com/xpex-systems-ai/XPEX-ACADEMY | Branch padrão dev; PR #254 de migração continua draft até revisão |
| Fonte oficial da empresa | https://github.com/xpex-systems-ai/xpex-systems-ai | Site corporativo Vite + catálogo técnico/evidências |
| Company Intelligence | https://github.com/xpex-systems-ai/xpex-systems-command | Fundamento de registry em staging; produção empresarial ainda requer identidade/RBAC/segredos e revisão |
| GXEON runtime | https://github.com/xpex-systems-ai/GXEON-AI | Manual-first, preview-first, sem reivindicar autonomia irrestrita |

Dados de ferramentas conectadas em 15/11:
- Corporate README registra **1 verified live system e 1 verified staging** em seu registry público, não todos os projetos históricos;
- Corporate inventário histórico consolida **103 projetos Vercel observados → 20 linhagens relevantes → 10 sistemas → 5–7 superfícies flagship**; não transformar projetos em produtos ou clientes;
- Plugin de Portfólio tem casos Academy, Plugin Factory e AgentOS com fontes; Radar comercial/vagas existe; Cash Engine consultado: **1 missão em prospect, 2 candidatas, 0 recebimentos conciliados, Pix/Base/Stripe ainda não configurados nesse motor**;
- Supabase dedicado da Academy permanece no plano gratuito; banco piloto separado contém Polo, curso e aula de validação, mas não é importação do PostgreSQL histórico;
- Projeto Academy antigo na Railway está suspenso por término do teste; volumes de PostgreSQL, Redis e mídia registrados, integridade e extração ainda não verificadas. Não pagar nem descartar os volumes sem decisão explícita.

## Blueprint lógico
```text
                  VISITANTE / ALUNO / EMPRESA / PARCEIRO
                                   |
                XPeX Systems AI — Institucional Público
                    /serviços  /sistemas  /confiança
                       |                   |
               PORTFÓLIO + RADAR         ACADEMY
               cases + Evidence OS      aluno + Polo Kelle
               ofertas + Cash Engine    cursos + progresso
                       |                   |
                Evidence Graph <--- aprovação/consentimento
                       |
             XPeX Systems Command (registro canônico)
                       |
          GXEON (orquestração limitada + provas)
                       |
        GitHub · Vercel · Supabase · Firebase · MCP
```

Importante: **as setas entre Portfólio e Academy representam arquitetura-alvo, NÃO sincronização já comprovada.**

## Três contratos de integração (futura implementação com provas)
1. **Company → Portfolio:** website apresenta somente registros PUBLIC_APPROVED com URL canônica, fonte, timestamp, commit, deploy, estado de verificação e data de revisão. Não expor segredos, valores financeiros privados ou dados acadêmicos.
2. **Academy → Portfolio:** um aluno autenticado e autorizado escolhe projeto ou certificado e aprova uma exportação minimizada, sem dados sensíveis. O destino armazena `case_id`, `artifact_ref`, `issuer`, `verified_at`, `visibility`, `consent_ref`, versão e status; não copia as credenciais nem funde contas por e-mail.
3. **Radar → Cash Engine:** oportunidade verificada → qualificação → proposta revisada → contratação aceita → execução e prova → aceite humano → conciliação. Sem contrato e comprovante, valor de receita é zero/não comprovado. Não iniciar serviço antes de contratação.

Exemplo **somente de contrato futuro** (não há endpoint autorizado implantado para isso):
```json
{
  "eventType": "academy.project.evidence_submitted",
  "eventVersion": "1.0",
  "sourceSystem": "xpex-academy",
  "sourceId": "opaque-signed-id",
  "caseId": null,
  "visibility": "private_pending_review",
  "consentRef": "opaque-consent-id",
  "evidenceUri": "authorized-private-location",
  "verification": "pending",
  "occurredAt": "ISO-8601"
}
```

## Identidade e governança
- **NÃO existe SSO unificado** entre o login ChatGPT Site, o login Supabase Academy e a proteção Vercel do Portfólio; usar OAuth/OIDC padronizado somente com provedor autorizado e conta verificada.
- **Não transportar cookie, token ou senha** de um domínio para outro; não inferir que duas contas com o mesmo e-mail pertencem à mesma pessoa sem prova e consentimento.
- Aluno/professor/admin por tenant; deny-by-default, RLS, JWT seguro, trilha de auditoria, LGPD, atenção a dados de menores.
- Área pública recebe só projeção sanitizada dos registros internos. Banco acadêmico pertence à Academy; contratos/recebimentos pertencem ao Cash Engine; fonte da verdade de código é GitHub.
- Pagamentos exigem processamento por prestador autorizado, webhooks verificados, refund/chargeback e conciliação antes de divulgação comercial.
- Modelo de governança: G0 descoberta → G1 identidade → G2 autorização/dados → G3 supply chain → G4 runtime → G5 agentes → G6 produção → G7 publicação/comercialização.
- Agentes não aprovam suas próprias entregas nem podem movimentar dinheiro ou disparar ações externas sem autorização.

## Roadmap e critério de vitória
**P0 — Navegação unificada (nesta PR, revisão pendente):** seção de 3 portas no site institucional, links validados, estados rotulados, nenhum SSO inventado. Critério: testes de site e revisão humana; deploy corporativo só após merge aprovado.

**P1 — Primeira aula real no Polo Kelle:** registro de identidade autorizado e canal de e-mail funcional; matricular usuário sintético, abrir aula original e provar que progresso persiste após novo login; testar isolamento RLS. Sem dados dos alunos antigos até recovery.

**P2 — Registro de evidências da Academy:** um projeto sintético revisado por humano, vínculo à fonte no Portfólio, registro de consentimento, hash/versão e estado PRIVATE → REVIEWED → PUBLIC_APPROVED. Não criar relação automático em produção.

**P3 — Conversão comercial B2B:** CTA da vitrine → consulta → briefing → orçamento → aceite → entrega auditada → comprovante de pagamento no Cash Engine. Prospecção direta, sem afirmar cliente ou receita antes da prova.

**P4 — Expansão:** SDK/API com OpenAPI+MCP bounded e três superfícies (web/ChatGPT/app Android). ChatGPT Site login não prova elegibilidade para Sign in with ChatGPT em domínios externos; Academy como plugin exige capacidades do provedor e permissões adequadas.

## Modelo de monetização sem prometer receita
- **Agora:** auditoria técnica B2B, correções assistidas, integração de APIs/MCP, implantação de agentes; vendas com escopo, aceite e pagamento contratados.
- **Após E2E acadêmico:** cursos e polos de assinatura sob consentimento, gestão e suporte; nenhum preço/receita declarado até contratação.
- **Depois:** serviços por execução de agentes e API, royalties/creator economy, marketplace; isolados de dados dos alunos e com rate limits e monitoramento.

## Três decisões que destravam a empresa
1. Manter **uma marca e um site oficial** com links verificáveis e estados coerentes, não dezenas de projetos apresentados como produtos.
2. Completar **uma matrícula sintética com progresso persistido** na Academy sem custo de Railway; integrar Firebase/IA em seguida, não antes.
3. Encadear **um único serviço comercial contratado B2B e uma prova de recebimento** no Cash Engine; não converter prospect em receita fictícia.

## Auditoria e limites de execução desta PR
- Alteração proposta é navegação pública e documentação/registry estático. Não há alteração de banco, usuários, auth, tokens, DNS, deploy de produção nem pagamento.
- Este blueprint **não** substitui a análise de segurança externa nem promove serviços não verificados a produção.
- Revisão, CI, preview e aprovação humana são obrigatórios antes do merge.
