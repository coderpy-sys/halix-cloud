#!/usr/bin/env bash
# Halix Cloud — panel (Hp-v2) install / update helper.
# Default repo: https://github.com/coderpy-sys/halix-cloud
#
# Debian/Ubuntu: installs git, curl, unzip, PHP 8.2+ CLI with gmp, pcntl, and
# common Laravel extensions, Composer, and Node/npm when possible.
# Run as root on servers, or ensure passwordless sudo for apt.
# HALIX_SKIP_SYS_DEPS=1 — skip all OS package logic.
#
set -euo pipefail

HALIX_CLOUD_REPO="${HALIX_CLOUD_REPO:-https://github.com/coderpy-sys/halix-cloud.git}"
HALIX_CLOUD_ROOT="${HALIX_CLOUD_ROOT:-/var/www/halix-cloud}"
HALIX_PANEL_DIR="${HALIX_PANEL_DIR:-$HALIX_CLOUD_ROOT/Hp-v2}"
HALIX_SKIP_SYS_DEPS="${HALIX_SKIP_SYS_DEPS:-0}"

log() { echo "[halix-cloud] $*"; }
warn() { echo "[halix-cloud] warning: $*" >&2; }

apt_runner() {
  if [[ "${EUID:-$(id -u)}" -eq 0 ]]; then
    apt-get "$@"
  else
    if ! command -v sudo >/dev/null 2>&1; then
      echo "error: need root or sudo to run apt-get." >&2
      exit 1
    fi
    sudo -E apt-get "$@"
  fi
}

apt_install() {
  export DEBIAN_FRONTEND=noninteractive
  apt_runner update -qq
  apt_runner install -y --no-install-recommends "$@"
}

php_ext_loaded() {
  php -r "exit(extension_loaded('$1') ? 0 : 1);" 2>/dev/null
}

php_version_ok() {
  php -r 'exit(version_compare(PHP_VERSION, "8.2.0", "<") ? 1 : 0);' 2>/dev/null
}

# Debian/Ubuntu: install PHP CLI + gmp + pcntl + typical Laravel extensions.
install_php_stack_debian() {
  local v pkg
  if apt_install php-cli php-common php-gmp php-pcntl php-mysql php-xml php-mbstring php-curl php-zip php-bcmath; then
    log "installed default PHP meta packages (cli, gmp, pcntl, …)."
    return 0
  fi
  warn "default php-* meta packages failed; trying versioned php8.x-* …"
  for v in 8.4 8.3 8.2; do
    if apt-cache show "php${v}-cli" &>/dev/null; then
      pkg=(
        "php${v}-cli"
        "php${v}-common"
        "php${v}-gmp"
        "php${v}-mysql"
        "php${v}-xml"
        "php${v}-mbstring"
        "php${v}-curl"
        "php${v}-zip"
        "php${v}-bcmath"
      )
      if apt-cache show "php${v}-pcntl" &>/dev/null; then
        pkg+=("php${v}-pcntl")
      fi
      if apt_install "${pkg[@]}"; then
        log "installed PHP ${v} packages."
        return 0
      fi
    fi
  done
  return 1
}

install_php_stack_rhel() {
  if [[ "${EUID:-$(id -u)}" -ne 0 ]]; then
    warn "install PHP on RHEL/Fedora as root (dnf/yum)."
    return 1
  fi
  if command -v dnf >/dev/null 2>&1; then
    dnf install -y git curl unzip php php-cli php-gmp php-mysqlnd php-xml php-mbstring php-curl php-zip php-bcmath php-process
  elif command -v yum >/dev/null 2>&1; then
    yum install -y git curl unzip php php-cli php-gmp php-mysqlnd php-xml php-mbstring php-curl php-zip php-bcmath php-process
  else
    return 1
  fi
}

ensure_system_dependencies() {
  if [[ "$HALIX_SKIP_SYS_DEPS" == "1" ]]; then
    log "HALIX_SKIP_SYS_DEPS=1 — skipping system package checks."
    return 0
  fi

  if [[ -f /etc/os-release ]]; then
    # shellcheck source=/dev/null
    . /etc/os-release
  else
    warn "/etc/os-release missing; cannot auto-install OS packages."
    return 0
  fi

  case "${ID:-}" in
    debian|ubuntu|linuxmint|pop)
      if ! command -v git >/dev/null 2>&1 || ! command -v curl >/dev/null 2>&1 || ! command -v unzip >/dev/null 2>&1; then
        apt_install git curl unzip ca-certificates
      fi
      if ! command -v php >/dev/null 2>&1 || ! php_version_ok || ! php_ext_loaded gmp || ! php_ext_loaded pcntl; then
        log "installing / repairing PHP CLI + extensions (gmp, pcntl, …)…"
        if ! install_php_stack_debian; then
          echo "error: could not install PHP 8.2+ with gmp and pcntl via apt. Install manually and re-run." >&2
          exit 1
        fi
      fi
      ;;
    fedora|rhel|centos|rocky|almalinux)
      if [[ "${EUID:-$(id -u)}" -ne 0 ]]; then
        warn "run as root for automatic dnf/yum installs on ${ID}."
      else
        if ! command -v git >/dev/null 2>&1; then dnf install -y git || yum install -y git; fi
        if ! command -v php >/dev/null 2>&1 || ! php_ext_loaded gmp || ! php_ext_loaded pcntl; then
          log "installing PHP stack (dnf/yum)…"
          install_php_stack_rhel || true
        fi
      fi
      ;;
    *)
      warn "OS '${ID:-unknown}' — ensure PHP 8.2+, ext-gmp, ext-pcntl, git, curl, unzip, then set HALIX_SKIP_SYS_DEPS=1 if needed."
      ;;
  esac

  if ! command -v php >/dev/null 2>&1; then
    echo "error: php is not installed or not on PATH." >&2
    exit 1
  fi
  if ! php_version_ok; then
    echo "error: PHP 8.2+ required; found $(php -r 'echo PHP_VERSION;' 2>/dev/null || echo unknown)." >&2
    exit 1
  fi
  for ext in gmp pcntl; do
    if ! php_ext_loaded "$ext"; then
      echo "error: PHP extension '$ext' missing. On Debian/Ubuntu: apt install php-gmp php-pcntl (or php8.3-gmp php8.3-pcntl)." >&2
      exit 1
    fi
  done
  log "PHP $(php -r 'echo PHP_VERSION;') OK (gmp, pcntl present)."
}

