#!/bin/sh
set -e
export PORT="${PORT:-8080}"
# If Cloud Run (or GKE) mounts a one-file secret to this path, make it a readable .env.
if [ -f /etc/secrets/laravel-env ]; then
  cp /etc/secrets/laravel-env /app/.env
  chown www-data:www-data /app/.env
  chmod 640 /app/.env
fi
mkdir -p /tmp/nginx-client-body /tmp/nginx-proxy /tmp/nginx-fastcgi
envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
nginx -t -c /etc/nginx/nginx.conf
exec /usr/bin/supervisord -c /etc/supervisord.conf
