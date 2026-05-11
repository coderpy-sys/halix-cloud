import Link from 'next/link';

export default function KnowledgebasePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-white">Knowledge base</h1>
      <p className="mt-2 text-zinc-400">
        Host articles from CMS or markdown in-repo; search indexes to OpenSearch later.
      </p>
      <ul className="mt-8 space-y-2 text-sm">
        <li>
          <Link href="/docs" className="text-halix-accent hover:underline">
            API & architecture docs
          </Link>
        </li>
        <li className="text-zinc-500">Getting started with your first VPS (draft)</li>
        <li className="text-zinc-500">IPv6 routed subnets (draft)</li>
      </ul>
    </div>
  );
}
