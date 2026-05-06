import { Activity, Globe2, Radio, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";

export function StatusBar() {
  const [signals, setSignals] = useState(1284);
  const [decisions, setDecisions] = useState(37);
  useEffect(() => {
    const id = setInterval(() => {
      setSignals((s) => s + Math.floor(Math.random() * 3));
      if (Math.random() > 0.85) setDecisions((d) => d + 1);
    }, 1800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="glass rounded-xl px-5 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs mono">
      <Dot color="signal-emerald" /> <span className="text-muted-foreground">SYSTEM</span> <span className="text-foreground">ACTIVE</span>
      <span className="h-3 w-px bg-border" />
      <Dot color="signal-cyan" /> <span className="text-muted-foreground">AGENTS</span> <span className="text-foreground">12 ONLINE</span>
      <span className="h-3 w-px bg-border" />
      <Dot color="signal-amber" /> <span className="text-muted-foreground">RISK</span> <span className="text-signal-amber">MEDIUM</span>
      <span className="h-3 w-px bg-border" />
      <Globe2 className="h-3.5 w-3.5 text-muted-foreground" /> <span>NAIROBI · 01°17'S 36°49'E</span>
      <span className="h-3 w-px bg-border" />
      <Radio className="h-3.5 w-3.5 text-signal-cyan" /> <span className="text-muted-foreground">SIGNALS</span> <span className="text-foreground tabular-nums">{signals.toLocaleString()}</span>
      <span className="h-3 w-px bg-border" />
      <Activity className="h-3.5 w-3.5 text-signal-emerald" /> <span className="text-muted-foreground">DECISIONS/24H</span> <span className="text-foreground tabular-nums">{decisions}</span>
      <span className="ml-auto flex items-center gap-2 text-muted-foreground">
        <ShieldAlert className="h-3.5 w-3.5" /> SECURE CHANNEL
      </span>
    </div>
  );
}

function Dot({ color }: { color: "signal-cyan" | "signal-amber" | "signal-emerald" | "signal-red" }) {
  const map = {
    "signal-cyan": "var(--signal-cyan)",
    "signal-amber": "var(--signal-amber)",
    "signal-emerald": "var(--signal-emerald)",
    "signal-red": "var(--signal-red)",
  } as const;
  const c = map[color];
  return (
    <span className="relative inline-flex h-2 w-2">
      <span className="absolute inset-0 rounded-full opacity-60 animate-ping" style={{ background: c }} />
      <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: c }} />
    </span>
  );
}