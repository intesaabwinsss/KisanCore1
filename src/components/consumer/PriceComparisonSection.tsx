import React, { useState } from 'react';
import { 
  TrendingDown, 
  ArrowDownRight, 
  CheckCircle2, 
  Sparkles, 
  Scale, 
  DollarSign, 
  ShoppingBag,
  Percent,
  HelpCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { CONSUMER_PRODUCTS } from './ConsumerData';

interface PriceComparisonSectionProps {
  onSelectProduct?: (productId: string) => void;
}

export const PriceComparisonSection: React.FC<PriceComparisonSectionProps> = ({
  onSelectProduct,
}) => {
  const [selectedCropId, setSelectedCropId] = useState<string>('prod-tomato');

  const activeProduct = CONSUMER_PRODUCTS.find(p => p.id === selectedCropId) || CONSUMER_PRODUCTS[0];
  const savingsPerKg = activeProduct.traditionalRetailPricePerKg - activeProduct.kisanDirectPricePerKg;
  const savingsPercentage = ((savingsPerKg / activeProduct.traditionalRetailPricePerKg) * 100).toFixed(1);

  // Multi-commodity comparison dataset for Recharts
  const comparisonData = CONSUMER_PRODUCTS.map(p => ({
    name: p.name,
    kisanDirect: p.kisanDirectPricePerKg,
    traditionalRetail: p.traditionalRetailPricePerKg,
    savings: p.traditionalRetailPricePerKg - p.kisanDirectPricePerKg,
    unit: p.unit,
  }));

  return (
    <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-3xl gradient-border-organic border-0 p-6 sm:p-8 shadow-sm space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-black tracking-wide uppercase flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Zero Middleman Arbitrage</span>
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-950 mt-1">
            Traditional vs KisanDirect Price Comparison
          </h3>
          <p className="text-sm font-extrabold text-emerald-800 mt-0.5">
            “Save more while supporting local farmers.”
          </p>
        </div>

        {/* Commodity Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {CONSUMER_PRODUCTS.slice(0, 5).map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedCropId(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap ${
                selectedCropId === p.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{p.emoji}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main 3-Block Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        
        {/* 1. Traditional Retail Card */}
        <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wider">
                Supermarkets & Local Vendors
              </span>
            </div>
            <h4 className="text-lg font-black text-slate-800 mt-2">Traditional Retail</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Includes 4–5 middleman commissions, APMC cess, and warehouse storage costs.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-display font-black text-slate-700">
                ₹{activeProduct.traditionalRetailPricePerKg}
              </span>
              <span className="text-sm font-bold text-slate-500">/ {activeProduct.unit}</span>
            </div>
            <div className="mt-2 text-[11px] text-rose-600 font-semibold bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 inline-block">
              Farmer gets only ~₹12/kg (under 40%)
            </div>
          </div>
        </div>

        {/* 2. KisanDirect Price Card */}
        <div className="p-6 rounded-3xl bg-emerald-50/90 border-2 border-emerald-600 flex flex-col justify-between space-y-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-300/30 rounded-bl-full pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-800 text-white text-[10px] font-black uppercase tracking-wider">
                Direct Farmgate Sourced
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            <h4 className="text-lg font-black text-emerald-950 mt-2">KisanDirect</h4>
            <p className="text-xs text-emerald-900/80 mt-0.5">
              Direct farmer-to-consumer digital link with zero commission brokers.
            </p>
          </div>

          <div className="pt-4 border-t border-emerald-200">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-display font-black text-emerald-950">
                ₹{activeProduct.kisanDirectPricePerKg}
              </span>
              <span className="text-sm font-bold text-emerald-800">/ {activeProduct.unit}</span>
            </div>
            <div className="mt-2 text-[11px] text-emerald-900 font-bold bg-emerald-200/80 px-2.5 py-1 rounded-lg inline-block">
              Farmer gets ₹{activeProduct.farmerSharePerKg}/kg (85%+ direct share)
            </div>
          </div>
        </div>

        {/* 3. YOU SAVE (EXTREMELY PROMINENT) */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-emerald-600 text-slate-950 flex flex-col justify-between space-y-4 shadow-md">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                Instant Consumer Savings
              </span>
              <Sparkles className="w-5 h-5 text-slate-950 animate-bounce" />
            </div>
            <h4 className="text-xl font-display font-black text-slate-950 mt-2">
              You Save
            </h4>
            <p className="text-xs text-slate-900 font-semibold mt-0.5">
              Directly kept in your wallet on every single kilogram purchased.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-950/20">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-display font-black text-slate-950">
                ₹{savingsPerKg}
              </span>
              <span className="text-base font-extrabold text-slate-900">/ {activeProduct.unit}</span>
            </div>
            <div className="mt-2 text-xs font-black text-slate-950 bg-white/90 px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 shadow-2xs">
              <ArrowDownRight className="w-4 h-4 text-emerald-700" />
              <span>{savingsPercentage}% Cheaper than Supermarket</span>
            </div>
          </div>
        </div>

      </div>

      {/* Multi-Commodity Recharts Bar Chart */}
      <div className="pt-4 border-t border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">
              Basket Price Comparison Across Fresh Produce (₹/kg)
            </h4>
            <p className="text-xs text-slate-500">
              Transparent rate benchmark verified against daily APMC retail market rates.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-400"></span>
              <span className="text-slate-600">Traditional Retail</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
              <span className="text-emerald-800">KisanDirect</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 700, fill: '#334155' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip 
                formatter={(value: any, name: any) => [
                  `₹${value}`, 
                  name === 'kisanDirect' ? 'KisanDirect' : 'Traditional Retail'
                ]}
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: '1px solid #e2e8f0', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                  fontWeight: 700
                }}
              />
              <Bar dataKey="traditionalRetail" name="traditionalRetail" fill="#94a3b8" radius={[8, 8, 0, 0]} maxBarSize={36} />
              <Bar dataKey="kisanDirect" name="kisanDirect" fill="#059669" radius={[8, 8, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
