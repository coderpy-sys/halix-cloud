export default function VmNetworkPage() {
  return (
    <div className="rounded-2xl border border-white/10 bg-halix-card/40 p-6 backdrop-blur">
      <h2 className="text-sm font-semibold text-white">Network</h2>
      <p className="mt-2 text-sm text-zinc-500">
        IPv4/IPv6 assignments, rDNS, floating IPs, and firewall rows — sourced from IPAM
        models and synced to Proxmox NIC definitions.
      </p>
    </div>
  );
}