ensure_composer() {
  if command -v composer >/dev/null 2>&1; then
    return 0
  fi
  log "installing Composer…"
  local target="${COMPOSER_HOME:-/usr/local/bin}/composer"
  if [[ ! -w "$(dirname "$target")" ]] && [[ "${EUID:-$(id -u)}" -ne 0 ]]; then
    target="${HOME}/.local/bin/composer"
    mkdir -p "$(dirname "$target")"
  fi
  curl -fsSL https://getcomposer.org/installer -o /tmp/composer-setup.php
  php /tmp/composer-setup.php --install-dir="$(dirname "$target")" --filename="$(basename "$target")"
  rm -f /tmp/composer-setup.php
  case ":${PATH:-}:" in
    *":$(dirname "$target"):"*) ;;
    *) export PATH="$(dirname "$target"):${PATH}" ;;
  esac
  hash -r
  if ! command -v composer >/dev/null 2>&1 && [[ -x "$target" ]]; then
    export PATH="$(dirname "$target"):${PATH}"
    hash -r
  fi
  if ! command -v composer >/dev/null 2>&1; then
    echo "error: Composer not available after install (expected $target)." >&2
    exit 1
  fi
}

ensure_node_npm() {
  if command -v npm >/dev/null 2>&1 && command -v node >/dev/null 2>&1; then
    return 0
  fi
  log "Node/npm not found; attempting apt install…"
  if [[ -f /etc/os-release ]]; then
    # shellcheck source=/dev/null
    . /etc/os-release
  fi
  if [[ "${ID:-}" == "debian" || "${ID:-}" == "ubuntu" || "${ID:-}" == "linuxmint" || "${ID:-}" == "pop" ]]; then
    apt_install nodejs npm 2>/dev/null || warn "apt could not install nodejs; install Node 20+ manually."
  fi
  if ! command -v npm >/dev/null 2>&1; then
    warn "npm missing — after PHP deps: install Node.js 20+ then run: cd $HALIX_PANEL_DIR && npm ci && npm run build"
  fi
}

composer_install_panel() {
  local dir="$1"
  (
    cd "$dir"
    export COMPOSER_ALLOW_SUPERUSER="${COMPOSER_ALLOW_SUPERUSER:-1}"
    log "composer install…"
    if composer install --no-interaction --prefer-dist --optimize-autoloader; then
      return 0
    fi
    warn "composer install failed; running composer update --lock …"
    composer update --lock --no-interaction || true
    if composer install --no-interaction --prefer-dist --optimize-autoloader; then
      return 0
    fi
    warn "running composer update (may change dependency versions)…"
    composer update --no-interaction --prefer-dist --optimize-autoloader
  )
}

log "repo=$HALIX_CLOUD_REPO"
log "root=$HALIX_CLOUD_ROOT"
log "panel=$HALIX_PANEL_DIR"

ensure_system_dependencies
ensure_composer

if [[ ! -d "$HALIX_CLOUD_ROOT/.git" ]]; then
  log "cloning…"
  mkdir -p "$(dirname "$HALIX_CLOUD_ROOT")"
  git clone "$HALIX_CLOUD_REPO" "$HALIX_CLOUD_ROOT"
else
  log "updating existing clone…"
  git -C "$HALIX_CLOUD_ROOT" fetch --all --prune
  git -C "$HALIX_CLOUD_ROOT" pull --ff-only || true
fi

if [[ ! -f "$HALIX_PANEL_DIR/composer.json" ]]; then
  echo "error: $HALIX_PANEL_DIR/composer.json not found (wrong HALIX_CLOUD_ROOT / HALIX_PANEL_DIR?)" >&2
  exit 1
fi

cd "$HALIX_PANEL_DIR"

if [[ ! -f .env && -f .env.example ]]; then
  log "copying .env.example -> .env (edit secrets!)"
  cp .env.example .env
fi

composer_install_panel "$HALIX_PANEL_DIR"

ensure_node_npm
if command -v npm >/dev/null 2>&1; then
  log "npm ci + build…"
  npm ci
  npm run build
else
  warn "skipped frontend build (no npm)."
fi

log "done. Next: edit .env, php artisan key:generate (if new), migrate, supervisor/horizon, web server."
