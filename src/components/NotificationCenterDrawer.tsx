import React, { useState } from 'react';
import {
  X,
  Bell,
  BellRing,
  CheckCheck,
  Trash2,
  TrendingUp,
  TrendingDown,
  Plus,
  Sliders,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { usePriceAlerts } from '../context/PriceAlertContext';
import { useLanguage } from '../context/LanguageContext';
import { CROP_PRICE_PROFILES } from '../data/priceTrendsData';
import { PriceAlert, MarketNotification, RoleType } from '../types';

interface NotificationCenterDrawerProps {
  onSelectRole?: (role: RoleType) => void;
}

export const NotificationCenterDrawer: React.FC<NotificationCenterDrawerProps> = ({
  onSelectRole,
}) => {
  const {
    isNotificationCenterOpen,
    setIsNotificationCenterOpen,
    notifications,
    alerts,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    toggleAlertActive,
    deleteAlert,
    openCreateAlertModal,
    simulateMarketPriceChange,
    simulateRandomMarketShock,
  } = usePriceAlerts();

  const { language, t, tCrop, tCategory, tUnit } = useLanguage();

  const [activeTab, setActiveTab] = useState<'notifications' | 'alerts' | 'simulator'>('notifications');
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);

  // Simulator state
  const [simCropId, setSimCropId] = useState('tomato');
  const [simKisanPrice, setSimKisanPrice] = useState(38);
  const [simMandiPrice, setSimMandiPrice] = useState(32);

  if (!isNotificationCenterOpen) return null;

  const filteredNotifications = filterUnreadOnly
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  const simCropProfile = CROP_PRICE_PROFILES.find((c) => c.id === simCropId) || CROP_PRICE_PROFILES[0];

  const handleRunSimulator = () => {
    simulateMarketPriceChange(simCropId, simKisanPrice, simMandiPrice);
    setActiveTab('notifications');
  };

  const handleActionClick = (notif: MarketNotification) => {
    markAsRead(notif.id);
    if (notif.actionRole && onSelectRole) {
      onSelectRole(notif.actionRole);
      setIsNotificationCenterOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md sm:max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Top Header */}
        <div className="p-5 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative p-2 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <BellRing className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                {language === 'hi' ? 'मंडी सूचनाएं एवं मूल्य अलर्ट' : language === 'mr' ? 'बाजार सूचना आणि भाव अलर्ट' : 'Market Notifications & Price Alerts'}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'hi' ? 'APMC मंडी उतार-चढ़ाव एवं लक्षित फसल अलर्ट पर लाइव अपडेट' : language === 'mr' ? 'APMC बाजार चढ-उतार आणि थेट पीक सूचनांवर रिअल-टाइम माहिती' : 'Live updates on APMC mandi swings & targeted harvest alerts'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsNotificationCenterOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 px-4 bg-slate-50">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'notifications'
                ? 'border-emerald-600 text-emerald-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'अलर्ट फ़ीड' : language === 'mr' ? 'सूचना फीड' : 'Alerts Feed'}</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'alerts'
                ? 'border-emerald-600 text-emerald-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? `मेरे मूल्य ट्रिगर (${alerts.length})` : language === 'mr' ? `माझे भाव ट्रिगर्स (${alerts.length})` : `My Price Triggers (${alerts.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'simulator'
                ? 'border-emerald-600 text-emerald-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'hi' ? 'मार्केट सिम्युलेटर' : language === 'mr' ? 'बाजार सिम्युलेटर' : 'Market Simulator'}</span>
          </button>
        </div>

        {/* Tab 1: Triggered Notifications Feed */}
        {activeTab === 'notifications' && (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50">
            {/* Action Bar */}
            <div className="p-3 px-5 bg-white border-b border-slate-200 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterUnreadOnly}
                  onChange={(e) => setFilterUnreadOnly(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span>{language === 'hi' ? 'केवल अपठित' : language === 'mr' ? 'फक्त न वाचलेले' : 'Unread only'}</span>
              </label>

              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'सभी पढ़े हुए चिह्नित करें' : language === 'mr' ? 'सर्व वाचलेले चिन्हांकित करा' : 'Mark all read'}</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title={language === 'hi' ? 'इतिहास साफ़ करें' : language === 'mr' ? 'इतिहास साफ करा' : 'Clear history'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div className="font-bold text-slate-700 text-sm">{language === 'hi' ? 'सभी अपडेट हो गए!' : language === 'mr' ? 'सर्व अद्ययावत!' : 'All caught up!'}</div>
                  <p className="text-xs text-slate-500 max-w-xs">
                    {language === 'hi' ? 'कोई अपठित मूल्य अलर्ट नहीं। जब बाजार दर आपके कॉन्फ़िगर किए गए लक्ष्य तक पहुंचेगी, तो लाइव अलर्ट यहां दिखाई देंगे।' : language === 'mr' ? 'कोणतीही न वाचलेली सूचना नाही. जेव्हा बाजारभाव आपल्या उद्दिष्टापर्यंत पोहोचतील, तेव्हा थेट सूचना येथे दिसतील.' : 'No unread price alerts. When market rates hit your configured target parameters, live alerts will appear here.'}
                  </p>
                  <button
                    onClick={() => openCreateAlertModal()}
                    className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    {language === 'hi' ? '+ नया मूल्य अलर्ट सेट करें' : language === 'mr' ? '+ नवीन भाव अलर्ट सेट करा' : '+ Set New Price Alert'}
                  </button>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-2xl border transition-all space-y-2 relative ${
                      notif.isRead
                        ? 'bg-white border-slate-200 text-slate-700'
                        : 'bg-emerald-50/70 border-emerald-300 text-slate-900 shadow-xs'
                    }`}
                  >
                    {/* Header line */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${notif.isRead ? 'bg-slate-300' : 'bg-emerald-600'}`} />
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                          {notif.title}
                        </h4>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                        {notif.timestamp}
                      </span>
                    </div>

                    {/* Body */}
                    <p className="text-xs text-slate-600 leading-relaxed pl-4">
                      {notif.message}
                    </p>

                    {/* Price comparison pill & Action CTA */}
                    <div className="pl-4 pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/60 mt-2">
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                          {language === 'hi' ? 'वर्तमान:' : language === 'mr' ? 'सध्या:' : 'Current:'} ₹{notif.currentPrice} {tUnit(notif.unit)}
                        </span>
                        <span className="text-slate-400 font-medium">
                          {language === 'hi' ? 'लक्ष्य:' : language === 'mr' ? 'उद्दिष्ट:' : 'Target:'} ₹{notif.targetPrice} {tUnit(notif.unit)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {notif.actionLabel && (
                          <button
                            onClick={() => handleActionClick(notif)}
                            className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>{notif.actionLabel}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete notification"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: My Active Price Alerts */}
        {activeTab === 'alerts' && (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50">
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs text-slate-900">{language === 'hi' ? 'कॉन्फ़िगर किए गए कमोडिटी ट्रिगर' : language === 'mr' ? 'कॉन्फिगर केलेले कमोडिटी ट्रिगर्स' : 'Configured Commodity Triggers'}</h3>
                <p className="text-[11px] text-slate-500">{language === 'hi' ? 'लाइव मंडी फ़ीड की निगरानी करने वाले स्वचालित ट्रिगर' : language === 'mr' ? 'थेट बाजार दरांची देखरेख ठेवणारे स्वयंचलित ट्रिगर्स' : 'Automated triggers watching live mandi feeds'}</p>
              </div>
              <button
                onClick={() => openCreateAlertModal()}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'अलर्ट जोड़ें' : language === 'mr' ? 'अलर्ट जोडा' : 'Add Alert'}</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {alerts.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <Sliders className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-slate-700 text-sm">{language === 'hi' ? 'कोई मूल्य अलर्ट सेट नहीं' : language === 'mr' ? 'कोणताही भाव अलर्ट सेट नाही' : 'No price alerts set'}</div>
                  <p className="text-xs text-slate-500 max-w-xs">
                    {language === 'hi' ? 'तत्काल बिक्री सिफारिशें प्राप्त करने के लिए किसी भी सब्जी, फल या अनाज के लिए मूल्य सीमा निर्धारित करें।' : language === 'mr' ? 'झटपट विक्री शिफारसी मिळवण्यासाठी कोणत्याही भाजीपाला, फळे किंवा धान्यासाठी भाव मर्यादा निश्चित करा.' : 'Set a price threshold for any vegetable, fruit, or grain to receive instant harvest sale recommendations.'}
                  </p>
                  <button
                    onClick={() => openCreateAlertModal()}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                  >
                    {language === 'hi' ? '+ पहला अलर्ट बनाएं' : language === 'mr' ? '+ पहिला अलर्ट तयार करा' : '+ Create First Alert'}
                  </button>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      alert.isActive
                        ? 'bg-white border-slate-200 shadow-2xs'
                        : 'bg-slate-100/70 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">
                            {tCrop(alert.commodityName)}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            ({alert.variety})
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold gradient-border-organic border-0">
                            {tCategory(alert.category)}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1 flex items-center gap-1.5 font-medium">
                          {alert.condition === 'ABOVE_OR_EQUAL' ? (
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                          ) : alert.condition === 'BELOW_OR_EQUAL' ? (
                            <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          )}
                          <span>
                            {language === 'hi' ? 'मूल्य होने पर सूचित करें:' : language === 'mr' ? 'भाव पोहोचल्यावर सूचित करा:' : 'Trigger when price'} {alert.condition === 'ABOVE_OR_EQUAL' ? '≥' : alert.condition === 'BELOW_OR_EQUAL' ? '≤' : language === 'hi' ? 'के बीच' : language === 'mr' ? 'दरम्यान' : 'between'}{' '}
                            <strong className="text-slate-900">₹{alert.targetPrice} {tUnit(alert.unit)}</strong>
                            {alert.targetPriceMax && ` - ₹${alert.targetPriceMax} ${tUnit(alert.unit)}`}
                          </span>
                        </div>
                      </div>

                      {/* Active Toggle Switch */}
                      <button
                        onClick={() => toggleAlertActive(alert.id)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          alert.isActive ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                        }`}
                        title={alert.isActive ? 'Pause Alert' : 'Resume Alert'}
                      >
                        <div className="bg-white w-4 h-4 rounded-full shadow-xs" />
                      </button>
                    </div>

                    {alert.note && (
                      <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-xl gradient-border-organic border-0/60">
                        "{alert.note}"
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
                      <div className="flex items-center gap-2 text-slate-500">
                        <span>{language === 'hi' ? 'माध्यम:' : language === 'mr' ? 'माध्यम:' : 'Channels:'}</span>
                        <div className="flex items-center gap-1">
                          {alert.channels.map((ch) => (
                            <span
                              key={ch}
                              className="px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-700 font-semibold uppercase text-[9px]"
                            >
                              {ch}
                            </span>
                          ))}
                        </div>
                        {alert.triggerCount > 0 && (
                          <span className="text-emerald-700 font-bold ml-1">
                            • {language === 'hi' ? `${alert.triggerCount} बार ट्रिगर हुआ` : language === 'mr' ? `${alert.triggerCount} वेळा ट्रिगर झाले` : `Triggered ${alert.triggerCount}x`}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openCreateAlertModal(alert)}
                          className="text-xs font-bold text-slate-700 hover:text-emerald-700 cursor-pointer"
                        >
                          {language === 'hi' ? 'संपादित करें' : language === 'mr' ? 'संपादित करा' : 'Edit'}
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          onClick={() => deleteAlert(alert.id)}
                          className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                        >
                          {language === 'hi' ? 'हटाएं' : language === 'mr' ? 'हटवा' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Market Price Simulator */}
        {activeTab === 'simulator' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/50">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                {language === 'hi' ? 'लाइव मूल्य अलर्ट परीक्षण बेंच' : language === 'mr' ? 'थेट भाव अलर्ट चाचणी केंद्र' : 'Live Price Alert Test Bench'}
              </div>
              <p className="text-slate-600 leading-relaxed">
                {language === 'hi' ? 'APMC नीलामी दर में उतार-चढ़ाव या प्रत्यक्ष ट्रेड का अनुकरण करने के लिए इस सिम्युलेटर का उपयोग करें। यदि अनुकरणीय दर किसी सक्रिय अलर्ट शर्त को पूरा करती है, तो ध्वनि और टोस्ट के साथ तत्काल सूचना ट्रिगर होगी!' : language === 'mr' ? 'APMC लिलाव दरातील चढ-उतार किंवा थेट व्यवहारांचे अनुकरण करण्यासाठी हा सिम्युलेटर वापरा. जर सिमुलेट केलेला भाव सक्रिय अटी पूर्ण करत असेल, तर आवाजासह त्वरित सूचना ट्रिगर होईल!' : 'Use this simulator to simulate APMC auction rate fluctuations or direct platform trades. If the simulated rate meets any active alert condition, an instant notification with sound and push toast will trigger!'}
              </p>
            </div>

            {/* Select Crop to Simulate */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {language === 'hi' ? 'सिम्युलेट करने के लिए कमोडिटी चुनें' : language === 'mr' ? 'सिम्युलेट करण्यासाठी कमोडिटी निवडा' : 'Select Commodity to Simulate'}
              </label>
              <select
                value={simCropId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSimCropId(id);
                  const p = CROP_PRICE_PROFILES.find((c) => c.id === id);
                  if (p) {
                    setSimKisanPrice(p.currentKisan);
                    setSimMandiPrice(p.currentMandi);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
              >
                {CROP_PRICE_PROFILES.map((crop) => (
                  <option key={crop.id} value={crop.id}>
                    {tCrop(crop.name)} ({crop.variety}) - {language === 'hi' ? 'वर्तमान:' : language === 'mr' ? 'सध्या:' : 'Current:'} ₹{crop.currentKisan} {tUnit(crop.unit)}
                  </option>
                ))}
              </select>
            </div>

            {/* Slider for KisanMandi Direct Price */}
            <div className="p-4 rounded-2xl bg-white gradient-border-organic border-0 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-900">{language === 'hi' ? 'प्रत्यक्ष प्राप्ति सिम्युलेट करें:' : language === 'mr' ? 'थेट उत्पन्न सिम्युलेट करा:' : 'Simulate Direct Realization:'}</span>
                <span className="text-base font-extrabold text-emerald-700">
                  ₹{simKisanPrice} {tUnit(simCropProfile.unit)}
                </span>
              </div>
              <input
                type="range"
                min={Math.max(5, Math.floor(simCropProfile.mspFloor * 0.7))}
                max={Math.ceil(simCropProfile.currentKisan * 2.2)}
                step={simCropProfile.unit.includes('qtl') ? 50 : 1}
                value={simKisanPrice}
                onChange={(e) => {
                  const kVal = Number(e.target.value);
                  setSimKisanPrice(kVal);
                  setSimMandiPrice(Math.round(kVal * 0.82));
                }}
                className="w-full accent-emerald-600 bg-slate-200 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>{language === 'hi' ? 'न्यूनतम:' : language === 'mr' ? 'किमान:' : 'Low:'} ₹{Math.max(5, Math.floor(simCropProfile.mspFloor * 0.7))}</span>
                <span>{language === 'hi' ? 'अधिकतम:' : language === 'mr' ? 'कमाल:' : 'High:'} ₹{Math.ceil(simCropProfile.currentKisan * 2.2)}</span>
              </div>
            </div>

            {/* APMC Modal Rate */}
            <div className="p-4 rounded-2xl bg-white gradient-border-organic border-0 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-amber-900">{language === 'hi' ? 'संबंधित मंडी मॉडल भाव:' : language === 'mr' ? 'संबंधित बाजार सरासरी भाव:' : 'Associated Mandi Modal:'}</span>
                <span className="text-sm font-bold text-amber-700">
                  ₹{simMandiPrice} {tUnit(simCropProfile.unit)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {language === 'hi' ? 'मानक 18-22% APMC कमीशन और मध्यस्थ मार्जिन स्प्रेड के आधार पर परिकलित।' : language === 'mr' ? 'मानक 18-22% APMC कमिशन आणि दलाल मार्जिन आधारे मोजलेले.' : 'Calculated based on standard 18-22% APMC commission and intermediary margin spread.'}
              </p>
            </div>

            {/* Simulation Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleRunSimulator}
                className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{language === 'hi' ? `लाइव मूल्य टिक प्रसारित करें (₹${simKisanPrice})` : language === 'mr' ? `थेट भाव टिक प्रसारित करा (₹${simKisanPrice})` : `Broadcast Live Price Tick (₹${simKisanPrice})`}</span>
              </button>

              <button
                onClick={simulateRandomMarketShock}
                className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{language === 'hi' ? 'अचानक बाज़ार उछाल झटका सिम्युलेट करें' : language === 'mr' ? 'अचानक बाजार उसळीचा झटका सिम्युलेट करा' : 'Simulate Sudden Market Spike Shock'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
