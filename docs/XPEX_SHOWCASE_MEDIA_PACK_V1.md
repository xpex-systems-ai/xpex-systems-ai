# XPeX Showcase Media Pack V1

A base remota foi o merge da [PR #58](https://github.com/xpex-systems-ai/xpex-systems-ai/pull/58) em `ba20c129c4385ed653551dc549fc468b94349b06`. O inventário inicial encontrou seis trilhos, quatro capturas com revisão de privacidade e símbolos oficiais para os demais produtos.

O pacote aplica capas 16:9 a sistemas, agentes e documentos e preserva a navegação e os dados de status existentes. As capas WebP são derivadas da marca ou das capturas revisadas de Audit OS, Studio AI, Wallet público e entrada Academy. Os perfis técnicos continuam oferecendo a captura de origem. O Support Agent é conceitual. GX Evidence Concierge e Enterprise Evidence Concierge apontam para o mesmo GX Neural Copilot.

Para atualizar o pack, verificar a URL pública sem autenticação, revisar privacidade, registrar captura, ambiente e alterações no registro de evidências e adicionar a origem em `site/scripts/build-showcase-media.mjs`. Em `site/`, executar `node scripts/build-showcase-media.mjs` com Chromium do Playwright ou `SHOWCASE_CHROME_CHANNEL=chrome`. Conferir os WebP, o registro e os testes antes de publicar um preview.

## Inventário

| ID | Grupo | Título | Arquivo | Classificação | Origem |
|---|---|---|---|---|---|
| xpex-company | systems | XPeX Systems AI | [WebP](../site/public/media/showcase/systems/xpex-company-cover-v1.webp) | CURATED_COVER | OFFICIAL_ASSET |
| xpex-evidence | systems | Portfólio de Evidências | [WebP](../site/public/media/showcase/systems/xpex-evidence-cover-v1.webp) | CURATED_COVER | OFFICIAL_ASSET |
| xpex-academy | systems | XPeX Academy | [WebP](../site/public/media/showcase/systems/xpex-academy-cover-v1.webp) | CURATED_COVER | REAL_SCREENSHOT |
| systems-command | systems | XPeX Systems Command | [WebP](../site/public/media/showcase/systems/systems-command-cover-v1.webp) | CURATED_COVER | OFFICIAL_ASSET |
| audit-os | systems | GXEON Audit OS | [WebP](../site/public/media/showcase/systems/audit-os-cover-v1.webp) | CURATED_COVER | REAL_SCREENSHOT |
| plugin-factory | systems | XPeX Plugin Factory | [WebP](../site/public/media/showcase/systems/plugin-factory-cover-v1.webp) | CURATED_COVER | OFFICIAL_ASSET |
| wallet-command | systems | GXEON Wallet Command Center | [WebP](../site/public/media/showcase/systems/wallet-command-cover-v1.webp) | CURATED_COVER | REAL_SCREENSHOT |
| studio-ai | systems | XPeX Studio AI | [WebP](../site/public/media/showcase/systems/studio-ai-cover-v1.webp) | CURATED_COVER | REAL_SCREENSHOT |
| api-fabric | systems | XPeX API Fabric | [WebP](../site/public/media/showcase/systems/api-fabric-cover-v1.webp) | CURATED_COVER | OFFICIAL_ASSET |
| academy | systems | XPeX Academy · Polo Kelle | [WebP](../site/public/media/showcase/systems/academy-cover-v1.webp) | CURATED_COVER | REAL_SCREENSHOT |
| neural-copilot | agents | GX Neural Copilot | [WebP](../site/public/media/showcase/agents/neural-copilot-cover-v1.webp) | CURATED_COVER | OFFICIAL_ASSET |
| evidence-concierge | agents | GX Evidence Concierge | [WebP](../site/public/media/showcase/agents/evidence-concierge-cover-v1.webp) | CURATED_COVER | OFFICIAL_ASSET |
| audit-engineer | agents | GXEON Audit Engineer | [WebP](../site/public/media/showcase/agents/audit-engineer-cover-v1.webp) | CURATED_COVER | OFFICIAL_ASSET |
| plugin-factory-agent | agents | XPeX Plugin Factory Agent | [WebP](../site/public/media/showcase/agents/plugin-factory-agent-cover-v1.webp) | CURATED_COVER | OFFICIAL_ASSET |
| api-mcp | agents | API & MCP Runtime | [WebP](../site/public/media/showcase/agents/api-mcp-cover-v1.webp) | CURATED_COVER | OFFICIAL_ASSET |
| enterprise-evidence | agents | Enterprise Evidence Concierge | [WebP](../site/public/media/showcase/agents/enterprise-evidence-cover-v1.webp) | CURATED_COVER | OFFICIAL_ASSET |
| academy-support | agents | Academy Support Agent | [WebP](../site/public/media/showcase/agents/academy-support-cover-v1.webp) | CONCEPT_COVER | OFFICIAL_ASSET |
| three-pillars-pr | evidence | PR #57 · Three Pillars Blueprint | [WebP](../site/public/media/showcase/evidence/three-pillars-pr-cover-v1.webp) | CURATED_COVER | OFFICIAL_ASSET |
| enterprise-v2 | evidence | Enterprise Experience V2 | [WebP](../site/public/media/showcase/evidence/enterprise-v2-cover-v1.webp) | CURATED_COVER | OFFICIAL_ASSET |
| trust-center | evidence | Trust / Evidence Layer | [WebP](../site/public/media/showcase/evidence/trust-center-cover-v1.webp) | CURATED_COVER | OFFICIAL_ASSET |
| system-registry | evidence | System Registry / Public Truth | [WebP](../site/public/media/showcase/evidence/system-registry-cover-v1.webp) | CURATED_COVER | OFFICIAL_ASSET |
| system | fallbacks | Prévia de sistema | [WebP](../site/public/media/showcase/fallbacks/fallback-system-premium-v1.webp) | CONCEPT_COVER | OFFICIAL_ASSET |
| agent | fallbacks | Prévia conceitual de agente | [WebP](../site/public/media/showcase/fallbacks/fallback-agent-premium-v1.webp) | CONCEPT_COVER | OFFICIAL_ASSET |
| evidence | fallbacks | Documento de evidência | [WebP](../site/public/media/showcase/fallbacks/fallback-evidence-premium-v1.webp) | CONCEPT_COVER | OFFICIAL_ASSET |

## Revisão e rollback

O preview e os resultados ficam vinculados na PR. Command, Factory, API Fabric e Portfólio usam capas de marca enquanto a captura pública permanece pendente. A Academy ainda depende de homologação da jornada autenticada. Antes do merge, fechar a PR ou ajustar a branch. Após aprovação e eventual merge, validar um revert em preview.


## Evolução editorial V1.1 — revisão GXEON da PR #59

A revisão adicionou **24 camadas vetoriais leves**, uma por registro, em
`site/public/media/showcase/art/{id}-editorial-v1.svg`, com assinatura visual,
paleta própria e ornamentos técnicos que diferenciam Command, Plugin Factory,
API Fabric, GX Neural Copilot, agentes, evidências e fallbacks. Os arquivos
SVG contêm **arte conceitual original**, sem interface simulada, dados financeiros,
telas de alunos ou afirmação de funcionamento operacional.

As 24 capas WebP de 800×450 são preservadas, inclusive os quatro recortes
baseados em captura pública revisada. A composição em `showcase.js` aplica
as ilustrações somente quando não há screenshot verificado; a classificação
de cada item continua `CURATED_COVER` ou `CONCEPT_COVER`, e o registro
de proveniência contém `image.artOverlay.evidence = false`.

**Critérios de aceite para merge:**
- Conferir em preview o resultado editorial sem obstruir título, status ou botão.
- Confirmar 24 SVGs válidos e 24 WebPs com fallback.
- Confirmar Playwright, validação corporativa e ausência de novas falhas de segurança.
- Analisar Lighthouse com contexto de CPU; não inferir melhora de performance
  apenas de diferenças entre execuções em hardware distinto.
- Não apresentar conceitos como capturas de tela nem agências/serviços
  ainda não operacionais como produtos publicados.
- Manter revisão humana antes do merge para produção.

**Rollback:** desfazer a PR #59 completa, ou em revisão retirar as referências
`artOverlay` e a camada `.xp-cover-artwork`; o site regressa ao Media Pack
WebP de base sem alteração em banco, login, Radar, Academy ou pagamentos.

