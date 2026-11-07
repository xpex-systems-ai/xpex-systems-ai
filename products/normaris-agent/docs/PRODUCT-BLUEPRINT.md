# COSIVANT Agent Intelligence — Product Blueprint 0.2

## Positioning
One vertical expert agent, delivered through multiple channels. Research for accountants is the lead use case; GXEON Trust adds reference provenance and explicit unknowns; GXEON Commerce prepares future x402 per-API billing. OMNIX will be the retrieval-and-generation layer when independently configured and evaluated.

## Channels
1. Dashboard: COSIVANT Research and Evidence Trust.
2. REST: /api/research (curated source discovery), /api/audit (metadata evidence report), /api/offers (nonbinding offers).
3. MCP: /api/mcp with search_official_references, evidence_audit, inspect_source, list_offers, get_demo_status.
4. Commerce: /api/checkout returns 503 DISABLED, regardless of request.
5. Future OpenAI ChatGPT/Gemini apps require per-provider integration, authentication and any applicable approvals.

## Trust boundaries: nonnegotiable
- Current catalog has four reference links; **0 COSIT acts ingested**.
- A local SHA-256 of metadata is not a hash of legislation or a blockchain proof.
- URL catalog membership is not evidence of legal validity or live service availability.
- No legal/tax opinion, no automatic client advice, no customer-level decision, no tax filing.
- Supabase schema is isolated and RLS protected; Vercel preview has **no database integration secret**.
- Payment proposal has pricing hypotheses only. No x402 facilitators, real settlement, wallet signatures, revenue or customers confirmed.
- COSIVANT remains a working name pending trademark searches; no Receita/CBF/Coinbase affiliation.

## Commercial model (candidate, not active)
- Source Lookup, proposed 0.05 USDC per call, disabled.
- Evidence Trust Pack, proposed 0.10 USDC per report, disabled.
- Enterprise technical implementation pilot, quote after written scope and a professional reviewer.

## Sequence to pilot
A. Validate COSIT collection terms and permitted source documents; retain version, validity and original URL.
B. OMNIX hybrid retrieval, citations and human feedback; evaluate factual errors on a test set.
C. Authentication, tenant RLS, API quotas, MCP OAuth, logs and authorized consumption.
D. x402 payment provider integration, Base USDC wallet eligibility, final settlement reconciliation and idempotency; test on sandbox and with a constrained approved live transaction.
E. Independent accountant review and B2B contract; then invite André to review actual tested capabilities.

## Safety invariant
No evidence => no recommendation. No confirmation from payment provider => no recognized revenue. Executors do not approve their own delivery.
