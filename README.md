# Halix Cloud

This repository is split into two products:

- **`Hp-v1/`** — Halix Cloud v1: NestJS API, Next.js web app, Docker tooling, and docs (the original monorepo layout). Work here if you are extending the custom API and panel built for Halix.
- **`Hp-v2/`** — Halix Cloud v2: a Convoy Panel–based PHP + React control plane, rebranded for **Halix Cloud** with a purple theme, Coterm admin UI removed, and a dedicated installer under `Hp-v2/install/`.

Upstream panel: [ConvoyPanel/panel](https://github.com/ConvoyPanel/panel). Respect the upstream license in `Hp-v2/LICENSE.md` and related notices.

## Quick start (Hp-v2 panel)

1. See `Hp-v2/install/README.md` for clone URL defaults and deployment steps.
2. Configure `Hp-v2/.env` (copy from `Hp-v2/.env.example`). Set `APP_NAME=Halix Cloud`.
3. Run Composer and Vite builds as documented in that README.

## Repository layout note

If you want a **panel-only** Git remote, uncomment the `Hp-v1/` line in the root `.gitignore` so only `Hp-v2/` and shared root files are tracked.
