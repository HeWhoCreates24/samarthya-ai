import React, { useState } from 'react';
import { CommandBar } from './CommandBar';
import { ExecutionPipeline } from './ExecutionPipeline';
import { ExecutiveBrief } from './ExecutiveBrief';
import { COPILOT_SCENARIOS } from '../../data/mockGovernanceData';

interface AskSamarthyaViewProps {
  onOpenDrawer: (voucherId: string) => void;
  onNavigateToMap: (districtOrBlock?: string) => void;
  onNavigateToMatrix: () => void;
}

export const AskSamarthyaView: React.FC<AskSamarthyaViewProps> = ({
  onOpenDrawer,
  onNavigateToMap,
  onNavigateToMatrix,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(COPILOT_SCENARIOS[0].id);
  const [searchQuery, setSearchQuery] = useState<string>(COPILOT_SCENARIOS[0].query);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(4);

  const currentScenario =
    COPILOT_SCENARIOS.find((s) => s.id === selectedScenarioId) || COPILOT_SCENARIOS[0];

  const handleExecute = (targetScenarioId?: string) => {
    const scId = targetScenarioId || selectedScenarioId;
    setSelectedScenarioId(scId);

    // Run simulated 5-step stepper animation
    setIsStreaming(true);
    setActiveStepIndex(0);

    const stepInterval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev >= 4) {
          clearInterval(stepInterval);
          setIsStreaming(false);
          return 4;
        }
        return prev + 1;
      });
    }, 280);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* 1. Command Bar & Quick Presets */}
      <CommandBar
        currentQuery={searchQuery}
        onQueryChange={setSearchQuery}
        onExecuteQuery={handleExecute}
        isLoading={isStreaming}
        selectedScenarioId={selectedScenarioId}
      />

      {/* 2. Dual-Plane Execution Pipeline Stepper */}
      <ExecutionPipeline
        scenario={currentScenario}
        isStreaming={isStreaming}
        activeStepIndex={activeStepIndex}
      />

      {/* 3. Executive Intelligence Brief with LLM Hallucination vs Dual-Plane Toggle */}
      <ExecutiveBrief
        scenario={currentScenario}
        onOpenDrawer={onOpenDrawer}
        onNavigateToMap={onNavigateToMap}
        onNavigateToMatrix={onNavigateToMatrix}
      />
    </div>
  );
};
