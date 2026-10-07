import './styles.css';
import './gx.css';
import { initGX } from './gx.js';
import './system-page.css';
import './global-launch.css';
import './enterprise-agent-api.css';
import { maybeRenderSystemPage, rewriteSystemLinks } from './system-page.js';
import { initGlobalLaunchRadar } from './global-launch.js';
import { initEnterpriseAgentAPI } from './enterprise-agent-api.js';

const systems = [
  {
    slug: 'systems-command',
    name: 'XPeX Systems Command',
    role: 'Company Intelligence & Evidence OS',
    status: 'STAGING VERIFIED',
    tone: 'amber',
    copy: 'Maps systems, providers, runtime evidence and provenance into one operational control plane.',
    proof: 'Railway · PostgreSQL · Evidence registry',
    href: 'https://github.com/xpex-systems-ai/xpex-systems-command'
  },
  {
    slug: 'audit-os',
    name: 'GXEON Audit OS',
    role: 'Evidence-led systems audit',
    status: 'DEMO READY',
    tone: 'green',
    copy: 'Turns infrastructure discovery into findings, evidence and reviewable technical decisions.',
    proof: 'Vercel READY · Runtime error query clean',
    href: 'https://gxeon-audit-os.vercel.app'
  },
  {
    slug: 'plugin-factory',
    name: 'XPeX Plugin Factory',
    role: 'MCP · Plugin · Skill compiler',
    status: 'DEMO READY',
    tone: 'green',
    copy: 'Compiles strict blueprints into deterministic agent packages with policy and security gates.',
    proof: 'Railway SUCCESS · MCP live',
    href: 'https://xpex-plugin-factory-production.up.railway.app'
  },
  {
    slug: 'studio-ai',
    name: 'XPeX Studio AI',
    role: 'AI creation control plane',
    status: 'DEMO READY',
    tone: 'green',
    copy: 'A production frontend foundation for Genesis, Agent Core and Memory Core workflows.',
    proof: 'Vercel READY · Next.js',
    href: 'https://xpex-studio-ai.vercel.app'
  },
  {
    slug: 'wallet-command',
    name: 'GXEON Wallet Command Center',
    role: 'Agent marketplace · Web3 truth layer',
    status: 'HARDENING',
    tone: 'amber',
    copy: 'Separates watch-only state, agent demand, payment evidence and settled money with explicit truth boundaries.',
    proof: 'Vercel READY · MCP discovery',
    href: 'https://gxeon-wallet-command-center.vercel.app'
  },
  {
    slug: 'api-fabric',
    name: 'XPeX API Fabric',
    role: 'API & machine-service distribution',
    status: 'ADMISSION',
    tone: 'amber',
    copy: 'Production API lineage under enterprise admission, with source assurance and provider evidence.',
    proof: 'Vercel READY · CodeQL',
    href: 'https://github.com/xpex-systems-ai/remix-of-remix-of-remix-of-remix-of-xpex-api-hub-87'
  },
  {
    slug: 'academy',
    name: 'XPeX Academy',
    role: 'AI learning & applied projects',
    status: 'RUNTIME CORRELATION',
    tone: 'amber',
    copy: 'Learning, Polo and student operations designed to move from education into applied AI production.',
    proof: 'GitHub + Firebase + Railway lineage',
    href: 'https://github.com/xpex-systems-ai/XPEX-ACADEMY'
  }
];

const checks = [
  'Governance Validation',
  'Public Truth',
  'Portfolio Registry',
  'Secret Hygiene',
  'Secret Pattern Scan',
  'Assurance Tests',
  'Action Supply Chain',
  'Workflow Supply Chain',
  'CodeQL',
  'OpenSSF Scorecard'
];

const app = document.querySelector('#app');

