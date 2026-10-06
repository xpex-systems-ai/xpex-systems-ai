# Third-Party & AI Supply-Chain Governance

## Scope

Applies to AI model providers, model aggregators/routers, cloud providers, databases, SaaS connectors, MCP servers, plugins, open-source dependencies, forks, agent tools, contractors and service providers.

## Risk review

For material dependencies record:
- provider/product;
- purpose;
- data classes exposed;
- privileges granted;
- authentication method;
- deployment region where relevant;
- availability dependency;
- legal/contract status;
- security evidence;
- exit/fallback plan;
- review date.

## Open source

For forks and external code:
- preserve upstream attribution;
- track upstream URL and commit;
- do not claim upstream IP as proprietary;
- review license;
- track local modifications;
- assess dependency/security risk before production use.

## MCP / plugin governance

Before enabling a connector with side effects:
- identify publisher;
- define scopes;
- inspect requested permissions;
- classify reachable data;
- separate read and write authority;
- require approval for high-risk actions;
- log material calls;
- define revocation path.

Tool descriptions and external content do not override company policy.

## Provider concentration

Critical systems should understand dependence on:
- one model;
- one region;
- one cloud;
- one payment provider;
- one database;
- one identity provider.

Where economically justified, define graceful degradation or migration paths.

## Partnership language

Relationship status is evidence-based:

`TECHNOLOGY_USED → INTEGRATION_AVAILABLE → MARKETPLACE_LISTED → PROGRAM_MEMBER → FORMAL_PARTNER → COSELL_PARTNER`

Do not use the word "partner" publicly when the evidence supports only technology usage.
