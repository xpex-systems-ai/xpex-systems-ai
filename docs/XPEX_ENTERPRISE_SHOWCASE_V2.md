# XPeX Enterprise Experience V2

## Baseline verificada em 15/11/2026

- A `main` remota apontava para `f587585911ecad8b317fd9fa947f1de64b1bc3a7`, merge da [PR #57](https://github.com/xpex-systems-ai/xpex-systems-ai/pull/57). A [implantação de produção](https://vercel.com/xpex-neural/xpex-systems-ai/B8yT9gHmTN44a7Mmiw3QKa2tmQfy) estava READY e vinculada ao mesmo SHA. Home, ecossistema e a API pública do ecossistema responderam HTTP 200.
- O site usa Vite 7, JavaScript e npm com lockfile. `main.js` despacha `?view=` e `?system=`; o observatório lê a projeção Vercel `GET /api/ecosystem`. O workflow corporativo usa Node 22 e executa build, GX, GX MCP, Launch, Enterprise Agent API e Ecosystem. Os seis comandos passaram no baseline local.
- Layout, estilos, navegação e logo existentes ficam em `public-site.*` e `brand.js`. A home tem o robô GXEON e a órbita oficiais e um painel ilustrativo. O catálogo técnico dos sete sistemas fica em `system-intelligence.js`; o diretório dos três pilares, o snapshot observado e o catálogo empresarial já têm saídas JSON públicas.
- O [blueprint](XPEX_THREE_PILLARS_BLUEPRINT.md), o [portfólio](PORTFOLIO.md), a [arquitetura](ARCHITECTURE.md) e os [gates G0–G7](SYSTEM_ADMISSION_GATES.md) definem a admissão e as fronteiras públicas. O Portfólio retornou 401 sem sessão. A rota da Academy respondeu 200, com `frame-ancestors 'none'` e `X-Frame-Options: DENY`. Somente a entrada do piloto está em escopo.
- Audit OS, Studio e a rota pública do marketplace Wallet responderam 200. As raízes registradas de Systems Command e Plugin Factory responderam 404 na checagem HTTP inicial; a vitrine precisa distinguir essas observações do snapshot histórico. O registry de mídia marca a captura histórica do Wallet como sensível, e o repositório institucional disponibiliza o JPG oficial, a marca e os símbolos SVG, sem os PNGs históricos de operação.
- As páginas técnicas embutiam runtimes externos em iframes, inclusive staging. Capturas revisadas e links rotulados permitem manter o contexto de acesso e evitam carregar runtimes externos ao abrir o catálogo.
- Build de referência: JS 102,79 kB (32,13 kB gzip), CSS 72,73 kB (15,46 kB gzip). A imagem orbital existente pesa 235.456 bytes. O menu compacto, o foco e o controle de movimento já têm implementação reaproveitável.


## Implementação

A home e o gateway usam `showcaseRail` e `showcaseCard` no shell Vite existente. A home organiza plataformas, sistemas, agentes, evidências, Academy e canais. O gateway mantém o observatório e a projeção GET pública. Os sete perfis mantêm as rotas `?system=` e exibem mídia estática e links de origem. O logo do cabeçalho é um recorte WebP de 5.636 bytes do PNG oficial. A partir do mesmo JPG orbital, a home carrega uma variante WebP de 63.988 bytes em telas de até 600 px, frente aos 235.456 bytes do original. O preload prioriza a variante da tela. As prateleiras fazem uma leitura de layout em lote no ResizeObserver.

`site/src/data/showcase.js` projeta os registros técnico e institucional com texto editorial. [O registro de curadoria](../site/public/data/showcase-evidence-v1.json) acrescenta observações HTTP, URL, horário, classificação, dimensões e nota da mídia. As quatro capturas WebP foram feitas no Chrome com sessão anônima. A Academy mostra somente a tela de entrada; o Wallet mostra a superfície pública do marketplace. A captura do Audit OS tem redação de identificação e contadores. O status `REVIEWED_FOR_PR` representa revisão técnica da imagem para esta PR; a decisão de publicação cabe à revisão independente.

A pesquisa de mídia deixa Portfólio, Command, Plugin Factory e API Fabric com a identidade oficial e o aviso de prévia pendente. O Portfólio exige login. Command e Plugin Factory responderam 404 nas raízes, nas rotas de saúde e nos destinos de operador/MCP consultados. API Fabric segue em admissão sem URL canônica de demonstração. GitHub confirma que as fontes do Command e Studio são privadas, com links restritos rotulados nos perfis.

## Verificação reproduzível

Em `site/`, executar `npm ci`, `npm run build`, `npm run test:ecosystem`, `npm run test:gx`, `npm run test:gx-mcp`, `npm run test:enterprise-agent-api` e `npm run test:launch`.

Para a suíte de navegador, executar `npx playwright install chromium` e `npm run test:showcase:browser`. A suíte usa o build local por padrão. `SHOWCASE_BASE_URL` aponta para o preview Vercel, `SHOWCASE_CHROME_CHANNEL=chrome` usa uma instalação existente do Chrome, e `SHOWCASE_SCREENSHOTS` permite salvar capturas da visita. Playwright fica restrito ao desenvolvimento e não entra no bundle.

## Reversão

Antes do merge, fechar a PR ou corrigir a branch e validar outro preview. Após um merge autorizado, preparar um revert do PR, verificar CI e runtime no preview do revert e submeter à revisão. Se a indisponibilidade exigir restauração imediata e houver autorização, a [implantação anterior](https://vercel.com/xpex-neural/xpex-systems-ai/B8yT9gHmTN44a7Mmiw3QKa2tmQfy) é o baseline observado. Confirmar HEAD, domínio e navegação após a reversão.


## Comparação visual

Baseline em produção, capturado no commit da PR #57. A coluna de comparação usa o build Vite desta branch no mesmo navegador e tamanho. Veja a PR para os links de verificação do preview.

| Superfície | Antes | Depois |
| --- | --- | --- |
| Home, 1440 × 850 | [Imagem](media/xpex-enterprise-v2/before-home.webp) | [Imagem](media/xpex-enterprise-v2/depois-home-desktop.jpg) |
| Ecossistema, 1440 × 850 | [Imagem](media/xpex-enterprise-v2/before-ecosystem.webp) | [Imagem](media/xpex-enterprise-v2/depois-ecossistema-desktop.jpg) |

[Três pilares no desktop](media/xpex-enterprise-v2/depois-plataformas-desktop.jpg) · [Home em 390 px](media/xpex-enterprise-v2/depois-home-mobile.jpg) · [Prateleira de sistemas em 390 px](media/xpex-enterprise-v2/depois-sistemas-mobile.jpg)
