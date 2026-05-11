'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type VmTab = { href: string; label: string; end?: boolean };

const tabs = (id: string): VmTab[] => [
  { href: `/panel/vms/${id}`, label: 'Overview', end: true },
  { href: `/panel/vms/${id}/console`, label: 'Console' },
  { href: `/panel/vms/${id}/backups`, label: 'Backups' },
  { href: `/panel/vms/${id}/network`, label: 'Network' },
  { href: `/panel/vms/${id}/settings`, label: 'Settings' },
];

export function VmSubnav({ vmId }: { vmId: string }) {
  const pathname = usePathname();
  const items = tabs(vmId);

  return (
    <nav className="mb-8 flex flex-wrap gap-2 border-b border-white/10 pb-1">
      {items.map((tab) => {
        const active = tab.end
          ? pathname === tab.href
          : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'rounded-t-lg px-4 py-2 text-sm font-medium transition',
              active
                ? 'bg-halix-core/30 text-halix-glow shadow-[inset_0_-2px_0_0_rgba(167,139,250,0.9)]'
                : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-200',
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
