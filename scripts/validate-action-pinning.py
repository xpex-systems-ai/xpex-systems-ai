#!/usr/bin/env python3
from __future__ import annotations
import pathlib,re,sys

ROOT=pathlib.Path(__file__).resolve().parents[1]
WF=ROOT/".github/workflows"
errors=[]
allowed_prefixes=("actions/","github/codeql-action@","ossf/scorecard-action@")
uses_re=re.compile(r"uses:\s*([^\s#]+)")

for p in WF.glob("*.yml"):
    text=p.read_text(encoding="utf-8")
    for match in uses_re.finditer(text):
        ref=match.group(1)
        if ref.startswith("./"):
            continue
        if "@" not in ref:
            errors.append(f"{p.name}: action without ref: {ref}")
            continue
        action,version=ref.rsplit("@",1)
        if not re.fullmatch(r"[0-9a-f]{40}",version):
            errors.append(f"{p.name}: action not pinned to immutable 40-char SHA: {ref}")
        if not (action.startswith("actions/") or action.startswith("github/codeql-action/") or action=="ossf/scorecard-action"):
            errors.append(f"{p.name}: action publisher not in current corporate allowlist: {action}")

if errors:
    print("GitHub Action Supply-chain Validation FAILED")
    for e in errors: print(f"- {e}")
    sys.exit(1)

print("GitHub Action Supply-chain Validation OK")
print("All external workflow actions are pinned to immutable commit SHAs.")
