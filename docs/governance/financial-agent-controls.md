# Financial & Economic Agent Controls

## Scope

Applies to AI/agents that can:
- create prices;
- generate payment links;
- issue invoices;
- move funds;
- trade;
- transfer digital assets;
- purchase services;
- change billing;
- trigger refunds;
- alter financial commitments.

## Default posture

Financial execution is deny-by-default unless explicitly enabled.

## Separation of states

XPeX financial truth uses:
`LEAD → PROPOSAL → CONTRACTED → INVOICED → PAID → REVENUE_CONFIRMED`

Agents may not collapse these states.

## Authority bands

### F0 — Observe
Read-only balances, transactions, pricing and reconciliation.

### F1 — Prepare
Draft invoice, price, quote or payment request.

### F2 — Execute bounded commercial actions
Examples: create pre-approved payment link or invoice inside limits.

Requires standing mandate and audit logging.

### F3 — Move value
Trades, transfers, withdrawals, payouts or wallet signing.

Requires explicit approval unless a formally documented policy grants bounded standing authority with:
- account scope;
- asset scope;
- per-action limit;
- daily limit;
- counterparty constraints;
- independent monitoring;
- emergency freeze.

### F4 — Treasury / strategic financial authority
Not delegated by default.

## Mandatory controls

- idempotency for payment actions where supported;
- duplicate-transaction defense;
- confirmation of asset/network/currency;
- explicit separation of test and live modes;
- no secret/private key in prompts or logs;
- transaction evidence;
- reconciliation;
- anomaly detection;
- emergency freeze;
- human escalation.

## Revenue claims

No agent may represent pending, expected or proposed value as confirmed revenue.
