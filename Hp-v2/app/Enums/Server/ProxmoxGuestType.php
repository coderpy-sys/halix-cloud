<?php

namespace Convoy\Enums\Server;

/**
 * Proxmox guest family. QEMU is the legacy Convoy default; LXC maps to PCT APIs.
 */
enum ProxmoxGuestType: string
{
    case QEMU = 'qemu';
    case LXC = 'lxc';
}
