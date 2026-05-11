import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-20">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Sign in with your Halix account. API:{' '}
          <code className="text-halix-accent">POST /v1/auth/login</code>
        </p>
      </div>
      <LoginForm />
      <p className="text-center text-xs text-zinc-500">
        New here?{' '}
        <Link href="/register" className="text-halix-accent hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
}
