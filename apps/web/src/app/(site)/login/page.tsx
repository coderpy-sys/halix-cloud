import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-20">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-zinc-500">
          POST credentials to <code className="text-halix-accent">/v1/auth/login</code>
        </p>
      </div>
      <form className="space-y-4 rounded-2xl border border-white/10 bg-halix-card/50 p-6 backdrop-blur">
        <label className="block text-xs font-medium text-zinc-400">
          Email
          <input
            type="email"
            name="email"
            className="mt-1 w-full rounded-lg border border-halix-line bg-halix-deep px-3 py-2 text-sm text-white outline-none ring-halix-accent/30 focus:ring-2"
            placeholder="you@halix.cloud"
            autoComplete="email"
          />
        </label>
        <label className="block text-xs font-medium text-zinc-400">
          Password
          <input
            type="password"
            name="password"
            className="mt-1 w-full rounded-lg border border-halix-line bg-halix-deep px-3 py-2 text-sm text-white outline-none ring-halix-accent/30 focus:ring-2"
            autoComplete="current-password"
          />
        </label>
        <Button type="button" className="w-full">
          Sign in (wire to API)
        </Button>
      </form>
      <p className="text-center text-xs text-zinc-500">
        New here?{' '}
        <Link href="/register" className="text-halix-accent hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
}
