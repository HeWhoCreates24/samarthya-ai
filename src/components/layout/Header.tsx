import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  BarChart3,
  MapPin,
  Network,
  User,
  ShieldCheck,
  FileText,
  ChevronDown,
} from 'lucide-react';
import type { PersonaType } from '../../types/governance';
import { PERSONAS } from '../../data/mockGovernanceData';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  activePersona: PersonaType;
  onPersonaChange: (p: PersonaType) => void;
  onOpenCabinetNote: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  activePersona,
  onPersonaChange,
  onOpenCabinetNote,
}) => {
  const currentPersona = PERSONAS[activePersona] || PERSONAS.PMO_POLICY_ADVISOR;
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPersonaOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPersonaOpen(false);
      }
    };

    if (isPersonaOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPersonaOpen]);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-xl border-b border-white/5 shadow-2xl py-2.5 px-4 md:px-6">
      {/* Top Bar Row */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Sovereign Brand Monogram */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20 border border-white/15 flex items-center justify-center shadow-lg shadow-blue-500/10 backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-sm font-bold tracking-tight text-white font-sans">
                Samarthya-AI
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/30">
                EL-03
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans tracking-wide hidden sm:block">
              National Cross-Ministry Governance Platform
            </p>
          </div>
        </div>

        {/* Center Desktop Navigation (>= md screens) */}
        <nav className="hidden md:flex glass-panel bg-slate-900/80 backdrop-blur-2xl border border-white/15 p-1 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] items-center gap-1">
          {[
            {
              id: 'copilot',
              label: 'Ask Copilot',
              icon: Search,
              accentColor: 'text-blue-300',
              activeBg: 'from-blue-500/25 to-indigo-500/20 border-blue-400/40 text-blue-100 shadow-blue-500/20',
              description: 'Dual-Plane Copilot',
            },
            {
              id: 'matrix',
              label: 'Overlap Matrix',
              icon: BarChart3,
              accentColor: 'text-cyan-300',
              activeBg: 'from-cyan-500/25 to-blue-500/20 border-cyan-400/40 text-cyan-100 shadow-cyan-500/20',
              description: 'Cross-Ministry Overlaps',
            },
            {
              id: 'map',
              label: 'Convergence Map',
              icon: MapPin,
              accentColor: 'text-emerald-300',
              activeBg: 'from-emerald-500/25 to-teal-500/20 border-emerald-400/40 text-emerald-100 shadow-emerald-500/20',
              description: 'Geospatial Assets',
            },
            {
              id: 'graph',
              label: 'Knowledge Graph',
              icon: Network,
              accentColor: 'text-purple-300',
              activeBg: 'from-purple-500/25 to-indigo-500/20 border-purple-400/40 text-purple-100 shadow-purple-500/20',
              description: 'Neo4j Cypher Traversal',
            },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                title={`${tab.label} — ${tab.description}`}
                className={`relative px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer flex items-center gap-2 select-none text-xs ${
                  isActive
                    ? `bg-gradient-to-b ${tab.activeBg} font-semibold shadow-lg border scale-[1.02]`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.07] font-medium'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 transition-colors ${
                    isActive ? tab.accentColor : 'text-slate-400'
                  }`}
                />
                <span className="font-sans tracking-tight">
                  {tab.label}
                </span>

                {/* Subtle illuminated bottom dot for active tab */}
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Persona Switcher & Cabinet Note Button */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Persona Dropdown Pill */}
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setIsPersonaOpen((prev) => !prev)}
              aria-expanded={isPersonaOpen}
              className={`glass-pill px-2.5 sm:px-3 py-1.5 rounded-full flex items-center gap-1.5 sm:gap-2 text-xs transition-all cursor-pointer ${
                isPersonaOpen
                  ? 'border-blue-400/50 bg-blue-600/20 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-200 hover:border-white/20'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                <User className="w-3 h-3" />
              </div>
              <span className="font-medium text-[11px] hidden sm:inline">
                {currentPersona.title.split('/')[0]}
              </span>
              <ChevronDown
                className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                  isPersonaOpen ? 'rotate-180 text-blue-300' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isPersonaOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)] bg-slate-950/98 backdrop-blur-2xl border border-slate-700/80 p-2 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <span className="text-[10px] uppercase font-mono text-slate-400 px-3 py-1 block">
                  Operational Context:
                </span>
                {Object.values(PERSONAS).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onPersonaChange(p.id);
                      setIsPersonaOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors cursor-pointer block ${
                      activePersona === p.id
                        ? 'bg-blue-600/25 text-blue-100 border border-blue-500/40 shadow-sm'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="font-semibold text-xs text-slate-100">{p.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">{p.scope}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Cabinet Note Button */}
          <button
            onClick={onOpenCabinetNote}
            className="px-2.5 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[11px] font-medium flex items-center gap-1.5 shadow-lg shadow-blue-600/25 border border-blue-400/30 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cabinet Note</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Row (< md screens) */}
      <div className="md:hidden mt-2 pt-2 border-t border-white/5 flex justify-center">
        <nav className="w-full glass-panel bg-slate-900/90 backdrop-blur-2xl border border-white/15 p-1 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] flex items-center justify-between gap-1">
          {[
            {
              id: 'copilot',
              label: 'Copilot',
              icon: Search,
              accentColor: 'text-blue-300',
              activeBg: 'from-blue-500/25 to-indigo-500/20 border-blue-400/40 text-blue-100 shadow-blue-500/20',
            },
            {
              id: 'matrix',
              label: 'Matrix',
              icon: BarChart3,
              accentColor: 'text-cyan-300',
              activeBg: 'from-cyan-500/25 to-blue-500/20 border-cyan-400/40 text-cyan-100 shadow-cyan-500/20',
            },
            {
              id: 'map',
              label: 'Map',
              icon: MapPin,
              accentColor: 'text-emerald-300',
              activeBg: 'from-emerald-500/25 to-teal-500/20 border-emerald-400/40 text-emerald-100 shadow-emerald-500/20',
            },
            {
              id: 'graph',
              label: 'Graph',
              icon: Network,
              accentColor: 'text-purple-300',
              activeBg: 'from-purple-500/25 to-indigo-500/20 border-purple-400/40 text-purple-100 shadow-purple-500/20',
            },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`relative flex-1 py-1.5 px-2 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 select-none text-[11px] ${
                  isActive
                    ? `bg-gradient-to-b ${tab.activeBg} font-semibold shadow-md border scale-[1.02]`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.07] font-medium'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 transition-colors shrink-0 ${
                    isActive ? tab.accentColor : 'text-slate-400'
                  }`}
                />
                <span className="font-sans tracking-tight">
                  {tab.label}
                </span>

                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sub-bar: Tactical Sovereign Ticker (Single Clean Line, Responsive Scrolling) */}
      <div className="max-w-7xl mx-auto mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400 px-1 gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LGD Master: <strong className="text-slate-200 font-semibold">v2026.3 Connected</strong>
          </span>
          <span className="hidden sm:inline text-slate-700">&bull;</span>
          <span className="hidden sm:inline text-slate-400">
            Neo4j KG: <strong className="text-slate-300">14.8M Nodes Synced</strong>
          </span>
          <span className="hidden md:inline text-slate-700">&bull;</span>
          <span className="hidden md:inline text-slate-400">
            Deterministic Verifier: <strong className="text-emerald-400">Online (WASM 14ms)</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400 shrink-0">
          <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[9px] whitespace-nowrap">
            DPDP Act 2023 Compliant
          </span>
        </div>
      </div>
    </header>
  );
};
