import React from 'react';
import { 
  Tractor, 
  ShoppingBag, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Sparkles, 
  HeartHandshake, 
  ShieldCheck, 
  Zap,
  ArrowRightLeft
} from 'lucide-react';

export const DualImpactSection: React.FC = () => {
  return (
    <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-950 text-white p-6 sm:p-10 shadow-xl border border-emerald-800/40 relative overflow-hidden">
      
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>KISANDIRECT IMPACT</span>
        </div>

        <h3 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white mt-2">
          “Better prices for farmers. Lower prices for consumers.”
        </h3>

        <p className="text-xs sm:text-sm text-emerald-100/70 max-w-xl mx-auto font-medium">
          By eliminating 5 layers of commission agents, our digital direct pipeline creates a transparent win-win economy.
        </p>
      </div>

      {/* Main Dual Impact Interactive Cards */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        
        {/* Left Card: 👨‍🌾 Farmer Impact */}
        <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-emerald-500/30 hover:border-emerald-400/60 transition-all space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-2xl">
                👨‍🌾
              </div>
              <div>
                <h4 className="text-lg font-black text-white">Farmer</h4>
                <p className="text-xs text-emerald-300 font-semibold">Local Producer Network</p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-[11px] font-black uppercase border border-emerald-400/20 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Earns more</span>
            </span>
          </div>

          <div className="py-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-display font-black text-emerald-300">
                ₹23
              </span>
              <span className="text-emerald-200/80 font-bold text-sm">/ kg (Tomatoes)</span>
            </div>
            
            <div className="mt-3 flex items-center gap-2 text-xs text-emerald-200 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/40 font-semibold">
              <span className="text-emerald-400 font-black text-base">↑</span>
              <span><strong>Better farmer share:</strong> +₹9 to +₹11/kg above mandi middleman rates</span>
            </div>
          </div>

          <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-white/10 font-medium">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Zero agent commission deductions</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Direct bank deposit within 2 hours of dispatch</span>
            </li>
          </ul>
        </div>

        {/* Center Connector / Storytelling Badge */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center text-center py-2 lg:py-0">
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-600 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-900/50">
            <HeartHandshake className="w-7 h-7 text-white" />
          </div>
          <div className="mt-2 text-[11px] font-extrabold text-amber-300 uppercase tracking-wider">
            Direct Link
          </div>
          <div className="text-[10px] text-slate-400">
            No Intermediaries
          </div>
        </div>

        {/* Right Card: 🛒 Consumer Impact */}
        <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-amber-500/30 hover:border-amber-400/60 transition-all space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-2xl">
                🛒
              </div>
              <div>
                <h4 className="text-lg font-black text-white">Consumer</h4>
                <p className="text-xs text-amber-300 font-semibold">Urban Households & Chefs</p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-[11px] font-black uppercase border border-amber-400/20 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
              <span>Pays less</span>
            </span>
          </div>

          <div className="py-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-display font-black text-amber-300">
                ₹27
              </span>
              <span className="text-amber-200/80 font-bold text-sm">/ kg (Tomatoes)</span>
            </div>
            
            <div className="mt-3 flex items-center gap-2 text-xs text-amber-200 bg-amber-950/60 p-2.5 rounded-xl border border-amber-800/40 font-semibold">
              <span className="text-amber-400 font-black text-base">↓</span>
              <span><strong>₹5/kg saved:</strong> 15.6% cheaper than supermarkets (₹32/kg)</span>
            </div>
          </div>

          <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-white/10 font-medium">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Fresh harvest delivered same day (under 8 hrs)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>100% transparent sourcing & price breakdown</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Intermediary Elimination Visual Bar */}
      <div className="mt-8 p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-around gap-4 text-xs font-semibold text-slate-300">
        <div className="flex items-center gap-2 line-through text-rose-400">
          <span>❌ Village Aggregator</span>
        </div>
        <div className="flex items-center gap-2 line-through text-rose-400">
          <span>❌ APMC Broker</span>
        </div>
        <div className="flex items-center gap-2 line-through text-rose-400">
          <span>❌ Wholesale Marketer</span>
        </div>
        <div className="flex items-center gap-2 line-through text-rose-400">
          <span>❌ Retail Warehouse</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>= KisanDirect Direct Digital Pipeline</span>
        </div>
      </div>

    </div>
  );
};
