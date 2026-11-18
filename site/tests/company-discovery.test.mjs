import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const pub = new URL('../public/', import.meta.url);
const read = async path => readFile(new URL(path, pub), 'utf8');

test('company public discovery registry has explicit boundaries', async () => {
  const data = JSON.parse(await read('data/xpex-company-discovery-v1.json'));
  assert.equal(data.website, 'https://xpex-systems-ai.vercel.app/');
  assert.equal(data.companyName, 'XPeX Systems AI');
  assert.equal(data.facts.hasOpenAICommercialPartnership,'not_verified');
  assert.equal(data.facts.hasBusinessHubVerifiedProfile,'not_verified');
  assert.ok(data.services.some(x=>x.id==='gxeon-json-validate'));
  assert.ok(data.services.some(x=>x.id==='gxeon-csv-audit'));
  assert.ok(data.services.some(x=>x.id==='academy' && /pilot/.test(x.status)));
});
test('schema.org company record provides credible URLs without OpenAI endorsement', async () => {
  const data = JSON.parse(await read('data/xpex-organization-schema-v1.json'));
  assert.equal(data['@type'],'Organization');
  assert.equal(data.url,'https://xpex-systems-ai.vercel.app/');
  assert.equal(data.hasOfferCatalog['@type'],'OfferCatalog');
  assert.ok(data.hasOfferCatalog.itemListElement.every(x=>x.url.startsWith('https://')));
});
test('robots, index, and sitemap reference one canonical company site', async () => {
  const [robots,sitemap,llms] = await Promise.all([read('robots.txt'),read('sitemap.xml'),read('llms.txt')]);
  assert.match(robots,/Sitemap: https:\/\/xpex-systems-ai\.vercel\.app\/sitemap\.xml/);
  assert.match(sitemap,/<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.match(sitemap,/<loc>https:\/\/xpex-systems-ai\.vercel\.app\/\?view=agents<\/loc>/);
  assert.ok(!sitemap.includes('&view='));
  assert.match(llms,/data\/xpex-company-discovery-v1\.json/);
});
