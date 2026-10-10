import './styles.css';
import './gx.css';
import { initGX } from './gx.js';
import './system-page.css';
import './global-launch.css';
import './enterprise-agent-api.css';
import { maybeRenderSystemPage, rewriteSystemLinks } from './system-page.js';
import { initGlobalLaunchRadar } from './global-launch.js';
import { initEnterpriseAgentAPI } from './enterprise-agent-api.js';
import './ecosystem.css';
import { ecosystemEntry, maybeRenderEcosystem } from './ecosystem.js';
import './brand.css';
import { brandMark, brandLockup, maybeRenderBrandPage } from './brand.js';
import { SYSTEM_INTELLIGENCE } from './data/system-intelligence.js';
import { investorBrief, brandEntry } from './investor-brief.js';
import './company.css';
import { companyEntry, maybeRenderCompanyPage } from './company.js';

const systems = [...SYSTEM_INTELLIGENCE].sort((a,b) => Number(Boolean(b.runtime.url && b.runtime.environment==='production')) - Number(Boolean(a.runtime.url && a.runtime.environment==='production'))).map(s => ({
  ...s,
  copy: s.summary,
  href: s.source.url,
  proof: `${s.runtime.provider} · ${s.runtime.environment} · ${s.status}`
}));

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
      ${brandLockup()}
    </a>
    <nav>
      <a href="/?view=ecosystem">GXEON</a>
      <a href="#systems">Systems</a>
      <a href="#trust">Trust</a>
      <a href="#gx">GX</a>
      <a href="#investors">Investors</a>
      <a href="/?view=company">Company pack</a>
      <a href="/?view=brand">Brand</a>
      <a href="#agent-api">Agent API</a>
      <a href="#contact">Review</a>
    </nav>
    <a class="button ghost" href="https://github.com/xpex-systems-ai" target="_blank" rel="noreferrer">GitHub ↗</a>
  </header>

  <main id="top">
    <section class="hero shell">
      <div class="eyebrow"><span></span> AI SYSTEMS · AGENTS · COMPANY INTELLIGENCE</div>
      <h1>Applied AI.<br/><em>One connected ecosystem.</em></h1>
      <p class="hero-copy">XPeX Systems AI connects Company Intelligence, governed agents and enterprise workflows through systems you can inspect, demonstrate and verify.</p>
      <div class="hero-actions">
        <a class="button primary" href="/?view=ecosystem">Explore the ecosystem</a>
        <a class="button" href="#investors">Company & investment thesis</a>
        <a class="text-link" href="#systems">Inspect the systems →</a>
      </div>
      <div class="hero-proof">
        <div><strong>${systems.length}</strong><span>canonical system profiles</span></div>
        <div><strong>4</strong><span>public demo surfaces observed</span></div>
        <div><strong>1</strong><span>verified staging control plane</span></div>
        <div><strong>AL1</strong><span>engineering assurance foundation</span></div>
      </div>
      <p class="hero-snapshot">Runtime observations: 10 Oct 2026 (UTC) · <a href="/data/portfolio-observations-v2.json" target="_blank" rel="noreferrer">Inspect the snapshot ↗</a></p>
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

    ${investorBrief()}
    ${ecosystemEntry()}
    ${brandEntry()}
    ${companyEntry()}

    <section id="systems" class="shell section">
      <div class="section-head">
        <div>
          <p class="kicker">FLAGSHIP PORTFOLIO</p>
          <h2>Seven systems.<br/>One operating architecture.</h2>
        </div>
        <p>Four public demo surfaces, one authenticated staging control plane and two systems with open admission or runtime gates. Each profile links to its architecture and evidence.</p>
      </div>
      <div class="systems-grid">
        ${systems.map((s, i) => `
          <article class="system-card" style="--i:${i}">
            <div class="system-top">
              ${brandMark(s.slug)}
              <span class="status ${s.tone}">${s.status}</span>
            </div>
            <h3>${s.name}</h3>
            <p class="role">${s.role}</p>
            <p class="desc">${s.copy}</p>
            <div class="proof">${s.proof}</div>
            <div class="system-actions">
              ${s.runtime.url ? `<a class="button" href="${s.runtime.url}" target="_blank" rel="noreferrer">${s.runtime.environment==='staging' ? 'Operator access ↗' : 'Open public demo ↗'}</a>` : ''}
              <a class="text-link" data-system-slug="${s.slug}" href="${s.href}">Inspect evidence →</a>
            </div>
          </article>
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
          ${checks.map(c => `<div class="check"><span>◦</span><b>${c}</b><small>CI workflow</small></div>`).join('')}
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
              <div class="gx-core">${brandMark('gxeon')}</div>
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

  <a class="gx-float" href="#gx" aria-label="Open GX Evidence Concierge">${brandMark('gxeon')}</a>

  <footer class="shell footer">
    <div class="brand">
      ${brandLockup()}
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

const systemPageActive = maybeRenderCompanyPage(app) || maybeRenderBrandPage(app) || maybeRenderEcosystem(app) || maybeRenderSystemPage(app);

if (!systemPageActive) {
  rewriteSystemLinks();
  document.querySelectorAll('.system-card, .manifesto, .section-head, .trust-layout, .founder, .gx-intro, .launch-head').forEach(el => observer.observe(el));
  initGX();
  initGlobalLaunchRadar();
  initEnterpriseAgentAPI();
}
