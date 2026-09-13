import React from 'react';
import { 
  Truck, 
  ShieldCheck, 
  Info, 
  HelpCircle, 
  Check, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  Layers,
  Scale
} from 'lucide-react';
import { TruckOwnershipType } from '../types';
import { calculateTransportationPricing, getDynamicScalingRows, getTransportationRate } from '../utils/transportationPricing';
import { useLanguage } from '../context/LanguageContext';

interface TransportationCostBreakdownProps {
  distance: number;
  baseCostPerKm?: number;
  ownershipType: TruckOwnershipType;
  showComparison?: boolean;
  showVisualIndicator?: boolean;
  showScalingTable?: boolean;
  compact?: boolean;
}

export const TransportationCostBreakdown: React.FC<TransportationCostBreakdownProps> = ({
  distance,
  baseCostPerKm,
  ownershipType,
  showComparison = true,
  showVisualIndicator = true,
  showScalingTable = false,
  compact = false,
}) => {
  const { t, language } = useLanguage();
  const pricing = calculateTransportationPricing(distance, baseCostPerKm, ownershipType);
  const scalingRows = getDynamicScalingRows();

  const formatRupee = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Determine progress percentage on distance visualizer (capped at 150km for visual scale)
  const visualMaxKm = 100;
  const progressPct = Math.min(100, Math.max(2, (pricing.distance / visualMaxKm) * 100));

  return (
    <div className="space-y-4">
      {/* Visual Slab Progress Indicator (Section 10) */}
      {showVisualIndicator && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white border border-slate-700/60 shadow-inner">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-1.5 font-bold text-emerald-300">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>{t('rateCalculator')}</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-[11px] font-extrabold">
              {pricing.distance} KM {ownershipType === 'kisandirect' ? '• KisanDirect Trucks' : '• Own Truck'}
            </span>
          </div>

          {/* Tier Graphic Bar */}
          <div className="space-y-2 pt-1">
            <div className="relative h-3 bg-slate-700/80 rounded-full overflow-hidden border border-slate-600/50">
              {/* First 15 KM tier section indicator */}
              <div 
                className="absolute top-0 bottom-0 left-0 bg-emerald-600/50 border-r-2 border-emerald-300"
                style={{ width: `${(15 / visualMaxKm) * 100}%` }}
                title="Slab 1: 0-15 KM"
              />
              {/* Active distance fill */}
              <div 
                className={`h-full transition-all duration-300 rounded-full ${
                  ownershipType === 'kisandirect' 
                    ? 'bg-gradient-to-r from-emerald-400 to-cyan-400' 
                    : 'bg-gradient-to-r from-emerald-500 to-emerald-300'
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Scale Milestone Markers */}
            <div className="flex justify-between text-[10px] text-slate-300 font-semibold px-0.5">
              <span className="flex flex-col items-start">
                <span>0 KM</span>
                <span className="text-[9px] text-emerald-400 font-normal">Base</span>
              </span>
              <span className="flex flex-col items-center">
                <span className="text-emerald-300 font-bold">15 KM</span>
                <span className="text-[9px] text-emerald-400">₹5/KM slab</span>
              </span>
              <span className="flex flex-col items-center">
                <span>50 KM</span>
                <span className="text-[9px] text-cyan-300">₹3/KM slab</span>
              </span>
              <span className="flex flex-col items-end">
                <span>100+ KM</span>
                <span className="text-[9px] text-cyan-300">Long Haul</span>
              </span>
            </div>
          </div>

          {/* Transparent Slab Explanation */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-700/60 text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-300">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span>{t('slab0to15')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-300 justify-end">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
              <span>{t('slabAbove15')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Transparent Cost Breakdown Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        {/* Header with Ownership Tag */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl text-white ${
              ownershipType === 'kisandirect' 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700' 
                : 'bg-gradient-to-r from-slate-700 to-slate-900'
            }`}>
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">
                {ownershipType === 'kisandirect' ? t('trucksPortal') : t('yourOwnTruck')}
              </h4>
              <p className="text-[11px] text-slate-500">
                {t('tripDistance')}: <span className="font-bold text-slate-800">{pricing.distance} KM</span> • {t('baseCostPerKm')}: <span className="font-bold text-slate-800">₹{pricing.baseCostPerKm}/KM</span>
              </p>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
            ownershipType === 'kisandirect'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}>
            {ownershipType === 'kisandirect' ? '🚛 KisanDirect Fleet' : '🚚 Own Vehicle'}
          </span>
        </div>

        {/* Mathematical Step-by-Step Breakdown */}
        <div className="space-y-3 text-xs">
          {/* Base Transportation Row */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex justify-between items-center text-slate-700 font-semibold">
              <span className="flex items-center gap-1.5">
                <span>{t('baseTransportation')}</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  ({pricing.distance} KM × ₹{pricing.baseCostPerKm}/KM)
                </span>
              </span>
              <span className="text-sm font-extrabold text-slate-900">
                {formatRupee(pricing.baseCost)}
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              {pricing.distance} × ₹{pricing.baseCostPerKm} = {formatRupee(pricing.baseCost)}
            </div>
          </div>

          {/* KisanDirect Service Charge Breakdown (Only if KisanDirect) */}
          {ownershipType === 'kisandirect' ? (
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('kisanDirectServiceCharge')}</span>
                </span>
                <span className="text-sm font-extrabold text-emerald-900">
                  {formatRupee(pricing.totalServiceCharge)}
                </span>
              </div>

              {/* Tier 1: First 15 KM */}
              <div className="flex justify-between items-center text-slate-600 pl-3 border-l-2 border-emerald-400 text-[11px]">
                <div>
                  <span className="font-semibold text-slate-800">{t('first15KmCharge')}:</span>
                  <span className="text-slate-500 ml-1.5">
                    {pricing.first15Km} KM × ₹{pricing.first15Rate}/KM
                  </span>
                </div>
                <span className="font-bold text-slate-800">
                  {formatRupee(pricing.first15ServiceCharge)}
                </span>
              </div>

              {/* Tier 2: Remaining KM above 15 */}
              {pricing.remainingKm > 0 && (
                <div className="flex justify-between items-center text-slate-600 pl-3 border-l-2 border-teal-400 text-[11px]">
                  <div>
                    <span className="font-semibold text-slate-800">{t('remainingKmCharge')}:</span>
                    <span className="text-slate-500 ml-1.5">
                      {pricing.remainingKm} KM × ₹{pricing.remainingRate}/KM
                    </span>
                  </div>
                  <span className="font-bold text-slate-800">
                    {formatRupee(pricing.remainingServiceCharge)}
                  </span>
                </div>
              )}

              {/* Sum of Service Charge */}
              <div className="flex justify-between items-center text-[11px] font-bold text-emerald-900 pt-1 border-t border-emerald-200/60">
                <span>{t('totalServiceCharge')}:</span>
                <span>
                  {pricing.remainingKm > 0 
                    ? `₹${pricing.first15ServiceCharge} + ₹${pricing.remainingServiceCharge} = ${formatRupee(pricing.totalServiceCharge)}` 
                    : formatRupee(pricing.totalServiceCharge)
                  }
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs">
              <div className="flex items-center gap-2 font-medium text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t('operatingCost')}: ₹{pricing.baseCostPerKm}/KM</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {t('yourOwnTruck')} — {pricing.distance} KM × ₹{pricing.baseCostPerKm}/KM = {formatRupee(pricing.totalCost)} (No platform service fees applied).
              </p>
            </div>
          )}

          {/* TOTAL TRANSPORTATION COST - Large & High Contrast */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white shadow-md flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-emerald-300">
                {t('totalTransportationCost')}
              </div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5">
                {formatRupee(pricing.totalCost)}
              </div>
            </div>

            <div className="text-right text-[11px] text-slate-300">
              {ownershipType === 'kisandirect' ? (
                <div>
                  <div>Base: {formatRupee(pricing.baseCost)}</div>
                  <div className="text-emerald-300">+ Fee: {formatRupee(pricing.totalServiceCharge)}</div>
                </div>
              ) : (
                <div className="text-emerald-300 font-semibold">
                  {pricing.distance} KM @ ₹{pricing.baseCostPerKm}/KM
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cost Comparison Feature (Section 9) */}
        {showComparison && ownershipType === 'kisandirect' && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/60 to-emerald-50/60 border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <Scale className="w-4 h-4 text-amber-700" />
              <span>{t('comparisonTitle')}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Your Own Truck Equivalent */}
              <div className="p-3 rounded-xl bg-white/90 border border-slate-200 shadow-2xs">
                <div className="text-[10px] uppercase font-bold text-slate-500">
                  {t('yourOwnTruck')}
                </div>
                <div className="text-base font-extrabold text-slate-900 mt-1">
                  {formatRupee(pricing.ownTruckEquivalentCost)}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Base cost only
                </div>
              </div>

              {/* KisanDirect Trucks */}
              <div className="p-3 rounded-xl bg-emerald-100/50 border border-emerald-300/80 shadow-2xs">
                <div className="text-[10px] uppercase font-bold text-emerald-800">
                  {t('trucksPortal')}
                </div>
                <div className="text-base font-extrabold text-emerald-950 mt-1">
                  {formatRupee(pricing.totalCost)}
                </div>
                <div className="text-[10px] text-emerald-700 mt-0.5">
                  Base ({formatRupee(pricing.baseCost)}) + Svc ({formatRupee(pricing.totalServiceCharge)})
                </div>
              </div>
            </div>

            {/* Value Statement */}
            <div className="flex items-start gap-2 text-[11px] text-emerald-900 font-medium bg-white/70 p-2.5 rounded-xl border border-emerald-200/50">
              <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <p>{t('noTruckMaintenanceNote')}</p>
            </div>
          </div>
        )}

        {/* Dynamic Distance Scaling Table (Section 2) */}
        {showScalingTable && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="mb-2.5">
              <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>{t('dynamicDistanceScalingTable') || 'Dynamic Distance Scaling Table'}</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                  Longer distance = lower rate per KM
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Per-KM rate decreases with distance while total transportation cost increases as kilometres accumulate.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Distance</th>
                    <th className="py-2.5 px-3">Cost/KM</th>
                    <th className="py-2.5 px-3 text-right">Total Transportation Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scalingRows.map((row) => {
                    const isCurrent = (
                      (row.distance === 10 && pricing.distance <= 10) ||
                      (row.distance === 25 && pricing.distance > 10 && pricing.distance <= 25) ||
                      (row.distance === 50 && pricing.distance > 25 && pricing.distance <= 50) ||
                      (row.distance === 100 && pricing.distance > 50 && pricing.distance <= 100) ||
                      (row.distance === 200 && pricing.distance > 100)
                    );
                    return (
                      <tr 
                        key={row.distance} 
                        className={isCurrent ? 'bg-emerald-50/90 font-bold text-emerald-950 border-l-4 border-l-emerald-600' : 'text-slate-700 hover:bg-slate-50/50'}
                      >
                        <td className="py-2.5 px-3 flex items-center gap-1.5">
                          {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />}
                          <span>{row.distance} KM</span>
                          {isCurrent && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-200/80 text-emerald-900 font-extrabold uppercase">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">
                          ₹{row.ratePerKm}/KM
                        </td>
                        <td className="py-2.5 px-3 text-right font-black text-slate-900">
                          {formatRupee(row.ownTruckCost)}
                          <span className="block text-[9px] text-slate-400 font-normal">
                            ({row.distance} × ₹{row.ratePerKm})
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
