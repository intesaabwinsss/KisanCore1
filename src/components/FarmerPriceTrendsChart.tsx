import React, { useState, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Scale,
  DollarSign,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Building2,
  HelpCircle,
  BarChart3,
  Sliders,
  ChevronRight,
  Bell,
  Database,
  RefreshCw
} from 'lucide-react';
import {
  CROP_PRICE_PROFILES,
  CropPriceTrendProfile,
  HistoricalDataPoint
} from '../data/priceTrendsData';
import { usePriceAlerts } from '../context/PriceAlertContext';
import { api } from '../services/api';
import { MandiPriceRecord } from '../types';


type TimeRange = '7D' | '30D' | '3M' | '1Y';
type ChartViewMode = 'price_comparison' | 'arrivals_overlay' | 'forecast_view';

interface FarmerPriceTrendsChartProps {
  initialCropId?: string;
  onSelectCropForListing?: (cropName: string, variety: string, recommendedPrice: number) => void;
}

export const FarmerPriceTrendsChart: React.FC<FarmerPriceTrendsChartProps> = ({
  initialCropId = 'tomato',
  onSelectCropForListing,
}) => {
  const { alerts, openCreateAlertModal, setIsNotificationCenterOpen } = usePriceAlerts();

  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Vegetables' | 'Fruits' | 'Grains & Pulses'>('All');
  const [selectedCropId, setSelectedCropId] = useState<string>(initialCropId);
  const [timeRange, setTimeRange] = useState<TimeRange>('30D');
  const [viewMode, setViewMode] = useState<ChartViewMode>('price_comparison');
  const [showMspLine, setShowMspLine] = useState(true);
  const [lotQuantityKg, setLotQuantityKg] = useState<number>(3000);

  // Live Mandi State from data.gov.in
  const [liveMandiRecords, setLiveMandiRecords] = useState<MandiPriceRecord[]>([]);
  const [liveComparison, setLiveComparison] = useState<{
    averageModalPriceKg: number;
    highestMandi: MandiPriceRecord | null;
    lowestMandi: MandiPriceRecord | null;
    mandis: MandiPriceRecord[];
  }>({
    averageModalPriceKg: 0,
    highestMandi: null,
    lowestMandi: null,
    mandis: [],
  });
  const [isLoadingLiveMandi, setIsLoadingLiveMandi] = useState(false);

  // Check if an alert exists for currently selected crop
  const activeAlertForCrop = alerts.find(
    (a) => a.commodityId === selectedCropId && a.isActive
  );


  // Available crop profiles filtered by category
  const filteredProfiles = useMemo(() => {
    if (selectedCategory === 'All') return CROP_PRICE_PROFILES;
    return CROP_PRICE_PROFILES.filter((c) => c.category === selectedCategory);
  }, [selectedCategory]);

  // Current active crop profile
  const activeProfile: CropPriceTrendProfile = useMemo(() => {
    return (
      CROP_PRICE_PROFILES.find((c) => c.id === selectedCropId) ||
      CROP_PRICE_PROFILES[0]
    );
  }, [selectedCropId]);

  // Fetch real Government Mandi Prices when crop changes
  useEffect(() => {
    let isMounted = true;
    setIsLoadingLiveMandi(true);
    
    Promise.all([
      api.getMandiPrices({ commodity: activeProfile.name, limit: 10 }),
      api.getMandiComparison(activeProfile.name)
    ]).then(([priceRes, compRes]) => {
      if (isMounted) {
        if (priceRes.success && Array.isArray(priceRes.records)) {
          setLiveMandiRecords(priceRes.records);
        }
        if (compRes) {
          setLiveComparison(compRes);
        }
        setIsLoadingLiveMandi(false);
      }
    }).catch(() => {
      if (isMounted) setIsLoadingLiveMandi(false);
    });

    return () => {
      isMounted = false;
    };
  }, [activeProfile.name]);

  // Active dataset based on timeRange
  const activeData: HistoricalDataPoint[] = useMemo(() => {
    switch (timeRange) {
      case '7D':
        return activeProfile.data7D;
      case '30D':
        return activeProfile.data30D;
      case '3M':
        return activeProfile.data3M;
      case '1Y':
        return activeProfile.data1Y;
      default:
        return activeProfile.data30D;
    }
  }, [activeProfile, timeRange]);

  // Profit calculation for the farmer
  const unitFactor = activeProfile.unit.includes('qtl') ? 100 : 1;
  const kisanPerKg = activeProfile.currentKisan / unitFactor;
  const mandiPerKg = activeProfile.currentMandi / unitFactor;
  const priceDiffPerKg = Math.max(0, kisanPerKg - mandiPerKg);
  const totalExtraIncome = Math.round(priceDiffPerKg * lotQuantityKg);
  const premiumPct = Math.round(((kisanPerKg - mandiPerKg) / mandiPerKg) * 100);

  // Calculate chart min & max bounds for clean rendering
  const minPrice = useMemo(() => {
    const minMandi = Math.min(...activeData.map((d) => d.mandiPrice));
    const floor = Math.min(minMandi, activeProfile.mspFloor || minMandi);
    return Math.floor(floor * 0.85);
  }, [activeData, activeProfile.mspFloor]);

  const maxPrice = useMemo(() => {
    const maxKisan = Math.max(...activeData.map((d) => d.kisanPrice));
    const maxRetail = Math.max(...activeData.map((d) => d.retailPrice || maxKisan));
    return Math.ceil(Math.max(maxKisan, maxRetail) * 1.08);
  }, [activeData]);

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint: HistoricalDataPoint = payload[0]?.payload;
      if (!dataPoint) return null;

      const diff = Math.round((dataPoint.kisanPrice - dataPoint.mandiPrice) * 10) / 10;
      const gainPct = Math.round(((dataPoint.kisanPrice - dataPoint.mandiPrice) / dataPoint.mandiPrice) * 100);

      return (
        <div className="bg-slate-900/95 text-white p-4 rounded-2xl shadow-xl border border-slate-700/60 backdrop-blur-md text-xs space-y-2.5 min-w-[240px]">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              {dataPoint.displayDate}
            </span>
            {dataPoint.isForecast && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                AI Forecast
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                <span className="text-slate-300">KisanMandi Direct:</span>
              </div>
              <span className="font-extrabold text-emerald-300 text-sm">
                ₹{dataPoint.kisanPrice} {activeProfile.unit}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span className="text-slate-300">APMC Mandi Modal:</span>
              </div>
              <span className="font-semibold text-slate-200">
                ₹{dataPoint.mandiPrice} {activeProfile.unit}
              </span>
            </div>

            {showMspLine && dataPoint.mspFloor > 0 && (
              <div className="flex items-center justify-between text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block" />
                  <span>MSP / Floor Price:</span>
                </div>
                <span>₹{dataPoint.mspFloor} {activeProfile.unit}</span>
              </div>
            )}

            {viewMode === 'arrivals_overlay' && dataPoint.arrivalsMT && (
              <div className="flex items-center justify-between text-blue-300 border-t border-slate-800 pt-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />
                  <span>Mandi Influx:</span>
                </div>
                <span className="font-bold">{dataPoint.arrivalsMT} MT</span>
              </div>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-700/80 flex items-center justify-between text-[11px] bg-emerald-950/50 p-2 rounded-xl border border-emerald-500/20">
            <span className="text-emerald-200 font-medium">Direct Farmer Gain:</span>
            <span className="text-emerald-300 font-extrabold">
              +₹{diff} ({gainPct}%)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-display font-extrabold text-slate-900">
                  Dynamic Price Intelligence & Historical Trends
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Live APMC Agmarknet Grounded
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Compare real-time wholesale APMC rates, KisanMandi fair direct realization, MSP baselines, and AI price forecasts.
              </p>
            </div>
          </div>
        </div>

        {/* Timeframe & Price Alert Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Active Alert Chip or Set Alert Button */}
          {activeAlertForCrop ? (
            <button
              onClick={() => setIsNotificationCenterOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100/80 hover:bg-emerald-200/80 text-emerald-900 border border-emerald-300 text-xs font-bold transition-all"
              title="Click to view or manage alert"
            >
              <Bell className="w-3.5 h-3.5 text-emerald-700 fill-emerald-600" />
              <span>
                Alert: {activeAlertForCrop.condition === 'ABOVE_OR_EQUAL' ? '≥' : activeAlertForCrop.condition === 'BELOW_OR_EQUAL' ? '≤' : 'Range'} ₹{activeAlertForCrop.targetPrice}
              </span>
            </button>
          ) : (
            <button
              onClick={() =>
                openCreateAlertModal({
                  commodityId: activeProfile.id,
                  commodityName: activeProfile.name,
                  variety: activeProfile.variety,
                  category: activeProfile.category,
                  targetPrice: Math.round(activeProfile.currentKisan * 1.15 * 10) / 10,
                  condition: 'ABOVE_OR_EQUAL',
                  unit: activeProfile.unit,
                })
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all hover:scale-105 active:scale-95"
            >
              <Bell className="w-3.5 h-3.5 text-emerald-400" />
              <span>Set Price Alert</span>
            </button>
          )}

          {/* Timeframe Pill Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl gradient-border-organic border-0">
            {(['7D', '30D', '3M', '1Y'] as TimeRange[]).map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeRange === t
                    ? 'bg-white text-emerald-900 shadow-xs gradient-border-organic border-0/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t === '7D' ? '7D' : t === '30D' ? '30D' : t === '3M' ? '3M' : '1Y'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Tabs & Crop Selection Chips */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Commodity Category:</span>
            {(['All', 'Vegetables', 'Fruits', 'Grains & Pulses'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  // switch to first profile of that category if not current
                  const firstInCat = CROP_PRICE_PROFILES.find((c) => cat === 'All' || c.category === cat);
                  if (firstInCat) setSelectedCropId(firstInCat.id);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium hidden sm:inline">Chart View:</span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 gradient-border-organic border-0">
              <button
                onClick={() => setViewMode('price_comparison')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  viewMode === 'price_comparison'
                    ? 'bg-white text-emerald-800 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Price Spread
              </button>
              <button
                onClick={() => setViewMode('arrivals_overlay')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  viewMode === 'arrivals_overlay'
                    ? 'bg-white text-emerald-800 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Arrival Volumes
              </button>
              <button
                onClick={() => setViewMode('forecast_view')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  viewMode === 'forecast_view'
                    ? 'bg-white text-emerald-800 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                AI Projection
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scrollable Crop Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {filteredProfiles.map((crop) => {
            const isSelected = selectedCropId === crop.id;
            return (
              <button
                key={crop.id}
                onClick={() => setSelectedCropId(crop.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-600/30'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span>{crop.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-600'
                }`}>
                  {crop.weeklyChangePercent >= 0 ? `+${crop.weeklyChangePercent}%` : `${crop.weeklyChangePercent}%`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Snapshot Metric Cards for Active Crop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
          <div className="text-[11px] text-emerald-800 font-semibold uppercase tracking-wider flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
            KisanMandi Direct
          </div>
          <div className="text-xl font-display font-extrabold text-emerald-950 mt-1">
            ₹{activeProfile.currentKisan} <span className="text-xs font-normal text-emerald-700">{activeProfile.unit}</span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-bold flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3 text-emerald-700" />
            +{premiumPct}% vs Local Mandi
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
          <div className="text-[11px] text-amber-800 font-semibold uppercase tracking-wider flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-amber-700" />
            APMC Modal Rate
          </div>
          <div className="text-xl font-display font-extrabold text-amber-950 mt-1">
            ₹{activeProfile.currentMandi} <span className="text-xs font-normal text-amber-700">{activeProfile.unit}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 truncate">
            {activeProfile.primaryMandi}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 gradient-border-organic border-0">
          <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-slate-600" />
            Govt MSP Floor
          </div>
          <div className="text-xl font-display font-extrabold text-slate-800 mt-1">
            ₹{activeProfile.mspFloor} <span className="text-xs font-normal text-slate-500">{activeProfile.unit}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Protected Baseline
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200">
          <div className="text-[11px] text-blue-800 font-semibold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            AI 7-Day Target
          </div>
          <div className="text-xl font-display font-extrabold text-blue-950 mt-1">
            ₹{activeProfile.aiForecast7D.targetPrice} <span className="text-xs font-normal text-blue-700">{activeProfile.unit}</span>
          </div>
          <div className="text-[11px] text-blue-700 mt-1 font-bold flex items-center gap-1">
            <span className={`px-1.5 py-0.2 rounded-md ${
              activeProfile.aiForecast7D.trend === 'Bullish' ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-800'
            }`}>
              {activeProfile.aiForecast7D.trend} ({activeProfile.aiForecast7D.confidence}%)
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 text-white col-span-2 sm:col-span-4 lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">30-Day Range</div>
            <div className="text-sm font-bold text-slate-200 mt-0.5">
              ₹{activeProfile.lowestPrice30D} - ₹{activeProfile.highestPrice30D}
            </div>
          </div>
          {onSelectCropForListing && (
            <button
              onClick={() => onSelectCropForListing(activeProfile.name, activeProfile.variety, activeProfile.currentKisan)}
              className="mt-2 w-full py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] transition-colors flex items-center justify-center gap-1"
            >
              <span>List Lot at ₹{activeProfile.currentKisan}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Recharts Canvas */}
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-50/70 gradient-border-organic border-0 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
              <span>KisanMandi Direct Realization</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span>APMC Mandi Modal Rate</span>
            </div>
            {viewMode === 'arrivals_overlay' && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
                <span className="w-3 h-3 rounded-md bg-blue-400 inline-block" />
                <span>Arrival Volumes (MT)</span>
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showMspLine}
              onChange={(e) => setShowMspLine(e.target.checked)}
              className="rounded text-emerald-600"
            />
            <span>Show MSP / Fair Price Floor (₹{activeProfile.mspFloor})</span>
          </label>
        </div>

        {/* Responsive Recharts Container */}
        <div className="w-full h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={activeData}
              margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="kisanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="mandiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="arrivalsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              
              <XAxis
                dataKey="displayDate"
                stroke="#64748b"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />

              {/* Primary Y-Axis for Price */}
              <YAxis
                yAxisId="price"
                domain={[minPrice, maxPrice]}
                stroke="#64748b"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `₹${val}`}
              />

              {/* Secondary Y-Axis for Arrival Volume if in Arrivals Overlay view */}
              {viewMode === 'arrivals_overlay' && (
                <YAxis
                  yAxisId="volume"
                  orientation="right"
                  stroke="#3b82f6"
                  tick={{ fontSize: 11, fill: '#3b82f6' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val} MT`}
                />
              )}

              <Tooltip content={<CustomTooltip />} />

              {/* Govt MSP Reference Line */}
              {showMspLine && activeProfile.mspFloor > 0 && (
                <ReferenceLine
                  yAxisId="price"
                  y={activeProfile.mspFloor}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  label={{
                    value: `MSP Floor: ₹${activeProfile.mspFloor}`,
                    position: 'insideBottomRight',
                    fill: '#64748b',
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />
              )}

              {/* Volume Bars in Arrivals Overlay mode */}
              {viewMode === 'arrivals_overlay' && (
                <Bar
                  yAxisId="volume"
                  dataKey="arrivalsMT"
                  fill="url(#arrivalsGradient)"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                  name="Arrivals (MT)"
                />
              )}

              {/* KisanMandi Direct Price Area & Line */}
              <Area
                yAxisId="price"
                type="monotone"
                dataKey="kisanPrice"
                stroke="#059669"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#kisanGradient)"
                name="KisanMandi Direct Price"
                activeDot={{ r: 6, fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }}
              />

              {/* APMC Mandi Modal Price Line */}
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="mandiPrice"
                stroke="#d97706"
                strokeWidth={2.5}
                strokeDasharray={viewMode === 'forecast_view' ? '4 3' : undefined}
                dot={false}
                name="APMC Mandi Rate"
                activeDot={{ r: 5, fill: '#d97706', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 px-2 pt-1 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Database className="w-3 h-3 text-emerald-700" />
              AGMARKNET / data.gov.in Live
            </span>
            <span>Official Government Benchmark Data</span>
          </div>
          <div className="text-emerald-700 font-semibold">
            Realized Spread: Direct trade yields +₹{priceDiffPerKg.toFixed(1)}/kg (+{premiumPct}%) above traditional auction.
          </div>
        </div>

        {/* Live Mandi Spot Benchmarks Bar */}
        {liveMandiRecords.length > 0 && (
          <div className="mt-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                Live APMC Rates for {activeProfile.name} Across Major Markets:
              </span>
              <span className="text-[10px] text-slate-500">
                Avg Modal: <strong>₹{liveComparison.averageModalPriceKg > 0 ? liveComparison.averageModalPriceKg : mandiPerKg}/kg</strong>
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {liveMandiRecords.slice(0, 5).map((rec) => (
                <div key={rec.id} className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-800 truncate">{rec.market}</div>
                  <div className="text-[10px] text-slate-400 truncate">{rec.state}</div>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xs font-extrabold text-emerald-700">₹{rec.modalPriceKg}/kg</span>
                    <span className="text-[9px] text-slate-400">₹{rec.modalPriceQuintal}/q</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Decision Support Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI Harvest Timing & Pricing Catalysts (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900 text-white space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                KisanMitra AI Decision Engine: {activeProfile.name}
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
              {activeProfile.aiForecast7D.confidence}% Predictive Confidence
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
              Optimal Action & Selling Window:
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {activeProfile.aiForecast7D.recommendedAction}
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300">Key Market Catalysts Driving Trend:</div>
            <div className="grid grid-cols-1 gap-2">
              {activeProfile.aiForecast7D.catalysts.map((catalyst, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{catalyst}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Interactive Farmer Extra Earnings Calculator (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-emerald-950 text-white space-y-4 border border-emerald-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-300" />
              <h3 className="text-base font-bold text-white">
                Your Direct Profit Calculator
              </h3>
            </div>
            <span className="text-[10px] text-emerald-300 font-bold px-2 py-0.5 rounded-full bg-emerald-800/80">
              0% Farmer Cut • 100% Payout
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Harvest Lot Size:</span>
                <span className="font-bold text-white">{lotQuantityKg.toLocaleString()} kg ({(lotQuantityKg / 1000).toFixed(1)} MT)</span>
              </div>
              <input
                type="range"
                min={500}
                max={25000}
                step={500}
                value={lotQuantityKg}
                onChange={(e) => setLotQuantityKg(Number(e.target.value))}
                className="w-full accent-emerald-400 bg-emerald-900 rounded-lg cursor-pointer h-2"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Traditional APMC Realization:</span>
                <span className="font-semibold text-slate-200">
                  ₹{Math.round(mandiPerKg * lotQuantityKg).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-emerald-200">
                <span>KisanMandi Direct Escrow:</span>
                <span className="font-bold text-emerald-300">
                  ₹{Math.round(kisanPerKg * lotQuantityKg).toLocaleString()}
                </span>
              </div>
              <div className="border-t border-emerald-700/80 pt-2 flex justify-between items-baseline">
                <span className="font-bold text-white">Extra Net Take-Home:</span>
                <span className="text-xl font-extrabold text-amber-300">
                  +₹{totalExtraIncome.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-emerald-300/80 leading-tight">
              By bypassing 3 levels of commission agents, loading dallas, and delayed credit terms, you receive full settlement via instant UPI escrow.
            </p>
          </div>
        </div>
      </div>

      {/* Interstate APMC Arbitrage Spread Matrix */}
      <div className="p-6 rounded-3xl bg-slate-50 gradient-border-organic border-0 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-700" />
              Interstate Mandi Arbitrage & Price Spread Matrix for {activeProfile.name}
            </h3>
            <p className="text-xs text-slate-500">
              Live rate differentials across destination consumption hubs vs local farm-gate
            </p>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-xl self-start sm:self-auto">
            Cold-Chain Logistics Integrated
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {activeProfile.arbitrageMandis.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white gradient-border-organic border-0 flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-slate-900 text-xs">{item.mandi}</div>
                <div className="text-[10px] text-slate-400">{item.state}</div>
              </div>
              <div className="text-right">
                <div className="font-extrabold text-slate-900 text-sm">
                  ₹{item.price} {activeProfile.unit}
                </div>
                <div className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${
                  item.spread >= 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}>
                  {item.spread >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {item.spread >= 0 ? `+₹${item.spread} Spread` : `₹${item.spread} Spread`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
