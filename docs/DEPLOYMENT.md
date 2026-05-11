# Halix Cloud — production deployment (Ubuntu 24.04)

## Topology

- **Edge:** Cloudflare DNS + TLS + WAF in front of the Next.js app and NestJS API.
- **App host:** Docker Compose or Kubernetes: `web`, `api`, `worker` (BullMQ consumers), `postgres`, `redis`.
- **Proxmox:** API reachable from `api` / workers only; tokens stored AES-256-GCM in `Node.proxmoxTokenSecretEnc` using a KMS or `HALIX_SECRET_KMS_KEY` env-derived key (implement `SecretsService`).

## Environment

| Variable | Service | Purpose |
|----------|---------|---------|
| `DATABASE_URL` | api, worker | PostgreSQL connection |
| `REDIS_URL` | api, worker | BullMQ + optional cache |
| `JWT_ACCESS_SECRET` | api | Access JWT signing |
| `JWT_REFRESH_SECRET` | api | Refresh token HMAC / rotation store |
| `CORS_ORIGIN` | api | Comma-separated web origins |
| `NEXT_PUBLIC_API_URL` | web | REST base for browser |
| `NEXT_PUBLIC_SOCKET_URL` | web | Socket.IO origin |

## Commands

```bash
docker compose -f docker/docker-compose.yml up -d postgres redis
cd apps/api && npx prisma migrate deploy && npm run start:prod
cd apps/web && npm run build && npm run start
```

Workers (separate containers) import the same job processors and use `REDIS_URL` to subscribe to queues `vps-provision`, `vps-reinstall`, `metrics-scrape`, etc.

## Hardening checklist

- TLS termination at Cloudflare or reverse proxy; HSTS enabled.
- Rate limits (Throttler) tuned per route class; stricter on `auth/login`.
- WebSocket auth: JWT in `handshake.auth.token` only over WSS.
- Secrets: rotate Proxmox tokens; encrypt at rest; never log token values.
- Backups: managed Postgres PITR + object storage for backup artifacts from Proxmox.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for security depth and data model.
