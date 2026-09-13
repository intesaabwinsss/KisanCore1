import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Eye, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Truck, 
  Users, 
  ShoppingCart, 
  Activity, 
  Info,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { DistrictData, MapViewMode } from './GovernmentTypes';
import { DELHI_NCR_DISTRICTS } from './GovernmentData';

interface SupplyDemandMapProps {
  onSelectDistrict?: (district: DistrictData) => void;
  selectedDistrictId?: string;
}

export const SupplyDemandMap: React.FC<SupplyDemandMapProps> = ({
  onSelectDistrict,
  selectedDistrictId = 'dist-delhi'
}) => {
  const [viewMode, setViewMode] = useState<MapViewMode>('Supply');
  const [activeDistrictId, setActiveDistrictId] = useState<string>(selectedDistrictId);

  const activeDistrict = DELHI_NCR_DISTRICTS.find(d => d.id === activeDistrictId) || DELHI_NCR_DISTRICTS[0];

  const handleDistrictClick = (district: DistrictData) => {
    setActiveDistrictId(district.id);
    onSelectDistrict?.(district);
  };

  const getMarkerColor = (district: DistrictData) => {
    switch (viewMode) {
      case 'Supply':
        if (district.supplyScore >= 80) return 'bg-emerald-500 border-emerald-300 text-emerald-950';
        if (district.supplyScore >= 60) return 'bg-emerald-400 border-emerald-200 text-emerald-950';
        return 'bg-slate-300 border-slate-200 text-slate-700';
      case 'Demand':
        if (district.demandScore >= 80) return 'bg-red-500 border-red-300 text-white';
        if (district.demandScore >= 60) return 'bg-amber-500 border-amber-300 text-amber-950';
        return 'bg-emerald-400 border-emerald-200 text-emerald-950';
      case 'Price':
        if (district.priceIndex >= 110) return 'bg-purple-600 border-purple-300 text-white';
        if (district.priceIndex <= 95) return 'bg-emerald-500 border-emerald-300 text-white';
        return 'bg-blue-500 border-blue-300 text-white';
      case 'Transaction':
        if (district.transactionDensity >= 100) return 'bg-indigo-600 border-indigo-300 text-white';
        if (district.transactionDensity >= 60) return 'bg-indigo-400 border-indigo-200 text-white';
        return 'bg-slate-400 border-slate-300 text-white';
      case 'Logistics':
        if (district.logisticsStatus === 'BOTTLENECK_ALERT') return 'bg-red-600 border-red-300 text-white animate-pulse';
        if (district.logisticsStatus === 'MODERATE_CONGESTION') return 'bg-amber-500 border-amber-300 text-amber-950';
        return 'bg-emerald-500 border-emerald-300 text-white';
      default:
        return 'bg-emerald-500 border-emerald-300 text-white';
    }
  };

  return (
    <div className="bg-white rounded-2xl gradient-border-organic border-0 p-5 shadow-xs space-y-4">
      {/* Header & View Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>Regional Supply & Demand Intelligence Map</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time geospatial telemetry across Delhi NCR agricultural production and consumption corridors
          </p>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl gradient-border-organic border-0 overflow-x-auto scrollbar-none">
          {(['Supply', 'Demand', 'Price', 'Transaction', 'Logistics'] as MapViewMode[]).map((mode) => (
            <button
              key={mode}
              id={`map-view-mode-${mode.toLowerCase()}`}
              onClick={() => setViewMode(mode)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition whitespace-nowrap cursor-pointer ${
                viewMode === mode
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {mode} View
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Map Visualizer + District Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left / Center: Interactive Map Stage */}
        <div className="lg:col-span-7 bg-slate-950 rounded-xl p-4 border border-slate-800 text-white relative min-h-[380px] flex flex-col justify-between overflow-hidden">
          
          {/* Map Top Bar Info */}
          <div className="flex items-center justify-between z-10 text-xs">
            <div className="flex items-center gap-2 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700/80 backdrop-blur-xs">
              <span className="font-mono text-emerald-400 font-bold">GRID: DELHI-NCR-01</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">Mode: <strong className="text-white">{viewMode} Overlay</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-700/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>7 Monitoring Clusters</span>
            </div>
          </div>

          {/* Interactive SVG Stage for Delhi NCR */}
          <div className="relative w-full h-[280px] my-2">
            
            {/* Grid background lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#475569" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>

            {/* Connecting Supply-Demand Transit Corridors */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              {/* Noida -> Delhi Corridor */}
              <line x1="62%" y1="58%" x2="48%" y2="46%" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 4" className="animate-pulse" />
              {/* Ghaziabad -> Delhi Corridor */}
              <line x1="65%" y1="38%" x2="48%" y2="46%" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
              {/* Sonipat -> Delhi Corridor */}
              <line x1="42%" y1="24%" x2="48%" y2="46%" stroke="#10b981" strokeWidth="2" />
              {/* Meerut -> Ghaziabad Corridor */}
              <line x1="75%" y1="22%" x2="65%" y2="38%" stroke="#38bdf8" strokeWidth="1.5" />
              {/* Faridabad -> Delhi Corridor */}
              <line x1="52%" y1="72%" x2="48%" y2="46%" stroke="#64748b" strokeWidth="1.5" />
              {/* Gurgaon -> Delhi Corridor */}
              <line x1="38%" y1="64%" x2="48%" y2="46%" stroke="#ef4444" strokeWidth="2.5" />
            </svg>

            {/* District Interactive Pins */}
            {DELHI_NCR_DISTRICTS.map((dist) => {
              const isSelected = dist.id === activeDistrictId;
              const colorClass = getMarkerColor(dist);

              return (
                <div
                  key={dist.id}
                  id={`map-pin-${dist.id}`}
                  onClick={() => handleDistrictClick(dist)}
                  style={{
                    left: `${dist.coordinates.x}%`,
                    top: `${dist.coordinates.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute z-20 cursor-pointer transition-transform duration-200 group ${
                    isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    {/* Pulsing ring on selected */}
                    {isSelected && (
                      <span className="absolute -inset-2 rounded-full bg-emerald-400/30 animate-ping pointer-events-none"></span>
                    )}

                    {/* Marker Badge */}
                    <div
                      className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono border-2 shadow-lg flex items-center gap-1.5 ${colorClass} ${
                        isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''
                      }`}
                    >
                      <span>{dist.name}</span>
                      <span className="text-[10px] tracking-tighter opacity-80">{dist.densityDots}</span>
                    </div>

                    {/* Sub-label showing quick metric depending on view mode */}
                    <div className="mt-1 px-1.5 py-0.5 rounded bg-slate-900/90 text-[10px] text-slate-300 border border-slate-700/80 font-mono whitespace-nowrap shadow-md">
                      {viewMode === 'Supply' && `${dist.availableTonnes} T avail`}
                      {viewMode === 'Demand' && `Dmd: ${dist.demandScore}/100`}
                      {viewMode === 'Price' && `Tomato ₹${dist.averageTomatoPrice}/kg`}
                      {viewMode === 'Transaction' && `${dist.totalTransactions} tx`}
                      {viewMode === 'Logistics' && dist.logisticsStatus.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Legend Footer */}
          <div className="z-10 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Surplus / Optimal
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> High Demand / Deficit
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Bottleneck / Congestion
              </span>
            </div>
            <span className="text-slate-500 font-mono">Click district pin to inspect</span>
          </div>
        </div>

        {/* Right: Selected District Deep-Dive Telemetry Panel */}
        <div className="lg:col-span-5 bg-slate-50 rounded-xl p-4 gradient-border-organic border-0 flex flex-col justify-between space-y-3">
          
          <div>
            {/* District Header */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900">{activeDistrict.name}</h4>
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[11px] font-mono font-semibold">
                    {activeDistrict.densityDots}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{activeDistrict.state}</p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                  +{activeDistrict.incomeImpactPct}% Farmer Uplift
                </span>
              </div>
            </div>

            {/* Core District Aggregates */}
            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg gradient-border-organic border-0">
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Farmers Onboarded</span>
                </div>
                <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
                  {activeDistrict.farmersCount.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg gradient-border-organic border-0">
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <ShoppingCart className="w-3.5 h-3.5 text-blue-600" />
                  <span>Active Buyers</span>
                </div>
                <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
                  {activeDistrict.activeBuyersCount.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Produce Availability & Live Demand Breakdown */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                <span>Commodity Inventory & Demand</span>
                <span className="text-[11px] text-slate-400 font-mono">Total {activeDistrict.availableTonnes} Tonnes</span>
              </div>

              <div className="space-y-2">
                {activeDistrict.produceAvailable.map((item, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-lg gradient-border-organic border-0 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-900">
                      <span>{item.name} <span className="text-[10px] font-normal text-slate-500">({item.variety})</span></span>
                      <span className="font-mono text-emerald-700">{item.tonnes} Tonnes</span>
                    </div>

                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">Demand:</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          item.demandLevel === 'HIGH' ? 'bg-red-100 text-red-700' :
                          item.demandLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {item.demandLevel}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 font-mono">
                        <span>Avg: <strong className="text-slate-800">₹{item.avgPrice}/kg</strong></span>
                        <span className={item.priceTrend.includes('↑') ? 'text-red-600' : 'text-emerald-600'}>
                          {item.priceTrend}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* District Logistics Status Bar */}
          <div className="p-2.5 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Logistics Status:</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              activeDistrict.logisticsStatus === 'OPTIMAL' ? 'bg-emerald-800 text-emerald-100' :
              activeDistrict.logisticsStatus === 'MODERATE_CONGESTION' ? 'bg-amber-800 text-amber-100' :
              'bg-red-800 text-red-100'
            }`}>
              {activeDistrict.logisticsStatus.replace('_', ' ')}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
