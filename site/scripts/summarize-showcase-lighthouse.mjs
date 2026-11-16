import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const file = resolve('artifacts/lighthouse-mobile.json');
const data = JSON.parse(await readFile(file, 'utf8'));
if (data.lighthouseVersion === undefined || !data.categories?.performance || !data.audits) {
  throw new Error('Lighthouse JSON missing required metrics; evidence cannot be published as valid.');
}
const score = id => data.categories[id]?.score == null ? null : Math.round(data.categories[id].score * 100);
const metric = id => ({
  value: data.audits[id]?.numericValue ?? null,
  unit: data.audits[id]?.numericUnit ?? null,
  display: data.audits[id]?.displayValue ?? null,
});
const result = {
  claim: 'Measured Lighthouse result for a local build of this commit; not an assertion of production quality.',
  gitCommit: process.env.SHOWCASE_SHA || 'NOT_SET',
  recordedAt: new Date().toISOString(),
  auditedUrl: data.finalDisplayedUrl ?? data.finalUrl ?? null,
  lighthouseVersion: data.lighthouseVersion,
  userAgent: data.userAgent,
  environment: data.environment,
  configuration: {
    formFactor: data.configSettings?.formFactor,
    throttlingMethod: data.configSettings?.throttlingMethod,
    screenEmulation: data.configSettings?.screenEmulation,
  },
  scores: {
    performance: score('performance'),
    accessibility: score('accessibility'),
    bestPractices: score('best-practices'),
    seo: score('seo'),
  },
  metrics: {
    largestContentfulPaint: metric('largest-contentful-paint'),
    cumulativeLayoutShift: metric('cumulative-layout-shift'),
    totalBlockingTime: metric('total-blocking-time'),
    firstContentfulPaint: metric('first-contentful-paint'),
    speedIndex: metric('speed-index'),
  },
};
await writeFile(resolve('artifacts/lighthouse-summary.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
