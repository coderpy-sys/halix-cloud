import { VmShell } from '@/components/panel/vm-shell';

export default async function VmLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <VmShell vmId={id}>{children}</VmShell>;
}
