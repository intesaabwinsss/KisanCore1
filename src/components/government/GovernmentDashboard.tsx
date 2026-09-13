import React, { useState } from 'react';
import { 
  GovernmentHeader, 
  GovTabType 
} from './GovernmentHeader';
import { GovernmentKPIGrid } from './GovernmentKPIGrid';
import { FarmerIncomeImpactChart } from './FarmerIncomeImpactChart';
import { ConsumerPriceImpactChart } from './ConsumerPriceImpactChart';
import { SupplyDemandMap } from './SupplyDemandMap';
import { HotspotsPanel } from './HotspotsPanel';
import { ProduceMovementFlow } from './ProduceMovementFlow';
import { MarketPriceTable } from './MarketPriceTable';
import { GovernmentAlertsCenter } from './GovernmentAlertsCenter';
import { TransactionSecurityMonitor } from './TransactionSecurityMonitor';
import { GovernmentAuditLedger } from './GovernmentAuditLedger';
import { DistrictPerformanceTable } from './DistrictPerformanceTable';
import { ReportGeneratorModal } from './ReportGeneratorModal';
import { GovernmentPriceIntelligence } from './GovernmentPriceIntelligence';
import { GovernmentInsightsPanel } from './GovernmentInsightsPanel';
import { 
  TIMEFRAME_KPIS, 
  GOVERNMENT_ALERTS, 
  DELHI_NCR_DISTRICTS 
} from './GovernmentData';
import { 
  TimeframeOption, 
  DistrictData, 
  HotspotAlert, 
  MarketPriceRecord, 
  FraudFlagRecord 
} from './GovernmentTypes';
import { 
  Bell, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  ShoppingCart, 
  Activity, 
  X,
  FileCheck2,
  Lock,
  Building2,
  Sparkles
} from 'lucide-react';

interface GovernmentDashboardProps {
  onLogout?: () => void;
  onNavigateHome?: () => void;
}

