import { PanelSidebar } from '@/components/panel/panel-sidebar';
import { ToastHost } from '@/components/ui/toast-host';
import Link from 'next/link';
import { LifeBuoy } from 'lucide-react';

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 flex min-h-screen">
      <PanelSidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-end border-b border-white/5 bg-halix-void/50 px-6 text-xs text-zinc-500 backdrop-blur">
          <Link
            href="https://discord.gg/freehost"
            className="flex items-center gap-1 text-halix-accent hover:underline"
          >
            <LifeBuoy className="h-3.5 w-3.5" />
            Halix Discord
          </Link>
        </header>
        <div className="flex-1 overflow-auto p-6 lg:p-10">{children}</div>
      </div>
      <ToastHost />
    </div>
  );
}
