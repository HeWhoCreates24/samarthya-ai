import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { AskSamarthyaView } from './components/copilot/AskSamarthyaView';
import { OverlapMatrix } from './components/matrix/OverlapMatrix';
import { ConvergenceMap } from './components/map/ConvergenceMap';
import { KnowledgeGraphExplorer } from './components/graph/KnowledgeGraphExplorer';
import { TraceabilityDrawer } from './components/drawer/TraceabilityDrawer';
import { CabinetNoteModal } from './components/modals/CabinetNoteModal';
import type { PersonaType, ProvenanceVoucher } from './types/governance';
import { getOrGenerateVoucher } from './data/mockGovernanceData';

export const App: React.FC = () => {
  // Navigation & Persona States
  const [activeTab, setActiveTab] = useState<string>('copilot');
  const [activePersona, setActivePersona] = useState<PersonaType>('PMO_POLICY_ADVISOR');

  // Deep-Linking Props across views
  const [mapTargetFocus, setMapTargetFocus] = useState<string | null>(null);
  const [graphSelectedNode, setGraphSelectedNode] = useState<string | null>(null);

  // Modals & Drawers
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [activeVoucher, setActiveVoucher] = useState<ProvenanceVoucher | null>(null);
  const [isCabinetNoteOpen, setIsCabinetNoteOpen] = useState<boolean>(false);

  // Handler to open Traceability Drawer from ANY citation badge or voucher ID
  const handleOpenDrawer = (voucherId: string) => {
    const v = getOrGenerateVoucher(voucherId);
    setActiveVoucher(v);
    setIsDrawerOpen(true);
  };

  // Cross-View Deep-Linking Handlers
  const handleNavigateToMap = (districtOrBlock?: string) => {
    if (districtOrBlock) {
      setMapTargetFocus(districtOrBlock);
    }
    setActiveTab('map');
  };

  const handleNavigateToMatrix = () => {
    setActiveTab('matrix');
  };

  const handleNavigateToCopilot = (_scenarioId?: string) => {
    setActiveTab('copilot');
  };

  const handleNavigateToGraph = (nodeId?: string) => {
    if (nodeId) {
      setGraphSelectedNode(nodeId);
    }
    setActiveTab('graph');
  };

  return (
    <div className="min-h-screen tactical-grid-bg text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Global National Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setMapTargetFocus(null);
          setActiveTab(tab);
        }}
        activePersona={activePersona}
        onPersonaChange={setActivePersona}
        onOpenCabinetNote={() => setIsCabinetNoteOpen(true)}
      />

      {/* 2. Main Workspace Tab View */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {activeTab === 'copilot' && (
          <AskSamarthyaView
            onOpenDrawer={handleOpenDrawer}
            onNavigateToMap={handleNavigateToMap}
            onNavigateToMatrix={handleNavigateToMatrix}
          />
        )}

        {activeTab === 'matrix' && (
          <OverlapMatrix
            onOpenDrawer={handleOpenDrawer}
            onNavigateToMap={handleNavigateToMap}
            onNavigateToCopilot={handleNavigateToCopilot}
          />
        )}

        {activeTab === 'map' && (
          <ConvergenceMap
            onOpenDrawer={handleOpenDrawer}
            onNavigateToGraph={handleNavigateToGraph}
            targetFocus={mapTargetFocus}
          />
        )}

        {activeTab === 'graph' && (
          <KnowledgeGraphExplorer
            onOpenDrawer={handleOpenDrawer}
            selectedNodeId={graphSelectedNode}
          />
        )}
      </main>

      {/* 4. Traceability Slide-Over Drawer */}
      <TraceabilityDrawer
        isOpen={isDrawerOpen}
        voucher={activeVoucher}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* 5. Official Cabinet Secretariat Note Modal */}
      <CabinetNoteModal
        isOpen={isCabinetNoteOpen}
        onClose={() => setIsCabinetNoteOpen(false)}
      />

      {/* 6. Enterprise Public Finance Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-4 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono">
              Samarthya-AI &bull; Team Sahayata (Problem Statement ID: EL-03)
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Local Government Directory (LGD) Anchor v2026.3</span>
            <span>PFMS Major Heads 2401, 2501, 4401</span>
            <span>Zero-Trust Cryptographic Ledger</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
