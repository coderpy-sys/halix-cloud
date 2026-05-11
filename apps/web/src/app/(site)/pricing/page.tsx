import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const tiers = [
  {
    name: 'Edge',
    price: '$8',
    spec: '2 vCPU · 4 GB RAM · 80 GB NVMe',
    highlight: false,
  },
  {
    name: 'Core',
    price: '$18',
    spec: '4 vCPU · 8 GB RAM · 160 GB NVMe',
    highlight: true,
  },
  {
    name: 'Neural',
    price: '$42',
    spec: '8 vCPU · 16 GB RAM · 320 GB NVMe',
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-bold text-white">Pricing</h1>
      <p className="mt-2 max-w-xl text-zinc-400">
        Transparent VPS tiers. Final SKUs wire to your Stripe catalog and Proxmox
        templates.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={cn(
              'flex flex-col rounded-2xl border p-6 backdrop-blur transition hover:shadow-halix',
              t.highlight
                ? 'border-halix-accent/50 bg-gradient-to-b from-halix-core/20 to-halix-card/60'
                : 'border-white/10 bg-white/[0.03]',
            )}
          >
            <div className="text-sm font-medium text-halix-accent">{t.name}</div>
            <div className="mt-4 text-4xl font-bold text-white">
              {t.price}
              <span className="text-base font-normal text-zinc-500">/mo</span>
            </div>
            <p className="mt-4 text-sm text-zinc-400">{t.spec}</p>
            <Link
              href="/register"
              className={cn(
                buttonVariants({
                  variant: t.highlight ? 'primary' : 'secondary',
                  className: 'mt-8 w-full',
                }),
              )}
            >
              Choose {t.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
