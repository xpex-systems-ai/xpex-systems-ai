# AI Incident Response Standard

## Objective

Contain quickly, preserve evidence, protect people/assets, recover safely and learn.

## Severity

### SEV-0 Critical
Ongoing material harm, major credential compromise, unauthorized financial movement, critical data breach, destructive autonomous behavior or systemic production compromise.

### SEV-1 High
Privileged-agent abuse, sensitive-data exposure, production integrity compromise or high-impact external action.

### SEV-2 Moderate
Contained security issue, repeated unsafe model behavior, limited data exposure or material service degradation.

### SEV-3 Low
Non-sensitive failure, minor policy violation or low-impact reliability issue.

### SEV-4 Observation
Weak signal, anomaly or near miss requiring tracking.

## Immediate containment

Depending on incident:
1. stop agent/workflow;
2. revoke or scope credentials;
3. freeze financial/destructive actions;
4. isolate affected service;
5. quarantine memory/vector stores;
6. disable compromised connector;
7. rollback deployment;
8. preserve logs and evidence.

## Evidence preservation

Capture:
- timestamps;
- agent/model/tool IDs;
- affected assets;
- prompts/policies where permissible;
- tool calls;
- deployment commit;
- identity/authentication context;
- data classes affected;
- authorization trail;
- containment steps.

## Recovery

Recovery requires:
- root-cause hypothesis;
- remediation;
- independent verification;
- restored minimum privilege;
- re-evaluation;
- authorized restart.

## Post-incident review

Document:
- what happened;
- why controls failed;
- blast radius;
- customer/regulatory impact;
- corrective actions;
- owners and deadlines;
- control-catalog updates.

## Notification

Legal, contractual and regulatory notification requirements are evaluated case-by-case by authorized personnel. The AI agent does not decide legal notification obligations on its own.
