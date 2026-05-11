import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-20">
      <div>
        <h1 className="text-2xl font-bold text-white">Create account</h1>
        <p className="mt-1 text-sm text-zinc-500">
          POST to <code className="text-halix-accent">/v1/auth/register</code>
        </p>
      </div>
      <form className="space-y-4 rounded-2xl border border-white/10 bg-halix-card/50 p-6 backdrop-blur">
        <label className="block text-xs font-medium text-zinc-400">
          Email
          <input
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-halix-line bg-halix-deep px-3 py-2 text-sm text-white outline-none ring-halix-accent/30 focus:ring-2"
            placeholder="you@halix.cloud"
          />
        </label>
        <label className="block text-xs font-medium text-zinc-400">
          Password (min 12)
          <input
            type="password"
            required
            minLength={12}
            className="mt-1 w-full rounded-lg border border-halix-line bg-halix-deep px-3 py-2 text-sm text-white outline-none ring-halix-accent/30 focus:ring-2"
          />
        </label>
        <Button type="button" className="w-full">
          Register (wire to API)
        </Button>
      </form>
      <p className="text-center text-xs text-zinc-500">
        Already have an account?{' '}
        <Link href="/login" className="text-halix-accent hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
