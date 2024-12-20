/* eslint-env jest */
/* globals baseUrl */

import Browser from '@/test-helpers/browser.js';
import createServer from '@/test-helpers/create-server.js';

const browser = new Browser();
let server = null;

beforeAll(async () => {
  server = await createServer();
  await browser.launchAndGo(baseUrl);
});

afterAll(async () => {
  await browser.close();
  server.close();
});

test('opens correctly', async () => {
  const page = browser.page;
  const el = await page.$('#my-school-app');

  expect(el).not.toBe(null);
});

test('passes audit', async () => {
  const res = await browser.audit();

  expect(res.accessibility > 95).toBe(true);
  expect(res.performance > 95).toBe(true);
  expect(res.bestPractices > 95).toBe(true);
  expect(res.seo > 95).toBe(true);
  expect(res.pageSpeed > 95).toBe(true);
});
