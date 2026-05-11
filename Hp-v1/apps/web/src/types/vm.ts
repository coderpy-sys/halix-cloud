/** Subset of `GET /v1/vms` response — evolves with Prisma JSON. */

export type VmListItem = {
  id: string;
  name: string;
  hostname: string | null;
  status: string;
  type: string;
  cpuCores: number;
  ramMb: number;
  diskGb: number;
  proxmoxVmid: number;
  node?: { id: string; name: string; region: string | null };
};
