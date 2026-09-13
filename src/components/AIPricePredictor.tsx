import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  MapPin, 
  Search,
  BrainCircuit,
  AlertTriangle,
  Bell,
  Activity,
  Calculator,
  ChevronRight,
  Info,
  Loader2,
  RefreshCw,
  Globe
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { MOCK_PRODUCE_LISTINGS } from '../data/mockData';
import { usePriceAlerts } from '../context/PriceAlertContext';
import { useLanguage } from '../context/LanguageContext';

type CropType = 'Tomato' | 'Potato' | 'Onion' | 'Wheat' | 'Rice' | 'Maize' | 'Mustard' | 'Basmati Rice' | 'Other';
type Trend = 'UP' | 'DOWN' | 'STABLE';
type Recommendation = 'WAIT' | 'SELL NOW' | 'MONITOR';

interface PredictionData {
  crop: CropType;
  basePrice: number;
  trend: Trend;
  prediction7: number;
  prediction15: number;
  prediction30: number;
  confidence: 'High' | 'Medium' | 'Low' | 'Limited';
  factors: { positive: string[]; negative: string[] };
  historicalData: { day: string; price: number }[];
  isDemo?: boolean;
  sources?: string[];
  retrievedAt?: string;
}

const generateMockPrediction = (crop: CropType, state: string, district: string): PredictionData => {
  const seed = crop.length + state.length + district.length;
  let basePrice = 20;
  let trend: Trend = 'STABLE';
  
  switch(crop) {
    case 'Tomato': basePrice = 22; trend = 'UP'; break;
    case 'Potato': basePrice = 18; trend = 'UP'; break;
    case 'Onion': basePrice = 35; trend = 'DOWN'; break;
    case 'Wheat': basePrice = 28; trend = 'STABLE'; break;
    case 'Rice': basePrice = 45; trend = 'UP'; break;
    case 'Basmati Rice': basePrice = 90; trend = 'UP'; break;
    case 'Maize': basePrice = 24; trend = 'STABLE'; break;
    case 'Mustard': basePrice = 55; trend = 'DOWN'; break;
    default: basePrice = 25 + (seed % 10); trend = seed % 2 === 0 ? 'UP' : 'DOWN';
  }

  basePrice += (seed % 5);
  if (state === 'Maharashtra') basePrice *= 1.1;
  if (state === 'Punjab') basePrice *= 0.9;
  
  let p7, p15, p30;
  if (trend === 'UP') {
    p7 = basePrice * 1.05; p15 = basePrice * 1.12; p30 = basePrice * 1.18;
  } else if (trend === 'DOWN') {
    p7 = basePrice * 0.96; p15 = basePrice * 0.89; p30 = basePrice * 0.82;
  } else {
    p7 = basePrice * 1.01; p15 = basePrice * 0.98; p30 = basePrice * 1.02;
  }

  const history = [];
  let currentHistPrice = basePrice * (trend === 'UP' ? 0.9 : (trend === 'DOWN' ? 1.1 : 1.0));
  for (let i = 7; i > 0; i--) {
    history.push({ day: `-${i}d`, price: parseFloat(currentHistPrice.toFixed(2)), isPrediction: false });
    currentHistPrice += (basePrice - currentHistPrice) / i; 
  }
  history.push({ day: 'Today', price: parseFloat(basePrice.toFixed(2)), isPrediction: false });
  history.push({ day: '+7d', price: parseFloat(p7.toFixed(2)), isPrediction: true });
  history.push({ day: '+15d', price: parseFloat(p15.toFixed(2)), isPrediction: true });
  history.push({ day: '+30d', price: parseFloat(p30.toFixed(2)), isPrediction: true });

  return {
    crop,
    basePrice,
    trend,
    prediction7: parseFloat(p7.toFixed(2)),
    prediction15: parseFloat(p15.toFixed(2)),
    prediction30: parseFloat(p30.toFixed(2)),
    confidence: 'Limited',
    historicalData: history,
    isDemo: true,
    sources: ['Mock Dataset (Demo)'],
    retrievedAt: new Date().toLocaleDateString(),
    factors: {
      positive: trend === 'UP' ? ['Expected supply shortage', 'Favorable weather'] : ['Stable local consumption'],
      negative: trend === 'DOWN' ? ['High harvest volumes', 'Surplus from nearby districts'] : ['Slight oversupply']
    }
  };
};

