// Editorial entries link to the nearest documented source or public entry point.
const architecture = 'https://github.com/xpex-systems-ai/xpex-systems-ai/blob/main/docs/';
const academy = '/?system=academy';
const item = (id, title, symbol, category, status, href, summary, concept = false) => ({
  id, title, symbol, category, status, href, summary, concept,
  access: status === 'Interno' ? 'Restrito' : 'Referência pública',
  action: 'Consultar referência'
});

export const MODULES = [
  item('enterprise-experience','XPeX Enterprise Experience','xpex','Vitrine','Site institucional','/','Portal público da XPeX.'),
  item('universal-auditor','XPeX Command / Universal Asset Auditor','systems-command','Auditoria','Escopo de referência','/?system=systems-command','Visão editorial da capacidade de auditoria de ativos.'),
  item('cash-engine','XPeX Cash Engine','wallet-command','Finanças','Runtime não verificado','/?system=wallet-command','Referência para rastreabilidade financeira.'),
  item('xpex-radar','XPeX Radar','gxeon','Pesquisa','Diretório público','/?view=radar','Fontes e programas acompanhados pelo Radar.'),
  item('learning-os','XPeX Academy Learning OS','academy','Educação','Preview',academy,'Ambiente acadêmico em piloto.'),
  ...[
    ['certificate-hub','Certificate Hub','Certificados e validação'],
    ['profile-hub','Profile Hub','Perfis acadêmicos'],
    ['course-hub','Course Hub','Organização de cursos'],
    ['super-admin','Super Admin','Administração restrita'],
    ['home-hub','Home Hub','Entrada da experiência acadêmica']
  ].map(([id,name,summary])=>item(id,'XPeX '+name,'academy','Academy',id==='super-admin'?'Interno':'Prévia conceitual',academy,summary+'.',true))
];

export const ROLES = [
  item('wallet-agent','Wallet Command Agent','wallet-command','Operações','Prévia conceitual','/?system=wallet-command','Papel editorial para contexto do Wallet.',true),
  item('radar-agent','Radar Intelligence Agent','gxeon','Pesquisa','Prévia conceitual','/?view=radar','Papel editorial para leitura das fontes do Radar.',true),
  item('portfolio-agent','Portfolio Evidence Agent','audit-os','Evidências','Prévia conceitual','/?view=company#gx','Papel editorial para descoberta de evidências.',true)
];

export const MORE_INTEGRATIONS = [
  item('railway','Railway','systems-command','Infraestrutura','Ambiente registrado','/?system=systems-command','Referência ao ambiente do Systems Command.'),
  item('google-ai-studio','Google / Google AI Studio','api-fabric','Desenvolvimento','Referência de provedor','https://aistudio.google.com/','Ambiente do Google para desenvolvimento com modelos.'),
  item('chatgpt','ChatGPT','gxeon','Distribuição','Login no Portfólio','/?view=ecosystem','Ponto de entrada para o Portfólio com sessão ChatGPT.'),
  item('mercado-pago','Mercado Pago','wallet-command','Pagamentos','Integração não verificada','https://www.mercadopago.com.br/developers/pt','Documentação pública do provedor de pagamentos.'),
  item('stripe','Stripe','wallet-command','Pagamentos','Integração não verificada','https://docs.stripe.com/','Documentação pública da Stripe.')
];

export const MORE_EVIDENCE = [
  item('capture-provenance','Proveniência de capturas','audit-os','Mídia','Registro público','/data/showcase-evidence-v1.json','Origens e revisão das capturas.'),
  item('institutional-blueprint','Blueprint institucional','plugin-factory','Arquitetura','Documento público',architecture+'XPEX_THREE_PILLARS_BLUEPRINT.md','Arquitetura e limites dos três pilares.'),
  item('evidence-showroom','Showroom de evidências','audit-os','Vitrine','Catálogo público','/?view=ecosystem#eco-evidence','Entradas de evidências do ecossistema.'),
  item('data-lineage','Data lineage / rastreabilidade','systems-command','Governança','Documento público',architecture+'PORTFOLIO.md','Rastreabilidade das fontes do portfólio.')
];

export const PLUGINS = [
  item('plugin-factory-extension','XPeX Plugin Factory','plugin-factory','Plugin XPeX','Fonte disponível','/?system=plugin-factory','Blueprints, ferramentas MCP e pacotes para revisão.'),
  item('gx-copilot-extension','GX Neural Copilot','gxeon','Plugin XPeX','Consulta pública','/?view=company#gx','Consulte arquitetura e evidências públicas.'),
  item('audit-engineer-extension','GXEON Audit Engineer','audit-os','Plugin XPeX','Em validação','/?view=agents&agent=audit-engineer','Diagnóstico de APIs e integrações.'),
  item('capability-market','GXEON Capability Market','api-fabric','Plugin XPeX','Catálogo existente','/?view=ecosystem','Serviços e pacotes declarados no ecossistema.')
];
