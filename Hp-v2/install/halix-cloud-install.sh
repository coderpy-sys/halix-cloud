#!/usr/bin/env bash
# Halix Cloud — panel (Hp-v2) install / update helper.
# Default repo: https://github.com/coderpy-sys/halix-cloud
set -euo pipefail

HALIX_CLOUD_REPO="${HALIX_CLOUD_REPO:-https://github.com/coderpy-sys/halix-cloud.git}"
HALIX_CLOUD_ROOT="${HALIX_CLOUD_ROOT:-/var/www/halix-cloud}"
HALIX_PANEL_DIR="${HALIX_PANEL_DIR:-$HALIX_CLOUD_ROOT/Hp-v2}"

echo "[halix-cloud] repo=$HALIX_CLOUD_REPO"
echo "[halix-cloud] root=$HALIX_CLOUD_ROOT"
echo "[halix-cloud] panel=$HALIX_PANEL_DIR"

if [[ ! -d "$HALIX_CLOUD_ROOT/.git" ]]; then
  echo "[halix-cloud] cloning..."
  mkdir -p "$(dirname "$HALIX_CLOUD_ROOT")"
  git clone "$HALIX_CLOUD_REPO" "$HALIX_CLOUD_ROOT"
else
  echo "[halix-cloud] updating existing clone..."
  git -C "$HALIX_CLOUD_ROOT" fetch --all --prune
  git -C "$HALIX_CLOUD_ROOT" pull --ff-only || true
fi

if [[ ! -f "$HALIX_PANEL_DIR/composer.json" ]]; then
  echo "error: $HALIX_PANEL_DIR/composer.json not found (wrong HALIX_CLOUD_ROOT / HALIX_PANEL_DIR?)" >&2
  exit 1
fi

cd "$HALIX_PANEL_DIR"

if [[ ! -f .env && -f .env.example ]]; then
  echo "[halix-cloud] copying .env.example -> .env (edit secrets!)"
  cp .env.example .env
fi

echo "[halix-cloud] composer install..."
composer install --no-interaction --prefer-dist --optimize-autoloader

if command -v npm >/dev/null 2>&1; then
  echo "[halix-cloud] npm ci + build..."
  npm ci
  npm run build
else
  echo "[halix-cloud] npm not found; skip frontend build (install Node.js and run npm ci && npm run build in $HALIX_PANEL_DIR)"
fi

echo "[halix-cloud] done. Next: edit .env, php artisan key:generate (if new), migrate, supervisor/horizon, web server."
