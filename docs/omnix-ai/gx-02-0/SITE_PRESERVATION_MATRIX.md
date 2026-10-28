# GX-02.0 — Institutional preservation

Baseline frozen on 2026-10-28 before application changes. Production: `1ab659b8044684f7ad9a93a81399582f19bd6d45`; corporate draft #45: `b4ab3bcba57f93410e372dfb59888131fd287236`; engine draft #456: `761be2762b358eadf9305533d5d2f24c1ebbcc9c`. Branches remain `codex/omnix-product-online-gx019` and `codex/gxeon-audit-os-v1-gx01`. See [machine-readable checkpoint](evidence/baseline.json) for deployment IDs, source hashes and actual API responses. The GitHub deployment environment named Production identifies the observed institutional deployment; its `production_environment` flag is false, so that flag alone is not treated as production proof.

| Asset / behavior | Before | Increment / after verification |
|---|---|---|
| Robot, Earth, orbital SVG, logo, typography, colors, home layout | Production + initial preview present | Source assets/styles unchanged; real Chromium comparisons pending CI |
| Seven canonical slugs, 20 material lineages | Present | Byte preservation + invariant tests PASS |
| Four agent catalog entries and availability | Present | All retained; only Audit Engineer detail gains product reference; browser check pending |
| Audit OS technical profile, evidence shelf, manifest | Present | All retained; contextual product section added |
| Existing OMNIX home entry/menu/product/sample/draft | Present in initial preview | Reused; reciprocal technical link and Powered by wording added |
| REST, enterprise MCP, GX MCP | Six public GETs return JSON in both baseline environments | Handlers unchanged; 8 enterprise tools / 11 GX tools / 7 offers enforced; deployed candidate pending |
| Enterprise observatory, integrations, Revenue Operations, evidence | Present | Unchanged; actual read-only refresh tested in browser CI |
| Fifteen required pages, footer, navigation, filters, URL copy, GX query | Present in source / baseline | Versioned browser regressions added; execution pending |
| Motion / reduced motion | Existing implementation | Unchanged; pause + media behavior regression added |
| Visual widths | IAB DOM responds but mobile screenshot compositor is stale | CI captures actual production, immutable initial preview and current Git preview at 320,375,390,768,900,1024,1150,1440px |

Visual comparisons normalize animation and live iframe content. Unchanged hero, agents, systems, integrations and footer regions are compared against production pixels in the same Chromium job. Full pages and navbars remain separately available for review; the intended OMNIX additions are not disguised as identical full-page pixels. PNG dimensions and DOM viewport widths are asserted. Dynamic ecosystem projections are retained as live data and excluded from static text comparisons. This does not certify accessibility or availability of every third-party destination.

Reproduce: `cd site && npm ci --no-audit --no-fund && npm run test:preservation && npm run build`. Browser: `npx --no-install playwright install --with-deps chromium`, then `npm run test:browser`. Without `PRESERVATION_PREVIEW_URL`, live comparison tests explicitly skip and cannot close P09. CI resolves that URL from actual deployment records for the tested PR HEAD; it never guesses or removes protection.

Browser strategy follows [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots) and [CI guidance](https://playwright.dev/docs/ci-intro); test-only dependency 1.64.1 was published 2026-10-14, observed through the official npm registry. All baseline contracts and production assets remain independent of this test dependency.
