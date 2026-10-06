# XPeX Verified System Standard — V1

Every system promoted into the XPeX public portfolio must follow the same evidence structure.

The first verified systems are the template for everything that follows.

## Required System Pack

```text
systems/<system-slug>/
├── README.md
├── system-card.json
├── ai-bom.json
└── evidence/
    ├── source.json
    ├── deployment.json
    ├── runtime.json
    └── ...additional sanitized evidence
```

A matching Trust Passport must exist at:

```text
data/trust/system-passports/<system-slug>.json
```

## Required dimensions

### Identity
- stable System ID;
- product ID / slug;
- canonical status;
- legacy names preserved where relevant.

### Source & provenance
- official repository or documented source position;
- fork/upstream lineage;
- source commit where available;
- ownership/license class.

### Runtime
- provider;
- environment;
- deployment ID;
- runtime state;
- public endpoint when appropriate;
- verification timestamp.

### AI-BOM
- models;
- agents;
- tools;
- providers;
- data sources;
- policy references;
- unknowns explicitly recorded instead of guessed.

### Trust Passport
- identity;
- source/ownership;
- permissions;
- policy;
- secrets;
- evaluation;
- containment;
- runtime;
- evidence;
- supply chain;
- human oversight.

### Security
- secret posture;
- dependency/supply-chain posture;
- relevant AI security evaluation;
- rollback/containment;
- unresolved findings.

### Evidence
Every material public claim must point to evidence.

## Promotion gates

### CANONICAL
Requires approved system identity and source/ownership position.

### VERIFIED_STAGING
Requires:
- canonical or approved candidate identity;
- verified source;
- successful staging runtime evidence;
- System Pack;
- AI-BOM;
- Trust Passport.

### VERIFIED_LIVE
Requires:
- verified source;
- production deployment ID;
- observed healthy runtime;
- System Pack;
- AI-BOM;
- Trust Passport;
- no hidden critical blocker in public promotion logic.

### PUBLIC_FLAGSHIP
Requires all VERIFIED_LIVE gates plus:
- brand-ready name;
- clean public URL/domain;
- approved description;
- security review appropriate to risk;
- approved public evidence;
- founder/product approval.

## Rule

**No project enters the flagship portfolio by name recognition or visual quality alone.**

It enters because the evidence chain is complete.
