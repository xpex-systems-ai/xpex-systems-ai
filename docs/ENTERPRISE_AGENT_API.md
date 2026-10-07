# XPeX Enterprise Agent API — V1

## Mission

The Enterprise Agent API is the outward-facing distribution layer for XPeX systems, platforms, plugins and agents.

It exists for a simple reason:

> **the right capability should reach the company or agent that actually needs it.**

This is not a spam engine.

It is a machine-readable discovery and matching layer.

## Public architecture

```text
COMPANY / AGENT / ACCELERATOR / ENTERPRISE AI TEAM
                    ↓
       XPeX Enterprise Agent API
          ├── REST discovery
          ├── Enterprise MCP
          ├── well-known manifest
          ├── llms.txt
          └── public asset catalog
                    ↓
             NEED MATCHING
                    ↓
          XPeX SOLUTION PACK
                    ↓
    SYSTEMS + AGENTS + PLUGINS + EVIDENCE
                    ↓
         PILOT / REVIEW / CONTACT HANDOFF
```

## Public endpoints

- REST discovery: `https://xpex-systems-ai.vercel.app/api/agent-api`
- Enterprise MCP: `https://xpex-systems-ai.vercel.app/api/mcp/enterprise`
- Discovery manifest: `https://xpex-systems-ai.vercel.app/.well-known/xpex-agent-api.json`
- Agent catalog: `https://xpex-systems-ai.vercel.app/data/enterprise-agent-catalog-v1.json`
- AI discovery index: `https://xpex-systems-ai.vercel.app/llms.txt`

## Enterprise MCP tools

1. `xpex_enterprise_discover`
2. `xpex_enterprise_match_need`
3. `xpex_enterprise_get_solution_pack`
4. `xpex_enterprise_get_agent_assets`
5. `xpex_enterprise_get_demo_pack`
6. `xpex_enterprise_prepare_pilot`
7. `xpex_enterprise_get_fit`
8. `xpex_enterprise_contact_handoff`

## What it distributes

The API can route interest toward:

- Company Intelligence;
- agentic engineering / MCP integration;
- Neural Workforce / digital-worker composition;
- evidence-led technical audit;
- agent/API distribution;
- applied AI learning;
- AI creation control-plane workflows.

Each match preserves the maturity and open-gate truth of the underlying system.

## What makes it different

Traditional marketing says:

> “Here are our products.”

The Agent API says:

> “Tell us what you need. We will map that need to the smallest relevant XPeX capability set and show you the evidence.”

That makes the distribution surface useful to both humans and other AI agents.

## No silent lead harvesting

V1 is stateless.

It does not persist the visitor's prompt, credentials or company data.

Interested evaluators receive a public contact handoff to the founder and evidence pack.

A later authenticated CRM integration may capture explicit opt-in leads under a separate consent and privacy policy.

## Truth rules

A match does not mean:
- the visitor is a customer;
- a pilot exists;
- a procurement decision has been made;
- a partnership exists;
- revenue exists;
- XPeX can guarantee the visitor's outcome.

## Distribution strategy

V1 focuses on **pull-based discovery**:

- machine-readable public endpoints;
- Agent/MCP integration;
- indexable public site;
- plugin distribution;
- public evidence links;
- accelerator/investor application packs.

Future outbound distribution should target public, relevant opportunities and use explicit platform rules rather than mass unsolicited spam.

## Human mission

The Enterprise Agent API exists to connect useful XPeX capabilities to organizations that can use them to expand human work.

The objective is not maximum reach.

It is **high-fit reach with technical proof**.
