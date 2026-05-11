export default function VmConsolePage() {
  return (
    <div className="rounded-2xl border border-white/10 bg-halix-deep/60 p-6 backdrop-blur">
      <h2 className="text-sm font-semibold text-white">Console</h2>
      <p className="mt-2 text-sm text-zinc-500">
        Integrate noVNC or xterm here; Convoy-style flow: request a one-time ticket from
        the API, open WebSocket to your console proxy, tear down on exit.
      </p>
      <div className="mt-6 flex min-h-[320px] items-center justify-center rounded-xl border border-dashed border-white/15 bg-black/30 text-xs text-zinc-600">
        Console mount point
      </div>
    </div>
  );
}
