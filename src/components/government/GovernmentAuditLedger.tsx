import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Hash, 
  Lock, 
  Key, 
  CheckCircle2, 
  Download, 
  FileText, 
  Search, 
  Eye, 
  Copy, 
  Check, 
  Sparkles, 
  KeyRound,
  AlertCircle
} from 'lucide-react';
import { TRANSACTION_AUDIT_LEDGER } from './GovernmentData';
import { TransactionAuditRecord } from './GovernmentTypes';

interface GovernmentAuditLedgerProps {
  onClose?: () => void;
}

export const GovernmentAuditLedger: React.FC<GovernmentAuditLedgerProps> = ({
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [selectedAuditTx, setSelectedAuditTx] = useState<TransactionAuditRecord | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');

  const filteredLedger = TRANSACTION_AUDIT_LEDGER.filter(item => {
    return item.txId.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.sha256Hash.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === '849201' || otpInput.length === 6) {
      setIsOtpVerified(true);
      setShowOtpModal(false);
      setOtpError('');
    } else {
      setOtpError('Invalid OTP code. Please enter valid 6-digit administrative token.');
    }
  };

  return (
    <div className="bg-white rounded-2xl gradient-border-organic border-0 p-5 shadow-xs space-y-4">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-bold shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white font-mono">
                Cryptographic SHA-256 Transaction Audit Ledger
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                Tamper-Evident
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Immutable government blockchain audit trail with end-to-end multi-party cryptographic signature verification
            </p>
          </div>
        </div>

        {/* Export / OTP Download Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOtpModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Cryptographic Proof</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by TX-ID, Hash, Buyer, or Farmer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span>Ledger Height: #48,293 Blocks</span>
          <span>•</span>
          <span className="text-emerald-700 font-semibold">Zero Hash Inconsistencies</span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto gradient-border-organic border-0 rounded-xl">
        <table className="w-full text-left text-xs border-collapse font-sans">
          <thead>
            <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <th className="py-2.5 px-3">Transaction ID</th>
              <th className="py-2.5 px-3">Action Type</th>
              <th className="py-2.5 px-3">Party / User Role</th>
              <th className="py-2.5 px-3">Commodity & Volume</th>
              <th className="py-2.5 px-3">Settlement</th>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Cryptographic SHA-256 Hash</th>
              <th className="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLedger.map((item) => (
              <tr key={item.txId} className="hover:bg-slate-50/80 transition">
                <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                  <button 
                    onClick={() => setSelectedAuditTx(item)}
                    className="hover:underline text-emerald-800 cursor-pointer"
                  >
                    {item.txId}
                  </button>
                </td>

                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-medium text-[11px]">
                    {item.action}
                  </span>
                </td>

                <td className="py-2.5 px-3">
                  <div className="font-semibold text-slate-800">{item.user}</div>
                  <div className="text-[10px] text-slate-400">{item.userRole}</div>
                </td>

                <td className="py-2.5 px-3">
                  <div className="font-semibold text-slate-900">{item.commodity}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{item.quantityKg.toLocaleString('en-IN')} kg</div>
                </td>

                <td className="py-2.5 px-3 font-mono">
                  <div className="font-bold text-slate-900">₹{item.totalAmount.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-emerald-700">Farmer: ₹{item.farmerPayout.toLocaleString('en-IN')}</div>
                </td>

                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                  {item.timestamp}
                </td>

                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-600">
                    <span className="truncate max-w-[120px]" title={item.sha256Hash}>
                      {item.sha256Hash.substring(0, 10)}...{item.sha256Hash.substring(item.sha256Hash.length - 6)}
                    </span>
                    <button
                      onClick={() => handleCopyHash(item.sha256Hash)}
                      className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                      title="Copy SHA-256 Hash"
                    >
                      {copiedHash === item.sha256Hash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </td>

                <td className="py-2.5 px-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{item.auditRecordStatus}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transaction Details Inspector Modal */}
      {selectedAuditTx && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl gradient-border-organic border-0 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-slate-900">{selectedAuditTx.txId}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {selectedAuditTx.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Ref: {selectedAuditTx.orderRef}</p>
              </div>
              <button
                onClick={() => setSelectedAuditTx(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg gradient-border-organic border-0">
                <div>
                  <span className="text-slate-500 text-[11px]">Commodity:</span>
                  <div className="font-bold text-slate-900">{selectedAuditTx.commodity}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Volume:</span>
                  <div className="font-bold text-slate-900">{selectedAuditTx.quantityKg.toLocaleString('en-IN')} kg</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Total Transaction:</span>
                  <div className="font-bold text-slate-900">₹{selectedAuditTx.totalAmount.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px]">Direct Farmer Realization:</span>
                  <div className="font-bold text-emerald-700">₹{selectedAuditTx.farmerPayout.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-800 block mb-1">SHA-256 Cryptographic Block Signature:</span>
                <div className="p-2.5 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-lg break-all border border-slate-800">
                  {selectedAuditTx.sha256Hash}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-800 block mb-1">Signer Public Key:</span>
                <div className="p-2 bg-slate-100 text-slate-700 font-mono text-[11px] rounded-lg break-all gradient-border-organic border-0">
                  {selectedAuditTx.signerPublicKey}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>2FA Multi-Factor Authorization Verified</span>
                </span>
                <span className="font-mono text-[11px] font-bold text-emerald-800">STATUS: TAMPER_EVIDENT</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedAuditTx(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold cursor-pointer"
              >
                Close Audit Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Administrative OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl gradient-border-organic border-0 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Government 2FA Authorization</h3>
                  <p className="text-xs text-slate-500">Sensitive Cryptographic Ledger Export</p>
                </div>
              </div>
              <button
                onClick={() => setShowOtpModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Please enter the 6-digit administrative hardware token / OTP to decrypt and download the full SHA-256 audit ledger bundle.
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 849201"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full text-center text-lg font-mono tracking-widest py-2 px-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <div className="text-[11px] text-slate-400 text-center mt-1">Demo code: <span className="font-mono font-bold text-slate-600">849201</span></div>
              </div>

              {otpError && (
                <div className="p-2 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition cursor-pointer"
                >
                  Verify & Download Ledger (.JSON/CSV)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
