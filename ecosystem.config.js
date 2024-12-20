module.exports = {
  apps: [
    {
      script: '.output/server/index.mjs',
      env: {
        'HOST': '192.168.122.26',
        'PORT': '8001',
        'API_URL': 'http://api.cpuch.devds.ru',
        'SITE_URL': 'http://cpuch.devds.ru',
        'REDIS_HOST': '127.0.0.1',
        'REDIS_PASSWORD': 'dev',
        'REDIS_PORT': '6379',
        'VK_APP_ID': '51527371',
        'DEBUG': false,
        'COMING_SOON': false,
        'PRODUCTION': false
      },
      env_production: {
        'HOST': '192.168.122.26',
        'PORT': '8001',
        'API_URL': 'http://api.cpuch.devds.ru',
        'SITE_URL': 'http://cpuch.devds.ru',
        'REDIS_HOST': '127.0.0.1',
        'REDIS_PASSWORD': 'dev',
        'REDIS_PORT': '6379',
        'VK_APP_ID': '51527371',
        'DEBUG': false,
        'COMING_SOON': false,
        'PRODUCTION': false
      },
      exec_mode: 'cluster_mode',
      instances: 10,
      name: 'frontend',
      autorestart: true,
      max_memory_restart: '1200M'
    }
  ]
}
