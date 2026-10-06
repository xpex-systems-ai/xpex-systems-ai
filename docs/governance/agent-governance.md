# Agent Governance Standard

## Objective

Every XPeX agent must be identifiable, bounded, observable and revocable.

## Agent identity

Every production-capable agent receives:
- immutable Agent ID;
- owner;
- purpose;
- risk tier;
- capability manifest;
- approved tools;
- approved data classes;
- approved environments;
- budget/spend ceiling;
- maximum execution duration;
- escalation route;
- kill-switch path.

Anonymous production agents are prohibited.

## Capability manifest

Capabilities must be allowlisted, not inferred.

Example:
```yaml
agent_id: GXEON-SALES-001
risk_tier: R2
capabilities:
  - crm.read
  - crm.lead.update
  - email.draft
denied:
  - payment.execute
  - credential.rotate
  - repository.delete
human_approval:
  required_for:
    - external.email.send
    - contract.commit
budget:
  daily_usd: 10
```

## Tool governance

Agents must:
- use least-privilege credentials;
- prefer scoped tokens;
- treat webpage, email, retrieved documents and tool outputs as untrusted content;
- never treat external content as higher-priority policy;
- validate tool parameters before execution;
- verify tool results independently for material actions;
- avoid credential exposure in prompts, memory or logs.

## Memory governance

Memory is segmented by:
- tenant;
- user;
- system;
- sensitivity;
- purpose;
- retention period.

Agents may not silently merge private context across tenants or unrelated users.

Memory writes that affect future autonomous behavior should be traceable and reviewable.

## Multi-agent governance

A coordinating agent may delegate execution but not erase accountability.

For material tasks:
- planner, executor and verifier roles should be distinguishable;
- agents must pass structured context, not unrestricted hidden state;
- delegated permissions cannot exceed the coordinator's authorized scope;
- one agent must not self-verify a critical action it performed.

## Autonomy limits

Every autonomous loop requires:
- explicit objective;
- exit criteria;
- maximum steps/time;
- tool allowlist;
- budget ceiling;
- retry ceiling;
- failure policy;
- escalation path.

Unbounded self-replication, indefinite loops and uncontrolled spend are prohibited.

## Financial and destructive actions

By default, production agents cannot independently:
- transfer funds;
- execute trades;
- change account ownership;
- rotate primary credentials;
- delete canonical repositories;
- delete production databases;
- accept legally binding terms.

These require explicit approval or a formally documented standing authority with limits and independent monitoring.

## Kill switch

Every production agent must have a practical containment path:
1. disable agent;
2. revoke tools/tokens;
3. freeze write permissions;
4. quarantine memory;
5. stop scheduled executions;
6. preserve logs/evidence;
7. investigate before restoration.
