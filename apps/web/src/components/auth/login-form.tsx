'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { halixFetch, getErrorMessage } from '@/lib/api-client';
import { notifyError, notifySuccess } from '@/stores/toast';

type LoginResponse = {
  user: { id: string; email: string; role: string };
  accessToken: string;
};

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email') ?? '').trim();
    const password = String(fd.get('password') ?? '');
    if (!email || !password) {
      setError('Enter email and password.');
      return;
    }
    setLoading(true);
    try {
      const data = await halixFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        token: null,
      });
      if (!data?.accessToken) {
        setError('Invalid response from server.');
        notifyError('Sign in failed', 'No access token returned');
        return;
      }
      localStorage.setItem('halix_access_token', data.accessToken);
      notifySuccess('Signed in', data.user.email);
      router.push('/panel/dashboard');
      router.refresh();
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      notifyError('Sign in failed', msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-white/10 bg-halix-card/50 p-6 backdrop-blur"
    >
      {error ? (
        <p className="rounded-lg border border-red-500/40 bg-red-950/50 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      ) : null}
      <label className="block text-xs font-medium text-zinc-400">
        Email
        <input
          type="email"
          name="email"
          required
          disabled={loading}
          className="mt-1 w-full rounded-lg border border-halix-line bg-halix-deep px-3 py-2 text-sm text-white outline-none ring-halix-accent/30 focus:ring-2 disabled:opacity-50"
          placeholder="you@halix.cloud"
          autoComplete="email"
        />
      </label>
      <label className="block text-xs font-medium text-zinc-400">
        Password
        <input
          type="password"
          name="password"
          required
          minLength={8}
          disabled={loading}
          className="mt-1 w-full rounded-lg border border-halix-line bg-halix-deep px-3 py-2 text-sm text-white outline-none ring-halix-accent/30 focus:ring-2 disabled:opacity-50"
          autoComplete="current-password"
        />
      </label>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
