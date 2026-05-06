import { Check, Cog } from "lucide-react";

const actions = [
  { text: "Slack alert sent to Operations Team", meta: "ops-channel · 12s ago" },
  { text: "Backup supplier contacted (BWA-04)", meta: "API · 27s ago" },
  { text: "Inventory threshold adjusted (+12d)", meta: "ERP write · 41s ago" },
  { text: "Pricing simulation initiated", meta: "Sim runtime · 58s ago" },
  { text: "Risk profile updated for Tier-2 vendors", meta: "GRC sync · 1m ago" },
];

export function AutonomousActions() {
  return (
    <section className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Cog className="h-4 w-4 text-signal-emerald" />
          <h2 className="text-sm font-semibold tracking-wide">AUTONOMOUS EXECUTION</h2>
        </div>
        <span className="mono text-[10px] text-signal-emerald">5 / 5 SUCCESS</span>
      </div>
      <ul className="space-y-2.5">
        {actions.map((a, i) => (
          <li key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-border bg-background/30 animate-fade-in-up" style={{ animationDelay: `${i * 0.06}s` }}>
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full" style={{ background: "color-mix(in oklab, var(--signal-emerald) 18%, transparent)", color: "var(--signal-emerald)" }}>
              <Check className="h-3.5 w-3.5" />
            </span>
            <span className="text-sm flex-1">{a.text}</span>
            <span className="mono text-[10px] text-muted-foreground">{a.meta}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}