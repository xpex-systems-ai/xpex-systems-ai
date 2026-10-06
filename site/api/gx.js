import { GX_EVIDENCE, GX_PUBLIC_RULES } from '../src/data/gx-evidence.js';
import { SYSTEM_INTELLIGENCE, MATERIAL_LINEAGES } from '../src/data/system-intelligence.js';

const buckets = globalThis.__gxRateBuckets || new Map();
globalThis.__gxRateBuckets = buckets;

const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS = 15;
const MAX_MESSAGE_LENGTH = 900;
const MODEL = 'openai/gpt-5.6-sol';

const SYSTEM_EVIDENCE = SYSTEM_INTELLIGENCE.map(system => ({
  id: `system-intelligence:${system.slug}`,
  title: system.name,
  kind: 'system-intelligence',
  keywords: [
    system.slug,
    system.name,
    system.role,
    ...(system.tech || []),
    ...(system.architecture || []),
    ...(system.related || [])
  ],
  summary: [
    system.summary,
    'Problem: ' + system.problem,
    'What XPeX built: ' + system.built,
    'Architecture: ' + (system.architecture || []).join(' -> '),
    'Security: ' + (system.security || []).join(' | '),
    'Open gates: ' + (system.limits || []).join(' | '),
    'Runtime: ' + JSON.stringify(system.runtime),
    'Source: ' + JSON.stringify(system.source)
  ].join('\n'),
  status: system.status,
  url: `https://xpex-systems-ai.vercel.app/?system=${encodeURIComponent(system.slug)}`
}));

const ALL_PUBLIC_EVIDENCE = [...GX_EVIDENCE, ...SYSTEM_EVIDENCE];

function normalize(value='') {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s./-]/g, ' ');
}

const STOP = new Set([
  'a','o','as','os','de','da','do','das','dos','e','em','um','uma','para','por','com','que','qual','quais',
  'the','an','and','or','of','to','in','on','for','is','are','what','who','how','tell','me','about'
]);

function tokens(text) {
  return [...new Set(normalize(text).split(/\s+/).filter(t => t.length > 1 && !STOP.has(t)))];
}

function scoreEvidence(query, item) {
  const q = tokens(query);
  const hay = normalize([item.title,item.kind,item.summary,...item.keywords].join(' '));
  let score = 0;
  for (const token of q) {
    if (hay.includes(token)) score += token.length > 5 ? 3 : 1;
  }
  if (normalize(query).includes(normalize(item.title))) score += 10;
  return score;
}

function retrieveEvidence(query) {
  const ranked = ALL_PUBLIC_EVIDENCE
    .map(item => ({...item, score:scoreEvidence(query,item)}))
    .sort((a,b) => b.score - a.score);

  const selected = ranked.filter(x => x.score > 0).slice(0,5);
  if (selected.length) return selected;
  return ALL_PUBLIC_EVIDENCE.filter(x => ['company','founder','portfolio','trust'].includes(x.id));
}

function rateLimit(req) {
  const raw = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const ip = String(raw).split(',')[0].trim();
  const now = Date.now();
  const bucket = buckets.get(ip) || {start:now,count:0};
  if (now - bucket.start > WINDOW_MS) {
    bucket.start = now;
    bucket.count = 0;
  }
  bucket.count += 1;
  buckets.set(ip,bucket);
  return bucket.count <= MAX_REQUESTS;
}

function extractText(payload) {
  if (typeof payload?.output_text === 'string') return payload.output_text.trim();
  const chunks = [];
  for (const item of payload?.output || []) {
    for (const part of item?.content || []) {
      if (typeof part?.text === 'string') chunks.push(part.text);
    }
  }
  return chunks.join('\n').trim();
}

