import React, { useState } from 'react';
import { 
  Truck, 
  Thermometer, 
  Droplets, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  ShieldCheck,
  Navigation,
  FileText,
  Layers,
  ExternalLink,
  Sliders,
  Scale
} from 'lucide-react';
import { Shipment, Language, TruckOwnershipType } from '../types';
import { MOCK_SHIPMENTS } from '../data/mockData';
import { calculateTransportationPricing, getTransportationRate, PRESET_DISTANCES, STANDARD_REEFER_TYPES } from '../utils/transportationPricing';
import { TransportationCostBreakdown } from './TransportationCostBreakdown';
import { useLanguage } from '../context/LanguageContext';
import { useTransportation } from '../context/TransportationContext';

interface LogisticsPortalProps {
  onNavigateToTrucks?: () => void;
}

export const LogisticsPortal: React.FC<LogisticsPortalProps> = ({ onNavigateToTrucks }) => {
  const { t } = useLanguage();
  const { dispatchTrip } = useTransportation();
  const [shipments, setShipments] = useState<Shipment[]>(MOCK_SHIPMENTS);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal Form State
  const [newCrop, setNewCrop] = useState('Fresh Green Chillies (16 MT)');
  const [newOrigin, setNewOrigin] = useState('Guntur Packhouse Yard, Andhra Pradesh');
  const [newDest, setNewDest] = useState('Azadpur Terminal Cold Store, Delhi');
  const [newTargetTemp, setNewTargetTemp] = useState(12);
  const [newVehicle, setNewVehicle] = useState('AP-07-TT-8890 (Reefer 24ft)');

  // Transportation Cost Engine State
  const [ownershipType, setOwnershipType] = useState<TruckOwnershipType>('kisandirect');
  const [distanceKm, setDistanceKm] = useState<number>(100);
  const [baseCostPerKm, setBaseCostPerKm] = useState<number>(25);
  const [selectedTruckType, setSelectedTruckType] = useState<string>(STANDARD_REEFER_TYPES[1].name);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDispatchShipment = (e: React.FormEvent) => {
    e.preventDefault();

    const pricing = calculateTransportationPricing(distanceKm, baseCostPerKm, ownershipType);

    const created: Shipment = {
      id: `shp-${Date.now()}`,
      lotId: `LOT-${Math.floor(100 + Math.random() * 900)}`,
      cropName: newCrop,
      quantityMT: 16,
      originFarm: newOrigin,
      destinationHub: newDest,
      driverName: ownershipType === 'kisandirect' ? 'Harbhajan Singh' : 'Self / Farm Driver',
      driverPhone: '+91 98480 33119',
      vehicleNumber: newVehicle,
      temperatureC: Number(newTargetTemp) + 0.2,
      targetTempC: Number(newTargetTemp),
      humidityPct: 75,
      transitStatus: 'In Transit',
      departureTime: (() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      })(),
      eta: 'Tomorrow 08:00',
      routeProgressPct: 15,
      coldChainCompliant: true,
    };

    // Also sync to global transportation trips context
    dispatchTrip({
      crop: newCrop,
      quantityKg: 16000,
      pickupLocation: newOrigin,
      destinationLocation: newDest,
      distanceKm: pricing.distance,
      baseCostPerKm: pricing.baseCostPerKm,
      ownershipType,
      truckType: selectedTruckType,
      requiredDate: new Date().toISOString().split('T')[0],
      targetTempC: newTargetTemp,
      customVehicleNumber: newVehicle,
    });

    setShipments([created, ...shipments]);
    setIsDispatchModalOpen(false);

    const formattedCost = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(pricing.totalCost);

    showToast(`Consignment dispatched! Total Transportation Cost: ${formattedCost} (${distanceKm} KM)`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl border border-emerald-500/80 shadow-2xl flex items-center gap-2.5 text-xs animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-700/80 border border-emerald-400/40 flex items-center justify-center text-white shrink-0">
            <Truck className="w-8 h-8 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-display font-extrabold text-white">
                Refrigerated Cold-Chain Telemetry
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                IoT Live Fleet
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 mt-1">
              Active temperature-controlled reefers ensuring produce freshness from farm packhouse to urban terminals.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onNavigateToTrucks && (
            <button
              onClick={onNavigateToTrucks}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>{t('openTrucksPortal')}</span>
            </button>
          )}

          <button
            onClick={() => setIsDispatchModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t('dispatchNewReeferTrip')}</span>
          </button>
        </div>
      </div>

      {/* Fleet Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white gradient-border-organic border-0 shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Reefers in Transit</div>
          <div className="text-2xl font-extrabold text-emerald-900 mt-1">
            {shipments.filter(s => s.transitStatus === 'In Transit').length} Vehicles
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">86 MT Produce Protected</div>
        </div>
        <div className="p-5 rounded-2xl bg-white gradient-border-organic border-0 shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Temp Compliance</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">99.4%</div>
          <div className="text-[11px] text-slate-400 font-medium mt-0.5">Zero thermal excursion alerts</div>
        </div>
        <div className="p-5 rounded-2xl bg-white gradient-border-organic border-0 shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">Transit Spoilage</div>
          <div className="text-2xl font-extrabold text-teal-900 mt-1">1.8%</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Industry avg: 18% - 24%</div>
        </div>
        <div className="p-5 rounded-2xl bg-white gradient-border-organic border-0 shadow-2xs">
          <div className="text-xs text-slate-500 font-semibold uppercase">e-Way Bill Compliance</div>
          <div className="text-2xl font-extrabold text-emerald-900 mt-1">100%</div>
          <div className="text-[11px] text-slate-400 font-medium mt-0.5">Instant GST & FASTag linked</div>
        </div>
      </div>

      {/* Active Reefer Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          Live Reefer Fleet Status
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {shipments.map((shipment) => {
            const isTempCompliant = Math.abs(shipment.temperatureC - shipment.targetTempC) <= 1.0;
            return (
              <div
                key={shipment.id}
                className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-6 shadow-2xs space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {shipment.vehicleNumber}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-2">
                      {shipment.cropName}
                    </h3>
                    <div className="text-xs text-slate-500">
                      Driver: {shipment.driverName} ({shipment.driverPhone})
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    shipment.transitStatus === 'In Transit'
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    <Navigation className="w-3.5 h-3.5" />
                    {shipment.transitStatus}
                  </span>
                </div>

                {/* IoT Telemetry Gauges */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${
                      isTempCompliant ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      <Thermometer className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Reefer Temperature</div>
                      <div className="text-base font-extrabold text-slate-900">
                        {shipment.temperatureC}°C
                        <span className="text-[11px] font-normal text-slate-400 ml-1">
                          (Target: {shipment.targetTempC}°C)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-teal-100 text-teal-800">
                      <Droplets className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Relative Humidity</div>
                      <div className="text-base font-extrabold text-slate-900">
                        {shipment.humidityPct}% RH
                      </div>
                    </div>
                  </div>
                </div>

                {/* Route & Progress */}
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between font-medium">
                    <span className="truncate">Origin: {shipment.originFarm}</span>
                    <span className="truncate">Hub: {shipment.destinationHub}</span>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all"
                      style={{ width: `${shipment.routeProgressPct}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Departed: {shipment.departureTime}</span>
                    <span className="font-bold text-slate-700">ETA: {shipment.eta} ({shipment.routeProgressPct}% complete)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dispatch Trip Modal with KisanDirect Trucks Transparent Pricing */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {t('kisanDirectTrucks')}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {t('dispatchNewReeferTrip')}
                </h3>
              </div>
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 p-1"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleDispatchShipment} className="space-y-5">
              {/* SECTION 1: MANDATORY OWNERSHIP QUESTION (Problem Statement Requirement) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border-2 border-emerald-500/30 space-y-3">
                <label className="text-xs sm:text-sm font-black text-slate-900 block">
                  🚜 {t('ownTruckQuestion')}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option A: Yes, I own my truck */}
                  <button
                    type="button"
                    onClick={() => setOwnershipType('own')}
                    className={`p-3.5 rounded-xl text-left border-2 transition-all flex items-start gap-3 ${
                      ownershipType === 'own'
                        ? 'bg-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                        : 'bg-white/80 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${ownershipType === 'own' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {t('ownTruckYes')}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {t('yourOwnTruck')} • No service fees
                      </div>
                    </div>
                  </button>

                  {/* Option B: No, I need KisanDirect Trucks */}
                  <button
                    type="button"
                    onClick={() => setOwnershipType('kisandirect')}
                    className={`p-3.5 rounded-xl text-left border-2 transition-all flex items-start gap-3 ${
                      ownershipType === 'kisandirect'
                        ? 'bg-emerald-50 border-emerald-600 shadow-md ring-2 ring-emerald-600/10'
                        : 'bg-white/80 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${ownershipType === 'kisandirect' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-950">
                        {t('ownTruckNo')}
                      </div>
                      <div className="text-[10px] text-emerald-800 mt-0.5">
                        Reliable reefer fleet with transparent pricing
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Cargo & Route details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('cropProduce')}
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
                    Vehicle Identifier / License
                  </label>
                  <input
                    type="text"
                    value={newVehicle}
                    onChange={(e) => setNewVehicle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    📍 {t('pickupLocation')}
                  </label>
                  <input
                    type="text"
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    📍 {t('destination')}
                  </label>
                  <input
                    type="text"
                    value={newDest}
                    onChange={(e) => setNewDest(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600"
                    required
                  />
                </div>
              </div>

              {/* Dynamic Distance & Cost inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      📏 {t('distanceKm')}
                    </label>
                    <span className="text-xs font-black text-emerald-700">{distanceKm} KM</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={distanceKm}
                    onChange={(e) => {
                      const d = Math.max(1, Number(e.target.value));
                      setDistanceKm(d);
                      setBaseCostPerKm(getTransportationRate(d));
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold bg-white"
                    required
                  />
                  <input
                    type="range"
                    min="1"
                    max="250"
                    value={distanceKm}
                    onChange={(e) => {
                      const d = Number(e.target.value);
                      setDistanceKm(d);
                      setBaseCostPerKm(getTransportationRate(d));
                    }}
                    className="w-full mt-2 accent-emerald-600"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {PRESET_DISTANCES.slice(0, 5).map(km => (
                      <button
                        key={km}
                        type="button"
                        onClick={() => {
                          setDistanceKm(km);
                          setBaseCostPerKm(getTransportationRate(km));
                        }}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          distanceKm === km ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {km}k
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    💰 {ownershipType === 'own' ? t('operatingCost') : t('baseCostPerKm')} (₹/KM)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={baseCostPerKm}
                    onChange={(e) => setBaseCostPerKm(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold bg-white"
                    required
                  />
                  <div className="mt-3">
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      ❄️ {t('temperatureRequirement')}
                    </label>
                    <input
                      type="number"
                      value={newTargetTemp}
                      onChange={(e) => setNewTargetTemp(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* DYNAMIC TRANSPARENT COST BREAKDOWN */}
              <TransportationCostBreakdown
                distance={distanceKm}
                baseCostPerKm={baseCostPerKm}
                ownershipType={ownershipType}
                showComparison={true}
                showVisualIndicator={true}
                showScalingTable={ownershipType === 'own'}
              />

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('confirmTrip')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
