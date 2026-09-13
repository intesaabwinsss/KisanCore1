import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Calendar, 
  Thermometer, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  Scale, 
  Plus, 
  ArrowRight, 
  Clock, 
  DollarSign, 
  Navigation, 
  ShieldCheck, 
  Eye, 
  X,
  ChevronRight,
  TrendingUp,
  Sliders,
  Filter,
  Info
} from 'lucide-react';
import { useTransportation } from '../context/TransportationContext';
import { useLanguage } from '../context/LanguageContext';
import { TruckOwnershipType, TruckTrip, RoleType } from '../types';
import { 
  calculateTransportationPricing, 
  getTransportationRate,
  PRESET_DISTANCES, 
  CRITICAL_TEST_CASES, 
  STANDARD_REEFER_TYPES, 
  POPULAR_AGRI_ROUTES 
} from '../utils/transportationPricing';
import { TransportationCostBreakdown } from './TransportationCostBreakdown';

interface KisanDirectTrucksPortalProps {
  onSelectRole?: (role: RoleType) => void;
  initialTab?: 'dashboard' | 'dispatch' | 'trips' | 'calculator' | 'fleet';
}

export const KisanDirectTrucksPortal: React.FC<KisanDirectTrucksPortalProps> = ({
  onSelectRole,
  initialTab = 'dashboard',
}) => {
  const { t, language } = useLanguage();
  const { 
    trips, 
    availableTrucks, 
    dispatchTrip, 
    stats 
  } = useTransportation();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'dispatch' | 'trips' | 'calculator' | 'fleet'>(initialTab);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [inspectingTrip, setInspectingTrip] = useState<TruckTrip | null>(null);

  // Dispatch Form State
  const [dispatchStep, setDispatchStep] = useState<1 | 2>(1);
  const [formCrop, setFormCrop] = useState('Fresh Green Chillies (Kolhapur Jwala)');
  const [formQuantityKg, setFormQuantityKg] = useState<number>(3500);
  const [formPickup, setFormPickup] = useState('Nashik Packhouse Yard, Pimpalgaon');
  const [formDestination, setFormDestination] = useState('Azadpur Terminal Mandi, Delhi');
  const [formDate, setFormDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [formTargetTemp, setFormTargetTemp] = useState<number>(12);

  // Step 2: Transportation State
  const [formOwnership, setFormOwnership] = useState<TruckOwnershipType>('kisandirect');
  const [formDistanceKm, setFormDistanceKm] = useState<number>(100);
  const [formBaseCostPerKm, setFormBaseCostPerKm] = useState<number>(25);
  const [formTruckType, setFormTruckType] = useState<string>(STANDARD_REEFER_TYPES[1].name);
  const [formCustomVehicle, setFormCustomVehicle] = useState<string>('');
  const [formCustomDriver, setFormCustomDriver] = useState<string>('');
  const [formCustomPhone, setFormCustomPhone] = useState<string>('');
  const [formValidationErrors, setFormValidationErrors] = useState<string[]>([]);

  // Rate Calculator Sandbox State
  const [calcDistance, setCalcDistance] = useState<number>(100);
  const [calcBaseCostPerKm, setCalcBaseCostPerKm] = useState<number>(25);
  const [calcOwnership, setCalcOwnership] = useState<TruckOwnershipType>('kisandirect');

  // Filter for trips
  const [tripFilter, setTripFilter] = useState<'all' | 'in_transit' | 'completed' | 'own' | 'kisandirect'>('all');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const formatRupee = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const validateStep1 = (): boolean => {
    const errs: string[] = [];
    if (!formCrop.trim()) errs.push('Please enter or select a crop');
    if (!formQuantityKg || formQuantityKg <= 0) errs.push(t('invalidQty'));
    if (!formPickup.trim()) errs.push('Please enter a pickup location');
    if (!formDestination.trim()) errs.push('Please enter a destination hub');
    setFormValidationErrors(errs);
    return errs.length === 0;
  };

  const validateStep2 = (): boolean => {
    const errs: string[] = [];
    if (!formDistanceKm || formDistanceKm <= 0) errs.push(t('invalidDistance'));
    if (!formBaseCostPerKm || formBaseCostPerKm <= 0) errs.push(t('invalidRate'));
    setFormValidationErrors(errs);
    return errs.length === 0;
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setDispatchStep(2);
    }
  };

  const handleFinalDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    const created = await dispatchTrip({
      crop: formCrop,
      quantityKg: formQuantityKg,
      pickupLocation: formPickup,
      destinationLocation: formDestination,
      distanceKm: formDistanceKm,
      baseCostPerKm: formBaseCostPerKm,
      ownershipType: formOwnership,
      truckType: formTruckType,
      requiredDate: formDate,
      targetTempC: formTargetTemp,
      customVehicleNumber: formCustomVehicle || undefined,
      customDriverName: formCustomDriver || undefined,
      customDriverPhone: formCustomPhone || undefined,
    });

    showToast(`${t('tripConfirmedSuccess')} (ID: ${created.id})`);
    setActiveTab('trips');
    setDispatchStep(1);
  };

  const handleSelectPopularRoute = (route: typeof POPULAR_AGRI_ROUTES[0]) => {
    setFormPickup(route.origin);
    setFormDestination(route.destination);
    setFormDistanceKm(route.distance);
  };

  const filteredTrips = trips.filter(t => {
    if (tripFilter === 'all') return true;
    if (tripFilter === 'in_transit') return t.status === 'In Transit';
    if (tripFilter === 'completed') return t.status === 'Delivered' || t.status === 'Completed';
    if (tripFilter === 'own') return t.ownershipType === 'own';
    if (tripFilter === 'kisandirect') return t.ownershipType === 'kisandirect';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl border border-emerald-500/80 shadow-2xl flex items-center gap-3 text-xs animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Hero Banner with Clear Purpose & Tabs */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white shadow-xl relative overflow-hidden">
        {/* Subtle glowing backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-extrabold uppercase tracking-wider">
              <Truck className="w-4 h-4 text-emerald-300" />
              <span>{t('kisanDirectTrucks')}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
              {t('trucksPortal')}
            </h1>

            <p className="text-sm text-emerald-100/80 leading-relaxed">
              {t('trucksPortalDesc')}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero Hidden Broker Cuts</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Thermometer className="w-4 h-4 text-cyan-300" />
                <span>{t('allProduceSafelyCooled')}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Truck className="w-4 h-4 text-amber-300" />
                <span>{t('networkTruckCount')}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() => {
                setActiveTab('dispatch');
                setDispatchStep(1);
              }}
              className="px-5 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{t('dispatchNewReeferTrip')}</span>
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center gap-2 active:scale-95"
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>{t('rateCalculator')}</span>
            </button>
          </div>
        </div>

        {/* Portal Sub-Navigation Tabs */}
        <div className="relative z-10 flex items-center gap-2 mt-8 pt-6 border-t border-slate-800 overflow-x-auto">
          {[
            { id: 'dashboard', label: t('dashboard'), icon: Layers },
            { id: 'dispatch', label: t('dispatchNewTrip'), icon: Plus },
            { id: 'trips', label: `${t('myTrips')} (${trips.length})`, icon: Navigation },
            { id: 'calculator', label: t('rateCalculator'), icon: Sliders },
            { id: 'fleet', label: t('availableTrucks'), icon: Truck },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Demo Data Disclaimer Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Notice: </span>
              <span>{t('demoFleetNotice')}</span>
            </div>
          </div>

          {/* Key Metric Blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="text-[11px] text-slate-500 font-bold uppercase">{t('availableTrucks')}</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {stats.availableTrucksCount}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Active Reefers in Hubs</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="text-[11px] text-slate-500 font-bold uppercase">{t('activeTrips')}</div>
              <div className="text-2xl font-black text-teal-800 mt-1">
                {stats.activeTripsCount}
              </div>
              <div className="text-[10px] text-teal-600 font-semibold mt-0.5">Live IoT GPS Stream</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="text-[11px] text-slate-500 font-bold uppercase">{t('upcomingTrips')}</div>
              <div className="text-2xl font-black text-slate-800 mt-1">
                {stats.upcomingTripsCount}
              </div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">Scheduled Bookings</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="text-[11px] text-slate-500 font-bold uppercase">{t('completedTrips')}</div>
              <div className="text-2xl font-black text-emerald-800 mt-1">
                {stats.completedTripsCount}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Zero thermal excursion</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="text-[11px] text-slate-500 font-bold uppercase">{t('totalSpending')}</div>
              <div className="text-xl font-black text-slate-900 mt-1">
                {formatRupee(stats.totalTransportationSpending)}
              </div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">100% Transparent Invoices</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="text-[11px] text-slate-500 font-bold uppercase">{t('avgCostPerKm')}</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                ₹{stats.averageCostPerKm}
                <span className="text-xs font-normal text-slate-400">/KM</span>
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Across All Routes</div>
            </div>
          </div>

          {/* Quick Dispatch CTA & Rate Preview Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Transparent Pricing Highlights */}
            <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  How KisanDirect Trucks Pricing Works
                </span>
                <h3 className="text-xl font-display font-black text-slate-900 mt-2">
                  Transparent Distance-Based Per-KM Formula
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Never pay arbitrary broker fees. The transportation price scales dynamically with actual route distance.
                </p>
              </div>

              {/* 2 Option Comparison Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🚚</span>
                    <h4 className="text-sm font-bold text-slate-900">{t('ownTruckYes')}</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    Use your own farm vehicle. Zero platform service charges.
                  </p>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800">
                    Distance × Operating Cost/KM = Total
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Example: 100 KM × ₹25/KM = <span className="font-bold text-slate-900">₹2,500</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🚛</span>
                    <h4 className="text-sm font-bold text-emerald-950">{t('ownTruckNo')}</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    Pre-cooled certified reefer trucks dispatched directly to your packhouse.
                  </p>
                  <div className="p-3 rounded-xl bg-white border border-emerald-200 text-xs font-semibold text-emerald-950">
                    Base Cost + Service Charge (₹5/KM first 15 KM, ₹3/KM beyond)
                  </div>
                  <div className="text-[11px] text-emerald-800">
                    Example: 100 KM = Base ₹2,500 + Svc ₹330 = <span className="font-bold">₹2,830</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <button
                  onClick={() => {
                    setActiveTab('dispatch');
                    setDispatchStep(1);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('dispatchNewTrip')}</span>
                </button>

                <button
                  onClick={() => setActiveTab('calculator')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <span>Test all critical distance test cases</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Col: Recent Consignments Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">{t('activeTrips')}</h3>
                <button
                  onClick={() => setActiveTab('trips')}
                  className="text-xs text-emerald-700 font-bold hover:underline"
                >
                  View all ({trips.length})
                </button>
              </div>

              <div className="space-y-3">
                {trips.slice(0, 3).map(trip => (
                  <div 
                    key={trip.id}
                    onClick={() => setInspectingTrip(trip)}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-900 truncate max-w-[140px]">
                        {trip.crop}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        {trip.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex justify-between">
                      <span className="truncate max-w-[120px]">{trip.destinationLocation}</span>
                      <span className="font-bold text-slate-800">{trip.distanceKm} KM</span>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200/60 font-medium">
                      <span className="text-[10px] text-slate-500">
                        {trip.ownershipType === 'kisandirect' ? '🚛 KisanDirect Trucks' : '🚚 Own Truck'}
                      </span>
                      <span className="font-extrabold text-slate-900">
                        {formatRupee(trip.totalCost)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DISPATCH NEW TRIP (Step 1 + Step 2) */}
      {activeTab === 'dispatch' && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                dispatchStep === 1 ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                1
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">{t('step1TripDetails')}</div>
                <div className="text-[10px] text-slate-500">Crop cargo, quantities, locations, dates</div>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-slate-300" />

            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                dispatchStep === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                2
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">{t('step2Transportation')}</div>
                <div className="text-[10px] text-slate-500">Own truck vs KisanDirect, distance & pricing</div>
              </div>
            </div>
          </div>

          {/* Validation Errors Notice */}
          {formValidationErrors.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Please correct the following:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 pl-2 text-[11px]">
                {formValidationErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* STEP 1: CARGO & ROUTE DETAILS */}
          {dispatchStep === 1 && (
            <form onSubmit={handleStep1Submit} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{t('step1TripDetails')}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter consignment specifications for refrigerated transport.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('cropProduce')}
                  </label>
                  <input
                    type="text"
                    value={formCrop}
                    onChange={(e) => setFormCrop(e.target.value)}
                    placeholder="e.g. Fresh Red Onions (Grade A)"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600 focus:border-emerald-600"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('cargoQuantityKg')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formQuantityKg}
                    onChange={(e) => setFormQuantityKg(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600 focus:border-emerald-600"
                    required
                  />
                  <div className="text-[10px] text-slate-400 mt-1">
                    {(formQuantityKg / 1000).toFixed(1)} Metric Tonnes (MT)
                  </div>
                </div>
              </div>

              {/* Popular Routes Quick Buttons */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 block">
                  {t('quickRoutePresets')}:
                </label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_AGRI_ROUTES.slice(0, 4).map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectPopularRoute(r)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-[10px] font-medium text-slate-700 border border-slate-200 transition-colors"
                    >
                      {r.origin.split(' ')[0]} ➔ {r.destination.split(' ')[0]} ({r.distance} KM)
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    📍 {t('pickupLocation')}
                  </label>
                  <input
                    type="text"
                    value={formPickup}
                    onChange={(e) => setFormPickup(e.target.value)}
                    placeholder="Origin packhouse or farm address"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600 focus:border-emerald-600"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    📍 {t('destination')}
                  </label>
                  <input
                    type="text"
                    value={formDestination}
                    onChange={(e) => setFormDestination(e.target.value)}
                    placeholder="Terminal cold store or APMC market"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600 focus:border-emerald-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    📅 {t('requiredDeliveryDate')}
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600 focus:border-emerald-600"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    ❄️ {t('temperatureRequirement')}
                  </label>
                  <input
                    type="number"
                    value={formTargetTemp}
                    onChange={(e) => setFormTargetTemp(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600 focus:border-emerald-600"
                    required
                  />
                  <div className="text-[10px] text-slate-400 mt-1">
                    Recommended: 0°C to 4°C for fruits/greens; 12°C to 15°C for onions/potatoes.
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end border-t border-slate-100">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <span>{t('proceedToStep2')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: CORE TRANSPORTATION & TRANSPARENT PRICING */}
          {dispatchStep === 2 && (
            <form onSubmit={handleFinalDispatch} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{t('step2Transportation')}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Confirm vehicle ownership and configure dynamic distance-based pricing.
                </p>
              </div>

              {/* SECTION 1: MANDATORY OWNERSHIP QUESTION */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/40 border-2 border-emerald-500/30 space-y-3">
                <label className="text-sm font-black text-slate-900 block">
                  🚜 {t('ownTruckQuestion')}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option A: Yes, I own my truck */}
                  <button
                    type="button"
                    onClick={() => setFormOwnership('own')}
                    className={`p-4 rounded-xl text-left border-2 transition-all flex items-start gap-3 ${
                      formOwnership === 'own'
                        ? 'bg-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                        : 'bg-white/80 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${formOwnership === 'own' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">
                        {t('ownTruckYes')}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        I will use my own reefer or pickup truck. No platform fee.
                      </div>
                    </div>
                  </button>

                  {/* Option B: No, I need KisanDirect Trucks */}
                  <button
                    type="button"
                    onClick={() => setFormOwnership('kisandirect')}
                    className={`p-4 rounded-xl text-left border-2 transition-all flex items-start gap-3 ${
                      formOwnership === 'kisandirect'
                        ? 'bg-emerald-50 border-emerald-600 shadow-md ring-2 ring-emerald-600/10'
                        : 'bg-white/80 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${formOwnership === 'kisandirect' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-emerald-950">
                        {t('ownTruckNo')}
                      </div>
                      <div className="text-[11px] text-emerald-800 mt-0.5">
                        {t('dontHaveTruckDesc')}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* SECTION 2: DYNAMIC DISTANCE INPUT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      📏 {t('distanceKm')}
                    </label>
                    <span className="text-xs font-black text-emerald-700">
                      {formDistanceKm} KM
                    </span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="3000"
                    value={formDistanceKm}
                    onChange={(e) => {
                      const d = Math.max(1, Number(e.target.value));
                      setFormDistanceKm(d);
                      setFormBaseCostPerKm(getTransportationRate(d));
                    }}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600 focus:border-emerald-600 font-bold text-slate-900"
                    required
                  />

                  {/* Distance Slider for Quick Dynamic Testing */}
                  <input
                    type="range"
                    min="1"
                    max="300"
                    value={formDistanceKm}
                    onChange={(e) => {
                      const d = Number(e.target.value);
                      setFormDistanceKm(d);
                      setFormBaseCostPerKm(getTransportationRate(d));
                    }}
                    className="w-full mt-2 accent-emerald-600"
                  />

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[10px] font-bold text-slate-400">Presets:</span>
                    {PRESET_DISTANCES.map(km => (
                      <button
                        key={km}
                        type="button"
                        onClick={() => {
                          setFormDistanceKm(km);
                          setFormBaseCostPerKm(getTransportationRate(km));
                        }}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors ${
                          formDistanceKm === km
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {km} KM
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    💰 {formOwnership === 'own' ? t('operatingCost') : t('baseCostPerKm')} (₹/KM)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={formBaseCostPerKm}
                    onChange={(e) => setFormBaseCostPerKm(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600 focus:border-emerald-600 font-bold text-slate-900"
                    required
                  />
                  <div className="text-[10px] text-slate-400 mt-1">
                    {formOwnership === 'own' 
                      ? "Enter your truck's actual fuel & maintenance cost per KM." 
                      : "Standard refrigerated carrier baseline rate (default ₹25/KM)."
                    }
                  </div>
                </div>
              </div>

              {/* Reefer Type Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  🚛 {t('truckReeferType')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {STANDARD_REEFER_TYPES.map(type => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => {
                        setFormTruckType(type.name);
                        if (formOwnership === 'kisandirect') {
                          setFormBaseCostPerKm(type.defaultRate);
                        }
                      }}
                      className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                        formTruckType === type.name
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="truncate">{type.name}</div>
                      <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                        {type.minTemp}°C to {type.maxTemp}°C • Base ₹{type.defaultRate}/KM
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom vehicle details if own truck */}
              {formOwnership === 'own' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Vehicle Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MH-15-AB-1234"
                      value={formCustomVehicle}
                      onChange={(e) => setFormCustomVehicle(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Driver Name
                    </label>
                    <input
                      type="text"
                      placeholder="Driver / Self name"
                      value={formCustomDriver}
                      onChange={(e) => setFormCustomDriver(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Driver Phone
                    </label>
                    <input
                      type="text"
                      placeholder="+91 98..."
                      value={formCustomPhone}
                      onChange={(e) => setFormCustomPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                </div>
              )}

              {/* EMBEDDED DYNAMIC REUSABLE BREAKDOWN COMPONENT (Section 13) */}
              <div className="pt-2">
                <TransportationCostBreakdown
                  distance={formDistanceKm}
                  baseCostPerKm={formBaseCostPerKm}
                  ownershipType={formOwnership}
                  showComparison={true}
                  showVisualIndicator={true}
                  showScalingTable={formOwnership === 'own'}
                />
              </div>

              {/* Form Action Controls */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDispatchStep(1)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  ← {t('backToStep1')}
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('confirmTrip')}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 3: MY TRIPS (Section 8) */}
      {activeTab === 'trips' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{t('myTrips')}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('myTripsSubtitle')}
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 overflow-x-auto">
              {[
                { id: 'all', label: 'All Trips' },
                { id: 'in_transit', label: 'In Transit' },
                { id: 'completed', label: 'Completed' },
                { id: 'kisandirect', label: 'KisanDirect Fleet' },
                { id: 'own', label: 'Own Trucks' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setTripFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    tripFilter === f.id
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Trips Grid / List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredTrips.map(trip => {
              const isKisanDirect = trip.ownershipType === 'kisandirect';
              return (
                <div
                  key={trip.id}
                  className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {trip.id}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          isKisanDirect 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {isKisanDirect ? '🚛 KisanDirect Trucks' : '🚚 Own Truck'}
                        </span>
                      </div>

                      <h4 className="text-base font-extrabold text-slate-900 mt-2">
                        {trip.crop}
                      </h4>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {(trip.quantityKg / 1000).toFixed(1)} MT • Vehicle: {trip.vehicleNumber}
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      trip.status === 'In Transit'
                        ? 'bg-teal-100 text-teal-800'
                        : trip.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      <Navigation className="w-3.5 h-3.5" />
                      {trip.status}
                    </span>
                  </div>

                  {/* Route & Progress */}
                  <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                    <div className="flex justify-between font-medium">
                      <span className="truncate max-w-[140px]">📍 {trip.pickupLocation}</span>
                      <span className="truncate max-w-[140px]">📍 {trip.destinationLocation}</span>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-600 h-full rounded-full transition-all"
                        style={{ width: `${trip.routeProgressPct}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Distance: <strong className="text-slate-700">{trip.distanceKm} KM</strong></span>
                      <span>ETA: <strong className="text-slate-700">{trip.eta}</strong></span>
                    </div>
                  </div>

                  {/* Cost & Action Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        {t('totalTransportationCost')}
                      </div>
                      <div className="text-lg font-black text-slate-900">
                        {formatRupee(trip.totalCost)}
                      </div>
                    </div>

                    <button
                      onClick={() => setInspectingTrip(trip)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t('viewBreakdown')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: RATE CALCULATOR & TIER SIMULATOR (Section 10 & 19 Test Cases) */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          <div className="max-w-3xl">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200">
              Interactive Transparency Lab
            </span>
            <h3 className="text-2xl font-display font-black text-slate-900 mt-1">
              {t('rateCalculator')}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              {t('rateCalculatorSubtitle')}
            </p>
          </div>

          {/* Test Case Quick Selection Matrix (All prompt critical test cases) */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Direct Verification Test Cases (Click to load):
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">
                Tested against exact SIH problem specifications
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {CRITICAL_TEST_CASES.map(tc => {
                const isActive = calcDistance === tc.distance;
                const expectedKisanDirect = calculateTransportationPricing(tc.distance, tc.expectedRate, 'kisandirect');
                return (
                  <button
                    key={tc.distance}
                    onClick={() => {
                      setCalcDistance(tc.distance);
                      setCalcBaseCostPerKm(tc.expectedRate);
                    }}
                    className={`p-2.5 rounded-xl text-center border transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <div className="text-xs font-black">{tc.distance} KM</div>
                    <div className="text-[10px] text-slate-500 font-semibold">₹{tc.expectedRate}/KM</div>
                    <div className={`text-[10px] font-bold mt-0.5 ${isActive ? 'text-emerald-300' : 'text-emerald-700'}`}>
                      {formatRupee(expectedKisanDirect.totalCost)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Calculator Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: Controls */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>Trip Parameters</span>
              </h4>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Transportation Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCalcOwnership('kisandirect')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      calcOwnership === 'kisandirect'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    🚛 KisanDirect
                  </button>
                  <button
                    onClick={() => setCalcOwnership('own')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      calcOwnership === 'own'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    🚚 Own Truck
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">{t('distanceKm')}</span>
                  <span className="text-emerald-700">{calcDistance} KM</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="300"
                  value={calcDistance}
                  onChange={(e) => {
                    const d = Number(e.target.value);
                    setCalcDistance(d);
                    setCalcBaseCostPerKm(getTransportationRate(d));
                  }}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1 KM</span>
                  <span>15 KM (Slab 1)</span>
                  <span>100 KM</span>
                  <span>300 KM</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('baseCostPerKm')} (₹/KM)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={calcBaseCostPerKm}
                  onChange={(e) => setCalcBaseCostPerKm(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">Slab Formula Recap:</div>
                <div>• First 15 KM: ₹5/KM</div>
                <div>• Beyond 15 KM: ₹3/KM</div>
                <div>• Total = (Distance × Base) + Service Charge</div>
              </div>
            </div>

            {/* Right 2 Cols: Live Breakdown Card */}
            <div className="lg:col-span-2">
              <TransportationCostBreakdown
                distance={calcDistance}
                baseCostPerKm={calcBaseCostPerKm}
                ownershipType={calcOwnership}
                showComparison={true}
                showVisualIndicator={true}
                showScalingTable={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AVAILABLE FLEET NETWORK */}
      {activeTab === 'fleet' && (
        <div className="space-y-6">
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Notice: </span>
              <span>{t('demoFleetNotice')}</span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">{t('availableTrucks')}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified cold-chain reefer vehicles positioned at APMC packhouse yards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {availableTrucks.map(truck => (
              <div 
                key={truck.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {truck.vehicleNumber}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 mt-2">
                      {truck.truckType}
                    </h4>
                    <div className="text-xs text-slate-500">
                      Capacity: {truck.capacityMT} MT • Rating: ★ {truck.rating}
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Ready
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 text-xs text-slate-600 space-y-1">
                  <div>📍 Yard: <strong className="text-slate-800">{truck.currentHub}</strong></div>
                  <div>❄️ Temp Range: <strong className="text-slate-800">{truck.tempRange}</strong></div>
                  <div>👤 Captain: <strong className="text-slate-800">{truck.driverName}</strong> ({truck.driverPhone})</div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400">Baseline Rate</span>
                    <div className="font-extrabold text-slate-900">₹{truck.baseRatePerKm}/KM</div>
                  </div>

                  <button
                    onClick={() => {
                      setFormTruckType(truck.truckType);
                      setFormBaseCostPerKm(truck.baseRatePerKm);
                      setFormOwnership('kisandirect');
                      setActiveTab('dispatch');
                      setDispatchStep(1);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    Book This Reefer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INSPECT TRIP MODAL (From My Trips) */}
      {inspectingTrip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Trip Telemetry & Invoice</span>
                <h3 className="text-base font-bold text-slate-900">{inspectingTrip.id} • {inspectingTrip.crop}</h3>
              </div>
              <button
                onClick={() => setInspectingTrip(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <TransportationCostBreakdown
              distance={inspectingTrip.distanceKm}
              baseCostPerKm={inspectingTrip.baseCostPerKm}
              ownershipType={inspectingTrip.ownershipType}
              showComparison={true}
              showVisualIndicator={true}
            />

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setInspectingTrip(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
