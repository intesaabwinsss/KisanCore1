import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  ArrowUpDown, 
  Eye, 
  TrendingUp, 
  Users, 
  Activity, 
  ChevronRight, 
  Layers, 
  Sparkles,
  Truck,
  CheckCircle2,
  X
} from 'lucide-react';
import { DELHI_NCR_DISTRICTS } from './GovernmentData';
import { DistrictData } from './GovernmentTypes';

interface DistrictPerformanceTableProps {
  onInspectDistrict?: (district: DistrictData) => void;
}

export const DistrictPerformanceTable: React.FC<DistrictPerformanceTableProps> = ({
  onInspectDistrict
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'incomeImpactPct' | 'farmersCount' | 'totalTransactions' | 'availableTonnes'>('incomeImpactPct');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedDistrictModal, setSelectedDistrictModal] = useState<DistrictData | null>(null);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredDistricts = DELHI_NCR_DISTRICTS.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.primaryProduce.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];
    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });

  const handleOpenDistrict = (dist: DistrictData) => {
    setSelectedDistrictModal(dist);
    onInspectDistrict?.(dist);
  };

  return (
    <div className="bg-white rounded-2xl gradient-border-organic border-0 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                District Level Performance & Agronomic Benchmark Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Comparative analysis of farmer participation, supply throughput, and income uplift across Delhi NCR
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search district or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>
      </div>

      {/* District Matrix Table */}
      <div className="overflow-x-auto gradient-border-organic border-0 rounded-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <th className="py-3 px-4">District / Region</th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-slate-900"
                onClick={() => handleSort('farmersCount')}
              >
                <div className="flex items-center gap-1">
                  <span>Farmers</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">Active Buyers</th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-slate-900"
                onClick={() => handleSort('totalTransactions')}
              >
                <div className="flex items-center gap-1">
                  <span>Transactions</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-slate-900"
                onClick={() => handleSort('availableTonnes')}
              >
                <div className="flex items-center gap-1">
                  <span>Supply Volume</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-slate-900"
                onClick={() => handleSort('incomeImpactPct')}
              >
                <div className="flex items-center gap-1">
                  <span>Farmer Income Gain</span>
                  <ArrowUpDown className="w-3 h-3 text-emerald-600" />
                </div>
              </th>
              <th className="py-3 px-4">Logistics Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDistricts.map((dist) => (
              <tr key={dist.id} className="hover:bg-slate-50/80 transition">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{dist.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{dist.densityDots}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">{dist.state}</div>
                </td>

                <td className="py-3 px-4 font-mono font-bold text-slate-800">
                  {dist.farmersCount.toLocaleString('en-IN')}
                </td>

                <td className="py-3 px-4 font-mono text-slate-600">
                  {dist.activeBuyersCount.toLocaleString('en-IN')}
                </td>

                <td className="py-3 px-4 font-mono text-slate-800">
                  {dist.totalTransactions.toLocaleString('en-IN')}
                </td>

                <td className="py-3 px-4 font-mono text-emerald-700 font-semibold">
                  {dist.availableTonnes} Tonnes
                </td>

                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    +{dist.incomeImpactPct}%
                  </span>
                </td>

                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    dist.logisticsStatus === 'OPTIMAL' ? 'bg-emerald-100 text-emerald-800' :
                    dist.logisticsStatus === 'MODERATE_CONGESTION' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {dist.logisticsStatus.replace('_', ' ')}
                  </span>
                </td>

                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleOpenDistrict(dist)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View District</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* District Detail Modal */}
      {selectedDistrictModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl gradient-border-organic border-0 shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-slate-900">{selectedDistrictModal.name}</h3>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-mono">
                    {selectedDistrictModal.densityDots}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{selectedDistrictModal.state}</p>
              </div>
              <button
                onClick={() => setSelectedDistrictModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 text-base font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg gradient-border-organic border-0 text-center">
                <div className="text-slate-500 text-[10px] uppercase">Registered Farmers</div>
                <div className="font-bold font-mono text-slate-900 text-sm mt-0.5">
                  {selectedDistrictModal.farmersCount.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg gradient-border-organic border-0 text-center">
                <div className="text-slate-500 text-[10px] uppercase">Active Buyers</div>
                <div className="font-bold font-mono text-slate-900 text-sm mt-0.5">
                  {selectedDistrictModal.activeBuyersCount.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 text-center">
                <div className="text-emerald-800 text-[10px] uppercase font-bold">Income Uplift</div>
                <div className="font-bold font-mono text-emerald-800 text-sm mt-0.5">
                  +{selectedDistrictModal.incomeImpactPct}%
                </div>
              </div>
            </div>

            {/* Commodity Breakdown */}
            <div>
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Available Commodities & Live Telemetry
              </div>
              <div className="space-y-2">
                {selectedDistrictModal.produceAvailable.map((item, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-50 gradient-border-organic border-0 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{item.name} ({item.variety})</div>
                      <div className="text-[11px] text-slate-500">Available: <span className="font-mono font-semibold text-slate-800">{item.tonnes} Tonnes</span></div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-900">₹{item.avgPrice}/kg</div>
                      <div className="text-[11px] font-semibold text-emerald-700">Trend: {item.priceTrend}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedDistrictModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
