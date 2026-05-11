'use client';

import { motion } from 'framer-motion';
import {
  Cpu,
  Globe,
  Server,
  Shield,
  Ticket,
  Wallet,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';

const spark = Array.from({ length: 12 }).map((_, i) => ({
  t: i,
  v: 20 + Math.sin(i / 2) * 15 + i * 2,
}));

const cards = [
  { title: 'Active services', value: '0', icon: Server },
  { title: 'Open tickets', value: '0', icon: Ticket },
  { title: 'Credits', value: '$0.00', icon: Wallet },
  { title: 'Support PIN', value: '••••••••', icon: Shield },
];

export default function DashboardPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Here&apos;s an overview of your account — wired to NestJS + Socket.IO.
        </p>
      </motion.div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2 }}
            className="rounded-2xl border border-white/10 bg-halix-card/50 p-5 shadow-card backdrop-blur transition hover:border-halix-accent/25"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  {c.title}
                </div>
                <div className="mt-2 text-2xl font-semibold text-white">
                  {c.value}
                </div>
              </div>
              <div className="rounded-lg bg-halix-core/30 p-2 text-halix-accent">
                <c.icon className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-white/10 bg-halix-card/40 p-6 backdrop-blur lg:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Node load (demo)</h2>
              <p className="text-xs text-zinc-500">Recharts + live samples from workers</p>
            </div>
            <Cpu className="h-5 w-5 text-halix-accent" />
          </div>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spark}>
                <defs>
                  <linearGradient id="cpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" hide />
                <Tooltip
                  contentStyle={{
                    background: '#16161f',
                    border: '1px solid #252532',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="#a78bfa"
                  fill="url(#cpu)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-halix-card/40 p-6 backdrop-blur"
        >
          <h2 className="text-sm font-semibold text-white">Quick actions</h2>
          <div className="mt-4 flex flex-col gap-2">
            {[
              ['Order service', Server],
              ['Create ticket', Ticket],
              ['Add credits', Wallet],
            ].map(([label, Icon]) => (
              <button
                key={label as string}
                type="button"
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left text-sm text-zinc-200 transition hover:border-halix-accent/40 hover:bg-white/[0.05]"
              >
                <Icon className="h-4 w-4 text-halix-accent" />
                {label as string}
              </button>
            ))}
          </div>
        </motion.section>
      </div>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-r from-halix-core/10 to-transparent p-5 backdrop-blur"
      >
        <div className="flex items-start gap-3">
          <Globe className="h-5 w-5 text-halix-glow" />
          <div>
            <h3 className="text-sm font-semibold text-white">IPv4 + IPv6</h3>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">
              IPAM tables support pools, ranges, floating IPs, and abuse flags. Assignments
              stay pinned across reinstall jobs when preserve-ips is set on the queue
              payload.
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
