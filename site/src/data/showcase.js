import { SYSTEM_INTELLIGENCE, systemHref } from './system-intelligence.js';
import pillars from '../../public/data/xpex-ecosystem-three-pillars-v1.json' with { type: 'json' };
import observations from '../../public/data/portfolio-observations-v2.json' with { type: 'json' };
import evidence from '../../public/data/showcase-evidence-v1.json' with { type: 'json' };

export const REPOSITORY = 'https://github.com/xpex-systems-ai/xpex-systems-ai';
export const CONTACT_URL = 'https://www.linkedin.com/in/ceojuniorsena';
export const SHOWCASE_EVIDENCE_URL = '/data/showcase-evidence-v1.json';
const doc = file => REPOSITORY + '/blob/main/docs/' + file;
const blueprint = doc('XPEX_THREE_PILLARS_BLUEPRINT.md');
const catalog = '/data/enterprise-agent-catalog-v1.json';

export function mediaFor(id) {
  return evidence.media[id];
}

export function runtimeObservation(id) {
  return evidence.observations[id];
}

const platformCopy = {
  'xpex-company': {
    title: pillars.company.name, category: 'Empresa', symbol: 'xpex',
    summary: 'Engenharia de IA, integração de sistemas e agentes especializados.',
    access: 'Público', status: 'Site público acessível', tone: 'public', environment: 'Produção',
    href: '/?view=company', action: 'Conhecer a empresa', evidenceUrl: REPOSITORY, evidenceLabel: 'Fonte GitHub',
    mediaId: 'xpex-company'
  },
  'xpex-evidence': {
    title: 'Portfólio de Evidências', category: 'Cases e Radar', symbol: 'audit-os',
    summary: 'Cases, auditorias e oportunidades no Radar. O Portfólio exige sessão no ChatGPT.',
    access: 'Login ChatGPT', status: 'Acesso autenticado', environment: 'ChatGPT Site',
    action: 'Abrir portfólio', evidenceUrl: blueprint, evidenceLabel: 'Ver blueprint'
  },
  'xpex-academy': {
    title: 'XPeX Academy', category: 'Educação', symbol: 'academy',
    summary: 'Polo Kelle Digital Lab, aprendizagem e projetos. Jornada acadêmica autenticada com validação pendente.',
    access: 'Login por convite', status: 'Preview restrito', environment: 'Piloto',
    action: 'Conhecer o piloto', evidenceUrl: blueprint, evidenceLabel: 'Ver blueprint', mediaId: 'academy'
  }
};

export const PLATFORMS = pillars.pillars.map(pillar => ({
  id: pillar.id,
  href: pillar.url,
  canonicalUrl: pillar.url,
  verifiedAt: pillars.snapshotAt,
  previewExpected: true,
  ...platformCopy[pillar.id],
  media: mediaFor(platformCopy[pillar.id].mediaId)
}));

const academyPlatform = PLATFORMS.find(platform => platform.id === 'xpex-academy');

// Localized editorial copy. Runtime, source and system identity come from the registry.
const systemCopy = {
  'systems-command': ['Gestão e governança', 'Registro de sistemas, ativos, fontes e evidências da empresa.', 'Staging registrado', 'Acesso do operador'],
  'audit-os': ['Auditoria', 'Inventário digital e preparação de achados para revisão humana.', 'Demonstração', 'Público'],
  'plugin-factory': ['Integração', 'Validação de blueprints e compilação de pacotes para agentes.', 'Demonstração registrada', 'Fonte pública'],
  'wallet-command': ['Operações', 'Marketplace, integrações e monitoramento com estados financeiros rastreáveis.', 'Em aprimoramento', 'Catálogo público'],
  'studio-ai': ['Criação', 'Interface para criação, operação de agentes e memória.', 'Demonstração', 'Público'],
  'api-fabric': ['Distribuição', 'Distribuição de serviços por API, com admissão e correlação de dados em andamento.', 'Em admissão', 'Fonte pública'],
  'academy': ['Educação', 'Piloto do Polo Kelle para aprendizagem e projetos aplicados.', 'Preview restrito', 'Login por convite']
};

