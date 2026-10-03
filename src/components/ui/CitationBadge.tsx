import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';

interface CitationBadgeProps {
  label: string;
  voucherId?: string;
  onClick?: (voucherId: string) => void;
  variant?: 'emerald' | 'cobalt' | 'amber' | 'slate';
  showIcon?: boolean;
}

export const CitationBadge: React.FC<CitationBadgeProps> = ({
  label,
  voucherId = 'Txn_84920',
  onClick,
  variant = 'emerald',
  showIcon = true,
}) => {
  const colorStyles = {
    emerald: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80 hover:border-emerald-400',
    cobalt: 'bg-blue-950/70 border-blue-500/40 text-blue-300 hover:bg-blue-900/80 hover:border-blue-400',
    amber: 'bg-amber-950/70 border-amber-500/40 text-amber-300 hover:bg-amber-900/80 hover:border-amber-400',
    slate: 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-500',
  };

  return (
    <button
      type="button"
      onClick={() => onClick && onClick(voucherId)}
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 mx-1 rounded text-[11px] font-mono font-medium transition-all duration-150 border cursor-pointer group shadow-sm ${colorStyles[variant]}`}
      title={`Click to inspect cryptographic provenance for ${voucherId}`}
    >
      {showIcon && <ShieldCheck className="w-3 h-3 text-emerald-400 group-hover:scale-110 transition-transform" />}
      <span>{label}</span>
      <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};
