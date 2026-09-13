import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  Clock, 
  Sparkles, 
  Calculator,
  ArrowRight,
  Info,
  Layers,
  PieChart as PieChartIcon
} from 'lucide-react';
import { PriceTransparencyDashboard } from './PriceTransparencyDashboard';

interface FarmerTraditionalComparisonProps {
  totalSavingsToDate: number;
}

export const FarmerTraditionalComparison: React.FC<FarmerTraditionalComparisonProps> = ({
  totalSavingsToDate = 148500,
}) => {
  const [viewMode, setViewMode] = useState<'transparency_dashboard' | 'custom_lot_calculator'>('transparency_dashboard');
  const [calcCrop, setCalcCrop] = useState('Onion');
  const [calcQuantityKg, setCalcQuantityKg] = useState(5000);
  const [calcPricePerKg, setCalcPricePerKg] = useState(42);
  const [arhatiyaPercent, setArhatiyaPercent] = useState(8.5);

  // Calculations
  const grossValue = calcQuantityKg * calcPricePerKg;
  
  // Traditional Mandi Deductions
  const arhatiyaCut = Math.round(grossValue * (arhatiyaPercent / 100));
  const weighmentLoss = Math.round(grossValue * 0.03); // 3% kata / uncalibrated weighment loss
  const unreceiptedHandling = Math.round((calcQuantityKg / 50) * 8); // ₹8/bag handling & palledari
  const distressDiscount = Math.round(grossValue * 0.05); // 5% distress markdown at peak mandi hours
  const totalTraditionalLoss = arhatiyaCut + weighmentLoss + unreceiptedHandling + distressDiscount;
  const traditionalTakeHome = grossValue - totalTraditionalLoss;

  // KisanMandi Direct Realization
  const kisanMandiCommission = 0;
  const kisanMandiTakeHome = grossValue;
  const netExtraIncome = kisanMandiTakeHome - traditionalTakeHome;
  const extraPercentage = Math.round((netExtraIncome / traditionalTakeHome) * 100);

  return (
    <div className="space-y-8">
      {/* View Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-4 rounded-3xl gradient-border-organic border-0 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-700" />
            <span>Direct Price Transparency & Channel Comparison</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare traditional APMC mandi middleman spreads against direct KisanMandi digital selling.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl shrink-0">
          <button
            onClick={() => setViewMode('transparency_dashboard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'transparency_dashboard'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Full Supply Chain Journey</span>
          </button>

          <button
            onClick={() => setViewMode('custom_lot_calculator')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'custom_lot_calculator'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>My Harvest Simulator</span>
          </button>
        </div>
      </div>

      {viewMode === 'transparency_dashboard' ? (
        <PriceTransparencyDashboard userRole="farmer" />
      ) : (
        <div className="space-y-8 animate-in fade-in">
          {/* Top Highlight Banner */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-emerald-700/40 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Middleman Elimination Impact</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                Farmer Income Comparison & Loss Elimination
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200/80 max-w-2xl leading-relaxed">
                In traditional APMC mandis, farmers lose up to 18% - 25% of their harvest value in commission agent fees, weighment manipulation, and unreceipted handling. KisanMandi ensures 100% direct bank credit.
              </p>
            </div>

            <div className="bg-white/10 p-4 sm:p-5 rounded-2xl border border-white/10 text-center shrink-0 w-full sm:w-auto">
              <div className="text-[11px] text-emerald-300 font-semibold uppercase">Your Total Extra Income Retained</div>
              <div className="text-3xl font-display font-extrabold text-white mt-1">
                +₹{totalSavingsToDate.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-200 mt-0.5">vs Traditional Arhatiya Channels</div>
            </div>
          </div>

          {/* Interactive What-If Earnings Calculator */}
          <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Interactive Harvest Profitability Calculator
                  </h3>
                  <p className="text-xs text-slate-500">
                    Calculate your exact take-home profit gain for any truckload or crop batch
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Real-Time Simulation
              </span>
            </div>

            {/* Input Parameters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl gradient-border-organic border-0">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Select Crop
                </label>
                <select
                  value={calcCrop}
                  onChange={(e) => setCalcCrop(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-emerald-600 font-semibold"
                >
                  <option value="Onion">Onion (Pyaaz)</option>
                  <option value="Tomato">Tomato (Tamatar)</option>
                  <option value="Potato">Potato (Aloo)</option>
                  <option value="Garlic">Garlic (Lahsun)</option>
                  <option value="Capsicum">Capsicum</option>
                  <option value="Wheat">Wheat (Gehu)</option>
                  <option value="Basmati Rice">Basmati Rice</option>
                  <option value="Orange">Nagpur Orange</option>
                  <option value="Apple">Shimla Apple</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Harvest Quantity (kg)
                </label>
                <input
                  type="number"
                  step="100"
                  min="100"
                  value={calcQuantityKg}
                  onChange={(e) => setCalcQuantityKg(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-emerald-600 font-bold text-slate-900"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  = {(calcQuantityKg / 100).toFixed(1)} Quintals ({ (calcQuantityKg / 1000).toFixed(2) } MT)
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Direct Price (₹ / kg)
                </label>
                <input
                  type="number"
                  min="1"
                  value={calcPricePerKg}
                  onChange={(e) => setCalcPricePerKg(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-emerald-600 font-bold text-emerald-900"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  = ₹{(calcPricePerKg * 100).toLocaleString()} per Quintal
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Local APMC Middleman Fee (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="4"
                  max="15"
                  value={arhatiyaPercent}
                  onChange={(e) => setArhatiyaPercent(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-emerald-600 font-bold text-rose-700"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Standard APMC rate is 6% - 10%
                </span>
              </div>
            </div>

            {/* Realization Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Traditional APMC Channel Card */}
              <div className="p-6 rounded-3xl border border-rose-200 bg-rose-50/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      Traditional APMC Mandi Channel
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                    High Leakage
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Gross Produce Value:</span>
                    <span className="font-semibold text-slate-900">₹{grossValue.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-rose-700">
                    <span>Arhatiya Commission ({arhatiyaPercent}%):</span>
                    <span className="font-bold">-₹{arhatiyaCut.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-rose-700">
                    <span>Kata / Weighment Manipulation (3%):</span>
                    <span className="font-bold">-₹{weighmentLoss.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-rose-700">
                    <span>Palledari & Unreceipted Handling:</span>
                    <span className="font-bold">-₹{unreceiptedHandling.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-rose-700">
                    <span>Distress Peak Markdown (5%):</span>
                    <span className="font-bold">-₹{distressDiscount.toLocaleString()}</span>
                  </div>

                  <div className="pt-3 border-t border-rose-200 flex justify-between items-baseline font-bold">
                    <span className="text-slate-900">Farmer Net Take-Home:</span>
                    <span className="text-xl font-extrabold text-rose-800">
                      ₹{traditionalTakeHome.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-[11px] text-rose-700 bg-white/80 p-2.5 rounded-xl border border-rose-200">
                    ⚠️ Delayed Payment: Typically paid after 15 to 45 days in cash/cheques.
                  </div>
                </div>
              </div>

              {/* KisanMandi Direct Channel Card */}
              <div className="p-6 rounded-3xl border-2 border-emerald-500 bg-emerald-50/50 space-y-4 relative shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-extrabold text-emerald-950 text-sm">
                      KisanMandi Direct Digital Channel
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200 px-2.5 py-0.5 rounded-full">
                    0% Commission
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Gross Produce Value:</span>
                    <span className="font-semibold text-slate-900">₹{grossValue.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Platform Commission:</span>
                    <span className="font-bold text-emerald-700">₹0.00 (100% Free)</span>
                  </div>

                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Digital Weighment & AI Grade:</span>
                    <span className="font-bold text-emerald-700">₹0.00 (Zero Loss)</span>
                  </div>

                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Direct B2B Buyer Settlement:</span>
                    <span className="font-bold text-emerald-700">Direct Farmgate Payout</span>
                  </div>

                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Escrow Protection:</span>
                    <span className="font-bold text-emerald-700">100% Guaranteed</span>
                  </div>

                  <div className="pt-3 border-t border-emerald-300 flex justify-between items-baseline font-bold">
                    <span className="text-emerald-950">Farmer Net Take-Home:</span>
                    <span className="text-2xl font-extrabold text-emerald-900">
                      ₹{kisanMandiTakeHome.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-[11px] text-emerald-900 bg-white p-2.5 rounded-xl border border-emerald-300 font-bold flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant UPI Credit: Transferred on delivery signoff with real-time UTR.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Extra Profit Highlight Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-emerald-100">
                    Net Farmer Benefit On This Harvest Lot
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold">
                    +₹{netExtraIncome.toLocaleString()} Extra In Your Bank Account (+{extraPercentage}% More)
                  </div>
                </div>
              </div>

              <div className="text-xs bg-white text-emerald-900 font-bold px-4 py-2 rounded-xl shrink-0">
                Zero Deductions Guaranteed
              </div>
            </div>
          </div>

          {/* Side-by-Side Detailed Breakdown Table */}
          <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-6 sm:p-8 shadow-2xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Comprehensive Feature & Fee Comparison Matrix
            </h3>
            <p className="text-xs text-slate-500">
              How KisanMandi directly compares with conventional wholesale Mandi commission agents
            </p>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-3">Evaluation Parameter</th>
                    <th className="py-3 px-3 text-rose-800 bg-rose-50/50 rounded-t-xl">Traditional APMC Middleman</th>
                    <th className="py-3 px-3 text-emerald-800 bg-emerald-50/50 rounded-t-xl">KisanMandi Direct</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3.5 px-3 font-bold text-slate-800">Middleman Commission</td>
                    <td className="py-3.5 px-3 text-rose-700 bg-rose-50/20 font-semibold">6% to 12% deducted from farmer</td>
                    <td className="py-3.5 px-3 text-emerald-700 bg-emerald-50/20 font-bold">0% (Completely Free for Farmer)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-3 font-bold text-slate-800">Payment Timeline</td>
                    <td className="py-3.5 px-3 text-rose-700 bg-rose-50/20">15 to 45 days delay (Credit risks)</td>
                    <td className="py-3.5 px-3 text-emerald-700 bg-emerald-50/20 font-bold">Instant UPI / IMPS on dispatch & arrival</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-3 font-bold text-slate-800">Weighment Transparency</td>
                    <td className="py-3.5 px-3 text-rose-700 bg-rose-50/20">Frequent 2-4% Kata / uncalibrated scale loss</td>
                    <td className="py-3.5 px-3 text-emerald-700 bg-emerald-50/20 font-bold">100% Certified Digital Load Cells</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-3 font-bold text-slate-800">Quality Assay & Grading</td>
                    <td className="py-3.5 px-3 text-rose-700 bg-rose-50/20">Subjective visual down-grading by trader</td>
                    <td className="py-3.5 px-3 text-emerald-700 bg-emerald-50/20 font-bold">Computer Vision AGMARK AI Inspection</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-3 font-bold text-slate-800">Buyer Access</td>
                    <td className="py-3.5 px-3 text-rose-700 bg-rose-50/20">Limited to 2-3 local cartel traders</td>
                    <td className="py-3.5 px-3 text-emerald-700 bg-emerald-50/20 font-bold">1,840+ Pan-India Supermarkets, Exporters & Processors</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-3 font-bold text-slate-800">Price Protection</td>
                    <td className="py-3.5 px-3 text-rose-700 bg-rose-50/20">Distress selling during peak harvest arrivals</td>
                    <td className="py-3.5 px-3 text-emerald-700 bg-emerald-50/20 font-bold">Minimum Acceptable Floor Price Enforcement</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

