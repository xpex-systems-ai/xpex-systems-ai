# XPeX Enterprise Media System V2

Base `617edfa396a68d63b43580981502c09b6ce25dfa`, merge da PR #59. A V2 agrega capas 800 × 450, símbolos SVG de cartão e variantes monocromáticas ao catálogo público. O ícone de origem é a forma simplificada para 24 px. O SVG em moldura serve para 32 a 48 px em superfícies escuras.

O [registry](../site/public/data/showcase-media-pack-v2.json) contém inventário de capas, ícones, fontes e estados. Os arquivos WebP são composições editoriais. Capas com capturas derivam das imagens revistas de Audit OS, Studio AI, Wallet público e Academy. Os perfis preservam o acesso à captura original. Os módulos internos e os papéis conceituais apontam para referências públicas autorizadas e têm indicação explícita de escopo.

Dez marcas externas disponíveis no acervo Simple Icons foram copiadas de um commit fixo. ChatGPT e a camada API XPeX usam símbolos XPeX. Uma marca indica o assunto do card. A aprovação de uso público dos novos assets e eventual autorização de marca aguardam revisão do GXEON.

O efeito de luz usa transform CSS apenas em hover ou foco sob a preferência de movimento normal. Capas e ícones usam carregamento tardio e dimensões fixas. O cliente recebe a projeção compacta de mídia e o registro completo é consultável por URL.

## Regeneração e rollback

Em `site/`, rodar `node scripts/build-showcase-media.mjs --v2` com Chromium instalado ou com `SHOWCASE_CHROME_CHANNEL=chrome`. Validar o manifesto e a projeção gerados com `npm run test:showcase:media`. Executar build, ecossistema e Playwright antes da publicação. O preview, o CI e as medições ficam registrados na PR.

Antes do merge, revisar ou fechar a PR. Após merge autorizado, abrir um revert e validar o preview do revert antes de publicar. A decisão de merge é do GXEON e do responsável pelo repositório.
