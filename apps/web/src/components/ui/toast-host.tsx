'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useToastStore } from '@/stores/toast';
import { cn } from '@/lib/utils';

export function ToastHost() {
  const { items, dismiss } = useToastStore();

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 p-0 sm:p-0">
      <AnimatePresence mode="popLayout">
        {items.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 12 }}
            className={cn(
              'pointer-events-auto rounded-xl border px-4 py-3 shadow-card backdrop-blur-xl',
              t.tone === 'success' &&
                'border-emerald-500/30 bg-emerald-950/80 text-emerald-50',
              t.tone === 'error' && 'border-red-500/35 bg-red-950/85 text-red-50',
              t.tone === 'default' &&
                'border-white/10 bg-halix-card/95 text-zinc-100',
            )}
          >
            <div className="flex gap-2">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{t.title}</div>
                {t.message ? (
                  <div className="mt-0.5 text-xs opacity-90">{t.message}</div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="shrink-0 rounded-md p-1 opacity-60 hover:bg-white/10 hover:opacity-100"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
