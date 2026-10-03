import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  X,
  AlertTriangle,
  Boxes,
  Milestone,
  ChevronLeft,
  ChevronRight,
  Navigation,
  Target,
} from 'lucide-react';
import { GEO_SPATIAL_FEATURES } from '../../data/mockGovernanceData';
import type { GeoAssetFeature } from '../../types/governance';

interface ConvergenceMapProps {
  onOpenDrawer: (voucherId: string) => void;
  onNavigateToGraph: (nodeId?: string) => void;
  targetFocus?: string | null;
}

const FOCUS_LOCATIONS: Record<string, { center: [number, number]; zoom: number; label: string }> = {
  all: { center: [21.7679, 78.8718], zoom: 5, label: 'All India' },
  palghar: { center: [19.9824, 72.7482], zoom: 11, label: 'Palghar (MH)' },
  sehore: { center: [23.0189, 76.5412], zoom: 11, label: 'Sehore (MP)' },
};

export const ConvergenceMap: React.FC<ConvergenceMapProps> = ({
  onOpenDrawer,
  onNavigateToGraph,
  targetFocus,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Active Layer Toggles
  const [activeLayer, setActiveLayer] = useState<'roads' | 'storage' | 'duplicates'>('duplicates');
  const [selectedFeature, setSelectedFeature] = useState<GeoAssetFeature | null>(
    GEO_SPATIAL_FEATURES[0]
  );

  const overlapZones = GEO_SPATIAL_FEATURES.filter((f) => f.type === 'overlap_zone');
  const currentZoneIdx = overlapZones.findIndex((z) => z.id === selectedFeature?.id);

  // Jump camera focus to a feature with smooth animation
  const handleJumpToFeature = useCallback(
    (feature: GeoAssetFeature) => {
      setSelectedFeature(feature);
      if (feature.type === 'overlap_zone' && activeLayer !== 'duplicates') {
        setActiveLayer('duplicates');
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo(feature.coordinates, 12, {
          duration: 1.3,
          easeLinearity: 0.25,
        });
      }
    },
    [activeLayer]
  );

  const handleNextZone = () => {
    const nextIdx = (currentZoneIdx + 1) % overlapZones.length;
    handleJumpToFeature(overlapZones[nextIdx]);
  };

  const handlePrevZone = () => {
    const prevIdx = (currentZoneIdx - 1 + overlapZones.length) % overlapZones.length;
    handleJumpToFeature(overlapZones[prevIdx]);
  };

  // Helper to create custom SVG divIcon matching tactical aesthetic (Image 5)
  const createCustomDivIcon = (feature: GeoAssetFeature, isSelected: boolean) => {
    if (feature.type === 'overlap_zone') {
      const amount = feature.metrics?.overlapAmountDisplay?.replace(' Redundant', '') || '₹3.8 Cr';
      const matchPct = feature.block === 'Dahanu' ? '98%' : feature.block === 'Talasari' ? '96%' : '99%';

      return L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer pointer-events-auto group" style="width: 220px; height: 220px;">
            <!-- Outer radar ring 1 -->
            <div class="absolute inset-0 rounded-full border ${
              isSelected ? 'border-rose-400/60 ring-2 ring-rose-500/30' : 'border-rose-500/30'
            } flex items-center justify-center pointer-events-none transition-all duration-300">
              <!-- Radar ring 2 -->
              <div class="w-36 h-36 rounded-full border ${
                isSelected ? 'border-rose-400/70 bg-rose-500/10' : 'border-rose-500/45'
              } flex items-center justify-center relative transition-all duration-300">
                <!-- Radar ring 3 & Core -->
                <div class="w-20 h-20 rounded-full border ${
                  isSelected
                    ? 'border-rose-400 bg-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.5)]'
                    : 'border-rose-500/65 bg-rose-500/15'
                } flex items-center justify-center">
                  <!-- Pinging center dot -->
                  <div class="w-4 h-4 rounded-full bg-rose-500 animate-ping opacity-75"></div>
                  <div class="w-3.5 h-3.5 rounded-full ${
                    isSelected
                      ? 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]'
                      : 'bg-rose-400 shadow-lg shadow-rose-500'
                  } absolute"></div>
                </div>
                <!-- Radar sweep radial arm -->
                <div class="absolute inset-0 rounded-full border-t-2 border-rose-400 animate-radar"></div>
              </div>
            </div>
            <!-- Floating Target Badge centered above the core -->
            <div class="absolute top-4 whitespace-nowrap px-3 py-1 rounded-full ${
              isSelected
                ? 'bg-slate-900 border-2 border-rose-400 text-white shadow-[0_0_25px_rgba(244,63,94,0.6)] scale-105'
                : 'bg-slate-950/95 border border-rose-500/60 text-rose-300 shadow-2xl'
            } text-[10px] font-mono pointer-events-auto hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer">
              <span class="w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-rose-400'} animate-pulse"></span>
              <span>Overlap: ${amount} (${matchPct} Match)</span>
              ${isSelected ? '<span class="text-[9px] text-rose-400 font-bold ml-0.5 tracking-wider">[FOCUS]</span>' : ''}
            </div>
          </div>
        `,
        iconSize: [220, 220],
        iconAnchor: [110, 110],
      });
    }

    if (feature.type === 'warehouse') {
      return L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div class="flex items-center justify-center w-6 h-6 rounded-full ${
            isSelected
              ? 'bg-emerald-400 text-slate-950 ring-4 ring-emerald-400/40 scale-125'
              : 'bg-emerald-500/20 border border-emerald-400 text-emerald-300'
          } shadow-lg cursor-pointer glow-mint transition-all">
            <div class="w-2 h-2 rounded-full ${isSelected ? 'bg-slate-950' : 'bg-emerald-400'}"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
    }

    return L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div class="flex items-center justify-center w-5 h-5 rounded-full ${
          isSelected
            ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-400/40 scale-125'
            : 'bg-cyan-500/20 border border-cyan-400 text-cyan-300'
        } shadow-md cursor-pointer glow-blue transition-all">
          <div class="w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-slate-950' : 'bg-cyan-400'}"></div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [19.9824, 72.7482],
        zoom: 11,
        zoomControl: false,
      });

      // Dark Matter Carto Tiles with API key
      const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY || 'cb1_489g_1_fe2ecb2e1079b256ce1afb3f';
      const tileUrl = cartoApiKey
        ? `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${cartoApiKey}`
        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, {
        attribution: '&copy; CARTO &bull; LGD Master 2026',
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle window resize to update Leaflet canvas dimensions smoothly
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update Layers based on activeLayer toggle and selectedFeature
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    GEO_SPATIAL_FEATURES.forEach((feature) => {
      const shouldShow =
        activeLayer === 'duplicates' ||
        (activeLayer === 'roads' && feature.type === 'road') ||
        (activeLayer === 'storage' && feature.type === 'warehouse');

      if (!shouldShow) return;

      const isSelected = selectedFeature?.id === feature.id;

      // Add road polylines
      if (feature.type === 'road' && feature.polylineCoords) {
        const polyline = L.polyline(feature.polylineCoords, {
          color: isSelected ? '#38bdf8' : '#22d3ee',
          weight: isSelected ? 5 : 3.5,
          opacity: isSelected ? 1 : 0.85,
          dashArray: '3, 6',
        }).addTo(layerGroup);

        polyline.on('click', () => handleJumpToFeature(feature));
      }

      // Add custom SVG marker
      const marker = L.marker(feature.coordinates, {
        icon: createCustomDivIcon(feature, isSelected),
        zIndexOffset: isSelected ? 1000 : 0,
      }).addTo(layerGroup);

      marker.on('click', () => {
        handleJumpToFeature(feature);
      });
    });
  }, [activeLayer, selectedFeature?.id, handleJumpToFeature]);

  // Handle external focus target
  useEffect(() => {
    if (!mapInstanceRef.current || !targetFocus) return;
    if (targetFocus.toLowerCase().includes('palghar')) {
      mapInstanceRef.current.flyTo(FOCUS_LOCATIONS.palghar.center, FOCUS_LOCATIONS.palghar.zoom, {
        duration: 1.5,
      });
      const palgharFeature = GEO_SPATIAL_FEATURES.find((f) => f.district === 'Palghar');
      if (palgharFeature) {
        const timer = setTimeout(() => setSelectedFeature(palgharFeature), 50);
        return () => clearTimeout(timer);
      }
    } else if (targetFocus.toLowerCase().includes('sehore')) {
      mapInstanceRef.current.flyTo(FOCUS_LOCATIONS.sehore.center, FOCUS_LOCATIONS.sehore.zoom, {
        duration: 1.5,
      });
      const sehoreFeature = GEO_SPATIAL_FEATURES.find((f) => f.district === 'Sehore');
      if (sehoreFeature) {
        const timer = setTimeout(() => setSelectedFeature(sehoreFeature), 50);
        return () => clearTimeout(timer);
      }
    }
  }, [targetFocus]);

  const renderInspectorCard = () => {
    if (!selectedFeature) return null;

    return (
      <div className="glass-panel p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/15 shadow-2xl space-y-2.5 sm:space-y-3 animate-in fade-in duration-200">
        {/* Header Capsule & Zone Nav Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="glass-pill px-2.5 py-0.5 rounded-full text-[10px] font-mono text-slate-300 uppercase tracking-wider">
              DISTRICT: {selectedFeature.district ? selectedFeature.district.toUpperCase() : 'PALGHAR'} ({selectedFeature.state === 'Maharashtra' ? 'MH' : 'MP'})
            </span>
            {currentZoneIdx >= 0 && (
              <span className="text-[9.5px] font-mono text-rose-400 bg-rose-500/15 px-1.5 py-0.5 rounded-full border border-rose-500/30">
                {currentZoneIdx + 1}/{overlapZones.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-0.5">
            {currentZoneIdx >= 0 && (
              <>
                <button
                  type="button"
                  title="Jump to Previous Zone"
                  onClick={handlePrevZone}
                  className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Jump to Next Zone"
                  onClick={handleNextZone}
                  className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
            <button
              type="button"
              title="Close Inspector"
              onClick={() => setSelectedFeature(null)}
              className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Asset Title & Metadata */}
        <div>
          <h3 className="font-bold text-sm sm:text-base text-slate-100 tracking-tight">
            {selectedFeature.type === 'road' ? selectedFeature.name : `${selectedFeature.block || selectedFeature.name} Block Storage Hub`}
          </h3>
          <div className="text-xs text-slate-400 mt-1 space-y-0.5">
            <div>Census Pop: <strong className="text-slate-200 font-sans">{selectedFeature.metrics?.censusPopulation ? selectedFeature.metrics.censusPopulation.toLocaleString() : '142,000'}</strong></div>
            <div>LGD: <strong className="text-blue-400 font-mono">{selectedFeature.lgdCode || '04812'}</strong></div>
            {selectedFeature.metrics?.overlapAmountDisplay && (
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-slate-500 font-sans">Redundant:</span>
                <strong className="text-rose-400 font-mono">{selectedFeature.metrics.overlapAmountDisplay}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons: Inspect Proof, Open Graph, Jump Next Zone */}
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onOpenDrawer(selectedFeature.linkedVoucherId || 'Txn_84920')}
              className="w-full py-2 px-3 rounded-full bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-400/30 hover:bg-emerald-300 transition-all cursor-pointer"
            >
              <span>Inspect Proof</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateToGraph(selectedFeature.lgdCode ? `LGD_BLOCK_${selectedFeature.lgdCode}` : undefined)}
              className="w-full py-2 px-3 rounded-full glass-pill text-slate-200 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Open Graph</span>
            </button>
          </div>

          {currentZoneIdx >= 0 && (
            <button
              type="button"
              onClick={handleNextZone}
              className="w-full py-1.5 px-3 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-white/10 text-slate-300 hover:text-white text-[10px] sm:text-[11px] font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Navigation className="w-3 h-3 text-cyan-400" />
              <span>Jump Next Zone ({overlapZones[(currentZoneIdx + 1) % overlapZones.length]?.block})</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-3 relative animate-in fade-in duration-300">
      {/* Map Card Container (Matching Image 5) */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl relative h-[420px] sm:h-[520px] lg:h-[620px] border border-white/10">
        {/* Tactical Corner HUD Accents (Image 5) */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-[400] text-[9px] sm:text-[10px] font-mono text-slate-500 pointer-events-none flex items-center gap-1.5 sm:gap-2">
          <span>+</span>
          <span>60°071'N</span>
        </div>
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-[400] text-[9px] sm:text-[10px] font-mono text-slate-500 pointer-events-none flex items-center gap-1.5 sm:gap-2">
          <span>60°075'E</span>
          <span>+</span>
        </div>
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-[400] text-[9px] sm:text-[10px] font-mono text-rose-500/80 pointer-events-none flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>+</span>
        </div>
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-[400] text-[9px] sm:text-[10px] font-mono text-rose-400/80 pointer-events-none">
          +0809700
        </div>

        {/* Top Floating Controls (Layer Toggles & Zone Focus Jump) */}
        <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[400] flex flex-col items-center gap-1.5 sm:gap-2 pointer-events-none max-w-[calc(100vw-2rem)]">
          {/* Layer Pills */}
          <div className="glass-pill px-1.5 sm:px-2 py-1 rounded-full flex items-center gap-0.5 sm:gap-1 shadow-2xl pointer-events-auto max-w-full overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveLayer('roads')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                activeLayer === 'roads'
                  ? 'bg-white/15 text-white shadow-inner ring-1 ring-white/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Milestone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Roads</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveLayer('storage')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                activeLayer === 'storage'
                  ? 'bg-white/15 text-white shadow-inner ring-1 ring-white/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Boxes className="w-3.5 h-3.5 text-emerald-400" />
              <span>Agro-Storage</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveLayer('duplicates')}
              className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                activeLayer === 'duplicates'
                  ? 'bg-rose-500/25 border border-rose-400/40 text-rose-200 shadow-md shadow-rose-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-0.5" />
              <span>Duplicate Zones</span>
            </button>
          </div>

          {/* Quick-Jump Zone Focus Bar */}
          {activeLayer === 'duplicates' && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-950/90 border border-white/10 backdrop-blur-xl shadow-2xl animate-in fade-in duration-200 pointer-events-auto max-w-full overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1 px-2 text-[10px] font-mono text-slate-400 shrink-0">
                <Target className="w-3 h-3 text-rose-400 animate-pulse" />
                <span className="hidden sm:inline">Jump Zone:</span>
              </div>
              {overlapZones.map((zone) => {
                const isSelected = selectedFeature?.id === zone.id;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => handleJumpToFeature(zone)}
                    className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer select-none shrink-0 ${
                      isSelected
                        ? 'bg-rose-500/30 border border-rose-400/70 text-white font-bold shadow-[0_0_15px_rgba(244,63,94,0.4)] scale-105'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-rose-400 animate-ping' : 'bg-slate-500'}`} />
                    <span>{zone.block}</span>
                    <span className="text-[10px] text-slate-500 hidden md:inline">
                      ({zone.district})
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Leaflet Map Canvas */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Popover Card: Dynamic Inspector (Desktop lg+ screens only, avoiding map obstruction) */}
        {selectedFeature && (
          <div className="hidden lg:block absolute top-24 right-6 w-76 z-[400]">
            {renderInspectorCard()}
          </div>
        )}
      </div>

      {/* Mobile & Tablet Inspector Panel (Stacked cleanly below map on < lg screens) */}
      <div className="block lg:hidden">
        {selectedFeature ? (
          renderInspectorCard()
        ) : (
          <div className="glass-panel p-3 rounded-2xl border border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <Target className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Select a zone or marker to inspect</span>
            </span>
            <button
              type="button"
              onClick={() => handleJumpToFeature(overlapZones[0])}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 text-slate-200 text-[10px] font-mono transition-colors shrink-0 cursor-pointer"
            >
              Inspect {overlapZones[0]?.block || 'Dahanu'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
