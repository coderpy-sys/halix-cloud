'use client';

import { usePersistedState } from '@/hooks/use-persisted-state';
import { notifySuccess } from '@/stores/toast';

export default function VmSettingsPage() {
  const [hostname, setHostname] = usePersistedState(
    'halix.vm.settings.hostname.demo',
    '',
  );

  return (
    <div className="max-w-xl rounded-2xl border border-white/10 bg-halix-card/40 p-6 backdrop-blur">
      <h2 className="text-sm font-semibold text-white">Settings</h2>
      <p className="mt-2 text-xs text-zinc-500">
        Example of persisted UI state (localStorage) without touching the API — similar
        ergonomics to panel “remember my last tab” patterns.
      </p>
      <label className="mt-6 block text-xs font-medium text-zinc-400">
        Hostname note (local only)
        <input
          value={hostname}
          onChange={(e) => setHostname(e.target.value)}
          className="mt-1 w-full rounded-lg border border-halix-line bg-halix-deep px-3 py-2 text-sm text-white outline-none ring-halix-accent/30 focus:ring-2"
          placeholder="my-vps"
        />
      </label>
      <button
        type="button"
        onClick={() =>
          notifySuccess('Saved locally', 'This demo writes to localStorage only.')
        }
        className="mt-4 rounded-xl bg-gradient-to-r from-halix-core to-halix-accent px-4 py-2 text-sm font-medium text-white"
      >
        Toast demo
      </button>
    </div>
  );
}
