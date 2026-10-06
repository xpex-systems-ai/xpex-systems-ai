# XPeX System Onboarding Standard

## Purpose

Every new product/system discovered in Lovable, Replit, Vercel, Railway, GitHub, Supabase or another source enters XPeX through one consistent evidence pipeline.

## Pipeline

```text
SOURCE ACCOUNT
   ↓
READ-ONLY INVENTORY
   ↓
PROJECT / ASSET DISCOVERY
   ↓
DEDUPLICATION
   ↓
FAMILY / LINEAGE ANALYSIS
   ↓
OWNERSHIP / LICENSE REVIEW
   ↓
CANONICAL CANDIDATE
   ↓
SOURCE REPOSITORY
   ↓
RUNTIME / DEPLOYMENT
   ↓
SECURITY / GOVERNANCE GATES
   ↓
SYSTEM PACK
   ↓
PUBLIC PORTFOLIO
```

## 1. Observe

Collect:
- provider;
- account/source identity;
- provider object ID;
- project/repository/deployment ID;
- name;
- timestamps;
- runtime state;
- source link;
- non-secret integration metadata.

Do not mutate the source during discovery.

## 2. Deduplicate

Use strongest evidence first:
1. exact provider ID;
2. exact source repository;
3. source commit/lineage;
4. identical source/code;
5. deployment/source metadata;
6. strong family/version evidence;
7. name similarity only as a review hint.

Name similarity alone does not merge systems.

## 3. Classify

Assign:
- system type;
- business domain;
- product family;
- commercial status;
- ownership class;
- runtime status;
- risk tier;
- destination;
- lineage role.

## 4. Canonicalize

A system becomes a `CANONICAL_CANDIDATE` when there is enough evidence that it represents a real product/system family worth preserving.

A human/founder decision promotes it to `CANONICAL`.

## 5. Verify source

Record:
- official repository;
- organization;
- upstream/fork status;
- license/ownership;
- source commit;
- branch;
- provenance.

## 6. Verify runtime

Record:
- provider;
- environment;
- deployment ID;
- state;
- URL/domain;
- source commit if available;
- verification timestamp.

## 7. Security & governance

Before public `VERIFIED_LIVE` promotion:
- no unresolved material secret exposure;
- runtime is independently observable;
- ownership/source position is known;
- public claims match evidence;
- applicable XAGF controls are reviewed;
- rollback/containment exists where risk requires it.

## 8. Build the System Pack

Every flagship candidate receives:

```text
systems/<slug>/
├── README.md
├── system-card.json
└── evidence/
    ├── source.json
    ├── deployment.json
    └── runtime.json
```

## 9. Public promotion

The public registry is a projection of verified internal evidence.

Public status must never be stronger than the underlying evidence.

## Upcoming accounts

The same pipeline is intended for:
- Vercel account 02, 03, 04...
- additional Lovable accounts;
- Replit;
- Supabase;
- Railway;
- other approved engineering/data providers.

The company registry accumulates evidence; it does not accumulate duplicate products.


## XPeX Verified System Standard V1

Any system promoted to `VERIFIED_STAGING` or `VERIFIED_LIVE` must now include:

- System Pack README;
- `system-card.json`;
- `ai-bom.json`;
- public-safe evidence records;
- matching system Trust Passport;
- XAGF governance reference;
- explicit blockers/unknowns instead of inferred claims.

See `docs/SYSTEM_STANDARD.md`.
