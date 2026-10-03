import React, { useState } from 'react';
import {
  MapPin,
  Bot,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Building2,
  FileCheck2,
} from 'lucide-react';

interface OverlapMatrixProps {
  onOpenDrawer: (voucherId: string) => void;
  onNavigateToMap: (districtOrBlock?: string) => void;
  onNavigateToCopilot: (scenarioId?: string) => void;
}

interface MatrixCellDetail {
  id: string;
  rowKey: string;
  colKey: string;
  title: string;
  rowScheme: string;
  colScheme: string;
  schemeTypeRow: string;
  assetFundedRow: string;
  locationRow: string;
  schemeTypeCol: string;
  assetFundedCol: string;
  locationCol: string;
  exposure: string;
  blockCount: number;
  category: 'critical' | 'moderate' | 'conflict' | 'harmonized' | 'neutral';
  cellType: 'amount' | 'dot' | 'badge' | 'card';
  badgeLabel?: string;
  amountDisplay?: string;
  scenarioId: string;
  targetFocus: string;
  auditNotes: string;
}

const MATRIX_CELLS: MatrixCellDetail[] = [
  // Row 1: RKVY
  {
    id: 'RKVY_PMGSY',
    rowKey: 'RKVY',
    colKey: 'PMGSY',
    title: 'MoA&FW-RKVY vs MoRD-PMGSY',
    rowScheme: 'MoA&FW-RKVY',
    colScheme: 'MoRD-PMGSY',
    schemeTypeRow: 'Infra',
    assetFundedRow: 'Storage Hub',
    locationRow: 'Block 12 (Palghar)',
    schemeTypeCol: 'Roads/Agri-Roads',
    assetFundedCol: 'Agri-Pavement',
    locationCol: 'Block 12 (Palghar)',
    exposure: '₹14.2 Cr',
    blockCount: 12,
    category: 'critical',
    cellType: 'amount',
    amountDisplay: '₹14.2 Cr',
    scenarioId: 'SCENARIO_1_FARM_STORAGE_OVERLAP',
    targetFocus: 'Palghar',
    auditNotes: 'Direct duplicate capital outlay for agro-storage warehouse and pavement on identical cadastral coordinates.',
  },
  {
    id: 'RKVY_MGNREGA',
    rowKey: 'RKVY',
    colKey: 'MGNREGA',
    title: 'MoA&FW-RKVY vs MoRD-MGNREGA',
    rowScheme: 'MoA&FW-RKVY',
    colScheme: 'MoRD-MGNREGA',
    schemeTypeRow: 'Soil & Water',
    assetFundedRow: 'Farm Pond #18',
    locationRow: 'Block 04',
    schemeTypeCol: 'Natural Resource',
    assetFundedCol: 'Water Harvest Pond',
    locationCol: 'Block 04',
    exposure: '₹2.4 Cr',
    blockCount: 4,
    category: 'harmonized',
    cellType: 'dot',
    scenarioId: 'SCENARIO_1_FARM_STORAGE_OVERLAP',
    targetFocus: 'Palghar',
    auditNotes: 'Harmonized co-funding for water harvesting structure verified under joint LGD geo-tagging protocol.',
  },
  {
    id: 'RKVY_PMKSY',
    rowKey: 'RKVY',
    colKey: 'PMKSY',
    title: 'MoA&FW-RKVY vs MoWR-PMKSY',
    rowScheme: 'MoA&FW-RKVY',
    colScheme: 'MoWR-PMKSY',
    schemeTypeRow: 'Per Drop More Crop',
    assetFundedRow: 'Micro-Drip Network',
    locationRow: 'Block 06',
    schemeTypeCol: 'Har Khet Ko Pani',
    assetFundedCol: 'Lift Irrigation Grid',
    locationCol: 'Block 06',
    exposure: '₹1.8 Cr',
    blockCount: 6,
    category: 'harmonized',
    cellType: 'dot',
    scenarioId: 'SCENARIO_2_PMGSY_COLD_CHAIN',
    targetFocus: 'Sehore',
    auditNotes: 'Synergistic micro-irrigation feeder aligned with state command area development without duplicate billing.',
  },

  // Row 2: MIDH
  {
    id: 'MIDH_PMGSY',
    rowKey: 'MIDH',
    colKey: 'PMGSY',
    title: 'MoA&FW-MIDH vs MoRD-PMGSY',
    rowScheme: 'MoA&FW-MIDH',
    colScheme: 'MoRD-PMGSY',
    schemeTypeRow: 'Cold Chain',
    assetFundedRow: 'Packhouse Facility',
    locationRow: 'Block 03',
    schemeTypeCol: 'All-Weather Feeder',
    assetFundedCol: 'Agri-Feeder Link',
    locationCol: 'Block 03',
    exposure: '₹3.1 Cr',
    blockCount: 3,
    category: 'harmonized',
    cellType: 'dot',
    scenarioId: 'SCENARIO_2_PMGSY_COLD_CHAIN',
    targetFocus: 'Palghar',
    auditNotes: 'Positive convergence corridor connecting horticulture packhouse to PMGSY-III bituminous road network.',
  },
  {
    id: 'MIDH_MGNREGA',
    rowKey: 'MIDH',
    colKey: 'MGNREGA',
    title: 'MoA&FW-MIDH vs MoRD-MGNREGA',
    rowScheme: 'MoA&FW-MIDH',
    colScheme: 'MoRD-MGNREGA',
    schemeTypeRow: 'Horticulture Nursery',
    assetFundedRow: 'Greenhouse Shed',
    locationRow: 'Block 08 (Sehore)',
    schemeTypeCol: 'Rural Infrastructure',
    assetFundedCol: 'Sapling Nursery Unit',
    locationCol: 'Block 08 (Sehore)',
    exposure: '₹7.1 Cr',
    blockCount: 8,
    category: 'critical',
    cellType: 'card',
    badgeLabel: 'Duplicate Asset funding',
    amountDisplay: '₹7.1 Cr',
    scenarioId: 'SCENARIO_1_FARM_STORAGE_OVERLAP',
    targetFocus: 'Sehore',
    auditNotes: 'High redundancy: Two parallel sanctions for community nursery unit in Sehore under separate ministry budget heads.',
  },
  {
    id: 'MIDH_PMKSY',
    rowKey: 'MIDH',
    colKey: 'PMKSY',
    title: 'MoA&FW-MIDH vs MoWR-PMKSY',
    rowScheme: 'MoA&FW-MIDH',
    colScheme: 'MoWR-PMKSY',
    schemeTypeRow: 'Orchard Irrigation',
    assetFundedRow: 'Sprinkler Line',
    locationRow: 'Block 05',
    schemeTypeCol: 'Command Area',
    assetFundedCol: 'Canal Feeder Line',
    locationCol: 'Block 05',
    exposure: '₹7.1 Cr',
    blockCount: 5,
    category: 'moderate',
    cellType: 'card',
    badgeLabel: 'Moderate Convergence',
    amountDisplay: '₹7.1 Cr',
    scenarioId: 'SCENARIO_2_PMGSY_COLD_CHAIN',
    targetFocus: 'Sehore',
    auditNotes: 'Secondary canal feeder overlaps with farmer drip subsidy allocation. Recommended single-window reconciliation.',
  },

  // Row 3: AIF
  {
    id: 'AIF_PMGSY',
    rowKey: 'AIF',
    colKey: 'PMGSY',
    title: 'MoA&FW-AIF vs MoRD-PMGSY',
    rowScheme: 'MoA&FW-AIF',
    colScheme: 'MoRD-PMGSY',
    schemeTypeRow: 'Agri-Infra Warehousing',
    assetFundedRow: '10,000 MT Terminal Hub',
    locationRow: 'Block 09 (Palghar)',
    schemeTypeCol: 'Rural Connectivity',
    assetFundedCol: 'Heavy Axle Bridge Connect',
    locationCol: 'Block 09 (Palghar)',
    exposure: '₹8.6 Cr',
    blockCount: 9,
    category: 'conflict',
    cellType: 'badge',
    badgeLabel: 'Conflict',
    scenarioId: 'SCENARIO_1_FARM_STORAGE_OVERLAP',
    targetFocus: 'Palghar',
    auditNotes: 'Spatial bottleneck: Terminal warehouse location conflicts with PMGSY bridge right-of-way alignment.',
  },
  {
    id: 'AIF_MGNREGA',
    rowKey: 'AIF',
    colKey: 'MGNREGA',
    title: 'MoA&FW-AIF vs MoRD-MGNREGA',
    rowScheme: 'MoA&FW-AIF',
    colScheme: 'MoRD-MGNREGA',
    schemeTypeRow: 'Post-Harvest Credit',
    assetFundedRow: 'Grain Storage Silo',
    locationRow: 'Block 02',
    schemeTypeCol: 'Wage Employment',
    assetFundedCol: 'Pavement Floor',
    locationCol: 'Block 02',
    exposure: '₹0.0 Cr',
    blockCount: 2,
    category: 'neutral',
    cellType: 'dot',
    scenarioId: 'SCENARIO_1_FARM_STORAGE_OVERLAP',
    targetFocus: 'Palghar',
    auditNotes: 'Zero conflict: Wage employment and credit guarantee lines operate independently on distinct LGD plots.',
  },
  {
    id: 'AIF_PMKSY',
    rowKey: 'AIF',
    colKey: 'PMKSY',
    title: 'MoA&FW-AIF vs MoWR-PMKSY',
    rowScheme: 'MoA&FW-AIF',
    colScheme: 'MoWR-PMKSY',
    schemeTypeRow: 'Solar Agri-Infra',
    assetFundedRow: 'Solar Pump Array',
    locationRow: 'Block 07 (Nashik)',
    schemeTypeCol: 'Solar Irrigation',
    assetFundedCol: 'PM-KUSUM Component-B',
    locationCol: 'Block 07 (Nashik)',
    exposure: '₹7.1 Cr',
    blockCount: 7,
    category: 'critical',
    cellType: 'card',
    badgeLabel: 'Duplicate Asset funding',
    amountDisplay: '₹7.1 Cr',
    scenarioId: 'SCENARIO_3_WELFARE_DBT',
    targetFocus: 'Palghar',
    auditNotes: 'Dual subsidy claimed for the same solar irrigation borehole array under AIF interest subvention and PMKSY.',
  },
];

