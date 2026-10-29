import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  testMatch: '*.spec.mjs',
  workers: 1,
  retries: 0,
  timeout: 90_000,
  globalTimeout: 12 * 60_000,
  reporter: [['list'], ['json', {outputFile:'preservation-results/results.json'}]],
  outputDir: 'preservation-results/browser',
  use: {browserName:'chromium', baseURL:'http://127.0.0.1:4782', screenshot:'only-on-failure', trace:'retain-on-failure'},
  webServer: {command:'node tests/browser/server.mjs',url:'http://127.0.0.1:4782',reuseExistingServer:false,timeout:15_000},
});
