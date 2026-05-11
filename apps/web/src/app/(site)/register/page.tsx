import Link from 'next/link';
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-20">
      <div>
        <h1 className="text-2xl font-bold text-white">Create account</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Password must be at least 12 characters. API:{' '}
          <code className="text-halix-accent">POST /v1/auth/register</code>
        </p>
      </div>
      <RegisterForm />
      <p className="text-center text-xs text-zinc-500">
        Already have an account?{' '}
        <Link href="/login" className="text-halix-accent hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
