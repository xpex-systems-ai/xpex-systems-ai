# XAGF Control Catalog v1

Each control has a stable ID so implementation, evidence and findings can be linked over time.

## Governance & accountability

| ID | Control |
|---|---|
| XAGF-GOV-001 | Every material AI system has an accountable owner. |
| XAGF-GOV-002 | Risk tier is assigned before production promotion. |
| XAGF-GOV-003 | Material exceptions require documented risk acceptance. |
| XAGF-GOV-004 | Executor and approver are separated for material actions. |
| XAGF-GOV-005 | Public claims are evidence-backed. |
| XAGF-GOV-006 | Governance is re-triggered after material changes. |

## Identity & access

| ID | Control |
|---|---|
| XAGF-IAM-001 | Human privileged accounts use MFA where supported. |
| XAGF-IAM-002 | Human and machine identities are separated. |
| XAGF-IAM-003 | Agent capabilities are allowlisted. |
| XAGF-IAM-004 | Credentials are scoped to least privilege. |
| XAGF-IAM-005 | Privileged access is periodically reviewed. |
| XAGF-IAM-006 | Revocation / kill-switch procedures exist for production agents. |

## Secrets & key management

| ID | Control |
|---|---|
| XAGF-SEC-001 | Secrets are not committed to source control. |
| XAGF-SEC-002 | Production and non-production credentials are separated. |
| XAGF-SEC-003 | Exposed secrets trigger rotation and incident review. |
| XAGF-SEC-004 | D3/D4 secrets are not inserted into general-purpose model prompts. |

## Agentic AI

| ID | Control |
|---|---|
| XAGF-AGT-001 | Every production agent has a unique Agent ID. |
| XAGF-AGT-002 | Agent tool permissions are explicit and bounded. |
| XAGF-AGT-003 | Autonomous loops have step/time/budget limits. |
| XAGF-AGT-004 | High-risk tool calls require approval policy. |
| XAGF-AGT-005 | Material agent actions generate an audit trail. |
| XAGF-AGT-006 | Delegated agents cannot exceed parent authorization. |
| XAGF-AGT-007 | An executor does not independently verify its own critical action. |

## Models & providers

| ID | Control |
|---|---|
| XAGF-MDL-001 | Production models/providers are registered. |
| XAGF-MDL-002 | Sensitive workloads restrict eligible providers. |
| XAGF-MDL-003 | Material model changes trigger re-evaluation. |
| XAGF-MDL-004 | Routing considers capability and policy, not price alone. |
| XAGF-MDL-005 | Fallback models inherit data and permission restrictions. |

## Data & privacy

| ID | Control |
|---|---|
| XAGF-DAT-001 | Data is classified before sensitive AI use. |
| XAGF-DAT-002 | Collection is minimized to defined purpose. |
| XAGF-DAT-003 | Tenant boundaries are enforced. |
| XAGF-DAT-004 | RAG retrieval is authorization-aware. |
| XAGF-DAT-005 | Dataset provenance is recorded for material training/evaluation data. |
| XAGF-DAT-006 | Retention/deletion rules exist for sensitive data. |

## AI security & evaluation

| ID | Control |
|---|---|
| XAGF-AIS-001 | Prompt-injection tests exist for systems using untrusted content. |
| XAGF-AIS-002 | Tool parameters are validated before side effects. |
| XAGF-AIS-003 | Output is validated before material external action. |
| XAGF-AIS-004 | Privileged agents are tested for excessive agency. |
| XAGF-AIS-005 | Memory poisoning and cross-tenant leakage are tested where applicable. |
| XAGF-AIS-006 | Critical evaluation failure blocks production promotion. |

## Software supply chain

| ID | Control |
|---|---|
| XAGF-SDL-001 | Critical changes use reviewed pull requests. |
| XAGF-SDL-002 | Dependencies are inventoried and scanned. |
| XAGF-SDL-003 | Fork/upstream lineage is preserved. |
| XAGF-SDL-004 | Build/deploy provenance links release to source commit. |
| XAGF-SDL-005 | Enterprise releases should produce an SBOM where practical. |
| XAGF-SDL-006 | Untrusted generated code is isolated before privileged execution. |

## Runtime & resilience

| ID | Control |
|---|---|
| XAGF-RUN-001 | Staging and production are separated. |
| XAGF-RUN-002 | Rollback exists for material deployments. |
| XAGF-RUN-003 | Critical services define recovery objectives. |
| XAGF-RUN-004 | Public endpoints have appropriate abuse/rate controls. |
| XAGF-RUN-005 | High-risk autonomous systems can be contained quickly. |

## Incident response

| ID | Control |
|---|---|
| XAGF-IR-001 | AI/security incidents have severity classification. |
| XAGF-IR-002 | Logs/evidence are preserved during containment. |
| XAGF-IR-003 | Recovery requires independent verification. |
| XAGF-IR-004 | Post-incident controls are updated from lessons learned. |

## Third party

| ID | Control |
|---|---|
| XAGF-TPR-001 | Material providers are registered. |
| XAGF-TPR-002 | Provider data/security terms are reviewed according to risk. |
| XAGF-TPR-003 | Critical dependencies have exit/fallback considerations. |
| XAGF-TPR-004 | A technology dependency is not represented as a formal partnership without evidence. |
