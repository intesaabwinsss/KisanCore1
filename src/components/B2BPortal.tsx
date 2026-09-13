import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Coins, 
  ShieldCheck, 
  FileText, 
  ChevronRight,
  TrendingUp,
  MapPin,
  Truck,
  Sparkles,
  Bell
} from 'lucide-react';
import { RFQItem, Language } from '../types';
import { MOCK_RFQS } from '../data/mockData';
import { usePriceAlerts } from '../context/PriceAlertContext';
import { useSmartMatching } from '../context/SmartMatchingContext';
import { SmartMatchCard } from './SmartMatchCard';
import { MultiFarmerBundleCard } from './MultiFarmerBundleCard';

interface B2BPortalProps {
  currentLanguage?: Language;
  onInspectTraceability?: (produce: any) => void;
  onAddToCart?: (produce: any) => void;
}

export const B2BPortal: React.FC<B2BPortalProps> = () => {
  const { openCreateAlertModal } = usePriceAlerts();
  const { matches, multiFarmerBundles } = useSmartMatching();
  const [b2bTab, setB2bTab] = useState<'rfqs' | 'smart_matches' | 'bundles'>('rfqs');
  const [rfqs, setRfqs] = useState<RFQItem[]>(MOCK_RFQS);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  
  // Modals
  const [isPostRfqOpen, setIsPostRfqOpen] = useState(false);
  const [biddingRfq, setBiddingRfq] = useState<RFQItem | null>(null);
  const [bidPrice, setBidPrice] = useState<number>(0);
  const [bidSuccess, setBidSuccess] = useState<string | null>(null);

  // New RFQ form state
  const [newCompany, setNewCompany] = useState('');
  const [newCrop, setNewCrop] = useState('Red Onion');
  const [newVariety, setNewVariety] = useState('Medium 50mm+');
  const [newMT, setNewMT] = useState(30);
  const [newTargetPrice, setNewTargetPrice] = useState(38);
  const [newLocation, setNewLocation] = useState('Vashi Cold Hub, Navi Mumbai');

  const filteredRfqs = rfqs.filter((item) => {
    const matchesSearch = item.cropRequired.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.buyerCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.deliveryLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || item.buyerType === filterType;
    return matchesSearch && matchesFilter;
  });

  const handlePostRfq = (e: React.FormEvent) => {
    e.preventDefault();
    const created: RFQItem = {
      id: `rfq-${Date.now()}`,
      buyerName: 'Institutional Procurement Desk',
      buyerCompany: newCompany || 'Pan-India Retail Chains',
      buyerType: 'Supermarket Chain',
      cropRequired: newCrop,
      variety: newVariety,
      quantityMT: Number(newMT),
      targetPricePerKg: Number(newTargetPrice),
      deliveryLocation: newLocation,
      deadlineDate: '2026-09-10',
      status: 'Open',
      bidsCount: 0,
      verifiedBuyer: true,
      paymentTerms: '100% KisanMandi Escrow Secured',
    };

    setRfqs([created, ...rfqs]);
    setIsPostRfqOpen(false);
    setNewCompany('');
  };

  const handleConfirmBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (biddingRfq) {
      setRfqs(rfqs.map(r => r.id === biddingRfq.id ? { ...r, bidsCount: r.bidsCount + 1 } : r));
      setBidSuccess(`Bid of ₹${bidPrice}/kg submitted for ${biddingRfq.quantityMT} MT of ${biddingRfq.cropRequired}. Buyer notified!`);
      setBiddingRfq(null);
      setTimeout(() => setBidSuccess(null), 5000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-700/80 border border-emerald-500/40 flex items-center justify-center text-white shrink-0">
            <Building2 className="w-8 h-8 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-display font-extrabold text-white">
                B2B Bulk Institutional Procurement
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                Verified Enterprise Hub
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 mt-1">
              Direct contracts for supermarket chains, export houses, and food processing conglomerates.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsPostRfqOpen(true)}
          className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Bulk RFQ</span>
        </button>
      </div>

      {bidSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{bidSuccess}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white gradient-border-organic border-0 shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Active Open RFQs</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {rfqs.length} Demands
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">256 MT Total Required</div>
        </div>
        <div className="p-5 rounded-2xl bg-white gradient-border-organic border-0 shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Institutional Buyers</div>
          <div className="text-2xl font-extrabold text-emerald-900 mt-1">1,840+</div>
          <div className="text-[11px] text-slate-400 font-medium mt-0.5">100% GST & APEDA verified</div>
        </div>
        <div className="p-5 rounded-2xl bg-white gradient-border-organic border-0 shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Escrow Settlement</div>
          <div className="text-2xl font-extrabold text-emerald-800 mt-1">T+1 Day</div>
          <div className="text-[11px] text-slate-400 font-medium mt-0.5">Instant gate receipt payout</div>
        </div>
        <div className="p-5 rounded-2xl bg-white gradient-border-organic border-0 shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Procurement Savings</div>
          <div className="text-2xl font-extrabold text-emerald-900 mt-1">14.8%</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">vs APMC commission agents</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setB2bTab('rfqs')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            b2bTab === 'rfqs'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Open Bulk RFQ Demands ({rfqs.length})</span>
        </button>

        <button
          onClick={() => setB2bTab('smart_matches')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            b2bTab === 'smart_matches'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Direct Farmer Matches ({matches.length})</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
            AI Scored
          </span>
        </button>

        <button
          onClick={() => setB2bTab('bundles')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            b2bTab === 'bundles'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
          }`}
        >
          <Truck className="w-4 h-4 text-emerald-600" />
          <span>Multi-Farmer Consolidated Bundles ({multiFarmerBundles.length})</span>
        </button>
      </div>

      {b2bTab === 'smart_matches' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>Direct Farmer Supply Matches:</strong> Ranked based on price compatibility, shortest freight transit distance, and harvest readiness.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {matches.map((match) => (
              <SmartMatchCard key={match.id} match={match} userRole="buyer" />
            ))}
          </div>
        </div>
      )}

      {b2bTab === 'bundles' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>Consolidated Multi-Farmer Procurement:</strong> Aggregates small/medium farmers to satisfy bulk tonnage demands with optimized pickup routes and unified escrow.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {multiFarmerBundles.map((bundle) => (
              <MultiFarmerBundleCard key={bundle.id} bundle={bundle} />
            ))}
          </div>
        </div>
      )}

      {b2bTab === 'rfqs' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-4 rounded-2xl gradient-border-organic border-0">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search crop, company, or delivery hub..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs gradient-border-organic border-0 rounded-xl focus:outline-emerald-600"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {['All', 'Supermarket Chain', 'Food Processor', 'Export House', 'Restaurant Group'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                    filterType === type
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* RFQ Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredRfqs.map((rfq) => (
              <div
                key={rfq.id}
                className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-6 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {rfq.buyerType}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-2">
                        {rfq.cropRequired} ({rfq.variety})
                      </h3>
                      <div className="text-xs text-slate-500 font-medium">
                        {rfq.buyerCompany}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-extrabold text-emerald-900">
                        {rfq.quantityMT} MT
                      </div>
                      <div className="text-[11px] text-slate-400">Target: ₹{rfq.targetPricePerKg}/kg</div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">Destination: {rfq.deliveryLocation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Submission Deadline: {rfq.deadlineDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-emerald-800 font-medium">{rfq.paymentTerms}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() =>
                      openCreateAlertModal({
                        commodityName: rfq.cropRequired,
                        variety: rfq.variety,
                        targetPrice: rfq.targetPricePerKg,
                        unit: '₹/kg',
                        condition: 'BELOW_OR_EQUAL',
                        priceType: 'KISAN_DIRECT',
                        note: `Procurement Target for ${rfq.buyerCompany}`,
                      })
                    }
                    className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 gradient-border-organic border-0 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    title="Set Price Alert for this RFQ Target"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Set Price Alert</span>
                  </button>

                  <button
                    onClick={() => {
                      setBiddingRfq(rfq);
                      setBidPrice(rfq.targetPricePerKg);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors"
                  >
                    Submit Lot Quote / Bid
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Post RFQ Modal */}
      {isPostRfqOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 gradient-border-organic border-0 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Post Institutional Procurement RFQ
              </h3>
              <button
                onClick={() => setIsPostRfqOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>

            <form onSubmit={handlePostRfq} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. BigBasket Wholesale Hub"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Crop Required
                  </label>
                  <input
                    type="text"
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Variety Specification
                  </label>
                  <input
                    type="text"
                    value={newVariety}
                    onChange={(e) => setNewVariety(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Volume (Metric Tonnes)
                  </label>
                  <input
                    type="number"
                    value={newMT}
                    onChange={(e) => setNewMT(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Target Price per kg (₹)
                  </label>
                  <input
                    type="number"
                    value={newTargetPrice}
                    onChange={(e) => setNewTargetPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600"
                    required
                  />
                </div>
              </div>

              {/* Option A Transparent Fee Calculation */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1.5">
                <div className="font-bold text-emerald-950 flex items-center justify-between">
                  <span>Procurement Cost Breakdown (Option A)</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">2% Buyer Fee</span>
                </div>
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>Farmer Batch Value (100% Direct):</span>
                  <span className="font-semibold text-slate-900">₹{(newMT * 1000 * newTargetPrice).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>Platform Facilitation & Escrow (2.0%):</span>
                  <span className="font-semibold text-emerald-900">₹{(newMT * 1000 * newTargetPrice * 0.02).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>Farmer Commission Deducted:</span>
                  <span className="font-bold text-emerald-700">₹0 (0% Free)</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold pt-1 border-t border-emerald-200 text-xs">
                  <span>Total Escrow Deposit:</span>
                  <span className="text-emerald-950 font-mono">₹{(newMT * 1000 * newTargetPrice * 1.02).toLocaleString()}</span>
                </div>
                <div className="text-[10px] text-emerald-700 font-medium">
                  ✓ Saves ~₹{(newMT * 1000 * newTargetPrice * 0.06).toLocaleString()} vs traditional 8% APMC commission agents
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Delivery Fulfillment Hub
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600"
                  required
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsPostRfqOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm"
                >
                  Broadcast RFQ to FPOs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Bid Modal */}
      {biddingRfq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-4 gradient-border-organic border-0 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Submit Bid for {biddingRfq.cropRequired}
              </h3>
              <button
                onClick={() => setBiddingRfq(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <div>Buyer: <strong>{biddingRfq.buyerCompany}</strong></div>
              <div>Required Volume: <strong>{biddingRfq.quantityMT} MT</strong></div>
              <div>Buyer Target: <strong>₹{biddingRfq.targetPricePerKg}/kg</strong></div>
            </div>

            <form onSubmit={handleConfirmBid} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Your Offer Price per kg (₹)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={bidPrice}
                  onChange={(e) => setBidPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600 font-bold text-emerald-900"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 text-[11px] text-emerald-900 font-medium">
                Total Contract Value: <strong>₹{(bidPrice * biddingRfq.quantityMT * 1000).toLocaleString()}</strong> with 0% platform deductions.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBiddingRfq(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm"
                >
                  Confirm & Lock Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
