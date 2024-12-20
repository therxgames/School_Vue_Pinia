import {defineNitroConfig} from 'nitropack';

export default defineNitroConfig({
  storage: {
    'redis': {
      driver: 'redis',
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD
    },
    'db': {
      driver: 'fs',
      base: './storage/db'
    }
  }
});
