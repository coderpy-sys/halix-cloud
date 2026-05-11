# Halix Cloud

Premium dark-themed VPS management platform: client panel, admin panel, marketing site, and NestJS API with Proxmox-oriented architecture.

- **Site:** [halix.cloud](https://halix.cloud)
- **Community:** [Discord](https://discord.gg/freehost)

## Monorepo layout

| Path | Description |
|------|-------------|
| `apps/web` | Next.js 15 — marketing, auth shells, client & admin UI |
| `apps/api` | NestJS — REST, WebSockets, JWT, queues, Proxmox adapters |
| `docker/` | PostgreSQL, Redis, optional worker profile |
| `docs/` | Architecture, schema, API, flows, security, roadmap |

## Quick start

### Option A — automated installer (Linux / macOS / WSL)

Edit the default `HALIX_REPO_URL` inside `install/halix-install.sh` (must end with `.git`), or from an **already cloned** tree run:

```bash
chmod +x install/halix-install.sh
./install/halix-install.sh --from-repo
```

See **[install/README.md](install/README.md)** for non-interactive variables, Proxmox prompts, and Windows (`install/halix-install.ps1`).

### Option B — manual

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# optional: cp docker/.env.example docker/.env
npm run docker:up
npm run dev:api
```

In another terminal:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). API defaults to [http://localhost:4000](http://localhost:4000).

## Convoy-inspired UX (Halix-native)

The web app includes **original** helpers shaped by common panel practice (as seen in reference UIs such as [ConvoyPanel](https://github.com/ConvoyPanel/panel)): `halixFetch` + `getErrorMessage`, URL `?page=` pagination, persisted local state, stackable toasts, byte formatting, and a **VPS sub-navigation** shell (`/panel/vms/[id]/*`). These are not copied source — safe to ship in your product.

After `POST /v1/auth/login`, store `accessToken` as `localStorage.setItem('halix_access_token', '<jwt>')` so panel API calls authenticate.

## Reference clone (ConvoyPanel)

A **read-only** shallow clone of [ConvoyPanel/panel](https://github.com/ConvoyPanel/panel) lives at `reference/convoy-panel/` for API, Proxmox, and UI flow ideas. It is listed in `.gitignore` so it is not treated as Halix product code — do not copy AGPL code verbatim into proprietary Halix modules without a license strategy.

To refresh:

```bash
git -C reference/convoy-panel pull
```

## Documentation

- **Installation (HTML, Ptero-style guide):** open [`docs/installation.html`](docs/installation.html) in your browser (<kbd>file://</kbd> or serve the `docs/` folder). The outline follows common panel install docs such as [Pterodactyl — Getting Started](https://pterodactyl.io/panel/1.0/getting_started.html); content is specific to Halix (Node, Nest, Next, Prisma, Docker).
- **Architecture:** **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — database, API, Proxmox, IP logic, websockets, billing hooks, security, roadmap.

## License

Proprietary — Halix Cloud. Replace with your license as needed.
