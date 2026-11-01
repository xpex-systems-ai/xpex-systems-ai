// Catálogo público de SUPERFÍCIES DE CONEXÃO, não registro de conexões efetivas.
export const XPEX_CONNECT_SURFACES = Object.freeze([
  Object.freeze({id:'rest',name:'REST / OpenAPI',stage:'Código de descoberta disponível',purpose:'Consulta de catálogo e capacidades de integração; operações empresariais requerem autenticação específica.',repo:'https://github.com/xpex-systems-ai/xpex-systems-ai',publicEndpoint:'/api/agent-api'}),
  Object.freeze({id:'mcp',name:'MCP Server',stage:'Descoberta pública no site',purpose:'Ferramentas de descoberta para clientes MCP compatíveis. Acesso a dados privados e ações de escrita não habilitados por esta interface.',repo:'https://github.com/xpex-systems-ai/xpex-systems-ai',publicEndpoint:'/api/mcp/enterprise'}),
  Object.freeze({id:'plugin',name:'Plugin / Extensão',stage:'Geração de pacote para revisão',purpose:'Plugin Factory compila manifests e blueprints; instalação, OAuth e aprovação dependem de cada plataforma.',repo:'https://github.com/xpex-systems-ai/XPeX-Plugin-Factory-',publicEndpoint:null}),
  Object.freeze({id:'cli',name:'CLI',stage:'Código de fábrica disponível',purpose:'CLI da Plugin Factory compila artefatos; não é cliente universal já publicado para todo produto da XPeX.',repo:'https://github.com/xpex-systems-ai/XPeX-Plugin-Factory-',publicEndpoint:null}),
  Object.freeze({id:'skill',name:'Skill / Agente',stage:'Pacotes gerados para revisão',purpose:'Arquivos SKILL.md e configurações para agentes compatíveis; cada runtime exige validação e permissões próprias.',repo:'https://github.com/xpex-systems-ai/XPeX-Plugin-Factory-',publicEndpoint:null})
]);
export const XPEX_ENTERPRISE_PRODUCT = Object.freeze({
  canonical:'OMNIX AI',
  connectors:'XPeX Connect',
  orchestration:'GXEON',
  compilation:'XPeX Plugin Factory',
  evidence:'XPeX Systems Command / Evidence OS',
  growth:'GXEON Growth OS',
  state:'Pré-implantação Enterprise: autenticação, autorização e execução ponta a ponta pendentes'
});
