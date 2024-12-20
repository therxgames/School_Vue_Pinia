/* eslint-env jest */
/* globals baseUrl */

import Browser from '@/test-helpers/browser.js';
import createServer from '@/test-helpers/create-server.js';
import {getSupportMessageData} from '@/test-helpers/mocks';

const browser = new Browser();
let server = null;

beforeAll(async () => {
  server = await createServer();
  await browser.launchAndGo(baseUrl + 'support');
});

afterAll(async () => {
  await browser.close();
  server.close();
});

test('opens correctly', async () => {
  const page = browser.page;
  const el = await page.$('.app-section-support');

  expect(el).not.toBe(null);
});

test('message works correctly', async () => {
  let supportMessageData = getSupportMessageData();

  await browser.fillInput('#msg', supportMessageData.message);
  await browser.fillInput('#answerEmail', supportMessageData.answerEmail);
  const messageVal = await browser.getInputValue('#msg');
  const answerEmailVal = await browser.getInputValue('#answerEmail');

  expect(supportMessageData.message === messageVal).toBe(true);
  expect(supportMessageData.answerEmail === answerEmailVal).toBe(true);
});

