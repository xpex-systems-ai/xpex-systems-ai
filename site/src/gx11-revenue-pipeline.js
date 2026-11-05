// GX-11.0 — Pure commercial pipeline contracts, no database, network or payment side effects.
// Import on the server only after authenticated tenant authorization is enforced.
export const STAGES = Object.freeze([
  'discovered','evidence_verified','qualified','contacted','response_received',
  'scoping','proposal_sent','accepted','delivery_in_progress',
  'accepted_delivery','payment_verified','closed_lost'
]);
export const DEMAND_TYPES = Object.freeze(['direct_buyer_need','partner_pathway','research_only']);
const stageSet = new Set(STAGES);
const demandSet = new Set(DEMAND_TYPES);
const clean = (value,max=512) => typeof value === 'string' ? value.trim().slice(0,max) : '';
const hasHttpUrl = value => {
  try { const url = new URL(value); return ['https:','http:'].includes(url.protocol) && !!url.hostname && !url.username && !url.password; }
  catch { return false; }
};
const fail = reason => ({ok:false,reason});
const success = value => ({ok:true,value});

export function validateDemand(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return fail('INVALID_DEMAND');
  const organizationId = clean(input.organizationId,64);
  const sourceId = clean(input.sourceId,160);
  const company = clean(input.company,180);
  const sourceUrl = clean(input.sourceUrl,2048);
  const description = clean(input.problem,2000);
  const evidence = clean(input.evidence,2048);
  const demandType = clean(input.demandType,40);
  if (!/^[0-9a-f-]{36}$/i.test(organizationId)) return fail('TENANT_REQUIRED');
  if (!sourceId || !company || !description) return fail('MANDATORY_FIELDS');
  if (!hasHttpUrl(sourceUrl) || !evidence) return fail('EXTERNAL_EVIDENCE_REQUIRED');
  if (!demandSet.has(demandType)) return fail('INVALID_DEMAND_CLASS');
  if (demandType === 'direct_buyer_need' && !clean(input.buyerNeedEvidence,1500)) return fail('BUYER_NEED_NOT_VERIFIED');
  return success({organizationId,sourceId,company,sourceUrl,problem:description,evidence,demandType,
    buyerNeedEvidence:clean(input.buyerNeedEvidence,1500),stage:'discovered',
    budgetKnown:input.budgetKnown === true,contactApproved:input.contactApproved === true});
}

// Stable, non-secret identity for deduplication at a tenant-scoped persistence layer.
// Persist under UNIQUE(organization_id, source_id). Caller must bind organizationId
// to the authenticated session, never a browser-submitted arbitrary tenant.
export function demandKey(record) {
  if (!record?.organizationId || !record?.sourceId) throw Error('INVALID_DEMAND_KEY');
  return record.organizationId + ':' + record.sourceId;
}

const NEXT = {
  discovered:['evidence_verified','closed_lost'],
  evidence_verified:['qualified','closed_lost'],
  qualified:['contacted','scoping','closed_lost'],
  contacted:['response_received','closed_lost'],
  response_received:['scoping','closed_lost'],
  scoping:['proposal_sent','closed_lost'],
  proposal_sent:['accepted','closed_lost'],
  accepted:['delivery_in_progress','closed_lost'],
  delivery_in_progress:['accepted_delivery','closed_lost'],
  accepted_delivery:['payment_verified','closed_lost'],
  payment_verified:[],
  closed_lost:[]
};

export function transition(record,target,proof={}) {
  if (!record || !stageSet.has(record.stage) || !stageSet.has(target)) return fail('UNKNOWN_STAGE');
  if (!NEXT[record.stage].includes(target)) return fail('INVALID_TRANSITION');
  const evidenceRef = clean(proof.evidenceRef,2048);
  if (!evidenceRef || !hasHttpUrl(evidenceRef)) return fail('EVIDENCE_LINK_REQUIRED');
  if (target==='evidence_verified' && proof.verifierApproved!==true) return fail('INDEPENDENT_VERIFICATION_REQUIRED');
  if (target==='qualified' && proof.decisionMakerConfirmed!==true) return fail('BUYER_QUALIFICATION_REQUIRED');
  if (target==='contacted' && (proof.contactAuthorized!==true || !clean(proof.outboundMessageId))) return fail('CONTACT_EVIDENCE_REQUIRED');
  if (target==='proposal_sent' && (proof.proposalApproved!==true || !clean(proof.proposalId))) return fail('PROPOSAL_APPROVAL_REQUIRED');
  if (target==='accepted' && (proof.contractAccepted!==true || !clean(proof.contractId))) return fail('SIGNED_ACCEPTANCE_REQUIRED');
  if (target==='delivery_in_progress' && proof.accessAuthorized!==true) return fail('DELIVERY_AUTHORIZATION_REQUIRED');
  if (target==='accepted_delivery' && (proof.clientAccepted!==true || proof.independentReviewer!==true)) return fail('DELIVERY_REVIEW_REQUIRED');
  if (target==='payment_verified') {
    if (proof.providerConfirmed!==true || !['coinbase','mercadopago'].includes(proof.provider) ||
        !clean(proof.providerTransactionId) || !clean(proof.contractId) ||
        !clean(proof.currency) || !Number.isFinite(proof.amount) || proof.amount<=0 ||
        proof.reconciled!==true || proof.independentReviewer!==true) return fail('SETTLEMENT_PROOF_REQUIRED');
  }
  const event = Object.freeze({from:record.stage,to:target,evidenceRef,proofType:target,
    provider:target==='payment_verified'?proof.provider:undefined,
    providerTransactionId:target==='payment_verified'?clean(proof.providerTransactionId):undefined});
  return success({...record,stage:target,history:[...(record.history??[]),event]});
}
