import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PriceAlert, MarketNotification, RoleType } from '../types';
import { CROP_PRICE_PROFILES } from '../data/priceTrendsData';

interface PriceAlertContextType {
  alerts: PriceAlert[];
  notifications: MarketNotification[];
  unreadCount: number;
  addAlert: (alertData: Omit<PriceAlert, 'id' | 'createdAt' | 'triggerCount' | 'isActive'> & { isActive?: boolean }) => PriceAlert;
  updateAlert: (id: string, updates: Partial<PriceAlert>) => void;
  deleteAlert: (id: string) => void;
  toggleAlertActive: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  simulateMarketPriceChange: (commodityId: string, newKisanPrice: number, newMandiPrice: number) => void;
  simulateRandomMarketShock: () => void;
  openCreateAlertModal: (prefill?: Partial<PriceAlert>) => void;
  closeCreateAlertModal: () => void;
  isCreateAlertModalOpen: boolean;
  prefilledAlert: Partial<PriceAlert> | null;
  isNotificationCenterOpen: boolean;
  setIsNotificationCenterOpen: (open: boolean) => void;
  activeToast: MarketNotification | null;
  dismissToast: () => void;
}

const DEFAULT_ALERTS: PriceAlert[] = [
  {
    id: 'alert-tomato-surge',
    commodityId: 'tomato',
    commodityName: 'Tomato',
    variety: 'Hybrid Roma F1',
    category: 'Vegetables',
    targetPrice: 32,
    condition: 'ABOVE_OR_EQUAL',
    priceType: 'KISAN_DIRECT',
    unit: '₹/kg',
    channels: ['in_app', 'whatsapp'],
    phoneOrEmail: '+91 98231 44520',
    note: 'Harvest ready: Sell 4,000 kg batch when direct farm-gate price crosses ₹32/kg',
    isActive: true,
    createdAt: '2026-08-27T08:30:00Z',
    lastTriggeredAt: '2026-09-01T09:15:00Z',
    triggerCount: 2,
  },
  {
    id: 'alert-onion-export',
    commodityId: 'onion',
    commodityName: 'Onion',
    variety: 'Nashik Garwa Red',
    category: 'Vegetables',
    targetPrice: 40,
    condition: 'ABOVE_OR_EQUAL',
    priceType: 'KISAN_DIRECT',
    unit: '₹/kg',
    channels: ['in_app', 'sms'],
    phoneOrEmail: '+91 94220 88190',
    note: 'Target export window: Release storage lots from cold-chain when price hits ₹40/kg',
    isActive: true,
    createdAt: '2026-08-28T10:00:00Z',
    lastTriggeredAt: '2026-08-31T14:40:00Z',
    triggerCount: 1,
  },
  {
    id: 'alert-wheat-procurement',
    commodityId: 'wheat',
    commodityName: 'Wheat',
    variety: 'MP Sharbati C-306 Golden',
    category: 'Grains & Pulses',
    targetPrice: 3400,
    condition: 'ABOVE_OR_EQUAL',
    priceType: 'KISAN_DIRECT',
    unit: '₹/qtl',
    channels: ['in_app', 'push', 'whatsapp'],
    phoneOrEmail: '+91 97554 12099',
    note: 'Lock in forward contract with chakki millers above ₹3,400/quintal',
    isActive: true,
    createdAt: '2026-08-25T11:20:00Z',
    lastTriggeredAt: '2026-09-01T07:10:00Z',
    triggerCount: 1,
  },
  {
    id: 'alert-potato-floor',
    commodityId: 'potato',
    commodityName: 'Potato',
    variety: 'Kufri Jyoti (Chip Grade)',
    category: 'Vegetables',
    targetPrice: 20,
    condition: 'BELOW_OR_EQUAL',
    priceType: 'APMC_MANDI',
    unit: '₹/kg',
    channels: ['in_app', 'push'],
    note: 'Buy alert for FMCG processing plant if mandi rate dips under ₹20/kg',
    isActive: false,
    createdAt: '2026-08-20T14:00:00Z',
    triggerCount: 0,
  },
];

