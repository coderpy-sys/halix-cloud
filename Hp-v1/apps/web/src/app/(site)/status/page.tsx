export default function StatusPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-white">System status</h1>
      <p className="mt-2 text-zinc-400">
        Wire this page to your status provider (e.g. Instatus, Cachet, or internal
        probes). The API exposes <code className="text-halix-accent">/v1/health</code>{' '}
        for synthetic checks.
      </p>
      <ul className="mt-8 space-y-3 text-sm text-zinc-300">
        <li className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <span>Control API</span>
          <span className="text-emerald-400">Operational</span>
        </li>
        <li className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <span>Realtime gateway</span>
          <span className="text-emerald-400">Operational</span>
        </li>
        <li className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <span>Provisioning workers</span>
          <span className="text-amber-300">Degraded (local dev)</span>
        </li>
      </ul>
    </div>
  );
}
