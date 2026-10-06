#!/usr/bin/env python3
"""Validate the public founder discovery profile without overstating LinkedIn state."""

from __future__ import annotations
import json
import pathlib
import sys

ROOT=pathlib.Path(__file__).resolve().parents[1]
errors=[]

def load(rel):
    try:
        return json.loads((ROOT/rel).read_text(encoding="utf-8"))
    except Exception as exc:
        errors.append(f"{rel}: {exc}")
        return {}

doc=load("data/company/founder-discovery-profile-v1.json")

if doc.get("schema_version")!="1.0":
    errors.append("schema_version must be 1.0")
if doc.get("subject")!="Junior Sena":
    errors.append("canonical subject must be Junior Sena")
if doc.get("canonical_role")!="Applied AI / Agentic Systems Engineer":
    errors.append("canonical engineering role changed unexpectedly")
if doc.get("company_role")!="Founder, XPeX Systems AI":
    errors.append("company role changed unexpectedly")

linkedin=doc.get("linkedin") or {}
if linkedin.get("canonical_url")!="https://www.linkedin.com/in/ceojuniorsena":
    errors.append("canonical LinkedIn URL mismatch")
if linkedin.get("lookup_status")!="RESOLVED":
    errors.append("LinkedIn profile lookup must remain RESOLVED")
if linkedin.get("update_state") not in {
    "COPY_PREPARED_NOT_APPLIED_BY_CONNECTOR",
    "APPLIED_AND_REVERIFIED"
}:
    errors.append("invalid LinkedIn update_state")

proof=doc.get("public_proof") or {}
required={
    "corporate_site":"https://xpex-systems-ai.vercel.app",
    "github_org":"https://github.com/xpex-systems-ai",
    "corporate_repo":"https://github.com/xpex-systems-ai/xpex-systems-ai",
}
for key,value in required.items():
    if proof.get(key)!=value:
        errors.append(f"{key}: canonical proof URL mismatch")

funnel=doc.get("discovery_funnel") or []
expected=[
    "LINKEDIN",
    "FOUNDER_IDENTITY",
    "XPEX_SYSTEMS_AI",
    "CORPORATE_SITE",
    "FLAGSHIP_CASE",
    "LIVE_SYSTEM",
    "SOURCE_DEPLOYMENT_TRUST",
    "CONVERSATION",
]
if funnel!=expected:
    errors.append("discovery funnel changed unexpectedly")

payload=json.dumps(doc).lower()
for forbidden in (
    "soc 2 certified",
    "iso 27001 certified",
    "pentagon-level",
    "cia-level",
    "guaranteed openai",
):
    if forbidden in payload:
        errors.append(f"unsupported founder claim present: {forbidden}")

if errors:
    print("Founder Discovery Validation FAILED")
    for e in errors:
        print(f"- {e}")
    sys.exit(1)

print("Founder Discovery Validation OK")
print("LinkedIn profile: RESOLVED")
print(f"LinkedIn update state: {linkedin.get('update_state')}")
print("Discovery proof path: canonical")
