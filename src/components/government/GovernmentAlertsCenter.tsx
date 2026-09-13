import React, { useState } from 'react';
import { 
  AlertTriangle, 
  AlertOctagon, 
  ShieldAlert, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  ChevronRight, 
  X,
  Sparkles,
  Send,
  Eye
} from 'lucide-react';
import { GOVERNMENT_ALERTS } from './GovernmentData';
import { GovernmentSecurityAlert } from './GovernmentTypes';

interface GovernmentAlertsCenterProps {
  onResolveAlert?: (alertId: string) => void;
}

export const GovernmentAlertsCenter: React.FC<GovernmentAlertsCenterProps> = ({
  onResolveAlert
}) => {
  const [selectedAlert, setSelectedAlert] = useState<GovernmentSecurityAlert | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [alertsList, setAlertsList] = useState<GovernmentSecurityAlert[]>(GOVERNMENT_ALERTS);

  const handleResolve = (id: string) => {
    setAlertsList(prev => prev.map(a => a.id === id ? { ...a, status: 'RESOLVED' } : a));
    if (selectedAlert && selectedAlert.id === id) {
      setSelectedAlert(prev => prev ? { ...prev, status: 'RESOLVED' } : null);
    }
    onResolveAlert?.(id);
  };

  const filteredAlerts = alertsList.filter(alert => {
    if (activeFilter === 'ALL') return true;
    return alert.alertType === activeFilter;
  });

  const getAlertIcon = (type: GovernmentSecurityAlert['alertType']) => {
    switch (type) {
      case 'HIGH_DEMAND':
        return <TrendingUp className="w-4 h-4 text-red-600" />;
      case 'SUPPLY_SURPLUS':
        return <TrendingDown className="w-4 h-4 text-amber-600" />;
      case 'PRICE_ANOMALY':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'SECURITY_ALERT':
        return <ShieldAlert className="w-4 h-4 text-purple-600" />;
    }
  };

  const getSeverityBadge = (sev: GovernmentSecurityAlert['severity']) => {
    switch (sev) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white animate-pulse">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-600 text-white">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">MEDIUM</span>;
      case 'INFO':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-600 text-white">INFO</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl gradient-border-organic border-0 p-5 shadow-xs space-y-4">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Government Incident & Supply Chain Alert Feed
              </h3>
              <p className="text-xs text-slate-500">
                Real-time systemic alerts categorized by market pressure, price divergence, and cyber security events
              </p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl gradient-border-organic border-0 overflow-x-auto scrollbar-none">
          {['ALL', 'HIGH_DEMAND', 'SUPPLY_SURPLUS', 'PRICE_ANOMALY', 'SECURITY_ALERT'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition whitespace-nowrap cursor-pointer ${
                activeFilter === filter
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter === 'ALL' ? 'All Alerts' : filter.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-xl border transition flex flex-col md:flex-row md:items-center justify-between gap-3 ${
              alert.status === 'RESOLVED' 
                ? 'bg-slate-50 border-slate-200 opacity-60' 
                : alert.severity === 'CRITICAL'
                ? 'bg-red-50/40 border-red-200'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white gradient-border-organic border-0 shadow-xs flex items-center justify-center shrink-0 mt-0.5">
                {getAlertIcon(alert.alertType)}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-sm text-slate-900">{alert.title}</h4>
                  {getSeverityBadge(alert.severity)}
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {alert.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{alert.description}</p>
                <div className="mt-2 text-[11px] text-slate-500 font-medium">
                  Affected: <span className="font-semibold text-slate-800">{alert.entityAffected}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <button
                onClick={() => setSelectedAlert(alert)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Details</span>
              </button>

              {alert.status !== 'RESOLVED' && (
                <button
                  onClick={() => handleResolve(alert.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Acknowledge</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Details Inspection Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl gradient-border-organic border-0 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  {getAlertIcon(selectedAlert.alertType)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">{selectedAlert.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    {getSeverityBadge(selectedAlert.severity)}
                    <span className="text-xs text-slate-500 font-mono">{selectedAlert.timestamp}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <label className="font-bold text-slate-900 block mb-1">Incident Summary</label>
                <div className="p-3 bg-slate-50 rounded-lg gradient-border-organic border-0">
                  {selectedAlert.description}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">Target Entity / Supply Sector</label>
                <div className="p-2.5 bg-slate-50 rounded-lg gradient-border-organic border-0 font-medium text-slate-800">
                  {selectedAlert.entityAffected}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1 flex items-center gap-1.5 text-emerald-800">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Mandated Government Action / Directive</span>
                </label>
                <div className="p-3 bg-emerald-50/80 rounded-lg border border-emerald-200 text-emerald-950 font-medium leading-relaxed">
                  {selectedAlert.recommendedAction}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Close
              </button>
              {selectedAlert.status !== 'RESOLVED' && (
                <button
                  onClick={() => {
                    handleResolve(selectedAlert.id);
                    setSelectedAlert(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Execute Directive & Resolve</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
