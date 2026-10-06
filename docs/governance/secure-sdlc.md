# Secure AI SDLC

## 1. Plan
- define intended use and non-goals;
- assign owner and risk tier;
- identify users and affected parties;
- identify data classes;
- identify legal/regulatory constraints;
- define measurable acceptance criteria.

## 2. Design
- document architecture and trust boundaries;
- minimize privileges;
- separate tenant/data domains;
- design rollback and kill switch;
- define human-oversight points;
- define provider/model eligibility;
- define audit evidence.

## 3. Build
- use reviewed dependencies;
- protect secrets;
- validate tool inputs;
- separate trusted policy from untrusted content;
- use typed/structured tool calls where possible;
- prohibit hidden production credentials in source;
- maintain upstream/fork attribution.

## 4. Test
- unit/integration testing;
- authorization testing;
- prompt-injection testing;
- tool-abuse testing;
- cross-tenant isolation;
- secret scanning;
- dependency/vulnerability review;
- AI evaluations and red-team tests;
- failure/rollback simulation.

## 5. Release
- independent verification for material change;
- deployment linked to commit;
- change owner identified;
- health check;
- rollback path verified;
- public claims updated only after runtime verification.

## 6. Operate
- runtime monitoring;
- cost monitoring;
- anomaly monitoring;
- provider/model drift monitoring;
- periodic permission review;
- incident response.

## 7. Retire
- stop workloads;
- revoke credentials;
- archive evidence;
- delete/retain data per policy;
- mark system LEGACY/ARCHIVED;
- preserve required attribution and audit history.

## Definition of Done for production AI

A production AI change is not done until:
- expected behavior works;
- permissions are correct;
- security gates pass;
- telemetry exists;
- rollback exists;
- evidence is captured;
- the appropriate approver accepts the verified delivery.
