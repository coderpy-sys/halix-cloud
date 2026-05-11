'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { halixFetch, getErrorMessage } from '@/lib/api-client';
import { notifyError, notifySuccess } from '@/stores/toast';

type RegisterResponse = {
  user: { id: string; email: string; role: string };
  accessToken: string;
};

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email') ?? '').trim();
    const password = String(fd.get('password') ?? '');
    const firstName = String(fd.get('firstName') ?? '').trim() || undefined;
    const lastName = String(fd.get('lastName') ?? '').trim() || undefined;
    if (!email || !password) {
      setError('Enter email and password.');
      return;
    }
    if (password.length < 12) {
      setError('Password must be at least 12 characters.');
      return;
    }
    setLoading(true);
    try {
      const body: Record<string, string | undefined> = { email, password };
      if (firstName) body.firstName = firstName;
      if (lastName) body.lastName = lastName;
      const data = await halixFetch<RegisterResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
        token: null,
      });
      if (!data?.accessToken) {
        setError('Invalid response from server.');
        notifyError('Registration failed', 'No access token returned');
        return;
      }
      localStorage.setItem('halix_access_token', data.accessToken);
      notifySuccess('Account created', data.user.email);
      router.push('/panel/dashboard');
      router.refresh();
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      notifyError('Registration failed', msg);
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
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-medium text-zinc-400">
          First name
          <input
            type="text"
            name="firstName"
            disabled={loading}
            className="mt-1 w-full rounded-lg border border-halix-line bg-halix-deep px-3 py-2 text-sm text-white outline-none ring-halix-accent/30 focus:ring-2 disabled:opacity-50"
          />
        </label>
        <label className="block text-xs font-medium text-zinc-400">
          Last name
          <input
            type="text"
            name="lastName"
            disabled={loading}
            className="mt-1 w-full rounded-lg border border-halix-line bg-halix-deep px-3 py-2 text-sm text-white outline-none ring-halix-accent/30 focus:ring-2 disabled:opacity-50"
          />
        </label>
      </div>
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
        Password (min 12)
        <input
          type="password"
          name="password"
          required
          minLength={12}
          disabled={loading}
          className="mt-1 w-full rounded-lg border border-halix-line bg-halix-deep px-3 py-2 text-sm text-white outline-none ring-halix-accent/30 focus:ring-2 disabled:opacity-50"
          autoComplete="new-password"
        />
      </label>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  );
}
