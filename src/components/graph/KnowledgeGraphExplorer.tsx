import React, { useState } from 'react';

interface KnowledgeGraphExplorerProps {
  onOpenDrawer: (voucherId: string) => void;
  selectedNodeId?: string | null;
}

interface NodeDetails {
  id: string;
  name: string;
  category: string;
  badge: string;
  voucherId: string;
  properties: { label: string; value: string; color?: string }[];
}

const NODE_DETAILS_MAP: Record<string, NodeDetails> = {
  'LGD_BLOCK_53218': {
    id: 'LGD_BLOCK_53218',
    name: 'LGD_Block: 53218',
    category: 'LGD Entity',
    badge: 'LGD Master Certified v2026',
    voucherId: 'Txn_84920',
    properties: [
      { label: 'LGD_Block', value: '53218 (Dahanu)' },
      { label: 'District LGD', value: '532 (Palghar)' },
      { label: 'State LGD', value: '27 (Maharashtra)' },
      { label: 'Active Schemes', value: '4 Union Schemes' },
      { label: 'Redundant Outlay', value: '₹14.20 Cr Flagged', color: 'text-rose-400' },
      { label: 'Spatial Invariant', value: 'Confirmed (Lat 19.98, Long 72.74)', color: 'text-emerald-400' },
    ],
  },
  'PFMS_HEAD_2401': {
    id: 'PFMS_HEAD_2401',
    name: 'PFMS Head 2401',
    category: 'PFMS Head',
    badge: 'DPDP Act 2023 Compliant',
    voucherId: 'Txn_84920',
    properties: [
      { label: 'PFMS Major Head', value: '2401 (Crop Husbandry)' },
      { label: 'Ministry Anchor', value: 'MoA&FW (RKVY Tranche-2)' },
      { label: 'Voucher Txn', value: 'Txn_84920', color: 'text-blue-300' },
      { label: 'Asset Category', value: 'Cold-Storage / Warehouse' },
      { label: 'Sanctioned Amount', value: '₹4,20,00,000' },
      { label: 'Audit Status', value: 'Duplicate Allocation Flagged', color: 'text-rose-400' },
    ],
  },
  'DPDP_TOKEN': {
    id: 'DPDP_TOKEN',
    name: 'DPDP Beneficiary Token: TKN-883F',
    category: 'Zero-Knowledge Token',
    badge: 'DPDP Act 2023 Compliant',
    voucherId: 'Txn_84920',
    properties: [
      { label: 'Beneficiary Token', value: 'TKN-883F-D409', color: 'text-purple-300' },
      { label: 'Privacy Shield', value: 'Zero-Knowledge SHA-256' },
      { label: 'Aadhaar Vault Hash', value: 'e3b0c44...a59b' },
      { label: 'Consent Status', value: 'Explicit Opt-In (v2.1)' },
      { label: 'Cross-Ministry Link', value: 'PM-KISAN + PMAY-G' },
      { label: 'Audit Compliance', value: 'Section 8 Verified', color: 'text-emerald-400' },
    ],
  },
  'ENAM_YARD': {
    id: 'ENAM_YARD',
    name: 'e-NAM Yard MH-012',
    category: 'APMC Mandi Hub',
    badge: 'National Agri Market Synced',
    voucherId: 'Txn_91034',
    properties: [
      { label: 'e-NAM APMC Code', value: 'MH-012 (Gholvad Mandi)' },
      { label: 'LGD Block', value: '53218 (Dahanu)' },
      { label: 'Primary Commodity', value: 'Horticulture & Sapota' },
      { label: 'Capacity Throughput', value: '5,000 MT / Month' },
      { label: 'Convergence Link', value: 'PMGSY Agri-Corridor' },
      { label: 'Audit Finding', value: 'Overlapping Storage Claim', color: 'text-rose-400' },
    ],
  },
  'PMGSY_ROAD': {
    id: 'PMGSY_ROAD',
    name: 'PMGSY Road Link',
    category: 'MoRD PMGSY Link',
    badge: 'OMMS Geo-Tagged v4.1',
    voucherId: 'Txn_91034',
    properties: [
      { label: 'Road Package ID', value: 'MH-3Y-PMGSY-III', color: 'text-cyan-300' },
      { label: 'PFMS Major Head', value: '2501 (Rural Employment & Roads)' },
      { label: 'Pavement Length', value: '14.2 km Bituminous Connect' },
      { label: 'Connected Assets', value: '2 Warehouses, 1 e-NAM Yard' },
      { label: 'Spatial Risk Score', value: '96% Geometry Match', color: 'text-rose-400' },
      { label: 'Voucher Ref', value: 'Txn_91034' },
    ],
  },
};