function fallbackAnswer(message, evidence) {
  const q = normalize(message);
  if (/segur|trust|govern|codeql|secret|supply/.test(q)) {
    return 'A XPeX publica uma camada de confiança baseada em validações automáticas, como governança, Public Truth, secret hygiene, supply-chain, Assurance Tests e CodeQL. Esses sinais provam que os controles executaram com sucesso — não são uma certificação externa.';
  }
  if (/junior|sena|founder|fundador|quem construiu|who built/.test(q)) {
    return 'Junior Sena é apresentado publicamente como Applied AI / Agentic Systems Engineer e Founder da XPeX Systems AI. O portfólio é usado como prova: sistemas implantados, agentes/MCP, infraestrutura, governança, segurança e evidência operacional.';
  }
  if (/sistema|system|produto|product|portfolio|flagship|demo/.test(q)) {
    return 'O portfólio público concentra poucos sistemas canônicos em vez de expor todos os experimentos. Entre os principais estão XPeX Systems Command, GXEON Audit OS, XPeX Plugin Factory, XPeX Studio AI, Wallet Command Center, API Fabric e XPeX Academy. Os estados variam entre demo-ready, staging, hardening e admission.';
  }
  if (/dinheiro|money|revenue|receita|rtc|usdc|wallet/.test(q)) {
    return 'Na XPeX, valor monitorado não é tratado como receita ou dinheiro liquidado. O Wallet Command Center aplica a regra Money Truth: watched/monitored, pending e settled/verified são estados diferentes. A evidência pública atual não autoriza este assistente a declarar saldo ou receita além do que estiver comprovado.';
  }
  return evidence[0]?.summary || 'Posso responder sobre a XPeX Systems AI, Junior Sena, os sistemas públicos, arquitetura, segurança, deployments e evidências.';
}

function sourceView(evidence) {
  return evidence.slice(0,4).map(({title,url,status,kind}) => ({title,url,status,kind}));
}

async function answerWithGateway(message, evidence) {
  if (process.env.GX_AI_ENABLED !== 'true') return null;
  const authToken = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
  if (!authToken) return null;

  const context = evidence.map((e,i) =>
    `[${i+1}] ${e.title}\nStatus: ${e.status}\nEvidence: ${e.url}\n${e.summary}`
  ).join('\n\n');

  const instructions = `You are GX, the public Evidence Concierge for XPeX Systems AI.

Your job is to answer visitors using ONLY the supplied public evidence.
You are not the founder's private ChatGPT session and you do not have hidden access to private accounts, secrets, customer data, wallets, contracts, connected apps or private memories.

Rules:
${GX_PUBLIC_RULES.map(x => '- '+x).join('\n')}

Answer in the same language as the visitor.
Be concise, technical and clear.
If evidence is insufficient, explicitly say "not yet proven in the public evidence" or the natural equivalent in the visitor's language.
Never invent metrics.
Never imply that concept art is production evidence.
Do not claim to be a human.
Source links are rendered separately by the website.`;

  const response = await fetch('https://ai-gateway.vercel.sh/v1/responses', {
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      Authorization:`Bearer ${authToken}`,
    },
    body:JSON.stringify({
      model:MODEL,
      caching:'auto',
      instructions,
      input:[{
        type:'message',
        role:'user',
        content:`PUBLIC EVIDENCE:\n${context}\n\nVISITOR QUESTION:\n${message}`
      }],
      max_output_tokens:500,
      providerOptions:{
        gateway:{disallowPromptTraining:true}
      }
    })
  });

  if (!response.ok) throw new Error(`AI Gateway returned ${response.status}`);
  return extractText(await response.json()) || null;
}

export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  res.setHeader('Content-Type','application/json; charset=utf-8');

  if (req.method === 'GET') {
    return res.status(200).json({
      name:'GX Evidence Concierge',
      status:'ready',
      scope:'public-evidence-only',
      aiEnabled:process.env.GX_AI_ENABLED === 'true' && Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN),
      model:(process.env.GX_AI_ENABLED === 'true' && (process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN)) ? MODEL : null,
      evidenceItems:ALL_PUBLIC_EVIDENCE.length,
      knowledgeSystems:SYSTEM_INTELLIGENCE.length,
      materialLineages:MATERIAL_LINEAGES.length
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow','GET, POST');
    return res.status(405).json({error:'Method not allowed'});
  }

  if (!rateLimit(req)) {
    return res.status(429).json({error:'Rate limit reached. Try again in a few minutes.'});
  }

  const message = String(req.body?.message || '').trim();
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({error:`Message must contain 1–${MAX_MESSAGE_LENGTH} characters.`});
  }

  const evidence = retrieveEvidence(message);
  let answer = null;
  let mode = 'evidence-only';

  try {
    answer = await answerWithGateway(message,evidence);
    if (answer) mode = 'ai-gateway';
  } catch (error) {
    console.warn('GX AI Gateway fallback:', error?.message || error);
  }

  if (!answer) answer = fallbackAnswer(message,evidence);

  return res.status(200).json({
    answer,
    mode,
    scope:'public-evidence-only',
    sources:sourceView(evidence)
  });
}
