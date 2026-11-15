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

export function showcaseCover(item) {
  const asset = item.media;
  const fallback = `<div class="xp-showcase-fallback">${brandMark(item.symbol)}</div>`;
  const label = asset?.kind === 'REAL_SCREENSHOT' ? 'Captura real' :
    asset?.kind === 'OFFICIAL_ASSET' || !item.previewExpected ? 'Identidade oficial' : 'Prévia visual pendente de verificação';
  const image = asset ? `<img class="xp-showcase-image" data-showcase-image src="${escape(asset.path)}"
    width="${asset.width}" height="${asset.height}" alt="${escape(asset.alt)}" loading="lazy" decoding="async">` : '';
  return `<div class="xp-showcase-cover">
    ${fallback}${image}<span class="xp-showcase-media-label" data-showcase-media-label>${label}</span>
  </div>`;
}

export function showcaseCard(item) {
  const snapshot = item.verifiedAt ? ` · ${dateLabel(item.verifiedAt)}` : '';
  const tag = item.status ? `<span class="xp-showcase-state${item.tone === 'public' ? ' is-public' : ''}">${escape(item.status)}</span>` : '';
  return `<article class="xp-showcase-card" data-showcase-item="${escape(item.id)}">
    ${showcaseCover(item)}
    <div class="xp-showcase-body">
      <div class="xp-showcase-meta"><span>${escape(item.category)}</span>${tag}</div>
      <h3>${escape(item.title)}</h3>
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

export function initShowcase(root) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  root.querySelectorAll('[data-showcase-rail]').forEach(rail => {
    const track = rail.querySelector('[data-showcase-track]');
    const list = track.firstElementChild;
    const buttons = rail.querySelector('[data-showcase-buttons]');
    const previous = rail.querySelector('[data-showcase-prev]');
    const next = rail.querySelector('[data-showcase-next]');
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      buttons.hidden = max <= 2;
      track.tabIndex = max > 2 ? 0 : -1;
      previous.setAttribute('aria-disabled', String(track.scrollLeft <= 2));
      next.setAttribute('aria-disabled', String(track.scrollLeft >= max - 2));
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
    track.addEventListener('scroll', update, { passive: true });
    track.addEventListener('keydown', event => {
      if (event.target !== track || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const keys = { ArrowLeft: [-1], ArrowRight: [1], Home: [-1, true], End: [1, true] };
      if (!Object.hasOwn(keys, event.key)) return;
      event.preventDefault();
      scroll(...keys[event.key]);
    });
    new ResizeObserver(update).observe(track);
    update();
  });
  root.querySelectorAll('[data-showcase-image]').forEach(image => {
    const fallback = () => {
      image.hidden = true;
      image.parentElement.querySelector('[data-showcase-media-label]').textContent = 'Prévia visual pendente de verificação';
    };
    image.addEventListener('error', fallback, { once: true });
    if (image.complete && !image.naturalWidth) fallback();
  });
}
