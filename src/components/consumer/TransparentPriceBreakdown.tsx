import React, { useState } from 'react';
import { 
  PieChart as PieIcon, 
  Truck, 
  Building, 
  Tractor, 
  HelpCircle, 
  Info, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface TransparentPriceBreakdownProps {
  productName?: string;
  totalPrice?: number;
  farmerAmount?: number;
  transportAmount?: number;
  platformAmount?: number;
  unit?: string;
}

export const TransparentPriceBreakdown: React.FC<TransparentPriceBreakdownProps> = ({
  productName = 'Tomatoes',
  totalPrice = 27,
  farmerAmount = 23,
  transportAmount = 3,
  platformAmount = 1,
  unit = 'kg',
}) => {
  const [multiplier, setMultiplier] = useState<number>(1);

  const currentTotal = totalPrice * multiplier;
  const currentFarmer = farmerAmount * multiplier;
  const currentTransport = transportAmount * multiplier;
  const currentPlatform = platformAmount * multiplier;

  const farmerPercentage = ((currentFarmer / currentTotal) * 100).toFixed(1);
  const transportPercentage = ((currentTransport / currentTotal) * 100).toFixed(1);
  const platformPercentage = ((currentPlatform / currentTotal) * 100).toFixed(1);

  const chartData = [
    { name: 'Farmer Share', value: currentFarmer, color: '#047857' }, // Emerald 700
    { name: 'Transportation', value: currentTransport, color: '#0284c7' }, // Sky 600
    { name: 'Platform Operations', value: currentPlatform, color: '#64748b' }, // Slate 500
  ];

  return (
    <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-3xl gradient-border-organic border-0 p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Header with Title & Slogan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-black tracking-wide uppercase">
              100% Financial Transparency
            </span>
            <span className="text-xs text-slate-400 font-bold">•</span>
            <span className="text-xs text-slate-600 font-semibold">{productName}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-950 mt-1">
            Where does your ₹{currentTotal} go?
          </h3>
        </div>

        {/* Quantity Toggle for Breakdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-100 p-1.5 rounded-2xl gradient-border-organic border-0">
          <span className="text-xs font-bold text-slate-500 px-2">Calculate for:</span>
          {[1, 5, 10].map((kg) => (
            <button
              key={kg}
              onClick={() => setMultiplier(kg)}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                multiplier === kg
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              {kg} {unit}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Stacked Bar / Distribution Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
          <span>Cost Allocation Distribution</span>
          <span className="text-emerald-800 font-black">{farmerPercentage}% Direct to Farmer</span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="h-6 w-full rounded-2xl bg-slate-100 overflow-hidden flex shadow-inner gradient-border-organic border-0 p-0.5">
          <div 
            style={{ width: `${farmerPercentage}%` }}
            className="h-full bg-emerald-700 rounded-l-xl flex items-center justify-center text-white text-[10px] font-black transition-all duration-500"
            title={`Farmer: ₹${currentFarmer} (${farmerPercentage}%)`}
          >
            Farmer ₹{currentFarmer} ({farmerPercentage}%)
          </div>
          <div 
            style={{ width: `${transportPercentage}%` }}
            className="h-full bg-sky-600 flex items-center justify-center text-white text-[10px] font-black transition-all duration-500"
            title={`Transport: ₹${currentTransport} (${transportPercentage}%)`}
          >
            ₹{currentTransport}
          </div>
          <div 
            style={{ width: `${platformPercentage}%` }}
            className="h-full bg-slate-600 rounded-r-xl flex items-center justify-center text-white text-[10px] font-black transition-all duration-500"
            title={`Platform: ₹${currentPlatform} (${platformPercentage}%)`}
          >
            ₹{currentPlatform}
          </div>
        </div>
      </div>

      {/* Breakdown Grid: Large Emphasized Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* 1. Farmer Share (VISUALLY EMPHASIZED) */}
        <div className="p-5 rounded-2xl bg-emerald-50/80 border-2 border-emerald-600 relative overflow-hidden shadow-xs">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-200/40 rounded-full blur-xl pointer-events-none"></div>
          
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs">
              <Tractor className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider">
              {farmerPercentage}% Share
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">Farmer</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-display font-black text-emerald-950">₹{currentFarmer}</span>
              <span className="text-xs text-emerald-800 font-bold">/ {multiplier} {unit}</span>
            </div>
            <p className="text-[11px] text-emerald-900/80 font-medium mt-1">
              Paid straight to the farmer's bank account via Instant UPI Escrow.
            </p>
          </div>
        </div>

        {/* 2. Transportation */}
        <div className="p-5 rounded-2xl bg-slate-50 gradient-border-organic border-0">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-500">
              {transportPercentage}% Share
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Transportation</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-display font-black text-slate-900">₹{currentTransport}</span>
              <span className="text-xs text-slate-500 font-bold">/ {multiplier} {unit}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Temperature-monitored direct electric transport from farm cluster to local hub.
            </p>
          </div>
        </div>

        {/* 3. Platform Fee */}
        <div className="p-5 rounded-2xl bg-slate-50 gradient-border-organic border-0">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-white">
              <Building className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-500">
              {platformPercentage}% Share
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Platform</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-display font-black text-slate-900">₹{currentPlatform}</span>
              <span className="text-xs text-slate-500 font-bold">/ {multiplier} {unit}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Covers cloud server maintenance, quality grading AI, and ledger integrity.
            </p>
          </div>
        </div>

      </div>

      {/* Summary Table & Direct Message */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-emerald-300">
              “Most of your payment goes directly to the farmer.”
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Traditional retail gives farmers only ₹12–₹14 of a ₹32 purchase (under 40%). KisanDirect guarantees 85%+.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
          <span className="text-[10px] text-slate-300 block font-bold uppercase">Total Consumer Price</span>
          <span className="text-xl font-display font-black text-white">₹{currentTotal}</span>
        </div>
      </div>

    </div>
  );
};
