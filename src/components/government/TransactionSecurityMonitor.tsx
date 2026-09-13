import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  AlertTriangle, 
  Activity, 
  CheckCircle2, 
  Eye, 
  Search, 
  FileCheck2, 
  Key, 
  Hash, 
  UserX,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { TRANSACTION_SECURITY_STATS, FRAUD_FLAG_RECORDS } from './GovernmentData';
import { FraudFlagRecord } from './GovernmentTypes';

interface TransactionSecurityMonitorProps {
  onInvestigateRecord?: (record: FraudFlagRecord) => void;
  onOpenAuditLedger?: () => void;
}

export const TransactionSecurityMonitor: React.FC<TransactionSecurityMonitorProps> = ({
  onInvestigateRecord,
  onOpenAuditLedger
}) => {
  const [fraudRecords, setFraudRecords] = useState<FraudFlagRecord[]>(FRAUD_FLAG_RECORDS);
  const [selectedRecord, setSelectedRecord] = useState<FraudFlagRecord | null>(null);

  const handleUpdateStatus = (id: string, newStatus: FraudFlagRecord['investigationStatus']) => {
    setFraudRecords(prev => prev.map(r => r.id === id ? { ...r, investigationStatus: newStatus } : r));
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(prev => prev ? { ...prev, investigationStatus: newStatus } : null);
    }
  };

  const getRiskScoreBadge = (score: FraudFlagRecord['riskScore']) => {
    switch (score) {
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-300">HIGH RISK</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">MEDIUM RISK</span>;
      case 'LOW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">LOW RISK</span>;
    }
  };

  const getStatusBadge = (status: FraudFlagRecord['investigationStatus']) => {
    switch (status) {
      case 'UNDER_REVIEW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">Under Review</span>;
      case 'ESCALATED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">Escalated to Cyber Cell</span>;
      case 'CLEARED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">Cleared / Verified</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl gradient-border-organic border-0 p-5 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Cyber Security & Fraud Anomaly Monitoring Engine
              </h3>
              <p className="text-xs text-slate-500">
                Automated multi-factor integrity checks, payment velocity alerts, and cryptographic verification
              </p>
            </div>
          </div>
        </div>

        {/* Quick Ledger Navigation */}
        <button
          onClick={onOpenAuditLedger}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Hash className="w-3.5 h-3.5 text-cyan-400" />
          <span>View SHA-256 Audit Ledger</span>
        </button>
      </div>

      {/* 4 Core Security Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        
        <div className="bg-slate-50 p-3.5 rounded-xl gradient-border-organic border-0">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Transactions</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            {TRANSACTION_SECURITY_STATS.totalTransactions.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>99.0% Baseline Health</span>
          </div>
        </div>

        <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200">
          <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">Verified Legitimate</div>
          <div className="text-xl font-bold font-mono text-emerald-800 mt-1">
            {TRANSACTION_SECURITY_STATS.verifiedTransactions.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            Cryptographically Signed
          </div>
        </div>

        <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200">
          <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">Flagged for Review</div>
          <div className="text-xl font-bold font-mono text-amber-800 mt-1">
            {TRANSACTION_SECURITY_STATS.flaggedTransactions.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">
            Rate-limited & Held
          </div>
        </div>

        <div className="bg-red-50/60 p-3.5 rounded-xl border border-red-200">
          <div className="text-[11px] font-bold text-red-900 uppercase tracking-wider">Fraud Risk Alerts</div>
          <div className="text-xl font-bold font-mono text-red-700 mt-1">
            {TRANSACTION_SECURITY_STATS.fraudRiskAlerts}
          </div>
          <div className="text-[11px] text-red-700 font-bold mt-1 animate-pulse">
            Active Cyber Monitoring
          </div>
        </div>

      </div>

      {/* Cyber Risk Engine Breakdown */}
      <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-3">
        <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Autonomous Risk Factor Detection Engine</span>
          </span>
          <span className="font-mono text-cyan-400 text-[11px]">AI Model: Gemini Risk Guard v4.2</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
            <div className="text-[10px] text-slate-400">Suspicious Volume</div>
            <div className="font-bold text-white font-mono text-sm mt-0.5">{TRANSACTION_SECURITY_STATS.suspiciousVolumeAlerts} incidents</div>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
            <div className="text-[10px] text-slate-400">Failed 2FA Surges</div>
            <div className="font-bold text-amber-400 font-mono text-sm mt-0.5">{TRANSACTION_SECURITY_STATS.failedPaymentSurges} incidents</div>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
            <div className="text-[10px] text-slate-400">Abnormal Price Jumps</div>
            <div className="font-bold text-red-400 font-mono text-sm mt-0.5">{TRANSACTION_SECURITY_STATS.abnormalPriceShifts} incidents</div>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
            <div className="text-[10px] text-slate-400">Unusual Proxy Access</div>
            <div className="font-bold text-purple-400 font-mono text-sm mt-0.5">{TRANSACTION_SECURITY_STATS.unusualAccountActivity} incidents</div>
          </div>
        </div>
      </div>

      {/* Flagged Transactions Queue */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          Active Security Flags & Investigation Queue
        </h4>

        <div className="overflow-x-auto gradient-border-organic border-0 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Transaction ID</th>
                <th className="py-2.5 px-3">Entity Identifier</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Risk Assessment</th>
                <th className="py-2.5 px-3">Detection Reason</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fraudRecords.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{item.txId}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">{item.buyerOrFarmer}</td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">₹{item.amount.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3">{getRiskScoreBadge(item.riskScore)}</td>
                  <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate" title={item.reason}>{item.reason}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">{item.timestamp}</td>
                  <td className="py-2.5 px-3">{getStatusBadge(item.investigationStatus)}</td>
                  <td className="py-2.5 px-3">
                    <button
                      onClick={() => setSelectedRecord(item)}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] cursor-pointer"
                    >
                      Investigate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Investigation Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl gradient-border-organic border-0 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-slate-900">{selectedRecord.txId}</span>
                  {getRiskScoreBadge(selectedRecord.riskScore)}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Entity: {selectedRecord.buyerOrFarmer}</p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 gradient-border-organic border-0 space-y-1">
                <div className="font-semibold text-slate-700">Flag Diagnostic Report:</div>
                <p className="text-slate-800 leading-relaxed">{selectedRecord.reason}</p>
                <div className="text-slate-500 pt-1 font-mono">Amount Involved: ₹{selectedRecord.amount.toLocaleString('en-IN')}</div>
              </div>

              <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 text-purple-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-purple-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                  <span>Enforcement Options</span>
                </div>
                <p className="text-[11px]">
                  Government cyber officers may isolate funds, request instant video biometric re-verification, or clear after manual review.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleUpdateStatus(selectedRecord.id, 'CLEARED')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
              >
                Clear Flag
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedRecord.id, 'ESCALATED')}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Escalate to Cyber Cell
                </button>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
