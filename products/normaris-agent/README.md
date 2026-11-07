# COSIVANT — Regulatory Intelligence Agent (working name)
Status: TECHNICAL PREVIEW v0.2 (research + GXEON evidence trust + x402 commerce planning). Name pending INPI/trademark clearance; not endorsed by Receita Federal.
Standalone dashboard + bounded evidence reference search API + MCP JSON-RPC.
Currently includes 4 hand-reviewed links to official reference pages. NO full COSIT ingestion, live legal conclusions, commercial tenants or proven OMNIX RAG. This version is suitable for architecture review only; NOT for paid professional fiscal advice.

## Routes
GET /api/health — honest readiness data.
GET /api/sources — four curated official reference links.
POST /api/research {"query":"..."} — deterministic relevance and primary-source links (not generated legal analysis).
POST /api/mcp — JSON-RPC initialize, ping, tools/list, tools/call; read-only public reference mode.

## Next production gates
- Lawful incremental COSIT collection and provenance (document URL, revision, hash, publication/vigency dates); verify terms/rate limits.
- Real OMNIX RAG runtime adapter and evidence-grounded generation; block responses without source validity.
- Supabase tenant authentication / RLS, access audit, and verification of actual connected credentials.
- Evaluation with professional contador, change monitoring, safe source retrieval, rate limiting and abuse controls.
- OAuth scopes & platform-specific review for ChatGPT/Gemini; no promise of universal plugin.
- Paid contract only after scope, acceptance and verified payment.

From this app folder: npm test; npm run check.

## V0.2 extensions
See docs/PRODUCT-BLUEPRINT.md, /api/audit, /api/offers and the five read-only MCP tools. /api/checkout rejects all charges with HTTP 503. No OMNIX model nor Supabase runtime credentials have been connected.