export function systemShowcase(system) {
  const id = system.slug;
  const [category, summary, stage, access] = systemCopy[id];
  const observed = runtimeObservation(id);
  const checked = observations.publicDemos.some(demo => demo.id === id) || observations.staging.id === id;
  const academy = id === 'academy';
  const demo = system.status === 'DEMO READY' || system.status === 'HARDENING';
  const unavailable = observed?.httpStatus === 404;
  return {
    id, title: system.name, category, summary, access, stage,
    status: unavailable ? 'Runtime indisponível' : stage,
    environment: academy ? 'Piloto' : system.runtime.environment === 'canonical runtime correlation pending' ? 'Correlação pendente' : system.runtime.environment,
    tone: demo && !unavailable ? 'public' : 'limited',
    href: systemHref(id), action: 'Ver arquitetura',
    canonicalUrl: academy ? academyPlatform.canonicalUrl : observed?.url || system.runtime.url || system.source.url,
    runtimeAvailable: Boolean(observed?.httpStatus === 200 || (!observed && system.runtime.url)),
    evidenceUrl: academy ? blueprint : observed ? SHOWCASE_EVIDENCE_URL : checked ? '/data/portfolio-observations-v2.json' : system.source.url,
    evidenceLabel: 'Ver evidência',
    verifiedAt: observed?.observedAt || (academy ? pillars.snapshotAt : checked ? observations.observedAt : undefined),
    symbol: id,
    previewExpected: true,
    media: mediaFor(id)
  };
}

export const SYSTEMS = SYSTEM_INTELLIGENCE.map(systemShowcase);
export const ACADEMY = {
  ...academyPlatform,
  id: 'polo-kelle',
  title: 'Polo Kelle Digital Lab',
  summary: 'Conheça a entrada da Academy. Matrícula, progresso autenticado, certificados e pagamentos aguardam homologação.',
  href: academyPlatform.canonicalUrl
};

const reference = (id, title, category, summary, href, action, symbol = 'audit-os') => ({
  id, title, category, summary, href, action, symbol
});

export const TRUST = [
  reference('flagship-cases', 'Cases dos sistemas', 'Cases', 'Contexto, arquitetura e limites dos sistemas do portfólio.', doc('FLAGSHIP_CASES.md'), 'Ler os cases'),
  reference('enterprise-v2', 'Enterprise Experience V2', 'Pull request', 'Implementação da vitrine institucional e evidências de validação.', REPOSITORY + '/pull/58', 'Inspecionar a PR', 'xpex'),
  reference('system-registry', 'System Registry / Public Truth', 'Registro', 'Perfis canônicos e estados registrados dos sistemas.', '/data/system-intelligence-v1.json', 'Consultar registro', 'systems-command'),
  reference('trust-center', 'Trust / Evidence Layer', 'Governança', 'Controles de engenharia e critérios de divulgação pública.', doc('TRUST_CENTER.md'), 'Ver controles'),
  reference('three-pillars-pr', 'Integração dos três pilares', 'Pull request', 'Diff e discussão da PR #57, que publicou as três entradas.', REPOSITORY + '/pull/57', 'Inspecionar a PR', 'plugin-factory'),
  reference('checks', 'Validação do código', 'CI', 'Resultados de checagens por commit no GitHub Actions.', REPOSITORY + '/actions', 'Abrir o CI', 'api-fabric'),
  reference('deploy', 'Observações de runtime', 'Deploys', 'Ambientes, URLs e limites das verificações de disponibilidade.', '/data/portfolio-observations-v2.json', 'Ler snapshot', 'systems-command'),
  reference('system-pack', 'System Packs', 'Documentação', 'Perfis com arquitetura, segurança, evidências e manifesto técnico.', '/?view=systems', 'Explorar perfis', 'systems-command'),
  reference('trust-passport', 'Trust Passport do Command', 'Registro', 'Passaporte de confiança do sistema no repositório institucional.', REPOSITORY + '/blob/main/data/trust/system-passports/xpex-systems-command.json', 'Consultar passaporte'),
  reference('architecture', 'Arquitetura do ecossistema', 'Arquitetura', 'Planos de controle, execução, governança e evidência.', doc('ARCHITECTURE.md'), 'Ler arquitetura', 'systems-command')
];

