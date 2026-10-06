import { getSystem, systemHref } from './data/system-intelligence.js';

function esc(v=''){
  return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
function statusClass(tone){ return tone==='green' ? 'sip-green' : 'sip-amber'; }
function evidenceCards(items=[]){
  return items.map(x=>`<a class="sip-evidence-card" href="${esc(x.url)}" target="_blank" rel="noreferrer"><span>${esc(x.kind)}</span><b>${esc(x.label)}</b><small>Open evidence ↗</small></a>`).join('');
}
function relatedCards(slugs=[]){
  return slugs.map(slug=>{ const s=getSystem(slug); if(!s) return ''; return `<a class="sip-related-card" href="${systemHref(s.slug)}"><span class="sip-related-status ${statusClass(s.tone)}">${esc(s.status)}</span><b>${esc(s.name)}</b><small>${esc(s.role)}</small></a>`; }).join('');
}
function mediaMarkup(system){
  const live=system.media?.find(x=>x.type==='live' && x.url);
  const items=(system.media||[]).map(x=>`<div class="sip-media-card"><span>${esc(x.classification)} · ${esc(x.publication)}</span><b>${esc(x.label)}</b><p>${esc(x.caption || (x.type==='live' ? 'Provider-backed runtime surface.' : 'Evidence media record.'))}</p>${x.url ? `<a href="${esc(x.url)}" target="_blank" rel="noreferrer">Open asset ↗</a>` : ''}</div>`).join('');
  return `<section class="shell sip-block"><div class="sip-section-head"><div><p class="kicker">ASSETS & MEDIA</p><h2>Runtime, prints and governed media.</h2></div><p>Visual assets are classified before publication. Real runtime, redacted screenshots and concept art are never mixed.</p></div>${live ? `<div class="sip-runtime-frame"><div class="sip-browserbar"><i></i><i></i><i></i><span>${esc(live.url)}</span></div><iframe src="${esc(live.url)}" loading="lazy" referrerpolicy="no-referrer" title="${esc(system.name)} live preview"></iframe></div>` : `<div class="sip-no-runtime"><span>RUNTIME PREVIEW GATED</span><b>No public iframe is promoted for this system yet.</b><p>The evidence registry keeps this state explicit instead of fabricating a live surface.</p></div>`}<div class="sip-media-grid">${items}</div></section>`;
}

export function maybeRenderSystemPage(app){
  const slug=new URLSearchParams(location.search).get('system');
  if(!slug) return false;
  const system=getSystem(slug);
  if(!system) return false;
  document.title=`${system.name} — XPeX Systems AI`;
  const manifest=JSON.stringify({id:system.id,name:system.name,role:system.role,tier:system.tier,status:system.status,runtime:system.runtime,source:system.source,tech:system.tech,architecture:system.architecture,security:system.security,limits:system.limits,evidence:system.evidence,media:system.media},null,2);
  app.innerHTML=`
    <div class="noise"></div>
    <header class="nav shell sip-nav"><a class="brand" href="/" aria-label="XPeX home"><span class="brand-mark">X</span><span><b>XPeX</b><small>SYSTEMS AI</small></span></a><nav><a href="/">Company</a><a href="/#systems">Systems</a><a href="/#gx">GX</a><a href="/#trust">Trust</a></nav><a class="button ghost" href="/#systems">← Portfolio</a></header>
    <main class="sip-page">
      <section class="sip-hero"><div class="shell sip-hero-inner"><div class="sip-hero-copy"><div class="sip-meta"><span>${esc(system.tier)}</span><span class="${statusClass(system.tone)}">${esc(system.status)}</span></div><h1>${esc(system.name)}</h1><p class="sip-role">${esc(system.role)}</p><p class="sip-tagline">${esc(system.tagline)}</p><p class="sip-summary">${esc(system.summary)}</p><div class="hero-actions">${system.runtime?.url ? `<a class="button primary" href="${esc(system.runtime.url)}" target="_blank" rel="noreferrer">Open runtime ↗</a>` : ''}<a class="button" href="${esc(system.source.url)}" target="_blank" rel="noreferrer">Source ↗</a><a class="button" href="/?ask=${encodeURIComponent('Explain '+system.name+' and show the strongest public evidence.')}#gx">Ask GX</a></div></div><div class="sip-hero-orbit"><div class="sip-orbit-core">GX</div><i></i><i></i><i></i></div></div></section>
      <section class="shell sip-proofbar"><div><span>Provider</span><b>${esc(system.runtime.provider)}</b></div><div><span>Environment</span><b>${esc(system.runtime.environment)}</b></div><div><span>Runtime state</span><b>${esc(system.runtime.state)}</b></div><div><span>Source</span><b>${esc(system.source.visibility)}</b></div></section>
      <section class="shell sip-block sip-overview"><div class="sip-story"><p class="kicker">THE PROBLEM</p><h2>${esc(system.problem)}</h2></div><div class="sip-story"><p class="kicker">WHAT XPEX BUILT</p><p>${esc(system.built)}</p></div></section>
      <section class="shell sip-block"><div class="sip-section-head"><div><p class="kicker">ARCHITECTURE</p><h2>System intelligence, not a screenshot collection.</h2></div><p>GX receives the canonical identity, runtime, source, architecture, security boundaries and evidence links as structured knowledge.</p></div><div class="sip-flow">${system.architecture.map((x,i)=>`<div><span>0${i+1}</span><b>${esc(x)}</b></div>`).join('')}</div><div class="sip-chips">${system.tech.map(x=>`<span>${esc(x)}</span>`).join('')}</div></section>
      ${mediaMarkup(system)}
      <section class="shell sip-block"><div class="sip-section-head"><div><p class="kicker">SECURITY & TRUTH</p><h2>What the system proves — and what it does not.</h2></div><p>Enterprise presentation without enterprise fantasy: every limitation remains visible.</p></div><div class="sip-boundary-grid"><div class="sip-boundary good"><h3>Controls / boundaries</h3>${system.security.map(x=>`<p>✓ ${esc(x)}</p>`).join('')}</div><div class="sip-boundary warn"><h3>Open gates / limits</h3>${system.limits.map(x=>`<p>△ ${esc(x)}</p>`).join('')}</div></div></section>
      <section class="shell sip-block"><div class="sip-section-head"><div><p class="kicker">EVIDENCE SHELF</p><h2>Inspect the proof directly.</h2></div><p>Source, runtime, architecture, security and machine-readable records stay one click away.</p></div><div class="sip-evidence-grid">${evidenceCards(system.evidence)}</div></section>
      <section class="shell sip-block"><div class="sip-section-head"><div><p class="kicker">SYSTEM JSON</p><h2>The page is backed by structured knowledge.</h2></div><p>This manifest is the public neural context GX can use for this system.</p></div><pre class="sip-json"><code>${esc(manifest)}</code></pre><a class="text-link" href="/data/system-intelligence-v1.json" target="_blank" rel="noreferrer">Open machine-readable registry →</a></section>
      <section class="shell sip-block"><div class="sip-section-head"><div><p class="kicker">CONNECTED SYSTEMS</p><h2>Part of one operating graph.</h2></div></div><div class="sip-related-grid">${relatedCards(system.related)}</div></section>
    </main>
    <a class="gx-float" href="/?ask=${encodeURIComponent('Explain '+system.name+' using public evidence only.')}#gx" aria-label="Ask GX about this system">GX</a>
    <footer class="shell footer"><div class="brand"><span class="brand-mark">X</span><span><b>XPeX</b><small>SYSTEMS AI</small></span></div><p>Build. Connect. Operate. Prove.</p><p>© 2026 XPeX Systems AI</p></footer>`;
  return true;
}

export function rewriteSystemLinks(){ document.querySelectorAll('[data-system-slug]').forEach(a=>a.setAttribute('href',systemHref(a.dataset.systemSlug))); }
