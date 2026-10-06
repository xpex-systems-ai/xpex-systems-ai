export const SYSTEM_INTELLIGENCE = [
  {
    slug:'systems-command',
    id:'XPEX-SYSTEMS-COMMAND',
    name:'XPeX Systems Command',
    role:'Company Intelligence & Evidence OS',
    tier:'FLAGSHIP',
    status:'STAGING VERIFIED',
    tone:'amber',
    tagline:'Know what exists. Know what is canonical. Know what proves it.',
    summary:'A provenance-first control plane for discovering company accounts, systems, assets and evidence without silently rewriting the source systems.',
    problem:'AI-native companies spread code, deployments, databases, agents and accounts across providers. Without a canonical evidence layer, nobody can quickly prove what exists, who owns it, where it runs or which claims are current.',
    built:'XPeX built a modular registry and audit control plane with provider adapters, evidence records, system identity, audit lifecycle and fail-closed internal boundaries.',
    tech:['Next.js 15','React 19','TypeScript','Prisma','PostgreSQL','Zod','Vitest','Railway'],
    architecture:['Provider discovery','Native identity + provenance','Canonical system registry','Evidence ingestion','Audit lifecycle','Company Intelligence queries'],
    security:['Internal registry APIs fail closed without server-side authentication.','Provider writes remain disabled in the foundation path.','Production promotion is explicitly gated pending stronger identity/RBAC/token-vault controls and independent approval.'],
    limits:['Current environment is staging.','Public production assurance is not claimed.','Real provider connectivity remains bounded by admission/security gates.'],
    runtime:{provider:'Railway',environment:'staging',state:'SUCCESS',deployment:'13013067-a3e1-45b5-8bab-c747e87c3c35',url:'https://xpex-systems-command-staging-web-production.up.railway.app'},
    source:{repo:'xpex-systems-ai/xpex-systems-command',visibility:'PRIVATE',url:'https://github.com/xpex-systems-ai/xpex-systems-command'},
    evidence:[
      {label:'Architecture',url:'https://github.com/xpex-systems-ai/xpex-systems-command/blob/main/docs/ARCHITECTURE.md',kind:'SOURCE'},
      {label:'Security',url:'https://github.com/xpex-systems-ai/xpex-systems-command/blob/main/docs/SECURITY.md',kind:'SECURITY'},
      {label:'Evidence First',url:'https://github.com/xpex-systems-ai/xpex-systems-command/blob/main/docs/EVIDENCE-FIRST.md',kind:'GOVERNANCE'},
      {label:'Corporate Case',url:'https://github.com/xpex-systems-ai/xpex-systems-ai/blob/main/docs/FLAGSHIP_CASES.md',kind:'CASE'}
    ],
    media:[
      {type:'screenshot',classification:'E1',label:'Staging Command Overview',caption:'Real staging surface captured with zero/empty-state metrics; it does not imply active asset counts.',publication:'APPROVED_METADATA'},
      {type:'live',classification:'E1',label:'Live staging runtime',url:'https://xpex-systems-command-staging-web-production.up.railway.app',publication:'LIVE'}
    ],
    related:['audit-os','plugin-factory','api-fabric']
  },
  {
    slug:'wallet-command',
    id:'GXEON-WALLET-COMMAND',
    name:'GXEON Wallet Command Center',
    role:'Agent Marketplace · Wallet Intelligence · Web3 Truth Layer',
    tier:'FLAGSHIP',
    status:'HARDENING',
    tone:'amber',
    tagline:'Watch value. Verify settlement. Never confuse the two.',
    summary:'A financial/Web3 control plane that separates monitoring, agent demand, bounty/payment workflow and settled money while keeping private signing outside the browser.',
    problem:'Agent/Web3 dashboards become dangerous when watch-only balances, pending claims, internal credits and settled money are blended into one number.',
    built:'GXEON separates the web control plane from the signing plane, exposes public MCP discovery for agent buyers and maintains explicit Money Truth invariants.',
    tech:['React','Vite','TypeScript','Firebase/Firestore','Vercel Functions','Stripe','viem','MCP','Python local bridge'],
    architecture:['Web control plane','Read/monitor plane','Agent marketplace discovery','Payment verification','Local signing boundary','Blockchain adapters'],
    security:['No private keys/seeds in GitHub, Firebase or browser storage.','Control Plane != Signing Plane.','Watch-only by default.','SUBMITTED != PAID.','Human-verified signing remains local.'],
    limits:['A Node url.parse deprecation warning remains a documented hardening item.','Public wallet monitoring is not proof of ownership.','Checkout or submission is not revenue.'],
    runtime:{provider:'Vercel',environment:'production',state:'READY',project:'prj_GRGA7dhQ0lLnyWN7ixIJ8MGlPrhe',url:'https://gxeon-wallet-command-center.vercel.app'},
    source:{repo:'xpex-systems-ai/GXEON-Wallet-Command-Center',visibility:'PUBLIC',url:'https://github.com/xpex-systems-ai/GXEON-Wallet-Command-Center'},
    evidence:[
      {label:'Security Model',url:'https://github.com/xpex-systems-ai/GXEON-Wallet-Command-Center/blob/main/docs/SECURITY_MODEL.md',kind:'SECURITY'},
      {label:'Agent Marketplace',url:'https://github.com/xpex-systems-ai/GXEON-Wallet-Command-Center/blob/main/docs/AGENT_MARKETPLACE.md',kind:'PRODUCT'},
      {label:'Financial State Machine',url:'https://github.com/xpex-systems-ai/GXEON-Wallet-Command-Center/blob/main/docs/FINANCIAL_STATE_MACHINE.md',kind:'TRUTH'},
      {label:'Public Marketplace',url:'https://gxeon-wallet-command-center.vercel.app/market',kind:'LIVE'}
    ],
    media:[
      {type:'screenshot',classification:'E2',label:'Wallet Command Center',caption:'Real product screenshot exists; public wallet address must be redacted before publication.',publication:'REDACT_FIRST'},
      {type:'live',classification:'E1',label:'Live production runtime',url:'https://gxeon-wallet-command-center.vercel.app',publication:'LIVE'}
    ],
    related:['plugin-factory','api-fabric','systems-command']
  },
  {
    slug:'audit-os',
    id:'GXEON-AUDIT-OS',
    name:'GXEON Audit OS',
    role:'Evidence-led Digital Systems Audit',
    tier:'FLAGSHIP',
    status:'DEMO READY',
    tone:'green',
    tagline:'Claims are cheap. Evidence is operational.',
    summary:'An AI-assisted audit surface for inventorying digital assets, preparing findings and preserving a manual-first / preview-first execution boundary.',
    problem:'Digital systems accumulate claims faster than evidence, making it difficult to separate what is deployed, inferred, duplicated or merely planned.',
    built:'GXEON Audit OS turns discovery into an evidence-led review workflow while keeping execution boundaries visible.',
    tech:['GXEON-AI lineage','Web application','Vercel','Evidence workflows','Audit orchestration'],
    architecture:['Asset discovery','Classification','Evidence capture','Finding preparation','Human review','Public-safe result'],
    security:['Manual-first / preview-first operating posture.','Duplicate deployment shells are not promoted as separate products.','Runtime evidence is kept separate from marketing claims.'],
    limits:['The GXEON-AI source lineage serves multiple surfaces and still requires canonical consolidation.'],
    runtime:{provider:'Vercel',environment:'production',state:'READY',project:'prj_owdXFSlvK1GBrWVuYCqeHpTlYjP4',url:'https://gxeon-audit-os.vercel.app',runtimeErrors7d:'NONE_OBSERVED'},
    source:{repo:'xpex-systems-ai/GXEON-AI',visibility:'PUBLIC',url:'https://github.com/xpex-systems-ai/GXEON-AI'},
    evidence:[
      {label:'Live Audit OS',url:'https://gxeon-audit-os.vercel.app',kind:'LIVE'},
      {label:'Source lineage',url:'https://github.com/xpex-systems-ai/GXEON-AI',kind:'SOURCE'},
      {label:'Corporate Case',url:'https://github.com/xpex-systems-ai/xpex-systems-ai/blob/main/docs/FLAGSHIP_CASES.md',kind:'CASE'}
    ],
    media:[{type:'live',classification:'E1',label:'Live production runtime',url:'https://gxeon-audit-os.vercel.app',publication:'LIVE'}],
    related:['systems-command','studio-ai','plugin-factory']
  },
  {
    slug:'plugin-factory',
    id:'XPEX-PLUGIN-FACTORY',
    name:'XPeX Plugin Factory',
    role:'MCP · Plugin · Skill Compiler',
    tier:'FLAGSHIP',
    status:'DEMO READY',
    tone:'green',
    tagline:'Blueprint in. Policy checked. Review-ready agent package out.',
    summary:'An industrial compiler that turns a strict JSON blueprint into deterministic plugin, MCP and skill packages with security-policy gates.',
    problem:'Agent integrations are often assembled manually, creating inconsistent manifests, weak security boundaries and non-repeatable packaging.',
    built:'The Factory validates a blueprint, applies policy, generates manifests/MCP/skills, produces a report and creates a deterministic ZIP artifact.',
    tech:['TypeScript','Node 22','Express 5','Zod','JSZip','Vitest','MCP','Railway','x402'],
    architecture:['Blueprint','Schema validation','Security policy engine','Manifest/MCP/Skill compiler','Factory report','Deterministic ZIP'],
    security:['Rejects embedded secrets and private keys.','Rejects unsafe/private-network MCP endpoints.','Write-capable surfaces require human-approval boundaries.','Runtime credentials are never generated into plugin packages.'],
    limits:['Payment surfaces do not prove revenue.','The public MCP surface does not publish or mutate third-party systems.'],
    runtime:{provider:'Railway',environment:'production',state:'SUCCESS',deployment:'20b15638-e776-420e-82ef-d9ab5ed80d15',url:'https://xpex-plugin-factory-production.up.railway.app'},
    source:{repo:'xpex-systems-ai/XPeX-Plugin-Factory-',visibility:'PUBLIC',url:'https://github.com/xpex-systems-ai/XPeX-Plugin-Factory-'},
    evidence:[
      {label:'Live Factory',url:'https://xpex-plugin-factory-production.up.railway.app',kind:'LIVE'},
      {label:'MCP endpoint',url:'https://xpex-plugin-factory-production.up.railway.app/mcp',kind:'MCP'},
      {label:'Architecture',url:'https://github.com/xpex-systems-ai/XPeX-Plugin-Factory-/blob/main/docs/ARCHITECTURE.md',kind:'SOURCE'},
      {label:'Security',url:'https://github.com/xpex-systems-ai/XPeX-Plugin-Factory-/blob/main/docs/SECURITY.md',kind:'SECURITY'}
    ],
    media:[{type:'live',classification:'E1',label:'Live production service',url:'https://xpex-plugin-factory-production.up.railway.app',publication:'LIVE'}],
    related:['wallet-command','api-fabric','systems-command']
  },
  {
    slug:'studio-ai',
    id:'XPEX-STUDIO-AI',
    name:'XPeX Studio AI',
    role:'AI Creation Control Plane',
    tier:'FLAGSHIP',
    status:'DEMO READY',
    tone:'green',
    tagline:'One control plane for creation, agents and memory.',
    summary:'A Next.js control-plane frontend foundation with Genesis, Agent Core and Memory Core modules and Supabase-auth readiness.',
    problem:'Creative and agent workflows fragment across disconnected AI tools, sessions and memory surfaces.',
    built:'XPeX Studio AI provides a coherent modular shell for creation, agent operations and memory workflows.',
    tech:['Next.js 14','React 18','TypeScript','TailwindCSS','Supabase Auth readiness','Vercel'],
    architecture:['Genesis','Agent Core','Memory Core','Auth readiness','API contracts','Vercel runtime'],
    security:['Browser auth is disabled until required public Supabase variables are configured.','Stronger auth/data claims remain evidence-gated.'],
    limits:['Source is private.','Auth/data runtime needs stronger provider-backed correlation before production-level claims.'],
    runtime:{provider:'Vercel',environment:'production',state:'READY',project:'prj_Vz5ENExQovKTZKVqG35Cet9rExUl',url:'https://xpex-studio-ai.vercel.app',runtimeErrors7d:'NONE_OBSERVED'},
    source:{repo:'xpex-systems-ai/xpex-studio-ai',visibility:'PRIVATE',url:'https://github.com/xpex-systems-ai/xpex-studio-ai'},
    evidence:[
      {label:'Live Studio',url:'https://xpex-studio-ai.vercel.app',kind:'LIVE'},
      {label:'Corporate Case',url:'https://github.com/xpex-systems-ai/xpex-systems-ai/blob/main/docs/FLAGSHIP_CASES.md',kind:'CASE'}
    ],
    media:[{type:'live',classification:'E1',label:'Live production runtime',url:'https://xpex-studio-ai.vercel.app',publication:'LIVE'}],
    related:['audit-os','academy','systems-command']
  },
  {
    slug:'api-fabric',
    id:'XPEX-API-FABRIC',
    name:'XPeX API Fabric / Agent Marketplace',
    role:'API & Machine-Service Distribution',
    tier:'FLAGSHIP CANDIDATE',
    status:'ADMISSION',
    tone:'amber',
    tagline:'Distribute machine services without losing source, runtime or commercial truth.',
    summary:'A production-deployed API/product lineage with Supabase, Stripe and source hardening under enterprise admission.',
    problem:'Agent-consumable APIs need distribution and billing surfaces, but those surfaces are meaningless without source/runtime identity and data ownership evidence.',
    built:'XPeX built an API marketplace lineage and is now resolving canonical identity, branding and Supabase ownership before full public promotion.',
    tech:['React','Supabase','Stripe','API infrastructure','Vercel','CodeQL'],
    architecture:['Service catalog','API surface','Data layer','Commercial boundary','Runtime deployment','Admission evidence'],
    security:['Source hardening is merged.','CodeQL/source assurance is part of admission.','Canonical database ownership must be correlated before stronger claims.'],
    limits:['Legacy repository/project naming remains.','Canonical GXEON Agent Marketplace identity is not yet proven.','Supabase runtime ownership correlation is incomplete.'],
    runtime:{provider:'Vercel',environment:'production',state:'READY',project:'prj_3gcH2XkcpFatpPEAZZF56IBCqvsZ',runtimeErrors7d:'NONE_OBSERVED'},
    source:{repo:'xpex-systems-ai/remix-of-remix-of-remix-of-remix-of-xpex-api-hub-87',visibility:'PUBLIC',url:'https://github.com/xpex-systems-ai/remix-of-remix-of-remix-of-remix-of-xpex-api-hub-87'},
    evidence:[
      {label:'Source',url:'https://github.com/xpex-systems-ai/remix-of-remix-of-remix-of-remix-of-xpex-api-hub-87',kind:'SOURCE'},
      {label:'Corporate Case',url:'https://github.com/xpex-systems-ai/xpex-systems-ai/blob/main/docs/FLAGSHIP_CASES.md',kind:'CASE'},
      {label:'Portfolio Registry',url:'https://github.com/xpex-systems-ai/xpex-systems-ai/blob/main/data/company/portfolio-registry-v1.json',kind:'JSON'}
    ],
    media:[{type:'manifest',classification:'E1',label:'Runtime + source manifest',publication:'PUBLIC'}],
    related:['wallet-command','plugin-factory','systems-command']
  },
  {
    slug:'academy',
    id:'XPEX-ACADEMY',
    name:'XPeX Academy',
    role:'AI Learning & Applied Projects',
    tier:'FLAGSHIP CANDIDATE',
    status:'RUNTIME CORRELATION',
    tone:'amber',
    tagline:'Move from lessons into applied AI production.',
    summary:'A Polo/Student learning platform direction with courses, AI Lab, project workspace and applied AI workflows.',
    problem:'AI education often stops at content consumption instead of taking learners into real project and production workflows.',
    built:'XPeX Academy combines learning operations with AI Lab and project-workspace concepts designed for applied execution.',
    tech:['Web platform','Firebase lineage','Railway lineage','AI Lab','Course operations','Student/Polo model'],
    architecture:['Polo operations','Student experience','Course/player','Activities & assessment','AI Lab','Project workspace'],
    security:['Legacy Vercel paths were intentionally decommissioned according to recorded deployment metadata.','Canonical runtime must be provider-correlated before live-demo promotion.'],
    limits:['Current connected provider inventory does not yet corroborate the canonical Firebase/Railway runtime.','Public demo URL and current production health remain open evidence gates.'],
    runtime:{provider:'Firebase + Railway declared in source',environment:'canonical runtime correlation pending',state:'UNVERIFIED_CURRENT_RUNTIME',legacyVercelCopies:6,legacyVercelState:'CANCELED'},
    source:{repo:'xpex-systems-ai/XPEX-ACADEMY',visibility:'PUBLIC',url:'https://github.com/xpex-systems-ai/XPEX-ACADEMY'},
    evidence:[
      {label:'Source',url:'https://github.com/xpex-systems-ai/XPEX-ACADEMY',kind:'SOURCE'},
      {label:'Corporate Case',url:'https://github.com/xpex-systems-ai/xpex-systems-ai/blob/main/docs/FLAGSHIP_CASES.md',kind:'CASE'},
      {label:'Portfolio Registry',url:'https://github.com/xpex-systems-ai/xpex-systems-ai/blob/main/data/company/portfolio-registry-v1.json',kind:'JSON'}
    ],
    media:[{type:'manifest',classification:'E3',label:'Canonical runtime evidence pending correlation',publication:'INTERNAL_GATE'}],
    related:['studio-ai','systems-command','audit-os']
  }
];

export const MATERIAL_LINEAGES = [
  'XPeX Systems Command','GXEON Wallet Command Center','XPeX Plugin Factory','GXEON Agent Gateway',
  'XPeX API Fabric / GoldMail lineage','GXEON Audit OS','GXEON AI core/API','XPeX Studio AI',
  'XPeX Academy','GXEON App Forge','GXEON Media Center','Cenara','Synapse Revenue Hub',
  'Product Forge AI','AutomAI XPeX Systems','XPeX Commander','XPeX Monetary Dashboard',
  'XPeX Creator Commerce OS','XPeX OS','XPeX Lead Flow'
];

export function getSystem(slug){ return SYSTEM_INTELLIGENCE.find(x=>x.slug===slug); }
export function systemHref(slug){ return '/?system='+encodeURIComponent(slug); }
