import { SYSTEM_INTELLIGENCE } from './system-intelligence.js';
import plan from '../../public/data/company-readiness-v1.json' with { type: 'json' };

export const COMPANY_PLAN = plan;
export const PUBLIC_REPO = 'https://github.com/xpex-systems-ai/xpex-systems-ai';
export const docURL = path => `${PUBLIC_REPO}/blob/main/${path}`;

export function getPreparation(slug) {
  const system = SYSTEM_INTELLIGENCE.find(s => s.slug === slug);
  const preparation = plan.systems.find(s => s.slug === slug);
  return system && preparation ? { ...preparation, system } : null;
}

export function companySnapshot() {
  return {
    schema_version: plan.schema_version,
    company: plan.company,
    status: plan.status,
    prepared_at: plan.prepared_at,
    source_review: plan.source_review,
    assurance: plan.assurance,
    commercial: plan.commercial,
    transaction_paths: plan.transaction_paths,
    gates: plan.gates,
    standards: plan.standards,
    systems: plan.systems.map(p => {
      const s = SYSTEM_INTELLIGENCE.find(s => s.slug === p.slug);
      return {
        slug: p.slug, name: s.name, status: s.status,
        source: s.source, runtime: s.runtime,
        priority: p.priority, preparation_status: p.preparation_status,
        dossier: `https://xpex-systems-ai.vercel.app/?view=company&system=${p.slug}`,
        pack: docURL(`${p.pack}/README.md`), next_actions: p.next_actions,
        verified_transfer: false, operating_cost: null,
        operating_cost_status: 'NOT_VERIFIED',
        limits: s.limits
      };
    }),
    public_materials: plan.public_materials,
    data_room: plan.data_room,
    boundary: 'PUBLIC_PREPARATION_METADATA_ONLY. Documentation is not independent verification, legal ownership proof, acquisition approval or settled revenue.'
  };
}

export function preparationCounts() {
  return {
    systems: plan.systems.length,
    dossiers: plan.systems.filter(s => s.preparation_status === 'DOCUMENTED').length,
    openGates: plan.gates.filter(g => g.status !== 'VERIFIED').length,
    publicMaterials: plan.public_materials.length
  };
}

// Financial calculations require explicit supplied inputs; unknown data stays unknown.
export function calculatePilotEconomics(values) {
  const names = ['price', 'hours', 'hourlyCost', 'apiCost', 'allocatedInfra', 'fees'];
  if (names.some(k => !['string','number'].includes(typeof values[k]) || (typeof values[k] === 'string' && !values[k].trim()))) return null;
  const parsed = Object.fromEntries(names.map(k => [k, Number(values[k])]));
  if (Object.values(parsed).some(n => !Number.isFinite(n) || n < 0) || parsed.price <= 0) return null;
  const cost = parsed.hours * parsed.hourlyCost + parsed.apiCost + parsed.allocatedInfra + parsed.fees;
  return { cost, contribution: parsed.price - cost, margin: (parsed.price - cost) / parsed.price, scenario: 'USER_INPUT_ESTIMATE_NOT_ACTUAL_REVENUE' };
}
