import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  X,
  AlertTriangle,
  Boxes,
  Milestone,
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

  // Helper to create custom SVG divIcon matching tactical aesthetic (Image 5)
  const createCustomDivIcon = (type: 'warehouse' | 'road' | 'overlap_zone') => {
    if (type === 'overlap_zone') {
      return L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-7 h-7 rounded-full bg-rose-500/30 border border-rose-500 flex items-center justify-center cursor-pointer glow-peach">
              <div class="w-3 h-3 rounded-full bg-rose-500 animate-ping opacity-75"></div>
              <div class="w-2.5 h-2.5 rounded-full bg-rose-400 absolute"></div>
            </div>
            <div class="absolute -top-7 whitespace-nowrap px-2 py-0.5 rounded-full bg-slate-950/90 border border-rose-500/50 text-[10px] font-mono text-rose-300 shadow-xl pointer-events-none">
              Overlap: ₹3.8 Cr (96% Match)
            </div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });
    }

    if (type === 'warehouse') {
      return L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div class="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 shadow-lg cursor-pointer glow-mint">
            <div class="w-2 h-2 rounded-full bg-emerald-400"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
    }

    return L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div class="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-md cursor-pointer glow-blue">
          <div class="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
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

  // Update Layers based on activeLayer toggle
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

      // Add road polylines
      if (feature.type === 'road' && feature.polylineCoords) {
        const polyline = L.polyline(feature.polylineCoords, {
          color: '#22d3ee',
          weight: 3.5,
          opacity: 0.85,
          dashArray: '3, 6',
        }).addTo(layerGroup);

        polyline.on('click', () => setSelectedFeature(feature));
      }

      // Add custom SVG marker
      const marker = L.marker(feature.coordinates, {
        icon: createCustomDivIcon(feature.type),
      }).addTo(layerGroup);

      marker.on('click', () => {
        setSelectedFeature(feature);
      });
    });
  }, [activeLayer]);

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

  return (
    <div className="w-full max-w-6xl mx-auto space-y-3 relative animate-in fade-in duration-300">
      {/* Map Card Container (Matching Image 5) */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl relative h-[620px] border border-white/10">
        {/* Tactical Corner HUD Accents (Image 5) */}
        <div className="absolute top-4 left-4 z-[400] text-[10px] font-mono text-slate-500 pointer-events-none flex items-center gap-2">
          <span>+</span>
          <span>60°071'N</span>
        </div>
        <div className="absolute top-4 right-4 z-[400] text-[10px] font-mono text-slate-500 pointer-events-none flex items-center gap-2">
          <span>60°075'E</span>
          <span>+</span>
        </div>
        <div className="absolute bottom-4 left-4 z-[400] text-[10px] font-mono text-rose-500/80 pointer-events-none flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>+</span>
        </div>
        <div className="absolute bottom-4 right-4 z-[400] text-[10px] font-mono text-rose-400/80 pointer-events-none">
          +0809700
        </div>

        {/* Top Floating Pill Toggle Bar (Matching Image 5) */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[400]">
          <div className="glass-pill px-2 py-1 rounded-full flex items-center gap-1 shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveLayer('roads')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
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
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
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
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeLayer === 'duplicates'
                  ? 'bg-rose-500/25 border border-rose-400/40 text-rose-200 shadow-md shadow-rose-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-0.5" />
              <span>Duplicate Zones</span>
            </button>
          </div>
        </div>

        {/* Tactical Pulsing Concentric Red Radar Rings Overlay (Center Target Pin) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[300] pointer-events-none flex items-center justify-center">
          <div className="w-64 h-64 rounded-full border border-rose-500/40 radar-ring flex items-center justify-center">
            <div className="w-44 h-44 rounded-full border border-rose-500/50 flex items-center justify-center relative">
              <div className="w-24 h-24 rounded-full border border-rose-500/60 bg-rose-500/10 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-rose-500 animate-ping opacity-75" />
              </div>
              {/* Radar sweep radial arm */}
              <div className="absolute inset-0 rounded-full border-t border-rose-400 animate-radar" />
            </div>
          </div>
        </div>

        {/* Leaflet Map Canvas */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Right Floating Popover Card: Dahanu Block Storage Hub (Matching Image 5) */}
        {selectedFeature && (
          <div className="absolute top-20 right-6 z-[400] w-72 glass-panel p-5 rounded-3xl border border-white/15 shadow-2xl space-y-3 animate-in fade-in duration-200">
            {/* Header Capsule & Close X */}
            <div className="flex items-center justify-between">
              <span className="glass-pill px-2.5 py-0.5 rounded-full text-[10px] font-mono text-slate-300 uppercase tracking-wider">
                DISTRICT 532: PALGHAR
              </span>
              <button
                type="button"
                onClick={() => setSelectedFeature(null)}
                className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Asset Title & Metadata */}
            <div>
              <h3 className="font-bold text-base text-slate-100 tracking-tight">
                {selectedFeature.block} Block Storage Hub
              </h3>
              <div className="text-xs text-slate-400 mt-1 space-y-0.5">
                <div>Census Pop: <strong className="text-slate-200 font-sans">142,000</strong></div>
                <div>LGD: <strong className="text-blue-400 font-mono">04812</strong></div>
              </div>
            </div>

            {/* Two Action Buttons: Mint Inspect Proof & Dark Glass Open Graph */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => onOpenDrawer('Txn_84920')}
                className="w-full py-2.5 px-3 rounded-full bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-400/30 hover:bg-emerald-300 transition-all cursor-pointer"
              >
                <span>Inspect Proof</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToGraph('LGD_BLOCK_04812')}
                className="w-full py-2.5 px-3 rounded-full glass-pill text-slate-200 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Open Graph</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
