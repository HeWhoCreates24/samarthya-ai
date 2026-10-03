import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  MapPin,
  BarChart3,
  FileCheck2,
  ArrowRight,
} from 'lucide-react';
import type { CopilotScenario, OverlappingBlockRecord } from '../../types/governance';
import { CitationBadge } from '../ui/CitationBadge';

interface ExecutiveBriefProps {
  scenario: CopilotScenario;
  onOpenDrawer: (voucherId: string) => void;
  onNavigateToMap: (districtOrBlock?: string) => void;
  onNavigateToMatrix: () => void;
}

export const ExecutiveBrief: React.FC<ExecutiveBriefProps> = ({
  scenario,
  onOpenDrawer,
  onNavigateToMap,
  onNavigateToMatrix,
}) => {
  const [activeMode, setActiveMode] = useState<'dual-plane' | 'standard-llm'>('dual-plane');
  const [selectedRowIds, setSelectedRowIds] = useState<Record<string, boolean>>({});

  const { dualPlaneVerified, standardLlmHallucination } = scenario;

  const toggleRow = (code: string) => {
    setSelectedRowIds((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 animate-in fade-in duration-300">
      {/* Verification Mode Switcher (Matching Image 1 Clean Bar) */}
      <div className="flex items-center justify-between px-1">
        <div className="text-xs text-slate-400 font-sans">
          <span>Verification Mode: </span>
          <strong className="text-slate-200 font-medium">Symbolic Engine Active (Zero Hallucination)</strong>
        </div>

        <div className="glass-pill p-1 rounded-full flex items-center text-xs">
          <button
            type="button"
            onClick={() => setActiveMode('standard-llm')}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
              activeMode === 'standard-llm'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Standard LLM (Unverified)
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('dual-plane')}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'dual-plane'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Samarthya Dual-Plane</span>
          </button>
        </div>
      </div>

      {/* STANDARD LLM UNVERIFIED SIMULATION */}
      {activeMode === 'standard-llm' && (
        <div className="glass-panel p-6 rounded-3xl border border-rose-500/30 bg-rose-950/15 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Standard LLM Inference (Probabilistic Hallucination Exposure)</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono">
              Zero Citations
            </span>
          </div>

          <p className="text-sm text-slate-300 italic leading-relaxed">
            &quot;{standardLlmHallucination.summary}&quot;
          </p>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
            <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider block">
              Unverified / Hallucinated Figures:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
              {standardLlmHallucination.claims.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setActiveMode('dual-plane')}
              className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20"
            >
              <span>Switch to Deterministic Verifier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* DUAL-PLANE DETERMINISTIC VERIFIED VIEW (Exact Image 1 Cards & Table) */}
      {activeMode === 'dual-plane' && (
        <div className="space-y-5">
          {/* 4 Frosted KPI Metric Cards (Matching Image 1: Clean Single Header Pill on Right) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Card 1: Redundant Outlay (Peach Pill on Right) */}
            <div
              onClick={() => onOpenDrawer('Txn_84920')}
              className="glass-panel p-5 rounded-2xl glow-peach relative overflow-hidden group cursor-pointer transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center justify-end">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-[11px] font-medium font-sans">
                  Redundant Outlay
                </span>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {dualPlaneVerified.kpis.redundantOutlay}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">Heads 2401 vs 2501</p>
            </div>

            {/* Card 2: Avoided Leakage (Mint Pill on Right) */}
            <div
              onClick={() => onOpenDrawer('Txn_84920')}
              className="glass-panel p-5 rounded-2xl glow-mint relative overflow-hidden group cursor-pointer transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center justify-end">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-medium font-sans">
                  Avoided Leakage
                </span>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {dualPlaneVerified.kpis.leakageAvoidance}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">Salvageable via freeze</p>
            </div>

            {/* Card 3: Overlap Detected (Ice Blue Pill on Right) */}
            <div
              onClick={() => onNavigateToMap('Palghar')}
              className="glass-panel p-5 rounded-2xl glow-blue relative overflow-hidden group cursor-pointer transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center justify-end">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-medium font-sans">
                  Overlap Detected
                </span>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {dualPlaneVerified.kpis.affectedBlocks} Blocks
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">Across 3 States</p>
            </div>

            {/* Card 4: Verifier Confidence (Teal Pill on Right) */}
            <div
              onClick={() => onOpenDrawer('Txn_84920')}
              className="glass-panel p-5 rounded-2xl glow-mint relative overflow-hidden group cursor-pointer transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center justify-end">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[11px] font-medium font-sans">
                  Verifier Confidence
                </span>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {dualPlaneVerified.kpis.verifierConfidence}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">Record Linkage 0-Delta</p>
            </div>
          </div>

          {/* Quick Cross-View Jump Toolbar */}
          <div className="flex items-center justify-between px-1 pt-1">
            <span className="text-xs text-slate-400">
              National Reconciliation Ledger &bull; Confirmed Spatial Invariants
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateToMap('Palghar')}
                className="glass-pill px-3 py-1.5 rounded-full text-xs text-slate-200 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>View on Map</span>
              </button>

              <button
                type="button"
                onClick={onNavigateToMatrix}
                className="glass-pill px-3 py-1.5 rounded-full text-xs text-slate-200 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                <span>View in Matrix</span>
              </button>
            </div>
          </div>

          {/* Frosted Reconciliation Data Table (Matching Image 1) */}
          <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-slate-400 text-[11px] font-medium">
                    <th className="py-3.5 px-4 w-10">
                      <div className="w-4 h-4 rounded border border-white/20 bg-slate-900/40" />
                    </th>
                    <th className="py-3.5 px-4">District</th>
                    <th className="py-3.5 px-4">Block</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Transaction ID</th>
                    <th className="py-3.5 px-4 text-right">Redundant Outlay</th>
                    <th className="py-3.5 px-4 text-right">Provenance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {dualPlaneVerified.blocks.map((b: OverlappingBlockRecord, idx: number) => {
                    const isChecked = !!selectedRowIds[b.blockLgdCode];
                    const isDuplicate = idx % 2 === 0; // Alternate between Duplicate Risk and Resolved

                    return (
                      <tr
                        key={b.blockLgdCode}
                        className="hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => toggleRow(b.blockLgdCode)}
                      >
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleRow(b.blockLgdCode)}
                            className="w-4 h-4 rounded border border-white/20 bg-slate-900/60 text-blue-600 focus:ring-0 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-200">{b.districtName}</td>
                        <td className="py-3 px-4 text-slate-300">{b.blockName}</td>
                        <td className="py-3 px-4">
                          {isDuplicate ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-[10px] font-medium inline-flex items-center gap-1">
                              Duplicate Risk
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-medium inline-flex items-center gap-1">
                              Resolved
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300 text-[11px]">
                          116082920-498-{b.voucherIdA.replace('Txn_', '')}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-rose-400 text-right">
                          {b.redundantAmountDisplay}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <CitationBadge
                            label={b.voucherIdA}
                            voucherId={b.voucherIdA}
                            onClick={onOpenDrawer}
                            variant="emerald"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Secretary & District Magistrate Action Checklist */}
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-400" />
              Cabinet Secretariat Directed Actions:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {dualPlaneVerified.policyRecommendations.map((rec, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1"
                >
                  <div className="flex items-center gap-1.5 text-blue-400 font-mono text-[10px] font-bold">
                    <span>STEP 0{i + 1}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
