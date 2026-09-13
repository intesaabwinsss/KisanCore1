import React, { useState } from 'react';
import {
  TrendingUp,
  Percent,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
  Sliders,
  DollarSign,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';

interface EarningsComparisonProps {
  traditionalEarnings?: number;
  kisanDirectEarnings?: number;
  cropName?: string;
  volumeKg?: number;
}

export const EarningsComparison: React.FC<EarningsComparisonProps> = ({
  traditionalEarnings = 8500,
  kisanDirectEarnings = 11000,
  cropName = 'Tomato (500 kg Lot)',
  volumeKg: initialVolume = 500,
}) => {
  const [interactiveVolume, setInteractiveVolume] = useState<number>(initialVolume);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);

  // Per kg benchmark economics
  const traditionalRatePerKg = 17; // Middleman buys at ₹17/kg after deductions
  const kisanDirectRatePerKg = 22; // Direct buyer pays ₹22/kg

  const calculatedTraditional = interactiveVolume * traditionalRatePerKg;
  const calculatedKisanDirect = interactiveVolume * kisanDirectRatePerKg;
  const extraIncome = calculatedKisanDirect - calculatedTraditional;
  const percentageIncrease = calculatedTraditional > 0 
    ? ((extraIncome / calculatedTraditional) * 100).toFixed(1) 
    : '29.4';

  const chartData = [
    {
      channel: 'Traditional Supply Chain',
      shortName: 'Traditional APMC',
      earnings: calculatedTraditional,
      color: '#94A3B8', // Slate gray
      rate: `₹${traditionalRatePerKg}/kg`,
      deductions: 'Commission (8%) + Handling',
    },
    {
      channel: 'KisanDirect Platform',
      shortName: 'KisanDirect Direct',
      earnings: calculatedKisanDirect,
      color: '#059669', // Emerald green
      rate: `₹${kisanDirectRatePerKg}/kg`,
      deductions: 'Zero Intermediary Fee',
    },
  ];

  return (
    <div
      id="earnings-comparison-card"
      className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm border border-emerald-300 shadow-2xs">
              💰
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Your Earnings Comparison
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black border border-emerald-300 animate-pulse">
                  SIH Impact Metric
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Eliminating middlemen gives you direct market realization
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 self-start sm:self-auto bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200/80 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{showBreakdown ? 'Hide Cost Math' : 'Cost Breakdown'}</span>
          </button>
        </div>

        {/* 3 Key Metrics Box (Traditional, KisanDirect, Extra Income) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          {/* Traditional Earnings */}
          <div className="p-4 rounded-2xl bg-slate-50 gradient-border-organic border-0 flex flex-col justify-between">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Traditional Supply Chain
            </div>
            <div className="mt-2">
              <div className="text-xl sm:text-2xl font-black text-slate-700 font-mono">
                ₹{calculatedTraditional.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                Middlemen take ~₹{((calculatedKisanDirect - calculatedTraditional) / interactiveVolume).toFixed(0)}/kg cut
              </div>
            </div>
          </div>

          {/* KisanDirect Earnings */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col justify-between relative overflow-hidden">
            <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide flex items-center justify-between">
              <span>KisanDirect</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div className="mt-2">
              <div className="text-xl sm:text-2xl font-black text-emerald-900 font-mono">
                ₹{calculatedKisanDirect.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
                <span>100% Direct Buyer Settlement</span>
              </div>
            </div>
          </div>

          {/* Extra Income (Highlighted) */}
          <div className="p-4 rounded-2xl bg-linear-to-br from-amber-400 to-amber-500 text-slate-950 flex flex-col justify-between shadow-xs">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-950 flex items-center justify-between">
              <span>Extra Income Earned</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-950 text-amber-300 font-black text-[10px]">
                +{percentageIncrease}%
              </span>
            </div>
            <div className="mt-2">
              <div className="text-2xl sm:text-3xl font-black text-slate-950 font-mono">
                +₹{extraIncome.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] font-bold text-slate-900 mt-0.5">
                Income Increase: <span className="underline font-black">+{percentageIncrease}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Chart Comparison */}
        <div className="bg-slate-50/70 p-4 rounded-2xl gradient-border-organic border-0/70 mt-3">
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis
                  type="number"
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(1)}k`}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                />
                <YAxis
                  type="category"
                  dataKey="shortName"
                  tick={{ fontSize: 11, fontWeight: 700, fill: '#334155' }}
                  width={110}
                />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Payout']}
                  contentStyle={{
                    borderRadius: '12px',
                    borderColor: '#E2E8F0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                />
                <Bar dataKey="earnings" radius={[0, 8, 8, 0]} barSize={24}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Interactive Harvest Volume Slider for Demonstrations */}
          <div className="mt-3 pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <Sliders className="w-3.5 h-3.5 text-emerald-700" />
              <span>Simulate Harvest Lot:</span>
              <span className="font-mono font-black text-slate-900 bg-white px-2 py-0.5 rounded-md gradient-border-organic border-0">
                {interactiveVolume} kg
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-48">
              <input
                id="volume-simulation-slider"
                type="range"
                min={200}
                max={2500}
                step={100}
                value={interactiveVolume}
                onChange={(e) => setInteractiveVolume(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Card (Collapsible) */}
        {showBreakdown && (
          <div className="mt-3 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-slate-700 space-y-2 animate-in fade-in">
            <div className="font-bold text-emerald-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Where did the extra +₹{extraIncome.toLocaleString('en-IN')} come from?</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <span className="font-bold text-slate-900">Traditional Deductions Eliminated:</span>
                <ul className="list-disc list-inside mt-1 text-slate-600 space-y-0.5">
                  <li>Middlemen Commission: ₹1,500 (8%)</li>
                  <li>APMC Market Cess & Weighing Cut: ₹600</li>
                  <li>Unregulated Loading Brokerage: ₹400</li>
                </ul>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <span className="font-bold text-emerald-900">KisanDirect Direct Model:</span>
                <ul className="list-disc list-inside mt-1 text-slate-600 space-y-0.5">
                  <li>Direct B2B Buyer Contract: ₹22/kg</li>
                  <li>Instant Escrow Settlement: 100% Guaranteed</li>
                  <li>Net Farmer Benefit: +{percentageIncrease}% Extra Cash</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Slogan */}
      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
        <span className="text-emerald-900 font-bold flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Sell directly → Reduce intermediaries → Get better prices</span>
        </span>
        <span className="hidden sm:inline text-slate-400">Formula: KisanDirect − Traditional</span>
      </div>
    </div>
  );
};
