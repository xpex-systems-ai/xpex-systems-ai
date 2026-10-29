export const commercialPrivacyVersion='gx040-commercial-v1';
export const commercialUuidPattern=/^[a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const secretPattern=/(?:-----BEGIN[^\n]*PRIVATE KEY-----|\bBearer\s+[A-Za-z0-9._~-]{12,}|\b(?:sk_live_|sk_test_|gh[pousr]_|github_pat_)[A-Za-z0-9_]{12,}|\b(?:password|passwd|senha|token|secret|api[_-]?key|access[_-]?token|client[_-]?secret|private[_-]?key|mnemonic|database_url)["']?\s*[:=]\s*["']?\S+|postgres(?:ql)?:\/\/|https?:\/\/[^\s/@:]+:[^\s/@]+@|["'](?:rewrites|headers|routes)["']\s*:)/i;
export function validateCommercialPayload(input){
  const keys=['requestId','name','company','email','problem','consent','privacyVersion','website','testData'];
  if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length!==keys.length||Object.keys(input).some(k=>!keys.includes(k))||
     input.consent!==true||input.privacyVersion!==commercialPrivacyVersion||input.website!==''||input.testData!==true||
     typeof input.requestId!=='string'||!commercialUuidPattern.test(input.requestId))throw Error('INVALID_COMMERCIAL_REQUEST');
  const text=(key,min,max)=>{if(typeof input[key]!=='string'||input[key].trim().length<min||input[key].trim().length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(input[key]))throw Error('INVALID_COMMERCIAL_REQUEST');return input[key].trim();};
  const name=text('name',2,120),company=text('company',2,160),email=text('email',3,254),problem=text('problem',10,1000);
  if(!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)||/[\r\n]/.test(name+company+email)||secretPattern.test([name,company,email,problem].join('\n')))throw Error('INVALID_COMMERCIAL_REQUEST');
  if(!name.startsWith('TEST DATA ')||!company.startsWith('TEST DATA ')||!email.toLowerCase().endsWith('@example.invalid'))throw Error('COMMERCIAL_REQUIRES_SYNTHETIC_DATA');
  return {requestId:input.requestId,name,company,email,problem,consent:true,privacyVersion:commercialPrivacyVersion,website:'',testData:true};
}
export function commercialIntakeMarkup(){
  return `<section class="xp-section" data-omnix-commercial-section>
    <p class="xp-kicker">OMNIX AUDIT EXPRESS / CONFIGURATION INTEGRITY</p><h2>Solicitação comercial com confirmação.</h2>
    <p>A jornada de registro está preparada para um receptor canônico e caixa de acompanhamento autorizada. Nesta prévia, use somente nomes, empresas e e-mails fictícios. O recebimento humano e a abertura para interessados reais ainda dependem da aprovação do canal, privacidade e operação.</p>
    <div class="xp-card"><p data-omnix-commercial-state role="status" aria-live="polite">Verificando a disponibilidade do receptor de teste…</p>
    <form data-omnix-commercial class="agent-api-form"><fieldset disabled data-omnix-commercial-fields style="border:0;padding:0;margin:0;min-width:0">
      <legend>Dados de teste — sem arquivo técnico</legend>
      <p><label for="omnix-contact-name">Nome fictício</label><input id="omnix-contact-name" name="name" type="text" minlength="2" maxlength="120" placeholder="TEST DATA Interessado" autocomplete="off" required></p>
      <p><label for="omnix-contact-company">Empresa fictícia</label><input id="omnix-contact-company" name="company" type="text" minlength="2" maxlength="160" placeholder="TEST DATA Empresa" autocomplete="off" required></p>
      <p><label for="omnix-contact-email">E-mail de teste</label><input id="omnix-contact-email" name="email" type="email" maxlength="254" autocomplete="off" placeholder="pessoa@example.invalid" required></p>
      <p><label for="omnix-contact-problem">Necessidade geral, sem dados privados</label><textarea id="omnix-contact-problem" name="problem" minlength="10" maxlength="1000" required></textarea></p>
      <input name="website" type="text" tabindex="-1" autocomplete="off" hidden aria-hidden="true">
      <p><label><input name="consent" type="checkbox" style="width:auto" required> Confirmo que estes dados são fictícios, com nome/empresa iniciados em TEST DATA e e-mail @example.invalid, e autorizo seu registro de teste. Não envio credenciais, arquivo técnico ou dados de pessoas reais.</label></p>
      <button class="xp-button xp-gold" type="submit">Registrar solicitação de teste →</button>
    </fieldset></form>
    <p class="xp-small-note">Dados sintéticos expiram para consulta em 14 dias; o descarte exige a rotina autorizada, ainda não agendada. O recibo distingue registro persistido de confirmação por um responsável. Registro não cria contrato, contratação ou cobrança. <a class="xp-link" href="/?view=privacy">Aviso institucional de privacidade →</a></p>
    <p data-omnix-commercial-receipt role="status" aria-live="polite"></p><a class="xp-link" href="/?view=company#contact">Consultar o canal institucional publicado →</a></div></section>`;
}
export async function initCommercialIntake(root=document,{fetcher=fetch,uuid=()=>crypto.randomUUID()}={}){
  const form=root.querySelector('[data-omnix-commercial]');if(!form)return;
  const fields=root.querySelector('[data-omnix-commercial-fields]'),state=root.querySelector('[data-omnix-commercial-state]'),receipt=root.querySelector('[data-omnix-commercial-receipt]');
  let available=false,requestId,previousPayload;
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(!available||fields.disabled)return;
    const values=new FormData(form),candidate={name:String(values.get('name')??''),company:String(values.get('company')??''),email:String(values.get('email')??''),problem:String(values.get('problem')??''),consent:values.get('consent')==='on',privacyVersion:commercialPrivacyVersion,website:String(values.get('website')??''),testData:true};
    const fingerprint=JSON.stringify(candidate);if(fingerprint!==previousPayload){requestId=uuid();previousPayload=fingerprint;}
    let input;try{input=validateCommercialPayload({requestId,...candidate});}catch{receipt.textContent='Revise os campos, o consentimento e a ausência de conteúdo privado. Nenhuma solicitação foi registrada.';return;}
    fields.disabled=true;receipt.textContent='Aguardando confirmação de persistência do receptor de teste…';
    try{
      const response=await fetcher('/api/omnix-request',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input),signal:AbortSignal.timeout(8000)});
      const data=response.headers.get('content-type')?.includes('application/json')?await response.json():undefined;
      if(!response.ok||data?.ok!==true||data.requestId!==requestId||!commercialUuidPattern.test(data.receiptId??'')||!['QUEUED','ACKNOWLEDGED'].includes(data.delivery)||data.recipientAcknowledged!==(data.delivery==='ACKNOWLEDGED')||data.testData!==true||data.customerDataAllowed!==false)throw Error('UNCONFIRMED');
      receipt.textContent=data.delivery==='ACKNOWLEDGED'?`Registro de teste ${data.receiptId} confirmado pela identidade destinatária autorizada. O ensaio não comprova recebimento humano, contrato ou pagamento.`:`Registro de teste ${data.receiptId} persistido. A confirmação pelo responsável ainda está pendente; não é contrato ou pagamento.`;
    }catch{receipt.textContent='O receptor não confirmou o registro. Não declaramos envio ou recebimento. Se tentar novamente sem alterar os campos, o mesmo identificador evita duplicação.';}
    finally{fields.disabled=!available;}
  });
  try{
    const response=await fetcher('/api/omnix-request',{cache:'no-store',signal:AbortSignal.timeout(6000)});
    const data=response.headers.get('content-type')?.includes('application/json')?await response.json():undefined;
    available=Boolean(response.ok&&data?.ok===true&&data.configured===true&&data.persistenceReady===true&&data.syntheticOnly===true&&data.customerDataAllowed===false&&data.privacyVersion===commercialPrivacyVersion);
  }catch{available=false;}
  fields.disabled=!available;
  state.textContent=available?'Receptor sintético com persistência disponível. Recebimento humano não validado; entrada de interessados reais permanece fechada.':'Receptor indisponível ou não configurado. Entrada de interessados reais fechada; o rascunho local acima continua sem envio.';
}
