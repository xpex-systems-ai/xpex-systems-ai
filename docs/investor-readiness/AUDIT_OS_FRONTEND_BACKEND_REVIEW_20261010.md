# GXEON Audit OS — Frontend ↔ API integration review

Review date: 2026-10-10.
Evidence scope: connected Vercel project metadata, read-only GitHub code, browser/tool GET attempts, isolated local transport tests and unmerged code PR. No authenticated end-to-end testing or API production changes.

## Observations
1. Vercel project: \`gxeon-audit-os\` (team gxeon), production deployment \`dpl_HSYq7WHky9GYpWqzU1sCUC1Ybx7J\` with READY state at source commit \`dbc29fff9a2c55487f85a83db597f41c493af7a8\` in \`xpex-systems-ai/GXEON-AI\`.
2. Vercel project environment metadata contains \`VITE_GXEON_API_BASE_URL\` for production and preview. The value has NOT been decrypted or verified in the compiled production bundle.
3. Vercel project reports SSO protection enabled for deployment URLs. A public URL being protected is not a service-outage finding.
4. GitHub's backend code mounts audit routes under \`/api\`. Frontend references \`/api/audit-os/*\` and \`/api/v1/audit/*\`. This confirms source-level route alignment, not live reachability.
5. Current backend app uses global \`cors()\` in source; origin policy review is needed before external customer onboarding.
6. Direct GET probes of the frontend and the expected Railway API URL were inconclusive in available web browsing. No HTTP 200/4xx/5xx is asserted for those probes.
7. Vercel grouped runtime errors showed no groups in last 24 hours; this is not proof of successful API calls.

## Engineering action
Draft PR [GXEON-AI#434](https://github.com/xpex-systems-ai/GXEON-AI/pull/434) contains a real frontend-only change to eliminate unnecessary cross-origin GET preflights; preserve authorized POST headers; reject HTML/SSO page masquerading as HTTP 200 JSON; and suppress raw server error-body disclosure. Seven isolated Node 22 local transport tests passed. GitHub CI Typecheck / Build / Health triggered for independent validation.

## Explicit blockers
- Confirm effective bundled \`VITE_GXEON_API_BASE_URL\` (no credential disclosure) and API server ownership/deployment provenance.
- Verify read-only GET response + CORS with authenticated operator-controlled browser or permitted environment.
- Verify SSO audience and intended public/demo access posture.
- Review backend CORS origin allowlist/auth boundaries; CORS alone is not authentication.
- Independent G0–G7 sign-off and commercial/fiscal/legal gates.

## Decision
SOURCE_CORRELATED / ENV_NAME_PRESENT / ENGINEERING_PATCH_DRAFT / LIVE_END_TO_END_NOT_VERIFIED / NOT_PRODUCTION_APPROVED.
