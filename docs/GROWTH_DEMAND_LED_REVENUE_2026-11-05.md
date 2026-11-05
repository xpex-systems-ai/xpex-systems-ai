# GXEON — Demand-led commercial operating model (2026-11-05)

**Status: implementation proposal in isolated branch, not a production feature, not a customer contract.**

## One company, one delivery chain
- Corporate site: public positioning, proof of technical competence, qualified-contact path. Do not claim capabilities before independent verification.
- Growth OS: **system of record for commercial demand**, not a general-purpose agent executor. Existing Supabase project `cmtengsethiklxkjmxzd` was observed ACTIVE_HEALTHY on 2026-11-05; schema, RLS and API integration still require inspection.
- OMNIX AI: proposed customer-facing agent integration product. Existing Supabase project `bdxqxunosdkdvnxuamid` was observed INACTIVE on 2026-11-05; do not route live customers there.
- GXEON Audit OS: technical verification, evidence, reviews, access controls, reports. PR #456 is OPEN DRAFT, **not** approved for production.
- Corporate site PR #45 is OPEN DRAFT, **not** production-ready solely by existence.

## Demand-driven rather than speculative outreach
A candidate enterprise should enter Growth OS only with an explicit external evidence URL and a category:
1. **Confirmed buyer need:** procurement/request for implementation, paid pilot, scoped subcontract, approved consulting budget, or written inbound request with an accountable decision-maker.
2. **Partner implementation pathway:** published integration/solution-partner program and real application channel. This shows a route to possible deals, **not a buyer waiting with money**.
3. **Research only:** article, job listing, platform documentation, open-source issue; do not label as paid demand.

Use stages: discovered -> evidence_verified -> qualified -> contacted -> response_received -> scoping -> proposal_sent -> accepted -> delivery_in_progress -> accepted_delivery -> payment_verified. Never skip `accepted` or `payment_verified` based on assumptions. Do not create duplicate records when the same domain or thread has already been contacted.

## Priority offers
Canonical machine-readable proposal: `site/public/data/commercial-offers-v1.json`.
- Agent Integration & MCP Pilot — a scoped authorized read-only proof of concept, test evidence, documentation, and handover. Price negotiated individually. Initial commercial priority.
- Robotics & AI Dataset Integrity Audit — format, integrity, duplicates, metadata and license provenance. **Planned** until a demonstrable implementation is verified. No dataset resale, bulk scraping, or transfer without rights.

## Concrete target channels to research
- StackOne partner program (integration/consulting); email already sent to `partners@stackone.com`, avoid duplicate.
- Glean partner portal; email already sent to `channel@glean.com`, avoid duplicate.
- Nutanix Elevate; form failed Brazil phone validation, email already sent to `tapteam@nutanix.com`, avoid duplicate.
- WRITER solution and technology partners: https://writer.com/partners/ ; potential implementation collaboration, **not an existing customer contract**.
- Fluid AI implementation partners: https://fluid.ai/partners ; published co-sell path, **no approved deal yet**.
- HELP.AI integration/implementation: https://help.ai/partners ; public submission channel, qualify before writing.

## Minimum security and compliance before integration
1. Verify current repository, branch and live endpoints. Do not merge PR #45/#456 automatically.
2. Verify Growth DB tables, ownership, RLS, indexes, encrypted integration credentials and tenancy model before writes.
3. Never expose service_role keys in frontend. Separate public anonymous lead intake from authenticated internal pipeline.
4. Add idempotent upsert keyed by tenant+source+external_company_id; deduplicate by contact thread.
5. Make lead attribution, lawful contact and opt-out requirements explicit. No scraped personal emails or bulk spam.
6. Outbound email = one grounded recipient, personalized problem and approved scope, with record of actual sent message; follow-ups only when warranted.
7. Do not claim formal partnership, certifications, customer production usage, payment, or guaranteed ROI without evidence.
8. Avoid modifying DNS, deployments, production DB, billing and wallets until authorized and reviewed.

## Acceptance criteria for proposed Growth OS integration
- Schema/permissions audit of current Growth OS project documented, no destructive migrations.
- Contract tests: state transition guards; no `payment_verified` without provider evidence or explicit operator attestation.
- A single synthetic demand leads from `discovered` to `proposal_sent` in staging, with immutable evidence links and no external email sent by tests.
- Site displays clear offer status and authentic GitHub evidence, with links to the relevant PRs.
- Independent reviewer records GO/NO-GO prior to production deployment.

## Immediate revenue operating principle
Find a buyer with a stated problem -> validate budget or commercial intent -> scope -> contract and payment terms -> authorized integration -> evidence -> acceptance -> actual reconciliation. Partner applications are relationship-building; the Growth pipeline must never count them as revenue.