export const KnowledgeGraphExplorer: React.FC<KnowledgeGraphExplorerProps> = ({
  onOpenDrawer,
  selectedNodeId,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [prevNodeId, setPrevNodeId] = useState<string | null | undefined>(selectedNodeId);
  const [selectedKey, setSelectedKey] = useState<string>(() => {
    if (selectedNodeId) {
      if (selectedNodeId.includes('53218') || selectedNodeId.includes('04812')) return 'LGD_BLOCK_53218';
      if (selectedNodeId.includes('2401')) return 'PFMS_HEAD_2401';
      if (selectedNodeId.includes('TOKEN') || selectedNodeId.includes('DPDP')) return 'DPDP_TOKEN';
      if (selectedNodeId.includes('ENAM') || selectedNodeId.includes('YARD')) return 'ENAM_YARD';
      if (selectedNodeId.includes('ROAD') || selectedNodeId.includes('PMGSY')) return 'PMGSY_ROAD';
    }
    return 'PFMS_HEAD_2401';
  });

  if (selectedNodeId !== prevNodeId) {
    setPrevNodeId(selectedNodeId);
    if (selectedNodeId) {
      if (selectedNodeId.includes('53218') || selectedNodeId.includes('04812')) {
        setSelectedKey('LGD_BLOCK_53218');
      } else if (selectedNodeId.includes('2401')) {
        setSelectedKey('PFMS_HEAD_2401');
      } else if (selectedNodeId.includes('TOKEN') || selectedNodeId.includes('DPDP')) {
        setSelectedKey('DPDP_TOKEN');
      } else if (selectedNodeId.includes('ENAM') || selectedNodeId.includes('YARD')) {
        setSelectedKey('ENAM_YARD');
      } else if (selectedNodeId.includes('ROAD') || selectedNodeId.includes('PMGSY')) {
        setSelectedKey('PMGSY_ROAD');
      }
    }
  }

  // Center node coordinate
  const center = { x: 400, y: 280 };

  // Radial nodes coordinates matching reference image 4
  const radialNodes = [
    {
      key: 'PFMS_HEAD_2401',
      label: 'PFMS Head 2401',
      borderColor: '#f59e0b',
      x: 210,
      y: 140,
      width: 175,
      type: 'pfms',
      curvePath: 'M 350 240 C 310 235, 270 195, 260 160',
      arrowX: 260,
      arrowY: 160,
      linkText: '[:SPATIALLY_IDENTICAL {0.99}]',
      labelX: 290,
      labelY: 228,
    },
    {
      key: 'DPDP_TOKEN',
      label: 'DPDP Beneficiary Token: TKN-883F',
      borderColor: '#c084fc',
      x: 590,
      y: 140,
      width: 205,
      type: 'token',
      curvePath: 'M 450 240 C 490 235, 530 195, 540 160',
      arrowX: 540,
      arrowY: 160,
      linkText: '[:DUPLICATE_ASSET]',
      labelX: 510,
      labelY: 228,
    },
    {
      key: 'ENAM_YARD',
      label: 'e-NAM Yard MH-012',
      borderColor: '#34d399',
      x: 210,
      y: 420,
      width: 175,
      type: 'scheme',
      curvePath: 'M 350 320 C 310 325, 270 365, 260 400',
      arrowX: 260,
      arrowY: 400,
      linkText: '[:SPATIALLY_IDENTICAL {0.99}]',
      labelX: 290,
      labelY: 338,
    },
    {
      key: 'PMGSY_ROAD',
      label: 'PMGSY Road Link',
      borderColor: '#38bdf8',
      x: 590,
      y: 420,
      width: 175,
      type: 'scheme',
      curvePath: 'M 450 320 C 490 325, 530 365, 540 400',
      arrowX: 540,
      arrowY: 400,
      linkText: '[:DUPLICATE_ASSET]',
      labelX: 510,
      labelY: 338,
    },
  ];

  const handleFilterClick = (filterName: string) => {
    setActiveFilter(filterName);
    if (filterName === 'PFMS Heads') {
      setSelectedKey('PFMS_HEAD_2401');
    } else if (filterName === 'LGD Codes') {
      setSelectedKey('LGD_BLOCK_53218');
    } else if (filterName === 'Tokens') {
      setSelectedKey('DPDP_TOKEN');
    } else if (filterName === 'Schemes') {
      setSelectedKey('PMGSY_ROAD');
    }
  };

  const isNodeHighlighted = (nodeType: string, nodeKey: string) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'LGD Codes') return nodeKey === 'LGD_BLOCK_53218';
    if (activeFilter === 'PFMS Heads') return nodeType === 'pfms';
    if (activeFilter === 'Schemes') return nodeType === 'scheme';
    if (activeFilter === 'Tokens') return nodeType === 'token';
    return true;
  };

  const activeDetails = NODE_DETAILS_MAP[selectedKey] || NODE_DETAILS_MAP.PFMS_HEAD_2401;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-3 animate-in fade-in duration-300 relative">
      {/* Main Canvas & Inspector Layout (Matching Reference Image 4) */}
      <div className="glass-panel rounded-3xl p-4 shadow-2xl relative overflow-hidden h-[630px] border border-white/10">
        {/* Subtle Canvas Watermark & Neo4j Indicator */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            Neo4j Knowledge Graph Subgraph &bull; Anchor LGD Block: 53218 (Dahanu)
          </span>
        </div>

        {/* Floating Left Specs / Status Legend (Matching Image 4) */}
        <div className="absolute top-6 left-6 z-20 space-y-3 pointer-events-none sm:pointer-events-auto">
          {/* Status Color Tokens */}
          <div className="glass-panel p-3.5 rounded-2xl border border-white/10 space-y-2 text-[10px] font-mono w-44 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 font-sans text-[11px] font-semibold">
              <span>Ontology</span>
              <span>Hex Token</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-blue-300/20 text-blue-200 border border-blue-300/30 flex items-center justify-between font-bold">
              <span>Ice Blue</span>
              <span>#BFDBFE</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-rose-300/20 text-rose-200 border border-rose-300/30 flex items-center justify-between font-bold">
              <span>Peach/Salmon</span>
              <span>#FECDD3</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-amber-300/20 text-amber-200 border border-amber-300/30 flex items-center justify-between font-bold">
              <span>Lemon</span>
              <span>#FEF08A</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-emerald-300/20 text-emerald-200 border border-emerald-300/30 flex items-center justify-between font-bold">
              <span>Mint</span>
              <span>#A7F3D0</span>
            </div>
          </div>

          {/* Frosted Specs Card */}
          <div className="glass-panel p-3.5 rounded-2xl border border-white/10 space-y-1.5 text-[10px] text-slate-400 w-44 hidden md:block shadow-xl">
            <div className="font-bold text-slate-200 text-xs font-sans">Frosted UI Specs</div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>Backdrop-blur-xl &bull; Glass block</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Inner ambient glow</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>Tactical geospatial HUD</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>Crisp typography</span>
            </div>
          </div>
        </div>

        {/* SVG Node-Link Canvas */}
        <svg className="w-full h-full select-none" viewBox="0 0 800 580">
          <defs>
            {/* Arrowhead marker for directed edges */}
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#64748b" />
            </marker>
          </defs>

          {/* Draw Curved Links between Central Node and Radial Nodes */}
          {radialNodes.map((rn) => {
            const isHighlighted = isNodeHighlighted(rn.type, rn.key);
            return (
              <g
                key={rn.key}
                className="transition-opacity duration-300"
                style={{ opacity: isHighlighted ? 1 : 0.25 }}
              >
                {/* Flowing curved bezier path */}
                <path
                  d={rn.curvePath}
                  fill="none"
                  stroke="#475569"
                  strokeWidth="1.5"
                  strokeDasharray="4, 4"
                  markerEnd="url(#arrow)"
                />
                {/* Edge Annotation Text */}
                <text
                  x={rn.labelX}
                  y={rn.labelY}
                  fill="#94a3b8"
                  fontSize="9.5"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {rn.linkText}
                </text>
              </g>
            );
          })}

          {/* Central Scalloped Node (Image 4) */}
          <g
            transform={`translate(${center.x}, ${center.y})`}
            className="cursor-pointer transition-all duration-200"
            onClick={() => setSelectedKey('LGD_BLOCK_53218')}
            style={{
              opacity: isNodeHighlighted('lgd', 'LGD_BLOCK_53218') ? 1 : 0.35,
            }}
          >
            {/* Pulsing ambient blue glow halo */}
            <circle r={64} fill="#2563eb" fillOpacity={0.16} className="animate-pulse" />

            {/* Scalloped 8-lobed badge container */}
            <path
              d="M 52 0 
                 A 26 26 0 0 1 36.8 36.8 
                 A 26 26 0 0 1 0 52 
                 A 26 26 0 0 1 -36.8 36.8 
                 A 26 26 0 0 1 -52 0 
                 A 26 26 0 0 1 -36.8 -36.8 
                 A 26 26 0 0 1 0 -52 
                 A 26 26 0 0 1 36.8 -36.8 
                 A 26 26 0 0 1 52 0 Z"
              fill="#080e1e"
              stroke="#3b82f6"
              strokeWidth="2.5"
              style={{
                filter:
                  selectedKey === 'LGD_BLOCK_53218'
                    ? 'drop-shadow(0 0 24px rgba(59, 130, 246, 0.9))'
                    : 'drop-shadow(0 0 14px rgba(59, 130, 246, 0.6))',
              }}
            />

            {/* 3D Isometric Blue Cube Symbol */}
            <g transform="translate(0, -18)">
              <polygon points="0,-10 9,-5 9,5 0,10 -9,5 -9,-5" fill="#3b82f6" />
              <polygon points="0,-10 9,-5 0,0 -9,-5" fill="#60a5fa" />
              <polygon points="0,0 9,-5 9,5 0,10" fill="#2563eb" />
              <polygon points="0,0 -9,-5 -9,5 0,10" fill="#1d4ed8" />
            </g>

            {/* Text Centered INSIDE the scalloped badge */}
            <text
              y={10}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="11.5"
              fontWeight="bold"
              fontFamily="monospace"
              letterSpacing="0.02em"
            >
              LGD_Block: 53218
            </text>
            <text
              y={25}
              textAnchor="middle"
              fill="#93c5fd"
              fontSize="10"
              fontFamily="sans-serif"
            >
              (Dahanu)
            </text>
          </g>

          {/* Radial Nodes with Distinct Colored Ambient Glows */}
          {radialNodes.map((rn) => {
            const isHighlighted = isNodeHighlighted(rn.type, rn.key);
            const isSelected = selectedKey === rn.key;
            const halfW = rn.width / 2;

            return (
              <g
                key={rn.key}
                transform={`translate(${rn.x}, ${rn.y})`}
                className="cursor-pointer transition-all duration-300"
                onClick={() => setSelectedKey(rn.key)}
                style={{ opacity: isHighlighted ? 1 : 0.25 }}
              >
                {/* Outer Glow Capsule */}
                <rect
                  x={-halfW}
                  y={-18}
                  width={rn.width}
                  height={36}
                  rx={18}
                  fill="#090f1d"
                  stroke={rn.borderColor}
                  strokeWidth={isSelected ? 2.5 : 1.8}
                  style={{
                    filter: `drop-shadow(0 0 ${isSelected ? 20 : 12}px ${rn.borderColor}99)`,
                  }}
                />
                <text
                  y={4}
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="sans-serif"
                >
                  {rn.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Bottom Floating Filter Capsule (Matching User Uploaded media_1790999309521.png) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <div className="glass-panel bg-slate-900/90 backdrop-blur-2xl border border-white/10 px-2 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xl">
            {['All', 'LGD Codes', 'PFMS Heads', 'Schemes', 'Tokens'].map((filterName) => {
              const isActive = activeFilter === filterName;
              return (
                <button
                  key={filterName}
                  type="button"
                  onClick={() => handleFilterClick(filterName)}
                  className={`px-4 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-950 font-bold shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-100'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 font-medium'
                  }`}
                >
                  {filterName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Inspector Panel (Matching Image 4) */}
        <div className="absolute top-6 right-6 z-20 w-68 glass-panel p-5 rounded-3xl border border-white/15 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-100 tracking-tight">Inspector</span>
            <span className="glass-pill px-2.5 py-0.5 rounded-full text-[10px] text-purple-300 font-mono border border-purple-400/30">
              {activeDetails.category}
            </span>
          </div>

          {/* Cypher graph properties */}
          <div className="space-y-1.5 text-xs font-mono">
            <span className="text-[10px] uppercase text-slate-400 font-sans font-semibold tracking-wider block">
              Cypher graph properties
            </span>
            {activeDetails.properties.map((prop, idx) => (
              <div key={idx} className="flex justify-between items-center text-slate-300">
                <span className="text-slate-500">{prop.label} :</span>
                <strong className={prop.color || 'text-slate-200'}>{prop.value}</strong>
              </div>
            ))}
          </div>

          {/* Compliance & Privacy Pill Badge */}
          <div className="pt-1">
            <span className="text-[10px] uppercase text-slate-400 font-sans font-semibold tracking-wider block mb-1.5">
              Data Governance Status
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/40 text-[10px] font-medium inline-block">
              {activeDetails.badge}
            </span>
          </div>

          {/* Glowing Mint Action Button: Trace Provenance (Image 4) */}
          <button
            type="button"
            onClick={() => onOpenDrawer(activeDetails.voucherId)}
            className="w-full py-2.5 px-4 rounded-full bg-emerald-300 hover:bg-emerald-200 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-400/30 transition-all cursor-pointer"
          >
            <span>Trace Provenance</span>
          </button>
        </div>

        {/* Bottom-Right Tactical Radar Widget (Matching Image 4) */}
        <div className="absolute bottom-6 right-6 z-10 pointer-events-none hidden lg:block">
          <div className="w-36 h-36 rounded-2xl glass-panel p-2 flex flex-col items-center justify-center relative border border-white/10 shadow-xl">
            <div className="w-24 h-24 rounded-full border border-rose-500/40 flex items-center justify-center relative">
              <div className="w-16 h-16 rounded-full border border-rose-500/50 flex items-center justify-center bg-rose-500/10">
                <div className="w-8 h-8 rounded-full border border-rose-500/60" />
              </div>
              {/* Radar sweep radial arm */}
              <div className="absolute inset-0 rounded-full border-t border-rose-400 animate-radar" />
            </div>
            <div className="text-[8px] font-mono text-slate-500 flex justify-between w-full px-1 mt-1">
              <span>-35.42.21&apos;</span>
              <span>+38.0 0684</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
