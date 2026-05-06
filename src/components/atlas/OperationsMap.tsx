import { MapPin } from "lucide-react";

const hotspots = [
  { x: 54, y: 52, label: "Nairobi", sev: "var(--signal-cyan)" },
  { x: 56, y: 50, label: "Mombasa", sev: "var(--signal-red)" },
  { x: 58, y: 44, label: "Djibouti", sev: "var(--signal-emerald)" },
  { x: 50, y: 60, label: "Dar es Salaam", sev: "var(--signal-amber)" },
  { x: 46, y: 70, label: "Lusaka", sev: "var(--signal-cyan)" },
  { x: 48, y: 80, label: "Johannesburg", sev: "var(--signal-emerald)" },
  { x: 42, y: 38, label: "Lagos", sev: "var(--signal-amber)" },
];

export function OperationsMap() {
  return (
    <section className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-signal-cyan" />
          <h2 className="text-sm font-semibold tracking-wide">OPERATIONAL INTELLIGENCE MAP</h2>
        </div>
        <span className="mono text-[10px] text-muted-foreground">AFRICA · GLOBAL TIER</span>
      </div>

      <div className="relative aspect-[16/9] rounded-xl border border-border overflow-hidden bg-background/40">
        {/* Background grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />
        {/* Stylized continent silhouette */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <radialGradient id="glow" cx="55%" cy="55%" r="50%">
              <stop offset="0%" stopColor="var(--signal-cyan)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect width="100" height="100" fill="url(#glow)" />
          <path d="M40 20 Q55 18 62 28 T70 50 Q72 62 60 78 Q50 92 42 88 Q30 80 32 65 Q24 55 30 42 Q34 28 40 20 Z"
            fill="color-mix(in oklab, var(--signal-cyan) 8%, transparent)"
            stroke="color-mix(in oklab, var(--signal-cyan) 50%, transparent)"
            strokeWidth="0.4" />
          {/* Routes */}
          {hotspots.slice(1).map((h, i) => (
            <line key={i} x1={54} y1={52} x2={h.x} y2={h.y}
              stroke="color-mix(in oklab, var(--signal-cyan) 40%, transparent)"
              strokeWidth="0.3" strokeDasharray="1 1.5" />
          ))}
        </svg>

        {/* Hotspots */}
        {hotspots.map((h) => (
          <div key={h.label} className="absolute -translate-x-1/2 -translate-y-1/2 group" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
            <span className="relative inline-flex">
              <span className="absolute inset-0 rounded-full animate-ping opacity-60" style={{ background: h.sev }} />
              <span className="relative h-2 w-2 rounded-full" style={{ background: h.sev, boxShadow: `0 0 12px ${h.sev}` }} />
            </span>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 mono text-[9px] tracking-widest text-muted-foreground group-hover:text-foreground whitespace-nowrap">
              {h.label.toUpperCase()}
            </span>
          </div>
        ))}

        {/* Scanline */}
        <div className="absolute inset-0 pointer-events-none animate-scan" style={{ background: "linear-gradient(180deg, transparent, color-mix(in oklab, var(--signal-cyan) 10%, transparent), transparent)", height: "30%" }} />
      </div>

      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 mono text-[10px] text-muted-foreground">
        <Legend color="var(--signal-cyan)" label="SUPPLY ROUTES" />
        <Legend color="var(--signal-red)" label="RISK HOTSPOTS" />
        <Legend color="var(--signal-amber)" label="LOGISTICS ALERTS" />
        <Legend color="var(--signal-emerald)" label="STABLE NODES" />
      </div>
    </section>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
      {label}
    </div>
  );
}