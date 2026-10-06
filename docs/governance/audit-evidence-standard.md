# Audit & Evidence Standard

## Purpose

XPeX governance is evidence-driven. A control is not considered verified solely because documentation says it exists.

## Evidence hierarchy

From strongest to weakest:

1. direct runtime/system evidence;
2. signed or immutable machine-generated record;
3. provider/API record;
4. source-code/configuration evidence;
5. independent test result;
6. human attestation;
7. inferred evidence.

Material claims should prefer higher-quality evidence.

## Evidence record

Where applicable:
- Evidence ID;
- control ID;
- system/asset ID;
- source;
- source account;
- claim;
- observation;
- verification status;
- confidence;
- timestamp;
- verifier;
- artifact hash/commit;
- retention classification.

## Verification states

- DISCOVERED
- OBSERVED
- CORROBORATED
- VERIFIED
- SUPERSEDED
- INVALIDATED

## Chain of custody

Evidence should preserve:
- source provenance;
- timestamp;
- identity of collector;
- transformations;
- storage location;
- hash/commit when practical.

## Independence

For critical controls, the verifier should be independent from the executor where practical.

## Public evidence

Public evidence must be sanitized.

Never expose:
- secrets;
- private customer data;
- exploitable security details;
- internal credentials;
- unnecessary personal information.

## Retention

Retention depends on:
- contractual need;
- incident requirements;
- legal/regulatory need;
- system criticality;
- data sensitivity.

Retention policy should be explicit for enterprise deployments.
