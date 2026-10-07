function esc(v=''){
  return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

function resultMarkup(payload){
  const match=payload?.matches?.[0];
  if(!match) return '<p class="agent-api-muted">No match returned yet.</p>';
  const pack=payload.best_match;
  const systems=(pack?.systems||[]).map(s=>`
    <a href="${esc(s.intelligence_page)}" target="_blank" rel="noreferrer">
      <b>${esc(s.name)}</b><span>${esc(s.status)}</span>
    </a>
  `).join('');

  return `
    <div class="agent-api-result-head">
      <span>BEST MATCH</span>
      <b>${esc(match.maturity)}</b>
    </div>
    <h4>${esc(match.name)}</h4>
    <p>${esc(match.promise)}</p>
    <div class="agent-api-systems">${systems}</div>
    <div class="agent-api-result-actions">
      <a href="${esc(payload.contact?.linkedin||'https://www.linkedin.com/in/ceojuniorsena')}" target="_blank" rel="noreferrer">Discuss integration ↗</a>
      <a href="https://xpex-systems-ai.vercel.app/api/mcp/enterprise" target="_blank" rel="noreferrer">Enterprise MCP ↗</a>
    </div>
  `;
}

export function initEnterpriseAgentAPI(){
  const root=document.querySelector('[data-agent-api]');
  if(!root) return;
  const form=root.querySelector('[data-agent-api-form]');
  const input=root.querySelector('[data-agent-api-need]');
  const company=root.querySelector('[data-agent-api-company]');
  const result=root.querySelector('[data-agent-api-result]');
  const button=root.querySelector('[data-agent-api-submit]');

  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const need=input.value.trim();
    const company_type=company.value.trim();
    if(!need) return;

    button.disabled=true;
    button.textContent='Matching XPeX capabilities…';
    result.innerHTML='<p class="agent-api-muted">Reading the Enterprise Agent API and evidence graph…</p>';

    try{
      const response=await fetch('/api/agent-api',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({action:'match',need,company_type})
      });
      const payload=await response.json();
      if(!response.ok) throw new Error(payload.error||'match failed');
      result.innerHTML=resultMarkup(payload);
    }catch(error){
      result.innerHTML='<p class="agent-api-muted">The matching endpoint is temporarily unavailable. The MCP and machine-readable catalog remain public.</p>';
    }finally{
      button.disabled=false;
      button.textContent='Match our need →';
    }
  });
}