export const INTEGRATIONS = [
  reference('github', 'GitHub', 'Código e CI', 'Repositório institucional, histórico de alterações e workflows.', REPOSITORY, 'Abrir repositório', 'xpex'),
  reference('vercel', 'Vercel', 'Hospedagem', 'Superfícies web e histórico de disponibilidade dos ambientes observados.', '/data/portfolio-observations-v2.json', 'Ver observações', 'xpex'),
  reference('supabase', 'Supabase', 'Autenticação no piloto', 'Login próprio da Academy. Matrícula e progresso autenticados seguem em validação.', blueprint, 'Ver limites do piloto', 'academy'),
  reference('firebase', 'Firebase', 'Linhagem documentada', 'A correlação do runtime canônico da Academy permanece pendente.', '/?system=academy', 'Ver perfil técnico', 'academy'),
  reference('api', 'API empresarial', 'Descoberta pública', 'Catálogo e correspondência de necessidades com capacidades documentadas.', '/api/agent-api', 'Consultar API', 'api-fabric'),
  reference('mcp', 'MCP empresarial', 'Descoberta pública', 'Interface para clientes compatíveis consultarem capacidades e fontes.', '/api/mcp/enterprise', 'Consultar MCP', 'plugin-factory'),
  reference('coinbase', 'Coinbase', 'Integração registrada', 'O conector tem registro histórico. A consulta financeira exige configuração e autorização do operador.', '/?view=ecosystem#eco-integrations', 'Ver estado da conexão', 'wallet-command')
];

export function agentShowcase(agent) {
  return {
    id: agent.id,
    // Canonical catalog title matches the agent detail page. Evidence Concierge is the backing capability.
    title: agent.name,
    category: agent.kind,
    summary: agent.summary,
    status: agent.state,
    access: agent.id === 'neural-copilot' || agent.id === 'api-mcp' ? 'Somente leitura' : 'Perfil público',
    href: '/?view=agents&agent=' + encodeURIComponent(agent.id),
    action: 'Ver capacidade',
    evidenceUrl: agent.id === 'api-mcp' || agent.id === 'neural-copilot' ? catalog : systemHref(agent.system),
    evidenceLabel: 'Ver fonte',
    symbol: agent.icon
  };
}

export function agentShowcaseItems(agents) {
  const catalogItems = agents.map(agentShowcase);
  const copilot = catalogItems.find(item => item.id === 'neural-copilot');
  return [
    ...catalogItems.map(item => item.id === 'plugin-factory' ? { ...item, id: 'plugin-factory-agent', title: 'XPeX Plugin Factory Agent' } :
      item.id === 'api-mcp' ? { ...item, title: 'API & MCP Runtime' } : item),
    { ...copilot, id: 'evidence-concierge', title: 'GX Evidence Concierge', summary: 'Experiência pública de consulta do GX Neural Copilot.', href: '/?view=company#gx' },
    { ...copilot, id: 'enterprise-evidence', title: 'Enterprise Evidence Concierge', status: 'Mesmo núcleo GX',
      summary: 'Apresentação editorial do GX Neural Copilot para diligência empresarial.', href: '/?view=company#gx' },
    { id: 'academy-support', title: 'Academy Support Agent', category: 'Educação', status: 'Conceito', access: 'Disponibilidade pendente',
      summary: 'Proposta editorial de suporte ao piloto da Academy.', href: '/?system=academy', action: 'Ver perfil da Academy', symbol: 'academy' }
  ];
}
