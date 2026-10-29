import {leadPrivacyVersion,leadStates,leadUuid,validateLeadPayload} from '../src/omnix-lead.js';

const closed=()=>({ok:false,code:'LEAD_ADMISSION_CLOSED',leadDataAllowed:false,auditCustomerDataAllowed:false,humanDeliveryVerified:false});
function configuration(env){
  if(env.OMNIX_LEAD_ENABLED!=='true')return;
  const exact=value=>{const u=new URL(value);if(u.protocol!=='https:'||u.origin!==value||u.username||u.password||u.port||!u.hostname.includes('.')||!/^[a-z0-9][a-z0-9.-]*[a-z0-9]$/i.test(u.hostname)||/^\[|^\d+(?:\.\d+){3}$/.test(u.hostname)||/^(?:localhost|metadata\.)/.test(u.hostname))throw Error('CONFIGURATION');return u.origin;};
  if(!['synthetic','real'].includes(env.OMNIX_LEAD_MODE)||!/^[A-Za-z0-9_-]{43,128}$/.test(env.OMNIX_LEAD_PROXY_TOKEN??''))throw Error('CONFIGURATION');
  return {backend:exact(env.OMNIX_LEAD_BACKEND_ORIGIN),publicOrigin:exact(env.OMNIX_LEAD_PUBLIC_ORIGIN),token:env.OMNIX_LEAD_PROXY_TOKEN,mode:env.OMNIX_LEAD_MODE};
}
async function requestBody(req,timeoutMs){
  let raw;
  if(req.body!==undefined)raw=typeof req.body==='string'?req.body:JSON.stringify(req.body);
  else{
    const chunks=[];let size=0,timer;
    const collect=async()=>{for await(const chunk of req){const bytes=Buffer.from(chunk);size+=bytes.length;if(size>4096)throw Error('BODY_LIMIT');chunks.push(bytes);}return Buffer.concat(chunks).toString('utf8');};
    const timeout=new Promise((_,reject)=>{timer=setTimeout(()=>{req.destroy?.();reject(Error('BODY_TIMEOUT'));},timeoutMs);});
    try{raw=await Promise.race([collect(),timeout]);}finally{clearTimeout(timer);}
  }
  if(Buffer.byteLength(raw??'')>4096)throw Error('BODY_LIMIT');return JSON.parse(raw);
}
async function responseBody(response){
  if(!response.headers.get('content-type')?.includes('application/json'))throw Error('CONTRACT');
  const reader=response.body?.getReader();if(!reader)throw Error('CONTRACT');
  const chunks=[];let size=0;
  try{while(true){const value=await reader.read();if(value.done)break;size+=value.value.length;if(size>8192)throw Error('CONTRACT');chunks.push(value.value);}}catch(error){await reader.cancel().catch(()=>{});throw error;}
  const result=new Uint8Array(size);let index=0;for(const chunk of chunks){result.set(chunk,index);index+=chunk.length;}return JSON.parse(new TextDecoder().decode(result));
}
export function createLeadRequestHandler({env=process.env,fetcher=fetch,now=Date.now,bodyTimeoutMs=5000}={}){
  if(!Number.isInteger(bodyTimeoutMs)||bodyTimeoutMs<10||bodyTimeoutMs>5000)throw Error('LEAD_BODY_TIMEOUT_REQUIRED');
  let windowAt=now(),attempts=0,active=0,healthAt,readiness,probing=false,healthKey;
  const upstream=(config,route,method='GET',input)=>fetcher(config.backend+'/api/omnix-leads/'+route,{
    method,redirect:'error',signal:AbortSignal.timeout(5000),headers:{Authorization:'Bearer '+config.token,Origin:config.backend,'Content-Type':'application/json'},...(input?{body:JSON.stringify(input)}:{})});
  const ready=async(config)=>{
    const key=JSON.stringify([config.backend,config.publicOrigin,config.mode,config.token]);
    if(key===healthKey&&healthAt!==undefined&&now()-healthAt<5000)return readiness;
    if(probing)return;probing=true;
    try{
      const response=await upstream(config,'status');if(!response.ok)throw Error('CLOSED');
      const data=await responseBody(response),notice=new URL(data.privacyNoticeUrl);
      if(data.ok!==true||data.persistenceReady!==true||data.dataMode!==config.mode||data.leadDataAllowed!==(config.mode==='real')||data.auditCustomerDataAllowed!==false||data.privacyVersion!==leadPrivacyVersion||data.retentionDays!==30||data.antiSpam!=='approved-institutional-challenge-v1'||notice.origin!==config.publicOrigin||notice.username||notice.password||notice.hash)throw Error('CONTRACT');
      readiness={ok:true,persistenceReady:true,dataMode:config.mode,leadDataAllowed:config.mode==='real',auditCustomerDataAllowed:false,humanDeliveryVerified:false,privacyVersion:leadPrivacyVersion,privacyNoticeUrl:notice.href,retentionDays:30,antiSpam:data.antiSpam};
    }catch{readiness=undefined;}finally{healthKey=key;healthAt=now();probing=false;}
    return readiness;
  };
  return async function handler(req,res){
    res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
    if(!['GET','POST'].includes(req.method)){res.setHeader('Allow','GET, POST');return res.status(405).json({ok:false,code:'LEAD_METHOD_DENIED'});}
    let config;try{config=configuration(env);}catch{return res.status(503).json(closed());}if(!config)return res.status(503).json(closed());
    const origin=req.headers?.origin;
    if((origin&&origin!==config.publicOrigin)||(req.method==='POST'&&origin!==config.publicOrigin))return res.status(403).json({ok:false,code:'LEAD_ORIGIN_DENIED'});
    if(req.method==='POST'&&(typeof req.headers?.['content-type']!=='string'||!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'])||(req.headers['content-encoding']&&req.headers['content-encoding']!=='identity')))return res.status(415).json({ok:false,code:'LEAD_JSON_REQUIRED'});
    if(now()-windowAt>=60000){windowAt=now();attempts=0;}
    if(++attempts>20||active>=2){res.setHeader('Retry-After','60');return res.status(429).json({ok:false,code:'LEAD_RATE_LIMIT'});}active++;
    try{
      // Approval/recipient/persistence must be ready before reading a contact body.
      // Backend repeats the current channel checks on every mutation.
      const status=await ready(config);if(!status)return res.status(503).json(closed());
      if(req.method==='GET')return res.status(200).json(status);
      let input,action;
      if(req.method==='POST'){
        try{
          const value=await requestBody(req,bodyTimeoutMs);action=value?.action;
          if(action==='challenge'){if(Object.keys(value).length!==1)throw Error('INPUT');input={};}
          else if(action==='request'){const {action:_action,...fields}=value;input=validateLeadPayload(fields,{mode:config.mode});}
          else throw Error('INPUT');
        }catch(error){return res.status(error.message==='BODY_LIMIT'?413:error.message==='BODY_TIMEOUT'?408:400).json({ok:false,code:error.message==='BODY_TIMEOUT'?'LEAD_REQUEST_TIMEOUT':'LEAD_INVALID_INPUT'});}
      }
      const response=await upstream(config,action==='challenge'?'challenge':'requests','POST',input);
      if(!response.ok){const status=[400,409,429].includes(response.status)?response.status:503;return res.status(status).json(status===503?closed():{ok:false,code:status===409?'LEAD_IDEMPOTENCY_CONFLICT':status===429?'LEAD_RATE_LIMIT':'LEAD_INVALID_INPUT'});}
      const data=await responseBody(response);
      if(action==='challenge'){
        if(data.ok!==true||!/^[A-Za-z0-9_-]{43}$/.test(data.challengeToken??'')||data.minimumWaitMs!==2000||data.expiresInSeconds!==300)throw Error('CONTRACT');
        return res.status(201).json({ok:true,challengeToken:data.challengeToken,minimumWaitMs:2000,expiresInSeconds:300});
      }
      if(data.ok!==true||data.requestId!==input.requestId||!leadUuid.test(data.receiptId??'')||!['QUEUED','ACKNOWLEDGED'].includes(data.delivery)||data.recipientAcknowledged!==(data.delivery==='ACKNOWLEDGED')||typeof data.reused!=='boolean'||data.dataMode!==config.mode||data.auditCustomerDataAllowed!==false||!leadStates.includes(data.state)||!Number.isFinite(Date.parse(data.expiresAt)))throw Error('CONTRACT');
      return res.status(data.reused?200:201).json({ok:true,requestId:data.requestId,receiptId:data.receiptId,delivery:data.delivery,recipientAcknowledged:data.recipientAcknowledged,reused:data.reused,dataMode:data.dataMode,state:data.state,expiresAt:data.expiresAt,auditCustomerDataAllowed:false,humanDeliveryVerified:false});
    }catch{return res.status(503).json(closed());}finally{active--;}
  };
}
export default createLeadRequestHandler();
