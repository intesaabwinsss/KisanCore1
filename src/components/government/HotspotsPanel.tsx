import React, { useState } from 'react';
import { 
  AlertOctagon, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  Truck, 
  Clock, 
  Sliders, 
  TrendingUp,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { HOTSPOT_ALERTS } from './GovernmentData';
import { HotspotAlert } from './GovernmentTypes';

interface HotspotsPanelProps {
  onTriggerRedirectionDirective?: (hotspot: HotspotAlert) => void;
}

export const HotspotsPanel: React.FC<HotspotsPanelProps> = ({
  onTriggerRedirectionDirective
}) => {
  const [dispatchedDirectives, setDispatchedDirectives] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>('ALL');

  const handleDispatch = (hotspot: HotspotAlert) => {
    if (!dispatchedDirectives.includes(hotspot.id)) {
      setDispatchedDirectives(prev => [...prev, hotspot.id]);
    }
    onTriggerRedirectionDirective?.(hotspot);
  };

  const filteredHotspots = HOTSPOT_ALERTS.filter(h => {
    if (filterType === 'ALL') return true;
    return h.type === filterType;
  });

  const getBadgeStyles = (type: HotspotAlert['type']) => {
    switch (type) {
      case 'HIGH_DEMAND':
        return {
          container: 'border-red-200 bg-red-50/60',
          badge: 'bg-red-600 text-white',
          label: '🔴 HIGH DEMAND SURGE',
          iconColor: 'text-red-600',
        };
      case 'SUPPLY_SURPLUS':
        return {
          container: 'border-amber-200 bg-amber-50/60',
          badge: 'bg-amber-600 text-white',
          label: '🟠 SUPPLY SURPLUS',
          iconColor: 'text-amber-600',
        };
      case 'POTENTIAL_SHORTAGE':
        return {
          container: 'border-yellow-300 bg-yellow-50/60',
          badge: 'bg-yellow-600 text-white',
          label: '🟡 POTENTIAL SHORTAGE',
          iconColor: 'text-yellow-700',
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl gradient-border-organic border-0 p-5 shadow-xs space-y-4">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Supply & Demand Hotspots & Policy Interventions
              </h3>
              <p className="text-xs text-slate-500">
                Real-time imbalance alerts with actionable government logistics redirection recommendations
              </p>
            </div>
          </div>
        </div>

        {/* Quick Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl gradient-border-organic border-0 self-start sm:self-auto">
          {['ALL', 'HIGH_DEMAND', 'SUPPLY_SURPLUS', 'POTENTIAL_SHORTAGE'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition cursor-pointer ${
                filterType === type
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type === 'ALL' ? 'All Hotspots' : type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Hotspots Card Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHotspots.map((hotspot) => {
          const styles = getBadgeStyles(hotspot.type);
          const isDispatched = dispatchedDirectives.includes(hotspot.id);

          return (
            <div
              key={hotspot.id}
              id={`hotspot-card-${hotspot.id}`}
              className={`rounded-xl border p-4 transition duration-200 flex flex-col justify-between ${styles.container}`}
            >
              <div>
                {/* Badge & Timestamp */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide uppercase ${styles.badge}`}>
                    {styles.label}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{hotspot.timestamp}</span>
                  </div>
                </div>

                {/* District & Commodity Metrics */}
                <div className="flex items-baseline justify-between mt-1">
                  <h4 className="text-sm font-bold text-slate-900">
                    {hotspot.district} • <span className="text-slate-700">{hotspot.commodity}</span>
                  </h4>
                  <span className="text-xs font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded gradient-border-organic border-0">
                    {hotspot.metricLabel}
                  </span>
                </div>

                {/* Official Actionable Recommendation */}
                <div className="mt-3 p-3 rounded-lg bg-white/90 gradient-border-organic border-0 text-xs text-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Government Policy Recommendation:</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    "{hotspot.recommendation}"
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">
                  Impact Radius: Delhi NCR Central Corridor
                </span>

                <button
                  id={`btn-dispatch-directive-${hotspot.id}`}
                  onClick={() => handleDispatch(hotspot)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    isDispatched
                      ? 'bg-emerald-700 text-white cursor-default'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                  }`}
                >
                  {isDispatched ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Directive Issued</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Issue Redirection Order</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
