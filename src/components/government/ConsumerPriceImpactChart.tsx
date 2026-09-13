import React from 'react';
import { 
  TrendingDown, 
  ArrowDownRight, 
  ShieldCheck, 
  CheckCircle, 
  HelpCircle,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { CONSUMER_PRICE_DATA } from './GovernmentData';

export const ConsumerPriceImpactChart: React.FC = () => {
  const chartData = CONSUMER_PRICE_DATA.map((item) => ({
    name: item.commodity,
    'Traditional Retail (₹/kg)': item.traditionalPricePerKg,
    'KisanDirect Price (₹/kg)': item.kisanDirectPricePerKg,
    savingAmt: item.savingAmount,
    savingPct: item.savingPercentage.toFixed(1),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 font-sans">
          <p className="font-bold text-slate-100">{data.name}</p>
          <div className="flex items-center justify-between gap-4 text-slate-300">
            <span>Traditional Retail:</span>
            <span className="font-mono text-slate-300">₹{data['Traditional Retail (₹/kg)']} /kg</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-slate-300">
            <span>KisanDirect Price:</span>
            <span className="font-mono text-cyan-400 font-bold">₹{data['KisanDirect Price (₹/kg)']} /kg</span>
          </div>
          <div className="pt-1 border-t border-slate-700 flex items-center justify-between text-cyan-300 font-semibold">
            <span>Consumer Saving:</span>
            <span>₹{data.savingAmt}/kg (-{data.savingPct}%)</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl gradient-border-organic border-0 p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Consumer Price Moderation Impact
              </h3>
              <p className="text-xs text-slate-500">
                Retail market price comparison across essential daily produce
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 font-mono font-bold text-xs border border-cyan-200">
            ↓ -9.2% Average Saving
          </span>
        </div>

        {/* Big Contrast Highlight */}
        <div className="mt-4 grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl gradient-border-organic border-0">
          <div className="border-r border-slate-200 pr-2">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Traditional Retail Mandi</div>
            <div className="text-xl font-bold text-slate-700 font-mono mt-0.5">₹32.00 <span className="text-xs font-normal text-slate-400">/ kg avg</span></div>
            <div className="text-[11px] text-slate-500 mt-1">Multi-tier wholesale markups (~28%)</div>
          </div>
          <div className="pl-2">
            <div className="text-[11px] font-bold text-cyan-950 uppercase tracking-wider">KisanDirect Consumer Price</div>
            <div className="text-xl font-extrabold text-cyan-700 font-mono mt-0.5">₹29.00 <span className="text-xs font-semibold text-cyan-600">/ kg avg</span></div>
            <div className="text-[11px] text-cyan-900 font-semibold mt-1 flex items-center gap-1">
              <ArrowDownRight className="w-3.5 h-3.5 text-cyan-600" />
              <span>-₹3.00 (-9.2%) Household Saving</span>
            </div>
          </div>
        </div>

        {/* Recharts Bar Comparison */}
        <div className="mt-4 h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                iconType="circle"
                iconSize={8}
              />
              <Bar dataKey="Traditional Retail (₹/kg)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="KisanDirect Price (₹/kg)" fill="#0891b2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dual Impact Principle Banner */}
      <div className="mt-4 p-3 rounded-xl bg-cyan-50/80 border border-cyan-200/80 text-xs text-cyan-950 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-cyan-950">Dual-Impact Proof: </span>
          <span>
            By eliminating 2.3 intermediate layers, farmers earn <strong className="text-emerald-800">18.4% more</strong> while urban households pay <strong className="text-cyan-800">9.2% less</strong> on essential nutrition.
          </span>
        </div>
      </div>
    </div>
  );
};
