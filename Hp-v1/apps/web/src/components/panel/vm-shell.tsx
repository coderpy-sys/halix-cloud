'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronRight, Loader2, ServerCrash } from 'lucide-react';
import { halixFetch, getErrorMessage } from '@/lib/api-client';
import { notifyError } from '@/stores/toast';
import type { VmListItem } from '@/types/vm';
import { VmSubnav } from '@/components/panel/vm-subnav';

export function VmShell({
  vmId,
  children,
}: {
  vmId: string;
  children: React.ReactNode;
}) {
  const [vm, setVm] = useState<VmListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    halixFetch<VmListItem>(`/vms/${vmId}`)
      .then((data) => {
        if (!cancelled) setVm(data);
      })
      .catch((e) => {
        const msg = getErrorMessage(e);
        if (!cancelled) {
          setError(msg);
          notifyError('Could not load VPS', msg);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [vmId]);

  return (
    <div>
      <nav className="mb-4 flex flex-wrap items-center gap-1 text-xs text-zinc-500">
        <Link href="/panel/services/my" className="hover:text-halix-accent">
          My services
        </Link>
        <ChevronRight className="h-3 w-3 opacity-50" />
        <span className="text-zinc-400">
          {vm?.name ?? (loading ? '…' : vmId.slice(0, 8))}
        </span>
      </nav>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Loader2 className="h-4 w-4 animate-spin text-halix-accent" />
          Loading instance…
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-950/40 p-8 text-center backdrop-blur">
          <ServerCrash className="mx-auto h-10 w-10 text-red-400" />
          <h2 className="mt-4 text-lg font-semibold text-white">Unavailable</h2>
          <p className="mt-2 text-sm text-red-200/80">{error}</p>
          <p className="mt-4 text-xs text-zinc-500">
            Save a token:{' '}
            <code className="text-halix-accent">localStorage.setItem(&apos;halix_access_token&apos;, &apos;…&apos;)</code>{' '}
            after login, or open from an authenticated session.
          </p>
        </div>
      )}

      {!loading && !error && vm && (
        <>
          <div className="mb-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{vm.name}</h1>
              <p className="mt-1 text-sm text-zinc-500">
                {vm.type} · {vm.status}
                {vm.node?.name ? ` · ${vm.node.name}` : ''}
              </p>
            </div>
          </div>
          <VmSubnav vmId={vmId} />
          {children}
        </>
      )}

      {!loading && !error && !vm && null}
    </div>
  );
}
