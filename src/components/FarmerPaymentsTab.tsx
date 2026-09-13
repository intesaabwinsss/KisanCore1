import React, { useState } from 'react';
import { 
  Coins, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  Download, 
  TrendingUp, 
  Clock, 
  Building2, 
  Wallet,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Receipt
} from 'lucide-react';
import { FarmerPaymentTransaction, FarmerProfile } from '../types';

interface FarmerPaymentsTabProps {
  transactions: FarmerPaymentTransaction[];
  profile: FarmerProfile;
  onInstantWithdraw: () => void;
  withdrawalNotice: string | null;
}

export const FarmerPaymentsTab: React.FC<FarmerPaymentsTabProps> = ({
  transactions,
  profile,
  onInstantWithdraw,
  withdrawalNotice,
}) => {
  const [selectedTx, setSelectedTx] = useState<FarmerPaymentTransaction | null>(null);

  const totalGross = transactions.reduce((sum, t) => sum + t.grossAmount, 0);
  const totalSettled = transactions
    .filter((t) => t.status === 'settled')
    .reduce((sum, t) => sum + t.netPayoutAmount, 0);
  const totalInEscrow = transactions
    .filter((t) => t.status === 'in_escrow')
    .reduce((sum, t) => sum + t.netPayoutAmount, 0);
  const totalCommissionSaved = transactions.reduce((sum, t) => sum + t.traditionalCommissionLost, 0);

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      {withdrawalNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{withdrawalNotice}</span>
        </div>
      )}

      {/* Top Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Available Instant Balance */}
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-6 rounded-3xl border border-emerald-800/40 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700/80 border border-emerald-500/40 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-200" />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Live Balance
            </span>
          </div>

          <div>
            <div className="text-xs text-emerald-300 font-semibold">Available for Instant Payout</div>
            <div className="text-2xl font-display font-extrabold text-white mt-1">₹1,42,800</div>
            <div className="text-[11px] text-emerald-200/80 mt-0.5 flex items-center gap-1">
              <span>Direct to UPI: {profile.bankAccount.upiId}</span>
            </div>
          </div>

          <button
            onClick={onInstantWithdraw}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Coins className="w-4 h-4 text-slate-950" />
            <span>Withdraw to Bank via UPI</span>
          </button>
        </div>

        {/* Card 2: Total Settled to Date */}
        <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-6 rounded-3xl gradient-border-organic border-0 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5 text-blue-700" />
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Cleared</span>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-semibold">Total Direct Payouts Received</div>
            <div className="text-2xl font-display font-extrabold text-slate-900 mt-1">
              ₹{totalSettled.toLocaleString()}
            </div>
            <div className="text-[11px] text-blue-700 font-medium mt-0.5">
              100% credited without any deductions
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            Credited to {profile.bankAccount.bankName}
          </div>
        </div>

        {/* Card 3: Held in Secure Escrow */}
        <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-6 rounded-3xl gradient-border-organic border-0 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
            </div>
            <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Escrow Protected
            </span>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-semibold">Active Orders in Escrow</div>
            <div className="text-2xl font-display font-extrabold text-slate-900 mt-1">
              ₹{totalInEscrow.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Released upon packhouse arrival
            </div>
          </div>

          <div className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-semibold">
            2 active buyer orders in transit
          </div>
        </div>

        {/* Card 4: Middlemen Commission Saved */}
        <div className="bg-emerald-50/70 p-6 rounded-3xl border border-emerald-200 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-200 text-emerald-900 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-800" />
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full">
              Extra Profit
            </span>
          </div>

          <div>
            <div className="text-xs text-emerald-900 font-semibold">Middleman Fees Saved (0% Cut)</div>
            <div className="text-2xl font-display font-extrabold text-emerald-900 mt-1">
              +₹{totalCommissionSaved.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
              Saved from Arhatiya 8% cut
            </div>
          </div>

          <div className="text-[11px] text-emerald-900 bg-white p-2.5 rounded-xl border border-emerald-300 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>100% value retained by farmer</span>
          </div>
        </div>
      </div>

      {/* Linked Bank Account Card */}
      <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-6 sm:p-7 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Primary Settlement Bank Account & Instant UPI
              </h3>
              <p className="text-xs text-slate-500">
                All order escrow payouts are credited directly to this verified account with zero TDS deduction on agriculture
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>NPCI UPI Verified</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div>
            <div className="text-slate-400 font-semibold">Account Holder</div>
            <div className="font-bold text-slate-900 mt-0.5">{profile.bankAccount.accountHolder}</div>
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Bank & Branch</div>
            <div className="font-bold text-slate-900 mt-0.5">{profile.bankAccount.bankName}</div>
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Account Number</div>
            <div className="font-mono font-bold text-slate-900 mt-0.5">{profile.bankAccount.accountNumber}</div>
          </div>
          <div>
            <div className="text-slate-400 font-semibold">Instant UPI VPA</div>
            <div className="font-mono font-bold text-emerald-800 mt-0.5">{profile.bankAccount.upiId}</div>
          </div>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-6 sm:p-8 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Payment & Payout Transaction Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Full cryptographic record of buyer payments, escrow locks, and direct bank transfers
            </p>
          </div>

          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
            {transactions.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-3 px-3">Date & Ref</th>
                <th className="py-3 px-3">Crop Lot & Buyer</th>
                <th className="py-3 px-3">Gross Value</th>
                <th className="py-3 px-3">Commission Cut</th>
                <th className="py-3 px-3">Net Farmer Payout</th>
                <th className="py-3 px-3">Status & Method</th>
                <th className="py-3 px-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900">{tx.date}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{tx.transactionRef}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900">{tx.cropLot}</div>
                    <div className="text-[11px] text-slate-500">{tx.buyerName}</div>
                  </td>

                  <td className="py-3.5 px-3 font-semibold text-slate-700">
                    ₹{tx.grossAmount.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-bold text-emerald-700">₹0.00 (0%)</span>
                    <div className="text-[10px] text-slate-400">
                      Saved ₹{tx.traditionalCommissionLost.toLocaleString()}
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-extrabold text-emerald-900 text-sm">
                      ₹{tx.netPayoutAmount.toLocaleString()}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex flex-col gap-0.5">
                      <span className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-md w-fit ${
                        tx.status === 'settled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {tx.status === 'settled' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span className="capitalize">{tx.status === 'settled' ? 'Settled to Bank' : 'Locked in Escrow'}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{tx.payoutMethod}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] flex items-center gap-1 ml-auto transition-colors"
                    >
                      <Receipt className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Slip</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Slip Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-3xl max-w-md w-full p-6 space-y-4 gradient-border-organic border-0 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-slate-900">
                  Farmer Settlement Receipt
                </h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 space-y-1">
                <div className="text-[11px] text-slate-400">UTR / Reference Number:</div>
                <div className="font-mono font-bold text-slate-900 text-xs">{selectedTx.utrNumber}</div>
              </div>

              <div className="space-y-2 border-y border-slate-200 py-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span className="font-bold text-slate-900">{selectedTx.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Order Reference:</span>
                  <span className="font-bold text-slate-900">{selectedTx.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Harvest Lot:</span>
                  <span className="font-bold text-slate-900">{selectedTx.cropLot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Buyer:</span>
                  <span className="font-bold text-slate-900">{selectedTx.buyerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Gross Amount:</span>
                  <span className="font-bold text-slate-900">₹{selectedTx.grossAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Platform Commission (0%):</span>
                  <span className="font-bold text-emerald-700">₹0.00</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-950 text-sm pt-2 border-t border-slate-200">
                  <span>Net Credited Amount:</span>
                  <span className="text-emerald-800 font-extrabold">₹{selectedTx.netPayoutAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 text-[11px]">
                <span className="font-bold">Traditional APMC Middlemen Cut Saved: </span>
                <span className="text-emerald-800 font-bold">+₹{selectedTx.traditionalCommissionLost.toLocaleString()}</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedTx(null)}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
