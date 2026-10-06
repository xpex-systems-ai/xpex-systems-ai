function escapeHtml(value='') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#039;'
  }[char]));
}

function sourceMarkup(sources=[]) {
  if (!sources.length) return '';
  return `
    <div class="gx-sources">
      <span class="gx-source-label">Evidence used</span>
      ${sources.map(source => `
        <a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">
          <b>${escapeHtml(source.title)}</b>
          <small>${escapeHtml(source.status)}</small>
        </a>
      `).join('')}
    </div>
  `;
}

function addMessage(log, role, text, sources=[]) {
  const item=document.createElement('div');
  item.className=`gx-message ${role}`;
  item.innerHTML=`
    <div class="gx-message-head">
      <span class="gx-avatar">${role === 'gx' ? 'GX' : 'YOU'}</span>
      <b>${role === 'gx' ? 'GX Evidence Concierge' : 'Visitor'}</b>
    </div>
    <div class="gx-message-copy">${escapeHtml(text).replace(/\n/g,'<br>')}</div>
    ${role === 'gx' ? sourceMarkup(sources) : ''}
  `;
  log.appendChild(item);
  log.scrollTop=log.scrollHeight;
  return item;
}

export function initGX() {
  const root=document.querySelector('[data-gx-console]');
  if (!root) return;

  const form=root.querySelector('[data-gx-form]');
  const input=root.querySelector('[data-gx-input]');
  const log=root.querySelector('[data-gx-log]');
  const send=root.querySelector('[data-gx-send]');
  const mode=root.querySelector('[data-gx-mode]');
  const quicks=root.querySelectorAll('[data-gx-quick]');

  addMessage(
    log,
    'gx',
    'Eu sou o GX Evidence Concierge da XPeX Systems AI. Posso explicar a empresa, os sistemas, a arquitetura, segurança e o que a evidência pública realmente comprova. Quando algo não estiver provado, eu vou dizer isso.'
  );

  async function ask(message) {
    if (!message || send.disabled) return;
    addMessage(log,'visitor',message);
    input.value='';
    send.disabled=true;
    send.textContent='Consultando evidência…';
    mode.textContent='GROUNDING';

    const pending=addMessage(log,'gx','Verificando o registro público da XPeX…');
    pending.classList.add('pending');

    try {
      const response=await fetch('/api/gx',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({message})
      });
      const payload=await response.json();
      pending.remove();

      if (!response.ok) {
        addMessage(log,'gx',payload.error || 'Não consegui processar essa pergunta agora.');
        mode.textContent='SAFE FALLBACK';
      } else {
        addMessage(log,'gx',payload.answer,payload.sources || []);
        mode.textContent=payload.mode === 'ai-gateway' ? 'AI + EVIDENCE' : 'EVIDENCE ONLY';
      }
    } catch (error) {
      pending.remove();
      addMessage(log,'gx','O canal de resposta está temporariamente indisponível. Os links de evidência pública continuam acessíveis no site.');
      mode.textContent='OFFLINE SAFE';
    } finally {
      send.disabled=false;
      send.textContent='Ask GX →';
      input.focus();
    }
  }

  form.addEventListener('submit',event=>{
    event.preventDefault();
    ask(input.value.trim());
  });

  quicks.forEach(button=>{
    button.addEventListener('click',()=>ask(button.dataset.gxQuick));
  });

  const initialAsk=new URLSearchParams(location.search).get('ask');
  if (initialAsk) {
    input.value=initialAsk;
    setTimeout(()=>ask(initialAsk),120);
  }
}
