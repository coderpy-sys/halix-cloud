# Halix Cloud — automated installer

Interactive setup for **PostgreSQL + Redis (Docker)**, **environment files**, **Prisma schema**, **first SUPERADMIN user**, optional **Proxmox VE node** row, and **systemd + nginx templates**.

## Requirements

- **Linux**, **macOS**, or **WSL2** for the Bash installer
- **Docker** + Compose v2 (`docker compose`)
- **Node.js** ≥ 18.18 (20 LTS recommended) + **npm**
- **Git**
- **OpenSSL** (for JWT secret generation)

Windows (native PowerShell): use `install/halix-install.ps1` for a subset of steps, or run the Bash installer inside WSL.

## Quick start (already cloned this repo)

```bash
chmod +x install/halix-install.sh
./install/halix-install.sh --from-repo
```

You will be prompted for:

- Database user, name, **password**, host ports for Postgres and Redis
- **API port** and **panel (Next.js) port**
- **Public URLs** for CORS and `NEXT_PUBLIC_*`
- **Admin email + password** (min 12 characters) → `prisma db seed`
- Optional **Proxmox** FQDN + API token (Datacenter → Permissions → API Tokens)

## Fresh clone from GitHub (default URL is editable)

1. Edit the default at the **top of** `install/halix-install.sh`:

   ```bash
   : "${HALIX_REPO_URL:=https://github.com/your-org/halix-cloud.git}"
   ```

   Or export before running:

   ```bash
   export HALIX_REPO_URL="https://github.com/you/halix-cloud.git"
   ```

2. Run:

   ```bash
   bash install/halix-install.sh
   ```

The URL **must end with `.git`**.

## Non-interactive (CI / cloud-init)

Export all variables the script would normally prompt for, then:

```bash
export HALIX_NONINTERACTIVE=1
export HALIX_REPO_URL="https://github.com/you/halix-cloud.git"
export INSTALL_ROOT="/opt/halix-cloud"
export HALIX_DB_USER=halix
export HALIX_DB_NAME=halix
export HALIX_DB_PASSWORD='...'
export HALIX_PG_PORT=5432
export HALIX_REDIS_PORT=6379
export API_PORT=4000
export WEB_PORT=3000
export PANEL_PUBLIC_URL="https://panel.example.com"
export API_PUBLIC_URL="https://api.example.com"
export PUBLIC_HOST="panel.example.com"
export INSTALL_ADMIN_EMAIL="admin@example.com"
export INSTALL_ADMIN_PASSWORD='...min12...'
# Optional PVE:
# export INSTALL_PVE_FQDN="pve.example.com"
# export INSTALL_PVE_TOKEN_SECRET="..."
bash install/halix-install.sh
```

Use `--from-repo` when the repo is already checked out and you only want to configure in place (set `INSTALL_ROOT` via `cd` not needed — the script detects the repo root).

## After install

- **Development:** `npm run dev:api` and `npm run dev` from `INSTALL_ROOT`
- **Production:** `npm run build`, then run Nest and Next (see installer summary or `docs/DEPLOYMENT.md`)
- **systemd:** copy `install/output/halix-*.service` to `/etc/systemd/system/`, create a `halix` user, `chown` the install tree, `systemctl enable --now halix-api halix-web`
- **nginx:** merge `install/output/nginx-halix.conf` into your site config; obtain TLS certificates (e.g. Let’s Encrypt)

## Raw bootstrap (host the script on your fork)

Do **not** pipe the installer directly into `bash` if you need an interactive terminal; use a temp file or `install/get-halix.sh`.

```bash
export HALIX_REPO_URL="https://github.com/YOU/halix-cloud.git"
export SCRIPT_URL="https://raw.githubusercontent.com/YOU/halix-cloud/main/install/halix-install.sh"
bash install/get-halix.sh
```

`get-halix.sh` downloads the installer, then runs it so prompts work.

## Security notes

- `apps/api/.env` and `apps/web/.env` are created with `chmod 600` on Unix.
- Proxmox token secrets in the DB are stored **as provided** by the installer seed — replace with KMS-backed encryption before large-scale production (see `docs/ARCHITECTURE.md`).
- Use strong DB passwords; if they contain `@` or `:` in `DATABASE_URL`, URL-encode them.
