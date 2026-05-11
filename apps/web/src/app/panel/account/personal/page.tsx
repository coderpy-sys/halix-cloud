import { Button } from '@/components/ui/button';
import { KeyRound } from 'lucide-react';

export default function PersonalPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Personal information</h1>
      <p className="mt-1 text-sm text-zinc-500">Profile, security, and account metadata.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-halix-card/50 p-6 backdrop-blur">
          <h2 className="text-sm font-semibold text-white">Details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-xs text-zinc-500">
              First name
              <input className="mt-1 w-full rounded-lg border border-halix-line bg-halix-deep px-3 py-2 text-sm text-white" />
            </label>
            <label className="text-xs text-zinc-500">
              Last name
              <input className="mt-1 w-full rounded-lg border border-halix-line bg-halix-deep px-3 py-2 text-sm text-white" />
            </label>
          </div>
          <label className="mt-4 block text-xs text-zinc-500">
            Email (locked)
            <input
              disabled
              className="mt-1 w-full cursor-not-allowed rounded-lg border border-halix-line bg-black/30 px-3 py-2 text-sm text-zinc-500"
              value="you@halix.cloud"
            />
          </label>
        </section>
        <section className="rounded-2xl border border-white/10 bg-halix-card/50 p-6 backdrop-blur">
          <h2 className="text-sm font-semibold text-white">Security</h2>
          <Button type="button" className="mt-4">
            <KeyRound className="h-4 w-4" />
            Change password
          </Button>
        </section>
        <section className="rounded-2xl border border-white/10 bg-halix-card/50 p-6 backdrop-blur lg:col-span-2">
          <h2 className="text-sm font-semibold text-white">Account</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm">
            <div>
              <div className="text-xs text-zinc-500">Account ID</div>
              <div className="mt-1 font-mono text-zinc-200">usr_••••</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">Support PIN</div>
              <div className="mt-1 font-mono text-zinc-200">••••••••</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">Member since</div>
              <div className="mt-1 text-zinc-200">2026</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
