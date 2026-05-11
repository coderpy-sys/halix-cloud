import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function TicketsPage() {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Support tickets</h1>
          <p className="mt-1 text-sm text-zinc-500">View and manage your tickets.</p>
        </div>
        <Link
          href="/panel/support/tickets/new"
          className={cn(buttonVariants({ size: 'sm' }))}
        >
          + New ticket
        </Link>
      </div>
      <div className="mt-6 flex gap-2">
        {['All', 'Open', 'In progress', 'Closed'].map((s, i) => (
          <button
            key={s}
            type="button"
            className={cn(
              'rounded-full px-4 py-1.5 text-xs font-medium transition',
              i === 0
                ? 'bg-gradient-to-r from-halix-core to-halix-accent text-white shadow-halix'
                : 'border border-white/10 text-zinc-400 hover:border-halix-accent/40',
            )}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="mt-8 rounded-2xl border border-white/10 bg-halix-card/40 py-16 text-center backdrop-blur">
        <p className="text-sm text-zinc-500">No tickets found.</p>
        <Link
          href="/panel/support/tickets/new"
          className={cn(buttonVariants({ variant: 'secondary' }), 'mt-4 inline-flex')}
        >
          + Create your first ticket
        </Link>
      </div>
    </div>
  );
}
