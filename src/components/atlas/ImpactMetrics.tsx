import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

function useCount(target: number, duration = 1200) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setV(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

export function ImpactMetrics() {
  const cost = useCount(124000);
  const risk = useCount(37);
  const time = useCount(64);
  const decisions = useCount(37);

  const items = [
    { label: "Cost Savings Identified", value: `$${cost.toLocaleString()}`, color: "var(--signal-emerald)" },
    { label: "Risk Reduction Score", value: `+${risk}%`, color: "var(--signal-cyan)" },
    { label: "Operational Response Time", value: `−${time}%`, color: "var(--signal-violet)" },
    { label: "Autonomous Decisions Today", value: `${decisions}`, color: "var(--signal-amber)" },
  ];

  return (
    <section className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-signal-emerald" />
          <h2 className="text-sm font-semibold tracking-wide">ENTERPRISE IMPACT</h2>
        </div>
        <span className="mono text-[10px] text-muted-foreground">ROLLING 24H</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map((m) => (
          <div key={m.label} className="rounded-xl border border-border p-4 bg-background/30 relative overflow-hidden">
            <div className="absolute -inset-px opacity-20 pointer-events-none" style={{ background: `radial-gradient(60% 80% at 100% 0%, ${m.color}, transparent 60%)` }} />
            <div className="text-2xl md:text-3xl font-semibold tabular-nums tracking-tight" style={{ color: m.color }}>
              {m.value}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{m.label}</div>
            <Spark color={m.color} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Spark({ color }: { color: string }) {
  const pts = Array.from({ length: 16 }).map((_, i) => {
    const y = 18 - (Math.sin(i * 0.7) * 6 + ((i * 53) % 7));
    return `${i * 6},${Math.max(2, Math.min(22, y))}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 96 24" className="mt-3 w-full h-6" fill="none">
      <polyline points={pts} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}