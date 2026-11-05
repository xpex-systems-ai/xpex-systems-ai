import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {STAGES,validateDemand,demandKey,transition} from '../src/gx11-revenue-pipeline.js';
const tenant='11111111-1111-4111-8111-111111111111';
const sample={organizationId:tenant,sourceId:'stackone-partner-page-20261105',company:'Synthetic Co',
  sourceUrl:'https://example.com/buyer-need',problem:'One authorized MCP integration',
  evidence:'Synthetic published request',buyerNeedEvidence:'Synthetic scoped direct request',
  demandType:'direct_buyer_need'};
const lead=()=>({...validateDemand(sample).value,history:[]});
const to=(r,stage,extra={})=>transition(r,stage,{evidenceRef:'https://example.com/receipts/'+stage,...extra});
test('validates explicit source, tenant and true buyer evidence',()=>{
  const good=validateDemand(sample);
  assert.equal(good.ok,true);
  assert.equal(good.value.stage,'discovered');
  assert.equal(demandKey(good.value),tenant+':'+sample.sourceId);
  assert.equal(validateDemand({...sample,sourceUrl:'javascript:alert(1)'}).ok,false);
  assert.equal(validateDemand({...sample,organizationId:''}).reason,'TENANT_REQUIRED');
  assert.equal(validateDemand({...sample,demandType:'direct_buyer_need',buyerNeedEvidence:''}).reason,'BUYER_NEED_NOT_VERIFIED');
  assert.equal(validateDemand({...sample,demandType:'partner_pathway',buyerNeedEvidence:''}).ok,true);
});
test('cannot skip discovery, qualify leads without proof or send unauthorized messages',()=>{
  assert.equal(to(lead(),'payment_verified').reason,'INVALID_TRANSITION');
  assert.equal(to(lead(),'evidence_verified').reason,'INDEPENDENT_VERIFICATION_REQUIRED');
  const verified=to(lead(),'evidence_verified',{verifierApproved:true}).value;
  assert.equal(to(verified,'qualified').reason,'BUYER_QUALIFICATION_REQUIRED');
  const qualified=to(verified,'qualified',{decisionMakerConfirmed:true}).value;
  assert.equal(to(qualified,'contacted').reason,'CONTACT_EVIDENCE_REQUIRED');
});
test('requires explicit proposal approval, contract, review and provider settlement',()=>{
  let r=lead();
  const path=[
    ['evidence_verified',{verifierApproved:true}],
    ['qualified',{decisionMakerConfirmed:true}],
    ['scoping',{}]
  ];
  for(const [step,proof] of path){const t=to(r,step,proof);assert.equal(t.ok,true);r=t.value;}
  assert.equal(to(r,'proposal_sent').reason,'PROPOSAL_APPROVAL_REQUIRED');
  r=to(r,'proposal_sent',{proposalApproved:true,proposalId:'PROPOSAL-SYNTHETIC'}).value;
  assert.equal(to(r,'accepted').reason,'SIGNED_ACCEPTANCE_REQUIRED');
  r=to(r,'accepted',{contractAccepted:true,contractId:'CONTRACT-SYNTHETIC'}).value;
  assert.equal(to(r,'delivery_in_progress').reason,'DELIVERY_AUTHORIZATION_REQUIRED');
  r=to(r,'delivery_in_progress',{accessAuthorized:true}).value;
  assert.equal(to(r,'accepted_delivery',{clientAccepted:true}).reason,'DELIVERY_REVIEW_REQUIRED');
  r=to(r,'accepted_delivery',{clientAccepted:true,independentReviewer:true}).value;
  const partial={provider:'mercadopago',providerConfirmed:true,providerTransactionId:'mock_tx',contractId:'synthetic_contract',currency:'BRL',amount:1500};
  assert.equal(to(r,'payment_verified',partial).reason,'SETTLEMENT_PROOF_REQUIRED');
  const finished=to(r,'payment_verified',{...partial,reconciled:true,independentReviewer:true});
  assert.equal(finished.ok,true);
  assert.equal(finished.value.stage,'payment_verified');
  assert.equal(finished.value.history.length,8);
  assert.equal(to(finished.value,'closed_lost').reason,'INVALID_TRANSITION');
});
test('consumer-facing offer registry must state that all payments and listings are disabled',()=>{
  const gx10=JSON.parse(requireJson('../public/data/gx10-enterprise-services.json'));
  const gx11=JSON.parse(requireJson('../public/data/commercial-offers-v1.json'));
  assert.equal(gx10.channels.coinbase.checkout_live,false);
  assert.equal(gx10.channels.mercadopago.checkout_live,false);
  assert.equal(gx10.channels.mercadolivre.listing_active,false);
  assert.equal(gx11.status,'proposal_only');
  assert.equal(gx11.offers.length,2);
});
function requireJson(file){return readFileSync(new URL(file,import.meta.url),'utf8');}