export const AIPricePredictor: React.FC = () => {
  const { openCreateAlertModal } = usePriceAlerts();
  const { language, tCrop, tUnit, tLocation } = useLanguage();
  
  const [crop, setCrop] = useState<CropType>('Tomato');
  const [state, setState] = useState('Maharashtra');
  const [district, setDistrict] = useState('Pune');
  const [quantityStr, setQuantityStr] = useState('500');

  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const quantity = parseFloat(quantityStr) || 0;

  // Initialize with demo data
  useEffect(() => {
    if (!prediction) {
      setPrediction(generateMockPrediction(crop, state, district));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpdateForecast = async () => {
    setIsLoading(true);
    setApiError('');
    try {
      const res = await fetch('/api/gemini/price-predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop, state, district })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch live data');
      }

      // Convert API response into PredictionData format
      const basePrice = data.basePrice || 20;
      const trend = data.trend || 'STABLE';
      const history = [];
      let currentHistPrice = basePrice * (trend === 'UP' ? 0.9 : (trend === 'DOWN' ? 1.1 : 1.0));
      for (let i = 7; i > 0; i--) {
        history.push({ day: `-${i}d`, price: parseFloat(currentHistPrice.toFixed(2)), isPrediction: false });
        currentHistPrice += (basePrice - currentHistPrice) / i; 
      }
      history.push({ day: 'Today', price: parseFloat(basePrice.toFixed(2)), isPrediction: false });
      history.push({ day: '+7d', price: parseFloat((data.prediction7 || basePrice).toFixed(2)), isPrediction: true });
      history.push({ day: '+15d', price: parseFloat((data.prediction15 || basePrice).toFixed(2)), isPrediction: true });
      history.push({ day: '+30d', price: parseFloat((data.prediction30 || basePrice).toFixed(2)), isPrediction: true });

      setPrediction({
        crop,
        basePrice,
        trend,
        prediction7: data.prediction7,
        prediction15: data.prediction15,
        prediction30: data.prediction30,
        confidence: data.confidence || 'Medium',
        factors: data.factors || { positive: [], negative: [] },
        historicalData: history,
        isDemo: false,
        sources: data.sources || ['Google Search'],
        retrievedAt: data.retrievedAt || new Date().toLocaleString()
      });
    } catch (err: any) {
      console.error(err);
      setApiError(
        language === 'hi'
          ? 'लाइव बाज़ार डेटा प्राप्त नहीं किया जा सका। डेमो डेटा प्रदर्शित किया जा रहा है।'
          : language === 'mr'
          ? 'थेट बाजार डेटा प्राप्त करता आला नाही. डेमो डेटा दर्शविला जात आहे.'
          : 'Live market data could not be retrieved. Displaying demo fallback.'
      );
      setPrediction(generateMockPrediction(crop, state, district));
    } finally {
      setIsLoading(false);
    }
  };

  if (!prediction) return null;

  const rec: Recommendation = prediction.trend === 'UP' ? 'WAIT' : (prediction.trend === 'DOWN' ? 'SELL NOW' : 'MONITOR');
  const revSellNow = prediction.basePrice * quantity;
  const rev15Days = prediction.prediction15 * quantity;
  const revDiff = rev15Days - revSellNow;

  // Integrate with existing buyers (mock reading)
  const relevant = MOCK_PRODUCE_LISTINGS.filter(p => p.cropName.toLowerCase() === crop.toLowerCase());
  const bestBuyer = relevant.length > 0 
    ? Math.max(...relevant.map(r => r.pricePerKg))
    : prediction.basePrice * 1.02; 

  const getRecommendationLabel = (r: Recommendation) => {
    if (r === 'WAIT') return language === 'hi' ? 'रुकें / प्रतीक्षा करें' : language === 'mr' ? 'थांबा / वाट पहा' : 'WAIT';
    if (r === 'SELL NOW') return language === 'hi' ? 'अभी बेचें' : language === 'mr' ? 'आता विका' : 'SELL NOW';
    return language === 'hi' ? 'निगरानी रखें' : language === 'mr' ? 'लक्ष ठेवा' : 'MONITOR';
  };

  const getConfidenceLabel = (c: string) => {
    if (c === 'High') return language === 'hi' ? 'उच्च' : language === 'mr' ? 'उच्च' : 'High';
    if (c === 'Medium') return language === 'hi' ? 'मध्यम' : language === 'mr' ? 'मध्यम' : 'Medium';
    if (c === 'Low') return language === 'hi' ? 'निम्न' : language === 'mr' ? 'कमी' : 'Low';
    return language === 'hi' ? 'सीमित' : language === 'mr' ? 'मर्यादित' : 'Limited';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-emerald-900 rounded-2xl p-6 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BrainCircuit className="w-48 h-48" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-800 rounded-lg">
              <Activity className="w-5 h-5 text-emerald-300" />
            </div>
            <h2 className="text-2xl font-display font-bold">
              {language === 'hi' ? 'AI स्मार्ट फसल मूल्य भविष्यवक्ता' : language === 'mr' ? 'AI स्मार्ट पीक किंमत अंदाज' : 'AI Smart Crop Price Predictor'}
            </h2>
          </div>
          <p className="text-emerald-100/80 mb-6">
            {language === 'hi'
              ? 'महत्वपूर्ण प्रश्न का उत्तर: "क्या मुझे अभी बेचना चाहिए या इंतज़ार करना चाहिए?" हमारा AI ऐतिहासिक रुझानों, आपूर्ति-मांग असंतुलन और बाज़ार स्थितियों का विश्लेषण करके भविष्य के मूल्यों का सटीक अनुमान लगाता है।'
              : language === 'mr'
              ? 'महत्त्वाच्या प्रश्नाचे उत्तर: "मी आता विकावे की थांबावे?" आमचे AI ऐतिहासिक ट्रेंड, पुरवठा-मागणी तफावत आणि बाजार परिस्थितीचे विश्लेषण करून भविष्यातील भावाचा अचूक अंदाज बांधते.'
              : 'Answer the critical question: "Should I sell now or wait?" Our AI analyzes web-grounded historical trends, supply-demand imbalances, and market conditions to estimate future crop prices.'}
          </p>
          <div className="flex flex-col gap-2 items-start">
            <div className="flex items-center gap-2 text-xs font-medium bg-amber-500/20 text-amber-300 px-3 py-2 rounded-lg inline-flex">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                {language === 'hi'
                  ? 'मूल्य पूर्वानुमान प्राप्त आंकड़ों पर आधारित अनुमान हैं। वास्तविक बाज़ार मूल्य भिन्न हो सकते हैं।'
                  : language === 'mr'
                  ? 'किंमत अंदाज प्राप्त डेटावर आधारित आहेत. प्रत्यक्ष बाजार भाव बदलू शकतात.'
                  : 'Price predictions are estimates based on retrieved data. Actual market prices may vary.'}
              </span>
            </div>
            {apiError && (
              <div className="flex items-center gap-2 text-xs font-medium bg-red-500/20 text-red-300 px-3 py-2 rounded-lg inline-flex">
                <Globe className="w-4 h-4 shrink-0" />
                <span>{apiError}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN - CONTROLS */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-600" />
              {language === 'hi' ? 'फसल विश्लेषण' : language === 'mr' ? 'पीक विश्लेषण' : 'Analyze Crop'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {language === 'hi' ? 'फसल' : language === 'mr' ? 'पीक' : 'Crop'}
                </label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                  value={crop}
                  onChange={(e) => setCrop(e.target.value as CropType)}
                >
                  {['Tomato', 'Potato', 'Onion', 'Wheat', 'Rice', 'Basmati Rice', 'Maize', 'Mustard', 'Other'].map(c => (
                    <option key={c} value={c}>{tCrop(c)}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    {language === 'hi' ? 'राज्य' : language === 'mr' ? 'राज्य' : 'State'}
                  </label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  >
                    <option value="Maharashtra">{language === 'hi' ? 'महाराष्ट्र' : language === 'mr' ? 'महाराष्ट्र' : 'Maharashtra'}</option>
                    <option value="Punjab">{language === 'hi' ? 'पंजाब' : language === 'mr' ? 'पंजाब' : 'Punjab'}</option>
                    <option value="Haryana">{language === 'hi' ? 'हरियाणा' : language === 'mr' ? 'हरियाणा' : 'Haryana'}</option>
                    <option value="Uttar Pradesh">{language === 'hi' ? 'उत्तर प्रदेश' : language === 'mr' ? 'उत्तर प्रदेश' : 'Uttar Pradesh'}</option>
                    <option value="Delhi NCR">{language === 'hi' ? 'दिल्ली एनसीआर' : language === 'mr' ? 'दिल्ली एनसीआर' : 'Delhi NCR'}</option>
                    <option value="Gujarat">{language === 'hi' ? 'गुजरात' : language === 'mr' ? 'गुजरात' : 'Gujarat'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    {language === 'hi' ? 'ज़िला / मंडी' : language === 'mr' ? 'जिल्हा / बाजार' : 'District/Mandi'}
                  </label>
                  <input 
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder={language === 'hi' ? 'उदा. पुणे' : language === 'mr' ? 'उदा. पुणे' : 'e.g. Pune'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {language === 'hi' ? `अपेक्षित मात्रा (${tUnit('kg')})` : language === 'mr' ? `अपेक्षित प्रमाण (${tUnit('kg')})` : 'Expected Quantity (kg)'}
                </label>
                <input 
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={quantityStr}
                  onChange={(e) => setQuantityStr(e.target.value)}
                />
              </div>

              <button 
                onClick={handleUpdateForecast}
                disabled={isLoading}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {isLoading 
                  ? (language === 'hi' ? 'गूगल द्वारा पुष्टि जारी...' : language === 'mr' ? 'गुगलद्वारे पडताळणी चालू...' : 'Grounding via Google...') 
                  : (language === 'hi' ? 'पूर्वानुमान अपडेट करें' : language === 'mr' ? 'किंमत अंदाज अपडेट करा' : 'Update Grounded Forecast')}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-emerald-600" />
              {language === 'hi' ? 'AI सिफ़ारिश' : language === 'mr' ? 'AI शिफारस' : 'AI Recommendation'}
            </h3>
            
            <div className={`p-4 rounded-xl border-2 mb-4 text-center ${
              rec === 'WAIT' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 
              rec === 'SELL NOW' ? 'bg-red-50 border-red-500 text-red-700' : 
              'bg-amber-50 border-amber-500 text-amber-700'
            }`}>
              <div className="text-sm font-bold mb-1 uppercase tracking-wider">
                {language === 'hi' ? 'सिफ़ारिश' : language === 'mr' ? 'शिफारस' : 'RECOMMENDATION'}
              </div>
              <div className="text-3xl font-display font-black tracking-tight">{getRecommendationLabel(rec)}</div>
              <div className="text-xs mt-2 font-medium opacity-80">
                {rec === 'WAIT' ? (language === 'hi' ? 'अगले 15 दिनों में मूल्य वृद्धि का अनुमान।' : language === 'mr' ? 'पुढील 15 दिवसांत किंमत वाढण्याचा अंदाज.' : 'Estimated price increase over next 15 days.') : 
                 rec === 'SELL NOW' ? (language === 'hi' ? 'मूल्य में गिरावट का रुख है। अभी बेचने से नुकसान से बचा जा सकता है।' : language === 'mr' ? 'किमती कमी होत आहेत. आता विकल्याने तोटा टळू शकतो.' : 'Prices trending downward. Selling now may prevent revenue loss.') : 
                 (language === 'hi' ? 'मूल्य स्थिर हैं। बाज़ार पर करीबी नज़र रखें।' : language === 'mr' ? 'किमती स्थिर आहेत. बाजारावर बारीक लक्ष ठेवा.' : 'Prices are stable. Monitor market closely.')}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm py-2 border-t border-slate-100">
              <span className="text-slate-500 font-medium">
                {language === 'hi' ? 'पूर्वानुमान विश्वसनीयता' : language === 'mr' ? 'अंदाज विश्वासार्हता' : 'Prediction Confidence'}
              </span>
              <span className={`font-bold flex items-center gap-1.5 ${
                prediction.confidence === 'High' ? 'text-emerald-600' :
                prediction.confidence === 'Medium' ? 'text-amber-600' : 
                prediction.confidence === 'Low' ? 'text-red-600' : 'text-slate-500'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  prediction.confidence === 'High' ? 'bg-emerald-500' :
                  prediction.confidence === 'Medium' ? 'bg-amber-500' : 
                  prediction.confidence === 'Low' ? 'bg-red-500' : 'bg-slate-400'
                }`}></div>
                {getConfidenceLabel(prediction.confidence)}
              </span>
            </div>

            {(prediction.confidence === 'Low' || prediction.confidence === 'Limited') && (
              <div className="text-[10px] text-slate-400 mt-1 italic leading-tight">
                {language === 'hi' 
                  ? 'अत्यधिक विश्वसनीय पूर्वानुमान के लिए पर्याप्त ऐतिहासिक डेटा या स्रोतों का अभाव।'
                  : language === 'mr'
                  ? 'अत्यंत विश्वासार्ह अंदाजासाठी पुरेसा ऐतिहासिक डेटा किंवा परस्परविरोधी स्रोत.'
                  : 'Insufficient historical data or conflicting sources for a highly reliable prediction.'}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - CHARTS & INSIGHTS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    {tCrop(prediction.crop)} {language === 'hi' ? 'मूल्य रुझान' : language === 'mr' ? 'किंमत ट्रेंड' : 'Price Trend'}
                  </h3>
                  {prediction.isDemo ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                      {language === 'hi' ? 'डेमो डेटा' : language === 'mr' ? 'डेमो डेटा' : 'DEMO DATA - NOT LIVE'}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {language === 'hi' ? 'AI पूर्वानुमान' : language === 'mr' ? 'AI अंदाज' : 'AI FORECAST'}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {tLocation(district)}, {tLocation(state)}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-right">
                  <div className="text-xs font-medium text-slate-500 mb-0.5">
                    {language === 'hi' ? 'वर्तमान मूल्य' : language === 'mr' ? 'चालू भाव' : 'Current Price'}
                  </div>
                  <div className="text-2xl font-bold text-slate-900 flex items-center gap-1 justify-end">
                    ₹{prediction.basePrice.toFixed(2)}
                    <span className="text-sm font-normal text-slate-500">/{tUnit('kg')}</span>
                  </div>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div className="text-right">
                  <div className="text-xs font-medium text-slate-500 mb-0.5">
                    {language === 'hi' ? '15-दिवसीय अनुमान' : language === 'mr' ? '15-दिवसांचा अंदाज' : '15-Day Estimate'}
                  </div>
                  <div className={`text-2xl font-bold flex items-center gap-1 justify-end ${
                    prediction.prediction15 > prediction.basePrice ? 'text-emerald-600' :
                    prediction.prediction15 < prediction.basePrice ? 'text-red-600' : 'text-amber-600'
                  }`}>
                    ₹{prediction.prediction15.toFixed(2)}
                    {prediction.prediction15 > prediction.basePrice ? <TrendingUp className="w-5 h-5" /> : 
                     prediction.prediction15 < prediction.basePrice ? <TrendingDown className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={prediction.historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPriceHist" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPricePred" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={prediction.trend === 'UP' ? '#10b981' : prediction.trend === 'DOWN' ? '#ef4444' : '#f59e0b'} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={prediction.trend === 'UP' ? '#10b981' : prediction.trend === 'DOWN' ? '#ef4444' : '#f59e0b'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₹${val}`} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => [`₹${value.toFixed(2)}`, language === 'hi' ? 'मूल्य' : language === 'mr' ? 'भाव' : 'Price']}
                    labelStyle={{ color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}
                  />
                  <ReferenceLine x="Today" stroke="#cbd5e1" strokeDasharray="3 3" label={{ position: 'top', value: language === 'hi' ? 'आज' : language === 'mr' ? 'आज' : 'Today', fill: '#64748b', fontSize: 10 }} />
                  
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke={prediction.trend === 'UP' ? '#10b981' : prediction.trend === 'DOWN' ? '#ef4444' : '#f59e0b'} 
                    fillOpacity={1} 
                    fill="url(#colorPricePred)" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
              <div className="text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {language === 'hi' ? '7 दिन' : language === 'mr' ? '7 दिवस' : '7 Days'}
                </div>
                <div className="text-lg font-bold text-slate-700">₹{prediction.prediction7.toFixed(2)}</div>
              </div>
              <div className="text-center border-l border-r border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {language === 'hi' ? '15 दिन' : language === 'mr' ? '15 दिवस' : '15 Days'}
                </div>
                <div className="text-lg font-bold text-slate-700">₹{prediction.prediction15.toFixed(2)}</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {language === 'hi' ? '30 दिन' : language === 'mr' ? '30 दिवस' : '30 Days'}
                </div>
                <div className="text-lg font-bold text-slate-700">₹{prediction.prediction30.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue Calculator */}
            <div className="bg-slate-900 rounded-2xl p-5 shadow-sm text-white">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                {language === 'hi' ? 'आय गणक' : language === 'mr' ? 'उत्पन्न गणक' : 'Revenue Calculator'}
              </h3>
              
              <div className="space-y-3 mb-5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">{language === 'hi' ? 'मात्रा' : language === 'mr' ? 'प्रमाण' : 'Quantity'}</span>
                  <span className="font-medium">{quantity} {tUnit('kg')}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">{language === 'hi' ? 'अभी बेचें' : language === 'mr' ? 'आता विका' : 'Sell Now'} (₹{prediction.basePrice.toFixed(2)})</span>
                  <span className="font-medium text-slate-300">₹{revSellNow.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">{language === 'hi' ? '15 दिन रुकें' : language === 'mr' ? '15 दिवस थांबा' : 'Wait 15 Days'} (₹{prediction.prediction15.toFixed(2)})</span>
                  <span className="font-medium text-white">₹{rev15Days.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-300">
                    {language === 'hi' ? 'संभावित अंतर' : language === 'mr' ? 'संभाव्य फरक' : 'Potential Difference'}
                  </span>
                  <span className={`text-xl font-bold ${revDiff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {revDiff >= 0 ? '+' : ''}₹{Math.abs(revDiff).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Market Factors & Integrations */}
            <div className="space-y-4">
              {/* Buyer Integration */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    {language === 'hi' ? 'बाज़ार एकीकरण' : language === 'mr' ? 'बाजार एकत्रीकरण' : 'Market Integration'}
                  </div>
                  <div className="text-sm font-bold text-slate-800 mb-1">
                    {language === 'hi' ? 'सर्वश्रेष्ठ वर्तमान खरीदार' : language === 'mr' ? 'सर्वोत्तम चालू खरेदीदार' : 'Best Current Buyer'}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {language === 'hi' ? 'B2B नेटवर्क प्रस्ताव:' : language === 'mr' ? 'B2B नेटवर्क ऑफर:' : 'B2B Network Offer:'} ₹{bestBuyer.toFixed(2)}/{tUnit('kg')}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold ${bestBuyer > prediction.basePrice ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {bestBuyer > prediction.basePrice 
                    ? `+₹${(bestBuyer - prediction.basePrice).toFixed(2)} ${language === 'hi' ? 'अतिरिक्त' : language === 'mr' ? 'प्रीमियम' : 'Premium'}` 
                    : (language === 'hi' ? 'बाज़ार भाव' : language === 'mr' ? 'बाजार दर' : 'Market Rate')}
                </div>
              </div>

              {/* Grounded In Section */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 shadow-sm">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Search className="w-3 h-3" /> 
                  {language === 'hi' ? 'पूर्वानुमान का आधार' : language === 'mr' ? 'अंदाजाचा आधार' : 'Forecast Grounded In'}
                </div>
                <ul className="space-y-1">
                  {prediction.sources && prediction.sources.map((src, i) => (
                    <li key={i} className="text-xs text-slate-600 font-medium line-clamp-1 flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-slate-400"></div> {src}
                    </li>
                  ))}
                </ul>
                {prediction.retrievedAt && (
                  <div className="text-[10px] text-slate-400 mt-2">
                    {language === 'hi' ? 'प्राप्ति समय:' : language === 'mr' ? 'प्राप्त वेळ:' : 'Retrieved:'} {prediction.retrievedAt}
                  </div>
                )}
              </div>

              {/* Crop Distress Integration */}
              {prediction.trend === 'DOWN' && (
                <div className="bg-red-50 rounded-2xl border border-red-100 p-4 flex items-start gap-3">
                  <div className="p-1.5 bg-red-100 rounded-lg shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-red-800 mb-0.5">
                      {language === 'hi' ? 'उच्च आपूर्ति जोखिम' : language === 'mr' ? 'जास्त पुरवठा जोखीम' : 'High Supply Risk'}
                    </div>
                    <div className="text-xs text-red-700/80 leading-relaxed">
                      {language === 'hi' 
                        ? 'आपके क्षेत्र में अनुमानित मांग से अधिक आपूर्ति की संभावना है, जिससे कीमतों पर दबाव पड़ सकता है। कीमतों को सुरक्षित करने के लिए B2B अनुबंधों पर विचार करें।'
                        : language === 'mr'
                        ? 'तुमच्या भागात अंदाजित मागणीपेक्षा जास्त पुरवठा होण्याची शक्यता आहे, ज्यामुळे किमतींवर दबाव येऊ शकतो. भाव सुरक्षित करण्यासाठी B2B करारांचा विचार करा.'
                        : 'Expected supply is higher than estimated demand in your region, putting downward pressure on prices. Consider B2B contracts to lock in prices.'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              {language === 'hi' ? 'प्रमुख बाज़ार कारक' : language === 'mr' ? 'प्रमुख बाजार घटक' : 'Key Market Factors'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-bold text-emerald-700 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> 
                  {language === 'hi' ? 'मूल्य क्यों बढ़ सकता है' : language === 'mr' ? 'किंमत का वाढू शकते' : 'Why price could increase'}
                </div>
                <ul className="space-y-1.5">
                  {prediction.factors?.positive?.map((factor, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">•</span> {factor}
                    </li>
                  )) || (
                    <li className="text-xs text-slate-400 italic">
                      {language === 'hi' ? 'कोई विशिष्ट सकारात्मक कारक नहीं मिले।' : language === 'mr' ? 'कोणतेही विशिष्ट सकारात्मक घटक आढळले नाहीत.' : 'No specific upward factors identified.'}
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <div className="text-sm font-bold text-red-700 mb-2 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" /> 
                  {language === 'hi' ? 'मूल्य क्यों घट सकता है' : language === 'mr' ? 'किंमत का कमी होऊ शकते' : 'Why price could decrease'}
                </div>
                <ul className="space-y-1.5">
                  {prediction.factors?.negative?.map((factor, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span> {factor}
                    </li>
                  )) || (
                    <li className="text-xs text-slate-400 italic">
                      {language === 'hi' ? 'कोई विशिष्ट नकारात्मक कारक नहीं मिले।' : language === 'mr' ? 'कोणतेही विशिष्ट नकारात्मक घटक आढळले नाहीत.' : 'No specific downward factors identified.'}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
