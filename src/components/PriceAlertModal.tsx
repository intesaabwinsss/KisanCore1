import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  Sparkles,
  Smartphone,
  MessageSquare,
  ShieldCheck,
  Check,
  Sliders,
  DollarSign,
  AlertCircle,
  Layers,
  HelpCircle,
  Building2,
  Calendar
} from 'lucide-react';
import { usePriceAlerts } from '../context/PriceAlertContext';
import { useLanguage } from '../context/LanguageContext';
import { CROP_PRICE_PROFILES } from '../data/priceTrendsData';
import { PriceAlertCondition, AlertPriceType, NotificationChannel, PriceAlert } from '../types';

export const PriceAlertModal: React.FC = () => {
  const {
    isCreateAlertModalOpen,
    closeCreateAlertModal,
    prefilledAlert,
    addAlert,
    updateAlert,
    simulateMarketPriceChange,
  } = usePriceAlerts();

  const { language, t, tCrop, tCategory, tUnit, tLocation } = useLanguage();

  // Selected commodity
  const [selectedCropId, setSelectedCropId] = useState<string>('tomato');
  const [condition, setCondition] = useState<PriceAlertCondition>('ABOVE_OR_EQUAL');
  const [priceType, setPriceType] = useState<AlertPriceType>('KISAN_DIRECT');
  const [targetPrice, setTargetPrice] = useState<number>(35);
  const [targetPriceMax, setTargetPriceMax] = useState<number>(45);
  const [channels, setChannels] = useState<NotificationChannel[]>(['in_app', 'whatsapp']);
  const [phoneOrEmail, setPhoneOrEmail] = useState<string>('+91 98765 43210');
  const [note, setNote] = useState<string>('');
  const [successSaved, setSuccessSaved] = useState(false);

  // Active crop profile
  const cropProfile = CROP_PRICE_PROFILES.find((c) => c.id === selectedCropId) || CROP_PRICE_PROFILES[0];
  const unit = cropProfile.unit;

  // Initialize or update state when prefilledAlert changes
  useEffect(() => {
    if (prefilledAlert) {
      if (prefilledAlert.commodityId) setSelectedCropId(prefilledAlert.commodityId);
      if (prefilledAlert.condition) setCondition(prefilledAlert.condition);
      if (prefilledAlert.priceType) setPriceType(prefilledAlert.priceType);
      if (prefilledAlert.targetPrice) setTargetPrice(prefilledAlert.targetPrice);
      if (prefilledAlert.targetPriceMax) setTargetPriceMax(prefilledAlert.targetPriceMax);
      if (prefilledAlert.channels) setChannels(prefilledAlert.channels);
      if (prefilledAlert.phoneOrEmail) setPhoneOrEmail(prefilledAlert.phoneOrEmail);
      if (prefilledAlert.note) setNote(prefilledAlert.note);
    } else {
      // Default to 10% above current price for selling alert
      const current = cropProfile.currentKisan;
      setTargetPrice(Math.round(current * 1.15 * 10) / 10);
      setTargetPriceMax(Math.round(current * 1.35 * 10) / 10);
      setNote(`Sell harvest lot when ${cropProfile.name} price reaches target`);
    }
  }, [prefilledAlert, selectedCropId]);

  if (!isCreateAlertModalOpen) return null;

  const handleToggleChannel = (channel: NotificationChannel) => {
    setChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    );
  };

  const handleSaveAlert = (e: React.FormEvent) => {
    e.preventDefault();

    if (prefilledAlert && prefilledAlert.id) {
      // Update existing
      updateAlert(prefilledAlert.id, {
        commodityId: cropProfile.id,
        commodityName: cropProfile.name,
        variety: cropProfile.variety,
        category: cropProfile.category,
        targetPrice,
        targetPriceMax: condition === 'RANGE' ? targetPriceMax : undefined,
        condition,
        priceType,
        unit: cropProfile.unit,
        channels,
        phoneOrEmail,
        note,
      });
    } else {
      // Add new
      addAlert({
        commodityId: cropProfile.id,
        commodityName: cropProfile.name,
        variety: cropProfile.variety,
        category: cropProfile.category,
        targetPrice,
        targetPriceMax: condition === 'RANGE' ? targetPriceMax : undefined,
        condition,
        priceType,
        unit: cropProfile.unit,
        channels,
        phoneOrEmail,
        note: note || `Alert when ${cropProfile.name} reaches target`,
        isActive: true,
      });
    }

    setSuccessSaved(true);
    setTimeout(() => {
      setSuccessSaved(false);
      closeCreateAlertModal();
    }, 900);
  };

  const handleTestTriggerNow = () => {
    // Simulate current price triggering this condition right now
    const testKisan = condition === 'BELOW_OR_EQUAL' ? targetPrice - 1 : targetPrice + 2;
    const testMandi = Math.round(testKisan * 0.85 * 10) / 10;
    simulateMarketPriceChange(cropProfile.id, testKisan, testMandi);
    closeCreateAlertModal();
  };

  const currentBenchmarkPrice =
    priceType === 'APMC_MANDI' ? cropProfile.currentMandi : cropProfile.currentKisan;
  const priceDiff = Math.round((targetPrice - currentBenchmarkPrice) * 10) / 10;
  const pctDiff = Math.round(((targetPrice - currentBenchmarkPrice) / currentBenchmarkPrice) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl gradient-border-organic border-0 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                {prefilledAlert?.id 
                  ? (language === 'hi' ? 'मूल्य अलर्ट संपादित करें' : language === 'mr' ? 'भाव अलर्ट संपादित करा' : 'Edit Price Alert') 
                  : (language === 'hi' ? 'रीयल-टाइम मूल्य अलर्ट बनाएं' : language === 'mr' ? 'रिअल-टाइम भाव अलर्ट तयार करा' : 'Create Real-Time Price Alert')}
              </h3>
              <p className="text-xs text-slate-300">
                {language === 'hi' ? 'जब बाजार मूल्य आपके लक्ष्य तक पहुंचे तो इन-ऐप, व्हाट्सएप या एसएमएस के माध्यम से तुरंत सूचित हों।' : language === 'mr' ? 'जेव्हा बाजारभाव आपल्या उद्दिष्टापर्यंत पोहोचतील तेव्हा इन-अ‍ॅप, व्हॉट्सअ‍ॅप किंवा एसएमएसद्वारे त्वरित सूचना मिळवा.' : 'Get notified instantly via In-App, WhatsApp, or SMS when market prices hit your target.'}
              </p>
            </div>
          </div>
          <button
            onClick={closeCreateAlertModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveAlert} className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-800">
          {/* 1. Commodity Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {language === 'hi' ? '1. कृषि कमोडिटी चुनें' : language === 'mr' ? '1. कृषी कमोडिटी निवडा' : '1. Select Agricultural Commodity'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
              {CROP_PRICE_PROFILES.map((crop) => {
                const isSelected = selectedCropId === crop.id;
                return (
                  <button
                    type="button"
                    key={crop.id}
                    onClick={() => {
                      setSelectedCropId(crop.id);
                      setTargetPrice(Math.round(crop.currentKisan * 1.15 * 10) / 10);
                    }}
                    className={`p-2.5 rounded-2xl border text-left transition-all text-xs flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/30 shadow-xs'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="font-bold truncate">{tCrop(crop.name)}</div>
                    <div className="text-[10px] text-slate-500 flex items-center justify-between mt-1">
                      <span>₹{crop.currentKisan} {tUnit(crop.unit)}</span>
                      <span className="text-[9px] text-emerald-700 font-semibold">{tCategory(crop.category)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Market Benchmark Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-50 gradient-border-organic border-0 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <div>
                <span className="font-semibold text-slate-700">{tCrop(cropProfile.name)} ({cropProfile.variety})</span>
                <div className="text-[11px] text-slate-500">{language === 'hi' ? 'मंडी:' : language === 'mr' ? 'बाजार:' : 'Mandi:'} {tLocation(cropProfile.primaryMandi)}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-right">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">{language === 'hi' ? 'प्रत्यक्ष प्राप्ति' : language === 'mr' ? 'थेट उत्पन्न' : 'Direct Realization'}</div>
                <div className="font-bold text-emerald-800">₹{cropProfile.currentKisan} {tUnit(unit)}</div>
              </div>
              <div className="border-l border-slate-200 pl-3">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">{language === 'hi' ? 'APMC मॉडल' : language === 'mr' ? 'APMC सरासरी' : 'APMC Modal'}</div>
                <div className="font-bold text-amber-700">₹{cropProfile.currentMandi} {tUnit(unit)}</div>
              </div>
            </div>
          </div>

          {/* 2. Alert Condition & Price Basis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {language === 'hi' ? '2. ट्रिगर शर्त' : language === 'mr' ? '2. ट्रिगर अट' : '2. Trigger Condition'}
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl gradient-border-organic border-0">
                <button
                  type="button"
                  onClick={() => setCondition('ABOVE_OR_EQUAL')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    condition === 'ABOVE_OR_EQUAL'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>{language === 'hi' ? 'ऊपर बढ़े (बिक्री)' : language === 'mr' ? 'वर चढल्यास (विक्री)' : 'Rises Above (Sell)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCondition('BELOW_OR_EQUAL')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    condition === 'BELOW_OR_EQUAL'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <TrendingDown className="w-4 h-4" />
                  <span>{language === 'hi' ? 'नीचे गिरे (खरीद)' : language === 'mr' ? 'खाली घसरल्यास (खरेदी)' : 'Drops Below (Buy)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCondition('RANGE')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    condition === 'RANGE'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>{language === 'hi' ? 'मूल्य सीमा' : language === 'mr' ? 'भाव मर्यादा' : 'Price Range'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {language === 'hi' ? 'मूल्य बेंचमार्क आधार' : language === 'mr' ? 'भाव बेंचमार्क आधार' : 'Price Benchmark Basis'}
              </label>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setPriceType('KISAN_DIRECT')}
                  className={`w-full p-2 rounded-xl text-xs font-semibold text-left border flex items-center justify-between cursor-pointer ${
                    priceType === 'KISAN_DIRECT'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <span>{language === 'hi' ? 'KisanDirect प्रत्यक्ष (फार्म-गेट)' : language === 'mr' ? 'KisanDirect थेट (शेत-दर)' : 'KisanDirect Direct (Farm-gate)'}</span>
                  <span className="font-bold text-emerald-700">₹{cropProfile.currentKisan} {tUnit(unit)}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPriceType('APMC_MANDI')}
                  className={`w-full p-2 rounded-xl text-xs font-semibold text-left border flex items-center justify-between cursor-pointer ${
                    priceType === 'APMC_MANDI'
                      ? 'border-amber-600 bg-amber-50 text-amber-950'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <span>{language === 'hi' ? 'APMC मंडी मॉडल दर' : language === 'mr' ? 'APMC बाजार सरासरी दर' : 'APMC Mandi Modal Rate'}</span>
                  <span className="font-bold text-amber-700">₹{cropProfile.currentMandi} {tUnit(unit)}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. Target Price Input */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                {language === 'hi' ? `3. लक्ष्य मूल्य निर्धारित करें (${tUnit(unit)})` : language === 'mr' ? `3. लक्ष्य भाव निश्चित करा (${tUnit(unit)})` : `3. Set Target Price (${unit})`}
              </label>
              <div className="text-xs font-bold text-emerald-800">
                {priceDiff >= 0 ? `+₹${priceDiff} (+${pctDiff}%)` : `₹${priceDiff} (${pctDiff}%)`} {language === 'hi' ? 'वर्तमान की तुलना में' : language === 'mr' ? 'सध्याच्या तुलनेत' : 'vs current'}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTargetPrice((prev) => Math.max(1, prev - (unit.includes('qtl') ? 50 : 1)))}
                className="w-10 h-10 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-lg hover:bg-slate-50 flex items-center justify-center shrink-0 cursor-pointer"
              >
                -
              </button>

              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  step={unit.includes('qtl') ? '10' : '0.5'}
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  className="w-full pl-8 pr-16 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-extrabold text-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  {tUnit(unit)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setTargetPrice((prev) => prev + (unit.includes('qtl') ? 50 : 1))}
                className="w-10 h-10 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-lg hover:bg-slate-50 flex items-center justify-center shrink-0 cursor-pointer"
              >
                +
              </button>
            </div>

            {condition === 'RANGE' && (
              <div className="pt-2 border-t border-emerald-200/80">
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  {language === 'hi' ? `उच्च लक्ष्य सीमा (₹${tUnit(unit)})` : language === 'mr' ? `कमाल उद्दिष्ट मर्यादा (₹${tUnit(unit)})` : `Upper Target Bound (₹${unit})`}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    step={unit.includes('qtl') ? '10' : '0.5'}
                    value={targetPriceMax}
                    onChange={(e) => setTargetPriceMax(Number(e.target.value))}
                    className="w-full pl-8 pr-16 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    {tUnit(unit)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 4. Notification Channels & Contact Info */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {language === 'hi' ? '4. अधिसूचना प्रेषण माध्यम' : language === 'mr' ? '4. सूचना पाठवण्याचे माध्यम' : '4. Notification Dispatch Channels'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'in_app', label: language === 'hi' ? 'इन-ऐप अलर्ट' : language === 'mr' ? 'इन-अ‍ॅप सूचना' : 'In-App Alert', icon: <Bell className="w-4 h-4" /> },
                { id: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare className="w-4 h-4 text-emerald-600" /> },
                { id: 'sms', label: language === 'hi' ? 'SMS गेटवे' : language === 'mr' ? 'SMS गेटवे' : 'SMS Gateway', icon: <Smartphone className="w-4 h-4 text-blue-600" /> },
                { id: 'push', label: language === 'hi' ? 'पुश अलर्ट' : language === 'mr' ? 'पुश सूचना' : 'Push Alert', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
              ].map((c) => {
                const isChecked = channels.includes(c.id as NotificationChannel);
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => handleToggleChannel(c.id as NotificationChannel)}
                    className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      isChecked
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                        : 'border-slate-200 bg-slate-50 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {c.icon}
                      <span>{c.label}</span>
                    </div>
                    {isChecked && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                );
              })}
            </div>

            {(channels.includes('whatsapp') || channels.includes('sms')) && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder={language === 'hi' ? 'मोबाइल / व्हाट्सएप नंबर दर्ज करें (+91 ...)' : language === 'mr' ? 'मोबाईल / व्हॉट्सअ‍ॅप नंबर टाका (+91 ...)' : 'Enter Mobile / WhatsApp Number (+91 ...)'}
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white"
                />
              </div>
            )}
          </div>

          {/* 5. Custom Note / Intent */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {language === 'hi' ? '5. अलर्ट मेमो / कार्य नोट (वैकल्पिक)' : language === 'mr' ? '5. अलर्ट मेमो / कृती नोंद (पर्यायी)' : '5. Alert Memo / Action Note (Optional)'}
            </label>
            <input
              type="text"
              placeholder={language === 'hi' ? 'उदा. 50 मीट्रिक टन कोल्ड स्टोरेज लॉट रिलीज करें, या B2B अनुबंध करें' : language === 'mr' ? 'उदा. 50 मेट्रिक टन कोल्ड स्टोरेज लॉट विक्रीसाठी काढा' : 'e.g., Release 50 MT cold storage batch, or execute B2B contract'}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white"
            />
          </div>

          {/* Footer CTA Buttons */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleTestTriggerNow}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'hi' ? 'अब ट्रिगर सिम्युलेट करें' : language === 'mr' ? 'आता ट्रिगर सिम्युलेट करा' : 'Simulate Trigger Now'}</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={closeCreateAlertModal}
                className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
              >
                {language === 'hi' ? 'रद्द करें' : language === 'mr' ? 'रद्द करा' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {successSaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{language === 'hi' ? 'सहेजा गया!' : language === 'mr' ? 'जतन केले!' : 'Saved!'}</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    <span>{prefilledAlert?.id ? (language === 'hi' ? 'अलर्ट अपडेट करें' : language === 'mr' ? 'अलर्ट अपडेट करा' : 'Update Alert') : (language === 'hi' ? 'मूल्य अलर्ट सक्रिय करें' : language === 'mr' ? 'भाव अलर्ट सक्रिय करा' : 'Activate Price Alert')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
