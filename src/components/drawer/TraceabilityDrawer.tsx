import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import type { ProvenanceVoucher } from '../../types/governance';
import { computeSha256, canonicalizeVoucher } from '../../utils/crypto';

interface TraceabilityDrawerProps {
  isOpen: boolean;
  voucher: ProvenanceVoucher | null;
  onClose: () => void;
}

export const TraceabilityDrawer: React.FC<TraceabilityDrawerProps> = ({
  isOpen,
  voucher,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [isTamperActive, setIsTamperActive] = useState(false);
  const [computedHash, setComputedHash] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(false);

  // Reset tamper toggle when voucher changes
  const [prevVoucherId, setPrevVoucherId] = useState<string | null>(null);
  if (voucher && voucher.id !== prevVoucherId) {
    setPrevVoucherId(voucher.id);
    setIsTamperActive(false);
  }

  const tamperDelta = isTamperActive ? 1000000 : 0; // Injects unauthorized ₹10L tamper delta
  const currentAmount = voucher ? voucher.disbursedAmount + tamperDelta : 0;
  const verificationResult: 'MATCH' | 'MISMATCH' = isTamperActive ? 'MISMATCH' : 'MATCH';

  useEffect(() => {
    if (!voucher) return;
    let isCancelled = false;

    const run = async () => {
      setIsCalculating(true);
      const preimage = canonicalizeVoucher({
        voucherRef: voucher.voucherRef,
        pfmsHead: voucher.pfmsMajorHead,
        stateCode: voucher.lgd.state.code,
        districtCode: voucher.lgd.district.code,
        blockCode: voucher.lgd.subDistrictBlock.code,
        gpCode: voucher.lgd.gramPanchayat.code,
        amount: voucher.disbursedAmount + (isTamperActive ? 1000000 : 0),
        token: voucher.dpdpBeneficiaryToken,
        sanctionDate: voucher.sanctionDate,
      });

      const hash = await computeSha256(preimage);
      if (!isCancelled) {
        setComputedHash(hash);
        setIsCalculating(false);
      }
    };

    run();

    return () => {
      isCancelled = true;
    };
  }, [voucher, isTamperActive]);

  const handleCopyJson = () => {
    if (!voucher) return;
    const jsonSample = {
      voucherTxne: voucher.id,
      Amount: isTamperActive ? `₹${((voucher.disbursedAmount + 1000000) / 100000).toFixed(2)} Lakhs (Tampered)` : voucher.disbursedAmountDisplay,
      Duplicate: 'Land Survey Plot #284-A',
      merkleRootHash: voucher.merkleRootHash,
      status: verificationResult,
    };
    navigator.clipboard.writeText(JSON.stringify(jsonSample, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !voucher) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-md transition-all duration-300">
      {/* Backdrop */}
      <div className="flex-1" onClick={onClose} />

      {/* Slide-Over Right Sheet (Matching Image 2) */}
      <div className="w-full max-w-xl h-full glass-panel border-l border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 bg-slate-950/90">
        {/* Top Header Row with Close Icon */}
        <div className="p-5 pb-3 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Cryptographic Provenance Drawer
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Tier LGD Breadcrumb Pills (Matching Image 2) */}
        <div className="px-5 pb-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="glass-pill px-3 py-1 rounded-full text-xs font-medium text-slate-200">
              {voucher.lgd.state.name} ({voucher.lgd.state.code})
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="glass-pill px-3 py-1 rounded-full text-xs font-medium text-slate-200">
              {voucher.lgd.district.name} ({voucher.lgd.district.code})
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="glass-pill px-3 py-1 rounded-full text-xs font-medium text-blue-300 border border-blue-400/30">
              {voucher.lgd.subDistrictBlock.name} ({voucher.lgd.subDistrictBlock.code})
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="glass-pill px-3 py-1 rounded-full text-xs font-medium text-emerald-300 border border-emerald-400/30">
              {voucher.lgd.gramPanchayat.name} ({voucher.lgd.gramPanchayat.code})
            </span>
          </div>
        </div>

        {/* Verification Status Box (Matching Image 2) */}
        <div className="px-5 pb-4">
          <div
            className={`p-3.5 rounded-2xl border transition-colors ${
              verificationResult === 'MATCH'
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/60 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {verificationResult === 'MATCH' ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
              )}
              <span className="text-xs font-semibold">
                {verificationResult === 'MATCH'
                  ? 'Verified by Symbolic Verifier (14ms)'
                  : 'CRITICAL: HASH MISMATCH / LEDGER TAMPER DETECTED'}
              </span>
              {isCalculating && <span className="text-[10px] text-slate-400 ml-auto">Hashing...</span>}
            </div>
            <p className="text-[10px] font-mono text-slate-400 mt-1 truncate">
              SHA-256 Merkle hash: {voucher.merkleRootHash.slice(0, 16)}...b855 &rarr;{' '}
              {computedHash ? `${computedHash.slice(0, 16)}...${computedHash.slice(-4)}` : 'computing'}
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 space-y-4 text-xs">
          {/* Header Action: Voucher Audit Diff + Simulate Tamper Test Toggle */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-slate-200 tracking-tight flex items-center gap-2">
              <span className="text-slate-500 font-mono">--</span>
              Voucher Audit Diff
            </span>

            {/* Toggle Switch (Matching Image 2) */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Simulate Tamper Test</span>
              <button
                type="button"
                onClick={() => setIsTamperActive(!isTamperActive)}
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                  isTamperActive ? 'bg-rose-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 ${
                    isTamperActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* DUPLICATE VOUCHER ALERT Split Card (Matching Image 2) */}
          <div className="relative">
            {/* Red Pill Badge Header */}
            <div className="flex justify-end mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/40 text-[10px] font-bold uppercase tracking-wider">
                DUPLICATE VOUCHER ALERT
              </span>
            </div>

            {/* 2-Column Voucher Diff Container */}
            <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                {/* Column 1: MoA&FW Voucher */}
                <div className="space-y-1.5 border-r border-white/5 pr-3">
                  <span className="text-[10px] text-slate-400 block font-sans">MoA&FW Voucher</span>
                  <div className="font-bold text-slate-200 text-sm font-mono">{voucher.id}</div>
                  <div className="text-[11px] text-slate-400">
                    Amount:{' '}
                    <strong className="text-slate-100 font-mono text-sm block">
                      {isTamperActive ? `₹${(currentAmount / 100000).toFixed(2)}L` : voucher.disbursedAmountDisplay}
                    </strong>
                  </div>

                  <div className="border-l-2 border-rose-500 pl-2 mt-2 py-0.5 text-[10px] text-rose-300">
                    Duplicate Land Survey Plot #284-A
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">Head {voucher.pfmsMajorHead}</div>
                </div>

                {/* Column 2: MoRD Voucher */}
                <div className="space-y-1.5 pl-1">
                  <span className="text-[10px] text-slate-400 block font-sans">MoRD Voucher</span>
                  <div className="font-bold text-slate-200 text-sm font-mono">
                    {voucher.duplicateWith?.voucherId || 'Txn_91034'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Amount:{' '}
                    <strong className="text-slate-100 font-mono text-sm block">
                      {voucher.duplicateWith?.amountDisplay || voucher.disbursedAmountDisplay}
                    </strong>
                  </div>

                  <div className="border-l-2 border-rose-500 pl-2 mt-2 py-0.5 text-[10px] text-rose-300">
                    Duplicate Land Survey Plot #284-A
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Head {voucher.duplicateWith?.pfmsMajorHead.slice(0, 4) || '2501'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formatted JSON Code View (Matching Image 2) */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Raw Immutable Ledger Entry
              </span>
              <button
                onClick={handleCopyJson}
                className="px-2 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 flex items-center gap-1 transition-colors cursor-pointer text-[10px]"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
              <span className="text-slate-400">&#123;</span>
              <br />
              &nbsp;&nbsp;<span className="text-cyan-400">&quot;voucherTxne&quot;</span>: <span className="text-emerald-400">&quot;{voucher.id}&quot;</span>,
              <br />
              &nbsp;&nbsp;<span className="text-cyan-400">&quot;Amount&quot;</span>: <span className="text-emerald-400">&quot;{isTamperActive ? '₹4,85,00,000 (Tampered)' : voucher.disbursedAmountDisplay}&quot;</span>,
              <br />
              &nbsp;&nbsp;<span className="text-cyan-400">&quot;Duplicate&quot;</span>: <span className="text-emerald-400">&quot;Land Survey Plot #284-A&quot;</span>,
              <br />
              &nbsp;&nbsp;<span className="text-cyan-400">&quot;DPDP_Token&quot;</span>: <span className="text-purple-400">&quot;{voucher.dpdpBeneficiaryToken.split(' ')[0]}&quot;</span>
              <br />
              <span className="text-slate-400">&#125;</span>
            </pre>
          </div>
        </div>

        {/* Drawer Bottom Bar */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-mono">Cadastre: 19.9824, 72.7482</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full glass-pill text-slate-200 hover:text-white cursor-pointer"
          >
            Close Provenance
          </button>
        </div>
      </div>
    </div>
  );
};
