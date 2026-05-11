'use client';

import { Activity, Cpu, HardDrive } from 'lucide-react';
/** Overview tab — resource summary (Convoy-style “server overview” slice). */
export default function VmOverviewPage() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {[
        {
          title: 'Compute',
          icon: Cpu,
          body: 'Power, reset, and kill map to queued Proxmox jobs with idempotent state.',
        },
        {
          title: 'Console',
          icon: Activity,
          body: 'noVNC / serial / xterm tickets are minted server-side; never ship node tokens to the browser.',
        },
        {
          title: 'Storage',
          icon: HardDrive,
          body:
            'Plan disk is enforced at provision; live usage streams into metrics samples and Recharts panels.',
        },
      ].map((c) => (
        <div
          key={c.title}
          className="rounded-2xl border border-white/10 bg-halix-card/40 p-5 backdrop-blur"
        >
          <c.icon className="h-6 w-6 text-halix-accent" />
          <h2 className="mt-3 text-sm font-semibold text-white">{c.title}</h2>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500">{c.body}</p>
        </div>
      ))}
    </div>
  );
}
