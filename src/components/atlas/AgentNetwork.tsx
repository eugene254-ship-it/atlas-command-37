import { Brain, Compass, Eye, Network, Workflow } from "lucide-react";

const agents = [
  { name: "Sentinel", status: "SCANNING", icon: Eye, color: "var(--signal-cyan)" },
  { name: "Reasoner", status: "ANALYZING", icon: Brain, color: "var(--signal-violet)" },
  { name: "Strategist", status: "PLANNING", icon: Compass, color: "var(--signal-amber)" },
  { name: "Operator", status: "EXECUTING", icon: Workflow, color: "var(--signal-emerald)" },
  { name: "Orchestrator", status: "COORDINATING", icon: Network, color: "var(--signal-cyan)" },
];

export function AgentNetwork() {
  return (
    <section className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold tracking-wide">ACTIVE AGENTS</h2>
        <span className="mono text-[10px] text-muted-foreground">5 / 12 PRIMARY</span>
      </div>
      <ul className="space-y-3">
        {agents.map((a) => (
          <li key={a.name} className="flex items-center gap-3 group">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border" style={{ background: `color-mix(in oklab, ${a.color} 12%, transparent)` }}>
              <a.icon className="h-4 w-4" style={{ color: a.color }} />
              <span className="absolute inset-0 rounded-full animate-pulse-ring" style={{ ["--signal-cyan-glow" as string]: `color-mix(in oklab, ${a.color} 60%, transparent)` }} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{a.name} Agent</div>
              <div className="mono text-[10px] text-muted-foreground tracking-widest">
                <span className="inline-block h-1.5 w-1.5 rounded-full mr-1.5 align-middle animate-blink" style={{ background: a.color }} />
                {a.status}
              </div>
            </div>
            <div className="hidden sm:flex items-end gap-0.5 h-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="w-0.5 rounded-sm animate-float" style={{ height: `${20 + ((i * 13) % 80)}%`, background: a.color, opacity: 0.7, animationDelay: `${i * 0.12}s` }} />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}