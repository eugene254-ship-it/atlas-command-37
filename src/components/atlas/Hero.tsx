export function Hero() {
  return (
    <header className="relative overflow-hidden rounded-2xl glass-strong px-6 py-8 md:px-10 md:py-12">
      <div className="absolute inset-0 pointer-events-none opacity-40" style={{ background: "radial-gradient(60% 100% at 20% 0%, var(--signal-cyan-glow), transparent 60%)" }} />
      <div className="relative flex flex-col gap-4">
        <div className="flex items-center gap-3 mono text-[10px] tracking-[0.3em] text-muted-foreground">
          <span className="inline-block h-px w-8 bg-signal-cyan" />
          CLASSIFIED · OPERATIONS LIVE
        </div>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
          ATLAS <span className="text-glow text-signal-cyan">SANCTUM</span>
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
          Autonomous Intelligence for Enterprise Decision Systems.
          <span className="block text-foreground/80 mt-1 italic">"From Signals to Autonomous Action."</span>
        </p>
        <div className="flex flex-wrap gap-2 mono text-[10px] tracking-widest text-muted-foreground">
          <span className="px-2 py-1 rounded border border-border">MULTI-AGENT</span>
          <span className="px-2 py-1 rounded border border-border">REAL-TIME REASONING</span>
          <span className="px-2 py-1 rounded border border-border">AUTONOMOUS EXECUTION</span>
          <span className="px-2 py-1 rounded border border-border">GEO INTELLIGENCE</span>
        </div>
      </div>
    </header>
  );
}