const DEFAULT_NOTIFICATIONS: MarketNotification[] = [
  {
    id: 'notif-1',
    alertId: 'alert-tomato-surge',
    commodityId: 'tomato',
    commodityName: 'Tomato (Roma F1)',
    title: '🚀 Price Target Reached: Tomato @ ₹34/kg',
    message: 'Direct KisanMandi farm-gate price reached ₹34/kg (+21% vs APMC modal rate of ₹28). This exceeds your target of ₹32/kg.',
    timestamp: '10 mins ago',
    currentPrice: 34,
    targetPrice: 32,
    unit: '₹/kg',
    condition: 'ABOVE_OR_EQUAL',
    priceType: 'KISAN_DIRECT',
    isRead: false,
    priority: 'urgent',
    actionLabel: 'List Harvest Lot',
    actionRole: 'farmer',
  },
  {
    id: 'notif-2',
    alertId: 'alert-wheat-procurement',
    commodityId: 'wheat',
    commodityName: 'MP Sharbati Wheat',
    title: '📈 Sharbati Wheat Surged to ₹3,500/qtl',
    message: 'Sehore Mandi & Direct Escrow contracts crossed ₹3,500/quintal due to high export buying from Middle East. Your alert was set at ₹3,400/qtl.',
    timestamp: '2 hours ago',
    currentPrice: 3500,
    targetPrice: 3400,
    unit: '₹/qtl',
    condition: 'ABOVE_OR_EQUAL',
    priceType: 'KISAN_DIRECT',
    isRead: false,
    priority: 'high',
    actionLabel: 'View B2B RFQs',
    actionRole: 'b2b',
  },
  {
    id: 'notif-3',
    alertId: 'alert-onion-export',
    commodityId: 'onion',
    commodityName: 'Nashik Garwa Onion',
    title: '⚡ Onion Price Hit ₹43/kg',
    message: 'Lasalgaon APMC arrivals tightened by 18%. Direct KisanMandi price reached ₹43/kg (Target was ₹40/kg).',
    timestamp: 'Yesterday at 4:40 PM',
    currentPrice: 43,
    targetPrice: 40,
    unit: '₹/kg',
    condition: 'ABOVE_OR_EQUAL',
    priceType: 'KISAN_DIRECT',
    isRead: true,
    priority: 'normal',
    actionLabel: 'Inspect Mandi Arbitrage',
    actionRole: 'farmer',
  },
  {
    id: 'notif-4',
    commodityId: 'garlic',
    commodityName: 'Ooty Giant Garlic',
    title: '🔔 Global Spike: Garlic Reached ₹165/kg',
    message: 'High domestic spice manufacturing demand pushed Ooty & Mandsaur garlic to ₹165/kg (+12.4% weekly gain).',
    timestamp: '2 days ago',
    currentPrice: 165,
    targetPrice: 150,
    unit: '₹/kg',
    condition: 'ABOVE_OR_EQUAL',
    priceType: 'KISAN_DIRECT',
    isRead: true,
    priority: 'normal',
    actionLabel: 'View Price Trend',
    actionRole: 'farmer',
  },
];

const PriceAlertContext = createContext<PriceAlertContextType | undefined>(undefined);

