import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  Layers,
  Sliders,
  RotateCcw,
  CheckCircle2,
  Tractor,
  Building2,
  TrendingUp,
  Truck,
  MapPin,
  Calendar,
  ShieldCheck,
  Plus,
  ArrowUpDown,
  Coins,
  Package,
} from 'lucide-react';
import { useSmartMatching, MatchingFilterTab } from '../context/SmartMatchingContext';
import { SmartMatchCard } from './SmartMatchCard';
import { MultiFarmerBundleCard } from './MultiFarmerBundleCard';
import { SmartMatchingSimulator } from './SmartMatchingSimulator';
import { ProduceCategory, QualityGrade, BuyerUrgencyLevel } from '../types';

export const SmartMatchingDashboard: React.FC = () => {
  const {
    matches,
    multiFarmerBundles,
    analytics,
    isLoading,
    activeFilterTab,
    setActiveFilterTab,
    searchQuery,
    setSearchQuery,
    selectedCropFilter,
    setSelectedCropFilter,
    actionMessage,
    clearActionMessage,
    resetToDemoData,
    addFarmerListing,
    addBuyerRequirement,
  } = useSmartMatching();

  const [perspective, setPerspective] = useState<'all' | 'farmer' | 'buyer' | 'bundles' | 'simulator'>('all');
  const [isAddListingModalOpen, setIsAddListingModalOpen] = useState(false);
  const [isAddDemandModalOpen, setIsAddDemandModalOpen] = useState(false);

  // Form states for New Farmer Listing
  const [newFarmerName, setNewFarmerName] = useState('');
  const [newFarmerCrop, setNewFarmerCrop] = useState('Tomato');
  const [newFarmerVariety, setNewFarmerVariety] = useState('Abhinav Hybrid F1');
  const [newFarmerCategory, setNewFarmerCategory] = useState<ProduceCategory>('Vegetables');
  const [newFarmerQty, setNewFarmerQty] = useState(600);
  const [newFarmerPrice, setNewFarmerPrice] = useState(19);
  const [newFarmerGrade, setNewFarmerGrade] = useState<QualityGrade>('A');
  const [newFarmerHarvest, setNewFarmerHarvest] = useState('2026-09-10');
  const [newFarmerLocation, setNewFarmerLocation] = useState('Greater Noida');
  const [newFarmerOrganic, setNewFarmerOrganic] = useState(true);

  // Form states for New Buyer Demand
  const [newBuyerCompany, setNewBuyerCompany] = useState('');
  const [newBuyerType, setNewBuyerType] = useState<'Restaurant' | 'Retailer' | 'Supermarket Chain' | 'Food Processor'>('Restaurant');
  const [newBuyerCrop, setNewBuyerCrop] = useState('Tomato');
  const [newBuyerVariety, setNewBuyerVariety] = useState('Hybrid F1');
  const [newBuyerCategory, setNewBuyerCategory] = useState<ProduceCategory>('Vegetables');
  const [newBuyerQty, setNewBuyerQty] = useState(500);
  const [newBuyerMaxBudget, setNewBuyerMaxBudget] = useState(24);
  const [newBuyerLocation, setNewBuyerLocation] = useState('Noida Sector 62');
  const [newBuyerDeliveryDate, setNewBuyerDeliveryDate] = useState('2026-09-11');
  const [newBuyerUrgency, setNewBuyerUrgency] = useState<BuyerUrgencyLevel>('high');

  // Filter and Sort Logic
  const filteredMatches = matches.filter((m) => {
    // Commodity filter
    if (selectedCropFilter !== 'All' && m.farmerListing.cropName.toLowerCase() !== selectedCropFilter.toLowerCase()) {
      return false;
    }

    // Text search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${m.farmerListing.cropName} ${m.farmerListing.farmerName} ${m.buyerRequirement.buyerCompany} ${m.farmerListing.location.name} ${m.buyerRequirement.deliveryLocation.name}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    // Perspective filter
    if (perspective === 'farmer') {
      // Show top matches for farmers
      return true;
    }
    if (perspective === 'buyer') {
      // Show top matches for buyers
      return true;
    }

    return true;
  });

  // Sorting according to active filter tab
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    if (activeFilterTab === 'best_price') {
      return a.estimatedPricePerKg - b.estimatedPricePerKg;
    }
    if (activeFilterTab === 'nearest') {
      return a.distanceKm - b.distanceKm;
    }
    if (activeFilterTab === 'highest_qty') {
      return b.matchedQuantityKg - a.matchedQuantityKg;
    }
    if (activeFilterTab === 'freshest') {
      return b.freshnessScore - a.freshnessScore;
    }
    if (activeFilterTab === 'urgent') {
      const urgMap: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
      return (urgMap[b.buyerRequirement.urgency] || 1) - (urgMap[a.buyerRequirement.urgency] || 1);
    }
    // Default: recommended score
    return b.matchScore - a.matchScore;
  });

  const availableCrops = ['All', 'Tomato', 'Onion', 'Potato', 'Basmati Rice'];

  const handleCreateListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFarmerListing({
      farmerId: `farmer-${Date.now()}`,
      farmerName: newFarmerName || 'Local Verified Farmer',
      farmerPhone: '+91 98100 88210',
      cropName: newFarmerCrop,
      variety: newFarmerVariety,
      category: newFarmerCategory,
      quantityAvailableKg: Number(newFarmerQty),
      unit: 'kg',
      minimumPricePerKg: Number(newFarmerPrice),
      qualityGrade: newFarmerGrade,
      harvestDate: newFarmerHarvest,
      shelfLifeDays: 7,
      location: {
        name: newFarmerLocation,
        district: 'Gautam Buddha Nagar',
        state: 'Uttar Pradesh',
        latitude: 28.4744,
        longitude: 77.504,
      },
      isOrganic: newFarmerOrganic,
      chemicalFree: true,
      coldChainStored: true,
      packagingType: 'Plastic Crates',
    });
    setIsAddListingModalOpen(false);
    setNewFarmerName('');
  };

  const handleCreateDemandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBuyerRequirement({
      buyerId: `buyer-${Date.now()}`,
      buyerName: 'Procurement Officer',
      buyerCompany: newBuyerCompany || 'Urban Culinary Co',
      buyerType: newBuyerType,
      buyerPhone: '+91 98110 55432',
      cropRequired: newBuyerCrop,
      variety: newBuyerVariety,
      category: newBuyerCategory,
      quantityRequiredKg: Number(newBuyerQty),
      maximumBudgetPerKg: Number(newBuyerMaxBudget),
      qualityRequirement: 'A',
      deliveryLocation: {
        name: newBuyerLocation,
        district: 'Gautam Buddha Nagar',
        state: 'Uttar Pradesh',
        latitude: 28.5355,
        longitude: 77.391,
      },
      requiredDeliveryDate: newBuyerDeliveryDate,
      urgency: newBuyerUrgency,
      isOrganicRequired: false,
    });
    setIsAddDemandModalOpen(false);
    setNewBuyerCompany('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in">
      {/* Toast Action Notification */}
      {actionMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between border shadow-sm ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
              : actionMessage.type === 'error'
              ? 'bg-rose-50 text-rose-950 border-rose-300'
              : 'bg-blue-50 text-blue-950 border-blue-300'
          }`}
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>{actionMessage.text}</span>
          </div>
          <button
            onClick={clearActionMessage}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hero Header Strip */}
      <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Smart Farmer–Buyer Matching Engine 🤖</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Direct Supply-Demand Algorithmic Pairing
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Automated multi-factor matching engine evaluating <strong>Product compatibility</strong>,{' '}
              <strong>Quantity fulfillment</strong>, <strong>Geographic proximity</strong>,{' '}
              <strong>Price boundaries</strong>, <strong>Logistics freight costs</strong>, and{' '}
              <strong>Harvest freshness synchronization</strong> to eliminate intermediaries.
            </p>
          </div>

          {/* Action Hub */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsAddListingModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <Tractor className="w-4 h-4" />
              <span>+ Post Harvest Lot</span>
            </button>

            <button
              onClick={() => setIsAddDemandModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4" />
              <span>+ Post Buyer Demand</span>
            </button>

            <button
              onClick={resetToDemoData}
              title="Reset to canonical Farmer A/B/C and Restaurant A/Retailer B demo dataset"
              className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-xs transition-all flex items-center gap-1.5 border border-white/20"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>

        {/* 4 Stats Chips in Hero */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-emerald-800/60 text-xs">
          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <div className="text-emerald-300 text-[10px] font-bold uppercase">Ranked Matches</div>
            <div className="text-xl font-black text-white mt-0.5">{matches.length} Lots</div>
            <div className="text-[10px] text-emerald-200/80">Active in Region</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <div className="text-emerald-300 text-[10px] font-bold uppercase">Avg Match Score</div>
            <div className="text-xl font-black text-white mt-0.5">{analytics.avgMatchScore}%</div>
            <div className="text-[10px] text-emerald-200/80">High Compatibility</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <div className="text-emerald-300 text-[10px] font-bold uppercase">Multi-Farmer Bundles</div>
            <div className="text-xl font-black text-white mt-0.5">{multiFarmerBundles.length} Bundles</div>
            <div className="text-[10px] text-emerald-200/80">Pooled Volumes</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <div className="text-emerald-300 text-[10px] font-bold uppercase">Logistics Savings</div>
            <div className="text-xl font-black text-white mt-0.5">₹{analytics.avgDeliveryCostSavings}</div>
            <div className="text-[10px] text-emerald-200/80">Per Matched Batch</div>
          </div>
        </div>
      </div>

      {/* Perspective Switcher Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl gradient-border-organic border-0 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => {
              setPerspective('all');
              if (activeFilterTab === 'bundles') setActiveFilterTab('recommended');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              perspective === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All Platform Matches</span>
          </button>

          <button
            onClick={() => setPerspective('farmer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              perspective === 'farmer'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Tractor className="w-3.5 h-3.5" />
            <span>Farmer Recommendation View</span>
          </button>

          <button
            onClick={() => setPerspective('buyer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              perspective === 'buyer'
                ? 'bg-blue-800 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Buyer Procurement View</span>
          </button>

          <button
            onClick={() => {
              setPerspective('bundles');
              setActiveFilterTab('bundles');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              perspective === 'bundles'
                ? 'bg-purple-800 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Multi-Farmer Synergy Bundles ({multiFarmerBundles.length})</span>
          </button>

          <button
            onClick={() => setPerspective('simulator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              perspective === 'simulator'
                ? 'bg-indigo-800 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Algorithm Sandbox</span>
          </button>
        </div>

        {/* View Count */}
        <div className="text-xs text-slate-500 font-semibold px-3">
          Showing {sortedMatches.length} Matches
        </div>
      </div>

      {/* When in Simulator View */}
      {perspective === 'simulator' ? (
        <SmartMatchingSimulator />
      ) : perspective === 'bundles' || activeFilterTab === 'bundles' ? (
        /* Multi-Farmer Bundles View */
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-700 shrink-0" />
              <span>
                <strong>Multi-Farmer Optimization Engine:</strong> Automatically bundles multiple small-to-medium farmers together to fulfill large commercial demand lots (e.g. 1,000 kg Tomato requirement).
              </span>
            </div>
          </div>

          {multiFarmerBundles.length === 0 ? (
            <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-3xl p-12 text-center gradient-border-organic border-0 space-y-3">
              <Layers className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-700">No Multi-Farmer Bundles Required</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Existing buyer requirements can be satisfied by single farmers or no large demand (&gt;= 500kg) is active.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {multiFarmerBundles.map((bundle) => (
                <MultiFarmerBundleCard key={bundle.id} bundle={bundle} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Standard Matches View */
        <div className="space-y-5">
          {/* Filter Tabs & Search Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
              {(
                [
                  { id: 'recommended', label: 'Top Score 🤖' },
                  { id: 'best_price', label: 'Best Price 🏷️' },
                  { id: 'nearest', label: 'Nearest 📍' },
                  { id: 'highest_qty', label: 'Highest Volume 📦' },
                  { id: 'freshest', label: 'Freshest 🌿' },
                  { id: 'urgent', label: 'Urgent ⚡' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilterTab(tab.id as MatchingFilterTab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeFilterTab === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search & Commodity Filters */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search farmers, buyers, cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs rounded-xl gradient-border-organic border-0 bg-white focus:outline-emerald-600 w-48 sm:w-60"
                />
              </div>

              <select
                value={selectedCropFilter}
                onChange={(e) => setSelectedCropFilter(e.target.value)}
                className="px-3 py-1.5 text-xs font-bold rounded-xl gradient-border-organic border-0 bg-white text-slate-800 focus:outline-emerald-600"
              >
                {availableCrops.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop === 'All' ? 'All Commodities' : crop}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Match Cards Grid */}
          {sortedMatches.length === 0 ? (
            <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-3xl p-12 text-center gradient-border-organic border-0 space-y-3">
              <Search className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-700">No Matching Pairs Found</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No active listings and requirements matched your search criteria. Try selecting "All Commodities" or resetting to the demo dataset.
              </p>
              <button
                onClick={resetToDemoData}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Listings</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedMatches.map((match) => (
                <SmartMatchCard
                  key={match.id}
                  match={match}
                  userRole={perspective === 'all' ? 'all' : perspective === 'farmer' ? 'farmer' : 'buyer'}
                  onFindAdditionalFarmers={(crop, remainingKg) => {
                    setPerspective('bundles');
                    setActiveFilterTab('bundles');
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Post New Farmer Harvest Lot */}
      {isAddListingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-3xl p-6 max-w-lg w-full gradient-border-organic border-0 shadow-xl space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Tractor className="w-4 h-4 text-emerald-700" />
                <span>List New Farm Harvest Lot</span>
              </h3>
              <button
                onClick={() => setIsAddListingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateListingSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Farmer / Farm Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rameshwar Patil (Nashik Collective)"
                  value={newFarmerName}
                  onChange={(e) => setNewFarmerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Crop Name</label>
                  <input
                    type="text"
                    required
                    value={newFarmerCrop}
                    onChange={(e) => setNewFarmerCrop(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Variety</label>
                  <input
                    type="text"
                    value={newFarmerVariety}
                    onChange={(e) => setNewFarmerVariety(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Quantity Available (kg)</label>
                  <input
                    type="number"
                    required
                    value={newFarmerQty}
                    onChange={(e) => setNewFarmerQty(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Min Floor Price (₹/kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newFarmerPrice}
                    onChange={(e) => setNewFarmerPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Farm Location</label>
                  <input
                    type="text"
                    required
                    value={newFarmerLocation}
                    onChange={(e) => setNewFarmerLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Harvest Date</label>
                  <input
                    type="date"
                    required
                    value={newFarmerHarvest}
                    onChange={(e) => setNewFarmerHarvest(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="organic-chk"
                  checked={newFarmerOrganic}
                  onChange={(e) => setNewFarmerOrganic(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <label htmlFor="organic-chk" className="text-slate-700 font-bold cursor-pointer">
                  Certified Organic / Chemical Free
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddListingModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                >
                  Publish & Calculate Matches
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Post New Buyer Demand */}
      {isAddDemandModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-3xl p-6 max-w-lg w-full gradient-border-organic border-0 shadow-xl space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-700" />
                <span>Post Institutional Buyer Requirement</span>
              </h3>
              <button
                onClick={() => setIsAddDemandModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDemandSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Company / Restaurant Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Taj City Centre / Haldirams Processing Unit"
                  value={newBuyerCompany}
                  onChange={(e) => setNewBuyerCompany(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Crop Required</label>
                  <input
                    type="text"
                    required
                    value={newBuyerCrop}
                    onChange={(e) => setNewBuyerCrop(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Buyer Type</label>
                  <select
                    value={newBuyerType}
                    onChange={(e) => setNewBuyerType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  >
                    <option value="Restaurant">Restaurant</option>
                    <option value="Retailer">Retailer</option>
                    <option value="Supermarket Chain">Supermarket Chain</option>
                    <option value="Food Processor">Food Processor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Required Quantity (kg)</label>
                  <input
                    type="number"
                    required
                    value={newBuyerQty}
                    onChange={(e) => setNewBuyerQty(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Max Ceiling Budget (₹/kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newBuyerMaxBudget}
                    onChange={(e) => setNewBuyerMaxBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Delivery Destination</label>
                  <input
                    type="text"
                    required
                    value={newBuyerLocation}
                    onChange={(e) => setNewBuyerLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Required Delivery Date</label>
                  <input
                    type="date"
                    required
                    value={newBuyerDeliveryDate}
                    onChange={(e) => setNewBuyerDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Urgency Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['urgent', 'high', 'medium', 'low'] as const).map((urg) => (
                    <button
                      key={urg}
                      type="button"
                      onClick={() => setNewBuyerUrgency(urg)}
                      className={`py-1.5 rounded-xl font-bold capitalize border ${
                        newBuyerUrgency === urg
                          ? 'bg-blue-800 text-white border-blue-900'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {urg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddDemandModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold"
                >
                  Post Demand & Trigger Matching
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
