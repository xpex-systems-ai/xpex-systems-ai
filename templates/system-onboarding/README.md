# System Onboarding Template

Copy this structure only after the system has passed discovery/classification and is a genuine canonical candidate.

Required:
- `system-card.json`
- source evidence
- runtime/deployment evidence where available
- README explaining role, status and blockers

Do not:
- fabricate ownership;
- label a design as live;
- hide fork/upstream lineage;
- put credentials in evidence;
- present a draft name as final without marking its status.


For any verified runtime, also create:
- `ai-bom.json`;
- a matching Trust Passport under `data/trust/system-passports/`;
- evidence references that are public-safe;
- explicit unknowns/blockers.

Use `docs/SYSTEM_STANDARD.md` as the authoritative mold.
