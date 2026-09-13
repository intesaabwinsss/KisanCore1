import React from 'react';
import { 
  Users, 
  ShoppingCart, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Scale, 
  Layers, 
  Package, 
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { GovernmentKPIs, TimeframeOption } from './GovernmentTypes';

interface GovernmentKPIGridProps {
  kpis: GovernmentKPIs;
  timeframe: TimeframeOption;
  onSelectTimeframe: (tf: TimeframeOption) => void;
  onFilterMetric?: (metricKey: string) => void;
}

export const GovernmentKPIGrid: React.FC<GovernmentKPIGridProps> = ({
  kpis,
  timeframe,
  onSelectTimeframe,
  onFilterMetric
}) => {
  const timeframeOptions: TimeframeOption[] = ['Today', '7 Days', '30 Days', '6 Months', '1 Year'];

  const renderTrendBadge = (
    dir: 'up' | 'down' | 'stable', 
    pct?: number, 
    customText?: string,
    isGoodWhenUp: boolean = true
  ) => {
    if (dir === 'stable') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
          <Minus className="w-3 h-3" />
          <span>{customText || '→ Stable'}</span>
        </span>
      );
    }

    const isPositiveOutcome = (dir === 'up' && isGoodWhenUp) || (dir === 'down' && !isGoodWhenUp);
    const colorClasses = isPositiveOutcome
      ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
      : 'text-emerald-700 bg-emerald-50 border border-emerald-200';

    const Icon = dir === 'up' ? ArrowUpRight : ArrowDownRight;

    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${colorClasses}`}>
        <Icon className="w-3 h-3" />
        <span>{pct ? `${pct}%` : ''} {customText || (dir === 'up' ? '↑ Increased' : '↓ Decreased')}</span>
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Row: Section Title & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-4 rounded-2xl gradient-border-organic border-0 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <span>National / Regional Supply Chain Overview</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Aggregated metrics for Delhi NCR agricultural corridor • Compared with baseline APMC benchmarks
          </p>
        </div>

        {/* Timeframe Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl gradient-border-organic border-0 self-start sm:self-auto">
          <Calendar className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-0.5 hidden sm:inline" />
          {timeframeOptions.map((tf) => (
            <button
              key={tf}
              id={`kpi-timeframe-${tf.toLowerCase().replace(' ', '-')}`}
              onClick={() => onSelectTimeframe(tf)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                timeframe === tf
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* 7 Core KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Farmers Onboarded */}
        <div 
          id="kpi-card-farmers"
          onClick={() => onFilterMetric?.('farmers')}
          className="bg-gradient-to-br from-emerald-50/50 via-white/70 to-slate-50/80 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-5 rounded-2xl gradient-border-organic border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-[2px] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 cursor-pointer active:scale-[0.98]"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-bold uppercase tracking-widest text-slate-400 text-[10px]">Farmers Onboarded</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono tracking-tighter tabular-nums">
            {kpis.farmersOnboarded.toLocaleString('en-IN')}
          </div>
          <div className="mt-3 flex items-center justify-between">
            {renderTrendBadge(kpis.farmersTrendDir, kpis.farmersTrendPct, 'vs prev period', true)}
            <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">Verified KYC</span>
          </div>
        </div>

        {/* 2. Active Buyers */}
        <div 
          id="kpi-card-buyers"
          onClick={() => onFilterMetric?.('buyers')}
          className="bg-gradient-to-br from-emerald-50/50 via-white/70 to-slate-50/80 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-5 rounded-2xl gradient-border-organic border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-[2px] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 cursor-pointer active:scale-[0.98]"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-bold uppercase tracking-widest text-slate-400 text-[10px]">Active Buyers</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono tracking-tighter tabular-nums">
            {kpis.activeBuyers.toLocaleString('en-IN')}
          </div>
          <div className="mt-3 flex items-center justify-between">
            {renderTrendBadge(kpis.buyersTrendDir, kpis.buyersTrendPct, 'vs prev period', true)}
            <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">Retail & B2B</span>
          </div>
        </div>

        {/* 3. Total Transactions */}
        <div 
          id="kpi-card-transactions"
          onClick={() => onFilterMetric?.('transactions')}
          className="bg-gradient-to-br from-emerald-50/50 via-white/70 to-slate-50/80 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-5 rounded-2xl gradient-border-organic border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-[2px] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 cursor-pointer active:scale-[0.98]"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-bold uppercase tracking-widest text-slate-400 text-[10px]">Transactions</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono tracking-tighter tabular-nums">
            {kpis.transactionsCount.toLocaleString('en-IN')}
          </div>
          <div className="mt-3 flex items-center justify-between">
            {renderTrendBadge(kpis.transactionsTrendDir, kpis.transactionsTrendPct, 'vs prev period', true)}
            <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">99.1% Settled</span>
          </div>
        </div>

        {/* 4. Average Farmer Income */}
        <div 
          id="kpi-card-farmer-income"
          onClick={() => onFilterMetric?.('farmer_income')}
          className="bg-gradient-to-br from-emerald-50/50 via-white/70 to-slate-50/80 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-5 rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-50/60 via-white/70 to-white/70 shadow-[0_8px_30px_rgb(16,185,129,0.1)] hover:-translate-y-[2px] hover:shadow-[0_12px_40px_rgb(16,185,129,0.15)] transition-all duration-300 cursor-pointer active:scale-[0.98]"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-bold uppercase tracking-widest text-emerald-900 text-[10px]">Average Farmer Income</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-3xl font-black text-emerald-900 font-mono tracking-tighter tabular-nums">
              ↑ {kpis.avgFarmerIncomePct}%
            </span>
            <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-700">Realized</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-emerald-800 font-bold tracking-tight">₹10,065 vs ₹8,500 APMC</span>
            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 bg-emerald-100 text-emerald-900 font-black rounded-md border border-emerald-200">Net +18.4%</span>
          </div>
        </div>

        {/* 5. Average Consumer Price */}
        <div 
          id="kpi-card-consumer-price"
          onClick={() => onFilterMetric?.('consumer_price')}
          className="bg-gradient-to-br from-emerald-50/50 via-white/70 to-slate-50/80 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-5 rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-50/60 via-white/70 to-white/70 shadow-[0_8px_30px_rgb(6,182,212,0.1)] hover:-translate-y-[2px] hover:shadow-[0_12px_40px_rgb(6,182,212,0.15)] transition-all duration-300 cursor-pointer active:scale-[0.98]"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-bold uppercase tracking-widest text-emerald-950 text-[10px]">Average Consumer Price</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-3xl font-black text-emerald-900 font-mono tracking-tighter tabular-nums">
              ↓ {kpis.avgConsumerPricePct}%
            </span>
            <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-700">Savings</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-emerald-900 font-bold tracking-tight">₹29/kg vs ₹32/kg Retail</span>
            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 bg-emerald-100 text-emerald-900 font-black rounded-md border border-emerald-200">Inflation Shield</span>
          </div>
        </div>

        {/* 6. Intermediaries Eliminated */}
        <div 
          id="kpi-card-intermediaries"
          onClick={() => onFilterMetric?.('intermediaries')}
          className="bg-gradient-to-br from-emerald-50/50 via-white/70 to-slate-50/80 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-5 rounded-2xl gradient-border-organic border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-[2px] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 cursor-pointer active:scale-[0.98]"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-bold uppercase tracking-widest text-slate-400 text-[10px]">Intermediaries Eliminated</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono tracking-tighter tabular-nums">
            {kpis.intermediariesEliminated} <span className="text-xs tracking-normal font-bold uppercase text-slate-400">/ transaction</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            {renderTrendBadge(kpis.intermediariesTrendDir, undefined, 'Direct FPO Connect', true)}
            <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">Commission Free</span>
          </div>
        </div>

        {/* 7. Produce Traded */}
        <div 
          id="kpi-card-produce-traded"
          onClick={() => onFilterMetric?.('produce_traded')}
          className="bg-gradient-to-br from-emerald-50/50 via-white/70 to-slate-50/80 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-5 rounded-2xl gradient-border-organic border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-[2px] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 cursor-pointer active:scale-[0.98] sm:col-span-2 lg:col-span-2"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-bold uppercase tracking-widest text-slate-400 text-[10px]">Produce Traded (Tonnes)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <div className="text-3xl font-black text-slate-900 font-mono tracking-tighter tabular-nums">
              {kpis.produceTradedTonnes.toLocaleString('en-IN')} <span className="text-xs font-bold tracking-normal uppercase text-slate-400">tonnes</span>
            </div>
            {renderTrendBadge(kpis.produceTrendDir, kpis.produceTrendPct, 'Volume growth', true)}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-500 font-bold tracking-wide">
            <span>Vegetables: 68% • Tubers: 22% • Grains: 10%</span>
            <span className="font-black text-emerald-700 uppercase tracking-widest px-2 py-0.5 bg-emerald-50 rounded-md border border-emerald-100">Cold Chain Verified</span>
          </div>
        </div>

      </div>
    </div>
  );
};
