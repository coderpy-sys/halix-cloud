# Halix Cloud panel installer (Hp-v2)

The installer targets **Debian/Ubuntu** (and basic **RHEL/Fedora**): it checks for **PHP 8.2+** with **ext-gmp** and **ext-pcntl**, installs missing `php-*` packages via `apt`/`dnf`, installs **Composer** and tries **Node/npm** when absent. MySQL/Redis remain your responsibility (or Docker per upstream docs).

- **`HALIX_SKIP_SYS_DEPS=1`** — skip all OS package installation (use when dependencies are already correct).
- Run as **root** on servers, or with **sudo** so `apt-get` can run.
- Composer runs from **`Hp-v2/`** (`composer.json` lives there, not in the repo root).

## Default Git remote

Clone or update from:

`https://github.com/coderpy-sys/halix-cloud.git`

Override with the environment variable `HALIX_CLOUD_REPO` if you use a fork or mirror.

## Usage

```bash
chmod +x install/halix-cloud-install.sh
sudo HALIX_CLOUD_ROOT=/var/www/halix-cloud ./install/halix-cloud-install.sh
```

Environment variables:

| Variable | Default | Meaning |
|----------|---------|--------|
| `HALIX_CLOUD_REPO` | `https://github.com/coderpy-sys/halix-cloud.git` | Git remote |
| `HALIX_CLOUD_ROOT` | `/var/www/halix-cloud` | Directory to clone or update |
| `HALIX_PANEL_DIR` | `$HALIX_CLOUD_ROOT/Hp-v2` | Panel root (Composer / Artisan / npm) |
| `HALIX_SKIP_SYS_DEPS` | `0` | Set to `1` to skip apt/dnf and only clone + Composer + npm |

After install, copy `Hp-v2/.env.example` to `Hp-v2/.env`, set `APP_KEY`, database, Redis, and `APP_URL`, then run migrations and queue workers per [Convoy deployment documentation](https://docs.convoypanel.com).
