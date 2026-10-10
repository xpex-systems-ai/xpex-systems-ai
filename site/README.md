# XPeX Systems AI — Corporate Site

Public corporate surface for XPeX Systems AI.

## Principles

- Evidence First.
- Public claims must remain consistent with the corporate portfolio registry.
- A provider deployment state does not equal external certification.
- Canceled/error deployments are never displayed as healthy live demos.
- Revenue, customer and partnership claims require separate evidence.

## Local development

```bash
npm ci
npm run dev
npm run build
```

## Corporate GXEON demonstration

The company homepage links to `/?view=ecosystem`, a first-class public, read-only
projection of the existing Wallet integrations, demand-source metadata and service
catalog. `/api/ecosystem` uses fixed public upstream URLs and excludes private
financial and operator data. Run `npm run test:ecosystem` for the boundary checks.
See [the demonstration and commercial handoff](../docs/GXEON_ENTERPRISE_DEMO.md).

## Deployment

Target: Vercel `xpex-neural` team.

The Vercel project should use this directory as its root:

```text
site
```
