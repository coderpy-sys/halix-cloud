'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const faqs = [
  {
    q: 'What is Halix Cloud?',
    a: 'A Proxmox-backed VPS platform with IPAM, billing-ready schema, and realtime panels.',
  },
  {
    q: 'Where are servers located?',
    a: 'You define regions on nodes; DNS and Cloudflare integrations sit in the edge layer.',
  },
  {
    q: 'Payment methods?',
    a: 'Stripe, PayPal, and crypto adapters share the same invoice + ledger tables.',
  },
];

const cats = ['All', 'General', 'Billing', 'Technical', 'Support'];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  const [cat, setCat] = useState(0);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">FAQ</h1>
      <p className="mt-1 text-sm text-zinc-500">Self-serve answers — accordion UI.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {cats.map((c, i) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(i)}
            className={cn(
              'rounded-full px-4 py-1.5 text-xs font-medium transition',
              cat === i
                ? 'bg-gradient-to-r from-halix-core to-halix-accent text-white'
                : 'border border-white/10 text-zinc-400 hover:border-halix-accent/40',
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <ul className="mt-8 space-y-3">
        {faqs.map((f, i) => (
          <li
            key={f.q}
            className="overflow-hidden rounded-2xl border border-white/10 bg-halix-card/40 backdrop-blur"
          >
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-white"
            >
              {f.q}
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 text-halix-accent transition',
                  open === i && 'rotate-180',
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/5 px-5 text-sm leading-relaxed text-zinc-400"
                >
                  <div className="py-3">{f.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>
      <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
        <p className="text-sm text-zinc-400">Can&apos;t find what you need?</p>
        <Link
          href="/panel/support/tickets/new"
          className="mt-3 inline-flex rounded-xl bg-gradient-to-r from-halix-core to-halix-accent px-5 py-2 text-sm font-medium text-white shadow-halix"
        >
          Create a support ticket
        </Link>
      </div>
    </div>
  );
}
