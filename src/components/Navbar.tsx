import React, { useState } from 'react';
import { 
  Sprout, 
  Sparkles, 
  ShoppingBag, 
  Menu, 
  X, 
  TrendingUp,
  Tractor,
  Building2,
  Store,
  Truck,
  ShieldCheck,
  Languages,
  ChevronDown,
  Bell,
  User,
  LogOut
} from 'lucide-react';
import { RoleType, CartItem } from '../types';
import { usePriceAlerts } from '../context/PriceAlertContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LanguageOption } from '../context/LanguageContext';
import { Language } from '../i18n/translations';

interface NavbarProps {
  activeRole: RoleType;
  onSelectRole: (role: RoleType) => void;
  onOpenAdvisory: () => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRole,
  onSelectRole,
  onOpenAdvisory,
  cartItems,
  onOpenCart,
  onOpenAuth,
}) => {
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [dashboardMenuOpen, setDashboardMenuOpen] = useState(false);
  const [authMenuOpen, setAuthMenuOpen] = useState(false);

  const { unreadCount, setIsNotificationCenterOpen, openCreateAlertModal } = usePriceAlerts();
  const { currentUser, logout } = useAuth();

  const handleLanguageChange = (code: Language) => {
    setLanguage(code);
    setLangMenuOpen(false);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantityKg, 0);

  const navRoles: { id: RoleType; labelKey: string; icon: React.ReactNode }[] = [
    { id: 'trucks', labelKey: 'kisanDirectTrucks', icon: <Truck className="w-4 h-4 text-emerald-600" /> },
    { id: 'government', labelKey: 'govtSupplyChain', icon: <Building2 className="w-4 h-4 text-emerald-800" /> },
    { id: 'distress_demo', labelKey: 'cropDistressEngine', icon: <Sparkles className="w-4 h-4 text-red-500" /> },
    { id: 'consumer', labelKey: 'consumerMarketplace', icon: <ShoppingBag className="w-4 h-4 text-emerald-600" /> },
    { id: 'matching', labelKey: 'smartMatches', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
    { id: 'farmer', labelKey: 'farmerRole', icon: <Tractor className="w-4 h-4" /> },
    { id: 'b2b', labelKey: 'b2bProcurement', icon: <Building2 className="w-4 h-4" /> },
    { id: 'retail', labelKey: 'retailMarket', icon: <Store className="w-4 h-4" /> },
    { id: 'logistics', labelKey: 'coldLogistics', icon: <Truck className="w-4 h-4" /> },
    { id: 'admin', labelKey: 'apmcAdmin', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const getRoleBadge = (role: RoleType) => {
    switch (role) {
      case 'landing': return <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-200/50 text-emerald-800 text-[9px] uppercase tracking-widest font-black shadow-[0_0_10px_rgba(16,185,129,0.2)]">{t('directFarmgate')}</span>;
      case 'trucks': return <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] uppercase tracking-widest font-black shadow-[0_0_10px_rgba(5,150,105,0.3)]">🚚 KisanDirect Trucks</span>;
      case 'government': return <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-200/50 text-indigo-700 text-[9px] uppercase tracking-widest font-black shadow-[0_0_10px_rgba(99,102,241,0.2)]">{t('govtMonitor')}</span>;
      case 'farmer': return <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-200/50 text-emerald-800 text-[9px] uppercase tracking-widest font-black shadow-[0_0_10px_rgba(16,185,129,0.2)]">{t('farmerPortal')}</span>;
      case 'b2b': return <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-200/50 text-blue-800 text-[9px] uppercase tracking-widest font-black shadow-[0_0_10px_rgba(59,130,246,0.2)]">{t('b2bTrade')}</span>;
      case 'consumer': return <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-200/50 text-teal-800 text-[9px] uppercase tracking-widest font-black shadow-[0_0_10px_rgba(20,184,166,0.2)]">{t('consumer')}</span>;
      case 'retail': return <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-200/50 text-amber-800 text-[9px] uppercase tracking-widest font-black shadow-[0_0_10px_rgba(245,158,11,0.2)]">{t('retail')}</span>;
      case 'logistics': return <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-200/50 text-cyan-800 text-[9px] uppercase tracking-widest font-black shadow-[0_0_10px_rgba(6,182,212,0.2)]">{t('logistics')}</span>;
      case 'matching': return <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-200/50 text-purple-800 text-[9px] uppercase tracking-widest font-black shadow-[0_0_10px_rgba(168,85,247,0.2)]">{t('aiMatchEngine')}</span>;
      case 'admin': return <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-slate-500/10 gradient-border-organic border-0/50 text-slate-800 text-[9px] uppercase tracking-widest font-black shadow-[0_0_10px_rgba(100,116,139,0.2)]">{t('apmcAdmin')}</span>;
      case 'distress_demo': return <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-red-500/10 border border-red-200/50 text-red-800 text-[9px] uppercase tracking-widest font-black shadow-[0_0_10px_rgba(239,68,68,0.2)]">{t('distressAlert')}</span>;
      default: return null;
    }
  };

  return (
    <div className="sticky top-0 z-50 pt-4 sm:pt-6 px-4 w-full max-w-7xl mx-auto">
      <header className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)]  transition-all duration-500 rounded-[2rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] transition-all duration-300">
      {/* Main Navigation Bar */}
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand */}
          <div 
            onClick={() => onSelectRole('landing')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400 rounded-xl animate-ping opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-b from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-[0_4px_14px_rgba(4,120,87,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] group- group-hover:shadow-[0_6px_20px_rgba(4,120,87,0.4)] transition-all duration-300">
                <Sprout className="w-5 h-5 text-emerald-50 drop-shadow-sm" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span translate="no" className="notranslate text-xl font-display font-black bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent tracking-tighter drop-shadow-sm">
                  KisanDirect
                </span>
                {getRoleBadge(activeRole)}
              </div>
            </div>
          </div>

          {/* Desktop Navigation - Clean Naked Links */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-4 min-w-0 shrink">
            <button
              onClick={() => onSelectRole('landing')}
              className={`text-xs xl:text-sm font-medium transition-colors whitespace-nowrap px-1.5 py-1 rounded-lg ${
                activeRole === 'landing' ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'hi' ? 'अवलोकन' : language === 'mr' ? 'आढावा' : 'Overview'}
            </button>

            <button
              onClick={() => onSelectRole('consumer')}
              className={`text-xs xl:text-sm font-medium transition-colors whitespace-nowrap px-1.5 py-1 rounded-lg ${
                activeRole === 'consumer'
                  ? 'text-emerald-700 font-bold bg-emerald-50/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('consumer')}
            </button>

            <button
              onClick={() => onSelectRole('government')}
              className={`hidden xl:inline-flex text-xs xl:text-sm font-medium transition-colors whitespace-nowrap px-1.5 py-1 rounded-lg ${
                activeRole === 'government'
                  ? 'text-emerald-700 font-bold bg-emerald-50/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('govtMonitor')}
            </button>

            <button
              onClick={() => onSelectRole('matching')}
              className={`hidden 2xl:inline-flex items-center gap-1 text-xs xl:text-sm font-medium transition-colors whitespace-nowrap px-1.5 py-1 rounded-lg ${
                activeRole === 'matching'
                  ? 'text-emerald-700 font-bold bg-emerald-50/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('smartMatches')}
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            </button>

            <div className="relative">
              <button
                onClick={() => setDashboardMenuOpen(!dashboardMenuOpen)}
                className={`flex items-center gap-1 text-xs xl:text-sm transition-colors whitespace-nowrap px-2 py-1 rounded-lg ${
                  activeRole !== 'landing' && activeRole !== 'consumer' && activeRole !== 'government' && activeRole !== 'matching'
                    ? 'text-emerald-700 font-bold bg-emerald-50'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                <span>{t('dashboard')}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {dashboardMenuOpen && (
                <div className="absolute top-full mt-2 left-0 w-56 bg-white/95 backdrop-blur-xl border border-emerald-900/10 rounded-2xl shadow-xl py-2 z-50 max-h-[60vh] overflow-y-auto animate-in fade-in zoom-in-95">
                  {navRoles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => {
                        onSelectRole(role.id);
                        setDashboardMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs xl:text-sm flex items-center gap-3 transition-colors ${
                        activeRole === role.id
                          ? 'bg-emerald-50 text-emerald-800 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {role.icon}
                      <span>{t(role.labelKey)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1 sm:gap-1.5 xl:gap-2.5 ml-auto shrink-0">
            {/* AI Advisor Button (Primary Singular CTA) */}
            <button
              onClick={onOpenAdvisory}
              className="hidden md:flex items-center gap-1.5 px-2.5 xl:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold shadow-md shadow-emerald-900/15 transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap shrink-0"
              title={t('kisanMitraAssistant')}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
              <span className="hidden sm:inline">{t('kisanMitraAi')}</span>
            </button>

            {/* Notification Bell Button */}
            <button
              onClick={() => setIsNotificationCenterOpen(true)}
              className="relative p-1.5 sm:p-2 rounded-xl text-slate-700 hover:bg-slate-100 active:scale-95 transition-all shrink-0"
              title={t('notifications')}
            >
              <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-800" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-3.5 h-3.5 sm:min-w-4 sm:h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] sm:text-[10px] font-extrabold flex items-center justify-center border-2 border-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-1.5 sm:p-2 rounded-xl text-slate-700 hover:bg-slate-100 active:scale-95 transition-all shrink-0"
              title="Open Procurement Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-800" />
              {totalCartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-3.5 h-3.5 sm:min-w-4 sm:h-4 px-1 rounded-full bg-emerald-600 text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Auth / User Menu */}
            <div className="relative shrink-0">
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setAuthMenuOpen(!authMenuOpen)}
                    className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                  >
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-[10px] font-bold text-emerald-900 leading-tight truncate max-w-[70px] xl:max-w-[90px]">{currentUser.name}</div>
                      <div className="text-[9px] text-emerald-700 capitalize">{currentUser.role}</div>
                    </div>
                  </button>
                  {authMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl border border-emerald-900/10 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                        <p className="text-xs text-slate-500 truncate">{currentUser.mobile}</p>
                        {currentUser.role === 'farmer' && currentUser.walletBalance !== undefined && (
                          <div className="mt-2 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                            <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">{t('kisanWallet')}</p>
                            <p className="text-sm font-black text-emerald-600">₹{currentUser.walletBalance.toLocaleString('en-IN')}</p>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setAuthMenuOpen(false);
                          onSelectRole('landing');
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold transition-colors mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('signOut')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-2xs whitespace-nowrap"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="whitespace-nowrap">{t('loginRegister')}</span>
                </button>
              )}
            </div>

            {/* Language Selector Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 px-1.5 sm:px-2 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 whitespace-nowrap"
              >
                <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 shrink-0" />
                <span className="uppercase text-[10px] font-bold">{language}</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white/95 backdrop-blur-xl border border-emerald-900/10 rounded-2xl shadow-xl py-2 z-50 max-h-[60vh] overflow-y-auto animate-in fade-in zoom-in-95">
                  {availableLanguages.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => handleLanguageChange(item.code)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                        language === item.code
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{item.native}</span>
                      <span className="text-[10px] text-slate-400 uppercase">{item.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-100 space-y-1">
            <button
              onClick={() => {
                onSelectRole('landing');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeRole === 'landing' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>{language === 'hi' ? 'अवलोकन' : language === 'mr' ? 'आढावा' : 'Overview'}</span>
            </button>

            <button
              onClick={() => {
                onSelectRole('trucks');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors ${
                activeRole === 'trucks' ? 'bg-emerald-100/70 text-emerald-900 font-bold' : 'text-slate-700 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-emerald-600" />
                <span>{t('trucksPortal')}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black">
                {t('transparentPricing')}
              </span>
            </button>

            <button
              onClick={() => {
                onSelectRole('matching');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                activeRole === 'matching' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700 hover:bg-slate-50 font-medium'
              }`}
            >
              <Sparkles className={`w-5 h-5 ${activeRole === 'matching' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{t('smartMatches')}</span>
            </button>

            <button
              onClick={() => {
                onOpenAdvisory();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-900/20 mt-2"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                <span>{t('kisanMitraAssistant')}</span>
              </div>
            </button>

            <button
              onClick={() => {
                setIsNotificationCenterOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-emerald-700" />
                <span>{t('notifications')}</span>
              </div>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold">
                  {unreadCount} {language === 'hi' ? 'नए' : language === 'mr' ? 'नवीन' : 'new'}
                </span>
              )}
            </button>

            <div className="pt-2 pb-1 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t('dashboard')}
            </div>
            <div className="space-y-1">
              {navRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    onSelectRole(role.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeRole === role.id
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {role.icon}
                  <span>{t(role.labelKey)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
    </div>
  );
};
