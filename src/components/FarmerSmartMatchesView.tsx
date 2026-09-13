import React, { useState } from 'react';
import { Sparkles, Tractor, TrendingUp, Building2, CheckCircle2, Search, RotateCcw, ShieldCheck } from 'lucide-react';
import { useSmartMatching } from '../context/SmartMatchingContext';
import { SmartMatchCard } from './SmartMatchCard';

export const FarmerSmartMatchesView: React.FC = () => {
  const { matches, resetToDemoData } = useSmartMatching();
  const [selectedCrop, setSelectedCrop] = useState<string>('All');

  // Filter for farmer matches
  const farmerMatches = matches.filter((m) => {
    if (selectedCrop !== 'All' && m.farmerListing.cropName.toLowerCase() !== selectedCrop.toLowerCase()) {
      return false;
    }
    return true;
  });

  const crops = ['All', 'Tomato', 'Onion', 'Potato', 'Basmati Rice'];

  return (
    <div className="space-y-6">
      {/* Informative Header */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-emerald-900 to-teal-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>AI Supply–Demand Algorithmic Pairing</span>
          </div>
          <h3 className="text-xl font-black text-white">Recommended Buyers for Your Harvest Lots</h3>
          <p className="text-xs text-emerald-100 max-w-xl">
            Ranked based on buyer price ceiling vs your minimum floor price, shortest logistics distance, and harvest readiness dates.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={resetToDemoData}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-xs transition-all flex items-center gap-1.5 border border-white/20"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Crop Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {crops.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCrop(c)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCrop === c
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 gradient-border-organic border-0'
            }`}
          >
            {c === 'All' ? 'All Farm Harvests' : c}
          </button>
        ))}
      </div>

      {/* Matches Grid */}
      {farmerMatches.length === 0 ? (
        <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-3xl p-12 text-center gradient-border-organic border-0 space-y-3">
          <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-700">No Direct Buyer Matches Found</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try switching the commodity filter or resetting the demo dataset.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {farmerMatches.map((m) => (
            <SmartMatchCard key={m.id} match={m} userRole="farmer" />
          ))}
        </div>
      )}
    </div>
  );
};
