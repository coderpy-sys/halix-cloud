import Link from 'next/link';
import Image from 'next/image';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const links = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/status', label: 'Status' },
  { href: '/kb', label: 'Knowledge base' },
  { href: '/docs', label: 'Docs' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-halix-void/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/halix-mark.svg"
            alt="Halix Cloud"
            width={36}
            height={36}
            priority
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide text-white">
              HALIX CLOUD
            </div>
            <div className="text-[11px] text-halix-mist">VPS control plane</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
          >
            Log in
          </Link>
          <Link href="/register" className={cn(buttonVariants({ size: 'sm' }))}>
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