app.innerHTML = `
  <div class="noise"></div>
  <header class="nav shell">
    <a class="brand" href="#top" aria-label="XPeX Systems AI home">
      <span class="brand-mark">X</span>
      <span><b>XPeX</b><small>SYSTEMS AI</small></span>
    </a>
    <nav>
      <a href="#systems">Systems</a>
      <a href="#trust">Trust</a>
      <a href="#gx">GX</a>
      <a href="#founder">Founder</a>
      <a href="#agent-api">Agent API</a>
      <a href="#launch">Global Launch</a>
      <a href="#contact">Review</a>
    </nav>
    <a class="button ghost" href="https://github.com/xpex-systems-ai" target="_blank" rel="noreferrer">GitHub ↗</a>
  </header>

  <main id="top">
    <section class="hero shell">
      <div class="eyebrow"><span></span> AI SYSTEMS · AGENTS · COMPANY INTELLIGENCE</div>
      <h1>Intelligence that can<br/><em>operate — and prove it.</em></h1>
      <p class="hero-copy">XPeX Systems AI builds evidence-aware infrastructure for intelligent software, autonomous agents and enterprise operations.</p>
      <div class="hero-actions">
        <a class="button primary" href="#systems">Explore systems</a>
        <a class="button" href="#trust">Open Trust Layer</a>
      </div>
      <div class="hero-proof">
        <div><strong>103</strong><span>provider projects observed</span></div>
        <div><strong>20</strong><span>material asset lineages</span></div>
        <div><strong>10</strong><span>portfolio systems</span></div>
        <div><strong>7</strong><span>flagship surfaces</span></div>
      </div>
      <div class="orbital" aria-hidden="true">
        <i></i><i></i><i></i><b></b>
      </div>
    </section>

    <section class="marquee" aria-label="Operating principles">
      <div>BUILD <span>•</span> CONNECT <span>•</span> OPERATE <span>•</span> PROVE <span>•</span> BUILD <span>•</span> CONNECT <span>•</span> OPERATE <span>•</span> PROVE</div>
    </section>

    <section class="shell manifesto">
      <div>
        <p class="kicker">THE OPERATING MODEL</p>
        <h2>Enterprise engineering foundation.<br/>Pre-seed commercial maturity.</h2>
      </div>
      <p>We do not promote a system because it looks complete. XPeX separates discovery, identity, runtime, security and commercial truth — then requires evidence before promotion.</p>
    </section>

    <section id="systems" class="shell section">
      <div class="section-head">
        <div>
          <p class="kicker">FLAGSHIP PORTFOLIO</p>
          <h2>Seven systems.<br/>One operating architecture.</h2>
        </div>
        <p>External reviewers see a small canonical set — not a graveyard of experiments and duplicate deployments.</p>
      </div>
      <div class="systems-grid">
        ${systems.map((s, i) => `
          <a class="system-card" href="${s.href}" data-system-slug="${s.slug}" style="--i:${i}">
            <div class="system-top">
              <span class="index">0${i + 1}</span>
              <span class="status ${s.tone}">${s.status}</span>
            </div>
            <h3>${s.name}</h3>
            <p class="role">${s.role}</p>
            <p class="desc">${s.copy}</p>
            <div class="proof"><span></span>${s.proof}</div>
            <div class="open">View evidence ↗</div>
          </a>
        `).join('')}
      </div>
    </section>

    <section class="dark-band">
      <div class="shell intelligence">
        <div class="intelligence-copy">
          <p class="kicker">COMPANY INTELLIGENCE</p>
          <h2>Know what exists.<br/>Know what is canonical.<br/>Know what proves it.</h2>
          <p>XPeX Systems Command is designed to connect source, deployment, data, agents, ownership and evidence without silently rewriting the systems being observed.</p>
          <a href="https://github.com/xpex-systems-ai/xpex-systems-ai/blob/main/docs/FLAGSHIP_CASES.md" class="text-link" target="_blank" rel="noreferrer">Read flagship case pack →</a>
        </div>
        <div class="graph" aria-label="XPeX evidence graph illustration">
          <div class="node core">XPeX<br/><b>COMMAND</b></div>
          <div class="node n1">SOURCE</div>
          <div class="node n2">RUNTIME</div>
          <div class="node n3">DATA</div>
          <div class="node n4">AGENTS</div>
          <div class="node n5">EVIDENCE</div>
          <svg viewBox="0 0 500 420" aria-hidden="true">
            <path d="M250 210 L95 90 M250 210 L405 90 M250 210 L70 305 M250 210 L430 305 M250 210 L250 385"/>
          </svg>
        </div>
      </div>
    </section>

    <section id="trust" class="shell section trust">
      <div class="section-head">
        <div>
          <p class="kicker">TRUST LAYER</p>
          <h2>Security claims are evidence-gated.</h2>
        </div>
        <p>A passing control means that control executed successfully. It is not an external certification, and XPeX does not present it as one.</p>
      </div>

      <div class="trust-layout">
        <div class="checks">
          ${checks.map(c => `<div class="check"><span>✓</span><b>${c}</b><small>passing</small></div>`).join('')}
        </div>
        <aside class="trust-panel">
          <p class="kicker">CURRENT BASELINE</p>
          <div class="metric"><strong>59</strong><span>machine-readable governance controls</span></div>
          <div class="metric"><strong>11</strong><span>governance domains</span></div>
          <div class="metric"><strong>AL1</strong><span>overall XAGF assurance foundation</span></div>
          <hr/>
          <p class="quote">“THE EXECUTOR DOES NOT APPROVE ITS OWN DELIVERY.”</p>
          <a class="button" target="_blank" rel="noreferrer" href="https://github.com/xpex-systems-ai/xpex-systems-ai/blob/main/docs/TRUST_CENTER.md">Trust Center ↗</a>
        </aside>
      </div>
    </section>

    <section id="gx" class="gx-section">
      <div class="shell gx-shell">
        <div class="gx-intro">
          <div>
            <p class="kicker">GX PUBLIC EVIDENCE CONCIERGE</p>
            <h2>Ask the system.<br/>See the evidence.</h2>
          </div>
          <p><strong>GX</strong> is the public evidence interface for XPeX Systems AI. It answers from an approved public registry, exposes the strongest supporting links and refuses to turn unproven claims into facts.</p>
        </div>

        <div class="gx-console" data-gx-console>
          <aside class="gx-rail">
            <div class="gx-identity">
              <div class="gx-core">GX</div>
              <div><b>Evidence Concierge</b><small>Public · Read only · Evidence gated</small></div>
            </div>
            <div class="gx-state"><span>Response mode</span><span data-gx-mode>READY</span></div>
            <h3>Try a question</h3>
            <div class="gx-quick-list">
              <button class="gx-quick" type="button" data-gx-quick="Quem é Junior Sena e o que ele construiu?">Who built XPeX?</button>
              <button class="gx-quick" type="button" data-gx-quick="Quais sistemas da XPeX estão prontos para demonstração?">Demo-ready systems</button>
              <button class="gx-quick" type="button" data-gx-quick="Que segurança e governança a XPeX consegue provar publicamente?">Security & governance</button>
              <button class="gx-quick" type="button" data-gx-quick="Explique o XPeX Systems Command e mostre a evidência pública.">Systems Command</button>
            </div>
            <p class="gx-boundary">GX não expõe segredos, dados privados, contratos, carteiras ou memórias internas. Também não executa ações a partir desta interface pública.</p>
          </aside>

          <div class="gx-chat">
            <div class="gx-log" data-gx-log aria-live="polite"></div>
            <form class="gx-form" data-gx-form>
              <input data-gx-input maxlength="900" autocomplete="off" placeholder="Ask about XPeX, systems, architecture, trust…" aria-label="Ask GX"/>
              <button class="button primary" type="submit" data-gx-send>Ask GX →</button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <section id="founder" class="founder-wrap">
      <div class="shell founder">
        <div class="founder-id">
          <div class="monogram">JS</div>
          <div>
            <p class="kicker">FOUNDER ENGINEERING PROFILE</p>
            <h2>Junior Sena</h2>
            <p class="founder-role">Applied AI / Agentic Systems Engineer<br/>Founder, XPeX Systems AI</p>
          </div>
        </div>
        <div class="founder-story">
          <p>The portfolio is the proof: agentic applications, MCP surfaces, deployment infrastructure, provider integrations, evidence architecture, security gates and multiple product systems.</p>
          <blockquote>“I built an AI systems infrastructure with real deployments, agent/tool boundaries, provider integrations, evidence, security gates and multiple product surfaces.”</blockquote>
          <div class="founder-links">
            <a class="text-link" target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/ceojuniorsena">LinkedIn →</a>
            <a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/xpex-systems-ai/xpex-systems-ai/blob/main/docs/FOUNDER_PROFILE.md">Engineering profile →</a>
          </div>
        </div>
      </div>
    </section>

    <section id="agent-api" class="agent-api-section">
      <div class="shell agent-api-shell" data-agent-api>
        <div class="agent-api-head">
          <div>
            <p class="kicker">XPEX ENTERPRISE AGENT API</p>
            <h2>Tell us the need.<br/>The system finds the right XPeX capability.</h2>
          </div>
          <p>A machine-readable discovery layer for companies, accelerators and agent platforms evaluating XPeX systems, agents, MCP integrations and digital-worker capabilities. It matches a real need to evidence-backed assets — without pretending a match is already a customer relationship.</p>
        </div>
        <div class="agent-api-layout">
          <div class="agent-api-panel">
            <h3>Enterprise need matcher</h3>
            <p>Describe the problem. The Agent API maps it to XPeX systems, proof and a bounded pilot path.</p>
            <form class="agent-api-form" data-agent-api-form>
              <input data-agent-api-company maxlength="300" placeholder="Company / team type — e.g. enterprise AI, agent platform"/>
              <textarea data-agent-api-need maxlength="1200" placeholder="What do you need? Example: We need to integrate AI agents with GitHub, cloud deployments and human approval."></textarea>
              <button class="button primary" type="submit" data-agent-api-submit>Match our need →</button>
            </form>
            <p class="agent-api-note">Stateless public discovery. Do not submit secrets, credentials, private customer data or regulated data.</p>
          </div>
          <div class="agent-api-panel">
            <div class="agent-api-result" data-agent-api-result>
              <p class="agent-api-muted">Describe a company need to receive the best evidence-backed XPeX solution pack.</p>
            </div>
            <div class="agent-api-machine">
              <a href="/api/agent-api" target="_blank" rel="noreferrer">REST discovery ↗</a>
              <a href="/api/mcp/enterprise" target="_blank" rel="noreferrer">Enterprise MCP ↗</a>
              <a href="/.well-known/xpex-agent-api.json" target="_blank" rel="noreferrer">Well-known manifest ↗</a>
              <a href="/data/enterprise-agent-catalog-v1.json" target="_blank" rel="noreferrer">Agent catalog ↗</a>
              <a href="/llms.txt" target="_blank" rel="noreferrer">llms.txt ↗</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="launch" class="launch-section">
      <div class="shell launch-shell">
        <div class="launch-head">
          <div>
            <p class="kicker">GLOBAL LAUNCH · ENTERPRISE INNOVATION</p>
            <h2>XPeX is entering the global founder ecosystem.</h2>
          </div>
          <div>
            <p>We are targeting accelerator, enterprise-innovation and investor programs where XPeX can be evaluated on technical evidence — not hype. A target is not a partnership or acceptance.</p>
            <div class="launch-kpis">
              <span><b data-launch-count>—</b> tracked programs</span>
              <span data-launch-snapshot>Opportunity snapshot</span>
              <span>Evidence First</span>
            </div>
          </div>
        </div>
        <div class="launch-grid" data-launch-radar></div>
        <div class="launch-cta">
          <p><strong>For accelerators, VCs and enterprise partners:</strong> start with the 60-second thesis, then inspect the systems, MCP surface and evidence.</p>
          <div class="hero-actions">
            <a class="button primary" target="_blank" rel="noreferrer" href="https://github.com/xpex-systems-ai/xpex-systems-ai/blob/main/docs/ACCELERATOR_APPLICATION_PACK.md">Application pack ↗</a>
            <a class="button" target="_blank" rel="noreferrer" href="https://github.com/xpex-systems-ai/xpex-systems-ai/blob/main/NEURAL_WORKFORCE_MANIFESTO.md">Neural Workforce ↗</a>
          </div>
        </div>
      </div>
    </section>

    <section id="contact" class="shell section review">
      <p class="kicker">EXTERNAL REVIEW</p>
      <h2>Start with the evidence.<br/>Then inspect the systems.</h2>
      <p>Recruiters, technical partners and investors can review the public architecture, flagship cases, source assurance and deployment evidence directly.</p>
      <div class="hero-actions">
        <a class="button primary" target="_blank" rel="noreferrer" href="https://github.com/xpex-systems-ai/xpex-systems-ai">Corporate repository ↗</a>
        <a class="button" target="_blank" rel="noreferrer" href="https://github.com/xpex-systems-ai/xpex-systems-ai/blob/main/docs/FLAGSHIP_CASES.md">15-minute review pack ↗</a>
        <a class="button" target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/ceojuniorsena">LinkedIn ↗</a>
      </div>
    </section>
  </main>

  <a class="gx-float" href="#gx" aria-label="Open GX Evidence Concierge">GX</a>

  <footer class="shell footer">
    <div class="brand">
      <span class="brand-mark">X</span>
      <span><b>XPeX</b><small>SYSTEMS AI</small></span>
    </div>
    <p>Build. Connect. Operate. Prove.</p>
    <p>© 2026 XPeX Systems AI</p>
  </footer>
`;

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) entry.target.classList.add('in');
  }
}, { threshold: 0.12 });

const systemPageActive = maybeRenderSystemPage(app);

if (!systemPageActive) {
  rewriteSystemLinks();
  document.querySelectorAll('.system-card, .manifesto, .section-head, .trust-layout, .founder, .gx-intro, .launch-head').forEach(el => observer.observe(el));
  initGX();
  initGlobalLaunchRadar();
  initEnterpriseAgentAPI();
}
