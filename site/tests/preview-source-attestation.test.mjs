import test from 'node:test';
import assert from 'node:assert/strict';
import {previewSourceHandler} from '../api/omnix-preview-source.js';
import {selectVercelBotAlias,verifiedPreviewSource} from './browser/preview-source.mjs';
const sha='cf9b87d770c4cf072fe3c7dc0a745da335449cc4';
const alias='https://xpex-systems-ai-git-codex-omnix-product-onli-bfd1db-xpex-neural.vercel.app';
const comment={user:{login:'vercel[bot]'},body:'| [Ready](https://vercel.com/xpex-neural/xpex-systems-ai/CurrentBuild) | [Preview]('+alias+') |'};
const env={VERCEL:'1',VERCEL_ENV:'preview',VERCEL_PROJECT_ID:'prj_9TzNOpz6Uzz34uHfLrlYAXzXcfgw',
  VERCEL_GIT_PROVIDER:'github',VERCEL_GIT_REPO_OWNER:'xpex-systems-ai',VERCEL_GIT_REPO_SLUG:'xpex-systems-ai',
  VERCEL_GIT_COMMIT_REF:'codex/omnix-product-online-gx019',VERCEL_GIT_COMMIT_SHA:sha};
function request(method='GET',changes={}) {
  const response={code:0,data:undefined,headers:{},setHeader(k,v){this.headers[k]=v;return this;},
    status(v){this.code=v;return this;},json(v){this.data=v;return this;}};
  previewSourceHandler({method},response,{...env,...changes});return response;
}
test('a public preview identifies only the exact Vercel source SHA without environment secrets',()=>{
  const response=request();assert.equal(response.code,200);assert.equal(response.headers['Cache-Control'],'no-store');
  assert.equal(verifiedPreviewSource(sha,response.data),true);
  assert.deepEqual(Object.keys(response.data).sort(),['branch','commitSha','environment','ok','projectId','repository']);
});
test('preview endpoint is fail-closed outside approved context and rejects writes',()=>{
  for(const patch of [{VERCEL_ENV:'production'},{VERCEL_GIT_COMMIT_SHA:'a'.repeat(40)},{VERCEL_GIT_REPO_OWNER:'attacker'},
    {VERCEL_PROJECT_ID:'prj_other'},{VERCEL_GIT_COMMIT_REF:'main'},{VERCEL:'0'}]) {
    const response=request('GET',patch);
    if(patch.VERCEL_GIT_COMMIT_SHA)assert.equal(verifiedPreviewSource(sha,response.data),false);
    else assert.equal(response.code,503);
  }
  assert.equal(request('POST').code,405);
  assert.equal(verifiedPreviewSource('f'.repeat(40),request().data),false);
});
test('official bot branch alias still requires a matching live source SHA',()=>{
  assert.equal(selectVercelBotAlias([comment]),alias);
  assert.equal(selectVercelBotAlias([{...comment,user:{login:'attacker'}}]),undefined);
  assert.equal(selectVercelBotAlias([{...comment,body:comment.body.replace(alias,'https://evil.vercel.app')}]),undefined);
  assert.equal(selectVercelBotAlias([{...comment,body:comment.body.replace('xpex-systems-ai/CurrentBuild','other/CurrentBuild')}]),undefined);
});
