import React, { useState, useEffect } from 'react';
import { Filter, Sparkles, RefreshCw, MapPin } from 'lucide-react';

interface KnowledgeGraphExplorerProps {
  onOpenDrawer: (voucherId: string) => void;
  selectedNodeId?: string | null;
}

type FilterType = 'All' | 'LGD Codes' | 'PFMS Heads' | 'Schemes' | 'Tokens';

interface NodeDetails {
  id: string;
  name: string;
  category: string;
  badge: string;
  voucherId: string;
  properties: { label: string; value: string; color?: string }[];
}

interface FilterMeta {
  title: string;
  hudText: string;
  dotColor: string;
  activeNodeKeys: string[];
  defaultKey: string;
  nodeCount: number;
  linkCount: number;
  description: string;
}

const FILTER_CONFIG: Record<FilterType, FilterMeta> = {
  'All': {
    title: 'Full Knowledge Graph',
    hudText: 'Full Ontological View • 5 Nodes & 4 Directed Graph Relations',
    dotColor: 'bg-blue-400',
    activeNodeKeys: ['LGD_BLOCK_53218', 'PFMS_HEAD_2401', 'DPDP_TOKEN', 'ENAM_YARD', 'PMGSY_ROAD'],
    defaultKey: 'PFMS_HEAD_2401',
    nodeCount: 5,
    linkCount: 4,
    description: 'Cross-ministry convergence across 54 Union Ministry lakehouses.',
  },
  'LGD Codes': {
    title: 'LGD Code Resolution',
    hudText: 'LGD Master Hierarchy • Isolated Block 53218 (Dahanu) & Spatial Boundary',
    dotColor: 'bg-emerald-400',
    activeNodeKeys: ['LGD_BLOCK_53218', 'ENAM_YARD'],
    defaultKey: 'LGD_BLOCK_53218',
    nodeCount: 2,
    linkCount: 1,
    description: 'Local Government Directory anchor pinning physical cadastre boundary.',
  },
  'PFMS Heads': {
    title: 'PFMS Major Heads Audit',
    hudText: 'PFMS Head Audit • Major Head 2401 (Crop) vs Head 2501 (Rural Dev)',
    dotColor: 'bg-amber-400',
    activeNodeKeys: ['LGD_BLOCK_53218', 'PFMS_HEAD_2401', 'PMGSY_ROAD'],
    defaultKey: 'PFMS_HEAD_2401',
    nodeCount: 3,
    linkCount: 2,
    description: 'Public Financial Management System expenditure conflict audit.',
  },
  'Schemes': {
    title: 'Ministry Scheme Convergence',
    hudText: 'Scheme Overlap Audit • MoA&FW-RKVY vs MoRD-PMGSY Convergence',
    dotColor: 'bg-cyan-400',
    activeNodeKeys: ['LGD_BLOCK_53218', 'ENAM_YARD', 'PMGSY_ROAD'],
    defaultKey: 'PMGSY_ROAD',
    nodeCount: 3,
    linkCount: 2,
    description: 'Dual-ministry capital asset overlap and pavement connectivity audit.',
  },
  'Tokens': {
    title: 'DPDP Privacy Tokens',
    hudText: 'DPDP Act 2023 Privacy Shield • Zero-Knowledge Tokenized Beneficiary Vault',
    dotColor: 'bg-purple-400',
    activeNodeKeys: ['LGD_BLOCK_53218', 'DPDP_TOKEN'],
    defaultKey: 'DPDP_TOKEN',
    nodeCount: 2,
    linkCount: 1,
    description: 'Zero-Knowledge beneficiary identity protection under DPDP Act 2023.',
  },
};

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
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
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

  // Handle clicking on the bottom filter pill bar
  const handleFilterClick = (filterName: FilterType) => {
    setActiveFilter(filterName);
    const meta = FILTER_CONFIG[filterName];
    setSelectedKey(meta.defaultKey);
  };

  const currentFilterMeta = FILTER_CONFIG[activeFilter];

  const isNodeActive = (nodeKey: string) => {
    return currentFilterMeta.activeNodeKeys.includes(nodeKey);
  };

  // Responsive screenMode to scale the graph canvas beautifully on mobile (<768px), tablet, and desktop
  const [screenMode, setScreenMode] = useState<'mobile' | 'tablet' | 'desktop'>(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return 'mobile';
      if (window.innerWidth < 1024) return 'tablet';
    }
    return 'desktop';
  });

  useEffect(() => {
    const updateScreenMode = () => {
      if (window.innerWidth < 768) {
        setScreenMode('mobile');
      } else if (window.innerWidth < 1024) {
        setScreenMode('tablet');
      } else {
        setScreenMode('desktop');
      }
    };

    updateScreenMode();
    window.addEventListener('resize', updateScreenMode);
    return () => window.removeEventListener('resize', updateScreenMode);
  }, []);

  const isMobile = screenMode === 'mobile';

  // Center node coordinate (mobile: centered in 460x520 portrait; desktop/tablet: landscape)
  const center = isMobile ? { x: 230, y: 260 } : { x: 480, y: 310 };

  // Radial nodes coordinates matching viewport (prominent portrait layout on mobile, landscape on desktop)
  const radialNodes = isMobile
    ? [
        {
          key: 'PFMS_HEAD_2401',
          label: 'PFMS Head 2401',
          borderColor: '#f59e0b',
          arrowMarker: 'url(#arrow-amber)',
          x: 98,
          y: 105,
          width: 155,
          height: 42,
          type: 'pfms',
          curvePath: 'M 195 225 C 165 210, 135 175, 115 130',
          linkText: '[:SPATIALLY_IDENTICAL]',
          labelX: 135,
          labelY: 185,
        },
        {
          key: 'DPDP_TOKEN',
          label: 'DPDP Beneficiary',
          sublabel: 'Token: TKN-883F',
          borderColor: '#c084fc',
          arrowMarker: 'url(#arrow-purple)',
          x: 362,
          y: 105,
          width: 160,
          height: 44,
          type: 'token',
          curvePath: 'M 265 225 C 295 210, 325 175, 345 130',
          linkText: '[:DUPLICATE_ASSET]',
          labelX: 325,
          labelY: 185,
        },
        {
          key: 'ENAM_YARD',
          label: 'e-NAM Yard',
          sublabel: 'MH-012',
          borderColor: '#34d399',
          arrowMarker: 'url(#arrow-emerald)',
          x: 98,
          y: 415,
          width: 155,
          height: 44,
          type: 'scheme',
          curvePath: 'M 195 295 C 165 310, 135 345, 115 390',
          linkText: '[:SPATIALLY_IDENTICAL]',
          labelX: 135,
          labelY: 345,
        },
        {
          key: 'PMGSY_ROAD',
          label: 'PMGSY Road Link',
          borderColor: '#38bdf8',
          arrowMarker: 'url(#arrow-cyan)',
          x: 362,
          y: 415,
          width: 160,
          height: 42,
          type: 'scheme',
          curvePath: 'M 265 295 C 295 310, 325 345, 345 390',
          linkText: '[:DUPLICATE_ASSET]',
          labelX: 325,
          labelY: 345,
        },
      ]
    : [
        {
          key: 'PFMS_HEAD_2401',
          label: 'PFMS Head 2401',
          borderColor: '#f59e0b',
          arrowMarker: 'url(#arrow-amber)',
          x: 270,
          y: 150,
          width: 165,
          height: 38,
          type: 'pfms',
          curvePath: 'M 435 275 C 380 270, 325 215, 305 174',
          linkText: '[:SPATIALLY_IDENTICAL {0.99}]',
          labelX: 370,
          labelY: 235,
        },
        {
          key: 'DPDP_TOKEN',
          label: 'DPDP Beneficiary',
          sublabel: 'Token: TKN-883F',
          borderColor: '#c084fc',
          arrowMarker: 'url(#arrow-purple)',
          x: 690,
          y: 150,
          width: 200,
          height: 44,
          type: 'token',
          curvePath: 'M 525 275 C 580 270, 635 215, 655 174',
          linkText: '[:DUPLICATE_ASSET]',
          labelX: 590,
          labelY: 235,
        },
        {
          key: 'ENAM_YARD',
          label: 'e-NAM Yard',
          sublabel: 'MH-012',
          borderColor: '#34d399',
          arrowMarker: 'url(#arrow-emerald)',
          x: 270,
          y: 470,
          width: 165,
          height: 44,
          type: 'scheme',
          curvePath: 'M 435 345 C 380 350, 325 405, 305 446',
          linkText: '[:SPATIALLY_IDENTICAL {0.99}]',
          labelX: 370,
          labelY: 385,
        },
        {
          key: 'PMGSY_ROAD',
          label: 'PMGSY Road Link',
          borderColor: '#38bdf8',
          arrowMarker: 'url(#arrow-cyan)',
          x: 690,
          y: 470,
          width: 175,
          height: 38,
          type: 'scheme',
          curvePath: 'M 525 345 C 580 350, 635 405, 655 446',
          linkText: '[:DUPLICATE_ASSET]',
          labelX: 590,
          labelY: 385,
        },
      ];

  const activeDetails = NODE_DETAILS_MAP[selectedKey] || NODE_DETAILS_MAP.PFMS_HEAD_2401;

  const renderInspector = () => (
    <>
      <div className="flex items-center justify-between">
        <span className="font-bold text-sm text-slate-100 tracking-tight">Inspector</span>
        <span className="glass-pill px-2.5 py-0.5 rounded-full text-[10px] text-purple-300 font-mono border border-purple-400/30">
          {activeDetails.category}
        </span>
      </div>

      {/* Active Filter Scope Indicator inside Inspector */}
      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 space-y-1">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1 text-slate-300 font-semibold">
            <Filter className="w-3 h-3 text-blue-400" />
            {currentFilterMeta.title}
          </span>
          <span className="text-emerald-400">{currentFilterMeta.nodeCount} / 5 Nodes</span>
        </div>
        <p className="text-[9.5px] text-slate-400 leading-tight">
          {currentFilterMeta.description}
        </p>
      </div>

      {/* Cypher graph properties */}
      <div className="space-y-1.5 text-xs font-mono">
        <span className="text-[10px] uppercase text-slate-400 font-sans font-semibold tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          Cypher Node Properties
        </span>
        {activeDetails.properties.map((prop, idx) => (
          <div key={idx} className="flex justify-between items-center text-slate-300 text-[11px]">
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
    </>
  );

  const svgViewBox = isMobile ? '0 0 460 520' : screenMode === 'tablet' ? '140 70 680 480' : '0 0 1200 640';

  return (
    <div className="w-full max-w-6xl mx-auto space-y-3 animate-in fade-in duration-300 relative">
      {/* Main Canvas Container (Responsive height on mobile, 640px on lg screens) */}
      <div className="glass-panel rounded-3xl p-3 sm:p-4 shadow-2xl relative overflow-hidden h-[480px] sm:h-[540px] lg:h-[640px] border border-white/10">
        {/* Dynamic HUD Indicator that changes with the bottom filter bar */}
        <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-slate-950/90 border border-white/10 shadow-2xl backdrop-blur-xl transition-all max-w-[calc(100vw-2rem)]">
          <div className={`w-2 h-2 rounded-full ${currentFilterMeta.dotColor} animate-pulse shrink-0`} />
          <span className="text-[10px] sm:text-[11px] font-mono text-slate-200 truncate">
            {currentFilterMeta.hudText}
          </span>
          {activeFilter !== 'All' && (
            <button
              type="button"
              onClick={() => handleFilterClick('All')}
              className="ml-1 sm:ml-2 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">Show All</span>
            </button>
          )}
        </div>

        {/* SVG Node-Link Canvas */}
        <svg className="w-full h-full select-none" viewBox={svgViewBox}>
          <defs>
            {/* Subtle Cypher Graph Grid */}
            <pattern id="graph-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.025)" strokeWidth="1" />
            </pattern>

            {/* Default arrow marker */}
            <marker
              id="arrow-default"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#475569" />
            </marker>

            {/* Colored arrow markers for active states */}
            <marker
              id="arrow-amber"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
            </marker>
            <marker
              id="arrow-purple"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#c084fc" />
            </marker>
            <marker
              id="arrow-emerald"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#34d399" />
            </marker>
            <marker
              id="arrow-cyan"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
            </marker>
          </defs>

          {/* Grid Background */}
          <rect width="100%" height="100%" fill="url(#graph-grid)" />

          {/* Draw Curved Links between Central Node and Radial Nodes */}
          {radialNodes.map((rn) => {
            const isVisible = isNodeActive(rn.key);
            const strokeColor = isVisible && activeFilter !== 'All' ? rn.borderColor : '#475569';
            const marker = isVisible && activeFilter !== 'All' ? rn.arrowMarker : 'url(#arrow-default)';

            return (
              <g
                key={rn.key}
                className="transition-all duration-500 ease-in-out"
                style={{
                  opacity: isVisible ? 1 : 0.08,
                  pointerEvents: isVisible ? 'auto' : 'none',
                }}
              >
                {/* Flowing curved bezier path */}
                <path
                  d={rn.curvePath}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isVisible && activeFilter !== 'All' ? 2 : 1.5}
                  strokeDasharray={isVisible && activeFilter !== 'All' ? 'none' : '4, 4'}
                  markerEnd={marker}
                />
                {/* Edge Annotation Text */}
                <text
                  x={rn.labelX}
                  y={rn.labelY}
                  fill={isVisible && activeFilter !== 'All' ? rn.borderColor : '#94a3b8'}
                  fontSize={isMobile ? "8.5" : "9.5"}
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="font-medium"
                >
                  {rn.linkText}
                </text>
              </g>
            );
          })}

          {/* Central Scalloped Node (Image 4) */}
          <g
            transform={`translate(${center.x}, ${center.y})`}
            className="cursor-pointer transition-all duration-300 ease-in-out"
            onClick={() => setSelectedKey('LGD_BLOCK_53218')}
            style={{
              opacity: isNodeActive('LGD_BLOCK_53218') ? 1 : 0.2,
            }}
          >
            {/* Pulsing ambient blue glow halo */}
            <circle
              r={activeFilter === 'LGD Codes' ? (isMobile ? 68 : 76) : (isMobile ? 56 : 64)}
              fill="#2563eb"
              fillOpacity={activeFilter === 'LGD Codes' ? 0.28 : 0.16}
              className="animate-pulse transition-all duration-500"
            />

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
              strokeWidth={selectedKey === 'LGD_BLOCK_53218' || activeFilter === 'LGD Codes' ? 3 : 2.5}
              style={{
                filter:
                  selectedKey === 'LGD_BLOCK_53218' || activeFilter === 'LGD Codes'
                    ? 'drop-shadow(0 0 28px rgba(59, 130, 246, 0.95))'
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
            const isVisible = isNodeActive(rn.key);
            const isSelected = selectedKey === rn.key;
            const halfW = rn.width / 2;
            const halfH = rn.height / 2;

            return (
              <g
                key={rn.key}
                transform={`translate(${rn.x}, ${rn.y})`}
                className="cursor-pointer transition-opacity duration-500 ease-in-out"
                onClick={() => isVisible && setSelectedKey(rn.key)}
                style={{
                  opacity: isVisible ? 1 : 0.08,
                  pointerEvents: isVisible ? 'auto' : 'none',
                }}
              >
                {/* Scaled Inner Group so CSS scaling doesn't wipe SVG translation */}
                <g
                  className="transition-transform duration-300 ease-out"
                  style={{
                    transform: isVisible && isSelected ? 'scale(1.06)' : isVisible ? 'scale(1)' : 'scale(0.92)',
                    transformOrigin: '0px 0px',
                  }}
                >
                  {/* Subtle Neon Edge Halo (Zero Light-Bleed) */}
                  <rect
                    x={-halfW - 3}
                    y={-halfH - 3}
                    width={rn.width + 6}
                    height={rn.height + 6}
                    rx={halfH + 3}
                    fill={rn.borderColor}
                    fillOpacity={isVisible ? (isSelected ? 0.3 : 0.15) : 0}
                    className="transition-all duration-300 pointer-events-none"
                    style={{
                      filter: 'blur(5px)',
                    }}
                  />

                  {/* Active pulse ring when filtered or selected */}
                  {isVisible && (isSelected || activeFilter !== 'All') && (
                    <rect
                      x={-halfW - 5}
                      y={-halfH - 5}
                      width={rn.width + 10}
                      height={rn.height + 10}
                      rx={halfH + 5}
                      fill="none"
                      stroke={rn.borderColor}
                      strokeWidth={1}
                      strokeOpacity={0.4}
                      className="animate-pulse pointer-events-none"
                    />
                  )}

                  {/* Outer Glow Capsule */}
                  <rect
                    x={-halfW}
                    y={-halfH}
                    width={rn.width}
                    height={rn.height}
                    rx={halfH}
                    fill="#090f1d"
                    stroke={rn.borderColor}
                    strokeWidth={isSelected ? 2.6 : 1.8}
                    style={{
                      filter: `drop-shadow(0 0 ${isSelected ? 20 : 10}px ${rn.borderColor}${isSelected ? 'dd' : '88'})`,
                    }}
                  />

                  {rn.sublabel ? (
                    <>
                      <text
                        y={-4}
                        textAnchor="middle"
                        fill="#f8fafc"
                        fontSize={isMobile ? "12" : "11"}
                        fontWeight="600"
                        fontFamily="sans-serif"
                      >
                        {rn.label}
                      </text>
                      <text
                        y={12}
                        textAnchor="middle"
                        fill={rn.key === 'ENAM_YARD' ? '#6ee7b7' : '#d8b4fe'}
                        fontSize={isMobile ? "10" : "9.5"}
                        fontWeight="500"
                        fontFamily="monospace"
                      >
                        {rn.sublabel}
                      </text>
                    </>
                  ) : (
                    <text
                      y={4}
                      textAnchor="middle"
                      fill="#f8fafc"
                      fontSize={isMobile ? "12" : "11"}
                      fontWeight="600"
                      fontFamily="sans-serif"
                    >
                      {rn.label}
                    </text>
                  )}
                </g>
              </g>
            );
          })}
        </svg>

        {/* Bottom Floating Filter Capsule (Smooth swipe on mobile, centered on desktop) */}
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 max-w-[calc(100vw-2rem)]">
          <div className="glass-panel bg-slate-900/90 backdrop-blur-2xl border border-white/10 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-1.5 shadow-2xl max-w-full overflow-x-auto no-scrollbar">
            {(['All', 'LGD Codes', 'PFMS Heads', 'Schemes', 'Tokens'] as FilterType[]).map((filterName) => {
              const isActive = activeFilter === filterName;
              return (
                <button
                  key={filterName}
                  type="button"
                  onClick={() => handleFilterClick(filterName)}
                  className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs transition-all cursor-pointer select-none whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-white text-slate-950 font-bold shadow-[0_0_25px_rgba(255,255,255,0.45)] scale-100'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 font-medium'
                  }`}
                >
                  {filterName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Inspector Panel (Matching Image 4 on Desktop lg+ screens) */}
        <div className="hidden lg:block absolute top-6 right-6 z-20 w-68 glass-panel p-5 rounded-3xl border border-white/15 shadow-2xl space-y-4">
          {renderInspector()}
        </div>

        {/* Bottom-Right Tactical Radar Widget (Matching Image 4) */}
        <div className="absolute bottom-6 right-6 z-10 pointer-events-none hidden lg:block">
          <div className="w-40 h-40 rounded-2xl glass-panel p-2.5 flex flex-col items-center justify-center relative border border-white/10 shadow-2xl bg-slate-950/80 backdrop-blur-xl">
            {/* Top-Right Lat/Long with Amber Dot (Image 4) */}
            <div className="absolute top-2.5 right-3 flex items-center gap-1 text-[8.5px] font-mono text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <span>-35.42.21&apos;</span>
            </div>

            {/* Radar Circular Sweep */}
            <div className="w-24 h-24 rounded-full border border-rose-500/30 flex items-center justify-center relative mt-3">
              <div className="w-16 h-16 rounded-full border border-rose-500/40 flex items-center justify-center bg-rose-500/10">
                <div className="w-8 h-8 rounded-full border border-rose-500/50" />
              </div>
              {/* Radar sweep radial arm */}
              <div className="absolute inset-0 rounded-full border-t border-rose-400 animate-radar" />

              {/* Glowing 4-point Sparkle Star (Image 4) */}
              <div className="absolute bottom-1 right-2 text-white/90 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse">
                <Sparkles className="w-3.5 h-3.5 fill-white text-white" />
              </div>
            </div>

            {/* Bottom-Right Lat/Long with Red Pin (Image 4) */}
            <div className="flex items-center justify-end w-full px-1 mt-2 text-[8.5px] font-mono text-slate-400 gap-1">
              <MapPin className="w-2.5 h-2.5 text-rose-500 fill-rose-500 shrink-0" />
              <span>+38.0 0684</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Inspector Panel (Stacked cleanly below canvas on < lg screens) */}
      <div className="block lg:hidden glass-panel p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/15 shadow-2xl space-y-3.5">
        {renderInspector()}
      </div>
    </div>
  );
};
