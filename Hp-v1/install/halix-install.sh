#!/usr/bin/env bash
# =============================================================================
# Halix Cloud — interactive installer (Linux / macOS / WSL)
# Inspired by professional panel setup flows; Halix-specific implementation.
#
# Quick override before running:
#   export HALIX_REPO_URL="https://github.com/you/halix-cloud.git"
#   export INSTALL_ROOT="/opt/halix-cloud"
#   bash install/halix-install.sh
#
# From an already-cloned repo (skip git clone):
#   bash install/halix-install.sh --from-repo
# =============================================================================

set -euo pipefail

# -----------------------------------------------------------------------------
# Default clone target — MUST end with .git (edit or export HALIX_REPO_URL)
# -----------------------------------------------------------------------------
: "${HALIX_REPO_URL:=https://github.com/coderpy-sys/halix-cloud.git}"

: "${INSTALL_ROOT:=/opt/halix-cloud}"
: "${HALIX_NONINTERACTIVE:=0}"

RED='\033[0;31m'; GRN='\033[0;32m'; CYN='\033[0;36m'; DIM='\033[0;90m'; NC='\033[0m'
die() { echo -e "${RED}[!]${NC} $*" >&2; exit 1; }
log() { echo -e "${CYN}[*]${NC} $*"; }
ok()  { echo -e "${GRN}[✓]${NC} $*"; }
say() { echo -e "${DIM}    $*${NC}"; }

need_cmd() { command -v "$1" >/dev/null 2>&1 || die "Missing required command: $1"; }

