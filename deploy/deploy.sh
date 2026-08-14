#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOST="${HOST:-217.149.22.176}"
REMOTE="/var/www/lridrop.isamarin.xyz"

ssh -o BatchMode=yes "root@${HOST}" "mkdir -p '${REMOTE}'"
rsync -az --delete --exclude '.well-known' "${ROOT}/docs/" "root@${HOST}:${REMOTE}/"

if [ "${BOOTSTRAP_HTTP:-0}" = "1" ]; then
  scp -q "${ROOT}/deploy/nginx-lridrop.http.conf" "root@${HOST}:/etc/nginx/sites-available/lridrop.isamarin.xyz"
else
  scp -q "${ROOT}/deploy/nginx-lridrop.conf" "root@${HOST}:/etc/nginx/sites-available/lridrop.isamarin.xyz"
fi

ssh -o BatchMode=yes "root@${HOST}" '
  ln -sfn /etc/nginx/sites-available/lridrop.isamarin.xyz /etc/nginx/sites-enabled/lridrop.isamarin.xyz
  nginx -t
  systemctl reload nginx
'
echo "site  https://lridrop.isamarin.xyz/"
