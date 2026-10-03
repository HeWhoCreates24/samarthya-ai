import React from 'react';
import { Mic, Paperclip, Send, ArrowRight } from 'lucide-react';
import { COPILOT_SCENARIOS } from '../../data/mockGovernanceData';

interface CommandBarProps {
  currentQuery: string;
  onQueryChange: (q: string) => void;
  onExecuteQuery: (scenarioId?: string) => void;
  isLoading: boolean;
  selectedScenarioId: string;
}

export const CommandBar: React.FC<CommandBarProps> = ({
  currentQuery,
  onQueryChange,
  onExecuteQuery,
  isLoading,
  selectedScenarioId,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuery.trim() || isLoading) return;
    onExecuteQuery();
  };

  const presetLabels = [
    '#1 Farm-Asset Overlap (MoA&FW vs MoRD)',
    '#2 PMGSY Roads vs Cold-Chain Gaps',
    '#3 Welfare Disbursement (PM-KISAN DBT)',
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      {/* 1. Sleek Frosted Glass Capsule Command Bar (Matching Image 1) */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="glass-input rounded-full px-5 py-3.5 flex items-center gap-3 shadow-2xl transition-all focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-400/50">
          <input
            type="text"
            value={currentQuery}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Ask Samarthya anything across 54 ministries..."
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-400 text-sm focus:outline-none font-sans"
          />

          <div className="flex items-center gap-2 text-slate-400">
            <button
              type="button"
              title="Voice Input"
              className="p-1.5 rounded-full hover:text-slate-200 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              type="button"
              title="Attach Registry / Schema"
              className="p-1.5 rounded-full hover:text-slate-200 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="submit"
              disabled={isLoading || !currentQuery.trim()}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-md shadow-blue-500/30 cursor-pointer ml-1"
            >
              <Send className="w-3.5 h-3.5 -translate-y-px translate-x-px" />
            </button>
          </div>
        </div>
      </form>

      {/* 2. Quick Clickable Scenario Presets (Clean Centered Wrap, No Text Truncation / Clipping) */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
        {COPILOT_SCENARIOS.map((sc, index) => {
          const isSelected = selectedScenarioId === sc.id;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => {
                onQueryChange(sc.query);
                onExecuteQuery(sc.id);
              }}
              className={`px-3 py-1 rounded-full text-[11px] transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-blue-600/25 border border-blue-400/50 text-blue-200 shadow-md shadow-blue-500/10'
                  : 'glass-pill text-slate-300 hover:text-white hover:border-white/20'
              }`}
            >
              <span>{presetLabels[index] || sc.query}</span>
              <ArrowRight className="w-3 h-3 opacity-60" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
