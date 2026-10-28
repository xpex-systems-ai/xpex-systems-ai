import assert from 'node:assert/strict';
import test from 'node:test';
import {randomBytes,randomUUID} from 'node:crypto';
import {createCommercialRequestHandler} from '../api/omnix-request.js';
import {validateCommercialPayload,commercialIntakeMarkup,commercialPrivacyVersion} from '../src/omnix-commercial.js';

const token=randomBytes(32).toString('base64url'),publicOrigin='https://public.example.invalid',backend='https://backend.example.invalid';
const environment=()=>({OMNIX_COMMERCIAL_ENABLED:'true',OMNIX_COMMERCIAL_BACKEND_ORIGIN:backend,OMNIX_COMMERCIAL_PUBLIC_ORIGIN:publicOrigin,OMNIX_COMMERCIAL_PROXY_TOKEN:token});
const input=()=>({requestId:randomUUID(),name:'TEST DATA Interessado',company:'TEST DATA Empresa',email:'interessado@example.invalid',
  problem:'TEST DATA — precisamos avaliar a configuração autorizada do frontend.',consent:true,privacyVersion:commercialPrivacyVersion,website:'',testData:true});
async function invoke(handler,method='GET',body,headers={}){
  const result={status:0,headers:{}};
  const response={setHeader(k,v){result.headers[k.toLowerCase()]=v;},status(code){result.status=code;return this;},json(value){result.body=value;return this;}};
  await handler({method,body,headers:{...(body===undefined?{}:{'content-type':'application/json',origin:publicOrigin}),...headers}},response);return result;
}
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json'}});
test('commercial input accepts only bounded synthetic general requests, consent and no private/authority fields',()=>{
  const value=input();assert.deepEqual(validateCommercialPayload(value),value);
  for(const patch of [{consent:false},{testData:false},{email:'person@real-company.com'},{website:'spam.invalid'},{organizationId:'untrusted-org'},
    {name:'Real name'},{problem:'password=secret'}, {problem:'{"password":"secret"}'},{problem:'TEST DATA https://user:secret@fixture.invalid'},
    {problem:'{"rewrites":[]}'},{problem:'x'.repeat(1001)},{artifact:{name:'vercel.json'}}])
    assert.throws(()=>validateCommercialPayload({...value,...patch}));
  const html=commercialIntakeMarkup();assert.match(html,/fieldset disabled/);assert.doesNotMatch(html,/type="file"/);assert.match(html,/recebimento humano/i);
});
test('unconfigured receiver refuses without network; Host and forwarded headers cannot substitute configured origin',async()=>{
  let calls=0;const fetcher=async()=>{calls++;throw Error('UNEXPECTED_NETWORK');};
  const missing=createCommercialRequestHandler({env:{},fetcher});assert.equal((await invoke(missing,'GET')).status,503);assert.equal((await invoke(missing,'POST',input())).status,503);assert.equal(calls,0);
  for(const patch of [{OMNIX_COMMERCIAL_PUBLIC_ORIGIN:''},{OMNIX_COMMERCIAL_BACKEND_ORIGIN:'http://backend.example.invalid'},
    {OMNIX_COMMERCIAL_BACKEND_ORIGIN:'https://127.0.0.1'},{OMNIX_COMMERCIAL_BACKEND_ORIGIN:'https://metadata.google.internal'},
    {OMNIX_COMMERCIAL_PROXY_TOKEN:'short'}]){
    const handler=createCommercialRequestHandler({env:{...environment(),...patch},fetcher});assert.equal((await invoke(handler,'GET')).status,503);
  }
  const configured=createCommercialRequestHandler({env:environment(),fetcher});
  const denied=await invoke(configured,'POST',input(),{origin:'https://unapproved.invalid',host:'public.example.invalid','x-forwarded-host':'public.example.invalid'});
  assert.equal(denied.status,403);assert.equal(calls,0);assert.equal(denied.headers['access-control-allow-origin'],undefined);
});
test('configured proxy verifies persisted receipt and never forwards user tokens, arbitrary URLs, or backend/private errors',async()=>{
  const value=input(),receiptId=randomUUID(),calls=[];
  const fetcher=async(url,options)=>{calls.push({url,options});return json(options.method==='GET'?{ok:true,configured:true,persistenceReady:true,syntheticOnly:true,customerDataAllowed:false,privacyVersion:commercialPrivacyVersion}:
    {ok:true,requestId:value.requestId,receiptId,delivery:'QUEUED',recipientAcknowledged:false,reused:false,testData:true,customerDataAllowed:false},options.method==='GET'?200:201);};
  const handler=createCommercialRequestHandler({env:environment(),fetcher});
  const status=await invoke(handler);assert.equal(status.status,200);assert.equal(status.body.humanDeliveryVerified,false);
  const response=await invoke(handler,'POST',value,{authorization:'Bearer PRIVATE_CALLER_TOKEN','x-forwarded-for':'127.0.0.1'});
  assert.equal(response.status,201);assert.equal(response.body.delivery,'QUEUED');assert.equal(response.body.recipientAcknowledged,false);
  assert.equal(calls[1].url,backend+'/api/omnix-commercial/requests');assert.equal(calls[1].options.headers.Authorization,'Bearer '+token);
  assert.equal(calls[1].options.headers.Origin,backend);assert.equal(calls[1].options.redirect,'error');assert.equal(calls[1].options.headers['x-forwarded-for'],undefined);
  assert.ok(!JSON.stringify(response).includes(value.email));assert.ok(!JSON.stringify(response).includes(token));
  const bad=createCommercialRequestHandler({env:environment(),fetcher:async()=>json({ok:true,requestId:value.requestId,receiptId,delivery:'QUEUED',testData:true},201)});
  assert.equal((await invoke(bad,'POST',value)).status,503);
  for(const fetcher of [async()=>new Response('<html>PRIVATE_DETAIL</html>'),async()=>{throw Error('PRIVATE_DETAIL');},async()=>json({secret:'PRIVATE_DETAIL'},503)]){
    const failure=await invoke(createCommercialRequestHandler({env:environment(),fetcher}),'POST',value);assert.equal(failure.status,503);assert.ok(!JSON.stringify(failure).includes('PRIVATE_DETAIL'));
  }
});
test('proxy rate and body bounds apply before processing or network, independent of forwarded IP',async()=>{
  let calls=0,clock=0;const handler=createCommercialRequestHandler({env:environment(),now:()=>clock,fetcher:async()=>{calls++;return json({},503);}});
  assert.equal((await invoke(handler,'POST',{...input(),problem:'x'.repeat(5000)})).status,413);
  for(let n=0;n<9;n++)assert.equal((await invoke(handler,'POST',{...input(),consent:false},{'x-forwarded-for':'192.0.2.'+n})).status,400);
  assert.equal((await invoke(handler,'POST',input(),{'x-forwarded-for':'192.0.2.200'})).status,429);assert.equal(calls,0);
  clock=60001;assert.equal((await invoke(handler,'POST',input())).status,503);assert.equal(calls,1);
});
test('slow request body times out before network and releases admission capacity',async()=>{
  let calls=0,destroyed=false;
  const handler=createCommercialRequestHandler({env:environment(),bodyTimeoutMs:10,fetcher:async()=>{calls++;return json({},503);}});
  const result={status:0,body:undefined},response={setHeader(){},status(code){result.status=code;return this;},json(value){result.body=value;return this;}};
  const request={method:'POST',headers:{origin:publicOrigin,'content-type':'application/json'},[Symbol.asyncIterator](){return {next:()=>new Promise(()=>{})};},destroy(){destroyed=true;}};
  await handler(request,response);assert.equal(result.status,408);assert.equal(result.body.code,'COMMERCIAL_REQUEST_TIMEOUT');assert.equal(destroyed,true);assert.equal(calls,0);
  assert.equal((await invoke(handler,'POST',input())).status,503);assert.equal(calls,1);
});
