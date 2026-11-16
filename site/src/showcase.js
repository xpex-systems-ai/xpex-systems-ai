import mediaIndex from './data/media-index-v2.json' with { type: 'json' };
import { brandMark } from './brand.js';

const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

const dateFormat = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeZone: 'America/Sao_Paulo' });

function dateLabel(value) {
  if (!value) return '';
  return value.length === 10 ? value.split('-').reverse().join('/') : dateFormat.format(new Date(value));
}

function link(url, text, className) {
  const external = url.startsWith('https://');
  return `<a class="${className}" href="${escape(url)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escape(text)} <span aria-hidden="true">${external ? '↗' : '→'}</span></a>`;
}

const covers = new Map(mediaIndex.map(([id, group, kind, alt, captured]) => [id, {
  id, group, captured, icon: '/media/showcase/icons/' + id + '-icon.svg',
  image: { path: '/media/showcase/' + group + '/' + id + '-cover-v2.webp', alt, kind, width: 800, height: 450 }
}]));
const coverFor = id => covers.get(id === 'polo-kelle' ? 'academy' : id);

// Media art direction: stable editorial signatures, never runtime or verification claims.
export const coverPalette = Object.freeze({
  'xpex-company': ['#e7bd74','CORPORATE'],
  'xpex-evidence': ['#87b5f2','EVIDENCE OS'],
  'xpex-academy': ['#dfb16d','ACADEMY'],
  'systems-command': ['#7ac5f4','SYSTEMS COMMAND'],
  'audit-os': ['#80d7c8','AUDIT OS'],
  'plugin-factory': ['#aa93f9','PLUGIN FACTORY'],
  'wallet-command': ['#eac17c','WALLET COMMAND'],
  'studio-ai': ['#f3a0bb','STUDIO AI'],
  'api-fabric': ['#8bb2ff','API FABRIC'],
  'academy': ['#d8b773','POLO KELLE'],
  'neural-copilot': ['#99b9ff','GX NEURAL'],
  'evidence-concierge': ['#71d6ce','GX CONCIERGE'],
  'audit-engineer': ['#9adace','AUDIT ENGINEER'],
  'plugin-factory-agent': ['#bd9bf2','PLUGIN ENGINEER'],
  'api-mcp': ['#97c1fc','API / MCP'],
  'enterprise-evidence': ['#e0bd82','EVIDENCE CONCIERGE'],
  'academy-support': ['#edc794','ACADEMY CONCEPT'],
  'three-pillars-pr': ['#d7b57a','THREE PILLARS'],
  'enterprise-v2': ['#89c0ef','ENTERPRISE V2'],
  'trust-center': ['#8fd7cc','TRUST CENTER'],
  'system-registry': ['#abc0f5','SYSTEM REGISTRY'],
  'system': ['#d9ba82','SYSTEM PREVIEW'],
  'agent': ['#a9c8ed','AGENT CONCEPT'],
  'evidence': ['#a6decb','EVIDENCE PREVIEW']
});



export function showcaseCover(item, heading = false, detail = false) {
  const record = heading || detail ? coverFor(item.id) : undefined;
  const asset = record?.image || item.media;
  const group = record?.group === 'agents' ? 'agent' : item.previewExpected ? 'system' : 'evidence';
  const pending = item.previewExpected ? 'Prévia visual pendente de verificação' :
    group === 'agent' ? 'Prévia conceitual' : 'Identidade oficial';
  const label = asset?.kind === 'REAL_SCREENSHOT' ? 'Captura real' :
    asset?.kind === 'CONCEPT_PREVIEW' ? 'Prévia conceitual' :
    record?.captured ? 'Capa com captura real' :
    asset?.kind === 'CURATED_COVER' && (!item.previewExpected || item.id === 'xpex-company') ? 'Capa editorial' :
    asset?.kind === 'OFFICIAL_ASSET' ? 'Identidade oficial' :
    asset?.kind === 'EDITORIAL_ART' && !item.previewExpected ? 'Capa editorial' : pending;
  const visualId = record?.id || item.id;
  const [accent, signature] = coverPalette[visualId] || ['#d9ba82', 'XPEX'];
  const hasScreenshot = Boolean(asset?.kind === 'REAL_SCREENSHOT' ||
    record?.captured);
  const editorialKind = record?.group || (item.previewExpected ? 'systems' : 'evidence');
  const fallback = `<div class="xp-showcase-fallback xp-cover-${group}">${brandMark(item.symbol)}</div>`;
  const image = asset ? `<img class="xp-showcase-image" data-showcase-image src="${escape(asset.path)}"
    width="${asset.width}" height="${asset.height}" alt="${escape(asset.alt)}" loading="lazy" decoding="async">` : '';
  return `<div class="xp-showcase-cover${heading ? ' xp-cover-editorial' : ''}${hasScreenshot ? ' xp-cover-has-screen' : ''}"
    data-cover-id="${escape(visualId)}" data-cover-group="${escape(editorialKind)}"
    style="--xp-cover-accent:${accent}" data-fallback-label="${asset?.kind === 'CONCEPT_PREVIEW' ? 'Prévia conceitual' : pending}">
    ${fallback}${image}
    ${heading ? `<div class="xp-cover-foil" aria-hidden="true"></div>
      <div class="xp-cover-signature" aria-hidden="true"><span>XPEX <b>◆</b> ${escape(signature)}</span></div>` : ''}
    <span class="xp-showcase-media-label" data-showcase-media-label>${label}</span>
    ${heading ? `<h3 class="xp-cover-title">${escape(item.title)}</h3>` : ''}
  </div>`;
}

