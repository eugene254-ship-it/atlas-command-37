import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StatusBar } from "@/components/atlas/StatusBar";
import { Hero } from "@/components/atlas/Hero";
import { IntelligenceFeed } from "@/components/atlas/IntelligenceFeed";
import { AgentNetwork } from "@/components/atlas/AgentNetwork";
import { ReasoningStream } from "@/components/atlas/ReasoningStream";
import { AutonomousActions } from "@/components/atlas/AutonomousActions";
import { ImpactMetrics } from "@/components/atlas/ImpactMetrics";
import { OperationsMap } from "@/components/atlas/OperationsMap";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [clock, setClock] = useState("");
  useEffect(() => {
    const tick = () => setClock(new Date().toISOString().slice(11, 19));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <main className="min-h-screen px-4 md:px-8 py-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md ring-glow grid place-items-center" style={{ background: "var(--gradient-cyan)" }}>
            <span className="mono text-[11px] font-bold text-primary-foreground">A</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide">ATLAS SANCTUM</div>
            <div className="mono text-[10px] text-muted-foreground">AUTONOMOUS ENTERPRISE COMMAND</div>
          </div>
        </div>
        <div className="mono text-[10px] text-muted-foreground hidden md:block">
          NODE-NBO-01 · v1.0 · UTC {clock}
        </div>
      </div>

      <Hero />

      <div className="mt-4">
        <StatusBar />
      </div>

      <div className="mt-6 grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <IntelligenceFeed />
          <AgentNetwork />
        </div>
        <div className="col-span-12 lg:col-span-5 space-y-4">
          <ReasoningStream />
          <AutonomousActions />
        </div>
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <ImpactMetrics />
          <OperationsMap />
        </div>
      </div>

      <footer className="mt-8 mb-4 mono text-[10px] text-muted-foreground flex flex-wrap justify-between gap-2">
        <span>© ATLAS SANCTUM · CLASSIFIED OPERATIONS</span>
        <span>SECURE LINK · TLS 1.3 · END-TO-END</span>
      </footer>
    </main>
  );
}
