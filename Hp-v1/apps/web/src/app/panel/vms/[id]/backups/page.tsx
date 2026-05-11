'use client';

import { Suspense } from 'react';
import { usePagination } from '@/hooks/use-pagination';

function BackupsPager() {

  const { page, setPage } = usePagination();

  return (
    <div className="rounded-2xl border border-white/10 bg-halix-card/40 p-6 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-white">Backups & snapshots</h2>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>Page {page}</span>
          <button
            type="button"
            onClick={() => setPage(page + 1)}
            className="rounded-lg border border-white/10 px-2 py-1 hover:border-halix-accent/40"
          >
            Next (demo)
          </button>
        </div>
      </div>
      <p className="mt-2 text-xs text-zinc-500">
        URL sync: <code className="text-halix-accent">?page=</code> from Convoy-style
        pagination hook.
      </p>
      <p className="mt-8 text-center text-sm text-zinc-600">
        No backups yet — wire to <code className="text-zinc-500">GET /v1/vms/:id/backups</code>{' '}
        when implemented.
      </p>
    </div>
  );
}

export default function VmBackupsPage() {
  return (
    <Suspense fallback={<div className="text-sm text-zinc-500">Loading…</div>}>
      <BackupsPager />
    </Suspense>
  );
}
