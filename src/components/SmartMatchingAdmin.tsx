import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Truck,
  Coins,
  Package,
  Activity,
  Layers,
  Save,
} from 'lucide-react';
import { useSmartMatching } from '../context/SmartMatchingContext';
import { MatchingWeightsConfig, DeliveryCostConfig } from '../types';
import { DEFAULT_MATCHING_CONFIG } from '../services/smartMatchingService';

export const SmartMatchingAdmin: React.FC = () => {
  const { matchingConfig, updateMatchingConfig, analytics, resetToDemoData } = useSmartMatching();

  const [weights, setWeights] = useState<MatchingWeightsConfig>(matchingConfig.weights);
  const [deliveryParams, setDeliveryParams] = useState<DeliveryCostConfig>(matchingConfig.deliveryCostParams);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(matchingConfig.maxDistanceKm);
  const [minThreshold, setMinThreshold] = useState<number>(matchingConfig.minMatchScoreThreshold);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Calculate sum of weights
  const totalWeight =
    Number(weights.product) +
    Number(weights.quantity) +
    Number(weights.distance) +
    Number(weights.price) +
    Number(weights.delivery) +
    Number(weights.demand) +
    Number(weights.harvest) +
    Number(weights.freshness);

  const isValidWeightSum = totalWeight === 100;

  const handleWeightChange = (key: keyof MatchingWeightsConfig, value: number) => {
    setWeights((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidWeightSum) return;

    updateMatchingConfig({
      weights,
      deliveryCostParams: deliveryParams,
      maxDistanceKm: Number(maxDistanceKm),
      minMatchScoreThreshold: Number(minThreshold),
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const handleResetDefaults = () => {
    setWeights(DEFAULT_MATCHING_CONFIG.weights);
    setDeliveryParams(DEFAULT_MATCHING_CONFIG.deliveryCostParams);
    setMaxDistanceKm(DEFAULT_MATCHING_CONFIG.maxDistanceKm);
    setMinThreshold(DEFAULT_MATCHING_CONFIG.minMatchScoreThreshold);
    updateMatchingConfig(DEFAULT_MATCHING_CONFIG);
  };

  return (
    <div className="space-y-6 text-slate-900">
      {/* Analytics Summary Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-5 rounded-2xl gradient-border-organic border-0 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Acceptance Rate</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {analytics.acceptanceRatePct}%
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
            {analytics.matchesAcceptedCount} of {analytics.totalMatchesGenerated} matches converted
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-5 rounded-2xl gradient-border-organic border-0 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Avg Match Quality</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {analytics.avgMatchScore}%
          </div>
          <div className="text-[11px] text-purple-700 font-semibold mt-0.5">
            Multi-factor compatibility index
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-5 rounded-2xl gradient-border-organic border-0 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-blue-600" />
            <span>Avg Transit Radius</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {analytics.avgDistanceKm} km
          </div>
          <div className="text-[11px] text-blue-700 font-semibold mt-0.5">
            Local & Regional Clusters
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-5 rounded-2xl gradient-border-organic border-0 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-600" />
            <span>Freight Savings</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ₹{analytics.avgDeliveryCostSavings.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-0.5">
            Direct routing optimization
          </div>
        </div>
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSave} className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-700" />
              <span>Smart Matching Engine Configuration</span>
            </h3>
            <p className="text-xs text-slate-500">
              Calibrate multi-factor algorithm weights, geographic radius caps, and logistics pricing variables.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="submit"
              disabled={!isValidWeightSum}
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Save Calibration</span>
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Algorithm weights updated. All marketplace matches dynamically recomputed.</span>
          </div>
        )}

        {/* Section 1: Multi-Factor Weights (Must Sum to 100%) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-black text-slate-900">
                1. Multi-Factor Scoring Weights
              </h4>
              <p className="text-xs text-slate-500">
                Configure the percentage contribution of each factor. Total must strictly sum to 100%.
              </p>
            </div>

            <div
              className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                isValidWeightSum
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-rose-50 text-rose-800 border-rose-300'
              }`}
            >
              Total Weight: {totalWeight}% {isValidWeightSum ? '✓ Valid' : '⚠ Must Equal 100%'}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Product */}
            <div className="p-4 rounded-2xl bg-slate-50 gradient-border-organic border-0 space-y-2">
              <div className="flex justify-between font-bold">
                <span>Product / Crop Fit</span>
                <span className="font-mono text-emerald-800">{weights.product}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                value={weights.product}
                onChange={(e) => handleWeightChange('product', Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <p className="text-[10px] text-slate-500">Crop, variety, grade & organic status alignment</p>
            </div>

            {/* Quantity */}
            <div className="p-4 rounded-2xl bg-slate-50 gradient-border-organic border-0 space-y-2">
              <div className="flex justify-between font-bold">
                <span>Quantity Match</span>
                <span className="font-mono text-blue-800">{weights.quantity}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                value={weights.quantity}
                onChange={(e) => handleWeightChange('quantity', Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <p className="text-[10px] text-slate-500">Percentage volume fulfillment capability</p>
            </div>

            {/* Distance */}
            <div className="p-4 rounded-2xl bg-slate-50 gradient-border-organic border-0 space-y-2">
              <div className="flex justify-between font-bold">
                <span>Distance / Proximity</span>
                <span className="font-mono text-teal-800">{weights.distance}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                value={weights.distance}
                onChange={(e) => handleWeightChange('distance', Number(e.target.value))}
                className="w-full accent-teal-600"
              />
              <p className="text-[10px] text-slate-500">Haversine geodesic road transit distance</p>
            </div>

            {/* Price */}
            <div className="p-4 rounded-2xl bg-slate-50 gradient-border-organic border-0 space-y-2">
              <div className="flex justify-between font-bold">
                <span>Price Compatibility</span>
                <span className="font-mono text-amber-800">{weights.price}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                value={weights.price}
                onChange={(e) => handleWeightChange('price', Number(e.target.value))}
                className="w-full accent-amber-600"
              />
              <p className="text-[10px] text-slate-500">Farmer floor vs buyer ceiling budget spread</p>
            </div>

            {/* Delivery Cost */}
            <div className="p-4 rounded-2xl bg-slate-50 gradient-border-organic border-0 space-y-2">
              <div className="flex justify-between font-bold">
                <span>Delivery Freight Cost</span>
                <span className="font-mono text-purple-800">{weights.delivery}%</span>
              </div>
              <input
                type="range"
                min={2}
                max={30}
                value={weights.delivery}
                onChange={(e) => handleWeightChange('delivery', Number(e.target.value))}
                className="w-full accent-purple-600"
              />
              <p className="text-[10px] text-slate-500">Logistics cost per kg relative to crop value</p>
            </div>

            {/* Demand */}
            <div className="p-4 rounded-2xl bg-slate-50 gradient-border-organic border-0 space-y-2">
              <div className="flex justify-between font-bold">
                <span>Demand & Urgency</span>
                <span className="font-mono text-indigo-800">{weights.demand}%</span>
              </div>
              <input
                type="range"
                min={2}
                max={25}
                value={weights.demand}
                onChange={(e) => handleWeightChange('demand', Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <p className="text-[10px] text-slate-500">Buyer procurement timeline priority</p>
            </div>

            {/* Harvest Date */}
            <div className="p-4 rounded-2xl bg-slate-50 gradient-border-organic border-0 space-y-2">
              <div className="flex justify-between font-bold">
                <span>Harvest Date Sync</span>
                <span className="font-mono text-emerald-800">{weights.harvest}%</span>
              </div>
              <input
                type="range"
                min={2}
                max={25}
                value={weights.harvest}
                onChange={(e) => handleWeightChange('harvest', Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <p className="text-[10px] text-slate-500">Harvest schedule aligned with delivery date</p>
            </div>

            {/* Freshness */}
            <div className="p-4 rounded-2xl bg-slate-50 gradient-border-organic border-0 space-y-2">
              <div className="flex justify-between font-bold">
                <span>Freshness & Cold Chain</span>
                <span className="font-mono text-green-800">{weights.freshness}%</span>
              </div>
              <input
                type="range"
                min={2}
                max={20}
                value={weights.freshness}
                onChange={(e) => handleWeightChange('freshness', Number(e.target.value))}
                className="w-full accent-green-600"
              />
              <p className="text-[10px] text-slate-500">Shelf-life decay & cold-chain preservation</p>
            </div>
          </div>
        </div>

        {/* Section 2: Logistics Delivery Cost Formula */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div>
            <h4 className="text-sm font-black text-slate-900">
              2. Logistics Freight Cost Estimation Parameters
            </h4>
            <p className="text-xs text-slate-500">
              Formula: <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-emerald-800">Base Cost + (Distance × Rate/km) + (Quantity × Handling/kg)</code>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Base Dispatch Cost (₹)</label>
              <input
                type="number"
                value={deliveryParams.baseCost}
                onChange={(e) =>
                  setDeliveryParams((p) => ({ ...p, baseCost: Number(e.target.value) }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Transport Rate per km (₹/km)</label>
              <input
                type="number"
                step="0.5"
                value={deliveryParams.ratePerKm}
                onChange={(e) =>
                  setDeliveryParams((p) => ({ ...p, ratePerKm: Number(e.target.value) }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Per-Kg Handling Fee (₹/kg)</label>
              <input
                type="number"
                step="0.05"
                value={deliveryParams.perKgHandlingRate}
                onChange={(e) =>
                  setDeliveryParams((p) => ({ ...p, perKgHandlingRate: Number(e.target.value) }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Matching Radius & Score Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Maximum Matching Radius ({maxDistanceKm} km)
            </label>
            <input
              type="range"
              min={50}
              max={1000}
              step={25}
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Pairs exceeding this road distance are scored with distance decay penalty.
            </p>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Minimum Display Threshold ({minThreshold}% Match Score)
            </label>
            <input
              type="range"
              min={20}
              max={70}
              step={5}
              value={minThreshold}
              onChange={(e) => setMinThreshold(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Matches with composite score below this number are filtered out.
            </p>
          </div>
        </div>
      </form>

      {/* Real-time Match Event Stream */}
      <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-700" />
            <span>Live Matching Engine Activity Feed</span>
          </h4>
          <span className="text-[11px] text-slate-500">Real-Time Event Bus</span>
        </div>

        <div className="space-y-2.5 text-xs">
          {analytics.recentMatchEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-3 rounded-2xl bg-slate-50 gradient-border-organic border-0/60 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-800">{evt.description}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono shrink-0">{evt.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
