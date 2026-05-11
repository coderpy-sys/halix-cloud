'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Server } from 'lucide-react';
import { halixFetch, getErrorMessage } from '@/lib/api-client';
import { bytesToString } from '@/lib/format-bytes';
import { notifyError } from '@/stores/toast';
import type { VmListItem } from '@/types/vm';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function MyServicesList() {
  const [vms, setVms] = useState<VmListItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    halixFetch<VmListItem[]>('/vms')
      .then((rows) => {
        if (!cancelled) setVms(rows);
      })
      .catch((e) => {
        if (!cancelled) {
          setVms([]);
          const msg = getErrorMessage(e);
          notifyError('Could not load services', msg);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-zinc-500">Loading services…</div>
    );
  }

  if (!vms?.length) {
    return (
      <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-halix-card/40 py-20 text-center backdrop-blur">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-halix-core/30 text-halix-accent">
          <Server className="h-8 w-8" />
        </div>
        <h2 className="mt-6 text-xl font-semibold text-white">No active services</h2>
        <p className="mt-2 max-w-md text-sm text-zinc-500">
          Authenticate and provision a VM, or seed the API — list comes from{' '}
          <code className="text-halix-accent">GET /v1/vms</code>.
        </p>
        <Link
          href="/panel/services/order"
          className={cn(buttonVariants(), 'mt-8')}
        >
          Browse services
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-halix-card/40 backdrop-blur">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Node</th>
            <th className="px-4 py-3">Resources</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {vms.map((vm) => (
            <tr
              key={vm.id}
              className="border-b border-white/5 transition hover:bg-white/[0.03]"
            >
              <td className="px-4 py-3 font-medium text-white">{vm.name}</td>
              <td className="px-4 py-3 text-zinc-400">{vm.status}</td>
              <td className="px-4 py-3 text-zinc-400">
                {vm.node?.name ?? '—'}
              </td>
              <td className="px-4 py-3 text-zinc-500">
                {vm.cpuCores} vCPU · {bytesToString(vm.ramMb * 1024 * 1024)} RAM ·{' '}
                {vm.diskGb} GB disk
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/panel/vms/${vm.id}`}
                  className="text-halix-accent hover:underline"
                >
                  Manage
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
