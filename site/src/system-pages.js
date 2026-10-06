import { NEURAL_CATALOG, getSystemById } from './system-catalog.js';

function esc(v='') {
  return String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

function link(e) {
  return `<a href="${esc(e.url)}" target="_blank" rel="noreferrer"><span>${esc(e.type)}</span><b>${esc(e.label)}</b>↗</a>`;
}

function card(system) {
  return `<button class="neural-card" data-system-id="${esc(system.id)}" type="button">
    <div class="neural-card-visual">
      <span class="neural-tier">${esc(system.tier)}</span>
      <div class="neural-glyph">${esc(system.name.split(' ').map(x=>x[0]).join('').slice(0,3))}</div>
      <span class="neural-state">${esc(system.state)}</span>
    </div>
    <div class="neural-card-copy"><small>${esc(system.role)}</small><h3>${esc(system.name)}</h3><p>${esc(system.description)}</p></div>
  </button>`;
}

function renderDetail(system) {
  const root=document.querySelector('[data-neural-detail]');
  if (!root || !system) return;
  const runtime=Object.entries(system.runtime || {}).map(([k,v])=>`<div><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('');
  const gates=(system.open_gates || []).length ? system.open_gates.map(x=>`<li>${esc(x)}</li>`).join('') : '<li>No open public gate recorded.</li>';
  const assets=(system.assets || []).length ? system.assets.map(a=>`<div class="asset-row"><b>${esc(a.name)}</b><span>${esc(a.classification)} · ${esc(a.state)}</span></div>`).join('') : '<p class="neural-muted">No approved public visual asset is registered yet.</p>';
  root.innerHTML=`
    <button class="neural-close" data-neural-close type="button">Close ×</button>
    <p class="kicker">SYSTEM INTELLIGENCE PAGE · ${esc(system.id)}</p>
    <h2>${esc(system.name)}</h2>
    <p class="neural-lead">${esc(system.description)}</p>
    <div class="neural-detail-grid">
      <section><h4>Runtime truth</h4><div class="runtime-grid">${runtime}</div></section>
      <section><h4>Technology</h4><div class="chip-row">${(system.stack||[]).map(x=>`<span>${esc(x)}</span>`).join('') || '<span>Evidence pending</span>'}</div></section>
      <section><h4>Evidence graph</h4><div class="evidence-links">${(system.evidence||[]).map(link).join('')}</div></section>
      <section><h4>Visual assets</h4>${assets}</section>
      <section><h4>Open gates</h4><ul class="gate-list">${gates}</ul></section>
      <section><h4>Machine-readable record</h4><pre>${esc(JSON.stringify(system,null,2))}</pre></section>
    </div>`;
  root.hidden=false;
  document.body.classList.add('neural-open');
  root.scrollTop=0;
  root.querySelector('[data-neural-close]').addEventListener('click',closeDetail);
}

function closeDetail() {
  const root=document.querySelector('[data-neural-detail]');
  if (root) root.hidden=true;
  document.body.classList.remove('neural-open');
  history.replaceState(null,'',location.pathname+location.search+'#catalog');
}

export function initNeuralCatalog() {
  const grid=document.querySelector('[data-neural-grid]');
  if (!grid) return;
  grid.innerHTML=NEURAL_CATALOG.systems.map(card).join('');
  grid.addEventListener('click',event=>{
    const card=event.target.closest('[data-system-id]');
    if (!card) return;
    const id=card.dataset.systemId;
    history.replaceState(null,'',`#system/${id}`);
    renderDetail(getSystemById(id));
  });
  const openFromHash=()=>{
    const match=location.hash.match(/^#system\/(.+)$/);
    if (match) renderDetail(getSystemById(match[1]));
  };
  window.addEventListener('hashchange',openFromHash);
  openFromHash();
}
