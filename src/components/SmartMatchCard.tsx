import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  TrendingUp,
  Truck,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Send,
  Coins,
  ShieldCheck,
  Building2,
  Tractor,
  Layers,
  ArrowRight,
  Sliders,
  DollarSign,
  Package,
} from 'lucide-react';
import { SmartMatch, MatchQualityRating } from '../types';
import { useSmartMatching } from '../context/SmartMatchingContext';

interface SmartMatchCardProps {
  match: SmartMatch;
  userRole?: 'farmer' | 'buyer' | 'admin' | 'all';
  onFindAdditionalFarmers?: (cropName: string, remainingKg: number) => void;
}

export const SmartMatchCard: React.FC<SmartMatchCardProps> = ({
  match,
  userRole = 'all',
  onFindAdditionalFarmers,
}) => {
  const {
    acceptMatch,
    sendOffer,
    negotiatePrice,
    createOrderFromMatch,
    rejectMatch,
  } = useSmartMatching();

  const [expandedBreakdown, setExpandedBreakdown] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isNegotiateModalOpen, setIsNegotiateModalOpen] = useState(false);
  const [customPrice, setCustomPrice] = useState<number>(match.estimatedPricePerKg);
  const [counterPrice, setCounterPrice] = useState<number>(match.estimatedPricePerKg);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getQualityBadge = (quality: MatchQualityRating, score: number) => {
    if (score >= 90) {
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        dot: 'bg-emerald-500',
        label: `${score}% — Excellent Match`,
      };
    }
    if (score >= 75) {
      return {
        bg: 'bg-teal-50 text-teal-800 border-teal-300',
        dot: 'bg-teal-500',
        label: `${score}% — Good Match`,
      };
    }
    if (score >= 60) {
      return {
        bg: 'bg-blue-50 text-blue-800 border-blue-300',
        dot: 'bg-blue-500',
        label: `${score}% — Possible Match`,
      };
    }
    if (score >= 40) {
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-300',
        dot: 'bg-amber-500',
        label: `${score}% — Weak Match`,
      };
    }
    return {
      bg: 'bg-rose-50 text-rose-800 border-rose-300',
      dot: 'bg-rose-500',
      label: `${score}% — Poor Match`,
    };
  };

  const badge = getQualityBadge(match.matchQuality, match.matchScore);

  const handleAccept = async () => {
    setIsSubmitting(true);
    await acceptMatch(match.id);
    setIsSubmitting(false);
  };

  const handleSendOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await sendOffer(match.id, Number(customPrice));
    setIsSubmitting(false);
    setIsOfferModalOpen(false);
  };

  const handleNegotiateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await negotiatePrice(match.id, Number(counterPrice));
    setIsSubmitting(false);
    setIsNegotiateModalOpen(false);
  };

  const handleCreateOrder = async () => {
    setIsSubmitting(true);
    await createOrderFromMatch(match.id);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
      {/* Card Header */}
      <div className="p-5 sm:p-6 pb-4 border-b border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{match.farmerListing.cropName}</span>
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {match.farmerListing.variety}
            </span>
            {match.farmerListing.isOrganic && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                Organic
              </span>
            )}
          </div>

          {/* Match Score Badge */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-extrabold border flex items-center gap-2 ${badge.bg}`}
          >
            <span className={`w-2 h-2 rounded-full ${badge.dot} animate-pulse`} />
            <span>{badge.label}</span>
          </div>
        </div>

        {/* Farmer -> Buyer Flow Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl gradient-border-organic border-0/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Tractor className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Farmer Listing</div>
              <div className="text-xs font-bold text-slate-900 line-clamp-1">
                {match.farmerListing.farmerName}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600" />
                <span>{match.farmerListing.location.name}</span>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-center justify-center px-2">
            <span className="text-[10px] font-mono text-emerald-700 font-bold">{match.distanceKm} km</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-blue-700" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Buyer Requirement</div>
              <div className="text-xs font-bold text-slate-900 line-clamp-1">
                {match.buyerRequirement.buyerCompany}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-600" />
                <span>{match.buyerRequirement.deliveryLocation.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body: Key Fact Metrics */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Quantity & Partial Match Alert */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 gradient-border-organic border-0">
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Matched Volume</div>
            <div className="text-base font-extrabold text-slate-900">
              {match.matchedQuantityKg.toLocaleString()} kg
              <span className="text-xs text-slate-500 font-normal ml-1">
                of {match.buyerRequirement.quantityRequiredKg.toLocaleString()} kg required
              </span>
            </div>
          </div>

          {match.isPartialMatch ? (
            <div className="text-right">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">
                Partial Match ({match.fulfillmentPct}%)
              </span>
              <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                Remaining: {match.remainingRequirementKg.toLocaleString()} kg
              </div>
            </div>
          ) : (
            <div className="text-right">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>100% Fulfilled</span>
              </span>
            </div>
          )}
        </div>

        {/* 4-Stat Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Est Price */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-left">
            <div className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
              <Coins className="w-3 h-3 text-emerald-600" />
              <span>Est. Deal Price</span>
            </div>
            <div className="text-sm font-extrabold text-slate-900 mt-0.5">
              ₹{match.estimatedPricePerKg}/kg
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              Range: ₹{match.negotiationRange.farmerMin}–₹{match.negotiationRange.buyerMax}
            </div>
          </div>

          {/* Delivery Cost */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-left">
            <div className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
              <Truck className="w-3 h-3 text-blue-600" />
              <span>Est. Freight</span>
            </div>
            <div className="text-sm font-extrabold text-slate-900 mt-0.5">
              ₹{match.estimatedDeliveryCost.toLocaleString()}
            </div>
            <div className="text-[10px] text-blue-700 font-semibold">
              ₹{match.deliveryCostPerKg}/kg ({match.distanceKm} km)
            </div>
          </div>

          {/* Freshness */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-left">
            <div className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Freshness</span>
            </div>
            <div className="text-sm font-extrabold text-emerald-700 mt-0.5">
              {match.freshnessScore}%
            </div>
            <div className="text-[10px] text-slate-500">
              Harvest: {match.farmerListing.harvestDate.substring(5)}
            </div>
          </div>

          {/* Delivery Target */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-left">
            <div className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
              <Calendar className="w-3 h-3 text-purple-600" />
              <span>Target Delivery</span>
            </div>
            <div className="text-sm font-extrabold text-purple-900 mt-0.5">
              {match.buyerRequirement.requiredDeliveryDate.substring(5)}
            </div>
            <div className="text-[10px] text-purple-700 font-semibold uppercase">
              {match.buyerRequirement.urgency} Urgency
            </div>
          </div>
        </div>

        {/* Explainable AI Checkpoints */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-emerald-950 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Why This Match?</span>
            </span>
            <span className="text-[10px] text-emerald-800 font-semibold">
              Algorithmic Multi-Factor Score
            </span>
          </div>
          <ul className="space-y-1 text-slate-700 text-[11px]">
            {match.explanationPoints.slice(0, 4).map((pt, idx) => (
              <li key={idx} className="flex items-start gap-1.5 leading-tight">
                <span className="text-emerald-700 font-bold shrink-0">•</span>
                <span>{pt.replace(/^✓\s*|^ℹ\s*|^⚠\s*/, '')}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Expandable Factor Breakdown */}
        {expandedBreakdown && (
          <div className="p-4 rounded-2xl bg-slate-50 gradient-border-organic border-0 text-xs space-y-3 animate-in fade-in">
            <div className="font-bold text-slate-900 text-xs flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-purple-600" />
                <span>8-Factor Weight Scoring Breakdown</span>
              </span>
              <span className="font-mono text-emerald-800 font-extrabold">
                {match.matchScore} / 100 Total
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
              <div>
                <div className="flex justify-between text-slate-600 mb-0.5">
                  <span>Product Compatibility ({match.scoreBreakdown.weightsUsed.product}%)</span>
                  <span className="font-bold text-slate-900">{match.scoreBreakdown.productScore}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${match.scoreBreakdown.productScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-0.5">
                  <span>Quantity Fulfillment ({match.scoreBreakdown.weightsUsed.quantity}%)</span>
                  <span className="font-bold text-slate-900">{match.scoreBreakdown.quantityScore}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${match.scoreBreakdown.quantityScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-0.5">
                  <span>Distance & Proximity ({match.scoreBreakdown.weightsUsed.distance}%)</span>
                  <span className="font-bold text-slate-900">{match.scoreBreakdown.distanceScore}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-teal-600 h-full rounded-full" style={{ width: `${match.scoreBreakdown.distanceScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-0.5">
                  <span>Price Compatibility ({match.scoreBreakdown.weightsUsed.price}%)</span>
                  <span className="font-bold text-slate-900">{match.scoreBreakdown.priceScore}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${match.scoreBreakdown.priceScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-0.5">
                  <span>Delivery Logistics Cost ({match.scoreBreakdown.weightsUsed.delivery}%)</span>
                  <span className="font-bold text-slate-900">{match.scoreBreakdown.deliveryScore}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: `${match.scoreBreakdown.deliveryScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-0.5">
                  <span>Demand & Urgency ({match.scoreBreakdown.weightsUsed.demand}%)</span>
                  <span className="font-bold text-slate-900">{match.scoreBreakdown.demandScore}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${match.scoreBreakdown.demandScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-0.5">
                  <span>Harvest Date Sync ({match.scoreBreakdown.weightsUsed.harvest}%)</span>
                  <span className="font-bold text-slate-900">{match.scoreBreakdown.harvestScore}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${match.scoreBreakdown.harvestScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-0.5">
                  <span>Freshness & Preservation ({match.scoreBreakdown.weightsUsed.freshness}%)</span>
                  <span className="font-bold text-slate-900">{match.scoreBreakdown.freshnessScore}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-green-600 h-full rounded-full" style={{ width: `${match.scoreBreakdown.freshnessScore}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toggle Details Button */}
        <button
          onClick={() => setExpandedBreakdown(!expandedBreakdown)}
          className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 transition-colors"
        >
          <span>{expandedBreakdown ? 'Hide Math Breakdown' : 'View Explainable Math Breakdown'}</span>
          {expandedBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Card Footer: Action Trigger Buttons */}
      <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5">
          {match.status === 'accepted' ? (
            <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-1.5 border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Match Accepted • Inventory Reserved</span>
            </span>
          ) : match.status === 'order_created' ? (
            <span className="px-3 py-1 rounded-xl bg-purple-100 text-purple-900 font-bold text-xs flex items-center gap-1.5 border border-purple-300">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
              <span>Order #{match.orderNumber} Locked in Escrow</span>
            </span>
          ) : match.status === 'offer_sent' ? (
            <span className="px-3 py-1 rounded-xl bg-blue-100 text-blue-900 font-bold text-xs flex items-center gap-1.5 border border-blue-300">
              <Clock className="w-3.5 h-3.5 text-blue-700" />
              <span>Offer Dispatched (Awaiting Confirmation)</span>
            </span>
          ) : match.status === 'negotiating' ? (
            <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-1.5 border border-amber-300">
              <Sliders className="w-3.5 h-3.5 text-amber-700" />
              <span>Counter-Offer Active</span>
            </span>
          ) : (
            <span className="text-[11px] text-slate-500 font-medium">
              Total Deal: <strong className="text-slate-900 font-mono">₹{match.totalEstimatedDeal.toLocaleString()}</strong>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Partial Match: Find complementary farmers */}
          {match.isPartialMatch && onFindAdditionalFarmers && (
            <button
              onClick={() => onFindAdditionalFarmers(match.farmerListing.cropName, match.remainingRequirementKg)}
              className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 transition-colors flex items-center gap-1"
              title="Find complementary farmers to fulfill remaining quantity"
            >
              <Layers className="w-3 h-3 text-amber-700" />
              <span>+ Find Co-Suppliers</span>
            </button>
          )}

          {/* Negotiate */}
          <button
            onClick={() => setIsNegotiateModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-300 transition-colors"
          >
            Negotiate
          </button>

          {/* Send Offer */}
          <button
            onClick={() => setIsOfferModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors flex items-center gap-1"
          >
            <Send className="w-3 h-3" />
            <span>Send Offer</span>
          </button>

          {/* Direct Accept / Instant Order */}
          <button
            onClick={handleAccept}
            disabled={isSubmitting || match.status === 'accepted' || match.status === 'order_created'}
            className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all disabled:opacity-60 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{match.status === 'accepted' ? 'Accepted' : 'Accept Match'}</span>
          </button>
        </div>
      </div>

      {/* Send Offer Modal */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-3xl p-6 max-w-md w-full gradient-border-organic border-0 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-700" />
                <span>Dispatch Official Supply Offer</span>
              </h3>
              <button
                onClick={() => setIsOfferModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendOfferSubmit} className="space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 gradient-border-organic border-0 space-y-1">
                <div className="font-bold text-slate-800">
                  {match.farmerListing.cropName} ({match.matchedQuantityKg.toLocaleString()} kg)
                </div>
                <div className="text-slate-600">
                  Recipient: <strong className="text-slate-900">{match.buyerRequirement.buyerCompany}</strong>
                </div>
                <div className="text-slate-500">
                  Buyer Budget: Up to ₹{match.negotiationRange.buyerMax}/kg | Farmer Floor: ₹{match.negotiationRange.farmerMin}/kg
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Proposed Price per kg (₹/kg)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    step="0.5"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 font-bold text-slate-900"
                    required
                  />
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Total Deal Value: <strong>₹{(customPrice * match.matchedQuantityKg).toLocaleString()}</strong>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>KisanMandi Escrow Protection</span>
                </div>
                <p>
                  Upon buyer acceptance, the amount is locked in digital escrow and released instantly via UPI on farmgate receipt.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs transition-colors"
                >
                  {isSubmitting ? 'Sending...' : 'Confirm & Dispatch Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Negotiate Modal */}
      {isNegotiateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-3xl p-6 max-w-md w-full gradient-border-organic border-0 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-600" />
                <span>Price Negotiation & Counter-Offer</span>
              </h3>
              <button
                onClick={() => setIsNegotiateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleNegotiateSubmit} className="space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 gradient-border-organic border-0 text-slate-600 space-y-1">
                <div>Farmer Minimum Ask: <strong className="text-emerald-800">₹{match.negotiationRange.farmerMin}/kg</strong></div>
                <div>Buyer Max Budget: <strong className="text-blue-800">₹{match.negotiationRange.buyerMax}/kg</strong></div>
                <div>Estimated Fair Platform Equilibrium: <strong className="text-slate-900">₹{match.estimatedPricePerKg}/kg</strong></div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Counter-Proposal Price (₹/kg)
                </label>
                <input
                  type="range"
                  min={Math.max(10, match.negotiationRange.farmerMin - 3)}
                  max={match.negotiationRange.buyerMax + 3}
                  step="0.5"
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[11px] text-slate-500">Selected Counter:</span>
                  <span className="text-base font-extrabold text-emerald-800 font-mono">₹{counterPrice}/kg</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNegotiateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold shadow-xs transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Counter-Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
