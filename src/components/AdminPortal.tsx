import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ReferenceLine
} from 'recharts';
import { 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  BarChart3, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import { DemandForecast, Language, ProduceListing } from '../types';
import { SmartMatchingAdmin } from './SmartMatchingAdmin';
import { Sliders, Database, Server, RefreshCw } from 'lucide-react';
import { getForecast } from '../data/forecastData';
import { api, DatabaseStatus } from '../services/api';

interface AdminPortalProps {
  currentLanguage?: Language;
  onInspectTraceability?: (produce: ProduceListing) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = () => {
  const [adminTab, setAdminTab] = useState<'apmc' | 'smart_matching' | 'database'>('apmc');
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [selectedRegion, setSelectedRegion] = useState('Nashik / Western India');
  const [customForecasts, setCustomForecasts] = useState<Record<string, DemandForecast>>({});
  const [isLoadingForecast, setIsLoadingForecast] = useState(false);
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
  const [isCheckingDb, setIsCheckingDb] = useState(false);

  // Check Database on mount and allow manual refresh
  const checkDatabase = async () => {
    setIsCheckingDb(true);
    try {
      const res = await api.getDbStatus();
      setDbStatus(res.database);
    } catch {
      // ignore
    } finally {
      setIsCheckingDb(false);
    }
  };

  React.useEffect(() => {
    checkDatabase();
  }, []);

  // Directly derive the active forecast data from the selected crop and location
  const currentForecastKey = `${selectedCrop}_${selectedRegion}`;
  const forecastData = customForecasts[currentForecastKey] || getForecast(selectedCrop, selectedRegion);

  const handleFetchForecast = async () => {
    setIsLoadingForecast(true);
    try {
      const res = await fetch('/api/gemini/price-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop: selectedCrop, region: selectedRegion }),
      });
      const json = await res.json();
      if (json && json.data) {
        setCustomForecasts((prev) => ({
          ...prev,
          [`${selectedCrop}_${selectedRegion}`]: json.data,
        }));
      } else {
        const fallback = getForecast(selectedCrop, selectedRegion);
        setCustomForecasts((prev) => ({
          ...prev,
          [`${selectedCrop}_${selectedRegion}`]: fallback,
        }));
      }
    } catch (err) {
      console.error('Error fetching price forecast:', err);
      const fallback = getForecast(selectedCrop, selectedRegion);
      setCustomForecasts((prev) => ({
        ...prev,
        [`${selectedCrop}_${selectedRegion}`]: fallback,
      }));
    } finally {
      setIsLoadingForecast(false);
    }
  };

  const mandiArrivals = [
    { crop: 'Nashik Red Onion', arrivalsMT: 850, modalPrice: 36, change: +3.0, status: 'Surplus Supply' },
    { crop: 'Kolar Roma Tomato', arrivalsMT: 420, modalPrice: 28, change: +2.5, status: 'High Demand' },
    { crop: 'Agra Kufri Potato', arrivalsMT: 610, modalPrice: 22, change: -1.0, status: 'Stable' },
    { crop: 'Punjab Basmati Paddy', arrivalsMT: 1200, modalPrice: 84, change: +4.0, status: 'Export Surge' },
    { crop: 'Sehore Sharbati Wheat', arrivalsMT: 950, modalPrice: 32, change: +1.2, status: 'MSP Supported' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-700/80 border border-emerald-400/40 flex items-center justify-center text-white shrink-0">
            <ShieldCheck className="w-8 h-8 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-display font-extrabold text-white">
                Mandi Administration & Price Intelligence
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                APMC Oversight
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 mt-1">
              Real-time APMC arrivals, market price equilibrium indices, and AI-driven 7-day commodity forecasts.
            </p>
          </div>
        </div>

        <div className="bg-white/10 px-4 py-2 rounded-2xl text-xs font-semibold backdrop-blur-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Gemini Agricultural Forecasting Model</span>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setAdminTab('apmc')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            adminTab === 'apmc'
              ? 'bg-emerald-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>APMC Market Oversight & AI Forecasts</span>
        </button>

        <button
          onClick={() => setAdminTab('smart_matching')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            adminTab === 'smart_matching'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
          }`}
        >
          <Sliders className="w-4 h-4 text-amber-500" />
          <span>Smart Matching Engine Calibration & Analytics 🤖</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
            Weights & Radius
          </span>
        </button>

        <button
          onClick={() => setAdminTab('database')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            adminTab === 'database'
              ? 'bg-emerald-950 text-white shadow-sm'
              : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-400" />
          <span>MongoDB Atlas Cluster Health</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            dbStatus?.connected ? 'bg-emerald-400 text-emerald-950' : 'bg-amber-400 text-slate-950'
          }`}>
            {dbStatus?.connected ? 'Active Atlas' : 'In-Memory/Fallback'}
          </span>
        </button>
      </div>

      {adminTab === 'database' ? (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">MongoDB Atlas Cluster State</h2>
                  <p className="text-xs text-slate-500">Persistent storage engine powering KisanDirect produce, transactions, and logistics.</p>
                </div>
              </div>
              <button
                onClick={checkDatabase}
                disabled={isCheckingDb}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingDb ? 'animate-spin' : ''}`} />
                <span>Refresh Status</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Storage Engine</div>
                <div className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-emerald-600" />
                  <span>MongoDB Atlas Driver</span>
                </div>
                <div className="text-xs text-slate-500">Database: {dbStatus?.databaseName || 'KisanDirect'}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Connection Mode</div>
                <div className="text-base font-extrabold text-slate-900">
                  {dbStatus?.connected ? (
                    <span className="text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Live MongoDB Atlas
                    </span>
                  ) : (
                    <span className="text-amber-700 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" /> In-Memory Buffer
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500">
                  {dbStatus?.configured ? 'URI Configured in Environment' : 'Awaiting MONGODB_URI setting'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Collections Active</div>
                <div className="text-base font-extrabold text-slate-900">8 Persistent Tables</div>
                <div className="text-xs text-slate-500">users, crops, orders, trucks, etc.</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Transportation Pricing</div>
                <div className="text-base font-extrabold text-emerald-700">₹25/km Base + Svc Chg</div>
                <div className="text-xs text-slate-500">KisanDirect Trucks Engine v2.0</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Architecture Guarantee</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                All produce listings, truck dispatches, buyer purchase orders, and farmer profiles are fully backed by the Express server layer connected to MongoDB Atlas. Even when operating offline or during database initialization, all data operations are safely buffered in the transactional fallback layer so no user interactions fail.
              </p>
            </div>
          </div>
        </div>
      ) : adminTab === 'smart_matching' ? (
        <div className="space-y-6 animate-in fade-in">
          <SmartMatchingAdmin />
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in">
          {/* AI Price Forecast Card */}
          <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>AI Commodity Price & Supply-Demand Forecasting</span>
            </h2>
            <p className="text-xs text-slate-500">
              Predict modal price movements, weather impact risks, and optimal farmer dispatch windows.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              id="forecast-crop-select"
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600 font-semibold text-slate-800 cursor-pointer"
            >
              <option value="Tomato">Tomato</option>
              <option value="Onion">Onion</option>
              <option value="Wheat">Wheat</option>
              <option value="Apple">Apple</option>
              <option value="Potato">Potato</option>
              <option value="Basmati Rice">Basmati Rice</option>
              <option value="Mango">Mango</option>
            </select>

            <select
              id="forecast-region-select"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600 font-semibold text-slate-800 cursor-pointer"
            >
              <option value="Nashik / Western India">Nashik / Western India</option>
              <option value="Delhi-NCR">Delhi-NCR</option>
              <option value="Kolar">Kolar</option>
              <option value="Punjab">Punjab</option>
            </select>

            <button
              id="forecast-update-btn"
              onClick={handleFetchForecast}
              disabled={isLoadingForecast}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
            >
              {isLoadingForecast ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Forecasting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Update Forecast</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Updated Forecast Output Stats */}
        {forecastData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 gradient-border-organic border-0 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">Current Market Price</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">₹{forecastData.currentMandiPrice}/kg</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">{forecastData.crop} in {forecastData.region}</div>
                </div>
                <div className="mt-3 text-[11px] font-bold text-slate-700">
                  Trend: {forecastData.demandTrend === 'Rising' ? '📈 Rising' : forecastData.demandTrend === 'Falling' ? '📉 Falling' : forecastData.demandTrend === 'Stable' ? '➡️ Stable' : '⚠️ Volatile'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between col-span-1 md:col-span-2">
                <div>
                   <div className="text-[10px] text-emerald-800 font-semibold uppercase mb-2">Price Forecast (INR/kg)</div>
                   <div className="grid grid-cols-3 gap-2 text-center">
                     <div className="bg-white/60 rounded-xl p-2 border border-emerald-100">
                       <div className="text-[10px] font-bold text-slate-500">TOMORROW</div>
                       <div className="text-lg font-extrabold text-emerald-900">₹{forecastData.projectedPriceTomorrow || forecastData.currentMandiPrice}</div>
                     </div>
                     <div className="bg-white/60 rounded-xl p-2 border border-emerald-100">
                       <div className="text-[10px] font-bold text-slate-500">3-DAY</div>
                       <div className="text-lg font-extrabold text-emerald-900">₹{forecastData.projectedPrice3Days || forecastData.currentMandiPrice}</div>
                     </div>
                     <div className="bg-white/60 rounded-xl p-2 border border-emerald-100">
                       <div className="text-[10px] font-bold text-slate-500">7-DAY</div>
                       <div className="text-lg font-extrabold text-emerald-900">₹{forecastData.projectedPrice7Days}</div>
                     </div>
                   </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-teal-800 font-semibold uppercase">Weather & Confidence</div>
                  <div className="text-sm font-extrabold text-teal-900 mt-1 line-clamp-2">{forecastData.weatherImpactFactor}</div>
                </div>
                <div className="text-[11px] text-teal-700 font-semibold mt-2 bg-teal-100/50 px-2 py-1 rounded-lg inline-block self-start">
                  Confidence: {forecastData.forecastAccuracyPct}
                </div>
              </div>
            </div>

            {/* 7-Day Interactive Graph */}
            {forecastData.forecastData && forecastData.forecastData.length > 0 && (
              <div className="bg-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <TrendingUp className="w-48 h-48" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-slate-100 font-bold flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-400" />
                        1-7 Day Price Forecast
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Predicted prices for {forecastData.crop} in {forecastData.region}</p>
                    </div>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={forecastData.forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                        <XAxis 
                          dataKey="day" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94a3b8', fontSize: 12 }} 
                          dy={10} 
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94a3b8', fontSize: 12 }} 
                          tickFormatter={(val) => `₹${val}`} 
                          domain={['auto', 'auto']}
                        />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-slate-800 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs">
                                  <div className="font-bold text-slate-300 mb-1 border-b border-slate-700 pb-1 flex justify-between">
                                    <span>{label}</span>
                                    <span className="text-emerald-400 ml-3">AI Forecast</span>
                                  </div>
                                  <div className="text-slate-400 mb-1">{forecastData.crop} • {forecastData.region}</div>
                                  <div className="font-extrabold text-emerald-400 text-lg">₹{Number(payload[0].value).toFixed(2)}/kg</div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="price" 
                          stroke="#34d399" 
                          fillOpacity={1} 
                          fill="url(#colorForecast)" 
                          strokeWidth={3}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke="#34d399" 
                          strokeWidth={3} 
                          dot={{ fill: '#0f172a', stroke: '#34d399', strokeWidth: 2, r: 4 }}
                          activeDot={{ fill: '#34d399', stroke: '#fff', strokeWidth: 2, r: 6 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Advisory Box */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                forecastData.keyAdvice.toLowerCase().includes('sell') 
                  ? 'bg-rose-50/80 border-rose-200 text-rose-950' 
                  : forecastData.keyAdvice.toLowerCase().includes('wait') || forecastData.demandTrend === 'Rising'
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50/80 border-amber-200 text-amber-950'
              }`}>
                <div className={`p-2 rounded-xl shrink-0 ${
                   forecastData.keyAdvice.toLowerCase().includes('sell') ? 'bg-rose-100 text-rose-600' : 
                   forecastData.keyAdvice.toLowerCase().includes('wait') || forecastData.demandTrend === 'Rising' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold uppercase tracking-wider text-[10px] opacity-70">Strategic Market Advisory:</span>
                  <p className="text-sm font-semibold mt-0.5 leading-relaxed">{forecastData.keyAdvice}</p>
                </div>
              </div>

              {/* Sources */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 flex items-center gap-1.5">
                  <Search className="w-3 h-3" />
                  Forecast Data Sources
                </span>
                <ul className="mt-2 space-y-1">
                  {forecastData.sources && forecastData.sources.length > 0 ? (
                    forecastData.sources.map((src, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                        <span className="line-clamp-1">{src}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-slate-500 italic">No specific sources identified.</li>
                  )}
                </ul>
                <div className="text-[10px] text-slate-400 mt-2 font-medium">
                  Last updated: {new Date().toLocaleString()}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Option A: Platform Monetization & Revenue Analytics */}
      <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
                Revenue Engine Live
              </span>
              <span className="text-xs font-bold text-slate-500">Option A Model: 2.0% Buyer Take-Rate</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-700" />
              <span>Platform Monetization & Commission Health</span>
            </h2>
            <p className="text-xs text-slate-500">
              Tracking monthly platform commission generated from buyer checkout fees while maintaining 0% deductions on farmer payouts.
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500 font-semibold">Monthly Platform Commission (2%)</div>
            <div className="text-2xl font-extrabold text-emerald-800 font-mono">₹2,85,600</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 gradient-border-organic border-0">
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Monthly GMV Traded</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">₹1.42 Cr</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">3,450 MT Produce Handled</div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="text-[10px] text-emerald-800 font-semibold uppercase">Farmer Commission Deducted</div>
            <div className="text-2xl font-extrabold text-emerald-800 mt-1">₹0.00 (0%)</div>
            <div className="text-[11px] text-emerald-700 mt-0.5">100% Farm-Gate Payout Rate</div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
            <div className="text-[10px] text-teal-800 font-semibold uppercase">Buyer Facilitation Fee</div>
            <div className="text-2xl font-extrabold text-teal-900 mt-1">2.0%</div>
            <div className="text-[11px] text-teal-700 mt-0.5">₹2,85,600 Collected this Month</div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <div className="text-[10px] text-amber-800 font-semibold uppercase">Farmer Wealth Retained</div>
            <div className="text-2xl font-extrabold text-amber-900 mt-1">+₹11.4 Lakhs</div>
            <div className="text-[11px] text-amber-700 mt-0.5">Saved from traditional APMC cuts</div>
          </div>
        </div>

        {/* Revenue Allocation Bars */}
        <div className="p-4 rounded-2xl bg-slate-50 gradient-border-organic border-0 text-xs space-y-3">
          <div className="font-bold text-slate-800 flex justify-between">
            <span>Commission Utilization & Operating Margin</span>
            <span className="text-emerald-700">Healthy 45% Net Contribution Margin</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
            <div className="p-2.5 rounded-xl bg-white gradient-border-organic border-0">
              <div className="text-slate-500 font-semibold">AI Quality & Lab Assaying</div>
              <div className="font-bold text-slate-800 mt-0.5">40% of 2% Fee (₹1.14L)</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white gradient-border-organic border-0">
              <div className="text-slate-500 font-semibold">Escrow & Instant UPI Banking</div>
              <div className="font-bold text-slate-800 mt-0.5">35% of 2% Fee (₹1.00L)</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white gradient-border-organic border-0">
              <div className="text-slate-500 font-semibold">Platform Profit & Expansion</div>
              <div className="font-bold text-emerald-800 mt-0.5">25% of 2% Fee (₹71.4K)</div>
            </div>
          </div>
        </div>
      </div>

      {/* APMC Arrivals Table */}
      <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-6 sm:p-8 shadow-2xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          Daily Mandi Arrivals & Price Index
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-3 px-3">Commodity</th>
                <th className="py-3 px-3">Arrivals (MT)</th>
                <th className="py-3 px-3">Modal Price</th>
                <th className="py-3 px-3">Price Trend</th>
                <th className="py-3 px-3">Market Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mandiArrivals.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-slate-900">{row.crop}</td>
                  <td className="py-3.5 px-3 font-semibold text-slate-700">{row.arrivalsMT} MT</td>
                  <td className="py-3.5 px-3 font-extrabold text-slate-900">₹{row.modalPrice}/kg</td>
                  <td className="py-3.5 px-3">
                    <span className={`flex items-center gap-1 font-bold ${
                      row.change >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {row.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {row.change >= 0 ? `+₹${row.change}` : `-₹${Math.abs(row.change)}`}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )}
</div>
  );
};
