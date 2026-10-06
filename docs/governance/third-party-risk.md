# Third-Party & Connector Risk Standard

## Scope

Applies to AI providers, cloud platforms, code dependencies, plugins, MCP servers, APIs, data vendors, SaaS connectors, payment providers and outsourced services.

## Intake review

Before privileged use, record:
- provider/service name;
- purpose;
- data received;
- permissions granted;
- authentication type;
- hosting/region where relevant;
- retention/training terms where known;
- security documentation;
- availability/SLA where relevant;
- pricing/cost exposure;
- lock-in/exit path;
- incident contact;
- review date.

## Connector permissions

Connector access should begin at the lowest practical privilege:
1. metadata/read-only;
2. scoped write;
3. production write;
4. privileged/admin.

Privilege increases require explicit justification.

## MCP / plugin controls

For external tools:
- verify origin where practical;
- prefer official or reviewed integrations;
- document scopes;
- isolate secrets;
- validate returned data;
- treat tool output as untrusted data;
- log material calls;
- rate-limit autonomous invocation;
- disable on anomaly.

## Dependency risk

Forks and external repositories retain upstream attribution.

XPeX must not represent upstream software as proprietary.

Material dependencies should have:
- license identified;
- update strategy;
- vulnerability monitoring;
- replacement/exit plan when business-critical.

## Concentration risk

Critical systems should identify single-provider dependencies and, where commercially justified, maintain fallback or recovery options.

## Relationship truth

Technical integration is not partnership.

Public partner language requires evidence of the actual relationship status.
