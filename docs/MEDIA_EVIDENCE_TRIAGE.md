# XPeX Media Evidence Triage — V1

## Objective

Turn the large historical media library into a governed evidence layer instead of a visual dump.

The media pipeline is:

```text
RAW MEDIA
  → classify
  → detect sensitive data
  → determine evidence strength
  → redact if needed
  → map to system
  → approve
  → publish
```

## Evidence classes

### E1 — PUBLIC PRODUCTION EVIDENCE
Real product/runtime screenshots with no secrets, personal data or unsupported claims.

### E2 — PUBLIC AFTER REDACTION
Real screenshots that contain wallet addresses, account identifiers, emails, tokens, customer information, internal URLs or other data that should not be published as-is.

### E3 — INTERNAL EVIDENCE
Useful for internal verification but not appropriate for the public website.

### D1 — DESIGN / CONCEPT
Generated mockups, proposed dashboards, branding studies and future-state designs.

These can be shown as **concept art** but can never be used as proof that a feature, metric or deployment exists.

### X — REJECT
Duplicates, obsolete screenshots, screenshots containing secrets, or media whose provenance cannot be established.

## Seed triage — first inspected batch

| Asset | Class | Decision | Reason |
|---|---|---|---|
| `screencapture-xpex-systems-command...00_22_32.png` | E1 candidate | KEEP | Real staging Systems Command surface; empty-state counters avoid unsupported operational claims. |
| `screencapture-gxeon-wallet-command-center...08_17_44.png` | E2 | REDACT FIRST | Real product surface, but contains a public wallet address and operational details that should not be published casually. |
| `Sistema XPEX: Inteligência Autônoma Dourada.png` | D1 | CONCEPT ONLY | Strong branding image but includes unverified numeric claims such as active products/agents/evidence coverage. |
| `Central de Comando XPeX Systems.png` | D1 | CONCEPT ONLY | High-quality future-state mockup with synthetic metrics and states. |
| `Nexara: Inteligência Artificial do Futuro.png` | D1 | CONCEPT ONLY | Generated brand/future-state art; not runtime proof. |

## Publication rule

Before any image enters the corporate website:

1. map it to a canonical system ID;
2. record whether it is real runtime, generated concept or marketing art;
3. inspect for secrets/personal/account data;
4. redact where necessary;
5. ensure every numeric claim is supported by current evidence;
6. add a caption with capture/source context;
7. make the evidence class visible internally.

This prevents beautiful concept art from accidentally becoming false technical evidence.
