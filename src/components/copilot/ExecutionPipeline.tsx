import React, { useState } from 'react';
import {
  Code2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Cpu,
} from 'lucide-react';
import type { CopilotScenario } from '../../types/governance';

interface ExecutionPipelineProps {
  scenario: CopilotScenario;
  isStreaming: boolean;
  activeStepIndex: number;
}

export const ExecutionPipeline: React.FC<ExecutionPipelineProps> = ({
  scenario,
  isStreaming,
  activeStepIndex,
}) => {
  const [isCypherExpanded, setIsCypherExpanded] = useState(false);
  const [copiedCypher, setCopiedCypher] = useState(false);

  const handleCopyCypher = () => {
    navigator.clipboard.writeText(scenario.cypherQuery);
    setCopiedCypher(true);
    setTimeout(() => setCopiedCypher(false), 2000);
  };

  const steps = [
    { title: 'NLQ Parsing', shortTitle: 'NLQ Parsing', color: 'from-slate-300 via-slate-400 to-slate-600', ringColor: 'rgba(148, 163, 184, 0.4)' },
    { title: 'LGD Entity Resolution', shortTitle: 'LGD Entity', color: 'from-slate-200 via-slate-400 to-slate-600', ringColor: 'rgba(203, 213, 225, 0.4)' },
    { title: 'Cypher Generation', shortTitle: 'Cypher AST', color: 'from-indigo-300 via-indigo-500 to-slate-700', ringColor: 'rgba(99, 102, 241, 0.4)' },
    { title: 'Deterministic Verifier', shortTitle: 'Verifier', color: 'from-blue-300 via-cyan-400 to-blue-600', ringColor: 'rgba(56, 189, 248, 0.6)', glow: true },
    { title: 'Merkle Proof', shortTitle: 'Merkle Proof', color: 'from-emerald-300 via-emerald-400 to-teal-600', ringColor: 'rgba(52, 211, 153, 0.6)', glow: true },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-2 sm:py-4 space-y-3.5 sm:space-y-4">
      {/* Horizontal Track with 5 Metallic Spherical Nodes (Image 1) */}
      <div className="w-full overflow-x-auto no-scrollbar py-2">
        <div className="relative flex items-center justify-between px-2 sm:px-6 py-4 w-full min-w-0">
          {/* Connecting Track Line running exactly through the center of spheres (top-[30px]) */}
          <div className="absolute left-6 right-6 sm:left-12 sm:right-12 top-[30px] -translate-y-1/2 h-[2px] bg-gradient-to-r from-slate-700 via-slate-600 to-emerald-500/60 z-0" />

          {steps.map((s, idx) => {
            const isDone = !isStreaming || idx <= activeStepIndex;
            const isCurrent = isStreaming && idx === activeStepIndex;

            return (
              <div key={idx} className="relative z-10 flex flex-col items-center group flex-1 px-1">
                {/* Metallic Sphere Node */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-b ${s.color} border border-white/50 shadow-md transition-all duration-300 flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'scale-125 ring-4 ring-blue-400/40 shadow-blue-500/50'
                      : isDone
                      ? 'ring-2 ring-white/30'
                      : 'opacity-40 grayscale'
                  }`}
                  style={{
                    boxShadow: isDone && s.glow ? `0 0 16px ${s.ringColor}` : undefined,
                  }}
                >
                  {/* Specular gleam highlight on metallic sphere */}
                  <div className="w-2 h-1 rounded-full bg-white/80 -translate-y-1.5 -translate-x-0.5" />
                </div>

                {/* Step Label */}
                <span
                  className={`mt-2 text-[10px] sm:text-xs font-sans tracking-tight text-center transition-colors leading-tight ${
                    isCurrent
                      ? 'text-blue-300 font-semibold'
                      : isDone
                      ? 'text-slate-200 font-medium'
                      : 'text-slate-400'
                  }`}
                >
                  <span className="hidden sm:inline">{s.title}</span>
                  <span className="sm:hidden">{s.shortTitle}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subtle Cypher Plan Accordion Toggle */}
      <div className="flex justify-center pt-1">
        <button
          type="button"
          onClick={() => setIsCypherExpanded(!isCypherExpanded)}
          className="glass-pill px-3.5 py-1.5 rounded-full text-[11px] text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
        >
          <Code2 className="w-3.5 h-3.5 text-blue-400" />
          <span>{isCypherExpanded ? 'Hide Cypher Plan' : 'Inspect Generated Cypher Plan'}</span>
          {isCypherExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Expandable Cypher Plan Code Box */}
      {isCypherExpanded && (
        <div className="mt-3 glass-panel p-4 rounded-2xl max-w-3xl mx-auto space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              Deterministic Cypher AST (Neo4j Schema Anchored)
            </span>
            <button
              onClick={handleCopyCypher}
              className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedCypher ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedCypher ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="p-3 rounded-xl bg-slate-950/80 border border-white/5 font-mono text-[11px] text-cyan-300 overflow-x-auto leading-relaxed">
            {scenario.cypherQuery}
          </pre>
        </div>
      )}
    </div>
  );
};
