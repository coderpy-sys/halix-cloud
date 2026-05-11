import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-white">Documentation</h1>
      <p className="mt-2 text-zinc-400">
        OpenAPI is served from the API at{' '}
        <Link href="http://localhost:4000/docs" className="text-halix-accent underline">
          /docs
        </Link>{' '}
        in development.
      </p>
      <ol className="mt-8 list-decimal space-y-3 pl-5 text-sm text-zinc-300">
        <li>Architecture — see repo <code className="text-zinc-500">docs/ARCHITECTURE.md</code></li>
        <li>Authentication — JWT bearer + API keys (planned)</li>
        <li>VPS lifecycle — provision, power, reinstall queues</li>
        <li>IPAM — pools, ranges, assignments</li>
      </ol>
    </div>
  );
}
