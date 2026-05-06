import { Brain } from "lucide-react";
import { useEffect, useState } from "react";

const lines = [
  { agent: "SENTINEL", text: "Detected abnormal shipping delays at Mombasa port (14h variance vs. 30-day baseline)." },
  { agent: "REASONER", text: "Simulating supply chain impact across 3 corridors and 47 SKUs..." },
  { agent: "REASONER", text: "Estimated margin reduction: 11.2% over a 14-day horizon." },
  { agent: "STRATEGIST", text: "Evaluating alternatives across supplier graph (n=124)..." },
  { agent: "STRATEGIST", text: "Recommended action: switch supplier (Tier-1 BWA), reduce transport exposure, increase regional inventory." },
  { agent: "ORCHESTRATOR", text: "Awaiting policy gate · auto-approve threshold met · executing." },
];

const agentColor: Record<string, string> = {
  SENTINEL: "var(--signal-cyan)",
  REASONER: "var(--signal-violet)",
  STRATEGIST: "var(--signal-amber)",
  ORCHESTRATOR: "var(--signal-emerald)",
};

export function ReasoningStream() {
  const [shown, setShown] = useState(1);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const current = lines[shown - 1];
    if (!current) return;
    setTyped("");
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setTyped(current.text.slice(0, i));
      if (i >= current.text.length) {
        clearInterval(id);
        setTimeout(() => setShown((s) => (s >= lines.length ? 1 : s + 1)), 1400);
      }
    }, 22);
    return () => clearInterval(id);
  }, [shown]);

  return (
    <section className="glass-strong rounded-2xl p-5 relative overflow-hidden ring-glow">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal-cyan to-transparent opacity-60" />
      <div className="absolute left-0 right-0 h-24 pointer-events-none animate-scan" style={{ background: "linear-gradient(180deg, transparent, color-mix(in oklab, var(--signal-cyan) 12%, transparent), transparent)" }} />
      <div className="flex items-center justify-between mb-4 relative">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-signal-cyan" />
          <h2 className="text-sm font-semibold tracking-wide">AGENT REASONING STREAM</h2>
        </div>
        <span className="mono text-[10px] text-muted-foreground">CHAIN-OF-THOUGHT · LIVE</span>
      </div>

      <ol className="space-y-3 relative">
        {lines.slice(0, shown).map((l, i) => {
          const isLast = i === shown - 1;
          return (
            <li key={i} className="animate-fade-in-up flex gap-3">
              <span className="mono text-[10px] mt-1 px-1.5 py-0.5 rounded border border-border whitespace-nowrap" style={{ color: agentColor[l.agent], borderColor: `color-mix(in oklab, ${agentColor[l.agent]} 40%, transparent)` }}>
                {l.agent}
              </span>
              <p className="text-sm leading-relaxed text-foreground/90">
                {isLast ? typed : l.text}
                {isLast && <span className="inline-block w-1.5 h-4 align-middle bg-signal-cyan ml-1 animate-blink" />}
              </p>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 rounded-xl border border-border p-4 bg-background/40">
        <div className="mono text-[10px] tracking-widest text-signal-cyan mb-2">RECOMMENDED ACTION</div>
        <ul className="text-sm space-y-1.5">
          <li className="flex gap-2"><span className="text-signal-cyan">›</span> Switch primary supplier to Tier-1 BWA-04</li>
          <li className="flex gap-2"><span className="text-signal-cyan">›</span> Reduce transport exposure on Mombasa corridor by 38%</li>
          <li className="flex gap-2"><span className="text-signal-cyan">›</span> Increase regional inventory buffer +12 days</li>
        </ul>
      </div>
    </section>
  );
}