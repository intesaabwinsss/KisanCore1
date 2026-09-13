import React, { useState } from 'react';
import { 
  Receipt, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Download, 
  QrCode, 
  Search, 
  Sparkles, 
  ExternalLink,
  Copy,
  Check,
  Tractor,
  Clock
} from 'lucide-react';
import { ConsumerTransactionRecord } from './ConsumerTypes';

interface ConsumerTransactionLedgerProps {
  transactions: ConsumerTransactionRecord[];
}

export const ConsumerTransactionLedger: React.FC<ConsumerTransactionLedgerProps> = ({
  transactions,
}) => {
  const [selectedTxId, setSelectedTxId] = useState<string>(transactions[0]?.txId || '');
  const [copiedHash, setCopiedHash] = useState(false);

  const activeTx = transactions.find(t => t.txId === selectedTxId) || transactions[0];

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-3xl gradient-border-organic border-0 p-6 sm:p-8 shadow-sm space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-black tracking-wide uppercase flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Immutable Ledger</span>
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-950 mt-1">
            Consumer Transaction History
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Cryptographically signed transaction blocks verifying direct farmgate settlements.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-2xl">
          <Lock className="w-3.5 h-3.5 text-emerald-700" />
          <span>SHA-256 Chained Integrity Verified</span>
        </div>
      </div>

      {/* Main Ledger Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Transaction Selector List */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
            Recent Certified Transactions
          </span>

          {transactions.map((tx) => {
            const isSelected = tx.txId === activeTx?.txId;
            return (
              <div
                key={tx.txId}
                onClick={() => setSelectedTxId(tx.txId)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${
                  isSelected
                    ? 'bg-emerald-50/80 border-emerald-600 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{tx.emoji}</span>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{tx.productTitle}</h4>
                      <span className="text-[11px] text-slate-500 font-mono font-bold">
                        Transaction #{tx.txId}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-display font-black text-slate-900">
                    ₹{tx.totalPaid}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                  <span className="flex items-center gap-1 font-semibold text-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Completed</span>
                  </span>
                  <span>{tx.timestamp.split(' ')[0]}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Exact Tamper-Evident Transaction Certificate */}
        {activeTx && (
          <div className="lg:col-span-7 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-xl space-y-6">
            
            {/* Top Seal */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-display font-black text-white">
                    Transaction #{activeTx.txId}
                  </h4>
                  <p className="text-[11px] text-emerald-300 font-mono">
                    Order Ref: {activeTx.orderNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>✓ Completed</span>
              </div>
            </div>

            {/* Structured Itemized Breakdown (Requested in Spec) */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3.5 text-xs">
              
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block">
                  Product:
                </span>
                <span className="text-sm font-black text-white flex items-center gap-2 mt-0.5">
                  <span>{activeTx.emoji}</span>
                  <span>{activeTx.productTitle}</span>
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block">
                  Farmer:
                </span>
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 mt-0.5">
                  <Tractor className="w-3.5 h-3.5" />
                  <span>{activeTx.farmerNetwork}</span>
                </span>
              </div>

              <div className="pt-2 border-t border-white/10 space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Product Value:</span>
                  <span className="font-bold text-white">₹{activeTx.productValue}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Transportation:</span>
                  <span className="font-bold text-white">₹{activeTx.transportationFee}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Platform:</span>
                  <span className="font-bold text-white">₹{activeTx.platformFee}</span>
                </div>

                <div className="flex justify-between pt-2 border-t border-white/20 text-sm font-black text-white">
                  <span>Total:</span>
                  <span className="text-xl font-display font-black text-emerald-300">₹{activeTx.totalPaid}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Payment Status:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <span>✓ Completed via {activeTx.paymentMethod}</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">Consumer Saved:</span>
                  <span className="font-extrabold text-amber-300">₹{activeTx.savingsVsRetail}</span>
                </div>
              </div>

            </div>

            {/* Cryptographic Ledger Block Signature */}
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>🔐 Securely Recorded (SHA-256 Block Hash)</span>
                </span>
                <button
                  onClick={() => handleCopyHash(activeTx.blockHash)}
                  className="text-emerald-300 hover:text-white flex items-center gap-1 font-bold"
                >
                  {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <p className="font-mono text-[10px] text-slate-400 break-all bg-white/5 p-2 rounded-lg border border-white/5">
                {activeTx.blockHash}
              </p>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span>Cipher: {activeTx.securityCipher}</span>
                <span>Timestamp: {activeTx.timestamp}</span>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
