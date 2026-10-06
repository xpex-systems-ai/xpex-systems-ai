#!/usr/bin/env python3
from __future__ import annotations
import pathlib,re,sys

ROOT=pathlib.Path(__file__).resolve().parents[1]
errors=[]
skip={".git"}
binary={".png",".jpg",".jpeg",".gif",".webp",".ico",".zip",".pdf"}
patterns=[
    ("private-key-block",re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----")),
    ("github-token",re.compile(r"\b(?:ghp|github_pat)_[A-Za-z0-9_]{20,}\b")),
    ("stripe-live-secret",re.compile(r"\bsk_live_[A-Za-z0-9]{16,}\b")),
    ("openai-style-secret",re.compile(r"\bsk-[A-Za-z0-9_-]{24,}\b")),
    ("assigned-secret",re.compile(r"(?i)(?:api[_-]?key|access[_-]?token|refresh[_-]?token|client[_-]?secret|private[_-]?key)\s*[:=]\s*['\"][A-Za-z0-9_./+\-=]{20,}['\"]"))
]
for p in ROOT.rglob("*"):
    if not p.is_file() or any(part in skip for part in p.parts) or p.suffix.lower() in binary: continue
    try: text=p.read_text(encoding="utf-8")
    except Exception: continue
    for name,pat in patterns:
        if pat.search(text):
            errors.append(f"{p.relative_to(ROOT)}: matched {name}")

for forbidden in [".env","credentials.json","service-account.json","id_rsa","id_ed25519"]:
    for p in ROOT.rglob(forbidden):
        if ".git" not in p.parts: errors.append(f"{p.relative_to(ROOT)}: forbidden secret-bearing filename")

if errors:
    print("Secret Hygiene Validation FAILED")
    [print(f"- {e}") for e in errors]
    sys.exit(1)

print("Secret Hygiene Validation OK")
