export type PersonaType = 'PMO_POLICY_ADVISOR' | 'STATE_CHIEF_SECRETARY' | 'DISTRICT_COLLECTOR';

export interface PersonaConfig {
  id: PersonaType;
  title: string;
  role: string;
  scope: string;
  jurisdiction: string;
  avatarColor: string;
  recommendedQueries: string[];
}

export interface LgdHierarchy {
  state: { code: string; name: string };
  district: { code: string; name: string };
  subDistrictBlock: { code: string; name: string };
  gramPanchayat: { code: string; name: string };
}

export type RiskLevel = 'CRITICAL' | 'MODERATE' | 'SYNERGISTIC';

export interface ProvenanceVoucher {
  id: string; // e.g., 'Txn_84920'
  voucherRef: string; // e.g. '#MH-2026-90412'
  sourceRegistry: string; // e.g., 'PFMS - Public Financial Management System'
  pfmsMajorHead: string; // e.g., '2401'
  pfmsMajorHeadName: string; // e.g., 'Crop Husbandry'
  ministry: string; // e.g., 'Ministry of Agriculture & Farmers Welfare'
  ministryCode: string; // e.g., 'MoA&FW'
  schemeName: string; // e.g., 'Rashtriya Krishi Vikas Yojana (RKVY)'
  schemeCode: string; // e.g., 'MoA&FW-RKVY'
  assetType: string; // e.g., 'Farm Storage Warehouse (1,000 MT)'
  disbursedAmount: number; // in INR e.g., 3850000
  disbursedAmountDisplay: string; // e.g., '₹38.5 Lakhs'
  sanctionDate: string; // e.g., '2026-06-14'
  ingestionTimestamp: string; // e.g., '2026-09-30 02:00:14 IST'
  ingestionWorkerNode: string; // e.g., 'IND-GOV-WRK-07'
  lgd: LgdHierarchy;
  gpsCoordinates: { lat: number; lng: number };
  dpdpBeneficiaryToken: string; // e.g., 'TKN-883F-9021-X9'
  matchConfidence: number; // e.g., 0.96
  matchAlgorithm: string; // 'Fellegi-Sunter Probabilistic Linkage'
  merkleRootHash: string; // SHA-256
  isTampered?: boolean;
  duplicateWith?: {
    voucherId: string;
    voucherRef: string;
    ministryCode: string;
    schemeCode: string;
    pfmsMajorHead: string;
    amountDisplay: string;
    conflictReason: string;
  };
  rawLedgerJson: Record<string, unknown>;
}

export interface OverlappingBlockRecord {
  blockLgdCode: string;
  blockName: string;
  districtLgdCode: string;
  districtName: string;
  stateName: string;
  schemeA: string;
  schemeB: string;
  redundantAmount: number; // in Lakhs
  redundantAmountDisplay: string;
  leakageAvoidanceDisplay: string;
  confidence: number;
  voucherIdA: string;
  voucherIdB: string;
  status: 'AUDIT_FLAGGED' | 'RESOLVED' | 'FREEZE_ORDER_SENT';
  gramPanchayatCount: number;
}

export interface MatrixCellData {
  rowScheme: string; // e.g. 'MoA&FW - RKVY'
  rowMinistry: string;
  colScheme: string; // e.g. 'MoRD - AIF'
  colMinistry: string;
  overlapDensity: RiskLevel;
  totalRedundantExposure: string; // '₹42.8 Cr'
  affectedBlockCount: number;
  confidence: number;
  sampleDistrict: string;
  description: string;
  affectedBlocks: OverlappingBlockRecord[];
}

export interface GeoAssetFeature {
  id: string;
  type: 'road' | 'warehouse' | 'overlap_zone';
  name: string;
  state: string;
  district: string;
  block: string;
  gramPanchayat: string;
  lgdCode: string;
  coordinates: [number, number]; // [lat, lng]
  polylineCoords?: [number, number][]; // for road lines
  metrics: {
    completionRate?: number;
    capacityMt?: number;
    overlapAmountDisplay?: string;
    censusPopulation?: number;
  };
  linkedVoucherId?: string;
  linkedDuplicateVoucherId?: string;
  risk: RiskLevel;
}

export interface GraphNode {
  id: string;
  label: string;
  sublabel: string;
  category: 'LGD_BLOCK' | 'PFMS_HEAD' | 'SCHEME' | 'BENEFICIARY_TOKEN' | 'ASSET_TYPE' | 'ROAD_PROJECT';
  color: string;
  properties: Record<string, string | number>;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  label: string;
  confidence?: number;
  risk?: RiskLevel;
}

export interface CopilotScenario {
  id: string;
  query: string;
  category: string;
  cypherQuery: string;
  executionSteps: {
    title: string;
    detail: string;
    durationMs: number;
    status: 'completed' | 'processing' | 'pending';
  }[];
  standardLlmHallucination: {
    summary: string;
    claims: string[];
    hallucinationFlags: string[];
    unverifiedTotal: string;
  };
  dualPlaneVerified: {
    title: string;
    summary: string;
    kpis: {
      redundantOutlay: string;
      leakageAvoidance: string;
      affectedBlocks: number;
      verifierConfidence: string;
    };
    findings: string[];
    policyRecommendations: string[];
    blocks: OverlappingBlockRecord[];
  };
}
