#!/usr/bin/env python3
"""Ensure third-party GitHub Actions are pinned to immutable commit SHAs."""

from __future__ import annotations
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
WF = ROOT / ".github/workflows"
errors: list[str] = []

USES = re.compile(r"^\s*uses:\s*([^\s#]+)(?:\s*#.*)?$")
SHA_REF = re.compile(r"^[^@]+@[0-9a-fA-F]{40}$")

for path in sorted(WF.glob("*.y*ml")):
    for lineno, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        m = USES.match(line)
        if not m:
            continue
        ref = m.group(1)
        if ref.startswith("./"):
            continue
        if not SHA_REF.match(ref):
            errors.append(f"{path.relative_to(ROOT)}:{lineno}: action not pinned to 40-char SHA: {ref}")

if errors:
    print("Workflow Supply Chain Validation FAILED")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print("Workflow Supply Chain Validation OK")
print("All external workflow actions are pinned to immutable commit SHAs.")
