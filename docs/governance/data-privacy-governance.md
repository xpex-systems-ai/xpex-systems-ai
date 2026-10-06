# Data & Privacy Governance

## Data classes

### D0 Public
Approved for public disclosure.

### D1 Internal
Routine internal business information.

### D2 Confidential
Customer, commercial, operational or proprietary information.

### D3 Sensitive
Credentials, financial details, personal data requiring enhanced control, private keys, security findings.

### D4 Restricted
Highly sensitive regulated or critical data requiring explicit policy and access approval.

## Rules

- collect the minimum data required;
- define purpose before processing;
- do not silently reuse data for unrelated purposes;
- isolate tenants;
- restrict model/provider access by data class;
- define retention and deletion;
- protect backups;
- maintain provenance for important datasets;
- track subprocessors/providers where appropriate;
- avoid placing D3/D4 data in general-purpose prompts unless explicitly approved and technically protected.

## Training and improvement

Customer/private data must not automatically become training data for XPeX systems.

Any future training/fine-tuning use requires:
- lawful/contractual basis;
- purpose;
- approved dataset;
- provenance;
- minimization;
- security controls;
- retention policy;
- documented authorization.

## Retrieval and RAG

RAG systems require:
- source identity;
- tenant filtering;
- authorization-aware retrieval;
- document provenance;
- prompt-injection treatment;
- deletion/refresh path;
- stale-data handling.

## Data subject / customer rights

Where applicable, systems should support workflows for:
- access;
- correction;
- export;
- deletion;
- consent/objection handling;
- audit evidence.

The exact legal obligation depends on jurisdiction and role and must be assessed separately.
