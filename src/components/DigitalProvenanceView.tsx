import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  QrCode, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Hash, 
  Download, 
  Share2, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { CraftItem, LanguageCode } from '../types';
import { SAMPLE_CRAFTS } from '../data/artisanData';

interface DigitalProvenanceViewProps {
  currentLanguage: LanguageCode;
  selectedCraft?: CraftItem;
  onClose?: () => void;
  isDarkMode?: boolean;
}

export const DigitalProvenanceView: React.FC<DigitalProvenanceViewProps> = ({
  currentLanguage,
  selectedCraft = SAMPLE_CRAFTS[0],
  onClose,
  isDarkMode = false,
}) => {
  const [activeCraft, setActiveCraft] = useState<CraftItem>(selectedCraft);

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300">
              <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-slate-100">
              Digital Provenance & GI Registry
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Blockchain-verified authenticity passports protecting authentic master creations from industrial factory replicas.
          </p>
        </div>

        {/* Craft Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {SAMPLE_CRAFTS.map((craft) => (
            <button
              key={craft.id}
              onClick={() => setActiveCraft(craft)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeCraft.id === craft.id
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : isDarkMode
                    ? 'bg-slate-800 text-slate-300'
                    : 'bg-slate-100 text-slate-700'
              }`}
            >
              {craft.title.split(' ')[0]} {craft.title.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Certificate Display Card */}
      <div className={`rounded-3xl border p-6 sm:p-10 relative overflow-hidden shadow-lg ${
        isDarkMode 
          ? 'bg-slate-900 border-teal-800/60 text-slate-100' 
          : 'bg-gradient-to-b from-amber-50/40 via-white to-teal-50/30 border-amber-200/80 text-slate-900'
      }`}>
        {/* Certificate Decorative Border */}
        <div className="border-2 border-amber-600/30 rounded-2xl p-6 sm:p-8 space-y-6 relative">
          
          {/* Top Seal & Heading */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-600/20 pb-6 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-800 text-amber-300 flex items-center justify-center shadow-md">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-amber-700 dark:text-amber-400 font-mono">
                  NATIONAL HERITAGE REGISTRY • GOVT OF INDIA GI TAG
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white">
                  Certificate of Authentic Provenance
                </h3>
              </div>
            </div>

            <div className="text-center sm:text-right font-mono text-xs">
              <span className="text-slate-400 block text-[10px]">PASSPORT ID</span>
              <span className="font-bold text-teal-700 dark:text-teal-400">{activeCraft.provenanceId}</span>
            </div>
          </div>

          {/* Craft & Master Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-800/80 gradient-border-organic border-0 dark:border-slate-700 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Master Craftsman</span>
              <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{activeCraft.artisanName}</p>
              <p className="text-[10px] text-teal-600">4th Gen Lineage</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-800/80 gradient-border-organic border-0 dark:border-slate-700 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Geographic GI Guild</span>
              <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{activeCraft.craftCluster}</p>
              <p className="text-[10px] text-slate-500">{activeCraft.state}, India</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-800/80 gradient-border-organic border-0 dark:border-slate-700 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">GI Registration</span>
              <p className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm">{activeCraft.giTagNumber}</p>
              <p className="text-[10px] text-slate-500">Class 21 Traditional Goods</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-800/80 gradient-border-organic border-0 dark:border-slate-700 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Material Purity</span>
              <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">100% Chemical-Free</p>
              <p className="text-[10px] text-slate-500">Pit-fired organic clay</p>
            </div>
          </div>

          {/* Craft Story Quote */}
          <div className="p-4 rounded-xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs space-y-2">
            <span className="font-bold text-teal-950 dark:text-teal-200 uppercase tracking-wider text-[10px]">
              Artisan Cultural Heritage Sign-Off
            </span>
            <p className="italic text-slate-700 dark:text-slate-300 leading-relaxed">
              "{activeCraft.culturalStory}"
            </p>
          </div>

          {/* QR Verification Seal & Hash */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-white p-1 border border-slate-300 flex items-center justify-center shadow-xs">
                <QrCode className="w-12 h-12 text-slate-900" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-mono block">BLOCKCHAIN PROOF OF CREATION</span>
                <span className="font-mono text-[10px] text-slate-600 dark:text-slate-300 truncate max-w-xs block">
                  0x882a...98f4e1990c74b12
                </span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Tamper-Proof Ledger Confirmed</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 gradient-border-organic border-0 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs">
                <Download className="w-3.5 h-3.5" />
                <span>Print QR Sticker</span>
              </button>
              <button className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors flex items-center gap-1.5 shadow-2xs">
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Public Passport Link</span>
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
