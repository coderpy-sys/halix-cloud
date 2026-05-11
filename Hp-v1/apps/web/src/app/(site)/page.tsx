'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Globe, Shield, Zap } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const features = [
  {
    title: 'Proxmox-native',
    body: 'QEMU and LXC lifecycle, snapshots, migration hooks, and storage-aware jobs.',
    icon: Cpu,
  },
  {
    title: 'IP intelligence',
    body: 'IPv4 pools, IPv6 /64 and routed modes, rDNS, floating IPs, and abuse flags.',
    icon: Globe,
  },
  {
    title: 'Realtime',
    body: 'Socket.IO graphs and ticket updates with JWT-scoped rooms per user and VM.',
    icon: Zap,
  },
  {
    title: 'Enterprise RBAC',
    body: 'JWT + API keys, audit trails, 2FA hooks, and encrypted node credentials.',
    icon: Shield,
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-halix-accent">
          Next-gen VPS platform
        </p>
        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-6xl sm:leading-[1.08]">
          Cloud compute that feels{' '}
          <span className="bg-gradient-to-r from-halix-glow via-white to-halix-accent bg-clip-text text-transparent">
            fast, dark, and alive
          </span>
          .
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
          Halix Cloud unifies Proxmox power with a premium panel: provision, reinstall,
          graph everything, and stay billing-ready — without the legacy clutter.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/register" className={cn(buttonVariants({ size: 'lg' }))}>
            Launch panel
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/panel/dashboard"
            className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }))}
          >
            Live demo UI
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { k: 'Nodes', v: 'Multi-region' },
          { k: 'API', v: 'REST + WS' },
          { k: 'Stack', v: 'NestJS · Next.js' },
          { k: 'Data', v: 'PostgreSQL' },
        ].map((s, i) => (
          <div
            key={s.k}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left shadow-card backdrop-blur"
          >
            <div className="text-xs uppercase tracking-wider text-zinc-500">
              {s.k}
            </div>
            <div className="mt-1 text-lg font-semibold text-white">{s.v}</div>
            <motion.div
              className="mt-3 h-1 rounded-full bg-gradient-to-r from-halix-core/40 to-halix-accent/80"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
              style={{ originX: 0 }}
            />
          </div>
        ))}
      </motion.div>

      <section className="mt-28">
        <h2 className="text-center text-2xl font-semibold text-white">
          Built for operators who ship
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-500">
          Inspired by modern hosting dashboards — reimagined with Halix purple glass,
          motion, and API-first workflows.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group rounded-2xl border border-white/10 bg-halix-card/40 p-6 shadow-card backdrop-blur transition hover:border-halix-accent/30 hover:shadow-halix"
            >
              <f.icon className="h-8 w-8 text-halix-accent transition group-hover:scale-105" />
              <h3 className="mt-4 text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