export const GovernmentDashboard: React.FC<GovernmentDashboardProps> = ({
  onLogout,
  onNavigateHome
}) => {
  const [activeTab, setActiveTab] = useState<GovTabType>('overview');
  const [timeframe, setTimeframe] = useState<TimeframeOption>('30 Days');
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAuditLedgerModal, setShowAuditLedgerModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const kpis = TIMEFRAME_KPIS[timeframe];
  const activeAlerts = GOVERNMENT_ALERTS.filter(a => a.status !== 'RESOLVED');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTriggerRedirectionDirective = (hotspot: HotspotAlert) => {
    showToast(`Government Directive Dispatched: Redirection order issued for ${hotspot.district} (${hotspot.commodity}).`);
  };

  const handleResolveAlert = (alertId: string) => {
    showToast(`Alert #${alertId} acknowledged and routed to district enforcement.`);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* 1. Government Dashboard Header */}
      <GovernmentHeader
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        unreadAlertCount={activeAlerts.length}
        onOpenNotifications={() => setShowNotificationsDrawer(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        onLogout={onLogout}
        onOpenSecurityLedger={() => setShowAuditLedgerModal(true)}
        systemStatusText="System Operational"
      />

      {/* Main Command Center Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl border border-emerald-500/60 shadow-2xl flex items-center gap-2.5 text-xs animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW (Master Command Center View) */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* National / Regional Overview KPI Section */}
            <GovernmentKPIGrid
              kpis={kpis}
              timeframe={timeframe}
              onSelectTimeframe={setTimeframe}
              onFilterMetric={(metric) => {
                if (metric === 'farmers') setActiveTab('farmers');
                if (metric === 'buyers') setActiveTab('buyers');
                if (metric === 'transactions') setActiveTab('transactions');
              }}
            />

            {/* Impact Duo: Farmer Income Impact + Consumer Price Impact */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FarmerIncomeImpactChart />
              <ConsumerPriceImpactChart />
            </div>

            {/* Supply & Demand Intelligence Map */}
            <SupplyDemandMap />

            {/* Hotspots & Inter-District Produce Movement Flow */}
            <HotspotsPanel
              onTriggerRedirectionDirective={handleTriggerRedirectionDirective}
            />

            <ProduceMovementFlow />

            {/* Algorithmic Intelligence Insights */}
            <GovernmentInsightsPanel />
            <GovernmentPriceIntelligence />

            {/* District Benchmark Matrix */}
            <DistrictPerformanceTable />

            {/* Cryptographic Transaction & Security Snapshot */}
            <TransactionSecurityMonitor
              onOpenAuditLedger={() => setShowAuditLedgerModal(true)}
            />

            {/* Quick Report Generator */}
            <ReportGeneratorModal />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FARMERS (Farmer Participation & Income Uplift) */}
        {/* ========================================================================= */}
        {activeTab === 'farmers' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl gradient-border-organic border-0 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span>Farmer Onboarding & Direct Realization Portal</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  12,482 KYC-verified smallholder and FPO farmers across Uttar Pradesh, Haryana, and Delhi NCR
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold font-mono">
                  +18.4% Net Income Uplift
                </span>
              </div>
            </div>

            <FarmerIncomeImpactChart />
            <DistrictPerformanceTable />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BUYERS (Consumer & Institutional Demand) */}
        {/* ========================================================================= */}
        {activeTab === 'buyers' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl gradient-border-organic border-0 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                  <span>Buyer Intake & Consumer Price Protection</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  3,821 active buyers (B2B wholesale, institutions, and direct urban consumers) in Delhi NCR
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-lg text-xs font-bold font-mono">
                  -9.2% Average Consumer Price
                </span>
              </div>
            </div>

            <ConsumerPriceImpactChart />
            <ProduceMovementFlow />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: TRANSACTIONS (Settlement & Cryptographic Ledger) */}
        {/* ========================================================================= */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <GovernmentAuditLedger />
            <TransactionSecurityMonitor onOpenAuditLedger={() => setShowAuditLedgerModal(true)} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: MARKET PRICES (Equilibrium & Anomaly Tracking) */}
        {/* ========================================================================= */}
        {activeTab === 'market_prices' && (
          <div className="space-y-6">
            <MarketPriceTable />
            <ConsumerPriceImpactChart />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: SUPPLY & DEMAND (Geospatial Intelligence) */}
        {/* ========================================================================= */}
        {activeTab === 'supply_demand' && (
          <div className="space-y-6">
            <SupplyDemandMap />
            <HotspotsPanel onTriggerRedirectionDirective={handleTriggerRedirectionDirective} />
            <ProduceMovementFlow />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: DISTRICTS (Delhi NCR Benchmarks) */}
        {/* ========================================================================= */}
        {activeTab === 'districts' && (
          <div className="space-y-6">
            <DistrictPerformanceTable />
            <SupplyDemandMap />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: ALERTS (Incident Response) */}
        {/* ========================================================================= */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <GovernmentAlertsCenter onResolveAlert={handleResolveAlert} />
            <HotspotsPanel onTriggerRedirectionDirective={handleTriggerRedirectionDirective} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 9: REPORTS (Official Dossiers & Exports) */}
        {/* ========================================================================= */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <ReportGeneratorModal />
            <GovernmentInsightsPanel />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 10: SYSTEM SECURITY (Cyber Security Specialization) */}
        {/* ========================================================================= */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <TransactionSecurityMonitor onOpenAuditLedger={() => setShowAuditLedgerModal(true)} />
            <GovernmentAuditLedger />
          </div>
        )}

      </main>

      {/* Notifications Drawer */}
      {showNotificationsDrawer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-base text-slate-900">Live Supply Chain Alerts</h3>
                </div>
                <button
                  onClick={() => setShowNotificationsDrawer(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {activeAlerts.map(alert => (
                  <div key={alert.id} className="p-3 bg-slate-50 rounded-xl gradient-border-organic border-0 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{alert.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{alert.timestamp}</span>
                    </div>
                    <p className="text-slate-600">{alert.description}</p>
                    <div className="text-[11px] text-emerald-700 font-semibold pt-1">
                      Action: {alert.recommendedAction}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  setShowNotificationsDrawer(false);
                  setActiveTab('alerts');
                }}
                className="w-full py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl text-center cursor-pointer hover:bg-slate-800"
              >
                Go to Alerts Center
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl gradient-border-organic border-0 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-base">
                  GA
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900">Dr. V. Sharma</h4>
                  <p className="text-xs text-slate-500">Joint Director (Agricultural Logistics)</p>
                </div>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-xl gradient-border-organic border-0 text-slate-700 font-mono">
              <div>Role: Government Administrator</div>
              <div>Node Clearance: Level 4 (National Grid)</div>
              <div>Security Key: 0x8f4c...901</div>
              <div>Session Token: Active & Enforced</div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Standalone SHA-256 Audit Ledger Modal */}
      {showAuditLedgerModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-5xl w-full p-6 space-y-4 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Full Cryptographic Audit Trail Inspector</span>
              </h3>
              <button
                onClick={() => setShowAuditLedgerModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <GovernmentAuditLedger onClose={() => setShowAuditLedgerModal(false)} />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 font-mono">KISANDIRECT</span>
            <span>•</span>
            <span>Government Agricultural Supply Chain Monitoring Dashboard</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>256-Bit SSL / SHA-256 Verified</span>
            <span>•</span>
            <span>Ministry of Agriculture Compliant</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
