import {validateCommercialPayload, commercialPrivacyVersion, commercialUuidPattern} from '../src/omnix-commercial.js';

const tokenPattern=/^[A-Za-z0-9_-]{43,128}$/;
const unavailable=()=>({ok:false,code:'COMMERCIAL_UNAVAILABLE',syntheticOnly:true,customerDataAllowed:false});
function configuration(env){
  if(env.OMNIX_COMMERCIAL_ENABLED!=='true')return;
  const exact=value=>{const u=new URL(value);if(u.protocol!=='https:'||u.origin!==value||u.username||u.password||u.port||!u.hostname.includes('.')||/^\[|^\d+(?:\.\d+){3}$/.test(u.hostname)||/^(?:localhost|metadata\.)/.test(u.hostname))throw Error('CONFIGURATION');return u.origin;};
  return {backend:exact(env.OMNIX_COMMERCIAL_BACKEND_ORIGIN),publicOrigin:exact(env.OMNIX_COMMERCIAL_PUBLIC_ORIGIN),
    token:tokenPattern.test(env.OMNIX_COMMERCIAL_PROXY_TOKEN??'')?env.OMNIX_COMMERCIAL_PROXY_TOKEN:(()=>{throw Error('CONFIGURATION');})()};
}
async function body(req,timeoutMs){
  let raw;
  if(req.body!==undefined)raw=typeof req.body==='string'?req.body:JSON.stringify(req.body);
  else {
    const chunks=[];let size=0,timer;
    const collect=async()=>{for await(const chunk of req){const bytes=Buffer.from(chunk);size+=bytes.length;if(size>4096)throw Error('BODY_LIMIT');chunks.push(bytes);}return Buffer.concat(chunks).toString('utf8');};
    const deadline=new Promise((_,reject)=>{timer=setTimeout(()=>{req.destroy?.();reject(Error('BODY_TIMEOUT'));},timeoutMs);});
    try{raw=await Promise.race([collect(),deadline]);}finally{clearTimeout(timer);}
  }
  if(Buffer.byteLength(raw??'')>4096)throw Error('BODY_LIMIT');
  return JSON.parse(raw);
}
async function jsonResponse(response){
  if(!response.headers.get('content-type')?.includes('application/json'))throw Error('CONTRACT');
  const reader=response.body?.getReader();if(!reader)throw Error('CONTRACT');
  const chunks=[];let size=0;
  try{while(true){const item=await reader.read();if(item.done)break;size+=item.value.byteLength;if(size>8192)throw Error('CONTRACT');chunks.push(item.value);}}
  catch(error){await reader.cancel().catch(()=>{});throw error;}
  const result=new Uint8Array(size);let offset=0;for(const chunk of chunks){result.set(chunk,offset);offset+=chunk.length;}
  return JSON.parse(new TextDecoder().decode(result));
}
export function createCommercialRequestHandler({env=process.env,fetcher=fetch,now=Date.now,bodyTimeoutMs=5000}={}){
  if(!Number.isInteger(bodyTimeoutMs)||bodyTimeoutMs<10||bodyTimeoutMs>5000)throw Error('BOUNDED_BODY_TIMEOUT_REQUIRED');
  let windowAt=now(),attempts=0,active=0;
  return async function handler(req,res){
    res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
    if(!['GET','POST'].includes(req.method)){res.setHeader('Allow','GET, POST');return res.status(405).json({ok:false,code:'COMMERCIAL_METHOD_DENIED'});}
    let config;try{config=configuration(env);}catch{return res.status(503).json(unavailable());}
    if(!config)return res.status(503).json(unavailable());
    const origin=req.headers?.origin;
    if((origin&&origin!==config.publicOrigin)||(req.method==='POST'&&origin!==config.publicOrigin))return res.status(403).json({ok:false,code:'COMMERCIAL_ORIGIN_DENIED'});
    if(req.method==='POST'&&(typeof req.headers?.['content-type']!=='string'||!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'])||
      (req.headers?.['content-encoding']&&req.headers['content-encoding']!=='identity')))return res.status(415).json({ok:false,code:'COMMERCIAL_JSON_REQUIRED'});
    if(now()-windowAt>=60000){windowAt=now();attempts=0;}
    if((req.method==='POST'&&++attempts>10)||active>=2){res.setHeader('Retry-After','60');return res.status(429).json({ok:false,code:'COMMERCIAL_RATE_LIMIT'});}
    active++;
    try{
      let input;
      if(req.method==='POST'){
        try{input=validateCommercialPayload(await body(req,bodyTimeoutMs));}
        catch(error){return res.status(error.message==='BODY_LIMIT'?413:error.message==='BODY_TIMEOUT'?408:400).json({ok:false,code:error.message==='BODY_TIMEOUT'?'COMMERCIAL_REQUEST_TIMEOUT':'INVALID_COMMERCIAL_REQUEST'});}
      }
      // The URL, token and upstream Origin are explicit server configuration.
      // Never forward the caller's Authorization, Host, org, or forwarding headers.
      const response=await fetcher(config.backend+'/api/omnix-commercial/'+(req.method==='GET'?'status':'requests'),{
        method:req.method,redirect:'error',signal:AbortSignal.timeout(5000),headers:{Authorization:'Bearer '+config.token,
          'Content-Type':'application/json',Origin:config.backend},...(input?{body:JSON.stringify(input)}:{})});
      if(!response.ok){const status=[400,409,429].includes(response.status)?response.status:503;return res.status(status).json(status===503?unavailable():{ok:false,code:status===409?'COMMERCIAL_IDEMPOTENCY_CONFLICT':status===429?'COMMERCIAL_RATE_LIMIT':'INVALID_COMMERCIAL_REQUEST'});}
      const data=await jsonResponse(response);
      if(req.method==='GET'){
        if(data?.ok!==true||data.configured!==true||data.persistenceReady!==true||data.syntheticOnly!==true||data.customerDataAllowed!==false||data.privacyVersion!==commercialPrivacyVersion)throw Error('CONTRACT');
        return res.status(200).json({ok:true,configured:true,persistenceReady:true,syntheticOnly:true,customerDataAllowed:false,
          humanDeliveryVerified:false,privacyVersion:commercialPrivacyVersion});
      }
      if(data?.ok!==true||data.requestId!==input.requestId||!commercialUuidPattern.test(data.receiptId??'')||!['QUEUED','ACKNOWLEDGED'].includes(data.delivery)||
         data.recipientAcknowledged!==(data.delivery==='ACKNOWLEDGED')||typeof data.reused!=='boolean'||data.testData!==true||data.customerDataAllowed!==false)throw Error('CONTRACT');
      return res.status(data.reused?200:201).json({ok:true,receiptId:data.receiptId,requestId:data.requestId,delivery:data.delivery,
        recipientAcknowledged:data.recipientAcknowledged,reused:data.reused,testData:true,customerDataAllowed:false});
    }catch{return res.status(503).json(unavailable());}
    finally{active--;}
  };
}
export default createCommercialRequestHandler();
