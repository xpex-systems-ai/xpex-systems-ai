import { brandMark, brandLockup } from './brand.js';
import { getSystem, systemHref } from './data/system-intelligence.js';
import { systemShowcase, SHOWCASE_EVIDENCE_URL } from './data/showcase.js';
import { showcaseCover, initShowcase } from './showcase.js';

function esc(v=''){
  return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
function statusClass(tone){ return tone==='green' ? 'sip-green' : 'sip-amber'; }
function evidenceCards(items, source){
  return items.map(x=>`<a class="sip-evidence-card" href="${esc(x.url)}" target="_blank" rel="noreferrer"><span>${esc(x.kind)}${source.visibility === 'PRIVATE' && x.url.startsWith(source.url + '/') ? ' · Restricted' : ''}</span><b>${esc(x.label)}</b><small>Open evidence ↗</small></a>`).join('');
}
function relatedCards(slugs=[]){
  return slugs.map(slug=>{ const s=getSystem(slug); if(!s) return ''; return `<a class="sip-related-card" href="${systemHref(s.slug)}">${brandMark(s.slug)}<span class="sip-related-status ${statusClass(s.tone)}">${esc(s.status)}</span><b>${esc(s.name)}</b><small>${esc(s.role)}</small></a>`; }).join('');
}
function mediaMarkup(profile) {
  const asset = profile.media;
  return `<section class="shell sip-block" lang="pt-BR" aria-labelledby="system-media">
    <div class="sip-section-head"><div><p class="kicker">MÍDIA</p><h2 id="system-media">Interface e origem</h2></div>
      <p>${asset?.caption ? esc(asset.caption) : 'A captura pública deste sistema está pendente de verificação.'}</p></div>
    <figure class="xp-showcase-media-figure">
      ${showcaseCover(profile)}
      ${asset ? `<figcaption><a href="${esc(asset.sourceUrl)}" target="_blank" rel="noopener noreferrer">Origem da imagem ↗</a> · <a href="${SHOWCASE_EVIDENCE_URL}">Registro de curadoria</a></figcaption>` : ''}
    </figure>
  </section>`;
}

export function maybeRenderSystemPage(app){
  const slug=new URLSearchParams(location.search).get('system');
  if(!slug) return false;
  const system=getSystem(slug);
  if(!system) return false;
  const profile = systemShowcase(system);
  const sourceLabel = system.source.visibility === 'PRIVATE' ? 'Source (restricted)' : 'Source';
  const evidence = profile.runtimeAvailable || !system.runtime.url ? system.evidence :
    system.evidence.filter(entry => new URL(entry.url).hostname !== new URL(system.runtime.url).hostname);
  document.documentElement.lang = 'en';
  document.title=`${system.name} — XPeX Systems AI`;
  const manifest=JSON.stringify({id:system.id,name:system.name,role:system.role,tier:system.tier,status:system.status,runtime:system.runtime,source:system.source,tech:system.tech,architecture:system.architecture,security:system.security,limits:system.limits,evidence:system.evidence,media:system.media},null,2);
  app.innerHTML=`
    <div class="noise"></div>
    <header class="nav shell sip-nav"><a class="brand" href="/" aria-label="XPeX home">${brandLockup()}</a><nav><a href="/">Company</a><a href="/#systems">Systems</a><a href="/#gx">GX</a><a href="/#trust">Trust</a></nav><a class="button ghost" href="/#systems">← Portfolio</a></header>
    <main class="sip-page">
      <section class="sip-hero"><div class="shell sip-hero-inner"><div class="sip-hero-copy">${brandMark(system.slug)}<div class="sip-meta"><span>${esc(system.tier)}</span><span class="${statusClass(system.tone)}">${esc(profile.status)}</span></div><h1>${esc(system.name)}</h1><p class="sip-role">${esc(system.role)}</p><p class="sip-tagline">${esc(system.tagline)}</p><p class="sip-summary">${esc(system.summary)}</p><div class="hero-actions">${profile.runtimeAvailable ? `<a class="button primary" href="${esc(profile.canonicalUrl)}" target="_blank" rel="noopener noreferrer">${system.slug === 'academy' ? 'Open restricted preview' : 'Open public surface'} ↗</a>` : ''}<a class="button" href="${esc(system.source.url)}" target="_blank" rel="noreferrer">${sourceLabel} ↗</a><a class="button" href="/?ask=${encodeURIComponent('Explain '+system.name+' and show the strongest public evidence.')}#gx">Ask GX</a></div></div><div class="xp-media-detail" lang="pt-BR">${showcaseCover(profile, false, true)}<a class="text-link" href="/data/showcase-media-pack-v2.json">Origem da capa →</a></div></div></section>
      <section class="shell sip-proofbar"><div><span>Provider</span><b>${esc(system.runtime.provider)}</b></div><div><span>Environment</span><b>${esc(system.runtime.environment)}</b></div><div><span>Recorded deployment state</span><b>${esc(system.runtime.state)}</b></div><div><span>Source</span><b>${esc(system.source.visibility)}</b></div></section>
      <section class="shell sip-block sip-overview"><div class="sip-story"><p class="kicker">THE PROBLEM</p><h2>${esc(system.problem)}</h2></div><div class="sip-story"><p class="kicker">WHAT XPEX BUILT</p><p>${esc(system.built)}</p></div></section>
      <section class="shell sip-block"><div class="sip-section-head"><div><p class="kicker">ARCHITECTURE</p><h2>System intelligence, not a screenshot collection.</h2></div><p>GX receives the canonical identity, runtime, source, architecture, security boundaries and evidence links as structured knowledge.</p></div><div class="sip-flow">${system.architecture.map((x,i)=>`<div><span>0${i+1}</span><b>${esc(x)}</b></div>`).join('')}</div><div class="sip-chips">${system.tech.map(x=>`<span>${esc(x)}</span>`).join('')}</div></section>
      ${profile.verifiedAt ? `<p class="shell sip-runtime-note" lang="pt-BR"><strong>${esc(profile.status)}</strong> · ${esc(profile.access)} · <a href="${esc(profile.evidenceUrl)}">Fonte e data de verificação</a></p>` : ''}
      ${mediaMarkup(profile)}
      <section class="shell sip-block"><div class="sip-section-head"><div><p class="kicker">SECURITY & TRUTH</p><h2>What the system proves — and what it does not.</h2></div><p>Enterprise presentation without enterprise fantasy: every limitation remains visible.</p></div><div class="sip-boundary-grid"><div class="sip-boundary good"><h3>Controls / boundaries</h3>${system.security.map(x=>`<p>✓ ${esc(x)}</p>`).join('')}</div><div class="sip-boundary warn"><h3>Open gates / limits</h3>${system.limits.map(x=>`<p>△ ${esc(x)}</p>`).join('')}</div></div></section>
      <section class="shell sip-block"><div class="sip-section-head"><div><p class="kicker">EVIDENCE SHELF</p><h2>Inspect the proof directly.</h2></div><p>Source, runtime, architecture, security and machine-readable records stay one click away.</p></div><div class="sip-evidence-grid">${evidenceCards(evidence, system.source)}</div></section>
      <section class="shell sip-block"><div class="sip-section-head"><div><p class="kicker">SYSTEM JSON</p><h2>The page is backed by structured knowledge.</h2></div><p>This manifest is the public neural context GX can use for this system.</p></div><pre class="sip-json" tabindex="0" aria-label="System JSON manifest"><code>${esc(manifest)}</code></pre><a class="text-link" href="/data/system-intelligence-v1.json" target="_blank" rel="noreferrer">Open machine-readable registry →</a></section>
      <section class="shell sip-block"><div class="sip-section-head"><div><p class="kicker">CONNECTED SYSTEMS</p><h2>Part of one operating graph.</h2></div></div><div class="sip-related-grid">${relatedCards(system.related)}</div></section>
    </main>
    <a class="gx-float" href="/?ask=${encodeURIComponent('Explain '+system.name+' using public evidence only.')}#gx" aria-label="Ask GX about this system">GX</a>
    <footer class="shell footer"><div class="brand">${brandLockup()}</div><p>Build. Connect. Operate. Prove.</p><p>© 2026 XPeX Systems AI</p></footer>`;
  initShowcase(app);
  return true;
}

export function rewriteSystemLinks(){ document.querySelectorAll('[data-system-slug]').forEach(a=>a.setAttribute('href',systemHref(a.dataset.systemSlug))); }
