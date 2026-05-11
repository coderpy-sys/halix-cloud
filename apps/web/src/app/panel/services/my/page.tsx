import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { MyServicesList } from '@/components/panel/my-services-list';
import { cn } from '@/lib/utils';

export default function MyServicesPage() {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">My services</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Live list from the API (Convoy-style server index → detail routes).
          </p>
        </div>
        <Link
          href="/panel/services/order"
          className={cn(buttonVariants({ size: 'sm' }))}
        >
          + Order new service
        </Link>
      </div>
      <MyServicesList />
    </div>
  );
}
