export default function OrderServicesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Order services</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Select a category and plan — inventory comes from Proxmox templates + plan SKUs.
      </p>
      <div className="mt-10 rounded-2xl border border-dashed border-white/15 bg-halix-card/30 p-16 text-center text-sm text-zinc-500">
        No services available in this category (connect API + template sync).
      </div>
    </div>
  );
}
