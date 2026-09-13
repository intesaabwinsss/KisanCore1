import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Bell, 
  UserCheck, 
  LogOut, 
  Activity, 
  FileText, 
  MapPin, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Layers, 
  Lock,
  Search,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export type GovTabType = 
  | 'overview' 
  | 'farmers' 
  | 'buyers' 
  | 'transactions' 
  | 'market_prices' 
  | 'supply_demand' 
  | 'districts' 
  | 'alerts' 
  | 'reports' 
  | 'security';

interface GovernmentHeaderProps {
  activeTab: GovTabType;
  onSelectTab: (tab: GovTabType) => void;
  unreadAlertCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onLogout?: () => void;
  onOpenSecurityLedger: () => void;
  systemStatusText?: string;
}

export const GovernmentHeader: React.FC<GovernmentHeaderProps> = ({
  activeTab,
  onSelectTab,
  unreadAlertCount,
  onOpenNotifications,
  onOpenProfile,
  onLogout,
  onOpenSecurityLedger,
  systemStatusText = 'System Operational'
}) => {
  const navTabs: { id: GovTabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <Layers className="w-4 h-4" /> },
    { id: 'farmers', label: 'Farmers', icon: <Users className="w-4 h-4" />, badge: '12.4k' },
    { id: 'buyers', label: 'Buyers', icon: <ShoppingCart className="w-4 h-4" />, badge: '3.8k' },
    { id: 'transactions', label: 'Transactions', icon: <Activity className="w-4 h-4" /> },
    { id: 'market_prices', label: 'Market Prices', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'supply_demand', label: 'Supply & Demand', icon: <MapPin className="w-4 h-4" /> },
    { id: 'districts', label: 'Districts', icon: <Building2 className="w-4 h-4" />, badge: 'NCR' },
    { id: 'alerts', label: 'Alerts', icon: <AlertTriangle className="w-4 h-4" />, badge: unreadAlertCount > 0 ? `${unreadAlertCount}` : undefined },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'security', label: 'System Security', icon: <Lock className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-xl">
      {/* Top Utility & Identity Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shadow-inner">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-base text-white font-mono">
                  KISANDIRECT
                </span>
                <span className="text-slate-600 font-light">|</span>
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                  Agricultural Supply Chain Monitor
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                <span>Ministry of Agriculture & Farmers Welfare Dashboard</span>
                <span>•</span>
                <span className="text-slate-400">Regional Node: Delhi NCR Corridor</span>
              </div>
            </div>
          </div>

          {/* Right Action & Status Group */}
          <div className="flex items-center flex-wrap gap-2.5 sm:gap-3.5 w-full md:w-auto justify-between md:justify-end">
            
            {/* Live System Operational Status */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 text-xs font-mono font-medium shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>🟢 {systemStatusText}</span>
            </div>

            {/* Cryptographic Ledger Fast-Access */}
            <button
              id="gov-audit-ledger-quick-btn"
              onClick={onOpenSecurityLedger}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition cursor-pointer"
              title="View SHA-256 Audit Trail"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline font-mono">SHA-256 Audit</span>
            </button>

            {/* Notifications Bell */}
            <button
              id="gov-notifications-bell-btn"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition cursor-pointer"
              title="Supply Chain Alerts"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              {unreadAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-red-500 text-white font-bold text-[10px] rounded-full animate-bounce">
                  {unreadAlertCount}
                </span>
              )}
            </button>

            {/* Officer Profile Badge */}
            <div 
              onClick={onOpenProfile}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs cursor-pointer transition"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-700 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                GA
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-semibold text-slate-100 text-[11px] leading-tight">Govt. Administrator</div>
                <div className="text-[10px] text-slate-400 font-mono">ID: GOV-NCR-901</div>
              </div>
            </div>

            {/* Logout */}
            {onLogout && (
              <button
                id="gov-logout-btn"
                onClick={onLogout}
                className="p-2 rounded-lg bg-slate-800 hover:bg-red-950/60 hover:text-red-300 text-slate-400 border border-slate-700 transition cursor-pointer"
                title="Switch Portal / Exit"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="bg-slate-950/90 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto overflow-x-auto scrollbar-none flex items-center gap-1 py-1">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`gov-nav-tab-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive 
                        ? 'bg-emerald-800 text-emerald-100' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
