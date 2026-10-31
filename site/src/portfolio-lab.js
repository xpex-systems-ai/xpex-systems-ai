import {PORTFOLIO_GROUPS,PORTFOLIO_SHOWCASE,publicProofUrl} from './data/portfolio-showcase.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function proofLinks(system){
  const unique=new Set();
  return (system.evidence||[]).map(e=>({e,url:publicProofUrl(e.url,system)}))
    .filter(({url})=>url&&!unique.has(url)&&unique.add(url)).slice(0,3);
}

function card(system,index){
  const links=proofLinks(system);
  const stages=system.stages.map((step,i)=>`<span class="xp-ev-node"><small>0${i+1}</small><b>${esc(step)}</b></span>`).join('<span class="xp-ev-arrow" aria-hidden="true">→</span>');
  const items=links.map(({e,url})=>`<li><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(e.label||'Fonte')} <span aria-hidden="true">↗</span></a></li>`).join('');
  return `<article class="xp-ev-card" data-portfolio-card data-group="${esc(system.group)}" aria-labelledby="xp-ev-${esc(system.slug)}">
    <div class="xp-ev-diagram" data-kind="${esc(system.group)}" role="img" aria-label="Esquema ilustrativo das etapas: ${esc(system.stages.join(', '))}. Não é captura do sistema em produção.">
      <div class="xp-ev-grid" aria-hidden="true"></div>
      <div class="xp-ev-diagram-head"><span>${esc(system.short)}</span><span>ARQUITETURA / DEMONSTRAÇÃO VISUAL</span></div>
      <div class="xp-ev-nodes" aria-hidden="true">${stages}</div>
      <div class="xp-ev-diagram-foot">ESQUEMA ILUSTRATIVO <span>≠</span> CAPTURA OPERACIONAL</div>
    </div>
    <div class="xp-ev-card-body">
      <div class="xp-ev-eyebrow"><span>${esc(system.group)}</span><span>0${index+1} / 07</span></div>
      <h3 id="xp-ev-${esc(system.slug)}">${esc(system.name)}</h3>
      <p class="xp-ev-role">${esc(system.role)}</p>
      <p>${esc(system.summary)}</p>
      <p class="xp-ev-status"><span>Estado no inventário:</span> <strong>${esc(system.status)}</strong></p>
      <p class="xp-ev-disclaimer">${esc(system.context)}</p>
      <details class="xp-ev-details"><summary>Dossiê e provas (${links.length})</summary>
        <p>Fontes do inventário institucional. São referências documentais e não asseguram disponibilidade contínua.</p>
        ${items?`<ul>${items}</ul>`:'<p>Nenhuma referência pública elegível neste cartão.</p>'}
        ${(system.limits||[]).length?`<p><strong>Limitações registradas:</strong> ${esc(system.limits.slice(0,2).join(' · '))}</p>`:''}
      </details>
      <a class="xp-ev-open" href="/?system=${encodeURIComponent(system.slug)}" aria-label="Consultar ficha institucional de ${esc(system.name)}">Abrir ficha técnica <span aria-hidden="true">↗</span></a>
    </div>
  </article>`;
}

export function portfolioLabMarkup(){
  return `<section id="omnix-lab" class="xp-section xp-ev-lab" data-portfolio-lab aria-labelledby="xp-ev-title">
  <header class="xp-ev-title">
    <div><p class="xp-kicker">XPEX ENGINEERING / EVIDENCE FIRST</p>
      <h2 id="xp-ev-title">Sistemas construídos.<br><em>Engenharia em evidência.</em></h2>
      <p>Explore sete linhas de engenharia cadastradas na XPeX. Consulte a arquitetura, o estado registrado, as limitações e as fontes públicas elegíveis de cada sistema.</p>
    </div>
    <div class="xp-ev-count" aria-label="7 sistemas no catálogo"><strong>07</strong><span>DOSSIÊS<br>CANÔNICOS</span></div>
  </header>
  <div class="xp-ev-integrity" role="note"><span aria-hidden="true">◇</span> Diagramas são ilustrativos e não mostram resultados ao vivo. Nenhuma credencial, dado de cliente ou arquivo privado de Drive/ChatGPT é disponibilizado aqui.</div>
  <div class="xp-ev-toolbar" role="group" aria-label="Filtrar sistemas por especialidade">
    ${PORTFOLIO_GROUPS.map((name,i)=>`<button type="button" class="xp-ev-filter${i===0?' is-active':''}" data-portfolio-filter="${esc(name)}" aria-pressed="${i===0?'true':'false'}">${esc(name)}</button>`).join('')}
  </div>
  <p class="xp-ev-result" role="status" aria-live="polite" data-portfolio-count>${PORTFOLIO_SHOWCASE.length} sistemas exibidos · registros do catálogo institucional</p>
  <div class="xp-ev-cards">${PORTFOLIO_SHOWCASE.map(card).join('')}</div>
  <footer class="xp-ev-footnote"><p><strong>Próxima camada de evidências:</strong> capturas originais e vídeos dos acervos XPeX serão adicionados apenas depois de revisão de segurança, autoria e autorização de publicação. Este primeiro lote não representa casos de clientes, faturamento ou certificações.</p>
  <a class="xp-button" href="/?view=company#contact">Conversar sobre uma solução →</a></footer>
  </section>`;
}

export function initPortfolioLab(root=document){
  const lab=root.querySelector('[data-portfolio-lab]');
  if(!lab)return false;
  const controls=[...lab.querySelectorAll('[data-portfolio-filter]')];
  const cards=[...lab.querySelectorAll('[data-portfolio-card]')];
  const count=lab.querySelector('[data-portfolio-count]');
  for(const control of controls){
    control.addEventListener('click',()=>{
      const group=control.dataset.portfolioFilter;
      for(const button of controls){
        const selected=button===control;
        button.setAttribute('aria-pressed',String(selected));
        button.classList.toggle('is-active',selected);
      }
      let shown=0;
      for(const item of cards){
        const match=group==='Todos'||item.dataset.group===group;
        item.hidden=!match;
        if(match)shown++;
      }
      if(count)count.textContent=shown+' '+(shown===1?'sistema exibido':'sistemas exibidos')+' · '+(group==='Todos'?'todas as especialidades':group);
    });
  }
  return true;
}
