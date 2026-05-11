import { SiteHeader } from '@/components/site/site-header';
import Link from 'next/link';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-white/5 py-10 text-center text-xs text-zinc-500">
        <p>
          © {new Date().getFullYear()} Halix Cloud ·{' '}
          <Link
            href="https://discord.gg/freehost"
            className="text-halix-accent hover:underline"
          >
            Community
          </Link>{' '}
          ·{' '}
          <Link href="https://halix.cloud" className="hover:underline">
            halix.cloud
          </Link>
        </p>
      </footer>
    </div>
  );
}
