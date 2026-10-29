# GX-02.0 — Remote activation decision

Remote stage remains blocked; implementation and tests continue. Earlier general authorization and confirmation that a server exists do not identify its host/IP, OS, domain, operational access, ownership or usage conditions. No infrastructure was provisioned by GX020.

| Destination | Read-only observation on 2026-10-28 | Decision |
|---|---|---|
| Institutional Vercel project `prj_9TzNOpz6Uzz34uHfLrlYAXzXcfgw` | Production 1ab659b; initial Git preview b4ab3bc succeeds; six existing API surfaces return JSON | Keep existing Git previews; no production promotion or proxy |
| Technical Vercel `gxeon-audit-os` | Existing deployment records in baseline; READY alone proves neither API nor PostgreSQL | Keep protected; do not treat as integrated remote service |
| Railway GXEON-AI / compassionate-illumination | Existing production-named environments; newest three records each are REMOVED/FAILED, no deployment URL; no preview-specific project found | Do not reactivate, reuse credentials or alter legacy financial modules |
| Owner-controlled server | Existence answered “SIM”; exact target/access/capacity/domain/firewall/backup/cost unconfirmed | Prepare portable package; no connection or installation until target and conditions confirmed |

Railway evidence is [sanitized metadata](evidence/railway-inventory.json), without creator contacts, variables or logs. GitHub deployment evidence is in [baseline](evidence/baseline.json). Vercel connector access previously required an unavailable connection identifier; GitHub deployment metadata plus actual public HTTP/browser observations are used, not an invented provider account or configuration claim.

Lowest-risk next remote action: confirm the exact existing XPeX server and operating conditions, then perform read-only preflight. Required: ownership, OS, CPU/RAM/disk, authorized access method, domain and valid TLS, firewall and private PostgreSQL, isolated test environment, backup/restore destination and retention, cost/consumption limit, rollback, explicit installation approval. Never send passwords/private keys in the chat.

Reuse vs dedicated server: reuse avoids a new subscription only if isolation/capacity/backup are proven; a separate server reduces coupling but adds cost and maintenance and needs separate approval. No price or hard spend control is assumed. Incremental infrastructure contracted in GX020: none; GitHub/Vercel use their existing integrations and any account metering remains subject to their plans.

The existing portable architecture remains Node24 + PostgreSQL17 private + HTTPS + React `/omnix`. Environment names and file-secret contracts remain in the [engine runbook](https://github.com/xpex-systems-ai/GXEON-AI/blob/761be2762b358eadf9305533d5d2f24c1ebbcc9c/deploy/self-hosted/README.md). No private origin or token is embedded into corporate JavaScript. `/api/omnix/*` is not proxied by this change.