validate_git_url() {
  local u="$1"
  [[ "$u" == *.git ]] || die "Repository URL must end with .git (got: $u)"
  [[ "$u" == http://* || "$u" == https://* || "$u" == git@* ]] || \
    die "URL should start with https://, http://, or git@"
}

rand_hex() { openssl rand -hex "${1:-32}"; }

prompt() {
  # prompt VAR "message" "default"
  local var="$1" msg="$2" def="${3:-}"
  local val
  if [[ "$HALIX_NONINTERACTIVE" == "1" ]]; then
    printf -v "$var" '%s' "$def"
    return
  fi
  if [[ -n "$def" ]]; then
    read -r -p "$msg [$def]: " val || true
    printf -v "$var" '%s' "${val:-$def}"
  else
    read -r -p "$msg: " val || true
    printf -v "$var" '%s' "$val"
  fi
}

prompt_secret() {
  local var="$1" msg="$2" val
  if [[ "$HALIX_NONINTERACTIVE" == "1" ]]; then
    eval "[[ -n \"\${$var:-}\" ]]" || die "Non-interactive mode: export $var"
    return
  fi
  read -r -s -p "$msg: " val || true
  echo
  eval "$var=\$val"
}

banner() {
  cat <<'BAN'
  _    _       _  __ ___
 | |  | |     (_)/ _|__ \
 | |__| | __ _ _| |_   ) |
 |  __  |/ _` | |  _| / /
 | |  | | (_| | | |  / /_
 |_|  |_|\__,_|_|_| |____|
BAN
  echo -e "${CYN}  Control plane installer${NC}\n"
}

clone_repo() {
  validate_git_url "$HALIX_REPO_URL"
  if [[ -d "$INSTALL_ROOT/.git" ]]; then
    log "Directory exists with git repo: $INSTALL_ROOT"
    local yn="n"
    if [[ "$HALIX_NONINTERACTIVE" != "1" ]]; then
      read -r -p "  Pull latest instead of fresh clone? (y/N): " yn || true
      yn=${yn:-n}
    fi
    if [[ "${yn,,}" == "y" ]]; then
      git -C "$INSTALL_ROOT" pull --ff-only
      ok "Updated existing clone"
      return
    fi
    die "Refusing to overwrite $INSTALL_ROOT — remove it or use --from-repo inside the repo"
  fi
  if [[ -e "$INSTALL_ROOT" ]]; then
    die "Path exists but is not a git repo: $INSTALL_ROOT"
  fi
  log "Cloning $HALIX_REPO_URL → $INSTALL_ROOT"
  git clone --depth 1 "$HALIX_REPO_URL" "$INSTALL_ROOT"
  ok "Clone complete"
}

from_repo() {
  # Resolve repo root (directory containing install/halix-install.sh)
  local here
  here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
  INSTALL_ROOT="$here"
  log "Using current repository: $INSTALL_ROOT"
}

write_docker_env() {
  local f="$INSTALL_ROOT/docker/.env"
  mkdir -p "$INSTALL_ROOT/docker"
  cat >"$f" <<EOF
HALIX_DB_USER=$HALIX_DB_USER
HALIX_DB_PASSWORD=$HALIX_DB_PASSWORD
HALIX_DB_NAME=$HALIX_DB_NAME
HALIX_PG_PORT=$HALIX_PG_PORT
HALIX_REDIS_PORT=$HALIX_REDIS_PORT
EOF
  ok "Wrote $f"
}

write_api_env() {
  local f="$INSTALL_ROOT/apps/api/.env"
  mkdir -p "$INSTALL_ROOT/apps/api"
  # Note: if DB password contains @ or : URL-encode it for DATABASE_URL
  cat >"$f" <<EOF
NODE_ENV=production
PORT=$API_PORT
DATABASE_URL=postgresql://${HALIX_DB_USER}:${HALIX_DB_PASSWORD}@127.0.0.1:${HALIX_PG_PORT}/${HALIX_DB_NAME}?schema=public
REDIS_URL=redis://127.0.0.1:${HALIX_REDIS_PORT}
JWT_ACCESS_SECRET=$JWT_ACCESS_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
JWT_ACCESS_TTL=900s
JWT_REFRESH_TTL=30d
CORS_ORIGIN=$PANEL_PUBLIC_URL
PROXMOX_DEFAULT_VERIFY_TLS=true
EOF
  chmod 600 "$f" 2>/dev/null || true
  ok "Wrote $f"
}

write_web_env() {
  local f="$INSTALL_ROOT/apps/web/.env"
  mkdir -p "$INSTALL_ROOT/apps/web"
  cat >"$f" <<EOF
NEXT_PUBLIC_API_URL=$API_PUBLIC_URL
NEXT_PUBLIC_SOCKET_URL=$API_PUBLIC_URL
EOF
  chmod 600 "$f" 2>/dev/null || true
  ok "Wrote $f"
}

render_templates() {
  local out="$INSTALL_ROOT/install/output"
  mkdir -p "$out"
  sed -e "s|__INSTALL_ROOT__|$INSTALL_ROOT|g" \
      -e "s|__WEB_PORT__|${WEB_PORT}|g" \
      "$INSTALL_ROOT/install/templates/halix-api.service" >"$out/halix-api.service"
  sed -e "s|__INSTALL_ROOT__|$INSTALL_ROOT|g" \
      -e "s|__WEB_PORT__|${WEB_PORT}|g" \
      "$INSTALL_ROOT/install/templates/halix-web.service" >"$out/halix-web.service"
  sed -e "s|__API_PORT__|${API_PORT}|g" \
      -e "s|__WEB_PORT__|${WEB_PORT}|g" \
      -e "s|__PUBLIC_HOST__|${PUBLIC_HOST}|g" \
      "$INSTALL_ROOT/install/templates/nginx-halix.conf.template" >"$out/nginx-halix.conf"
  ok "Generated systemd + nginx snippets in $out/"
}

compose() {
  docker compose --env-file "$INSTALL_ROOT/docker/.env" \
    -f "$INSTALL_ROOT/docker/docker-compose.yml" "$@"
}

wait_postgres() {
  log "Waiting for PostgreSQL…"
  local n=0 cid
  until cid="$(compose ps -q postgres 2>/dev/null)" && [[ -n "$cid" ]]; do
    n=$((n + 1)); [[ $n -gt 30 ]] && die "Postgres container not found"; sleep 1
  done
  n=0
  until docker exec "$cid" pg_isready -U "$HALIX_DB_USER" -d "$HALIX_DB_NAME" >/dev/null 2>&1; do
    n=$((n + 1))
    if [[ $n -gt 90 ]]; then die "Postgres did not become ready in time"; fi
    sleep 1
  done
  ok "PostgreSQL is ready"
}

main() {
  banner
  local FROM_REPO=0
  for a in "$@"; do
    [[ "$a" == "--from-repo" ]] && FROM_REPO=1
    [[ "$a" == "--help" || "$a" == "-h" ]] && { grep '^#' "$0" | head -n 22; exit 0; }
  done

  if [[ "$FROM_REPO" == "1" ]]; then
    from_repo
  else
    need_cmd git
    prompt HALIX_REPO_URL "Git repository URL (.git)" "$HALIX_REPO_URL"
    validate_git_url "$HALIX_REPO_URL"
    prompt INSTALL_ROOT "Installation directory" "$INSTALL_ROOT"
    clone_repo
  fi

  cd "$INSTALL_ROOT"

  need_cmd docker
  docker compose version >/dev/null 2>&1 || die "Install Docker Compose v2 plugin (docker compose)"

  if [[ "$HALIX_NONINTERACTIVE" != "1" ]]; then
    echo -e "\n${CYN}── Database & ports ──${NC}"
  fi
  prompt HALIX_DB_USER "PostgreSQL user" "halix"
  prompt HALIX_DB_NAME "PostgreSQL database name" "halix"
  prompt_secret HALIX_DB_PASSWORD "PostgreSQL password (strong)"
  [[ -n "${HALIX_DB_PASSWORD:-}" ]] || die "Database password required"
  prompt HALIX_PG_PORT "Host port for PostgreSQL" "5432"
  prompt HALIX_REDIS_PORT "Host port for Redis" "6379"

  if [[ "$HALIX_NONINTERACTIVE" != "1" ]]; then
    echo -e "\n${CYN}── Application ports & URLs ──${NC}"
  fi
  prompt API_PORT "NestJS API listen port" "4000"
  prompt WEB_PORT "Next.js panel listen port" "3000"
  prompt PANEL_PUBLIC_URL "Panel URL (CORS), e.g. http://YOUR_IP:${WEB_PORT}" "http://127.0.0.1:${WEB_PORT}"
  prompt API_PUBLIC_URL "Public API URL for browsers" "$PANEL_PUBLIC_URL"
  prompt PUBLIC_HOST "Server name for nginx template (hostname or _)" "_"

  if [[ "$HALIX_NONINTERACTIVE" != "1" ]]; then
    echo -e "\n${CYN}── JWT secrets ──${NC}"
    say "Leave empty to auto-generate 32-byte hex secrets."
  fi
  prompt JWT_ACCESS_SECRET "JWT_ACCESS_SECRET" ""
  prompt JWT_REFRESH_SECRET "JWT_REFRESH_SECRET" ""
  [[ -z "${JWT_ACCESS_SECRET:-}" ]] && JWT_ACCESS_SECRET="$(rand_hex 32)"
  [[ -z "${JWT_REFRESH_SECRET:-}" ]] && JWT_REFRESH_SECRET="$(rand_hex 32)"

  write_docker_env
  write_api_env
  write_web_env
  render_templates

  log "Starting PostgreSQL + Redis via Docker Compose…"
  compose up -d
  ok "Docker services up"

  wait_postgres

  need_cmd npm
  log "Installing Node dependencies (monorepo)…"
  (cd "$INSTALL_ROOT" && npm install)
  ok "npm install complete"

  log "Prisma generate + db push…"
  (cd "$INSTALL_ROOT/apps/api" && npx prisma generate && npx prisma db push --accept-data-loss)
  ok "Database schema applied"

  if [[ "$HALIX_NONINTERACTIVE" != "1" ]]; then
    echo -e "\n${CYN}── First administrator ──${NC}"
  fi
  prompt INSTALL_ADMIN_EMAIL "Admin email" "admin@localhost"
  prompt_secret INSTALL_ADMIN_PASSWORD "Admin password (min 12 chars)"
  echo
  [[ "${#INSTALL_ADMIN_PASSWORD}" -ge 12 ]] || die "Admin password must be at least 12 characters"

  if [[ "$HALIX_NONINTERACTIVE" != "1" ]]; then
    echo -e "\n${CYN}── Proxmox VE (optional) ──${NC}"
    say "Press Enter to skip; or provide API token details for Datacenter → Permissions → API Tokens."
  fi
  prompt INSTALL_PVE_FQDN "Proxmox host (FQDN, e.g. pve.example.com)" ""
  if [[ -n "${INSTALL_PVE_FQDN:-}" ]]; then
    prompt INSTALL_PVE_NODE_NAME "Node display name" "Proxmox"
    prompt INSTALL_PVE_REGION "Region label (optional)" ""
    prompt INSTALL_PVE_REALM "Proxmox realm" "pam"
    prompt INSTALL_PVE_API_USER "API user (e.g. root@pam)" "root@pam"
    prompt INSTALL_PVE_TOKEN_ID "API token ID (second part after !)" "installer"
    prompt_secret INSTALL_PVE_TOKEN_SECRET "API token secret (uuid value)"
    echo
    prompt INSTALL_PVE_VERIFY_TLS "Verify TLS for Proxmox API (y/N)" "y"
    [[ "${INSTALL_PVE_VERIFY_TLS,,}" == "n" ]] && INSTALL_PVE_VERIFY_TLS="false" || INSTALL_PVE_VERIFY_TLS="true"
  else
    export INSTALL_PVE_FQDN=""
  fi

  export INSTALL_ADMIN_EMAIL INSTALL_ADMIN_PASSWORD
  if [[ -n "${INSTALL_PVE_FQDN:-}" ]]; then
    export INSTALL_PVE_FQDN INSTALL_PVE_NODE_NAME INSTALL_PVE_REGION INSTALL_PVE_REALM
    export INSTALL_PVE_API_USER INSTALL_PVE_TOKEN_ID INSTALL_PVE_TOKEN_SECRET INSTALL_PVE_VERIFY_TLS
  else
    unset INSTALL_PVE_NODE_NAME INSTALL_PVE_REGION INSTALL_PVE_REALM INSTALL_PVE_API_USER \
      INSTALL_PVE_TOKEN_ID INSTALL_PVE_TOKEN_SECRET INSTALL_PVE_VERIFY_TLS 2>/dev/null || true
    export INSTALL_PVE_FQDN=""
  fi

  log "Seeding admin user / Proxmox node…"
  (cd "$INSTALL_ROOT/apps/api" && npx prisma db seed)
  ok "Database seed complete"

  if [[ "$HALIX_NONINTERACTIVE" != "1" ]]; then
    echo -e "\n${GRN}══════════════════════════════════════════════════════════════${NC}"
    ok "Installation finished"
    echo
    say "API .env:     $INSTALL_ROOT/apps/api/.env"
    say "Web .env:     $INSTALL_ROOT/apps/web/.env"
    say "Docker .env: $INSTALL_ROOT/docker/.env"
    say "systemd:      $INSTALL_ROOT/install/output/halix-*.service"
    say "nginx:        $INSTALL_ROOT/install/output/nginx-halix.conf"
    echo
    say "Development run (two terminals):"
    say "  cd $INSTALL_ROOT && npm run dev:api"
    say "  cd $INSTALL_ROOT && npm run dev   # uses apps/web default port; override: npm run dev -- -p $WEB_PORT"
    echo
    say "Production build:"
    say "  cd $INSTALL_ROOT && npm run build && cd apps/api && npm run start:prod"
    say "  cd $INSTALL_ROOT/apps/web && npx next start -p $WEB_PORT"
    echo
    say "Panel (after starting web): $PANEL_PUBLIC_URL"
    say "API docs: $API_PUBLIC_URL/docs"
    echo -e "${DIM}Create a Linux user 'halix', chown $INSTALL_ROOT, then copy systemd units to /etc/systemd/system/${NC}"
  fi
}

main "$@"
