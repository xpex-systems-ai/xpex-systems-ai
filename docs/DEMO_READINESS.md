# XPeX Demo Readiness — V1

## Definition of demo-ready

A system is **DEMO_READY** only when a reviewer can open a stable surface and understand the product without internal explanation.

Required minimum:

1. canonical name;
2. canonical source or disclosed source position;
3. working deployment;
4. no known critical runtime error;
5. one-sentence problem statement;
6. 3–5 minute demo path;
7. architecture summary;
8. security/truth boundary;
9. evidence reference;
10. clear next action / CTA.

## Current demo queue

### GXEON Audit OS — GREEN
**Demo path:** open product → show audit flow → show evidence/result boundary → explain manual-first safety.

Provider evidence: Vercel production READY. No runtime error group observed in the last 7-day query.

### XPeX Plugin Factory — GREEN
**Demo path:** submit blueprint → validate → preview package → explain security gates → show deterministic output.

Provider evidence: Railway deployment SUCCESS and public Railway domains.

### XPeX Studio AI — GREEN
**Demo path:** show control-plane shell → Genesis/Agent/Memory modules → explain Supabase auth readiness.

Provider evidence: Vercel production READY. No runtime error group observed in the last 7-day query.

### GXEON Wallet Command Center — AMBER
**Demo path:** show read-only wallet truth → public agent marketplace/MCP discovery → framework integration → approval/payment boundary.

Provider evidence: Vercel production READY.

Blocker: a Node `url.parse()` deprecation warning was observed repeatedly on API routes. It does not justify calling the system broken, but it should be removed before a high-stakes external demo.

### XPeX API Fabric / Marketplace Lineage — AMBER
**Demo path:** show API marketplace → source assurance → production deployment → explain admission gates.

Provider evidence: Vercel production READY; no 7-day runtime error group observed.

Blockers: legacy branding/name and incomplete Supabase/canonical-identity correlation.

### XPeX Systems Command — AMBER
**Demo path:** show registry → provider asset → evidence → verification state → Trust/Company Intelligence model.

Provider evidence: Railway deployment SUCCESS with PostgreSQL present.

Blocker: current environment is intentionally staging and is not promoted as a public production flagship.

### XPeX Academy — RED / RECOVERY
The product is strategically important, but multiple duplicate Vercel projects were observed and the latest relevant deployments were CANCELED.

Do not use it in an external live demo until one canonical project is selected and a clean production smoke test passes.

## Demo discipline

For recruiting and investors, show **three systems deeply**, not ten systems shallowly.

Recommended first sequence:

1. **XPeX Systems Command** — proves architecture/governance depth.
2. **GXEON Audit OS or Plugin Factory** — proves product execution.
3. **Wallet Command Center / Agent Marketplace** — proves agent/MCP integration and commercial infrastructure.

Then use the remaining systems as portfolio breadth.
