import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  FileCheck, 
  Activity, 
  CheckCircle2, 
  ChevronRight,
  X,
  Sparkles,
  Server
} from 'lucide-react';

export const ConsumerSecurityStrip: React.FC = () => {
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  return (
    <>
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-4 sm:p-5 border border-emerald-900/40 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                <span>🔐 Secure Purchase</span>
              </h4>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-300 text-[10px] font-extrabold uppercase">
                Cyber Security Specialization
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Every order is protected by end-to-end cryptographic encryption and an immutable transaction ledger.
            </p>
          </div>
        </div>

        {/* 5 Core Pillars */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] font-bold text-emerald-200">
          <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secure authentication</span>
          </span>
          <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted transaction</span>
          </span>
          <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>OTP verification</span>
          </span>
          <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fraud monitoring</span>
          </span>
          <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Digital ledger</span>
          </span>

          <button
            onClick={() => setIsSecurityModalOpen(true)}
            className="text-xs font-black text-amber-300 hover:text-amber-200 underline ml-2 flex items-center gap-0.5"
          >
            <span>Learn More</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Security Architecture Deep Dive Modal */}
      {isSecurityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-500/30 relative my-8">
            
            <button
              onClick={() => setIsSecurityModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-display font-black text-white">
                  Cyber Security & Trust Architecture
                </h3>
                <p className="text-xs text-slate-400">
                  Consumer protection specifications for KisanDirect
                </p>
              </div>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="font-bold text-emerald-300 flex items-center gap-2">
                  <KeyRound className="w-4 h-4" />
                  <span>1. End-to-End Transport Layer Security</span>
                </div>
                <p className="text-slate-300">
                  All checkout and payment communications utilize TLS 1.3 with 256-bit AES-GCM encryption. Zero raw payment credentials or CVVs are stored on platform servers.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="font-bold text-emerald-300 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span>2. Dynamic Fraud Monitoring & Rate Limiting</span>
                </div>
                <p className="text-slate-300">
                  Autonomous risk engine analyzes device fingerprints, geolocation anomalies, and velocity to flag duplicate transactions or unauthorized debit attempts in real-time.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="font-bold text-emerald-300 flex items-center gap-2">
                  <FileCheck className="w-4 h-4" />
                  <span>3. Immutable Tamper-Evident Transaction Ledger</span>
                </div>
                <p className="text-slate-300">
                  Every order generates a cryptographically hashed block containing produce volume, farmgate payout, and logistics timestamps to prevent audit tampering.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 text-right">
              <button
                onClick={() => setIsSecurityModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs"
              >
                Close Security Panel
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
