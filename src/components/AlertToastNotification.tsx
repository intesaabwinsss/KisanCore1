import React, { useEffect } from 'react';
import { Bell, X, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { usePriceAlerts } from '../context/PriceAlertContext';
import { useLanguage } from '../context/LanguageContext';
import { RoleType } from '../types';

interface AlertToastNotificationProps {
  onSelectRole?: (role: RoleType) => void;
}

export const AlertToastNotification: React.FC<AlertToastNotificationProps> = ({
  onSelectRole,
}) => {
  const { activeToast, dismissToast, setIsNotificationCenterOpen, markAsRead } = usePriceAlerts();
  const { language, t } = useLanguage();

  // Auto dismiss after 8 seconds
  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        dismissToast();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [activeToast, dismissToast]);

  if (!activeToast) return null;

  const handleOpenAlertCenter = () => {
    markAsRead(activeToast.id);
    dismissToast();
    setIsNotificationCenterOpen(true);
  };

  const handleAction = () => {
    markAsRead(activeToast.id);
    dismissToast();
    if (activeToast.actionRole && onSelectRole) {
      onSelectRole(activeToast.actionRole);
    }
  };

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-md w-full animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-auto">
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-emerald-500/40 ring-4 ring-emerald-500/10 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shrink-0 animate-bounce">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {language === 'hi' ? 'लाइव कमोडिटी मूल्य अलर्ट' : language === 'mr' ? 'थेट कमोडिटी भाव सूचना' : 'Live Commodity Price Alert'}
              </div>
              <h4 className="text-sm font-bold text-white leading-tight">
                {activeToast.title}
              </h4>
            </div>
          </div>
          <button
            onClick={dismissToast}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed pl-1">
          {activeToast.message}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800 gap-2">
          <button
            onClick={handleOpenAlertCenter}
            className="text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
          >
            {language === 'hi' ? 'सभी सूचनाएं देखें' : language === 'mr' ? 'सर्व सूचना पहा' : 'View All Notifications'}
          </button>

          {activeToast.actionLabel && (
            <button
              onClick={handleAction}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <span>{activeToast.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
