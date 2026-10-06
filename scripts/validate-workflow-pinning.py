#!/usr/bin/env python3
"""Ensure third-party GitHub Actions are pinned to immutable commit SHAs."""

from __future__ import annotations
import pathlib
import re
import sys

import yaml

ROOT = pathlib.Path(__file__).resolve().parents[1]
WF = ROOT / ".github/workflows"
errors: list[str] = []

SHA_REF = re.compile(r"^[^@]+@[0-9a-fA-F]{40}$")

def walk_uses(node, path: str):
    if isinstance(node, dict):
        for key, value in node.items():
            if key == "uses":
                if not isinstance(value, str):
                    errors.append(f"{path}: uses value must be a string")
                    continue
                ref = value.strip()
                if ref.startswith("./"):
                    continue
                if not SHA_REF.match(ref):
                    errors.append(f"{path}: action not pinned to 40-char SHA: {ref}")
            else:
                walk_uses(value, path)
    elif isinstance(node, list):
        for item in node:
            walk_uses(item, path)

for path in sorted(WF.glob("*.y*ml")):
    rel = str(path.relative_to(ROOT))
    try:
        document = yaml.safe_load(path.read_text(encoding="utf-8"))
    except yaml.YAMLError as exc:
        errors.append(f"{rel}: invalid YAML: {exc}")
        continue
    walk_uses(document, rel)

if errors:
    print("Workflow Supply Chain Validation FAILED")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print("Workflow Supply Chain Validation OK")
print("All external workflow actions are pinned to immutable commit SHAs.")
