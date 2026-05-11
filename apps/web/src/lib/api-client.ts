/**
 * Halix API client — patterns inspired by common panel practice (URL base, JSON,
 * bearer auth, readable API errors). Implementation is original; do not mirror
 * third-party panel HTTP modules verbatim.
 */
const defaultBase = () =>
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) ||
  'http://localhost:4000';

export type HalixApiError = Error & {
  status?: number;
  body?: unknown;
};

function messageFromBody(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null;
  const msg = (body as { message?: unknown }).message;
  if (typeof msg === 'string' && msg.trim()) return msg;
  if (Array.isArray(msg)) {
    const parts = msg.filter((x) => typeof x === 'string') as string[];
    if (parts.length) return parts.join(' ');
  }
  const err = (body as { error?: unknown }).error;
  if (typeof err === 'string' && err.trim()) return err;
  return null;
}

/** Best-effort string for any thrown API/network error (NestJS, etc.). */
export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    const he = error as HalixApiError;
    const fromBody = messageFromBody(he.body);
    if (fromBody) return fromBody;
    if (typeof he.message === 'string' && he.message) return he.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return 'Something went wrong';
}

export type HalixFetchOptions = RequestInit & {
  /** Overrides localStorage `halix_access_token` when set (including empty to skip). */
  token?: string | null;
};

export async function halixFetch<T = unknown>(
  path: string,
  init?: HalixFetchOptions,
): Promise<T> {
  const base = defaultBase().replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  const url = path.startsWith('http')
    ? path
    : p.startsWith('/v1')
      ? `${base}${p}`
      : `${base}/v1${p}`;

  const headers = new Headers(init?.headers);
  headers.set('Accept', 'application/json');
  if (
    init?.body &&
    !(init.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }

  let bearer: string | null | undefined = init?.token;
  if (bearer === undefined && typeof window !== 'undefined') {
    bearer = localStorage.getItem('halix_access_token');
  }
  if (bearer) headers.set('Authorization', `Bearer ${bearer}`);

  const res = await fetch(url, { ...init, headers });
  const text = await res.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      body = { message: text.slice(0, 500) };
    }
  }

  if (!res.ok) {
    const err = new Error() as HalixApiError;
    err.body = body;
    err.status = res.status;
    err.message = getErrorMessage(err);
    throw err;
  }

  return body as T;
}