export function showcaseCard(item) {
  const snapshot = item.verifiedAt ? ` · ${dateLabel(item.verifiedAt)}` : '';
  const record = coverFor(item.id);
  const titleIcon = record ? `<img class="xp-media-badge" src="${record.icon}" width="32" height="32" alt="" loading="lazy" decoding="async">` : brandMark(item.symbol);
  const tag = item.status ? `<span class="xp-showcase-state${item.tone === 'public' ? ' is-public' : ''}">${escape(item.status)}</span>` : '';
  return `<article class="xp-showcase-card" data-showcase-item="${escape(item.id)}">
    ${showcaseCover(item, true)}
    <div class="xp-showcase-body">
      <div class="xp-showcase-meta">${titleIcon}<span>${escape(item.category)}</span>${tag || '<span class="xp-showcase-state">Referência pública</span>'}</div>
      <p>${escape(item.summary)}</p>
      ${item.access ? `<p class="xp-showcase-access">${escape(item.access)}${item.environment ? ' · ' + escape(item.environment) : ''}${snapshot}</p>` : ''}
      <div class="xp-showcase-links">
        ${link(item.href, item.action, 'xp-showcase-action')}
        ${item.evidenceUrl ? link(item.evidenceUrl, item.evidenceLabel, 'xp-showcase-source') : ''}
      </div>
    </div>
  </article>`;
}

export function showcaseRail({ id, title, label, summary, items, more, shell = true }) {
  return `<section id="${id}" class="${shell ? 'xp-shell ' : ''}xp-showcase-rail" data-showcase-rail aria-labelledby="${id}-heading">
    <div class="xp-showcase-head">
      <div>
        <p class="xp-kicker">${escape(label)}</p>
        <h2 id="${id}-heading">${escape(title)}</h2>
        ${summary ? `<p class="xp-showcase-intro">${escape(summary)}</p>` : ''}
      </div>
      <div class="xp-showcase-navigation">
        ${more ? link(more.href, more.label, 'xp-showcase-more') : ''}
        <div class="xp-showcase-buttons" data-showcase-buttons hidden>
          <button type="button" data-showcase-prev aria-label="Anterior em ${escape(title)}" aria-controls="${id}-items"><span aria-hidden="true">←</span></button>
          <button type="button" data-showcase-next aria-label="Próximo em ${escape(title)}" aria-controls="${id}-items"><span aria-hidden="true">→</span></button>
        </div>
      </div>
    </div>
    <div class="xp-showcase-track" id="${id}-items" data-showcase-track role="group" aria-labelledby="${id}-heading">
      <ul role="list">${items.map(item => '<li>' + showcaseCard(item) + '</li>').join('')}</ul>
    </div>
  </section>`;
}

function trackPosition(track) {
  return { max: track.scrollWidth - track.clientWidth, left: track.scrollLeft };
}

export function initShowcase(root) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const controls = new Map();
  const observer = new ResizeObserver(entries => {
    const measurements = entries.map(({ target }) => [controls.get(target), trackPosition(target)]);
    for (const [update, position] of measurements) update(position);
  });
  root.querySelectorAll('[data-showcase-rail]').forEach(rail => {
    const track = rail.querySelector('[data-showcase-track]');
    const list = track.firstElementChild;
    const buttons = rail.querySelector('[data-showcase-buttons]');
    const previous = rail.querySelector('[data-showcase-prev]');
    const next = rail.querySelector('[data-showcase-next]');
    const updateButtons = ({ max, left }) => {
      previous.setAttribute('aria-disabled', String(left <= 2));
      next.setAttribute('aria-disabled', String(left >= max - 2));
    };
    const scroll = (direction, edge = false) => {
      const behavior = reducedMotion.matches ? 'instant' : 'smooth';
      if (edge) {
        track.scrollTo({ left: direction < 0 ? 0 : track.scrollWidth, behavior });
        return;
      }
      const step = list.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(list).columnGap);
      track.scrollBy({ left: step * direction, behavior });
    };

    previous.addEventListener('click', () => { if (previous.getAttribute('aria-disabled') === 'false') scroll(-1); });
    next.addEventListener('click', () => { if (next.getAttribute('aria-disabled') === 'false') scroll(1); });
    track.addEventListener('scroll', () => updateButtons(trackPosition(track)), { passive: true });
    track.addEventListener('keydown', event => {
      if (event.target !== track || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const keys = { ArrowLeft: [-1], ArrowRight: [1], Home: [-1, true], End: [1, true] };
      if (!Object.hasOwn(keys, event.key)) return;
      event.preventDefault();
      scroll(...keys[event.key]);
    });
    controls.set(track, position => {
      buttons.hidden = position.max <= 2;
      track.tabIndex = position.max > 2 ? 0 : -1;
      updateButtons(position);
    });
    observer.observe(track);
  });
  root.querySelectorAll('[data-showcase-image]').forEach(image => {
    const fallback = () => {
      image.hidden = true;
      image.parentElement.querySelector('[data-showcase-media-label]').textContent = image.parentElement.dataset.fallbackLabel;
    };
    image.addEventListener('error', fallback, { once: true });
    if (image.complete && !image.naturalWidth) fallback();
  });
}