export const PriceAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    try {
      const saved = localStorage.getItem('kisanmandi_price_alerts');
      return saved ? JSON.parse(saved) : DEFAULT_ALERTS;
    } catch {
      return DEFAULT_ALERTS;
    }
  });

  const [notifications, setNotifications] = useState<MarketNotification[]>(() => {
    try {
      const saved = localStorage.getItem('kisanmandi_market_notifications');
      return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  const [isCreateAlertModalOpen, setIsCreateAlertModalOpen] = useState(false);
  const [prefilledAlert, setPrefilledAlert] = useState<Partial<PriceAlert> | null>(null);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<MarketNotification | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('kisanmandi_price_alerts', JSON.stringify(alerts));
    } catch (e) {
      console.error(e);
    }
  }, [alerts]);

  useEffect(() => {
    try {
      localStorage.setItem('kisanmandi_market_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const addAlert = useCallback((alertData: Omit<PriceAlert, 'id' | 'createdAt' | 'triggerCount' | 'isActive'> & { isActive?: boolean }) => {
    const newAlert: PriceAlert = {
      ...alertData,
      id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      isActive: alertData.isActive !== undefined ? alertData.isActive : true,
      createdAt: new Date().toISOString(),
      triggerCount: 0,
    };

    setAlerts((prev) => [newAlert, ...prev]);
    return newAlert;
  }, []);

  const updateAlert = useCallback((id: string, updates: Partial<PriceAlert>) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  }, []);

  const deleteAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const toggleAlertActive = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a)));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  const openCreateAlertModal = useCallback((prefill?: Partial<PriceAlert>) => {
    setPrefilledAlert(prefill || null);
    setIsCreateAlertModalOpen(true);
  }, []);

  const closeCreateAlertModal = useCallback(() => {
    setIsCreateAlertModalOpen(false);
    setPrefilledAlert(null);
  }, []);

  // Simulate market price move and trigger alerts that match
  const simulateMarketPriceChange = useCallback((commodityId: string, newKisanPrice: number, newMandiPrice: number) => {
    const cropProfile = CROP_PRICE_PROFILES.find((c) => c.id === commodityId);
    const cropName = cropProfile?.name || commodityId;
    const unit = cropProfile?.unit || '₹/kg';

    // Find active alerts for this commodity
    const matchingAlerts = alerts.filter((a) => a.commodityId === commodityId && a.isActive);

    matchingAlerts.forEach((alert) => {
      const priceToCheck = alert.priceType === 'APMC_MANDI' ? newMandiPrice : newKisanPrice;
      let isTriggered = false;

      if (alert.condition === 'ABOVE_OR_EQUAL' && priceToCheck >= alert.targetPrice) {
        isTriggered = true;
      } else if (alert.condition === 'BELOW_OR_EQUAL' && priceToCheck <= alert.targetPrice) {
        isTriggered = true;
      } else if (
        alert.condition === 'RANGE' &&
        priceToCheck >= alert.targetPrice &&
        alert.targetPriceMax &&
        priceToCheck <= alert.targetPriceMax
      ) {
        isTriggered = true;
      }

      if (isTriggered) {
        const notifId = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const conditionText =
          alert.condition === 'ABOVE_OR_EQUAL'
            ? 'exceeded target of'
            : alert.condition === 'BELOW_OR_EQUAL'
            ? 'dropped to target of'
            : 'entered target corridor of';

        const newNotif: MarketNotification = {
          id: notifId,
          alertId: alert.id,
          commodityId: alert.commodityId,
          commodityName: alert.commodityName,
          title: `🎯 ${alert.commodityName} Price Alert Triggered!`,
          message: `${alert.commodityName} (${alert.variety}) ${
            alert.priceType === 'APMC_MANDI' ? 'APMC Mandi rate' : 'Direct KisanMandi rate'
          } is now ₹${priceToCheck} ${unit}, which ${conditionText} ₹${alert.targetPrice} ${unit}.${
            alert.note ? ` Note: "${alert.note}"` : ''
          }`,
          timestamp: 'Just now',
          currentPrice: priceToCheck,
          targetPrice: alert.targetPrice,
          unit,
          condition: alert.condition,
          priceType: alert.priceType,
          isRead: false,
          priority: 'urgent',
          actionLabel: 'Trade on Marketplace',
          actionRole: 'farmer',
        };

        setNotifications((prev) => [newNotif, ...prev]);
        setActiveToast(newNotif);

        // Update alert triggered info
        updateAlert(alert.id, {
          lastTriggeredAt: new Date().toISOString(),
          triggerCount: (alert.triggerCount || 0) + 1,
        });

        // Trigger WhatsApp Notification if enabled
        if (alert.channels.includes('whatsapp') && alert.phoneOrEmail) {
          fetch('/api/notifications/whatsapp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: alert.phoneOrEmail,
              message: `*KisanMandi Price Alert*\n\n${newNotif.title}\n\n${newNotif.message}`,
            }),
          }).catch(err => console.error('Failed to send WhatsApp alert:', err));
        }
      }
    });
  }, [alerts, updateAlert]);

  // Quick helper to simulate a sudden market surge on random active alert
  const simulateRandomMarketShock = useCallback(() => {
    const activeList = alerts.filter((a) => a.isActive);
    if (activeList.length > 0) {
      const chosen = activeList[Math.floor(Math.random() * activeList.length)];
      const profile = CROP_PRICE_PROFILES.find((p) => p.id === chosen.commodityId);
      const target = chosen.targetPrice;
      const surgeKisan = Math.round((target * 1.05 + 1) * 10) / 10;
      const surgeMandi = Math.round((surgeKisan * 0.82) * 10) / 10;
      simulateMarketPriceChange(chosen.commodityId, surgeKisan, surgeMandi);
    } else {
      // Default to tomato surge
      simulateMarketPriceChange('tomato', 36, 30);
    }
  }, [alerts, simulateMarketPriceChange]);

  return (
    <PriceAlertContext.Provider
      value={{
        alerts,
        notifications,
        unreadCount,
        addAlert,
        updateAlert,
        deleteAlert,
        toggleAlertActive,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        simulateMarketPriceChange,
        simulateRandomMarketShock,
        openCreateAlertModal,
        closeCreateAlertModal,
        isCreateAlertModalOpen,
        prefilledAlert,
        isNotificationCenterOpen,
        setIsNotificationCenterOpen,
        activeToast,
        dismissToast,
      }}
    >
      {children}
    </PriceAlertContext.Provider>
  );
};

export const usePriceAlerts = () => {
  const context = useContext(PriceAlertContext);
  if (!context) {
    throw new Error('usePriceAlerts must be used within a PriceAlertProvider');
  }
  return context;
};
