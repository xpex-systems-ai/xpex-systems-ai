# AI Threat Modeling Standard

## Objective

Every material AI system should identify assets, trust boundaries, threat actors, attack paths and compensating controls before production promotion.

## Assets to consider

- credentials and secrets;
- customer and personal data;
- proprietary code and prompts;
- model/provider configuration;
- agent capabilities;
- tool permissions;
- databases and storage;
- financial authority;
- deployment infrastructure;
- evidence and audit records;
- brand and public channels.

## Trust boundaries

Document boundaries between:
- user ↔ application;
- application ↔ model/provider;
- model ↔ tools;
- agent ↔ agent;
- agent ↔ memory;
- application ↔ database;
- application ↔ third-party APIs;
- staging ↔ production;
- tenant ↔ tenant;
- public ↔ private evidence.

## AI-specific threat classes

- direct prompt injection;
- indirect prompt injection;
- tool hijacking;
- excessive agency;
- hallucinated authorization;
- data exfiltration;
- cross-tenant leakage;
- memory poisoning;
- retrieval poisoning;
- model/provider substitution;
- unsafe generated code;
- malicious plugins/connectors;
- supply-chain compromise;
- deceptive or fabricated evidence;
- runaway loops, spend or resource consumption.

## Required output

A threat model should record:
- system;
- owner;
- risk tier;
- architecture;
- trust boundaries;
- threat;
- likelihood;
- impact;
- affected assets;
- control IDs;
- residual risk;
- reviewer;
- review date.

## Re-trigger conditions

Review again after:
- new privileged tool;
- new sensitive data class;
- model/provider change;
- new external connector;
- architecture change;
- major incident;
- privilege expansion;
- new financial or destructive capability.
