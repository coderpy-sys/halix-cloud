# Halix Cloud panel installer (Hp-v2)

These scripts install the **Halix Cloud** panel (Convoy-derived code under `Hp-v2/`) on a Linux server with Git, PHP 8.2+, Composer, Node 20+, and MySQL/Redis already available (or use Docker per upstream docs).

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

After install, copy `Hp-v2/.env.example` to `Hp-v2/.env`, set `APP_KEY`, database, Redis, and `APP_URL`, then run migrations and queue workers per [Convoy deployment documentation](https://docs.convoypanel.com).