export const OverlapMatrix: React.FC<OverlapMatrixProps> = ({
  onNavigateToMap,
  onNavigateToCopilot,
}) => {
  const [selectedCellId, setSelectedCellId] = useState<string>('RKVY_PMGSY');
  const [filterMode, setFilterMode] = useState<'all' | 'critical' | 'moderate' | 'harmonized'>('all');

  const cols = ['PMGSY', 'MGNREGA', 'PMKSY'];
  const rows = ['RKVY', 'MIDH', 'AIF'];

  const selectedCell = MATRIX_CELLS.find((c) => c.id === selectedCellId) || MATRIX_CELLS[0];

  const isCellMatchingFilter = (cell: MatrixCellDetail) => {
    if (filterMode === 'all') return true;
    if (filterMode === 'critical') return cell.category === 'critical' || cell.category === 'conflict';
    if (filterMode === 'moderate') return cell.category === 'moderate';
    if (filterMode === 'harmonized') return cell.category === 'harmonized' || cell.category === 'neutral';
    return true;
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-2 space-y-4 animate-in fade-in duration-300">
      {/* Top Tactical KPI Bar & Category Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2.5 text-xs font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
          <span>Redundant Exposure:</span>
          <strong className="text-rose-300 font-bold font-sans text-sm">₹28.4 Cr</strong>
          <span className="text-slate-600">&bull;</span>
          <span className="text-slate-400">4 Critical Conflicts Flagged</span>
        </div>

        {/* Quick Filter Capsule */}
        <div className="glass-pill px-1.5 py-1 rounded-full flex items-center gap-1 text-[11px] max-w-full overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              filterMode === 'all'
                ? 'bg-white text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Cells
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('critical')}
            className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              filterMode === 'critical'
                ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Duplicates (3)
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('moderate')}
            className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              filterMode === 'moderate'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Moderate (1)
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('harmonized')}
            className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              filterMode === 'harmonized'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Harmonized (4)
          </button>
        </div>
      </div>

      {/* Side-by-Side Unified Architecture (Zero Matrix Obstruction) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Full Overlap Matrix (100% Unobscured) */}
        <div className="lg:col-span-7 glass-panel p-2.5 sm:p-7 rounded-2xl sm:rounded-3xl relative overflow-hidden shadow-2xl border border-white/10">
          {/* Top Header: Ministry of Rural Development+ & Food Processing */}
          <div className="text-center mb-3 sm:mb-5">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-300 uppercase tracking-wider sm:tracking-widest flex items-center justify-center gap-1.5 sm:gap-2">
              <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">Ministry of Rural Development+ &amp; Food Processing</span>
            </span>
          </div>

          {/* Matrix Grid Structure with Responsive Horizontal Scroll */}
          <div className="overflow-x-auto no-scrollbar pb-1">
            <div className="flex items-start gap-1.5 sm:gap-4 min-w-0 w-full">
              {/* Left Y-Axis Ministry Label */}
              <div className="flex items-center justify-center [writing-mode:vertical-lr] rotate-180 py-2 sm:py-4 text-[9.5px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider sm:tracking-widest select-none shrink-0 w-4 sm:w-auto">
                Ministry of Agriculture (M)
              </div>

              <div className="flex-1 space-y-1.5 sm:space-y-3">
                {/* Top Column Header Pills */}
                <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
                  <div /> {/* Empty top-left corner */}
                  {cols.map((col) => (
                    <div
                      key={col}
                      className="glass-pill py-1.5 sm:py-2.5 px-1 rounded-xl sm:rounded-2xl text-center text-[10px] sm:text-xs font-bold text-slate-200 uppercase tracking-wider shadow-md truncate"
                    >
                      {col}
                    </div>
                  ))}
                </div>

                {/* Matrix Rows */}
                {rows.map((rowName) => (
                  <div key={rowName} className="grid grid-cols-4 gap-1.5 sm:gap-3 items-stretch">
                    {/* Left Row Header Pill */}
                    <div className="glass-pill py-2 sm:py-3.5 px-1 sm:px-2 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-[10px] sm:text-xs text-slate-200 shadow-md truncate">
                      {rowName}
                    </div>

                    {/* 3 Cells in Row */}
                    {cols.map((colName) => {
                      const cell = MATRIX_CELLS.find(
                        (c) => c.rowKey === rowName && c.colKey === colName
                      );
                      if (!cell) return <div key={colName} />;

                      const isSelected = selectedCellId === cell.id;
                      const isVisible = isCellMatchingFilter(cell);

                      return (
                        <div
                          key={cell.id}
                          onClick={() => setSelectedCellId(cell.id)}
                          style={{ opacity: isVisible ? 1 : 0.2 }}
                          className={`relative rounded-xl sm:rounded-2xl min-h-[62px] sm:min-h-[92px] p-1 sm:p-2.5 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 select-none ${
                            isSelected
                              ? 'border-2 border-cyan-400 shadow-xl shadow-cyan-500/35 scale-[1.03] z-10'
                              : 'hover:scale-[1.01]'
                          } ${
                            cell.cellType === 'amount'
                              ? 'glass-panel glow-blue bg-cyan-950/20'
                              : cell.category === 'critical'
                              ? 'bg-gradient-to-br from-rose-950/40 via-rose-900/25 to-slate-950/40 border border-rose-500/30 glow-peach shadow-lg'
                              : cell.category === 'moderate'
                              ? 'bg-gradient-to-br from-amber-950/40 via-amber-900/25 to-slate-950/40 border border-amber-500/30 glow-amber shadow-lg'
                              : 'glass-panel hover:bg-white/5'
                          }`}
                        >
                          {/* Active indicator dot */}
                          {isSelected && (
                            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-cyan-400 flex items-center justify-center shadow-md shadow-cyan-400/80">
                              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-slate-950" />
                            </div>
                          )}

                          {/* Cell Type 1: Large Amount Display (₹14.2 Cr) */}
                          {cell.cellType === 'amount' && (
                            <span className="text-sm sm:text-2xl font-extrabold text-white font-sans tracking-tight">
                              {cell.amountDisplay}
                            </span>
                          )}

                          {/* Cell Type 2: Glowing Dot */}
                          {cell.cellType === 'dot' && (
                            <div
                              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full ${
                                cell.category === 'neutral'
                                  ? 'bg-slate-600'
                                  : 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.85)]'
                              }`}
                            />
                          )}

                          {/* Cell Type 3: Badge (Conflict) */}
                          {cell.cellType === 'badge' && (
                            <span className="px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[8px] sm:text-[10px] font-semibold tracking-wide">
                              {cell.badgeLabel}
                            </span>
                          )}

                          {/* Cell Type 4: Card with Badge Pill + Amount */}
                          {cell.cellType === 'card' && (
                            <div className="flex flex-col items-center justify-center text-center px-0.5">
                              <span
                                className={`px-1 sm:px-2 py-0.5 rounded-full text-[7px] sm:text-[9px] font-medium mb-0.5 sm:mb-1 leading-tight ${
                                  cell.category === 'critical'
                                    ? 'bg-rose-500/25 text-rose-200 border border-rose-400/30'
                                    : 'bg-amber-500/25 text-amber-200 border border-amber-400/30'
                                }`}
                              >
                                {cell.badgeLabel}
                              </span>
                              <span className="text-xs sm:text-lg font-extrabold text-white font-sans">
                                {cell.amountDisplay}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tactical Coordinate Crosshair HUD on Bottom Left (Image 3) */}
          <div className="mt-3 sm:mt-4 flex items-center justify-between text-slate-500 font-mono text-[8.5px] sm:text-[9px] pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
              <span className="truncate">Grid Reference: 1.07.00 &bull; 1.38.20</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 text-slate-400 shrink-0">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400" />
              <span className="hidden xs:inline">Click cell to inspect</span>
            </div>
          </div>
        </div>

        {/* Right Side: Dedicated Intersection Inspector Panel (Always Clear, Never Blocks Matrix) */}
        <div className="lg:col-span-5 glass-panel p-4 sm:p-6 rounded-3xl border border-white/15 shadow-2xl bg-slate-950/90 backdrop-blur-2xl space-y-4">
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-sm text-slate-100 tracking-tight">
                Intersection Inspector
              </span>
            </div>

            {/* Risk Category Badge */}
            {selectedCell.category === 'critical' && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-rose-400" />
                <span>High Duplicate Risk</span>
              </span>
            )}
            {selectedCell.category === 'conflict' && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-amber-400" />
                <span>Spatial Conflict</span>
              </span>
            )}
            {selectedCell.category === 'moderate' && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono flex items-center gap-1">
                <span>Moderate Convergence</span>
              </span>
            )}
            {(selectedCell.category === 'harmonized' || selectedCell.category === 'neutral') && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Harmonized Co-funding</span>
              </span>
            )}
          </div>

          {/* Scheme Pair Title & Outlay */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-100 tracking-tight">
                {selectedCell.title}
              </h3>
              <span className="text-base font-extrabold font-mono text-cyan-300">
                {selectedCell.exposure}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              {selectedCell.auditNotes}
            </p>
          </div>

          {/* 2-Column Ministry Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
            {/* Left Box: Ministry of Agriculture */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold">
                <span>{selectedCell.rowScheme.split(' ')[0]}</span>
                <ChevronRight className="w-3 h-3 text-slate-500" />
              </div>
              <div className="text-[11px] text-slate-400">
                Type: <strong className="text-slate-200 font-sans">{selectedCell.schemeTypeRow}</strong>
              </div>
              <div className="text-[11px] text-slate-400">
                Asset: <strong className="text-slate-200 font-sans">{selectedCell.assetFundedRow}</strong>
              </div>
              <div className="text-[11px] text-slate-400">
                Block: <strong className="text-blue-300 font-mono">{selectedCell.locationRow}</strong>
              </div>
            </div>

            {/* Right Box: Ministry of Rural Development */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold">
                <span>{selectedCell.colScheme.split(' ')[0]}</span>
                <ChevronRight className="w-3 h-3 text-slate-500" />
              </div>
              <div className="text-[11px] text-slate-400">
                Type: <strong className="text-slate-200 font-sans">{selectedCell.schemeTypeCol}</strong>
              </div>
              <div className="text-[11px] text-slate-400">
                Asset: <strong className="text-slate-200 font-sans">{selectedCell.assetFundedCol}</strong>
              </div>
              <div className="text-[11px] text-slate-400">
                Block: <strong className="text-blue-300 font-mono">{selectedCell.locationCol}</strong>
              </div>
            </div>
          </div>

          {/* Cadastral Verification Invariant */}
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/5 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-300">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Spatial Verification:</span>
            </span>
            <span className="text-emerald-400 font-semibold">{selectedCell.blockCount} Blocks Confirmed</span>
          </div>

          {/* The Two Prominent Glowing Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => onNavigateToMap(selectedCell.targetFocus)}
              className="py-3 px-3 rounded-full bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-400/40 hover:bg-emerald-300 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>View on Map</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateToCopilot(selectedCell.scenarioId)}
              className="py-3 px-3 rounded-full bg-sky-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-sky-300/40 hover:bg-sky-200 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Copilot Audit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
