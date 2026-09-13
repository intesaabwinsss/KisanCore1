import React from 'react';
import { ActiveViewMode, NavSection, LanguageCode } from '../types';
import { MULTILINGUAL_STRINGS } from '../data/artisanData';
import { Sparkles, Globe, ShoppingBag, Users, Home } from 'lucide-react';

interface ArtisanTopBarProps {
  activeSection: NavSection;
  activeViewMode: ActiveViewMode;
  onChangeViewMode: (mode: ActiveViewMode) => void;
  onReturnToLanding: () => void;
  currentLanguage: LanguageCode;
  cartCount?: number;
  onOpenCart?: () => void;
}

export const ArtisanTopBar: React.FC<ArtisanTopBarProps> = ({
  activeSection,
  activeViewMode,
  onChangeViewMode,
  onReturnToLanding,
  currentLanguage,
  cartCount = 0,
  onOpenCart,
}) => {
  const strings = MULTILINGUAL_STRINGS[currentLanguage] || MULTILINGUAL_STRINGS.en;

  const sectionTitles: Partial<Record<NavSection, string>> = {
    'dashboard': strings.dashboard,
    'overview': strings.dashboard,
    'market-assistant': strings.aiMarketAssistant,
    'ai-assistant': strings.aiMarketAssistant,
    'photo-studio': strings.aiPhotoStudio,
    'volunteer-hub': strings.volunteerHub,
    'finance-hub': strings.financeHub,
    'finance': strings.financeHub,
    'provenance': strings.digitalProvenance,
    'marketplace': strings.marketplace || 'Marketplace',
    'training': strings.training,
    'chat': strings.chat,
  };

  return (
    <header 
      id="artisan-topbar"
      className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs flex items-center justify-between sticky top-0 z-20"
    >
      {/* Left: View Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-display font-bold text-slate-900 dark:text-slate-100">
          {sectionTitles[activeSection] || 'KisanMandi'}
        </h1>
        {activeSection === 'photo-studio' && (
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 text-[11px] font-semibold border border-teal-200/60 dark:border-teal-700/50">
            <Sparkles className="w-3 h-3 text-teal-500" />
            Studio Gen 3.0
          </span>
        )}
      </div>

      {/* Right Controls: Switch View & Quick Actions */}
      <div className="flex items-center gap-3">
        {/* Return to Landing Page Button */}
        <button
          id="btn-topbar-landing"
          onClick={onReturnToLanding}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Landing Page</span>
        </button>

        {/* Switch View Pills (Matches User Image 1: Volunteer and Customer) */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 hidden md:inline">
            {strings.switchView}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              id="topbar-switch-artisan"
              onClick={() => onChangeViewMode('artisan')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeViewMode === 'artisan'
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-teal-500'
              }`}
            >
              <span>{strings.artisan}</span>
            </button>

            <button
              id="topbar-switch-volunteer"
              onClick={() => onChangeViewMode('volunteer')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeViewMode === 'volunteer'
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 border border-teal-500/70 hover:bg-teal-50 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>{strings.volunteer}</span>
            </button>

            <button
              id="topbar-switch-customer"
              onClick={() => onChangeViewMode('customer')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeViewMode === 'customer'
                  ? 'bg-teal-700 text-white shadow-2xs ring-2 ring-teal-500/30'
                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
              }`}
            >
              <ShoppingBag className="w-3 h-3" />
              <span>{strings.customer}</span>
              {cartCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-900 text-[10px] font-extrabold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
