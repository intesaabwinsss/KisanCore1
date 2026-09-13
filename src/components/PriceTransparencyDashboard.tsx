import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  ShieldCheck, 
  Scale, 
  Clock, 
  Truck, 
  Building2, 
  Store, 
  Tractor, 
  AlertTriangle, 
  CheckCircle2, 
  Calculator, 
  Info, 
  ChevronRight, 
  ChevronDown, 
  ArrowRight, 
  ShoppingBag, 
  Layers, 
  FileText, 
  ThermometerSnowflake,
  BarChart3,
  PieChart as PieChartIcon,
  HelpCircle,
  Share2,
  Check
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie, 
  Legend 
} from 'recharts';
import { CommodityPriceChain, SupplyChainStage } from '../types';
import { 
  COMMODITY_PRICE_CHAINS, 
  calculateBatchImpact, 
  formatIndianRupees,
  getPriceChainForCommodity 
} from '../utils/priceCalculations';

interface PriceTransparencyDashboardProps {
  initialCommodityId?: string;
  userRole?: 'farmer' | 'consumer' | 'b2b' | 'admin' | 'general';
  onSelectCommodityForAction?: (commodity: CommodityPriceChain) => void;
  compact?: boolean;
}

export const PriceTransparencyDashboard: React.FC<PriceTransparencyDashboardProps> = ({
  initialCommodityId = 'tomato',
  userRole = 'general',
  onSelectCommodityForAction,
  compact = false,
}) => {
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>(initialCommodityId);
  const [activeTab, setActiveTab] = useState<'journey' | 'rupee_breakdown' | 'direct_comparison' | 'batch_calculator'>('journey');
  const [batchQuantityKg, setBatchQuantityKg] = useState<number>(2000);
  const [expandedStageId, setExpandedStageId] = useState<string | null>('stage-1-farmer');
  const [copiedLink, setCopiedLink] = useState(false);

  const currentChain = getPriceChainForCommodity(selectedCommodityId);
  const batchResult = calculateBatchImpact(currentChain, batchQuantityKg);

  const handleCopySummary = () => {
    const text = `KisanMandi Direct Price Transparency - ${currentChain.commodityName}: Farmer receives ₹${currentChain.directModel.farmerFarmgatePrice}/kg (+${currentChain.directModel.farmerGainPercentage}% vs mandi) while consumers pay ₹${currentChain.directModel.finalDirectBuyerPrice}/kg (saving ${currentChain.directModel.buyerSavingsPercentage}%). Eliminated 4 middlemen layers!`;
    navigator.clipboard?.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Prepare Data for "Where Does the Rupee Go?" Breakdown
  const totalRetailPrice = currentChain.directModel.traditionalFinalRetailPrice;
  const farmerShareAmount = currentChain.farmerReceivedPricePerKg;
  const totalOperationalCost = currentChain.traditionalStages.reduce(
    (acc, stage) => acc + (stage.actorType !== 'farmer' ? stage.operationalCostPerKg : 0), 0
  );
  const totalIntermediaryMargin = currentChain.traditionalStages.reduce(
    (acc, stage) => acc + (stage.actorType !== 'farmer' ? stage.intermediaryMarginPerKg : 0), 0
  );

  const rupeeDistributionData = [
    { name: 'Farmer Take-Home Harvest Share', value: farmerShareAmount, percentage: Math.round((farmerShareAmount / totalRetailPrice) * 100), color: '#059669' },
    { name: 'Essential Supply Chain Costs (Freight, Cess, Spoilage)', value: totalOperationalCost, percentage: Math.round((totalOperationalCost / totalRetailPrice) * 100), color: '#0284c7' },
    { name: 'Middlemen Margins & Commission Cuts', value: totalIntermediaryMargin, percentage: Math.round((totalIntermediaryMargin / totalRetailPrice) * 100), color: '#e11d48' },
  ];

  // Stage build-up bar chart data
  const stageBarData = currentChain.traditionalStages.map((stage) => ({
    name: stage.roleTitle.split(' ')[0],
    fullName: stage.actorName,
    cumulative: stage.cumulativePricePerKg,
    added: stage.amountAddedPerKg,
    operational: stage.operationalCostPerKg,
    margin: stage.intermediaryMarginPerKg,
  }));

  const getActorIcon = (iconName: string) => {
    switch (iconName) {
      case 'Tractor': return <Tractor className="w-5 h-5 text-emerald-700" />;
      case 'Store': return <Store className="w-5 h-5 text-amber-700" />;
      case 'Building2': return <Building2 className="w-5 h-5 text-purple-700" />;
      case 'Truck': return <Truck className="w-5 h-5 text-blue-700" />;
      default: return <Scale className="w-5 h-5 text-emerald-700" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Direct Price Transparency & Middleman Breakdown</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              Where Does the Agricultural Rupee Go?
            </h2>
            
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              In conventional agricultural markets, 4 to 5 intermediary layers inflate retail food prices while farmers receive less than 35% of consumer spend. KisanMandi compresses the chain into a direct digital bridge, delivering higher farmgate income and fair consumer prices.
            </p>
          </div>

          {/* Quick Share / Export Button */}
          <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
            <button
              onClick={handleCopySummary}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4 text-emerald-200" />}
              <span>{copiedLink ? 'Copied to Clipboard!' : 'Share Breakdown'}</span>
            </button>
            <span className="text-[11px] text-emerald-300 font-mono hidden sm:block">
              AGMARK & APMC Grounded
            </span>
          </div>
        </div>

        {/* Commodity Selector Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider shrink-0 mr-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Select Commodity:</span>
          </span>

          {COMMODITY_PRICE_CHAINS.map((commodity) => (
            <button
              key={commodity.commodityId}
              onClick={() => setSelectedCommodityId(commodity.commodityId)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 cursor-pointer ${
                selectedCommodityId === commodity.commodityId
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50 scale-105 border border-emerald-400'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20 border border-transparent'
              }`}
            >
              <img 
                src={commodity.sampleImage} 
                alt={commodity.commodityName} 
                className="w-4 h-4 rounded-full object-cover shrink-0" 
              />
              <span>{commodity.commodityName}</span>
              <span className="text-[10px] opacity-80 hidden sm:inline">({commodity.hindiName.split(' ')[0]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Top Level Key KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Farmer Realization Gain */}
        <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-5 rounded-3xl gradient-border-organic border-0 shadow-2xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Farmer Direct Realization</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
              +{currentChain.directModel.farmerGainPercentage}% Gain
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-extrabold text-emerald-700">
              {formatIndianRupees(currentChain.directModel.farmerFarmgatePrice, { precision: 1 })}
            </span>
            <span className="text-xs text-slate-400 line-through">
              {formatIndianRupees(currentChain.farmerReceivedPricePerKg, { precision: 1 })} Mandi
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-tight">
            Growers earn <strong>+{formatIndianRupees(currentChain.directModel.farmerGainPerKg, { precision: 1 })}/kg</strong> extra with 0% commission deductions.
          </p>
        </div>

        {/* KPI 2: Consumer / Buyer Savings */}
        <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-5 rounded-3xl gradient-border-organic border-0 shadow-2xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Buyer / Consumer Savings</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold">
              -{currentChain.directModel.buyerSavingsPercentage}% Cheaper
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-extrabold text-blue-700">
              {formatIndianRupees(currentChain.directModel.finalDirectBuyerPrice, { precision: 1 })}
            </span>
            <span className="text-xs text-slate-400 line-through">
              {formatIndianRupees(currentChain.directModel.traditionalFinalRetailPrice, { precision: 1 })} Retail
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-tight">
            Buyers save <strong>{formatIndianRupees(currentChain.directModel.buyerSavingsPerKg, { precision: 1 })}/kg</strong> vs inflated open retail prices.
          </p>
        </div>

        {/* KPI 3: Middleman Stages Removed */}
        <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-5 rounded-3xl gradient-border-organic border-0 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Supply Chain Streamlining</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold">
              1 Direct Link
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-display font-extrabold text-purple-700">
              {currentChain.directModel.intermediariesEliminatedCount} Layers
            </span>
            <span className="text-xs text-slate-400">Eliminated</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-tight">
            Replaces village arhatiyas, mandi brokers, and multi-tier city traders.
          </p>
        </div>

        {/* KPI 4: Food Wastage Crushed */}
        <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-5 rounded-3xl gradient-border-organic border-0 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Transit Spoilage Loss</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold">
              Cold-Chain Protected
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-extrabold text-emerald-800">
              &lt;{currentChain.directModel.spoilageDirectPct}%
            </span>
            <span className="text-xs text-rose-500 line-through">
              {currentChain.directModel.spoilageTraditionalPct}% Mandi
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-tight">
            Temperature-controlled transport saves over 90% of harvest rotting.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('journey')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'journey'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 gradient-border-organic border-0'
          }`}
        >
          <Truck className="w-4 h-4 text-emerald-400" />
          <span>1. Visual Journey & Cost Breakdown</span>
        </button>

        <button
          onClick={() => setActiveTab('rupee_breakdown')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'rupee_breakdown'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 gradient-border-organic border-0'
          }`}
        >
          <PieChartIcon className="w-4 h-4 text-emerald-400" />
          <span>2. Where Does the Rupee Go?</span>
        </button>

        <button
          onClick={() => setActiveTab('direct_comparison')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'direct_comparison'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 gradient-border-organic border-0'
          }`}
        >
          <Scale className="w-4 h-4 text-emerald-400" />
          <span>3. Traditional vs Direct Model</span>
        </button>

        <button
          onClick={() => setActiveTab('batch_calculator')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'batch_calculator'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 gradient-border-organic border-0'
          }`}
        >
          <Calculator className="w-4 h-4 text-emerald-400" />
          <span>4. Interactive Batch Harvest Calculator</span>
        </button>
      </div>

      {/* TAB 1: Visual Supply Chain Journey Timeline */}
      {activeTab === 'journey' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>Traditional Multi-Tier Supply Chain for {currentChain.commodityName}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-normal">
                    {currentChain.originRegion} → {currentChain.destinationMarket}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Click on any stage below to inspect itemized operational expenses, handling, mandi taxes, and middleman trading margins.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
                  <span>Operational Costs</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                  <span>Intermediary Margin</span>
                </span>
              </div>
            </div>

            {/* Interactive Timeline Step Cards */}
            <div className="space-y-4">
              {currentChain.traditionalStages.map((stage, idx) => {
                const isExpanded = expandedStageId === stage.id;
                const isFarmer = stage.actorType === 'farmer';
                
                return (
                  <div
                    key={stage.id}
                    className={`rounded-3xl border transition-all overflow-hidden ${
                      isExpanded
                        ? isFarmer
                          ? 'border-emerald-500 bg-emerald-50/30 shadow-md ring-1 ring-emerald-500'
                          : 'border-slate-300 bg-slate-50/50 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Stage Header Row */}
                    <div
                      onClick={() => setExpandedStageId(isExpanded ? null : stage.id)}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-2xs shrink-0 ${
                          isFarmer ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {getActorIcon(stage.iconName)}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                              Stage {idx + 1}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900">
                              {stage.actorName}
                            </h4>
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>{stage.roleTitle}</span>
                            <span>•</span>
                            <span>{stage.locationContext}</span>
                            {stage.timeDelayDays > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-amber-700 flex items-center gap-0.5 font-medium">
                                  <Clock className="w-3 h-3" />
                                  +{stage.timeDelayDays} days delay
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Cumulative Price & Cost Split */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-left sm:text-right">
                          <div className="text-xs text-slate-400">Cumulative Price</div>
                          <div className="text-base font-extrabold text-slate-900">
                            {formatIndianRupees(stage.cumulativePricePerKg, { precision: 1 })}
                            <span className="text-xs font-normal text-slate-400">/kg</span>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <div className="text-xs text-slate-400">Stage Addition</div>
                          <div className={`text-sm font-bold ${isFarmer ? 'text-emerald-700' : 'text-rose-600'}`}>
                            +{formatIndianRupees(stage.amountAddedPerKg, { precision: 1 })}/kg
                          </div>
                        </div>

                        <div className="text-slate-400">
                          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Cost Breakdown Drawer */}
                    {isExpanded && (
                      <div className="p-4 sm:p-6 bg-white border-t border-slate-200 space-y-4 animate-in fade-in duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Left: Operational Cost vs Intermediary Margin */}
                          <div className="md:col-span-2 space-y-3">
                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                              Itemized Cost & Margin Breakdown (per kg)
                            </h5>

                            <div className="space-y-2">
                              {stage.costItems.map((item) => (
                                <div 
                                  key={item.id}
                                  className="flex items-start justify-between p-3 rounded-2xl bg-slate-50 gradient-border-organic border-0 text-xs"
                                >
                                  <div className="space-y-0.5 pr-3">
                                    <div className="flex items-center gap-2">
                                      <span className={`w-2 h-2 rounded-full ${
                                        item.category === 'operational_cost' ? 'bg-blue-500' : 'bg-rose-500'
                                      }`} />
                                      <span className="font-bold text-slate-900">{item.name}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-tight">
                                      {item.description}
                                    </p>
                                  </div>

                                  <div className="text-right shrink-0">
                                    <span className={`font-extrabold text-sm ${
                                      item.category === 'operational_cost' ? 'text-blue-700' : 'text-rose-700'
                                    }`}>
                                      +{formatIndianRupees(item.amountPerKg, { precision: 2 })}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                                      {item.category === 'operational_cost' ? 'Operational' : 'Margin/Cut'}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Right: Stage Friction & Inefficiencies */}
                          <div className="space-y-3 bg-rose-50/50 p-4 rounded-2xl border border-rose-100 text-xs">
                            <div className="flex items-center gap-1.5 text-rose-800 font-bold">
                              <AlertTriangle className="w-4 h-4 text-rose-600" />
                              <span>Stage Inefficiencies & Loss</span>
                            </div>

                            <div className="space-y-1.5 text-[11px] text-rose-900">
                              <div><strong>Operational Context:</strong> {stage.operationalNotes}</div>
                              <div className="pt-1">
                                <strong className="text-rose-950">Structural Defects:</strong>
                                <ul className="list-disc pl-4 space-y-1 mt-1 text-rose-800">
                                  {stage.keyProblems.map((prob, pidx) => (
                                    <li key={pidx}>{prob}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="pt-2 border-t border-rose-200 text-[10px] text-rose-700">
                                Estimated Spoilage Loss at this stage: <strong>{stage.wastagePercentage}%</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: "Where Does the Rupee Go?" Breakdown */}
      {activeTab === 'rupee_breakdown' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Visual Recharts Breakdown */}
            <div className="lg:col-span-2 bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-6 sm:p-8 shadow-2xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-emerald-700" />
                  <span>Breakdown of Consumer Spend (₹{totalRetailPrice.toFixed(0)} Retail Price)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  How every ₹100 paid by a household consumer for {currentChain.commodityName} is distributed across actors.
                </p>
              </div>

              {/* Progress Distribution Bar */}
              <div className="space-y-2">
                <div className="h-6 w-full rounded-2xl overflow-hidden flex shadow-inner bg-slate-100">
                  {rupeeDistributionData.map((slice, idx) => (
                    <div
                      key={idx}
                      style={{ width: `${slice.percentage}%`, backgroundColor: slice.color }}
                      className="h-full relative group transition-all"
                      title={`${slice.name}: ${slice.percentage}% (${formatIndianRupees(slice.value, { precision: 1 })})`}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {rupeeDistributionData.map((slice, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 gradient-border-organic border-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                        <span className="text-xs font-bold text-slate-800 line-clamp-1">{slice.name}</span>
                      </div>
                      <div className="flex items-baseline justify-between pt-1">
                        <span className="text-xl font-extrabold text-slate-900">{slice.percentage}%</span>
                        <span className="text-xs font-semibold text-slate-500">
                          {formatIndianRupees(slice.value, { precision: 1 })}/kg
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cumulative Stage Build-up Bar Chart */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Cumulative Price Build-up Across Stages (₹/kg)
                </h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stageBarData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `₹${val}`} />
                      <Tooltip 
                        formatter={(val: any) => [`₹${val}/kg`, 'Price']} 
                        labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
                      />
                      <Bar dataKey="cumulative" radius={[8, 8, 0, 0]}>
                        {stageBarData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index === 0 ? '#059669' : index === stageBarData.length - 1 ? '#e11d48' : '#3b82f6'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Key Insights & Educational Analysis */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-md flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  <Info className="w-4 h-4 text-emerald-300" />
                  <span>Supply Chain Economics</span>
                </div>

                <h3 className="text-xl font-display font-extrabold text-white">
                  Why Price Spread ≠ Pure Middleman Profit
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentChain.keyInsights.summary}
                </p>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-2 text-xs">
                  <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Cost vs. Margin Separation</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Out of the ₹{(totalRetailPrice - farmerShareAmount).toFixed(1)} middleman spread, <strong>₹{totalOperationalCost.toFixed(1)}</strong> is consumed by diesel, open-truck rotting, and loading. Eliminating transit damage is the key to paying farmers more without hurting consumers.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ThermometerSnowflake className="w-4 h-4 text-amber-300" />
                    <span>Wastage Factor</span>
                  </div>
                  <p className="text-[11px] text-amber-100/90 leading-relaxed">
                    {currentChain.keyInsights.wastageImpactNote}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('direct_comparison')}
                className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Compare with KisanMandi Direct Model</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Traditional vs. Direct Comparison Model */}
      {activeTab === 'direct_comparison' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: Traditional Supply Chain */}
            <div className="bg-rose-50/40 rounded-3xl border border-rose-200 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-rose-200 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Traditional APMC Supply Chain
                    </h3>
                    <p className="text-xs text-rose-700 font-semibold">5 Tiers • High Friction & Loss</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-rose-800 bg-rose-200/80 px-2.5 py-1 rounded-full">
                  Fragmented
                </span>
              </div>

              {/* Key Metrics */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-3 rounded-2xl bg-white border border-rose-100">
                  <span className="text-slate-600">Farmer Net Earnings:</span>
                  <span className="font-extrabold text-base text-rose-800">
                    {formatIndianRupees(currentChain.farmerReceivedPricePerKg, { precision: 1 })}/kg
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-2xl bg-white border border-rose-100">
                  <span className="text-slate-600">Consumer Retail Price:</span>
                  <span className="font-extrabold text-base text-slate-900">
                    {formatIndianRupees(currentChain.directModel.traditionalFinalRetailPrice, { precision: 1 })}/kg
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-2xl bg-white border border-rose-100">
                  <span className="text-slate-600">Middleman Deduction Cut:</span>
                  <span className="font-bold text-rose-700">6% - 10% Commission Agent Fee</span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-2xl bg-white border border-rose-100">
                  <span className="text-slate-600">Payment Timeline:</span>
                  <span className="font-bold text-rose-700">15 to 45 Days Delayed Cheques</span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-2xl bg-white border border-rose-100">
                  <span className="text-slate-600">Transit Food Spoilage:</span>
                  <span className="font-bold text-rose-700">{currentChain.directModel.spoilageTraditionalPct}% Rotted in Open Trucks</span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-2xl bg-white border border-rose-100">
                  <span className="text-slate-600">Quality Inspection:</span>
                  <span className="font-bold text-rose-700">Subjective Visual Downgrading</span>
                </div>
              </div>
            </div>

            {/* Column 2: KisanMandi Direct Digital Bridge */}
            <div className="bg-emerald-50/60 rounded-3xl border-2 border-emerald-500 p-6 sm:p-8 space-y-6 shadow-md relative">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-sm">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-emerald-950">
                      KisanMandi Direct Digital Bridge
                    </h3>
                    <p className="text-xs text-emerald-800 font-bold">1 Direct Link • Zero Middleman Deduction</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-900 bg-emerald-200 px-3 py-1 rounded-full">
                  0% Commission
                </span>
              </div>

              {/* Key Metrics */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-3 rounded-2xl bg-white border border-emerald-300 shadow-2xs">
                  <span className="text-slate-700 font-semibold">Farmer Direct Net Earnings:</span>
                  <div className="text-right">
                    <span className="font-extrabold text-lg text-emerald-800">
                      {formatIndianRupees(currentChain.directModel.farmerFarmgatePrice, { precision: 1 })}/kg
                    </span>
                    <span className="text-[10px] text-emerald-700 block font-bold">
                      (+{currentChain.directModel.farmerGainPercentage}% higher realization)
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-2xl bg-white border border-emerald-300 shadow-2xs">
                  <span className="text-slate-700 font-semibold">Buyer Direct Farm Price:</span>
                  <div className="text-right">
                    <span className="font-extrabold text-lg text-blue-800">
                      {formatIndianRupees(currentChain.directModel.finalDirectBuyerPrice, { precision: 1 })}/kg
                    </span>
                    <span className="text-[10px] text-blue-700 block font-bold">
                      ({currentChain.directModel.buyerSavingsPercentage}% consumer savings)
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-2xl bg-white border border-emerald-200">
                  <span className="text-slate-700 font-semibold">Farmer Platform Commission:</span>
                  <span className="font-extrabold text-emerald-800">₹0.00 (100% Free for Farmer)</span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-2xl bg-white border border-emerald-200">
                  <span className="text-slate-700 font-semibold">Payment Settlement:</span>
                  <span className="font-extrabold text-emerald-800">{currentChain.directModel.paymentSettlementTime}</span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-2xl bg-white border border-emerald-200">
                  <span className="text-slate-700 font-semibold">IoT Cold-Chain Telemetry:</span>
                  <span className="font-extrabold text-emerald-800">&lt;{currentChain.directModel.spoilageDirectPct}% Loss (Reefer Fleet)</span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-2xl bg-white border border-emerald-200">
                  <span className="text-slate-700 font-semibold">Quality Assay:</span>
                  <span className="font-extrabold text-emerald-800">Gemini AI AGMARK Computer Vision</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Interactive Batch Harvest & Procurement Calculator */}
      {activeTab === 'batch_calculator' && (
        <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-6 sm:p-8 shadow-2xs space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-700" />
                <span>Interactive Harvest & Bulk Batch Simulator</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your harvest lot volume or bulk procurement order size to calculate exact monetary impact.
              </p>
            </div>

            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Active Crop: {currentChain.commodityName}
            </span>
          </div>

          {/* Volume Slider & Presets */}
          <div className="bg-slate-50 p-6 rounded-3xl gradient-border-organic border-0 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Harvest Lot Quantity ({batchQuantityKg.toLocaleString()} kg / {(batchQuantityKg / 1000).toFixed(1)} MT)
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {(batchQuantityKg / 100).toFixed(0)} Quintals ({Math.round(batchQuantityKg / 25)} standard 25kg crates)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="50"
                  max="100000"
                  step="100"
                  value={batchQuantityKg}
                  onChange={(e) => setBatchQuantityKg(Math.max(1, Number(e.target.value) || 0))}
                  className="w-32 px-3 py-2 bg-white border border-slate-300 rounded-xl font-extrabold text-sm text-slate-900 focus:outline-emerald-600"
                />
                <span className="text-xs font-bold text-slate-500">kg</span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="100"
              max="20000"
              step="100"
              value={batchQuantityKg}
              onChange={(e) => setBatchQuantityKg(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
            />

            {/* Quick Presets */}
            <div className="flex items-center gap-2 pt-1 overflow-x-auto">
              <span className="text-[11px] font-semibold text-slate-400">Quick Presets:</span>
              {[
                { label: '500 kg (Smallholder)', val: 500 },
                { label: '2,000 kg (Pick-up Bolero)', val: 2000 },
                { label: '5,000 kg (Mini Truck)', val: 5000 },
                { label: '10,000 kg (10 MT Truck)', val: 10000 },
                { label: '20,000 kg (Heavy Reefer)', val: 20000 },
              ].map((preset) => (
                <button
                  key={preset.val}
                  onClick={() => setBatchQuantityKg(preset.val)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    batchQuantityKg === preset.val
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Batch Impact Result Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Farmer Realization Gain */}
            <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-500 space-y-3">
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center justify-between">
                <span>Farmer Bank Credit Gain</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-extrabold">
                  +{batchResult.farmerGainPct}% Extra
                </span>
              </div>
              <div className="text-3xl font-display font-extrabold text-emerald-950">
                +{formatIndianRupees(batchResult.farmerNetGainAmount)}
              </div>
              <div className="text-xs text-emerald-900 space-y-1 pt-2 border-t border-emerald-200">
                <div className="flex justify-between">
                  <span>Direct Farmgate Revenue:</span>
                  <strong className="text-emerald-950">{formatIndianRupees(batchResult.farmerRevenueDirect)}</strong>
                </div>
                <div className="flex justify-between text-slate-500 line-through">
                  <span>Traditional Mandi Take-Home:</span>
                  <span>{formatIndianRupees(batchResult.farmerRevenueTraditional)}</span>
                </div>
              </div>
            </div>

            {/* Consumer / Buyer Spend Savings */}
            <div className="p-6 rounded-3xl bg-blue-50 border-2 border-blue-400 space-y-3">
              <div className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center justify-between">
                <span>Consumer Spend Saved</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-200 text-blue-900 text-[10px] font-extrabold">
                  -{batchResult.consumerSavingsPct}% Saved
                </span>
              </div>
              <div className="text-3xl font-display font-extrabold text-blue-950">
                {formatIndianRupees(batchResult.consumerNetSavingsAmount)}
              </div>
              <div className="text-xs text-blue-900 space-y-1 pt-2 border-t border-blue-200">
                <div className="flex justify-between">
                  <span>Direct Procurement Cost:</span>
                  <strong className="text-blue-950">{formatIndianRupees(batchResult.consumerSpendDirect)}</strong>
                </div>
                <div className="flex justify-between text-slate-500 line-through">
                  <span>Traditional Retail Cost:</span>
                  <span>{formatIndianRupees(batchResult.consumerSpendTraditional)}</span>
                </div>
              </div>
            </div>

            {/* Food Wastage Salvaged */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-3">
              <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center justify-between">
                <span>Produce Rotting Prevented</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-[10px] font-extrabold">
                  Cold-Chain Saved
                </span>
              </div>
              <div className="text-3xl font-display font-extrabold text-white">
                {batchResult.totalTransitWastageSavedKg.toLocaleString()} kg
              </div>
              <div className="text-xs text-slate-300 space-y-1 pt-2 border-t border-slate-700">
                <div className="flex justify-between">
                  <span>Economic Value Saved:</span>
                  <strong className="text-emerald-300">+{formatIndianRupees(batchResult.totalWastageValueSaved)}</strong>
                </div>
                <div className="text-[11px] text-slate-400">
                  Keeps fresh food out of landfills and in kitchen pantries.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
