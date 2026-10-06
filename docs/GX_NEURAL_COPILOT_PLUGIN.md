# XPeX GX Neural Copilot Plugin — V1

## Role

**XPeX GX Neural Copilot** is the plugin bridge between ChatGPT/Codex and the governed XPeX Company Intelligence layer.

It does not copy private ChatGPT memory into the company.

It exposes structured, provenance-aware company knowledge through MCP:

```text
ChatGPT / Codex
      ↓
XPeX GX Neural Copilot plugin
      ↓
/api/mcp/gx
      ↓
GX Knowledge Plane
      ├── 7 detailed System Intelligence records
      ├── 20 material asset lineages
      ├── public evidence registry
      ├── runtime truth
      ├── trust/security boundaries
      ├── governed media metadata
      └── recent public corporate commits
```

## V1 tools

1. `xpex_gx_list_systems`
2. `xpex_gx_get_system`
3. `xpex_gx_search_evidence`
4. `xpex_gx_get_runtime_truth`
5. `xpex_gx_get_trust_status`
6. `xpex_gx_get_assets`
7. `xpex_gx_get_architecture`
8. `xpex_gx_get_open_gates`
9. `xpex_gx_get_recent_changes`
10. `xpex_gx_prepare_audit`
11. `xpex_gx_get_ecosystem_graph`

## Permission model

V1 is **read-only**.

It may inspect public company intelligence and prepare an audit plan.

It cannot:
- mutate code;
- deploy;
- merge;
- change provider state;
- read credentials;
- access private ChatGPT memory;
- transfer money;
- approve its own delivery.

## Operator V2

The eventual private Operator layer should be a separate authenticated control plane:

```text
operator identity
 → authenticated GX
 → scoped connector/tool
 → policy engine
 → preview/branch
 → CI
 → evidence collection
 → independent approval
 → deploy/merge
 → immutable action log
```

Knowledge permission and action permission remain separate.

## Canonical MCP endpoint

`https://xpex-systems-ai.vercel.app/api/mcp/gx`

## Governance invariant

> THE EXECUTOR DOES NOT APPROVE ITS OWN DELIVERY.
