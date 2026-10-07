export const ENTERPRISE_OFFERINGS = [
  {
    id:'company-intelligence',
    name:'XPeX Company Intelligence',
    category:'enterprise-ai',
    buyers:['CTO','CIO','Head of AI','Innovation Lead','Platform Engineering'],
    needs:['inventory systems','map ai stack','prove deployments','company intelligence','technical due diligence','governance','asset discovery','provenance'],
    promise:'Create an evidence-backed map of systems, source, runtime, ownership, agents and open gates before automation expands.',
    systems:['systems-command','audit-os'],
    maturity:'PILOT READY',
    engagement:'discovery + evidence audit + control-plane pilot',
    proof:[
      'https://xpex-systems-ai.vercel.app/?system=systems-command',
      'https://xpex-systems-ai.vercel.app/?system=audit-os'
    ]
  },
  {
    id:'agentic-engineering',
    name:'XPeX Agentic Engineering',
    category:'agents',
    buyers:['CTO','VP Engineering','Head of AI','AI Platform Team','Developer Tools'],
    needs:['build ai agents','mcp integration','plugin integration','agent tools','agent governance','agent orchestration','codex integration','chatgpt integration'],
    promise:'Turn agent requirements into governed tools, MCP surfaces, skills and evidence-backed system integrations.',
    systems:['plugin-factory','systems-command','api-fabric'],
    maturity:'DEMO + PILOT',
    engagement:'agent architecture + MCP/plugin implementation + governance',
    proof:[
      'https://xpex-systems-ai.vercel.app/?system=plugin-factory',
      'https://xpex-systems-ai.vercel.app/api/mcp/gx'
    ]
  },
  {
    id:'digital-worker-composition',
    name:'Neural Workforce / Digital Worker Composition',
    category:'neural-workforce',
    buyers:['COO','Innovation Lead','Operations','SMB Platform','Vertical SaaS'],
    needs:['digital worker','automate workflow','combine apps','ai workforce','agent employee','workflow agent','human in the loop','specialized agent'],
    promise:'Compose existing applications, skills and governed agents into specialized digital workers that expand human capability.',
    systems:['plugin-factory','systems-command','studio-ai'],
    maturity:'DESIGN + WORKING BUILDING BLOCKS',
    engagement:'workflow decomposition + capability graph + digital-worker blueprint',
    proof:[
      'https://github.com/xpex-systems-ai/xpex-systems-ai/blob/main/NEURAL_WORKFORCE_MANIFESTO.md',
      'https://xpex-plugin-factory-production.up.railway.app'
    ]
  },
  {
    id:'enterprise-audit',
    name:'GXEON Evidence Audit',
    category:'audit',
    buyers:['Founder','CTO','Technical Investor','Accelerator','M&A / Due Diligence','Security Lead'],
    needs:['audit ai company','verify product','technical audit','due diligence','evidence review','runtime verification','portfolio audit'],
    promise:'Separate deployed, inferred, duplicated and planned assets into a reviewable evidence map.',
    systems:['audit-os','systems-command'],
    maturity:'DEMO READY',
    engagement:'read-only discovery + technical evidence report',
    proof:[
      'https://gxeon-audit-os.vercel.app',
      'https://github.com/xpex-systems-ai/xpex-systems-ai/blob/main/docs/FLAGSHIP_CASES.md'
    ]
  },
  {
    id:'agent-distribution',
    name:'XPeX Agent & API Distribution',
    category:'distribution',
    buyers:['Agent Platform','AI Marketplace','API Marketplace','Developer Platform','Enterprise Innovation'],
    needs:['distribute agents','agent marketplace','sell agent services','api marketplace','machine service','agent discovery','mcp marketplace'],
    promise:'Package machine-consumable services with discovery, evidence, policy boundaries and commercial admission gates.',
    systems:['api-fabric','plugin-factory','wallet-command'],
    maturity:'ADMISSION / PILOT',
    engagement:'service packaging + MCP/API discovery + marketplace integration',
    proof:[
      'https://xpex-systems-ai.vercel.app/?system=api-fabric',
      'https://xpex-systems-ai.vercel.app/?system=wallet-command'
    ]
  },
  {
    id:'ai-learning',
    name:'XPeX Applied AI Learning',
    category:'education',
    buyers:['Education Provider','Training Organization','Corporate L&D','School','Community Program'],
    needs:['ai training','student ai lab','agent education','applied ai course','workforce reskilling','learning platform'],
    promise:'Move learners from AI concepts into applied projects, labs and production-oriented workflows.',
    systems:['academy'],
    maturity:'RUNTIME CORRELATION',
    engagement:'education architecture + applied AI curriculum/platform pilot',
    proof:[
      'https://xpex-systems-ai.vercel.app/?system=academy',
      'https://github.com/xpex-systems-ai/XPEX-ACADEMY'
    ]
  },
  {
    id:'ai-creation-control-plane',
    name:'XPeX AI Creation Control Plane',
    category:'creative-ai',
    buyers:['Creative Team','Agency','Media Company','Marketing Operations','Creator Platform'],
    needs:['ai studio','creative agents','content workflow','memory core','agent creative workflow','ai creation platform'],
    promise:'Unify AI creation, agent operations and memory-oriented workflows behind one control-plane experience.',
    systems:['studio-ai'],
    maturity:'DEMO READY',
    engagement:'creative workflow pilot + agent/tool integration',
    proof:[
      'https://xpex-studio-ai.vercel.app',
      'https://xpex-systems-ai.vercel.app/?system=studio-ai'
    ]
  }
];

export const BUYER_PROFILES = [
  {
    id:'enterprise-ai-lead',
    title:'Enterprise AI / Innovation Lead',
    signals:['agent governance','multiple ai tools','mcp','enterprise integration','proof','risk','platform'],
    recommended:['company-intelligence','agentic-engineering','digital-worker-composition']
  },
  {
    id:'technical-founder',
    title:'Technical Founder / CTO',
    signals:['agents','mcp','deployment','code','technical audit','platform','developer tools'],
    recommended:['agentic-engineering','enterprise-audit','agent-distribution']
  },
  {
    id:'accelerator-investor',
    title:'Accelerator / Technical Investor',
    signals:['due diligence','portfolio','founder execution','traction proof','deployment evidence','technical risk'],
    recommended:['enterprise-audit','company-intelligence']
  },
  {
    id:'operations',
    title:'Operations / COO',
    signals:['workflow','automation','manual process','multiple apps','digital worker','human approval'],
    recommended:['digital-worker-composition','company-intelligence']
  },
  {
    id:'agent-platform',
    title:'Agent / API Platform',
    signals:['marketplace','agent discovery','mcp server','api distribution','machine services','plugins'],
    recommended:['agent-distribution','agentic-engineering']
  }
];

export const ENTERPRISE_CONTACT = {
  company:'XPeX Systems AI',
  website:'https://xpex-systems-ai.vercel.app',
  founder:'Junior Sena',
  founder_role:'Applied AI / Agentic Systems Engineer · Founder',
  linkedin:'https://www.linkedin.com/in/ceojuniorsena',
  github:'https://github.com/xpex-systems-ai/xpex-systems-ai',
  case_pack:'https://github.com/xpex-systems-ai/xpex-systems-ai/blob/main/docs/FLAGSHIP_CASES.md',
  application_pack:'https://github.com/xpex-systems-ai/xpex-systems-ai/blob/main/docs/ACCELERATOR_APPLICATION_PACK.md'
};
