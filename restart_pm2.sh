pm2 kill
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
systemctl enable pm2-root