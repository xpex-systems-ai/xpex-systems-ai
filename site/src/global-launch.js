function esc(v='') {
  return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

export function deadlineLabel(target, { locale='en-US', timeZone } = {}) {
  if (!target.deadline) return target.status === 'ROLLING' ? 'Rolling intake' : target.status.replaceAll('_',' ');
  const d=new Date(target.deadline);
  if (Number.isNaN(d.getTime())) return target.deadline;
  const calendarDate = /^\d{4}-\d{2}-\d{2}$/.test(target.deadline);
  if(calendarDate && d.toISOString().slice(0,10)!==target.deadline) return target.deadline;
  // A calendar deadline has no instant or user timezone. Zoned timestamps do.
  const zone=calendarDate ? 'UTC' : timeZone;
  return new Intl.DateTimeFormat(locale,{month:'short',day:'numeric',year:'numeric',...(zone ? {timeZone:zone} : {})}).format(d);
}

function targetCard(target) {
  return `<article class="launch-card">
    <div class="launch-card-top">
      <span class="launch-priority">${esc(target.priority)}</span>
      <span class="launch-status ${target.status==='OPEN'?'open':''}">${esc(target.status.replaceAll('_',' '))}</span>
    </div>
    <p class="launch-type">${esc(target.type)} · ${esc(target.location)}</p>
    <h3>${esc(target.name)}</h3>
    <h4>${esc(target.program)}</h4>
    <p>${esc(target.rationale)}</p>
    <div class="launch-meta">
      <span><b>${esc(target.fit)}</b> fit</span>
      <span>${esc(deadlineLabel(target))}</span>
    </div>
    <a href="${esc(target.source)}" target="_blank" rel="noreferrer">Official program ↗</a>
  </article>`;
}

export async function initGlobalLaunchRadar() {
  const root=document.querySelector('[data-launch-radar]');
  if (!root) return;
  try {
    const response=await fetch('/data/global-launch-radar-v1.json',{cache:'no-store'});
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    const radar=await response.json();
    const selected=radar.priority_targets.filter(t=>['P0','P1'].includes(t.priority)).slice(0,8);
    root.innerHTML=selected.map(targetCard).join('');
    const stamp=document.querySelector('[data-launch-snapshot]');
    if(stamp) stamp.textContent=`Opportunity snapshot · ${radar.snapshot_date}`;
    const count=document.querySelector('[data-launch-count]');
    if(count) count.textContent=String(radar.priority_targets.length);
  } catch (error) {
    root.innerHTML='<div class="launch-fallback">Launch radar data is temporarily unavailable. The technical evidence and application pack remain available in the public repository.</div>';
  }
}
