import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Eye, 
  Camera, 
  ArrowUpRight, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Clock, 
  Plus, 
  ChevronRight 
} from 'lucide-react';
import { CraftItem, NavSection } from '../types';
import { SAMPLE_CRAFTS } from '../data/artisanData';

interface ArtisanDashboardOverviewProps {
  onNavigate: (section: NavSection) => void;
  isDarkMode?: boolean;
}

export const ArtisanDashboardOverview: React.FC<ArtisanDashboardOverviewProps> = ({
  onNavigate,
  isDarkMode = false,
}) => {
  const stats = [
    { title: 'Total Direct Revenue', value: '₹42,850', change: '+24% this month', isPositive: true, icon: TrendingUp },
    { title: 'Active Studio Listings', value: '14 Crafts', change: '4 GI Certified', isPositive: true, icon: ShoppingBag },
    { title: 'Global Catalog Views', value: '1,890', change: '+38% from US & EU', isPositive: true, icon: Eye },
    { title: 'Volunteer Assists', value: '3 Active', change: '2 tasks completed', isPositive: true, icon: Users },
  ];

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-800 to-teal-950 text-white relative overflow-hidden shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-700/60 border border-teal-500/40 text-teal-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Studio Gen 3.0 Active</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
            Namaste, Arjun Prajapati
          </h2>
          <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
            Your Gorakhpur Terracotta Kalash crafts are trending in the UK and Germany. 
            Enhance new stock with the AI Photo Studio to boost direct buyer interest.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('photo-studio')}
            className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 hover:scale-105"
          >
            <Camera className="w-4 h-4" />
            <span>Launch AI Photo Studio</span>
          </button>
          <button
            onClick={() => onNavigate('market-assistant')}
            className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-colors"
          >
            Check Smart Pricing
          </button>
        </div>

        {/* Background decorative glow */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-teal-600/20 blur-2xl pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className={`p-5 rounded-2xl border transition-all ${
                isDarkMode 
                  ? 'bg-slate-800/80 border-slate-700' 
                  : 'bg-white border-slate-200/80 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {stat.title}
                </span>
                <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-display font-extrabold mt-3 text-slate-900 dark:text-slate-100">
                {stat.value}
              </p>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{stat.change}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Studio Creations & Urgent Volunteer Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Studio Enhanced Catalog (8 cols) */}
        <div className={`lg:col-span-8 rounded-2xl border p-5 sm:p-6 space-y-4 ${
          isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Your AI Studio Creations
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Crafts photographed, AI-enhanced, and published to global buyers.
              </p>
            </div>
            <button
              onClick={() => onNavigate('photo-studio')}
              className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Enhance New Photo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SAMPLE_CRAFTS.slice(0, 2).map((craft) => (
              <div
                key={craft.id}
                className="p-3.5 rounded-xl gradient-border-organic border-0 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/60 flex items-center gap-3.5"
              >
                <img
                  src={craft.themeImages['rustic-earthy']}
                  alt={craft.title}
                  className="w-16 h-16 rounded-xl object-cover gradient-border-organic border-0 dark:border-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {craft.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-bold text-teal-700 dark:text-teal-400">₹{craft.price}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-emerald-600 font-medium">In Stock ({craft.stock})</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <ShieldCheck className="w-3 h-3 text-teal-600" />
                    <span>{craft.giTagNumber || 'GI Verified'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-teal-950 dark:text-teal-200">
                  Ready to photograph your next piece?
                </p>
                <p className="text-[11px] text-teal-800 dark:text-teal-400">
                  Select Rustic, Clean, Vibrant, or Creative lighting with zero camera gear.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('photo-studio')}
              className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
            >
              Open Studio
            </button>
          </div>
        </div>

        {/* Right: Volunteer Collaboration & Orders (4 cols) */}
        <div className={`lg:col-span-4 rounded-2xl border p-5 sm:p-6 space-y-4 ${
          isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Volunteer Help
            </h3>
            <button
              onClick={() => onNavigate('volunteer-hub')}
              className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline"
            >
              View Hub
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl gradient-border-organic border-0 dark:border-slate-700 bg-white dark:bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                  In Review
                </span>
                <span className="text-[10px] text-slate-400">Today, 10:14 AM</span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                UK Catalog English Translation
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Sarah Jenkins (Volunteer) is reviewing your craft story for the London Autumn Fair.
              </p>
            </div>

            <div className="p-3 rounded-xl gradient-border-organic border-0 dark:border-slate-700 bg-white dark:bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                  Completed
                </span>
                <span className="text-[10px] text-slate-400">Yesterday</span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                GI Blockchain Seal Generated
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Digital Provenance Passport minted for Terracotta Kalash Batch #9821.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('chat')}
            className="w-full py-2.5 rounded-xl gradient-border-organic border-0 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>Open Multilingual Chat</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
