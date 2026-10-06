# GXEON Agent Trust Passports

Every governed GXEON role has a Trust Passport before it is allowed to become a privileged persistent runtime.

## Current roster

| Agent | Risk | Runtime truth | Trust state |
| --- | --- | --- | --- |
| GXEON Auditor | R1 | Not deployed as persistent autonomous service | TP1_DOCUMENTED |
| GXEON Engineer | R2 | Not deployed as persistent autonomous service | TP1_DOCUMENTED |
| GXEON Security | R2 | Not deployed as persistent autonomous service | TP1_DOCUMENTED |
| GXEON Research | R1 | Not deployed as persistent autonomous service | TP1_DOCUMENTED |
| GXEON Revenue | R2 | Not deployed as persistent autonomous service | TP1_DOCUMENTED |
| GXEON Operations | R2 | Not deployed as persistent autonomous service | TP1_DOCUMENTED |

## What each agent already has

- stable Agent ID;
- named purpose;
- risk tier;
- explicit capabilities;
- explicit approval boundaries;
- default-deny permission policy;
- manifest;
- permission matrix entry;
- kill-switch design;
- Trust Passport.

## What each agent does **not** claim yet

These roles are not represented as continuously autonomous production agents.

Before activation, a role must gain:
- runtime identity;
- scoped credentials;
- tested kill switch;
- runtime logs;
- security evaluation;
- tool boundary tests;
- supply-chain record;
- execution evidence;
- review/approval appropriate to its risk tier.

## Production activation gate

```text
REGISTERED
  ↓
MANIFESTED
  ↓
POLICY BOUND
  ↓
SECURITY TESTED
  ↓
RUNTIME IDENTITY
  ↓
KILL SWITCH TESTED
  ↓
OBSERVABILITY
  ↓
INDEPENDENT VERIFICATION
  ↓
ACTIVE
```

Capability does not grant authority.

A more capable model does not automatically receive more permissions.
