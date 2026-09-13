import React from 'react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  FileCheck,
  AlertTriangle,
  FileCode,
  ExternalLink,
  Cpu,
  BadgeCheck,
} from 'lucide-react';

interface SecurityStatusProps {
  onOpenLedger: () => void;
  totalSecuredVolume?: string;
  activeEscrowCount?: number;
}

export const SecurityStatus: React.FC<SecurityStatusProps> = ({
  onOpenLedger,
  totalSecuredVolume = '₹2,48,500',
  activeEscrowCount = 3,
}) => {
  return (
    <div
      id="security-status-card"
      className="bg-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800"
    >
      {/* Background Decorative Grid */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-linear-to-l from-emerald-500/10 to-transparent pointer-events-none" />

      {/* Main Content */}
      <div className="space-y-3 relative z-10 max-w-2xl">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔐</span>
          <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <span>Secure Transactions</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/30">
              Cyber Security Specialization
            </span>
          </h3>
        </div>

        <p className="text-xs text-slate-300 font-medium">
          Your produce trade contracts and buyer payments are protected with multi-layered cryptography and automated escrow.
        </p>

        {/* 4 Security Pillars Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700/60">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
              ✓
            </span>
            <div>
              <div className="text-xs font-bold text-white leading-none">Encrypted</div>
              <div className="text-[10px] text-slate-400 mt-0.5">256-Bit AES</div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700/60">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
              ✓
            </span>
            <div>
              <div className="text-xs font-bold text-white leading-none">Authenticated</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Aadhaar e-KYC</div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700/60">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
              ✓
            </span>
            <div>
              <div className="text-xs font-bold text-white leading-none">Audit Logged</div>
              <div className="text-[10px] text-slate-400 mt-0.5">SHA-256 Ledger</div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700/60">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
              ✓
            </span>
            <div>
              <div className="text-xs font-bold text-white leading-none">Fraud Monitored</div>
              <div className="text-[10px] text-slate-400 mt-0.5">AI Escrow Guard</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button & Escrow Summary */}
      <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 relative z-10 shrink-0">
        <div className="text-left md:text-right">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Protected Escrow Volume
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
            {totalSecuredVolume}
          </div>
          <div className="text-[10px] text-slate-400">
            {activeEscrowCount} active escrow locks
          </div>
        </div>

        <button
          id="view-transaction-ledger-btn"
          onClick={onOpenLedger}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 shadow-sm hover:scale-[1.02]"
        >
          <FileCheck className="w-4 h-4 text-slate-950" />
          <span>View Transaction Ledger</span>
        </button>
      </div>
    </div>
  );
};
