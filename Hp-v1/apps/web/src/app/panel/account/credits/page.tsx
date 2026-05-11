import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

const presets = ['$1', '$5', '$10', '$25', '$50', '$100'];

export default function CreditsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Credits</h1>
      <p className="mt-1 text-sm text-zinc-500">Manage your account balance.</p>
      <div className="mt-8 rounded-2xl border border-white/10 bg-halix-card/50 p-6 backdrop-blur">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-zinc-500">
              Current balance
            </div>
            <div className="mt-2 text-4xl font-bold text-halix-glow">$0.00</div>
          </div>
          <Wallet className="h-8 w-8 text-halix-accent" />
        </div>
      </div>
      <section className="mt-6 rounded-2xl border border-white/10 bg-halix-card/40 p-6 backdrop-blur">
        <h2 className="text-sm font-semibold text-white">Add credits</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-200 transition hover:border-halix-accent/40"
            >
              {p}
            </button>
          ))}
        </div>
        <label className="mt-4 block text-xs text-zinc-500">
          Custom amount
          <input
            placeholder="0.00"
            className="mt-1 w-full max-w-xs rounded-lg border border-halix-line bg-halix-deep px-3 py-2 text-sm text-white"
          />
        </label>
        <p className="mt-6 text-xs text-zinc-500">Payment method</p>
        <div className="mt-2 rounded-xl border border-halix-accent/30 bg-halix-core/10 px-4 py-3 text-sm text-white">
          Crypto / card adapters plug into <code>Payment</code> rows.
        </div>
        <Button type="button" className="mt-6 w-full max-w-md">
          Add $0.00 credits
        </Button>
      </section>
      <section className="mt-6 rounded-2xl border border-white/10 bg-halix-card/30 p-6 text-center text-sm text-zinc-500 backdrop-blur">
        Transaction history will list ledger entries from invoices and top-ups.
      </section>
    </div>
  );
}
