// Public-page events only. No GA4 property or external sink is activated here.
// A future consented adapter may consume these fixed categories. Never add the
// draft, query string, referrer, identity, filename, report or free-form labels.
const names = new Set(['product_visit', 'commercial_click', 'request_started']);
export function emitOmnixPublicEvent(target, name) {
  if (!names.has(name)) return false;
  const detail = Object.freeze({name, product: 'omnix', stage: 'preview',
    outcome: name === 'request_started' ? 'local_draft' : 'interaction'});
  target.dispatchEvent(new CustomEvent('omnix:public-event', {detail, bubbles: true}));
  return true;
}
