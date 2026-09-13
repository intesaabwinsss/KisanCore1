import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Search,
  Building2,
  Calendar,
  Sparkles,
  MapPin,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { MarketPriceItem } from './MarketPriceCard';

interface MarketPricesModalProps {
  isOpen: boolean;
  onClose: () => void;
  prices: MarketPriceItem[];
  onRefreshPrices: () => void;
}

const HISTORICAL_PRICE_DATA = [
  { day: 'Mon', tomato: 19.5, potato: 18.0, onion: 29.0, kisanDirectTomato: 23.0 },
  { day: 'Tue', tomato: 20.0, potato: 18.0, onion: 28.5, kisanDirectTomato: 23.0 },
  { day: 'Wed', tomato: 20.5, potato: 17.5, onion: 28.0, kisanDirectTomato: 23.0 },
  { day: 'Thu', tomato: 21.0, potato: 18.0, onion: 27.5, kisanDirectTomato: 23.5 },
  { day: 'Fri', tomato: 21.5, potato: 18.0, onion: 27.0, kisanDirectTomato: 23.5 },
  { day: 'Sat', tomato: 21.8, potato: 18.2, onion: 27.2, kisanDirectTomato: 24.0 },
  { day: 'Today', tomato: 22.0, potato: 18.0, onion: 27.0, kisanDirectTomato: 24.0 },
];

const MANDI_COMPARISON = [
  { mandi: 'Pune APMC (Gultekdi)', distance: '42 km', tomato: 21.5, potato: 18.0, onion: 26.5 },
  { mandi: 'Nashik APMC Corridor', distance: '165 km', tomato: 20.0, potato: 17.5, onion: 28.0 },
  { mandi: 'Vashi APMC (Navi Mumbai)', distance: '130 km', tomato: 23.0, potato: 19.0, onion: 29.0 },
  { mandi: 'KisanDirect Direct B2B', distance: 'At Farmgate', tomato: 24.0, potato: 20.5, onion: 31.0, isDirect: true },
];

export const MarketPricesModal: React.FC<MarketPricesModalProps> = ({
  isOpen,
  onClose,
  prices,
  onRefreshPrices,
}) => {
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white gradient-border-organic border-0 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
              📈
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900">
                  Live Mandi Benchmark & Market Intelligence
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black">
                  Agmarknet API Synced
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Compare local APMC mandi spot rates with KisanDirect direct farmgate realization.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* 7-Day Trend Chart */}
          <div className="p-5 rounded-2xl bg-slate-50 gradient-border-organic border-0 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-black text-slate-900 text-sm">
                  7-Day Price Trajectory & KisanDirect Direct Premium
                </h4>
                <p className="text-slate-500 text-[11px]">
                  Green dashed line indicates premium paid directly by verified restaurants & supermarkets.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {['Tomato', 'Potato', 'Onion'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCrop(c)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      selectedCrop === c
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-200 gradient-border-organic border-0'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-48 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={HISTORICAL_PRICE_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip
                    formatter={(val: any) => [`₹${val}/kg`, '']}
                    contentStyle={{ borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="tomato"
                    name="APMC Mandi Spot Rate"
                    stroke="#EF4444"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="kisanDirectTomato"
                    name="KisanDirect Direct B2B Payout"
                    stroke="#10B981"
                    strokeWidth={3}
                    strokeDasharray="4 4"
                    dot={{ r: 5, fill: '#10B981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mandi vs KisanDirect Comparison Table */}
          <div className="space-y-2">
            <h4 className="font-black text-slate-900 text-sm">
              Regional Mandi Spot Comparison (₹/kg)
            </h4>

            <div className="overflow-x-auto rounded-2xl gradient-border-organic border-0">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Market Center</th>
                    <th className="px-4 py-3">Logistics Distance</th>
                    <th className="px-4 py-3">🍅 Tomato</th>
                    <th className="px-4 py-3">🥔 Potato</th>
                    <th className="px-4 py-3">🧅 Onion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {MANDI_COMPARISON.map((m, idx) => (
                    <tr
                      key={m.mandi}
                      className={
                        m.isDirect
                          ? 'bg-emerald-50/90 font-bold text-emerald-950'
                          : 'hover:bg-slate-50'
                      }
                    >
                      <td className="px-4 py-3 flex items-center gap-2">
                        {m.isDirect ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                        ) : (
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span className={m.isDirect ? 'font-black' : ''}>{m.mandi}</span>
                        {m.isDirect && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[10px] font-black">
                            Best Payout
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500">{m.distance}</td>
                      <td className="px-4 py-3 font-mono font-bold">₹{m.tomato}/kg</td>
                      <td className="px-4 py-3 font-mono font-bold">₹{m.potato}/kg</td>
                      <td className="px-4 py-3 font-mono font-bold">₹{m.onion}/kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onRefreshPrices}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs gradient-border-organic border-0 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
            <span>Simulate Market Fluctuation ⚡</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
