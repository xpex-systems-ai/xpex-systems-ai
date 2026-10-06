# GX Public Evidence Concierge — V1

## Purpose

GX is the public evidence interface inside the XPeX Systems AI website.

It is intentionally **not** a mirror of the founder's private ChatGPT workspace, private memory, connected accounts, wallets or credentials.

Its job is narrower and stronger:

> **Answer from approved public evidence, show the strongest proof, and refuse to convert unknowns into facts.**

## Architecture

```text
Visitor
  ↓
XPeX corporate site
  ↓
GX Evidence Console
  ↓
/api/gx
  ↓
public evidence retrieval
  ↓
optional Vercel AI Gateway reasoning
  ↓
answer + evidence links
```

### Runtime modes

**EVIDENCE ONLY — default**

Deterministic evidence retrieval and bounded answers. Zero model dependency.

**AI + EVIDENCE — explicitly activated**

The same evidence pack is sent to a model through Vercel AI Gateway. The model receives no private company context and is instructed to answer only from the supplied evidence.

AI mode requires `GX_AI_ENABLED=true`. This is deliberately off by default so a public page cannot silently create uncontrolled model spend.

On Vercel, authentication can use the project OIDC token. An explicit AI Gateway key is not required for the architecture when Vercel OIDC is available.

## Public scope

GX may discuss:

- XPeX Systems AI;
- Junior Sena's public engineering profile;
- public flagship systems;
- public deployment states already admitted to the registry;
- public security/governance controls;
- public case packs and GitHub evidence.

GX may not expose:

- environment variables;
- credentials or API keys;
- private repositories not intentionally surfaced;
- personal contracts or addresses;
- connected-account identity metadata;
- private customer data;
- private wallets/keys;
- private ChatGPT memory;
- internal conversations.

## Money Truth

GX must never turn:

- watched balances,
- pending bounty claims,
- internal credits,
- unverified blockchain observations,

into settled revenue.

Public money claims require explicit settlement evidence.

## Governance

The public assistant is **read-only**.

It cannot:
- trade;
- transfer funds;
- change infrastructure;
- write to GitHub;
- edit accounts;
- execute customer actions.

The operator/private control plane remains separate.

## Failure behavior

If AI Gateway is unavailable, GX falls back to deterministic evidence responses.

If evidence is missing, GX says the claim is not yet proven.

If the visitor asks for private information, GX refuses that scope and redirects to public evidence.

## Promotion rule

GX can only cite artifacts admitted to the public evidence registry.

A concept mockup, generated dashboard image or design exploration is **not** production evidence.
