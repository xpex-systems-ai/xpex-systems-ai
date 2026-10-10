# GXEON Enterprise — Corporate Public Demonstration

XPeX Systems AI is the public company entry point. GXEON is its agent economy layer; Wallet Command Center remains the canonical financial/marketplace module. This release integrates the existing modules into the company rather than creating a second backend or moving private accounts into the public website.

## Entry points

- Company: https://xpex-systems-ai.vercel.app
- Corporate demonstration: https://xpex-systems-ai.vercel.app/?view=ecosystem
- Public projection: https://xpex-systems-ai.vercel.app/api/ecosystem
- Existing integrations: https://gxeon-wallet-command-center.vercel.app/?tab=integrations
- Existing revenue module: https://gxeon-wallet-command-center.vercel.app/?tab=revenue-operations

## Demonstration story

1. Enter through the official company website and choose **Explore the ecosystem**.
2. Refresh public evidence. Inspect catalog counts and each source's timestamps.
3. Review Coinbase configuration and the staging Command access boundary.
4. Inspect radar source counts: freshness is evaluated separately from the time of the corporate request.
5. Review declared machine services and catalog credit units. No purchase or service execution occurs.
6. Evaluate a bounded enterprise pilot or discuss requirements through the founder's existing public LinkedIn contact.
7. Open public evidence, corporate source and Trust Center.

## Integration boundaries

The corporate GET endpoint calls exactly three fixed public Wallet URLs in parallel: ecosystem metadata, revenue metadata and service discovery. It sends no browser cookies, authorization, query-supplied URL or operator credentials. Redirects are refused; JSON is bounded to 128 KiB per source with a 12-second timeout. Public output is constructed from an allowlist. It excludes accounts, balances, transactions, opportunity payloads and private ledger records even if an upstream response contains them.

The corporate response is `AVAILABLE`, `DEGRADED` or `UNAVAILABLE`. Each module retains its own state and timestamp. Demand records older than 15 minutes are `STALE`; unavailable or invalid counts are null, not zero. A verified empty catalog/source can legitimately display zero. The UI uses BRT for timestamps and permits manual refreshing; it does not schedule background jobs or trigger radar ingestion.

Coinbase can be `SETUP_REQUIRED`, `CONFIGURED_NOT_SYNCED` or `NOT_VERIFIED`. None means that a wallet has been synchronized. Account, network, balance and USDC remain null in this public projection. Base is planned, not inferred from a custodial account. Historical connector verification is explicitly dated.

Private Command remains staging and requires an authenticated session. Financial operations, signatures, swaps, transfers, claims, outreach, external listings and contract acceptance are absent from this public demonstration.

## Commercial paths

The presentation reuses existing corporate offerings: Company Intelligence diagnostics, bounded agent/MCP integration pilots and platform service distribution. Scope, acceptance criteria, permissions, delivery evidence, costs, final prices, SLA and responsibilities must be agreed before an engagement. The contact action opens the founder's existing public LinkedIn profile; no visitor details are stored or sent by this release.

Catalog credit prices are discovery metadata, not USDC prices or verified sales. AgenticTrade account/publication remains unverified. A connection is not a balance, a balance is not revenue, and a bounty reward is not a settled receipt. Ledger reconciliation requires an authenticated financial source and duplicate-resistant settlement evidence in the existing private system; this public projection does not implement that reconciliation.

## Assurance and verification

The company remains at its existing AL1 foundation. An enterprise presentation does not imply external certification, production promotion of staging Command, customer contracts or payment readiness.

Boundary tests cover fixed read-only sources, credential non-forwarding, redaction, partial failures, stale/future timestamps, duplicate sources, negative prices, oversize/non-JSON responses, catalog allowlisting and write rejection. Existing GX, MCP, system intelligence, launch and enterprise API checks remain required. Verify the Vercel preview and official alias with a browser before reporting publication.

Known Wallet hardening item: Node `url.parse` deprecation warning remains documented separately. Authenticated Coinbase balance/history and settlement proof are still operational gates, not public demo claims.
