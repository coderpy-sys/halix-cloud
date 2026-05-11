import { Megaphone } from 'lucide-react';

export default function AnnouncementsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Announcements</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Latest updates from Halix Cloud — backed by{' '}
        <code className="text-halix-accent">Announcement</code> rows.
      </p>
      <article className="mt-8 rounded-2xl border border-white/10 bg-halix-card/50 p-6 backdrop-blur">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-halix-core/40 text-white">
            <Megaphone className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">24-hour trials</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Trial flags live on plans and subscriptions. When Stripe webhooks land,
              entitlement sync updates VM quotas automatically.
            </p>
            <p className="mt-4 text-xs text-zinc-600">
              May 11, 2026 · 13 hours ago
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
