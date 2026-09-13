import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  ExternalLink,
  Store,
  Calendar,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

export interface MarketPriceItem {
  id: string;
  name: string;
  emoji: string;
  variety: string;
  currentPrice: number;
  previousPrice: number;
  trend: 'up' | 'down' | 'stable';
  changeAmount: number;
  unit: string;
  lastUpdated: string;
  highDemand?: boolean;
}

interface MarketPriceCardProps {
  prices: MarketPriceItem[];
  onViewAllPrices: () => void;
  onRefreshPrices: () => void;
  isRefreshing?: boolean;
}

export const MarketPriceCard: React.FC<MarketPriceCardProps> = ({
  prices,
  onViewAllPrices,
  onRefreshPrices,
  isRefreshing = false,
}) => {
  return (
    <div
      id="todays-market-card"
      className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Header Strip */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-sm border border-emerald-200/60 shadow-2xs">
              📊
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>Today's Market</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                  Live
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Real-time benchmark mandi prices</p>
            </div>
          </div>

          <button
            id="refresh-market-rates-btn"
            onClick={onRefreshPrices}
            disabled={isRefreshing}
            title="Simulate / Refresh Live Market Rates"
            className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-all gradient-border-organic border-0/70"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>

        {/* Prices List */}
        <div className="divide-y divide-slate-100 mt-2">
          {prices.map((item) => {
            const isUp = item.trend === 'up';
            const isDown = item.trend === 'down';
            const isStable = item.trend === 'stable';

            return (
              <div
                key={item.id}
                className="py-3.5 flex items-center justify-between gap-3 group hover:bg-slate-50/70 px-2 rounded-xl transition-colors"
              >
                {/* Crop Name & Icon */}
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">
                    {item.emoji}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-sm text-slate-900 truncate">
                        {item.name}
                      </span>
                      {item.highDemand && (
                        <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black shrink-0">
                          🔥 High Demand
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium truncate block">
                      {item.variety}
                    </span>
                  </div>
                </div>

                {/* Price & Trend Indicator */}
                <div className="text-right shrink-0">
                  <div className="text-base font-black text-slate-900 font-mono">
                    ₹{item.currentPrice}
                    <span className="text-xs text-slate-500 font-medium font-sans">/{item.unit}</span>
                  </div>

                  {/* Trend Indicator Icon & Amount */}
                  <div className="flex items-center justify-end gap-1 text-[11px] font-extrabold">
                    {isUp && (
                      <span className="text-emerald-800 flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                        <span>↑ +₹{item.changeAmount.toFixed(1)}</span>
                      </span>
                    )}
                    {isDown && (
                      <span className="text-rose-800 flex items-center gap-0.5 bg-rose-50 px-1.5 py-0.5 rounded-md">
                        <TrendingDown className="w-3.5 h-3.5 text-rose-700" />
                        <span>↓ -₹{item.changeAmount.toFixed(1)}</span>
                      </span>
                    )}
                    {isStable && (
                      <span className="text-slate-600 flex items-center gap-0.5 bg-slate-100 px-1.5 py-0.5 rounded-md">
                        <Minus className="w-3.5 h-3.5 text-slate-500" />
                        <span>→ Stable</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Action */}
      <div className="pt-4 mt-2 border-t border-slate-100">
        <button
          id="view-market-prices-btn"
          onClick={onViewAllPrices}
          className="w-full py-2.5 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-extrabold text-xs transition-all flex items-center justify-center gap-2 border border-emerald-200/80 shadow-2xs hover:shadow-xs"
        >
          <span>View Detailed Market Prices</span>
          <ArrowUpRight className="w-4 h-4 text-emerald-700" />
        </button>
      </div>
    </div>
  );
};
