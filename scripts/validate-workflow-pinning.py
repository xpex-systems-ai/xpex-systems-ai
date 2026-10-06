#!/usr/bin/env python3
"""Ensure executable third-party GitHub Actions are pinned to immutable references."""

from __future__ import annotations
import pathlib
import re
import sys
from typing import Any

import yaml

ROOT = pathlib.Path(__file__).resolve().parents[1]
WF = ROOT / ".github/workflows"
errors: list[str] = []

ACTION_SHA_REF = re.compile(r"^[^@]+@[0-9a-fA-F]{40}$")
DOCKER_DIGEST_REF = re.compile(r"^docker://.+@sha256:[0-9a-fA-F]{64}$")


def validate_uses(ref: Any, location: str) -> None:
    if not isinstance(ref, str):
        errors.append(f"{location}: uses value must be a string")
        return
    value = ref.strip()
    if value.startswith("./"):
        return
    if value.startswith("docker://"):
        if not DOCKER_DIGEST_REF.match(value):
            errors.append(f"{location}: Docker action must be pinned to sha256 digest: {value}")
        return
    if not ACTION_SHA_REF.match(value):
        errors.append(f"{location}: action/reusable workflow not pinned to 40-char commit SHA: {value}")


for path in sorted(WF.glob("*.y*ml")):
    rel = str(path.relative_to(ROOT))
    try:
        document = yaml.safe_load(path.read_text(encoding="utf-8"))
    except yaml.YAMLError as exc:
        errors.append(f"{rel}: invalid YAML: {exc}")
        continue

    if not isinstance(document, dict):
        errors.append(f"{rel}: workflow root must be a mapping")
        continue

    jobs = document.get("jobs")
    if not isinstance(jobs, dict) or not jobs:
        errors.append(f"{rel}: workflow must define jobs")
        continue

    for job_name, job in jobs.items():
        if not isinstance(job, dict):
            errors.append(f"{rel}: job {job_name!r} must be a mapping")
            continue

        # Job-level uses invokes a reusable workflow.
        if "uses" in job:
            validate_uses(job["uses"], f"{rel}:jobs.{job_name}.uses")

        # Step-level uses invokes an action. Do not scan arbitrary nested keys such as with.uses.
        steps = job.get("steps")
        if steps is None:
            continue
        if not isinstance(steps, list):
            errors.append(f"{rel}: job {job_name!r} steps must be a list")
            continue
        for index, step in enumerate(steps, start=1):
            if not isinstance(step, dict):
                errors.append(f"{rel}: job {job_name!r} step {index} must be a mapping")
                continue
            if "uses" in step:
                validate_uses(step["uses"], f"{rel}:jobs.{job_name}.steps[{index}].uses")

if errors:
    print("Workflow Supply Chain Validation FAILED")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print("Workflow Supply Chain Validation OK")
print("All executable external actions/reusable workflows use immutable commit pins or Docker digests.")
