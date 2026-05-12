# Proxmox PCT (LXC) support

Halix Cloud v2 is Proxmox-focused and targets **QEMU/KVM** guests, calling Proxmox APIs under `/api2/json/nodes/{node}/qemu/{vmid}/...`.

**PCT** containers use different endpoints (`/nodes/{node}/lxc/{vmid}/...`) and capabilities (no VGA the same way, different config keys, backup paths, etc.).

## What is in this fork today

- `app/Enums/Server/ProxmoxGuestType.php` defines `QEMU` and `LXC` for future use (database column, validation, and UI).
- Full PCT support requires a coordinated change across repositories under `app/Repositories/Proxmox/Server/`, Wings-style RPC if applicable, migrations, and the React server flows. Track that work against this document.

## Suggested implementation order

1. Add `guest_type` (or `virtualization`) to `servers` with default `qemu`; backfill existing rows.
2. Introduce a small URL builder used by Proxmox HTTP clients that switches `qemu` vs `lxc` path segments.
3. Duplicate or generalize repositories that assume QEMU-only (power, config, console, snapshots, firewall, metrics).
4. Adjust UI: template picker, console type, and settings cards that are KVM-specific.

Contributions welcome; keep API compatibility for existing QEMU servers.
