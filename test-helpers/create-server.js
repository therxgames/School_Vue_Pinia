/* eslint-env node */

import {existsSync, promises} from 'node:fs';
import {dirname} from 'node:path';
import execa from 'execa';
import {setupDotenv} from 'c12';
import {resolve} from 'pathe';

export default async () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';

  const rootDir = '.';
  const nitroJSONPaths = ['.output/nitro.json', 'nitro.json'].map((p) => resolve(rootDir, p));
  const nitroJSONPath = nitroJSONPaths.find((p) => existsSync(p));

  const outputPath = dirname(nitroJSONPath);
  const nitroJSON = JSON.parse(await promises.readFile(nitroJSONPath, 'utf-8'));

  const envExists = existsSync(rootDir);

  if (envExists) {
    await setupDotenv({cwd: rootDir, fileName: '.env'});
  }

  const [command, ...commandArgs] = nitroJSON.commands.preview.split(' ');
  const server = execa(command, commandArgs, {stdio: 'inherit', cwd: outputPath});

  return {
    close() {
      server.kill('SIGTERM', {forceKillAfterTimeout: 0});
    }
  };
};
