# Halix Cloud — system architecture

This document is the **source of truth** for how the Halix Cloud VPS platform is structured: data model, APIs, Proxmox integration, IPAM, queues, realtime events, billing hooks, security, and delivery roadmap. It complements the scaffold in this repository (`apps/web`, `apps/api`, `docker/`, `docs/`).

Brand: **Halix Cloud** — [https://halix.cloud](https://halix.cloud) · community [https://discord.gg/freehost](https://discord.gg/freehost).

---

## 1. Architecture overview

### 1.1 High-level topology

| Layer | Responsibility |
|-------|----------------|
| **Edge** | Cloudflare DNS, TLS, WAF, optional Spectrum for protected SSH. |
| **Web (`apps/web`)** | Next.js 15 App Router: marketing site, auth shells, **client panel**, **admin panel** (route-split by RBAC), static assets, RSC where beneficial. |
| **API (`apps/api`)** | NestJS 10: REST (`/v1/*`), OpenAPI at `/docs`, JWT auth, throttling, **Socket.IO** namespace `/realtime`, delegates heavy work to **BullMQ**. |
| **Workers** | Node processes (same repo, `apps/worker` recommended) consuming queues: provision, reinstall, power, IP allocate, metrics scrape, backup, DNS sync. |
| **Data** | PostgreSQL (Prisma), Redis (queues + pub/sub fanout optional). |
| **Proxmox** | One or more clusters; API token per node; TLS verify configurable per node. |

### 1.2 Design principles

- **API-first:** every UI action maps to a versioned REST command or WebSocket subscription; **API keys** (hashed, scoped) mirror user permissions for automation.
- **Jobs, not requests:** long operations (clone, migrate, reinstall) return `202` + `jobId`; workers update DB and emit WS events.
- **IPAM is first-class:** IPs are rows with lifecycle states, never “just strings” on a VM row alone.
- **Audit everything destructive:** power, reinstall, admin overrides, IP reassign, billing refunds.

### 1.3 Monorepo layout (current + recommended)

```
halix-cloud/
├── apps/
│   ├── web/                 # Next.js — marketing + panel + admin UI
│   ├── api/                 # NestJS — REST, WS, Prisma
│   └── worker/              # (recommended) BullMQ consumers + Proxmox executors
├── docker/
│   ├── docker-compose.yml   # postgres, redis
│   └── Dockerfile.api
├── docs/
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
└── package.json             # npm workspaces
```

---

## 2. Database schema

Implemented in `apps/api/prisma/schema.prisma` (PostgreSQL). Highlights:

| Domain | Models | Notes |
|--------|--------|-------|
| Identity | `User`, `Session`, `SshKey`, `ApiKey` | Argon2 password hash; API key `prefix` + `secretHash`; refresh rotation via `Session`. |
| Compute | `Node`, `Plan`, `Vm` | `Vm` holds `proxmoxVmid`, resources, `cloudInit` JSON, status enum. |
| IPAM | `IpPool`, `IpRange`, `IpAssignment` | Pools versioned V4/V6; ranges optional per-node; assignments link `vmId`, `floating`, `rdns`, `abuseFlag`. |
| Network policy | `FirewallRule` | Synced to Proxmox `firewall` / SDN depending on product choice. |
| Storage / backups | `Backup` | Snapshot vs file; links to Proxmox snapshot id. |
| Metrics | `MetricsSample` | Time-series friendly; roll up to aggregates in warehouse later. |
| Support | `Ticket`, `TicketMessage` | Department + optional `vmId`. |
| Comms | `Announcement`, `Notification` | Audience targeting; in-app feed. |
| Billing | `Invoice`, `InvoiceLine`, `Payment` | Provider enum; `creditsCents` on `User` for prepaid. |
| Compliance | `AuditLog` | Actor, action, resource, metadata JSON. |

**Indexes:** `MetricsSample(vmId, ts)`; `AuditLog(resource, resourceId)`; add BRIN on `ts` columns at scale.

---

## 3. API structure

### 3.1 Conventions

- Base path: `/v1` (global prefix).
- Auth: `Authorization: Bearer <accessJwt>`; API keys: `X-Api-Key: halix_live_xxx` (verify against `ApiKey` table + scopes).
- Errors: JSON `{ code, message, details? }`; map Proxmox upstream errors to stable client codes.
- Idempotency: `Idempotency-Key` header on POST that create side effects (provision, add credits webhook replay).

### 3.2 Resource map (representative)

| Area | Methods | Description |
|------|---------|-------------|
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/2fa/enable` | JWT access + refresh; TOTP for 2FA. |
| Users | `GET/PUT /users/me`, `POST /users/me/password` | Profile; staff routes under `/admin/users/*`. |
| Nodes | `GET /admin/nodes`, `POST /admin/nodes`, `PATCH /admin/nodes/:id` | Encrypted secrets; maintenance flag. |
| Plans | `GET /plans`, `POST /admin/plans` | Public catalog vs admin CRUD. |
| VMs | `GET /vms`, `GET /vms/:id`, `POST /vms/:id/power`, `POST /vms/:id/reinstall`, `POST /vms/:id/iso`, `GET /vms/:id/metrics` | Power = start/stop/reset/kill; reinstall enqueues wipe + clone + IP rebind. |
| Console | `POST /vms/:id/console/vnc-ticket`, `WS proxmox` (via worker proxy) | noVNC ticket flow; never expose raw Proxmox creds to browser. |
| IPAM | `GET /ipam/pools`, `POST /admin/ipam/pools`, `POST /admin/ipam/assign`, `POST /vms/:id/ips` | Allocation strategies: auto pool, manual, floating attach. |
| DNS | `PATCH /ipam/assignments/:id/rdns` | Cloudflare adapter in worker. |
| Tickets | `GET /tickets`, `POST /tickets`, `POST /tickets/:id/messages` | Realtime `ticket.updated`. |
| Billing | `GET /invoices`, `POST /checkout/session` (Stripe), webhooks `/webhooks/stripe` | Idempotent ledger updates. |

OpenAPI: generated from decorators; served at **`http://localhost:4000/docs`** in development.

---

## 4. Frontend routes

### 4.1 Marketing (`apps/web`)

| Route | Purpose |
|-------|---------|
| `/` | Hero, features, animated background, CTAs. |
| `/pricing` | Plan cards (connect to `Plan` API). |
| `/status` | External status or health aggregation. |
| `/kb` | Knowledge base index (extend with CMS or markdown). |
| `/docs` | Link to OpenAPI + internal markdown. |
| `/login`, `/register` | Auth forms → API. |

### 4.2 Client panel (`/panel/*`)

| Route | Purpose |
|-------|---------|
| `/panel/dashboard` | Summary cards, graphs, quick actions. |
| `/panel/announcements` | Feed from `Announcement`. |
| `/panel/services/order`, `/panel/services/my` | Catalog + VM list + empty states. |
| `/panel/support/tickets`, `/panel/support/tickets/new`, `/panel/support/faq` | Support UX. |
| `/panel/account/personal`, `/panel/account/credits` | Profile + billing UI. |
| `/panel/vms/[id]` | Power, console, reinstall, ISO, graphs, network, backups (tabbed). |

### 4.3 Admin panel (recommended)

Mount under **`/admin`** with layout guard `role in (ADMIN, SUPERADMIN)`:

- `/admin/overview` — fleet health, node load heatmap.
- `/admin/users`, `/admin/vms`, `/admin/nodes`, `/admin/ipam`, `/admin/plans`, `/admin/tickets`, `/admin/audit`, `/admin/billing`.

Reuse the same **shadcn-style** primitives and Halix tokens; denser tables, fewer marketing effects.

---

## 5. Backend routes (NestJS modules)

| Module | Responsibility |
|--------|----------------|
| `AuthModule` | JWT issue/verify, refresh, 2FA hooks, Passport JWT strategy. |
| `UsersModule` | CRUD self-service + admin overrides. |
| `NodesModule` | Node registry, encrypted credentials, health pings. |
| `PlansModule` | Plan CRUD, feature flags. |
| `VmsModule` | VM CRUD facade, enqueues jobs, validates ownership/RBAC. |
| `ProxmoxModule` | Request signing (`PVEAPIToken`), URL builders, error normalization (used by workers primarily). |
| `IpamModule` | Pools, ranges, allocation policies, rDNS requests. |
| `TicketsModule` | Ticket lifecycle + notifications. |
| `BillingModule` | Invoices, payments, webhooks, credit ledger. |
| `AuditModule` | Central `AuditLog` writer. |
| `RealtimeModule` | Socket.IO gateway; JWT on connect; rooms `user:{id}`, `vm:{id}`, `admin`. |
| `QueueModule` | BullMQ `Queue` registrations; producers only in API. |

---

## 6. Proxmox integration structure

### 6.1 Layering

```
ProxmoxService (auth header, base URL)
    └── ProxmoxNodeClient (per-node: get, post, delete)
            └── Job handlers (workers)
```

- **QEMU:** clone from template, `qm` config (cores, memory, scsi, net, ide2 for cloud-init), `agent` enabled where available.
- **LXC:** `pct` template deploy, cgroup limits, veth to Linux bridge / SDN.
- **Snapshots / backups:** `vzdump` jobs or PBS integration later.
- **Migration:** `qm migrate` / `pct migrate` with shared storage validation.
- **Stats:** `rrddata` or `status/current` polling → `MetricsSample` + WS push.

### 6.2 Credentials

Store **token ID + secret** per node; secret encrypted with app-level KMS key; rotate via admin UI without plaintext logging.

### 6.3 HA-ready posture

- API is stateless; workers idempotent; **single active writer** per `vmId` job lock (Redis lock or `FOR UPDATE` row).
- Node maintenance drains new provisions; existing VMs optionally migrate (policy).

---

## 7. Authentication system

| Mechanism | Flow |
|-----------|------|
| **Password** | Argon2id hash; rate limit login; optional CAPTCHA at edge. |
| **JWT access** | Short TTL (15m); claims: `sub`, `email`, `role`, `permissions[]` (optional fine RBAC). |
| **Refresh** | HttpOnly cookie **or** rotating refresh token in `Session` table; detect reuse → revoke family. |
| **2FA** | TOTP (RFC 6238); backup codes hashed; enforced for `ADMIN+`. |
| **API keys** | `halix_{env}_` prefix; HMAC or bcrypt of secret; scopes like `vms:read`, `vms:power`, `ipam:write`. |
| **WebSocket** | Same access JWT in `handshake.auth.token` over **WSS** only in production. |

---

## 8. IP management logic

### 8.1 IPv4

1. **Pool** defines CIDR, gateway, VLAN, NAT flag, floating capacity.
2. **Ranges** subdivide pools (optional per-node affinity for routed customer traffic).
3. **Assignment** rows: state `FREE | ASSIGNED | RESERVED | SUSPENDED`; link to `vmId`; optional `floating`.
4. **Allocation algorithm:** transaction: `SELECT … FOR UPDATE SKIP LOCKED` on next `FREE` row in preferred pool/range; set `ASSIGNED`; emit `ip.assigned` event; worker applies `ipconfig` on Proxmox NIC.
5. **NAT:** if `natEnabled`, worker programs iptables/NAT rules or SDN policy on edge gateway (separate `NatMapping` table if needed).
6. **rDNS:** PATCH assignment → enqueue Cloudflare / PDNS update; store `externalRequestId` in metadata.

### 8.2 IPv6

- **SLAAC:** bridge + RA from upstream /64; assignment row documents delegated prefix ID.
- **Static /64:** store prefix on `IpAssignment.address` as `/128` host or document parent in `metadata`.
- **Routed /48:** pool metadata holds delegation; advertise via static route on node; visualization = tree UI from pool JSON.

### 8.3 Reinstall + IP preservation

Reinstall job payload: `{ vmId, templateId, wipe: true, preserveIps: true, preserveDataDisk?: boolean }`. Worker: detach ISO → destroy disk on OS datastore only → clone template → reattach **same MAC/IP bindings** from `IpAssignment` rows → reapply cloud-init.

---

## 9. Queue worker architecture

| Queue | Producer | Consumer behavior |
|-------|----------|-------------------|
| `vps-provision` | API (order paid / admin create) | Pick node (weight, capacity), allocate IPs, clone VM/CT, configure net, cloud-init, mark `RUNNING` or `ERROR`. |
| `vps-reinstall` | API | Wipe policy + IP preservation per §8.3. |
| `vps-power` | API | Map to `qm start/stop/reset` or `pct` equivalents; idempotent state machine. |
| `ip-allocate` / `ip-release` | API / billing | Atomic DB + Proxmox reconcile. |
| `metrics-scrape` | Scheduler | Poll Proxmox stats → DB + WS `vm.metrics`. |
| `backup-run` | API / schedule | Snapshot / vzdump; update `Backup` rows. |
| `dns-sync` | API | rDNS + optional Cloudflare hostname modules. |

**Retries:** exponential backoff; **DLQ** `*.failed` for operator inspection; poison messages alert via Discord webhook.

---

## 10. Docker deployment

- `docker/docker-compose.yml` — **Postgres 16** + **Redis 7** for local and CI.
- `docker/Dockerfile.api` — multi-stage build: `prisma generate`, `nest build`, production `node_modules` prune.
- Add **`Dockerfile.web`** (Next standalone output) and **`docker-compose.prod.yml`** wiring `web`, `api`, `worker`, TLS proxy.

---

## 11. Production deployment guide

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for Ubuntu 24.04–oriented steps: env vars, migrate, process manager or Kubernetes, Cloudflare, and hardening checklist.

---

## 12. UI component hierarchy (web)

```
app/layout.tsx                    # fonts, dark class, grid background
├── (site)/layout.tsx             # SiteHeader, marketing footer
│   ├── page.tsx                  # Landing
│   ├── pricing/, status/, kb/, docs/, login/, register/
└── panel/layout.tsx              # PanelSidebar + content chrome
    ├── dashboard/                # SummaryCard*, QuickAction*, charts
    ├── services/, support/, account/
    └── vms/[id]/                 # Tabbed VM shell

components/
├── ui/button.tsx                 # CVA variants (Halix gradient primary)
├── site/site-header.tsx
└── panel/panel-sidebar.tsx       # Framer Motion width; nav sections
```

**Design tokens:** `halix.void`, `halix.deep`, `halix.card`, `halix.accent`, `halix.core`, `shadow-halix` (Tailwind theme extension).

---

## 13. Admin panel design

- **Dense data grid** (TanStack Table) for users, VMs, IPs, invoices.
- **Node board:** CPU/RAM/disk bars, VM count, maintenance toggle, “drain” switch.
- **IPAM console:** pool tree, filter by state, abuse flagged rows in amber/red.
- **Audit stream:** infinite scroll with JSON diff viewer for metadata changes.
- **Impersonation** (optional): time-bound, fully audited session for support.

---

## 14. Client panel design

- **FridayVPS-inspired IA** re-skinned: **purple glass**, glow on active nav, generous spacing, pill filters.
- **Motion:** Framer Motion on sidebar width, card hover lift, chart mount fades.
- **Realtime:** Zustand stores per domain (`useVmStore`, `useCreditsStore`); Socket.IO patches stores; optimistic UI only for reversible actions.

---

## 15. VPS provisioning flow

1. User selects **Plan** + region + template + optional SSH keys + hostname.
2. **Billing** confirms payment method / credits → creates `Invoice` or deducts `creditsCents` in transaction.
3. API creates `Vm` row `PROVISIONING`, enqueues **`vps-provision`** with payload `{ userId, planId, templateId, region, sshKeyIds, cloudInit }`.
4. Worker selects **Node** (capacity score = f(cpu, ram, disk headroom, IP availability, maintenance, weight)).
5. Worker allocates **IPs** from pools; writes `IpAssignment`.
6. Worker calls Proxmox: clone, set cores/RAM/disk, attach **cloud-init** drive, start VM.
7. Worker waits for **guest agent** or first ping policy; updates `Vm.status` → `RUNNING`; notifications + WS `vm.provisioned`.

---

## 16. Reinstall flow

1. User chooses **template** (Debian, Ubuntu, Alma, Rocky, Arch, Windows, custom ISO) + options: **full wipe**, **preserve data disk**, **preserve IPs** (default on), **regenerate cloud-init**.
2. API validates **ownership** and plan template allow-list; enqueues **`vps-reinstall`**.
3. Worker snapshots optional rollback point (policy); powers off VM.
4. Disk phase per wipe mode; reclone from template; **rebind NIC MAC + IP rows**; inject **cloud-init** (password, SSH keys, scripts).
5. Power on; post-bootstrap hooks (e.g., reset password API); audit log + WS `vm.reinstall.completed`.

---

## 17. WebSocket event system

| Event | Payload sketch | Rooms |
|-------|----------------|-------|
| `vm.metrics` | `{ vmId, cpu, ramMb, net, disk }` | `user:{id}`, `vm:{id}` |
| `vm.power` | `{ vmId, state }` | same |
| `vm.job` | `{ vmId, jobId, phase, percent? }` | same |
| `credits.updated` | `{ balanceCents }` | `user:{id}` |
| `ticket.message` | `{ ticketId, message }` | `user:{id}`, `admin` |
| `node.status` | `{ nodeId, online }` | `admin` |

Authorize **room join** for `vm:{id}` only if `vm.userId === socket.userId` or staff role.

---

## 18. Billing-ready schema

- **`Invoice` + `InvoiceLine`:** subtotal/tax/total in integer cents; `externalId` for Stripe invoice id.
- **`Payment`:** provider enum; `raw` JSON for webhook payloads (PII minimized).
- **`User.creditsCents`:** ledger adjustments via transactional rows (add `LedgerEntry` model later for stricter accounting).
- **Subscriptions:** add `Subscription` + `SubscriptionItem` when enabling MRR; link to `Plan` version ids.
- **Webhooks:** Stripe signature verification; store `event.id` for idempotency.

---

## 19. Security architecture

| Control | Implementation |
|---------|----------------|
| Rate limiting | `@nestjs/throttler` global + per-route overrides; Cloudflare edge rules. |
| CSRF | SameSite cookies for refresh; double-submit token if using cookie session for web-only forms. |
| RBAC | Guards: `@Roles()`, fine scopes on API keys; default deny. |
| Secrets | KMS-wrapped keys for Proxmox + DNS; no secrets in client bundles. |
| Audit | `AuditLog` on all mutating admin + destructive VM routes. |
| Transport | TLS everywhere; WSS for Socket.IO. |
| Input validation | `class-validator` DTOs + strict Proxmox ID parsing. |
| 2FA | TOTP + recovery codes; lockout counters in Redis. |

---

## 20. Roadmap

| Phase | Scope |
|-------|-------|
| **M0 (now)** | Monorepo scaffold, Prisma schema, auth, VM list/detail API stubs, panel UI shell, Docker compose, architecture docs. |
| **M1** | Full provision/reinstall/power workers; Proxmox QEMU path; metrics scrape + charts; API keys. |
| **M2** | LXC path; ISO attach/eject; snapshot backups; rDNS Cloudflare worker. |
| **M3** | Stripe + credits + invoices UI; ticket CRUD + staff queue. |
| **M4** | Admin RBAC, impersonation, abuse workflows, IP floating + NAT edge automation. |
| **M5** | Migration between nodes; maintenance drain; HA scheduling policies. |
| **M6** | Ceph/PBS templates; advanced firewall sync; self-service object storage product line. |

---

## References (inspiration, not copies)

- [ConvoyPanel](https://github.com/convoypanel/panel) — feature breadth reference.
- [FeatherPanel](https://featherpanel.com) — interaction smoothness reference.
- FridayVPS-style dashboards — navigation grouping and empty states (reimplemented with Halix visual language).

---

*Document version: 0.1.0 — aligned with repository scaffold.*
