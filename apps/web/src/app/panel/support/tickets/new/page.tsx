import { Button } from '@/components/ui/button';

export default function NewTicketPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold text-white">Create ticket</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Posts to <code className="text-halix-accent">Ticket</code> +{' '}
        <code className="text-halix-accent">TicketMessage</code>.
      </p>
      <form className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-halix-card/50 p-6 backdrop-blur">
        <label className="block text-xs font-medium text-zinc-400">
          Subject
          <input
            className="mt-1 w-full rounded-lg border border-halix-line bg-halix-deep px-3 py-2 text-sm text-white outline-none ring-halix-accent/30 focus:ring-2"
            placeholder="Brief description"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs font-medium text-zinc-400">
            Department
            <select className="mt-1 w-full rounded-lg border border-halix-line bg-halix-deep px-3 py-2 text-sm text-white outline-none ring-halix-accent/30 focus:ring-2">
              <option>General</option>
              <option>Billing</option>
              <option>Technical</option>
            </select>
          </label>
          <label className="block text-xs font-medium text-zinc-400">
            Service (optional)
            <select className="mt-1 w-full rounded-lg border border-halix-line bg-halix-deep px-3 py-2 text-sm text-white outline-none ring-halix-accent/30 focus:ring-2">
              <option>None</option>
            </select>
          </label>
        </div>
        <label className="block text-xs font-medium text-zinc-400">
          Message
          <textarea
            rows={6}
            className="mt-1 w-full rounded-lg border border-halix-line bg-halix-deep px-3 py-2 text-sm text-white outline-none ring-halix-accent/30 focus:ring-2"
            placeholder="Describe your issue..."
          />
        </label>
        <div className="flex gap-3 pt-2">
          <Button type="button">Submit ticket</Button>
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
