#!/usr/bin/env python3
from __future__ import annotations
import json, pathlib, sys

ROOT=pathlib.Path(__file__).resolve().parents[1]
errors=[]
valid_status={"VERIFIED","IMPLEMENTED","POLICY_DEFINED","CONDITIONAL","NOT_VERIFIED","NOT_APPLICABLE"}
required_dims={"IDENTITY","SOURCE_OWNERSHIP","PERMISSIONS","POLICY","SECRETS","EVALUATION","CONTAINMENT","RUNTIME","EVIDENCE","SUPPLY_CHAIN","HUMAN_OVERSIGHT"}

def load(p):
    try: return json.loads(p.read_text(encoding="utf-8"))
    except Exception as e:
        errors.append(f"invalid JSON {p.relative_to(ROOT)}: {e}"); return {}

def check_passport(p, subject):
    d=load(p)
    if d.get("subject_type")!=subject: errors.append(f"{p.name}: wrong subject_type")
    dims=d.get("dimensions") or {}
    missing=required_dims-set(dims)
    if missing: errors.append(f"{p.name}: missing dimensions {sorted(missing)}")
    for k,v in dims.items():
        if v.get("status") not in valid_status: errors.append(f"{p.name}: invalid {k} status")
        for ref in v.get("evidence_refs",[]):
            if not (ROOT/ref).exists(): errors.append(f"{p.name}: missing evidence ref {ref}")
    state=d.get("overall_trust_state")
    if state=="TP3_VERIFIED":
        material=[x for x in dims.values() if x.get("status")!="NOT_APPLICABLE"]
        if any(x.get("status") not in {"VERIFIED"} for x in material):
            errors.append(f"{p.name}: TP3_VERIFIED requires all material dimensions VERIFIED")
    if state=="TP4_CONTINUOUSLY_ASSURED":
        errors.append(f"{p.name}: TP4 not allowed until continuous assurance service exists")

for p in sorted((ROOT/"data/trust/system-passports").glob("*.json")): check_passport(p,"SYSTEM")
for p in sorted((ROOT/"data/trust/agent-passports").glob("*.json")): check_passport(p,"AGENT")

for p in sorted(ROOT.glob("systems/*/ai-bom.json")):
    d=load(p)
    if not d.get("aibom_id") or not d.get("system_id"): errors.append(f"{p}: incomplete AI-BOM")
    for key in ("models","agents","tools","providers","data_sources"):
        if key not in d: errors.append(f"{p}: AI-BOM missing {key}")

if errors:
    print("Trust Passport Validation FAILED")
    [print(f"- {e}") for e in errors]
    sys.exit(1)

print("Trust Passport Validation OK")
print(f"System passports: {len(list((ROOT/'data/trust/system-passports').glob('*.json')))}")
print(f"Agent passports: {len(list((ROOT/'data/trust/agent-passports').glob('*.json')))}")
