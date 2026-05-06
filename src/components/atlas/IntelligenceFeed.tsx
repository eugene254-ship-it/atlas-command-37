import { ArrowDown, ArrowUp, AlertTriangle, Globe2 } from "lucide-react";

type Severity = "critical" | "warning" | "stable";
type Item = { dir: "up" | "down" | "warn"; text: string; sev: Severity; region: string };

const items: Item[] = [
  { dir: "up", text: "Fuel prices rising — East Africa", sev: "warning", region: "EA" },
  { dir: "warn", text: "Port delays detected — Mombasa", sev: "critical", region: "KE" },
  { dir: "down", text: "Currency volatility — KES/USD", sev: "warning", region: "FX" },
  { dir: "up", text: "Retail demand spike — FMCG sector", sev: "stable", region: "MK" },
  { dir: "warn", text: "Supplier risk increase — Tier 2", sev: "critical", region: "SC" },
  { dir: "up", text: "Container throughput +8.4% — Djibouti", sev: "stable", region: "DJ" },
  { dir: "down", text: "Diesel index −2.1% — SADC corridor", sev: "stable", region: "ZA" },
];

const sevColor: Record<Severity, string> = {
  critical: "var(--signal-red)",
  warning: "var(--signal-amber)",
  stable: "var(--signal-emerald)",
};

export function IntelligenceFeed() {
  return (
    <section className="glass rounded-2xl overflow-hidden">
      <Header />
      <div className="divide-y divide-border">
        {items.map((it, i) => (
          <Row key={i} item={it} />
        ))}
      </div>
      <Ticker />
    </section>
  );
}

function Header() {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-border">
      <div className="flex items-center gap-2">
        <Globe2 className="h-4 w-4 text-signal-cyan" />
        <h2 className="text-sm font-semibold tracking-wide">GLOBAL INTELLIGENCE FEED</h2>
      </div>
      <span className="mono text-[10px] text-muted-foreground">LIVE · 1s</span>
    </div>
  );
}

function Row({ item }: { item: Item }) {
  const Icon = item.dir === "up" ? ArrowUp : item.dir === "down" ? ArrowDown : AlertTriangle;
  return (
    <div className="flex items-center gap-3 px-5 py-3 hover:bg-accent/40 transition">
      <span
        className="inline-flex h-6 w-6 items-center justify-center rounded"
        style={{ background: `color-mix(in oklab, ${sevColor[item.sev]} 18%, transparent)`, color: sevColor[item.sev] }}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="mono text-[10px] text-muted-foreground w-8">{item.region}</span>
      <span className="text-sm flex-1">{item.text}</span>
      <span className="mono text-[10px]" style={{ color: sevColor[item.sev] }}>
        {item.sev.toUpperCase()}
      </span>
    </div>
  );
}

function Ticker() {
  const ticks = "▲ FUEL +3.2%  ·  ⚠ MOMBASA DELAY 14h  ·  ▼ KES/USD −0.8%  ·  ▲ FMCG DEMAND +6.1%  ·  ⚠ TIER-2 SUPPLIER RISK  ·  ▲ DJIBOUTI THRUPUT +8.4%  ·  ";
  return (
    <div className="border-t border-border bg-background/50 overflow-hidden">
      <div className="flex whitespace-nowrap mono text-[10px] tracking-widest text-muted-foreground py-2 animate-ticker">
        <span className="px-4">{ticks.repeat(2)}</span>
        <span className="px-4">{ticks.repeat(2)}</span>
      </div>
    </div>
  );
}