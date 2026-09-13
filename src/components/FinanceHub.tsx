import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  Landmark, 
  CreditCard, 
  Receipt,
  Sparkles,
  Check
} from 'lucide-react';
import { FinanceTransaction, LanguageCode } from '../types';
import { FINANCE_TRANSACTIONS } from '../data/artisanData';

interface FinanceHubProps {
  currentLanguage: LanguageCode;
  isDarkMode?: boolean;
}

export const FinanceHub: React.FC<FinanceHubProps> = ({
  currentLanguage,
  isDarkMode = false,
}) => {
  const [transactions, setTransactions] = useState<FinanceTransaction[]>(FINANCE_TRANSACTIONS);
  const [isPayoutRequested, setIsPayoutRequested] = useState(false);

  const totalEarnings = transactions.reduce((acc, t) => acc + t.netPayout, 0);
  const availableToWithdraw = 4050;
  const escrowSecured = 2300;

  const handleRequestPayout = () => {
    setIsPayoutRequested(true);
    setTimeout(() => setIsPayoutRequested(false), 3000);
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300">
              <Wallet className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-slate-100">
              Finance & Payouts Hub
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Transparent 0% platform commission. Direct UPI bank transfers, protected escrow, and micro-finance access.
          </p>
        </div>

        <button
          onClick={handleRequestPayout}
          disabled={isPayoutRequested}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto ${
            isPayoutRequested 
              ? 'bg-emerald-600 text-white' 
              : 'bg-teal-600 hover:bg-teal-700 text-white'
          }`}
        >
          {isPayoutRequested ? (
            <>
              <Check className="w-4 h-4" />
              <span>UPI Transfer Initiated!</span>
            </>
          ) : (
            <>
              <Landmark className="w-4 h-4" />
              <span>Withdraw ₹{availableToWithdraw} to Bank (UPI)</span>
            </>
          )}
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-xs text-slate-500 font-semibold">Available for Withdrawal</span>
          <p className="text-2xl sm:text-3xl font-display font-extrabold text-teal-700 dark:text-teal-400 mt-2">
            ₹{availableToWithdraw}
          </p>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Direct to SBI A/C ending ••4021</span>
          </p>
        </div>

        <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-xs text-slate-500 font-semibold">Held in Secured Escrow</span>
          <p className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            ₹{escrowSecured}
          </p>
          <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Releases automatically upon buyer delivery</span>
          </p>
        </div>

        <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-2xs'}`}>
          <span className="text-xs text-slate-500 font-semibold">Platform Fee Charged</span>
          <p className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            ₹0 (0%)
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            100% of fair customer value reaches artisan
          </p>
        </div>
      </div>

      {/* Scheme Support Banner */}
      <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span className="text-teal-950 dark:text-teal-200">
            <strong>PM Vishwakarma Scheme & NABARD Artisan Credit Card:</strong> Pre-approved for ₹1,00,000 collateral-free working capital loan at 5% subsidized interest for purchasing new kiln materials.
          </span>
        </div>
        <button className="text-teal-700 dark:text-teal-400 font-bold hover:underline whitespace-nowrap">
          View Scheme Docs
        </button>
      </div>

      {/* Platform Monetization Model (Option A Transparency Card) */}
      <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-gradient-to-r from-slate-900 to-blue-950 text-white border-slate-800 shadow-md'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wide">
                Revenue Architecture • Option A
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              Buyer-Side Facilitation (2.0%) & Zero Farmer Commission Model
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Farmers and rural producers receive 100% of their listed price. Buyers pay a transparent 2% facilitation & escrow protection fee.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 bg-white/10 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>0% Farmer Cut • 100% Direct Payout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Farmer Realization</div>
            <div className="text-xl font-extrabold text-emerald-400 mt-1">100.0%</div>
            <div className="text-[11px] text-slate-300 mt-0.5">₹0 commission deducted from producers</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Buyer Facilitation Fee</div>
            <div className="text-xl font-extrabold text-blue-300 mt-1">2.0% Take-Rate</div>
            <div className="text-[11px] text-slate-300 mt-0.5">Funds AI Quality Assay & Escrow</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Net Farmer Benefit</div>
            <div className="text-xl font-extrabold text-amber-300 mt-1">+18% to +25%</div>
            <div className="text-[11px] text-slate-300 mt-0.5">vs traditional APMC middleman cuts</div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-2xs'}`}>
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Recent Settlements & Escrow Ledger
          </h3>
          <button className="text-xs font-semibold text-teal-700 dark:text-teal-400 flex items-center gap-1">
            <Download className="w-3.5 h-3.5" />
            <span>Export GST / Tax Invoice</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="p-3.5 font-bold">Transaction ID</th>
                <th className="p-3.5 font-bold">Craft & Buyer</th>
                <th className="p-3.5 font-bold">Gross</th>
                <th className="p-3.5 font-bold">Platform Fee</th>
                <th className="p-3.5 font-bold">Net Payout</th>
                <th className="p-3.5 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">
                    <div>{txn.id}</div>
                    <div className="text-[10px] text-slate-400">{txn.date}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{txn.craftName}</div>
                    <div className="text-[11px] text-slate-500">{txn.buyerName}</div>
                  </td>
                  <td className="p-3.5 font-mono">₹{txn.grossAmount}</td>
                  <td className="p-3.5 font-mono text-emerald-600 font-bold">₹{txn.platformFee} (0%)</td>
                  <td className="p-3.5 font-mono font-extrabold text-teal-700 dark:text-teal-400">
                    ₹{txn.netPayout}
                  </td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      txn.paymentStatus.includes('Settled')
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                    }`}>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{txn.paymentStatus}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
