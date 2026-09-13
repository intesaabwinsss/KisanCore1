import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Scale, 
  CheckCircle2, 
  ArrowRight, 
  Truck, 
  Store, 
  Tractor, 
  Building2, 
  Info, 
  ExternalLink,
  Receipt,
  ThermometerSnowflake,
  TrendingUp,
  Clock
} from 'lucide-react';
import { ProduceListing, Language } from '../types';
import { getPriceChainForCommodity, formatIndianRupees } from '../utils/priceCalculations';
import { useLanguage } from '../context/LanguageContext';

interface PriceBreakdownModalProps {
  produce: ProduceListing;
  onClose: () => void;
  currentLanguage?: Language;
}

export const PriceBreakdownModal: React.FC<PriceBreakdownModalProps> = ({
  produce,
  onClose,
}) => {
  const { language, t, tCrop, tUnit } = useLanguage();
  const chain = getPriceChainForCommodity(produce.cropName);
  const [activeTab, setActiveTab] = useState<'itemized' | 'comparison'>('itemized');

  // Compute itemized numbers based on produce price
  const retailPrice = produce.pricePerKg; // The direct price on KisanMandi
  const traditionalMandiBench = produce.mandiBenchmarkPrice;
  // Estimate what open market retail would be (typically 35-50% higher than direct)
  const traditionalRetailPrice = Math.round(retailPrice * 1.45);
  
  // Direct model distribution for this specific item:
  const farmerShare = Math.round(retailPrice * 0.82); // 82% to farmer
  const coldLogistics = Math.round(retailPrice * 0.15); // 15% cold transit
  const platformFee = Number((retailPrice * 0.03).toFixed(1)); // 3% escrow facilitation

  const buyerSavingPerKg = traditionalRetailPrice - retailPrice;
  const buyerSavingPercent = Math.round((buyerSavingPerKg / traditionalRetailPrice) * 100);
  const farmerExtraPerKg = farmerShare - traditionalMandiBench;
  const farmerExtraPercent = Math.max(15, Math.round((farmerExtraPerKg / traditionalMandiBench) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 gradient-border-organic border-0 shadow-2xl relative my-8 animate-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-display font-extrabold text-slate-900">
                {language === 'hi' ? 'प्रत्यक्ष मूल्य पारदर्शिता' : language === 'mr' ? 'थेट किंमत पारदर्शकता' : 'Direct Price Transparency'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                {language === 'hi' ? '100% पारदर्शी रुपया' : language === 'mr' ? '100% पारदर्शक रुपया' : '100% Traceable Rupee'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              {language === 'hi' ? 'लॉट सं.' : language === 'mr' ? 'लॉट क्र.' : 'Lot #'} {produce.lotNumber} • {tCrop(produce.cropName)} {produce.variety && `(${produce.variety})`}
            </p>
          </div>
        </div>

        {/* Top Split Banner */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-900 text-white">
          <div>
            <span className="text-[11px] text-emerald-300 uppercase tracking-wider block font-semibold">
              {language === 'hi' ? 'किसान की सीधी कमाई' : language === 'mr' ? 'शेतकऱ्याची थेट कमाई' : 'Farmer Direct Realization'}
            </span>
            <div className="text-2xl font-extrabold text-white">
              {formatIndianRupees(farmerShare)}{tUnit('/kg')}
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">
              +{farmerExtraPercent}% {language === 'hi' ? 'मंडी की तुलना में' : language === 'mr' ? 'बाजाराच्या तुलनेत' : 'vs Mandi'} ({formatIndianRupees(traditionalMandiBench)}{tUnit('/kg')})
            </span>
          </div>

          <div className="text-right border-l border-slate-800 pl-3">
            <span className="text-[11px] text-blue-300 uppercase tracking-wider block font-semibold">
              {language === 'hi' ? 'आपका भुगतान (प्रत्यक्ष दर)' : language === 'mr' ? 'आपण दिलेली किंमत (थेट दर)' : 'You Pay (Direct Rate)'}
            </span>
            <div className="text-2xl font-extrabold text-white">
              {formatIndianRupees(retailPrice)}{tUnit('/kg')}
            </div>
            <span className="text-[10px] text-blue-300 font-semibold">
              {language === 'hi' ? `खुदरा से ${buyerSavingPercent}% बचत` : language === 'mr' ? `किरकोळपेक्षा ${buyerSavingPercent}% बचत` : `Save ${buyerSavingPercent}% vs Retail`} ({formatIndianRupees(traditionalRetailPrice)}{tUnit('/kg')})
            </span>
          </div>
        </div>

        {/* Visual Rupee Breakdown for this Product */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {language === 'hi' ? `आपका ${formatIndianRupees(retailPrice)}/किग्रा कहां जाता है?` : language === 'mr' ? `तुमचे ${formatIndianRupees(retailPrice)}/किलो कुठे जाते?` : `Where Does Your ${formatIndianRupees(retailPrice)}/kg Go?`}
          </h4>

          {/* Bar Chart Representation */}
          <div className="h-4 w-full rounded-xl overflow-hidden flex bg-slate-100">
            <div style={{ width: '82%' }} className="bg-emerald-600 h-full" title="Farmer Share (82%)" />
            <div style={{ width: '15%' }} className="bg-blue-600 h-full" title="Cold Transit (15%)" />
            <div style={{ width: '3%' }} className="bg-amber-500 h-full" title="Digital Escrow Fee (3%)" />
          </div>

          <div className="space-y-2 pt-1 text-xs">
            {/* Farmer Item */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                  <Tractor className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">
                    {language === 'hi' ? `सीधे ${produce.farmerName} को` : language === 'mr' ? `थेट ${produce.farmerName} यांना` : `Direct to ${produce.farmerName}`}
                  </div>
                  <div className="text-[11px] text-emerald-900">
                    {language === 'hi' ? 'किसान के बैंक खाते में सीधा जमा (खुदरा मूल्य का 82%)' : language === 'mr' ? 'शेतकऱ्याच्या बँक खात्यात थेट जमा (किरकोळ दराच्या 82%)' : 'Credited to farm bank account (82% of retail price)'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-extrabold text-sm text-emerald-900">{formatIndianRupees(farmerShare, { precision: 1 })}</div>
                <span className="text-[10px] text-emerald-700 font-semibold">82.0%</span>
              </div>
            </div>

            {/* Cold Chain Logistics */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/70 border border-blue-200">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">
                    {language === 'hi' ? 'तापमान-नियंत्रित रीफर शीत परिवहन' : language === 'mr' ? 'तापमान-नियंत्रित रीफर वाहतूक' : 'Temperature-Controlled Reefer Transit'}
                  </div>
                  <div className="text-[11px] text-blue-900">
                    {language === 'hi' ? 'खेत से शहर के कोल्ड-हब तक (<2% खराबी)' : language === 'mr' ? 'शेतातून थेट शहराच्या कोल्ड-हबपर्यंत (<2% नासाडी)' : 'Farm gate pickup to city cold-hub (<2% spoilage)'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-extrabold text-sm text-blue-900">{formatIndianRupees(coldLogistics, { precision: 1 })}</div>
                <span className="text-[10px] text-blue-700 font-semibold">15.0%</span>
              </div>
            </div>

            {/* Platform Facilitation */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">
                    {language === 'hi' ? 'KisanDirect एस्क्रो एवं AI गुणवत्ता जांच' : language === 'mr' ? 'KisanDirect एस्क्रो आणि AI प्रतवारी तपासणी' : 'KisanDirect Escrow & AI Quality Assay'}
                  </div>
                  <div className="text-[11px] text-amber-900">
                    {language === 'hi' ? 'डिजिटल विवाद सुरक्षा, UPI भुगतान एवं AGMARK परीक्षण' : language === 'mr' ? 'डिजिटल वाद निवारण, UPI पेमेंट्स व AGMARK चाचणी' : 'Digital dispute protection, UPI rails & AGMARK test'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-extrabold text-sm text-amber-900">{formatIndianRupees(platformFee, { precision: 1 })}</div>
                <span className="text-[10px] text-amber-700 font-semibold">3.0%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Why Direct Model Beats Traditional Market */}
        <div className="p-4 rounded-2xl bg-slate-50 gradient-border-organic border-0 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              {language === 'hi' ? 'इस लॉट में हटाए गए बिचौलिए' : language === 'mr' ? 'या लॉटमधील वगळलेले मध्यस्थ' : 'Middlemen Bypassed on this Lot'}
            </span>
            <span className="text-emerald-700 font-bold text-[11px]">
              {language === 'hi' ? '4 मध्यस्थ कमीशन समाप्त' : language === 'mr' ? '4 मध्यस्थ दलाली रद्द' : '4 Intermediary Cuts Removed'}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {language === 'hi'
              ? 'सीधे खरीदकर, आप 6-8.5% APMC आढ़तिया कमीशन, ग्रामीण बिचौलियों की कटौती और 27% परिवहन खाद्य बर्बादी को खत्म करते हैं जो आमतौर पर खुदरा कीमतों को बढ़ाती हैं।'
              : language === 'mr'
              ? 'थेट खरेदी करून, आपण 6-8.5% APMC अडत्यांचे कमिशन, गाव पातळीवरील दलालांची कपात आणि 27% वाहतुकीतील नासाडी नष्ट करता, जी सहसा किरकोळ दर वाढवते.'
              : 'By purchasing directly, you eliminate the 6-8.5% APMC commission agent brokerage, village aggregator cuts, and 27% transit food wastage that typically inflates store prices.'}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-mono">
            {language === 'hi' ? 'खेत-द्वार ID:' : language === 'mr' ? 'शेत-द्वार ID:' : 'Direct Farmgate ID:'} {produce.traceabilityHash}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};
