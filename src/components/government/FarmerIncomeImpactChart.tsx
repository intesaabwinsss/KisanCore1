import React from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
  Sparkles, 
  Info,
  ShieldAlert,
  Percent
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  Cell 
} from 'recharts';
import { FARMER_INCOME_DATA } from './GovernmentData';

export const FarmerIncomeImpactChart: React.FC = () => {
  const chartData = FARMER_INCOME_DATA.map((item) => ({
    name: item.commodity.split(' ')[0],
    fullName: item.commodity,
    'Traditional APMC (₹)': item.traditionalIncome,
    'KisanDirect Realization (₹)': item.kisanDirectIncome,
    uplift: item.percentageIncrease,
    farmerShareTrad: item.farmerSharePctTraditional,
    farmerShareKisan: item.farmerSharePctKisanDirect,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 font-sans">
          <p className="font-bold text-slate-100">{data.fullName}</p>
          <div className="flex items-center justify-between gap-4 text-slate-300">
            <span>Traditional APMC:</span>
            <span className="font-mono text-amber-300 font-semibold">₹{data['Traditional APMC (₹)'].toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-slate-300">
            <span>KisanDirect Realized:</span>
            <span className="font-mono text-emerald-400 font-bold">₹{data['KisanDirect Realization (₹)'].toLocaleString('en-IN')}</span>
          </div>
          <div className="pt-1 border-t border-slate-700 flex items-center justify-between text-emerald-300 font-semibold">
            <span>Income Uplift:</span>
            <span>+{data.uplift}%</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Farmer Share: {data.farmerShareTrad}% → <span className="text-emerald-300 font-bold">{data.farmerShareKisan}%</span> of consumer rupee
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
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Farmer Income Impact Analysis
              </h3>
              <p className="text-xs text-slate-500">
                Net farmgate realization per metric tonne (MT) baseline
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-mono font-bold text-xs border border-emerald-200">
            ↑ +18.4% Average
          </span>
        </div>

        {/* Big Contrast Highlight */}
        <div className="mt-4 grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl gradient-border-organic border-0">
          <div className="border-r border-slate-200 pr-2">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Traditional Supply Chain</div>
            <div className="text-xl font-bold text-slate-700 font-mono mt-0.5">₹8,500 <span className="text-xs font-normal text-slate-400">/ MT avg</span></div>
            <div className="text-[11px] text-slate-500 mt-1">APMC commission & transit cuts: ~38%</div>
          </div>
          <div className="pl-2">
            <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">KisanDirect Platform</div>
            <div className="text-xl font-extrabold text-emerald-700 font-mono mt-0.5">₹10,065 <span className="text-xs font-semibold text-emerald-600">/ MT avg</span></div>
            <div className="text-[11px] text-emerald-800 font-semibold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
              <span>+₹1,565 (+18.4%) Direct Gain</span>
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
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                iconType="circle"
                iconSize={8}
              />
              <Bar dataKey="Traditional APMC (₹)" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="KisanDirect Realization (₹)" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Official Government Policy Insight Banner */}
      <div className="mt-4 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-900 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-emerald-950">Key Policy Validation: </span>
          <span>
            Farmers are receiving a larger share of the final selling price (85.2% vs 43.8% APMC baseline) through direct transactions with verified FPO aggregation.
          </span>
        </div>
      </div>
    </div>
  );
};
