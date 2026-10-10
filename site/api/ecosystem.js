// Public projection of existing GXEON metadata. No operator credentials or writes.
export const SOURCES = Object.freeze({
  integrations: 'https://gxeon-wallet-command-center.vercel.app/api/integration-status?view=ecosystem',
  revenue: 'https://gxeon-wallet-command-center.vercel.app/api/integration-status?view=revenue-operations',
  services: 'https://gxeon-wallet-command-center.vercel.app/api/v1/services'
});
const SERVICE_NAMES = Object.freeze({
  gxeon_json_validate_v1: 'GXEON JSON Validate',
  gxeon_csv_audit_v1: 'GXEON CSV Audit',
  gxeon_url_verify_v1: 'GXEON URL Verify',
  gxeon_api_health_v1: 'GXEON API Health'
});
const MAX_BYTES = 128 * 1024;
const FRESH_MS = 15 * 60 * 1000;
function date(value, now) {
  if (typeof value !== 'string') return null;
  const n = Date.parse(value);
  return Number.isFinite(n) && n <= now + 60000 ? new Date(n).toISOString() : null;
}
function count(value) { return Number.isSafeInteger(value) && value >= 0 ? value : null; }
function freshness(value, now) {
  const time = date(value, now);
  return time ? (now - Date.parse(time) > FRESH_MS ? 'STALE' : 'AVAILABLE') : 'UNAVAILABLE';
}
async function readJSON(url, fetcher) {
  const response = await fetcher(url, {
    method: 'GET', redirect: 'error', signal: AbortSignal.timeout(12000),
    headers: { Accept: 'application/json' }
  });
  if (!response.ok || !/application\/json/i.test(response.headers.get('content-type') || '')) throw new Error('Unavailable');
  if (Number(response.headers.get('content-length')) > MAX_BYTES) throw new Error('Oversize');
  const reader = response.body.getReader();
  const chunks = []; let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) { await reader.cancel(); throw new Error('Oversize'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes));
}
function integrations(payload, now) {
  const at = date(payload?.observedAt, now);
  const status = freshness(at, now);
  const c = payload?.coinbase;
  const command = payload?.communityCommand;
  if (!c || c.mode !== 'READ_ONLY' || !['runtimeConfigured','operatorAuthConfigured','historyConfigured'].every(k => typeof c[k] === 'boolean')) throw new Error('Invalid integrations');
  return {
    status, observedAt: at,
    coinbase: {
      status: status !== 'AVAILABLE' ? 'NOT_VERIFIED' :
        (c.runtimeConfigured && c.operatorAuthConfigured && c.historyConfigured ? 'CONFIGURED_NOT_SYNCED' : 'SETUP_REQUIRED'),
      connectorVerifiedAt: date(c.connectorVerifiedAt, now),
      balance: null, usdc: null, account: null, network: null,
      base: 'PLANNED', mode: 'READ_ONLY'
    },
    command: {
      status: status === 'AVAILABLE' && command?.status === 'AVAILABLE' && command?.environment === 'staging' ? 'STAGING_AVAILABLE' : 'NOT_VERIFIED',
      dataSync: 'AUTHENTICATED_SESSION_REQUIRED'
    }
  };
}
function revenue(payload, now) {
  if (payload?.mode !== 'READ_ONLY' || !Array.isArray(payload.sources)) throw new Error('Invalid revenue');
  const at = date(payload.observedAt, now);
  const status = freshness(at, now);
  const ids = ['unified', 'basebounty'];
  if (payload.sources.some(x => !x || !ids.includes(x.id)) || new Set(payload.sources.map(x => x.id)).size !== payload.sources.length) throw new Error('Invalid sources');
  return {
    status, observedAt: at,
    sources: ids.map(id => {
      const s = payload.sources.find(x => x.id === id);
      const time = date(s?.observedAt, now);
      let state = s?.status === 'UNAVAILABLE' || !s ? 'UNAVAILABLE' : freshness(time, now);
      if (!['AVAILABLE', 'STALE'].includes(s?.status) || status === 'UNAVAILABLE') state = 'UNAVAILABLE';
      if ((s?.status === 'STALE' || status === 'STALE') && state === 'AVAILABLE') state = 'STALE';
      if (count(s?.count) === null) state = 'UNAVAILABLE';
      return { id, status: state, observedAt: time, count: state === 'UNAVAILABLE' ? null : count(s.count) };
    }),
    ledger: 'AUTHENTICATED_RECONCILIATION_REQUIRED',
    financials: { potential: null, contracted: null, pending: null, confirmed: null },
    agenticTrade: 'ACCOUNT_AND_PUBLICATION_NOT_VERIFIED'
  };
}
function services(payload, now) {
  if (!Array.isArray(payload?.services) || payload.services.length > 50) throw new Error('Invalid catalog');
  const seen = new Set();
  const catalog = payload.services.filter(s => Object.hasOwn(SERVICE_NAMES, s?.serviceId)).map(s => {
    if (seen.has(s.serviceId) || s.status !== 'AVAILABLE' || count(s.unitPriceCredits) === null || !['payload','file','url','endpoint'].includes(s.unit)) throw new Error('Invalid service');
    seen.add(s.serviceId);
    return { id: s.serviceId, name: SERVICE_NAMES[s.serviceId], unit: s.unit, credits: s.unitPriceCredits, status: 'CATALOG_LISTED', execution: 'NOT_TESTED' };
  });
  return { status: 'AVAILABLE', observedAt: new Date(now).toISOString(), count: catalog.length, catalog };
}
export async function readEcosystem({ fetcher = fetch, now = Date.now() } = {}) {
  const parsers = { integrations, revenue, services };
  const entries = await Promise.all(Object.entries(SOURCES).map(async ([id, url]) => {
    try { return [id, { ...parsers[id](await readJSON(url, fetcher), now), source: url }]; }
    catch { return [id, { status: 'UNAVAILABLE', observedAt: null, source: url }]; }
  }));
  const modules = Object.fromEntries(entries);
  const available = entries.filter(([,m]) => m.status === 'AVAILABLE').length;
  return {
    schemaVersion: '1.0', mode: 'PUBLIC_READ_ONLY', observedAt: new Date(now).toISOString(),
    status: available === 3 ? 'AVAILABLE' : available ? 'DEGRADED' : 'UNAVAILABLE',
    modules,
    truth: 'Public metadata only. Catalog presence is not execution; connection is not balance; radar is not revenue.'
  };
}
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'PUBLIC_READ_ONLY_ENDPOINT' });
  }
  const result = await readEcosystem();
  return res.status(result.status === 'UNAVAILABLE' ? 503 : 200).json(result);
}
