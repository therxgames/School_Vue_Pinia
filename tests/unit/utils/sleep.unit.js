/* eslint-env jest */

import {sleep} from '@/utils/sleep.js';

test('sleeps', async () => {
  const start = performance.now();
  await sleep(100);
  const time = performance.now() - start;

  expect(time > 98 && time < 102).toBe(true);
});
