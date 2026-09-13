import React from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Package,
  DollarSign,
  ShieldAlert,
  X,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export interface FarmerNotificationItem {
  id: string;
  type: 'PRICE_ALERT' | 'NEW_ORDER' | 'PAYMENT' | 'SECURITY' | 'DEMAND';
  title: string;
  message: string;
  timeAgo: string;
  isRead: boolean;
  actionLabel?: string;
  actionPayload?: any;
}

interface NotificationPanelProps {
  notifications: FarmerNotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClose?: () => void;
  onSelectAction?: (notification: FarmerNotificationItem) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
  onSelectAction,
}) => {
  const getNotificationIcon = (type: FarmerNotificationItem['type']) => {
    switch (type) {
      case 'PRICE_ALERT':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            🔔
          </div>
        );
      case 'NEW_ORDER':
        return (
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            📦
          </div>
        );
      case 'PAYMENT':
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            💰
          </div>
        );
      case 'SECURITY':
        return (
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
            ⚠️
          </div>
        );
      case 'DEMAND':
        return (
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
            📈
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
            📢
          </div>
        );
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div
      id="farmer-notification-panel"
      className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 shadow-lg p-5 w-full max-w-md space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <span>Notifications & Alerts</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-black">
                  {unreadCount} New
                </span>
              )}
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">Real-time marketplace updates</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold px-2 py-1 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              Mark all read
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No notifications at the moment.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => onMarkAsRead(n.id)}
              className={`pt-2.5 first:pt-0 pb-1 flex items-start gap-3 rounded-2xl transition-all cursor-pointer p-2 ${
                !n.isRead ? 'bg-emerald-50/50 hover:bg-emerald-50' : 'hover:bg-slate-50'
              }`}
            >
              {getNotificationIcon(n.type)}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-xs font-black truncate ${!n.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                    {n.title}
                  </span>
                  <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {n.timeAgo}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 mt-0.5 font-medium leading-relaxed">
                  {n.message}
                </p>

                {n.actionLabel && onSelectAction && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAction(n);
                    }}
                    className="mt-1.5 text-[10px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-emerald-200/80 shadow-2xs"
                  >
                    <span>{n.actionLabel}</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>

              {!n.isRead && (
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
