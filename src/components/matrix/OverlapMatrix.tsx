import React, { useState } from 'react';
import {
  X,
  MapPin,
  Bot,
  Sparkles,
} from 'lucide-react';
import { SCHEME_OVERLAP_MATRIX } from '../../data/mockGovernanceData';
import type { MatrixCellData } from '../../types/governance';

interface OverlapMatrixProps {
  onOpenDrawer: (voucherId: string) => void;
  onNavigateToMap: (districtOrBlock?: string) => void;
  onNavigateToCopilot: (scenarioId?: string) => void;
}

export const OverlapMatrix: React.FC<OverlapMatrixProps> = ({
  onNavigateToMap,
  onNavigateToCopilot,
}) => {
  const [selectedCell, setSelectedCell] = useState<MatrixCellData | null>(SCHEME_OVERLAP_MATRIX[0]);

  const cols = ['PMGSY', 'MGNREGA', 'PMKSY'];

  return (
    <div className="w-full max-w-5xl mx-auto py-4 space-y-6 relative animate-in fade-in duration-300">
      {/* Matrix Table Container (Matching Image 3) */}
      <div className="glass-panel p-8 rounded-3xl relative overflow-hidden shadow-2xl">
        {/* Top Header: Ministry of Rural Development+ & Food Processing */}
        <div className="text-center mb-6">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Ministry of Rural Development+ &amp; Food Processing
          </span>
        </div>

        {/* Matrix Grid Structure */}
        <div className="flex items-start gap-4">
          {/* Left Y-Axis Ministry Label */}
          <div className="flex items-center justify-center [writing-mode:vertical-lr] rotate-180 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Ministry of Agriculture (M)
          </div>

          <div className="flex-1 space-y-3">
            {/* Top Column Header Pills */}
            <div className="grid grid-cols-4 gap-3">
              <div /> {/* Empty top-left corner */}
              {cols.map((col) => (
                <div
                  key={col}
                  className="glass-pill py-2.5 rounded-2xl text-center text-xs font-bold text-slate-200 uppercase tracking-wider"
                >
                  {col}
                </div>
              ))}
            </div>

            {/* Row 1: RKVY */}
            <div className="grid grid-cols-4 gap-3 items-stretch">
              <div className="glass-pill py-4 px-3 rounded-2xl flex items-center justify-center font-bold text-xs text-slate-200">
                RKVY
              </div>

              {/* RKVY x PMGSY (Active Cyan Glow Card) */}
              <div
                onClick={() => setSelectedCell(SCHEME_OVERLAP_MATRIX[0])}
                className="glass-panel p-4 rounded-2xl border-2 border-cyan-400/80 shadow-lg shadow-cyan-500/20 glow-blue flex flex-col items-center justify-center cursor-pointer hover:scale-[1.02] transition-all min-h-[90px]"
              >
                <span className="text-2xl font-extrabold text-white font-sans tracking-tight">
                  ₹14.2 Cr
                </span>
              </div>

              {/* RKVY x MGNREGA (Mint Dot) */}
              <div
                onClick={() => setSelectedCell(SCHEME_OVERLAP_MATRIX[1])}
                className="glass-panel p-4 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-white/5 transition-all min-h-[90px]"
              >
                <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/50" />
              </div>

              {/* RKVY x PMKSY (Mint Dot) */}
              <div
                onClick={() => setSelectedCell(SCHEME_OVERLAP_MATRIX[2])}
                className="glass-panel p-4 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-white/5 transition-all min-h-[90px]"
              >
                <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/50" />
              </div>
            </div>

            {/* Row 2: MIDH */}
            <div className="grid grid-cols-4 gap-3 items-stretch">
              <div className="glass-pill py-4 px-3 rounded-2xl flex items-center justify-center font-bold text-xs text-slate-200">
                MIDH
              </div>

              {/* MIDH x PMGSY (Mint Dot) */}
              <div
                onClick={() => setSelectedCell(SCHEME_OVERLAP_MATRIX[2])}
                className="glass-panel p-4 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-white/5 transition-all min-h-[90px]"
              >
                <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/50" />
              </div>

              {/* MIDH x MGNREGA (Peach Card) */}
              <div
                onClick={() => setSelectedCell(SCHEME_OVERLAP_MATRIX[3])}
                className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-400/30 glow-peach flex flex-col items-center justify-center cursor-pointer hover:scale-[1.02] transition-all min-h-[90px]"
              >
                <span className="px-2 py-0.5 rounded-full bg-rose-500/25 text-rose-200 text-[10px] font-medium mb-1">
                  Duplicate Asset funding
                </span>
                <span className="text-xl font-extrabold text-white font-sans">
                  ₹7.1 Cr
                </span>
              </div>

              {/* MIDH x PMKSY (Amber Card) */}
              <div
                onClick={() => setSelectedCell(SCHEME_OVERLAP_MATRIX[3])}
                className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/30 glow-amber flex flex-col items-center justify-center cursor-pointer hover:scale-[1.02] transition-all min-h-[90px]"
              >
                <span className="px-2 py-0.5 rounded-full bg-amber-500/25 text-amber-200 text-[10px] font-medium mb-1">
                  Moderate Convergence
                </span>
                <span className="text-xl font-extrabold text-white font-sans">
                  ₹7.1 Cr
                </span>
              </div>
            </div>

            {/* Row 3: AIF */}
            <div className="grid grid-cols-4 gap-3 items-stretch">
              <div className="glass-pill py-4 px-3 rounded-2xl flex items-center justify-center font-bold text-xs text-slate-200">
                AIF
              </div>

              {/* AIF x PMGSY (Conflict Mint Pill) */}
              <div
                onClick={() => setSelectedCell(SCHEME_OVERLAP_MATRIX[0])}
                className="glass-panel p-4 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-white/5 transition-all min-h-[90px]"
              >
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-medium">
                  Conflict
                </span>
              </div>

              {/* AIF x MGNREGA (Dark) */}
              <div
                onClick={() => setSelectedCell(SCHEME_OVERLAP_MATRIX[1])}
                className="glass-panel p-4 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-white/5 transition-all min-h-[90px]"
              >
                <div className="w-3 h-3 rounded-full bg-slate-600" />
              </div>

              {/* AIF x PMKSY (Peach Card) */}
              <div
                onClick={() => setSelectedCell(SCHEME_OVERLAP_MATRIX[3])}
                className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-400/30 glow-peach flex flex-col items-center justify-center cursor-pointer hover:scale-[1.02] transition-all min-h-[90px]"
              >
                <span className="px-2 py-0.5 rounded-full bg-rose-500/25 text-rose-200 text-[10px] font-medium mb-1">
                  Duplicate Asset funding
                </span>
                <span className="text-xl font-extrabold text-white font-sans">
                  ₹7.1 Cr
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Right Decorative Radar Sweep Widget (Image 3) */}
        <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full border border-slate-700/40 pointer-events-none flex items-center justify-center opacity-40">
          <div className="w-32 h-32 rounded-full border border-slate-700/40 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border border-slate-700/50 relative">
              <div className="absolute inset-0 rounded-full border-t border-cyan-400/80 animate-radar" />
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-slate-500 absolute top-10 right-10" />
        </div>
      </div>

      {/* Floating Intersection Popover Card (Matching Image 3) */}
      {selectedCell && (
        <div className="w-full max-w-lg mx-auto glass-panel p-5 rounded-3xl border border-white/15 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
          {/* Card Header with Title and Close X */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="font-bold text-sm text-slate-100 tracking-tight">
              MoA&FW-RKVY vs MoRD-PMGSY
            </span>
            <button
              onClick={() => setSelectedCell(null)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Split Detail Grid */}
          <div className="grid grid-cols-2 gap-4 py-4 text-xs">
            {/* Left: MoA&FW-RKVY */}
            <div className="space-y-1">
              <span className="font-bold text-slate-200 block text-xs">MoA&FW-RKVY</span>
              <div className="text-slate-400">
                Scheme Type: <strong className="text-slate-200 font-sans">Infra</strong>
              </div>
              <div className="text-slate-400">
                Asset Funded: <strong className="text-slate-200 font-sans">Storage Hub</strong>
              </div>
              <div className="text-slate-400">
                Location: <strong className="text-slate-200 font-sans">Block 12</strong>
              </div>
            </div>

            {/* Right: MoRD-PMGSY */}
            <div className="space-y-1">
              <span className="font-bold text-slate-200 block text-xs">MoRD-PMGSY</span>
              <div className="text-slate-400">
                Scheme Type: <strong className="text-slate-200 font-sans">Roads/Agri-Roads</strong>
              </div>
              <div className="text-slate-400">
                Asset Funded: <strong className="text-slate-200 font-sans">Agri-Pavement</strong>
              </div>
              <div className="text-slate-400">
                Location: <strong className="text-slate-200 font-sans">Block 12</strong>
              </div>
            </div>
          </div>

          {/* The Two High-Impact Glowing Action Buttons (Matching Image 3) */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigateToMap('Palghar')}
              className="py-2.5 px-3 rounded-full bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-400/30 hover:bg-emerald-300 transition-all cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>View 12 Affected Blocks on Map</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateToCopilot('SCENARIO_1_FARM_STORAGE_OVERLAP')}
              className="py-2.5 px-3 rounded-full bg-sky-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-sky-300/30 hover:bg-sky-200 transition-all cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Run Copilot Brief</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
