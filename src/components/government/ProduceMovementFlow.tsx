import React, { useState } from 'react';
import { 
  Truck, 
  ArrowRight, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  ThermometerSnowflake,
  Filter,
  DollarSign
} from 'lucide-react';
import { PRODUCE_MOVEMENTS } from './GovernmentData';
import { ProduceMovementRecord } from './GovernmentTypes';

export const ProduceMovementFlow: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredMovements = PRODUCE_MOVEMENTS.filter(m => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'BOTTLENECK') return m.hasBottleneck;
    return m.deliveryStatus === statusFilter;
  });

  const getStatusBadge = (status: ProduceMovementRecord['deliveryStatus']) => {
    switch (status) {
      case 'IN_TRANSIT':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            In Transit
          </span>
        );
      case 'DISPATCHED':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-semibold">
            Dispatched
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Delivered
          </span>
        );
      case 'BOTTLENECK_DELAY':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[11px] font-bold flex items-center gap-1 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            Bottleneck Alert
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl gradient-border-organic border-0 p-5 shadow-xs space-y-4">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Inter-District Produce Movement & Cold Chain Logistics
              </h3>
              <p className="text-xs text-slate-500">
                Live freight corridor tracking from farmgate aggregation packhouses to urban consumption centers
              </p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl gradient-border-organic border-0 self-start sm:self-auto">
          {['ALL', 'IN_TRANSIT', 'BOTTLENECK', 'DELIVERED'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition cursor-pointer ${
                statusFilter === filter
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter === 'ALL' ? 'All Movements' : filter === 'BOTTLENECK' ? '⚠️ Bottlenecks' : filter.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Movement Pipeline Visual Step Indicator */}
      <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800">
        <div className="text-xs font-semibold text-slate-400 mb-3 flex items-center justify-between">
          <span>Primary Agri-Logistics Pipeline (Delhi NCR Corridor)</span>
          <span className="font-mono text-emerald-400 text-[11px]">1,284 Tonnes Daily Throughput</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 text-center">
            <div className="text-[10px] uppercase font-bold text-emerald-400">Step 1</div>
            <div className="font-bold text-xs text-white mt-1">Farmgate Harvest</div>
            <div className="text-[11px] text-slate-400 mt-0.5">12,482 Farmers</div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 text-center">
            <div className="text-[10px] uppercase font-bold text-emerald-400">Step 2</div>
            <div className="font-bold text-xs text-white mt-1">Noida / Meerut FPO</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Grading & Packhouse</div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 text-center">
            <div className="text-[10px] uppercase font-bold text-amber-400">Step 3</div>
            <div className="font-bold text-xs text-white mt-1">Ghaziabad Ingress</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Weighbridge & Checkpost</div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 text-center">
            <div className="text-[10px] uppercase font-bold text-cyan-400">Step 4</div>
            <div className="font-bold text-xs text-white mt-1">Delhi Urban Intake</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Okhla / Azadpur Hubs</div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 text-center">
            <div className="text-[10px] uppercase font-bold text-emerald-400">Step 5</div>
            <div className="font-bold text-xs text-white mt-1">Direct Buyers</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Retailers & Consumers</div>
          </div>

        </div>
      </div>

      {/* Movement Records List */}
      <div className="space-y-3">
        {filteredMovements.map((record) => (
          <div
            key={record.id}
            id={`movement-card-${record.id}`}
            className={`p-4 rounded-xl border transition ${
              record.hasBottleneck 
                ? 'border-red-300 bg-red-50/40' 
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              
              {/* Origin to Destination Route */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {record.id}
                  </span>
                  <span className="font-bold text-sm text-slate-900">{record.commodity}</span>
                  <span className="font-mono text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {record.quantityTonnes} Tonnes
                  </span>
                  {getStatusBadge(record.deliveryStatus)}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
                  <span className="font-semibold text-slate-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {record.origin}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    {record.destination}
                  </span>
                </div>
              </div>

              {/* Logistics Metrics */}
              <div className="flex items-center gap-4 text-xs font-mono self-start md:self-auto">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-sans">Freight Cost</div>
                  <div className="font-bold text-slate-900">₹{record.transportationCost.toLocaleString('en-IN')}</div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-sans">Avg Delivery</div>
                  <div className="font-bold text-slate-900">{record.avgDeliveryTimeHrs} hrs</div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-sans flex items-center gap-1 justify-end">
                    <ThermometerSnowflake className="w-3 h-3 text-cyan-600" />
                    <span>Cold Chain</span>
                  </div>
                  <div className="font-bold text-cyan-700">{record.coldChainCompliancePct}%</div>
                </div>
              </div>

            </div>

            {/* Bottleneck Warning Box if any */}
            {record.hasBottleneck && record.bottleneckReason && (
              <div className="mt-3 p-2.5 rounded-lg bg-red-100/80 border border-red-200 text-xs text-red-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Logistics Bottleneck Detected: </span>
                  <span>{record.bottleneckReason}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
