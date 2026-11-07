import {createHash} from "node:crypto";
function invalid(msg){throw Object.assign(new Error(msg),{status:400});}
function isPrivate(host){
 const h=host.toLowerCase();
 if(h==="localhost"||h.endsWith(".local")||h.endsWith(".internal")||h==="::1"||h==="[::1]")return true;
 if(/^\d+\.\d+\.\d+\.\d+$/.test(h)){
  const a=h.split(".").map(Number);
  if(a.some(x=>x<0||x>255))return true;
  return a[0]===10||a[0]===0||a[0]===127||a[0]>=224||(a[0]===172&&a[1]>=16&&a[1]<=31)||(a[0]===192&&a[1]===168)||(a[0]===169&&a[1]===254);
 }
 return false;
}
export function auditAgentContract(m){
 if(!m||typeof m!=="object"||Array.isArray(m))invalid("Manifesto JSON obrigatório.");
 const raw=JSON.stringify(m);
 if(raw.length>16000)invalid("Manifesto excede 16 KB.");
 const fields=Object.keys(m).map(x=>x.toLowerCase());
 if(fields.some(x=>["privatekey","apikey","password","seedphrase","mnemonic","accesstoken","bearertoken","secret"].includes(x)))invalid("Remova credenciais do manifesto.");
 const checks=[];
 const add=(id,passed,detail)=>checks.push({id,passed,detail});
 const name=String(m.name||"").trim();
 add("identity",name.length>=3&&name.length<=90,"Nome público de 3–90 caracteres");
 let url=null,https=false,publicHost=false;
 try{url=new URL(String(m.endpoint||""));https=url.protocol==="https:";publicHost=!isPrivate(url.hostname)&&Boolean(url.hostname.includes("."))&&!url.username&&!url.password;}catch{}
 add("https",https,"Endpoint HTTPS obrigatório");
 add("public_host",publicHost,"Host público, sem endereço local, credenciais na URL ou rede privada");
 const auth=String(m.auth||"");
 add("auth_defined",["oauth2","api_key","none"].includes(auth),"Autenticação declarada: oauth2, api_key ou none");
 const writes=m.writeActions===true;
 add("human_approval",!writes||m.requiresHumanApproval===true,"Ações de escrita exigem aprovação humana");
 add("sensitive_data",!(m.sensitiveData===true&&auth==="none"),"Dados sensíveis não podem ser expostos sem autenticação");
 const tools=Array.isArray(m.tools)?m.tools:[],names=tools.map(x=>typeof x==="string"?x:"");
 add("tools_schema",tools.length>=1&&tools.length<=20&&names.every(x=>/^[a-z][a-z0-9_]{2,65}$/.test(x))&&new Set(names).size===names.length,"1–20 ferramentas com identificadores únicos");
 const passed=checks.filter(x=>x.passed).length;
 const canonical={name,endpoint:url?url.origin+url.pathname:null,auth,writes,sensitiveData:m.sensitiveData===true,tools:names,checks:checks.map(x=>[x.id,x.passed])};
 const digest=createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
 return {schema:"gxeon.agent-contract.v1",reportId:"gx-"+digest.slice(0,16),sha256:digest,
 status:passed===checks.length?"REVIEW_CANDIDATE":"NEEDS_REMEDIATION",
 checks,score:{passed,total:checks.length},liveProbePerformed:false,certified:false,
 paymentsVerified:false,authorizationChecked:false,
 notice:"Auditoria declarativa do manifesto; não prova identidade, disponibilidade, segurança real nem transações. Não recebe chaves ou tokens.",
 next:"Submeter endpoint e permissões a avaliação independente e testes autorizados antes de contratação."};
}
