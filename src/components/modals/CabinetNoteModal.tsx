import React, { useState } from 'react';
import { X, Printer, Download, ShieldCheck, Check, FileText } from 'lucide-react';
import { SLIDE6_OVERLAPPING_BLOCKS } from '../../data/mockGovernanceData';

interface CabinetNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CabinetNoteModal: React.FC<CabinetNoteModalProps> = ({ isOpen, onClose }) => {
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    const textContent = `
GOVERNMENT OF INDIA
CABINET SECRETARIAT
RASHTRAPATI BHAVAN, NEW DELHI

MEMORANDUM FOR THE COMMITTEE OF SECRETARIES (CoS)
SUBJECT: INTER-MINISTERIAL BUDGETARY REDUNDANCY AUDIT REPORT
REFERENCE: SAMARTHYA-AI / PS-ID-EL-03 / RECONCILIATION-2026-Q3

1. EXECUTIVE SUMMARY:
Deterministic reconciliation across MoA&FW (Head 2401) and MoRD (Head 2501) has confirmed 12 Local Government Directory (LGD) blocks with duplicate asset funding on identical cadastral plots.

2. QUANTIFIED FISCAL EXPOSURE:
- Total Identified Redundant Outlay: ₹42.80 Crores
- Immediate Salvageable Leakage (Tranche-2 Freeze): ₹18.40 Crores
- Affected Blocks: 12 (Maharashtra: 8, Madhya Pradesh: 3, Uttar Pradesh: 1)
- Deterministic Verifier Match Confidence: 98.4% (Zero Hallucination)

3. CRYPTOGRAPHIC PROVENANCE ATTESTATION:
- Merkle Root SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
- Ingestion Timestamp: 2026-09-30 02:00:14 IST
- DPDP Act 2023 Compliance: Fully Attested (Zero Raw PII)

4. DIRECTED ACTIONS:
a. MoRD to issue immediate stop-payment freeze on AIF Tranche-2 vouchers.
b. Re-allocate ₹18.40 Cr to designated Aspirational District cold-chain corridors.
    `.trim();

    const element = document.createElement('a');
    const file = new Blob([textContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'CABINET_NOTE_SAMARTHYA_AI_2026.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2 text-slate-100 font-semibold text-sm">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Official Cabinet Secretariat Note Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-2.5 py-1 text-xs rounded bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              {downloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              <span>{downloaded ? 'Downloaded' : 'Export TXT'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Note Document Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-950 font-serif text-slate-200">
          {/* Official Letterhead */}
          <div className="text-center border-b border-slate-800 pb-5 space-y-1">
            <div className="inline-block px-3 py-1 rounded border border-amber-500/40 bg-amber-500/10 text-amber-300 font-mono text-[11px] tracking-widest uppercase font-semibold mb-2">
              CONFIDENTIAL // FOR OFFICIAL USE ONLY
            </div>
            <h1 className="text-lg font-bold uppercase tracking-wider text-slate-100">
              GOVERNMENT OF INDIA &bull; CABINET SECRETARIAT
            </h1>
            <p className="text-xs text-slate-400 font-sans">
              Rashtrapati Bhavan, New Delhi &bull; Integrated Public Finance Oversight Division
            </p>
            <p className="text-[11px] font-mono text-blue-400 pt-1">
              Doc Ref: CAB-SEC/GOV-AI/2026/EL03-RECON
            </p>
          </div>

          {/* Memorandum Title */}
          <div>
            <h2 className="text-base font-bold text-slate-100 uppercase underline decoration-slate-600">
              MEMORANDUM FOR THE COMMITTEE OF UNION SECRETARIES (CoS)
            </h2>
            <p className="text-xs font-sans text-slate-400 mt-1">
              <strong>SUBJECT: </strong>
              Inter-Ministerial Budgetary Convergence & Redundant Capital Outlay Reconciliation (MoA&FW vs MoRD).
            </p>
          </div>

          {/* Quantified Executive Summary */}
          <div className="space-y-2 text-xs font-sans leading-relaxed">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              1. Quantified Reconciliation Findings:
            </h3>
            <p className="text-slate-300">
              Deterministic symbolic verification anchored to Local Government Directory (LGD) codes has established
              conclusive double-allocation of agricultural storage capital outlays across{' '}
              <strong className="text-white">12 Blocks</strong>. Identical geo-cadastral plots were funded under both{' '}
              <span className="text-blue-300">MoA&FW RKVY (Head 2401)</span> and{' '}
              <span className="text-amber-300">MoRD AIF (Head 2501)</span>.
            </p>

            <div className="grid grid-cols-3 gap-3 my-3">
              <div className="p-3 rounded bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase block">Total Redundant Outlay</span>
                <span className="text-base font-bold font-mono text-rose-400">₹42.80 Crores</span>
              </div>
              <div className="p-3 rounded bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase block">Salvageable Leakage</span>
                <span className="text-base font-bold font-mono text-emerald-400">₹18.40 Crores</span>
              </div>
              <div className="p-3 rounded bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase block">Reconciliation Confidence</span>
                <span className="text-base font-bold font-mono text-blue-400">98.4% (Audit Grade)</span>
              </div>
            </div>
          </div>

          {/* Cryptographic Attestation Block */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 space-y-2 font-mono text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              Cryptographic Provenance Attestation (DPDP 2023 Compliant)
            </div>
            <p className="text-[11px] text-slate-300 break-all leading-normal">
              Merkle Root Hash: <span className="text-emerald-300">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
            </p>
            <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
              <span>Attestation Engine: Sandboxed Symbolic WASM (14ms)</span>
              <span>NIC Ingestion Cluster #IND-GOV-WRK-07</span>
            </div>
          </div>

          {/* Key Overlapping Blocks Sample */}
          <div className="space-y-2 text-xs font-sans">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              2. Affected LGD Hierarchy Schedule (Sample):
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-slate-800 text-[11px]">
                <thead>
                  <tr className="bg-slate-900 text-slate-300">
                    <th className="p-2 border border-slate-800">LGD</th>
                    <th className="p-2 border border-slate-800">Block Name</th>
                    <th className="p-2 border border-slate-800">District / State</th>
                    <th className="p-2 border border-slate-800">Redundant Value</th>
                    <th className="p-2 border border-slate-800">Voucher Ref</th>
                  </tr>
                </thead>
                <tbody>
                  {SLIDE6_OVERLAPPING_BLOCKS.slice(0, 5).map((b) => (
                    <tr key={b.blockLgdCode} className="border-b border-slate-800">
                      <td className="p-2 font-mono text-blue-400">{b.blockLgdCode}</td>
                      <td className="p-2 font-semibold text-slate-200">{b.blockName}</td>
                      <td className="p-2 text-slate-400">{b.districtName}, {b.stateName}</td>
                      <td className="p-2 font-mono text-rose-300 font-bold">{b.redundantAmountDisplay}</td>
                      <td className="p-2 font-mono text-emerald-400">{b.voucherIdA}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            Generated via Samarthya-AI &bull; Team Sahayata (PS ID: EL-03)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
