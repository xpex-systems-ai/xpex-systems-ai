import test from 'node:test';
import assert from 'node:assert/strict';
import {selectVercelBotPreview} from './browser/preview-source.mjs';

const sha = '4a9dfd7082062357d82df974d7dcfd8b1c595abf';
const inspector = 'https://vercel.com/xpex-neural/xpex-systems-ai/HJ1k7cmjwMc87b95ZkziF417NWfZ';
const preview = 'https://xpex-systems-ai-git-codex-omnix-product-onli-bfd1db-xpex-neural.vercel.app';
const statuses = {sha, state:'success', statuses:[{context:'Vercel',state:'success',target_url:inspector}]};
const official = [{user:{login:'vercel[bot]'},body:'| Project | Deployment | Actions |\n| XPeX | [Ready]('+inspector+') | [Preview]('+preview+') |'}];

test('resolves only the exact commit and matching official Vercel Ready row',()=>{
  assert.deepEqual(selectVercelBotPreview(sha,statuses,official),{url:preview,inspectorUrl:inspector,provenance:'vercel-success-status-and-official-pr-bot'});
});
test('rejects stale commit statuses, failed deployments and wrong provenance',()=>{
  assert.equal(selectVercelBotPreview('f'.repeat(40),statuses,official),undefined);
  assert.equal(selectVercelBotPreview(sha,{...statuses,state:'pending'},official),undefined);
  assert.equal(selectVercelBotPreview(sha,{...statuses,statuses:[{...statuses.statuses[0],state:'failure'}]},official),undefined);
  assert.equal(selectVercelBotPreview(sha,statuses,[{...official[0],user:{login:'attacker'}}]),undefined);
  assert.equal(selectVercelBotPreview(sha,statuses,[{...official[0],body:official[0].body.replace(inspector,'https://vercel.com/xpex-neural/xpex-systems-ai/OtherDeployment')}]),undefined);
});
test('rejects previews outside the approved corporate Vercel namespace',()=>{
  for(const bad of ['https://example.com','https://xpex-systems-evi1-xpex-neural.vercel.app.evil.invalid','http://xpex-systems-evi1-xpex-neural.vercel.app','https://xpex-systems-evi1-xpex-neural.vercel.app/path','https://other-company-git-preview.vercel.app']){
    const comment=[{...official[0],body:official[0].body.replace(preview,bad)}];
    assert.equal(selectVercelBotPreview(sha,statuses,comment),undefined,bad);
  }
});
