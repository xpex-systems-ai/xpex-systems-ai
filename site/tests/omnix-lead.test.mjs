import assert from 'node:assert/strict';
import test from 'node:test';
import {randomBytes,randomUUID} from 'node:crypto';
import {createLeadRequestHandler} from '../api/omnix-lead.js';
import {leadIntakeMarkup,leadPrivacyVersion,validateLeadPayload} from '../src/omnix-lead.js';

const token=randomBytes(32).toString('base64url'),backend='https://backend.example.invalid',publicOrigin='https://public.example.invalid';
const env=()=>({OMNIX_LEAD_ENABLED:'true',OMNIX_LEAD_MODE:'real',OMNIX_LEAD_BACKEND_ORIGIN:backend,OMNIX_LEAD_PUBLIC_ORIGIN:publicOrigin,OMNIX_LEAD_PROXY_TOKEN:token});
const input=()=>({requestId:randomUUID(),name:'Fixture Contact',company:'Fixture Company',email:'fixture@example.invalid',needType:'general-question',description:'TEST DATA general inquiry without private technical details.',consent:true,privacyVersion:leadPrivacyVersion,website:'',challengeToken:randomBytes(32).toString('base64url')});
const status=()=>({ok:true,persistenceReady:true,dataMode:'real',leadDataAllowed:true,auditCustomerDataAllowed:false,humanDeliveryVerified:false,privacyVersion:leadPrivacyVersion,privacyNoticeUrl:publicOrigin+'/?view=privacy',retentionDays:30,antiSpam:'approved-institutional-challenge-v1'});
const json=(value,code=200)=>new Response(JSON.stringify(value),{status:code,headers:{'Content-Type':'application/json'}});
async function invoke(handler,method='GET',body,headers={}){
  const result={status:0,headers:{}};const res={setHeader(k,v){result.headers[k.toLowerCase()]=v;},status(code){result.status=code;return this;},json(value){result.body=value;return this;}};
  await handler({method,body,headers:{...(body===undefined?{}:{origin:publicOrigin,'content-type':'application/json'}),...headers}},res);return result;
}
test('lead fields are separate and bounded, privacy consent is explicit, uploads/secrets/authority flags fail and UI defaults disabled',()=>{
  const value=input();assert.deepEqual(validateLeadPayload(value),value);assert.throws(()=>validateLeadPayload(value,{mode:'synthetic'}));
  for(const patch of [{consent:false},{recipientUserId:'attacker'},{organizationId:'attacker'},{signed:true},{paymentConfirmed:true},{artifact:'private'},
    {description:'password=PRIVATE_VALUE'},{description:'{"rewrites":[]}'},{description:'postgresql://private.invalid'},{description:'x'.repeat(1001)},{challengeToken:''}])assert.throws(()=>validateLeadPayload({...value,...patch}));
  const html=leadIntakeMarkup();assert.match(html,/fieldset disabled/);assert.doesNotMatch(html,/type="file"/);assert.match(html,/30 dias/);assert.match(html,/não autoriza acesso/);
});
test('default/unapproved lead receiver stays closed before reading contact body; Host and forwarded headers cannot grant authority',async()=>{
  let calls=0,read=false;const fetcher=async()=>{calls++;return json({private:'PRIVATE_ERROR'},503);};
  const missing=createLeadRequestHandler({env:{},fetcher});assert.equal((await invoke(missing)).status,503);assert.equal((await invoke(missing,'POST',{action:'request',...input()})).status,503);assert.equal(calls,0);
  const handler=createLeadRequestHandler({env:env(),fetcher});
  const refused=await invoke(handler,'POST',{action:'request',...input()},{origin:'https://attacker.invalid',host:'public.example.invalid','x-forwarded-host':'public.example.invalid'});assert.equal(refused.status,403);assert.equal(calls,0);
  const response={setHeader(){},status(code){this.code=code;return this;},json(value){this.body=value;return this;}};
  await handler({method:'POST',headers:{origin:publicOrigin,'content-type':'application/json'},get body(){read=true;throw Error('BODY_SHOULD_STAY_UNREAD');}},response);
  assert.equal(response.code,503);assert.equal(read,false);assert.equal(calls,1);assert.ok(!JSON.stringify(response.body).includes('PRIVATE_ERROR'));
  for(const patch of [{OMNIX_LEAD_MODE:''},{OMNIX_LEAD_PUBLIC_ORIGIN:''},{OMNIX_LEAD_BACKEND_ORIGIN:'http://backend.example.invalid'},{OMNIX_LEAD_PUBLIC_ORIGIN:'https://*.vercel.app'},{OMNIX_LEAD_PROXY_TOKEN:'short'}])assert.equal((await invoke(createLeadRequestHandler({env:{...env(),...patch},fetcher}))).status,503);
});
test('approved proxy validates readiness/challenge/SQL receipt and never forwards user authority or fabricates delivery',async()=>{
  const value=input(),receiptId=randomUUID(),calls=[];
  const fetcher=async(url,options)=>{
    calls.push({url,options});if(url.endsWith('/status'))return json(status());
    if(url.endsWith('/challenge'))return json({ok:true,challengeToken:value.challengeToken,minimumWaitMs:2000,expiresInSeconds:300},201);
    return json({ok:true,requestId:value.requestId,receiptId,delivery:'QUEUED',recipientAcknowledged:false,state:'leadReceived',reused:false,dataMode:'real',auditCustomerDataAllowed:false,humanDeliveryVerified:false,expiresAt:new Date(Date.now()+30*86400000).toISOString()},201);
  };
  const handler=createLeadRequestHandler({env:env(),fetcher});assert.equal((await invoke(handler)).body.leadDataAllowed,true);
  assert.equal((await invoke(handler,'POST',{action:'challenge'})).status,201);
  const result=await invoke(handler,'POST',{action:'request',...value},{authorization:'Bearer PRIVATE_BROWSER_TOKEN','x-organization-id':'attacker'});
  assert.equal(result.status,201);assert.equal(result.body.delivery,'QUEUED');assert.equal(result.body.recipientAcknowledged,false);assert.equal(result.body.humanDeliveryVerified,false);assert.equal(result.body.auditCustomerDataAllowed,false);
  assert.equal(calls.length,3);assert.equal(calls[2].url,backend+'/api/omnix-leads/requests');assert.equal(calls[2].options.headers.Authorization,'Bearer '+token);assert.equal(calls[2].options.headers.Origin,backend);assert.equal(calls[2].options.headers['x-organization-id'],undefined);assert.equal(calls[2].options.redirect,'error');
  for(const privateValue of [value.email,value.description,value.name,token,'PRIVATE_BROWSER_TOKEN'])assert.ok(!JSON.stringify(result).includes(privateValue));
  for(const broken of [{...status(),leadDataAllowed:false},{...status(),privacyNoticeUrl:'https://attacker.invalid/privacy'},{...status(),auditCustomerDataAllowed:true}])assert.equal((await invoke(createLeadRequestHandler({env:env(),fetcher:async()=>json(broken)}))).status,503);
  const badReceipt=createLeadRequestHandler({env:env(),fetcher:async url=>url.endsWith('/status')?json(status()):json({ok:true,receiptId},201)});assert.equal((await invoke(badReceipt,'POST',{action:'request',...value})).status,503);
});
test('lead proxy bounds rate, body bytes and body deadline without relying on forwarded IP',async()=>{
  let count=0,clock=0;const handler=createLeadRequestHandler({env:env(),now:()=>clock,fetcher:async url=>{count++;return url.endsWith('/status')?json(status()):json({},503);},bodyTimeoutMs:10});
  assert.equal((await invoke(handler,'POST',{action:'request',...input(),description:'x'.repeat(5000)})).status,413);
  for(let i=0;i<19;i++)assert.equal((await invoke(handler,'POST',{action:'request',...input(),consent:false},{'x-forwarded-for':'192.0.2.'+i})).status,400);
  assert.equal((await invoke(handler,'POST',{action:'challenge'})).status,429);assert.equal(count,1);clock=60001;
  let destroyed=false;const res={setHeader(){},status(code){this.code=code;return this;},json(value){this.body=value;return this;}};
  await handler({method:'POST',headers:{origin:publicOrigin,'content-type':'application/json'},[Symbol.asyncIterator](){return {next:()=>new Promise(()=>{})};},destroy(){destroyed=true;}},res);
  assert.equal(res.code,408);assert.equal(destroyed,true);assert.equal(res.body.code,'LEAD_REQUEST_TIMEOUT');
});
