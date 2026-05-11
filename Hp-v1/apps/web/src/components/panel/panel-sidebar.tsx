'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Megaphone,
  Plus,
  Server,
  ShoppingCart,
  Ticket,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/sidebar';

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard };

const main: NavItem[] = [
  { href: '/panel/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/panel/announcements', label: 'Announcements', icon: Megaphone },
];

const services: NavItem[] = [
  { href: '/panel/services/order', label: 'Order services', icon: ShoppingCart },
  { href: '/panel/services/my', label: 'My services', icon: Server },
];

const support: NavItem[] = [
  { href: '/panel/support/tickets', label: 'Tickets', icon: Ticket },
  { href: '/panel/support/tickets/new', label: 'Create ticket', icon: Plus },
  { href: '/panel/support/faq', label: 'FAQ', icon: HelpCircle },
];

const account: NavItem[] = [
  { href: '/panel/account/personal', label: 'Personal', icon: User },
  { href: '/panel/account/credits', label: 'Credits', icon: CreditCard },
];

function NavSection({
  title,
  items,
  collapsed,
}: {
  title: string;
  items: NavItem[];
  collapsed: boolean;
}) {
  const pathname = usePathname();
  return (
    <div className="mb-6">
      {!collapsed && (
        <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
          {title}
        </div>
      )}
      <ul className="space-y-1">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition',
                  active
                    ? 'bg-halix-core/25 text-halix-glow shadow-[inset_0_0_0_1px_rgba(167,139,250,0.25)]'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100',
                  collapsed && 'justify-center px-0',
                )}
              >
                <item.icon className="h-4 w-4 shrink-0 text-halix-accent" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function PanelSidebar() {
  const { collapsed, toggle } = useSidebarStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ type: 'spring', stiffness: 420, damping: 38 }}
      className="relative flex h-screen shrink-0 flex-col border-r border-white/5 bg-halix-deep/90 py-4 backdrop-blur-xl"
    >
      <div className={cn('flex items-center gap-2 px-3', collapsed && 'justify-center')}>
        <Link href="/panel/dashboard" className="flex items-center gap-2">
          <Image src="/halix-mark.svg" alt="" width={32} height={32} />
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-xs font-bold tracking-wide text-white">
                HALIX
              </div>
              <div className="text-[10px] text-zinc-500">Control</div>
            </div>
          )}
        </Link>
      </div>

      <nav className="mt-8 flex-1 overflow-y-auto px-2">
        <NavSection title="Main" items={main} collapsed={collapsed} />
        <NavSection title="Services" items={services} collapsed={collapsed} />
        <NavSection title="Support" items={support} collapsed={collapsed} />
        <NavSection title="Account" items={account} collapsed={collapsed} />
      </nav>

      <div className="border-t border-white/5 px-2 pt-3">
        <button
          type="button"
          onClick={toggle}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-medium text-zinc-500 transition hover:bg-white/5 hover:text-zinc-200"
        >
          <ChevronLeft
            className={cn('h-4 w-4 transition', collapsed && 'rotate-180')}
          />
          {!collapsed && 'Collapse'}
        </button>
        <div
          className={cn(
            'mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-2 py-2',
            collapsed && 'justify-center border-0 bg-transparent',
          )}
        >
          <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-halix-core to-halix-accent" />
          {!collapsed && (
            <div className="min-w-0 flex-1 text-xs">
              <div className="truncate text-zinc-300">$0.00 credits</div>
            </div>
          )}
          <LogOut className="h-4 w-4 shrink-0 text-zinc-500" />
        </div>
      </div>
    </motion.aside>
  );
}
