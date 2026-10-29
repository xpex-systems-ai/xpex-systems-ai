export const leadPrivacyVersion='gx050-lead-v1';
export const leadUuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
export const leadStates=['leadReceived','proposalPrepared','contractSigned','accessAuthorized','auditInReview','reportDelivered','clientAccepted','paymentConfirmed'];
const privateContent=/(?:-----BEGIN[^\n]*PRIVATE KEY-----|\bBearer\s+[A-Za-z0-9._~-]{12,}|\b(?:sk_live_|sk_test_|gh[pousr]_|github_pat_)[A-Za-z0-9_]{12,}|\b(?:password|passwd|senha|token|secret|api[_-]?key|access[_-]?token|client[_-]?secret|private[_-]?key|mnemonic|database_url)["']?\s*[:=]\s*["']?\S+|postgres(?:ql)?:\/\/|https?:\/\/[^\s/@:]+:[^\s/@]+@|["'](?:rewrites|headers|routes)["']\s*:)/i;
export function validateLeadPayload(value,{mode='real',requireChallenge=true}={}){
  const expected=['requestId','name','company','email','needType','description','consent','privacyVersion','website','challengeToken'];
  if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==expected.length||Object.keys(value).some(k=>!expected.includes(k))||
    typeof value.requestId!=='string'||!leadUuid.test(value.requestId)||value.consent!==true||value.privacyVersion!==leadPrivacyVersion||value.website!==''||
    !['configuration-integrity','enterprise-proposal','general-question'].includes(value.needType)||
    typeof value.challengeToken!=='string'||(requireChallenge&&!/^[A-Za-z0-9_-]{43}$/.test(value.challengeToken)))throw Error('LEAD_INVALID_INPUT');
  const text=(key,min,max)=>{const raw=value[key];if(typeof raw!=='string'||raw.trim().length<min||raw.trim().length>max||Array.from(raw).some(c=>{const n=c.codePointAt(0);return (n<32&&![9,10,13].includes(n))||n===127;}))throw Error('LEAD_INVALID_INPUT');return raw.trim();};
  const name=text('name',2,120),company=text('company',2,160),email=text('email',3,254),description=text('description',10,1000);
  if(!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)||/[\r\n]/.test(name+company+email)||privateContent.test([name,company,email,description].join('\n')))throw Error('LEAD_PRIVATE_OR_INVALID_INPUT');
  if(mode==='synthetic'&&(!name.startsWith('TEST DATA ')||!company.startsWith('TEST DATA ')||!email.toLowerCase().endsWith('@example.invalid')))throw Error('LEAD_SYNTHETIC_DATA_REQUIRED');
  if(!['real','synthetic'].includes(mode))throw Error('LEAD_ADMISSION_CLOSED');
  return {requestId:value.requestId.toLowerCase(),name,company,email,needType:value.needType,description,consent:true,privacyVersion:leadPrivacyVersion,website:'',challengeToken:value.challengeToken};
}
export function leadIntakeMarkup(){
  return `<section class="xp-section" id="omnix-lead" data-omnix-lead-section><p class="xp-kicker">CONTATO EMPRESARIAL / ABERTURA SOB APROVAÇÃO</p><h2>Uma necessidade geral.<br/><em>Um registro verificável.</em></h2>
    <p>Esta entrada separa contato comercial de uma auditoria técnica. O registro não autoriza acesso, cria contrato, confirma pagamento ou recebe arquivos de clientes. A coleta real depende de canal institucional, privacidade e operação aprovados.</p>
    <div class="xp-card"><p data-omnix-lead-state role="status" aria-live="polite">Conferindo a abertura do canal de leads…</p>
    <form data-omnix-lead class="agent-api-form"><fieldset disabled data-omnix-lead-fields style="border:0;padding:0;margin:0;min-width:0"><legend>Contato e necessidade geral</legend>
      <p><label for="omnix-lead-name">Nome do contato</label><input id="omnix-lead-name" name="name" type="text" minlength="2" maxlength="120" autocomplete="off" required></p>
      <p><label for="omnix-lead-company">Empresa</label><input id="omnix-lead-company" name="company" type="text" minlength="2" maxlength="160" autocomplete="off" required></p>
      <p><label for="omnix-lead-email">E-mail para contato</label><input id="omnix-lead-email" name="email" type="email" maxlength="254" autocomplete="off" required></p>
      <p><label for="omnix-lead-need">Tipo de necessidade</label><select id="omnix-lead-need" name="needType"><option value="configuration-integrity">Configuration Integrity</option><option value="enterprise-proposal">Proposta empresarial</option><option value="general-question">Dúvida geral</option></select></p>
      <p><label for="omnix-lead-description">Descrição geral, sem configurações ou credenciais</label><textarea id="omnix-lead-description" name="description" minlength="10" maxlength="1000" required></textarea></p>
      <input name="website" type="text" tabindex="-1" autocomplete="off" hidden aria-hidden="true">
      <p><label><input type="checkbox" name="consent" style="width:auto" required> Li o aviso desta entrada e autorizo o registro destes dados para avaliar minha necessidade e preparar um possível retorno comercial. Não envio dados técnicos, dados de terceiros, arquivos ou segredos.</label></p>
      <button class="xp-button xp-gold" type="submit">Registrar contato, se o canal estiver aberto →</button>
    </fieldset></form>
    <p class="xp-small-note">Finalidade: triagem comercial e possível retorno pelo responsável autorizado. Contato e descrição expiram em 30 dias; a rotina de descarte gera um recibo verificável e exige operação autorizada. Não há newsletter ou marketing automático. Solicitações de privacidade usam o canal institucional publicado. <a class="xp-link" data-omnix-lead-privacy href="/?view=privacy">Aviso de privacidade aplicável →</a></p>
    <p data-omnix-lead-receipt role="status" aria-live="polite"></p><a class="xp-link" href="/?view=company#contact">Consultar o canal institucional publicado →</a></div></section>`;
}
export async function initLeadIntake(root=document,{fetcher=fetch,uuid=()=>crypto.randomUUID(),wait=ms=>new Promise(resolve=>setTimeout(resolve,ms))}={}){
  const form=root.querySelector('[data-omnix-lead]');if(!form)return;
  const fields=root.querySelector('[data-omnix-lead-fields]'),state=root.querySelector('[data-omnix-lead-state]'),receipt=root.querySelector('[data-omnix-lead-receipt]');
  let mode,requestId,previous;
  const json=async(response)=>{if(!response.headers.get('content-type')?.includes('application/json'))throw Error('UNCONFIRMED');return response.json();};
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(!mode||fields.disabled)return;
    const values=new FormData(form),candidate={name:String(values.get('name')??''),company:String(values.get('company')??''),email:String(values.get('email')??''),needType:String(values.get('needType')??''),description:String(values.get('description')??''),consent:values.get('consent')==='on',privacyVersion:leadPrivacyVersion,website:String(values.get('website')??''),challengeToken:''};
    const fingerprint=JSON.stringify(candidate);if(previous!==fingerprint){requestId=uuid();previous=fingerprint;}
    let input;try{input=validateLeadPayload({requestId,...candidate},{mode,requireChallenge:false});requestId=input.requestId;}catch{receipt.textContent='Revise os campos e o consentimento; não inclua arquivos, configurações ou segredos. Nenhum registro foi confirmado.';return;}
    fields.disabled=true;receipt.textContent='Validando proteção contra abuso e aguardando persistência…';
    try{
      const challengeResponse=await fetcher('/api/omnix-lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'challenge'}),signal:AbortSignal.timeout(8000)}),challenge=await json(challengeResponse);
      if(!challengeResponse.ok||challenge.ok!==true||!/^[A-Za-z0-9_-]{43}$/.test(challenge.challengeToken??'')||challenge.minimumWaitMs!==2000||challenge.expiresInSeconds!==300)throw Error('UNCONFIRMED');
      await wait(challenge.minimumWaitMs);input.challengeToken=challenge.challengeToken;
      const response=await fetcher('/api/omnix-lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'request',...input}),signal:AbortSignal.timeout(8000)}),data=await json(response);
      if(!response.ok||data.ok!==true||data.requestId!==requestId||!leadUuid.test(data.receiptId??'')||!['QUEUED','ACKNOWLEDGED'].includes(data.delivery)||data.recipientAcknowledged!==(data.delivery==='ACKNOWLEDGED')||data.dataMode!==mode||data.auditCustomerDataAllowed!==false||!leadStates.includes(data.state)||!Number.isFinite(Date.parse(data.expiresAt)))throw Error('UNCONFIRMED');
      receipt.textContent=`Contato ${data.receiptId} persistido${mode==='synthetic'?' como TEST DATA':''}. ${data.delivery==='QUEUED'?'A confirmação pelo responsável está pendente.':'Uma identidade destinatária autorizada confirmou o registro; isto não comprova leitura humana.'} Não é contrato, acesso técnico ou pagamento.`;
    }catch{receipt.textContent='Não houve confirmação de registro. Não declaramos envio ou recebimento. Uma nova tentativa com os mesmos campos reutiliza o identificador e evita duplicação.';}
    finally{fields.disabled=!mode;}
  });
  try{
    const response=await fetcher('/api/omnix-lead',{cache:'no-store',signal:AbortSignal.timeout(6000)}),status=await json(response);
    const notice=new URL(status.privacyNoticeUrl);
    if(!response.ok||status.ok!==true||status.persistenceReady!==true||!['real','synthetic'].includes(status.dataMode)||status.leadDataAllowed!==(status.dataMode==='real')||status.auditCustomerDataAllowed!==false||status.privacyVersion!==leadPrivacyVersion||status.retentionDays!==30||status.antiSpam!=='approved-institutional-challenge-v1'||notice.protocol!=='https:'||notice.username||notice.password)throw Error('CLOSED');
    mode=status.dataMode;root.querySelector('[data-omnix-lead-privacy]').href=notice.href;
  }catch{mode=undefined;}
  fields.disabled=!mode;
  state.textContent=mode==='real'?'Canal de contato comercial aberto com persistência. Somente contato e necessidade geral; dados técnicos e auditorias reais continuam fechados.':mode==='synthetic'?'Canal em ensaio: use nomes e empresas com prefixo TEST DATA e e-mail @example.invalid. Coleta de leads reais fechada.':'Coleta de leads reais fechada. Destinatário, privacidade e operação precisam ser aprovados; o rascunho local e o canal institucional continuam disponíveis.';
}
