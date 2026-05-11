'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/**
 * Keeps `?page=` in sync with list views (Convoy-style URL pagination for shareable state).
 */
export function usePagination(paramName = 'page') {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const page = useMemo(() => {
    const raw = Number(searchParams.get(paramName) ?? '1');
    if (!Number.isFinite(raw) || raw < 1) return 1;
    return Math.floor(raw);
  }, [searchParams, paramName]);

  const setPage = useCallback(
    (next: number) => {
      const p = Math.max(1, Math.floor(next));
      const q = new URLSearchParams(searchParams.toString());
      if (p === 1) q.delete(paramName);
      else q.set(paramName, String(p));
      const qs = q.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, router, searchParams, paramName],
  );

  return { page, setPage };
}
