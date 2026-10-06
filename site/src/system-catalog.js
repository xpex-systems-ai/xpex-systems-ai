import catalog from '../../data/company/neural-system-catalog-v2.json';

export const NEURAL_CATALOG = catalog;

export function getSystemById(id) {
  return catalog.systems.find(system => system.id === id) || null;
}

export function catalogForGX() {
  return catalog.systems.map(system => ({
    id: system.id,
    name: system.name,
    role: system.role,
    state: system.state,
    tier: system.tier,
    description: system.description,
    stack: system.stack,
    runtime: system.runtime,
    evidence: system.evidence,
    open_gates: system.open_gates
  }));
}
