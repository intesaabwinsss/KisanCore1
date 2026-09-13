import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Camera, 
  Users, 
  Wallet, 
  ShieldCheck, 
  GraduationCap, 
  MessageSquare,
  LogOut,
  Sun,
  Moon,
  Sparkle
} from 'lucide-react';
import { NavSection, LanguageCode } from '../types';
import { MULTILINGUAL_STRINGS } from '../data/artisanData';

interface ArtisanSidebarProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onLogout?: () => void;
}

export const ArtisanSidebar: React.FC<ArtisanSidebarProps> = ({
  activeSection,
  onSelectSection,
  currentLanguage,
  onSelectLanguage,
  isDarkMode,
  onToggleTheme,
  onLogout,
}) => {
  const strings = MULTILINGUAL_STRINGS[currentLanguage] || MULTILINGUAL_STRINGS.en;

  const navItems: { id: NavSection; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: strings.dashboard, icon: LayoutDashboard },
    { id: 'market-assistant', label: strings.aiMarketAssistant, icon: Sparkles },
    { id: 'photo-studio', label: strings.aiPhotoStudio, icon: Camera },
    { id: 'volunteer-hub', label: strings.volunteerHub, icon: Users },
    { id: 'finance-hub', label: strings.financeHub, icon: Wallet },
    { id: 'provenance', label: strings.digitalProvenance, icon: ShieldCheck },
    { id: 'training', label: strings.training, icon: GraduationCap },
    { id: 'chat', label: strings.chat, icon: MessageSquare },
  ];

  const languageOptions: { code: LanguageCode; label: string }[] = [
    { code: 'en', label: 'A' },
    { code: 'hi', label: 'अ' },
    { code: 'bn', label: 'অ' },
    { code: 'ta', label: 'அ' },
    { code: 'mr', label: 'म' },
  ];

  return (
    <aside 
      id="artisan-ally-sidebar"
      className={`w-64 shrink-0 flex flex-col justify-between border-r min-h-screen transition-colors duration-200 ${
        isDarkMode 
          ? 'bg-slate-900 border-slate-800 text-slate-100' 
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* Top Branding Header */}
      <div>
        <div className="p-5 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs shadow-teal-600/30">
            {/* Stylized KisanMandi Emblem */}
            <div className="relative">
              <Sparkle className="w-5 h-5 fill-white" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-300"></span>
            </div>
          </div>
          <div>
            <span className="text-lg font-display font-extrabold tracking-tight text-teal-800 dark:text-teal-400">
              KisanMandi
            </span>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
              Heritage Platform
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => onSelectSection(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  isActive
                    ? isDarkMode
                      ? 'bg-teal-900/50 text-teal-300 border border-teal-700/50 font-bold'
                      : 'bg-teal-50 text-teal-800 border border-teal-200/80 font-bold shadow-2xs'
                    : isDarkMode
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-teal-600 dark:text-teal-300' : 'text-slate-400 dark:text-slate-400'
                }`} />
                <span className="truncate">{item.label}</span>
                {item.id === 'photo-studio' && (
                  <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-800 text-teal-800 dark:text-teal-200 font-mono font-bold">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile, Language and Theme Controls */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
        {/* User Card */}
        <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
          isDarkMode 
            ? 'bg-slate-800/80 border-slate-700' 
            : 'bg-slate-50/80 border-slate-200/80'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80"
                alt="Arjun"
                className="w-8 h-8 rounded-full object-cover border-2 border-teal-500"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">Arjun</p>
              <p className="text-[10px] text-teal-700 dark:text-teal-400 font-medium">Master Artisan</p>
            </div>
          </div>
          <button 
            id="btn-sidebar-user-logout"
            onClick={onLogout}
            title="Switch Account / Log Out"
            aria-label="Switch Account / Log Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Language Switcher */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>{strings.language}</span>
            <span className="text-[10px] uppercase font-mono">{currentLanguage}</span>
          </div>
          <div className="grid grid-cols-5 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {languageOptions.map((opt) => (
              <button
                key={opt.code}
                id={`lang-btn-${opt.code}`}
                onClick={() => onSelectLanguage(opt.code)}
                className={`py-1 rounded-lg text-xs font-bold transition-all text-center ${
                  currentLanguage === opt.code
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{strings.theme}</span>
          <button
            id="btn-sidebar-theme-toggle"
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            className="flex items-center gap-1.5 p-1 rounded-full bg-slate-100 dark:bg-slate-800 gradient-border-organic border-0 dark:border-slate-700 transition-colors"
          >
            <span className={`p-1 rounded-full transition-all ${
              !isDarkMode ? 'bg-white text-amber-500 shadow-xs' : 'text-slate-400'
            }`}>
              <Sun className="w-3.5 h-3.5" />
            </span>
            <span className={`p-1 rounded-full transition-all ${
              isDarkMode ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-400'
            }`}>
              <Moon className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};
