# XPeX Systems AI — decisão canônica Enterprise 2026-11-01

**Princípio:** uma empresa, um produto principal e conectores auditáveis. Não renomear demos como produtos operacionais.

## Produto e posicionamento
- **Produto principal:** **OMNIX AI** — auditoria inteligente de sistemas, APIs, agentes e configurações com evidências e revisão humana.
- **Serviço/camada:** **XPeX Connect** — engenharia de conectores de sistemas/lojas/CRM/infra para assistentes autorizados. Não é um SaaS extra.
- **Orquestração:** **GXEON** — políticas, identidades e agentes especializados, sem autoaprovação de entregas.
- **Empacotador:** **XPeX Plugin Factory** — a partir do blueprint cria manifests, MCP e pacotes de skills/CLI para revisão. Não garante publicação no marketplace ou OAuth funcional.
- **Proveniência:** **XPeX Systems Command / Evidence OS** — inventário e controles de versão/origem das provas.
- **Aquisição:** **GXEON Growth OS** — CRM Lead-Flow, Creator Commerce como conjunto de módulos de conteúdo, Postiz em serviço isolado; não ativar publicação nem leads até autenticação.

## Superfícies e política de ferramentas
| Entrada | Função | Status confirmado no código | Exigência para cliente |
|---------|--------|------------------------------|-------------------------|
| REST / OpenAPI | API para aplicações | API pública de descoberta no site | auth, docs de versão, rate limits e APIs de execução separadas |
| MCP | Agente chama ferramentas | Site expõe descoberta pública | OAuth/OIDC por cliente, RBAC, tipagem rigorosa, separação leitura/escrita |
| Plugin/Extensão | Distribuição por diretório de IA | Factory gera pacotes | revisão e compatibilidade de cada plataforma, política e publicação |
| CLI | Automação por terminal | CLI da Factory disponível em código | instalação, credenciais seguras, assinaturas/proveniência e testes |
| Skill | Instruções e comportamento de agente | Factory emite SKILL.md | revisão por runtime, prevenção de prompt injection e execução autorizada |

MCP, Plugin, CLI e Skill **não são universais**. A mesma API pode sustentar vários adaptadores. A entrada não equivale a conta conectada.

## Exemplo de primeiro serviço contratável
**Audit-Connect Pilot: GitHub** (somente leitura inicialmente).
1. Empresa contrata escopo e indica repositórios próprios; registra autorização.
2. OAuth/App GitHub com permissões mínimas e tenant seguro; token exclusivamente no cofre servidor.
3. Connector consulta apenas o inventário autorizado; **não** executa código do repositório nem visita endereços não permitidos.
4. OMNIX aplica checks permitidos e registra origem, commit SHA, timestamp, hash de prova, limitações e erros.
5. Auditor humano independente revisa; relatório exportado para o cliente com segregação de dados.
6. Evidências de aceite e pagamento entram no ledger comercial como eventos separados; não declarar receita antes da confirmação.

**Propostas de API futuras:**
- GET /v1/capabilities (descoberta pública)
- GET /v1/connectors (lista de connectors e estágios)
- POST /v1/organizations/{id}/connections (inicia OAuth autenticado, tenant do token do servidor)
- GET /v1/audits/{id} (autenticação e owner/tenant)
- POST /v1/audits (requisição permitida, idempotente, log)
- POST /v1/audits/{id}/review (revisor diferente do executor)
- GET /v1/audits/{id}/evidences (autorização, links temporários)
Essas rotas de auditoria *não estão sendo expostas por esta alteração*.

## Portfólio e produção
- O catálogo do site tem 7 sistemas; registros não significam prontidão comercial.
- Site PR #45 e galeria PR #49 são DRAFT não fundidos. Este PR para XPeX Connect sai de main e deve ser testado no preview sem promover a produção.
- LeadFlow PR #5 Growth OS é DRAFT, API Express tem CORS amplo e rotas examinadas sem auth/tenant. **Bloquear clientes reais** até P0.
- Creator-Commerce é fork Postiz AGPL-3.0; seu corredor XPeX opera com localStorage em demo, não com posting real. Manter obrigações da licença e desacoplar fornecedor.
- Supabase OMNIX AI: 14 tabelas em esquema customizado omnix_audit, todas com RLS habilitado; 9 avisos RLS sem policy. Isto tende a negar acesso sob RLS, requer arquitetura de serviço autenticado e testes de roles antes de operar.
- Dois projetos Railway GXEON acessíveis mostraram offline, última implantação FAILED (abril 2026); outras contas não cobertas por essa leitura.
- XPeX Plugin Factory possui módulos para pacote; sua disponibilidade de runtime/marketplace não foi homologada nesta verificação.

## P0 Enterprise — gates técnicos
1. Identidade: OIDC/OAuth2, organização, membros, roles, scopes, revogação, MFA administrativo.
2. Dados: isolamento de tenant, RLS/policies testadas, cifragem, backup/restore, retenção LGPD, classificação de mídias.
3. Ações: leitura padrão, confirmação antes de escrita, idempotência, limites de taxa, fila, logs imutáveis, revisor ≠ executor.
4. Integração: validação de schemas, allowlist DNS/URLs, SSRF prevention, tokens no servidor, sem segredos no frontend, webhook assinado e rotação.
5. Operação: runbooks, monitoramento, SLA realista, disponibilidade, testes E2E, incident response, controle de custo.
6. Comercial: contrato/aceite antes da execução, preço e escopo, comprovação de entrega, reconciliação de faturamento; prospecção B2B autorizada, não scraping ou spam.
7. Provas: metadados com fontes, status DATA/DOCUMENTED/DEMO/VERIFIED e data da observação; não alegar certificação externa.

## Go-to-market (sequência)
- **Semana 1:** nomenclatura única; consertar auth/RLS críticos; selecionar repositório GitHub de demonstração sintética.
- **Semana 2:** teste de conector GitHub read-only e relatório OMNIX revisado; vídeo de demonstração no Evidence Lab.
- **Semana 3:** empacotar um MCP de consulta read-only via Plugin Factory para instalação privada e revisão.
- **Semana 4:** Growth OS com CRM protegido e um canal Postiz autorizado para publicação mediante aprovação; pipeline de contatos legítimos, formulários com consentimento.
- **Investidores:** pitch deck, repositórios e demos verificáveis, roadmap/custos, captação distinta de vendas e sem alegar faturamento inexistente.

## Ordem de merge
1. PR do site institucional e documentação XPeX Connect (este PR).
2. Revisar e homologar PR #45 e PR #49, resolver conflitos e aceitar apenas após testes.
3. PR #5 Growth OS só depois de integração com autenticação e isolamento de dados (ou mantê-lo como protótipo privado).
4. Produção de conectores/automações apenas após gates P0.

**Responsabilidades:** GXEON coordena propostas; fundador decide contratos/gastos/publicações; aplicações aplicam permissões de fato. Não pressupor que toda IA, sistema ou loja suporte as mesmas entradas.
