import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Truck,
  Coins,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Building2,
  Store,
  Tractor,
  ShieldCheck,
  Check,
  Award,
  Clock,
  Zap,
  Split,
  Scale
} from 'lucide-react';
import {
  scoreProductCompatibility,
  scoreQuantityCompatibility,
  scoreDistance,
  scorePriceCompatibility,
  calculateDeliveryCostAndScore,
  scoreDemandUrgency,
  scoreHarvestDate,
  scoreFreshness,
  DEFAULT_MATCHING_CONFIG,
} from '../services/smartMatchingService';
import { MatchingFarmerListing, MatchingBuyerRequirement } from '../types';

export const SmartMatchingSimulator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'judge_scenario' | 'custom_sandbox'>('judge_scenario');

  // Judge Scenario Interactive State
  const [scenarioStep, setScenarioStep] = useState<number>(4);
  const [customLotQty, setCustomLotQty] = useState<number>(1000);
  const [customFarmerPrice, setCustomFarmerPrice] = useState<number>(20);
  const [customLogisticsFee, setCustomLogisticsFee] = useState<number>(2);
  const [customPlatformFee, setCustomPlatformFee] = useState<number>(1);

  // Computed values for scenario
  const traditionalFarmerPrice = 12;
  const traditionalRetailPrice = 30;
  const directBuyerPrice = customFarmerPrice + customLogisticsFee + customPlatformFee;
  const farmerUpliftPct = Math.round(((customFarmerPrice - traditionalFarmerPrice) / traditionalFarmerPrice) * 1000) / 10;
  const buyerSavingsPct = Math.round(((traditionalRetailPrice - directBuyerPrice) / traditionalRetailPrice) * 1000) / 10;

  // Farmer State in Sandbox
  const [farmerCrop, setFarmerCrop] = useState('Tomato');
  const [farmerVariety, setFarmerVariety] = useState('Abhinav Hybrid F1');
  const [farmerGrade, setFarmerGrade] = useState<'A+' | 'A' | 'B' | 'C'>('A');
  const [farmerQty, setFarmerQty] = useState(500);
  const [farmerMinPrice, setFarmerMinPrice] = useState(18);
  const [farmerDistance, setFarmerDistance] = useState(25);
  const [harvestDaysPrior, setHarvestDaysPrior] = useState(1);
  const [farmerOrganic, setFarmerOrganic] = useState(true);
  const [coldChain, setColdChain] = useState(true);

  // Buyer State in Sandbox
  const [buyerCrop, setBuyerCrop] = useState('Tomato');
  const [buyerVariety, setBuyerVariety] = useState('Abhinav Hybrid F1');
  const [buyerRequiredGrade, setBuyerRequiredGrade] = useState<'A+' | 'A' | 'B' | 'Any'>('A');
  const [buyerQty, setBuyerQty] = useState(400);
  const [buyerMaxBudget, setBuyerMaxBudget] = useState(25);
  const [buyerUrgency, setBuyerUrgency] = useState<'urgent' | 'high' | 'medium' | 'low'>('high');
  const [buyerOrganicReq, setBuyerOrganicReq] = useState(false);

  // Mock Objects for Evaluation
  const mockFarmer: MatchingFarmerListing = {
    id: 'sim-farmer',
    farmerId: 'f1',
    farmerName: 'Simulated Farmer',
    farmerPhone: '+91 99999 00000',
    cropName: farmerCrop,
    variety: farmerVariety,
    category: 'Vegetables',
    quantityAvailableKg: farmerQty,
    initialQuantityKg: farmerQty,
    reservedQuantityKg: 0,
    unit: 'kg',
    minimumPricePerKg: farmerMinPrice,
    qualityGrade: farmerGrade,
    harvestDate: '2026-09-10',
    shelfLifeDays: 6,
    location: {
      name: 'Farm Location',
      district: 'Gautam Buddha Nagar',
      state: 'Uttar Pradesh',
      latitude: 28.4744,
      longitude: 77.504,
    },
    isOrganic: farmerOrganic,
    chemicalFree: true,
    coldChainStored: coldChain,
    status: 'active',
  };

  const mockBuyer: MatchingBuyerRequirement = {
    id: 'sim-buyer',
    buyerId: 'b1',
    buyerName: 'Simulated Buyer',
    buyerCompany: 'Simulated Hospitality Co',
    buyerType: 'Restaurant',
    buyerPhone: '+91 99999 11111',
    cropRequired: buyerCrop,
    variety: buyerVariety,
    category: 'Vegetables',
    quantityRequiredKg: buyerQty,
    maximumBudgetPerKg: buyerMaxBudget,
    qualityRequirement: buyerRequiredGrade,
    deliveryLocation: {
      name: 'Buyer Hub',
      district: 'Delhi NCR',
      state: 'Delhi',
      latitude: 28.5355,
      longitude: 77.391,
    },
    requiredDeliveryDate: '2026-09-11',
    urgency: buyerUrgency,
    priorityScore: 85,
    isOrganicRequired: buyerOrganicReq,
    status: 'active',
  };

  // Perform Real-Time Scoring
  const productEval = scoreProductCompatibility(mockFarmer, mockBuyer);
  const qtyEval = scoreQuantityCompatibility(farmerQty, buyerQty);
  const distEval = scoreDistance(farmerDistance, DEFAULT_MATCHING_CONFIG.maxDistanceKm);
  const priceEval = scorePriceCompatibility(farmerMinPrice, buyerMaxBudget);
  const deliveryEval = calculateDeliveryCostAndScore(
    farmerDistance,
    qtyEval.matchedQty,
    DEFAULT_MATCHING_CONFIG.deliveryCostParams
  );
  const demandEval = scoreDemandUrgency(mockBuyer);
  const harvestEval = scoreHarvestDate('2026-09-10', '2026-09-11', 6);
  const freshnessEval = scoreFreshness('2026-09-10', 6, coldChain);

  const weights = DEFAULT_MATCHING_CONFIG.weights;
  const totalWeight =
    weights.product +
    weights.quantity +
    weights.distance +
    weights.price +
    weights.delivery +
    weights.demand +
    weights.harvest +
    weights.freshness;

  const weightedSum =
    productEval.score * weights.product +
    qtyEval.score * weights.quantity +
    distEval.score * weights.distance +
    priceEval.score * weights.price +
    deliveryEval.deliveryScore * weights.delivery +
    demandEval.score * weights.demand +
    harvestEval.score * weights.harvest +
    freshnessEval.score * weights.freshness;

  const compositeScore = Math.round((weightedSum / totalWeight) * 10) / 10;

  const resetToCanonical = () => {
    setFarmerCrop('Tomato');
    setFarmerVariety('Abhinav Hybrid F1');
    setFarmerGrade('A');
    setFarmerQty(500);
    setFarmerMinPrice(18);
    setFarmerDistance(25);
    setFarmerOrganic(true);
    setColdChain(true);

    setBuyerCrop('Tomato');
    setBuyerVariety('Abhinav Hybrid F1');
    setBuyerRequiredGrade('A');
    setBuyerQty(400);
    setBuyerMaxBudget(25);
    setBuyerUrgency('high');
    setBuyerOrganicReq(false);
  };

  return (
    <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-6 space-y-6 shadow-xs">
      
      {/* Top Header & Tab Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Supply Chain Disintermediation & Matching Engine
              </h3>
              <p className="text-xs text-slate-500">
                End-to-end multi-buyer order aggregation, route optimization & price recommendation
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('judge_scenario')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'judge_scenario'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>1,000 kg Potato Benchmark</span>
            <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">Scenario</span>
          </button>

          <button
            onClick={() => setActiveTab('custom_sandbox')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'custom_sandbox'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Multi-Factor Sandbox</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: JUDGE BENCHMARK SCENARIO (1,000 kg Potato Disintermediation) */}
      {/* ========================================================================= */}
      {activeTab === 'judge_scenario' && (
        <div className="space-y-6">
          
          {/* Executive Overview Badge */}
          <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 rounded-3xl border border-emerald-700/40 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Exact Live Scenario Execution: 1,000 kg Potato Lot</span>
                </div>
                <h4 className="text-xl font-black text-white">
                  Smallholder Harvest Disintermediation & Multi-Buyer Aggregation
                </h4>
                <p className="text-xs text-slate-300 max-w-2xl">
                  Watch how KisanDirect receives a 1,000 kg potato harvest, eliminates 5 traditional middleman markups, 
                  aggregates demand across 3 institutional buyers, consolidates freight, and delivers +66.7% farmer income and -23.3% consumer cost.
                </p>
              </div>

              {/* Quick Result Badges */}
              <div className="flex flex-row md:flex-col gap-2 shrink-0">
                <div className="bg-emerald-900/80 border border-emerald-500/40 px-3 py-2 rounded-xl text-center">
                  <div className="text-[10px] text-emerald-300 font-bold uppercase">Farmer Realization</div>
                  <div className="text-lg font-black text-white font-mono">₹12 → ₹{customFarmerPrice}/kg <span className="text-emerald-300 text-xs">+{farmerUpliftPct}%</span></div>
                </div>
                <div className="bg-cyan-950/80 border border-cyan-500/40 px-3 py-2 rounded-xl text-center">
                  <div className="text-[10px] text-cyan-300 font-bold uppercase">Buyer Price</div>
                  <div className="text-lg font-black text-white font-mono">₹30 → ₹{directBuyerPrice}/kg <span className="text-cyan-300 text-xs">-{buyerSavingsPct}%</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Steps Visualizer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Card: Input & Traditional 5-Tier Chain */}
            <div className="p-5 rounded-2xl bg-slate-50 gradient-border-organic border-0 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">1</div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Harvest Intake & Traditional Chain</h5>
                    <p className="text-[11px] text-slate-500">Mandi APMC 5-Tier Middlemen Extraction</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">5 Intermediaries</span>
              </div>

              {/* Incoming Harvest Telemetry */}
              <div className="p-3 bg-white rounded-xl gradient-border-organic border-0 space-y-2 text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Tractor className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Incoming Harvest Lot Metadata:</span>
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[9px]">COMMODITY</span>
                    <span className="font-bold text-slate-800">Potato (1,000 kg)</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[9px]">LOCATION</span>
                    <span className="font-bold text-slate-800">Fatehabad, Agra</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[9px]">HARVEST DATE</span>
                    <span className="font-bold text-slate-800">Today (Fresh Lot)</span>
                  </div>
                </div>
              </div>

              {/* Traditional Chain Step Breakdown */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-700">Traditional Value Extraction Chain:</div>
                
                <div className="space-y-1 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <span className="font-sans font-semibold text-emerald-950 flex items-center gap-1.5">
                      <Tractor className="w-3.5 h-3.5 text-emerald-700" />
                      <span>1. Farmer (Farmgate Sale)</span>
                    </span>
                    <span className="font-bold text-emerald-800">₹12 / kg</span>
                  </div>

                  <div className="p-2 rounded-lg bg-white gradient-border-organic border-0 flex items-center justify-between text-slate-700">
                    <span className="font-sans flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-slate-400" />
                      <span>2. Local Village Trader (Kachha Arhatiya)</span>
                    </span>
                    <span className="font-bold text-slate-900">₹15 / kg (+₹3)</span>
                  </div>

                  <div className="p-2 rounded-lg bg-white gradient-border-organic border-0 flex items-center justify-between text-slate-700">
                    <span className="font-sans flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>3. APMC Mandi Wholesaler (Pakka Arhatiya)</span>
                    </span>
                    <span className="font-bold text-slate-900">₹19 / kg (+₹4)</span>
                  </div>

                  <div className="p-2 rounded-lg bg-white gradient-border-organic border-0 flex items-center justify-between text-slate-700">
                    <span className="font-sans flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-slate-400" />
                      <span>4. City Terminal Distributor</span>
                    </span>
                    <span className="font-bold text-slate-900">₹23 / kg (+₹4)</span>
                  </div>

                  <div className="p-2 rounded-lg bg-white gradient-border-organic border-0 flex items-center justify-between text-slate-700">
                    <span className="font-sans flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-slate-400" />
                      <span>5. Local Kirana / Pushcart Retailer</span>
                    </span>
                    <span className="font-bold text-slate-900">₹28 / kg (+₹5)</span>
                  </div>

                  <div className="p-2 rounded-lg bg-red-50 border border-red-200 flex items-center justify-between">
                    <span className="font-sans font-bold text-red-950 flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-red-600" />
                      <span>Final Consumer Pays</span>
                    </span>
                    <span className="font-bold text-red-700">₹30 / kg</span>
                  </div>
                </div>

                <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900">
                  <span className="font-bold">Traditional Result: </span>
                  Farmer receives only 40.0% of consumer spend. ₹18/kg (60.0%) lost to 5 middleman cuts & 20% spoilage.
                </div>
              </div>
            </div>

            {/* Right Card: KisanDirect Digital Platform Matching & Disintermediation */}
            <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">2</div>
                  <div>
                    <h5 className="font-bold text-emerald-950 text-sm">KisanDirect Multi-Buyer Aggregation</h5>
                    <p className="text-[11px] text-emerald-700">Consolidated Route & Direct Escrow Payout</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">1 Digital Platform</span>
              </div>

              {/* Discovered Multi-Buyer Demand Splits */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <Split className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Split Demand Matching (100% Volume Fulfilled):</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-800">1,000 / 1,000 kg matched</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-emerald-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">Buyer A (Grand Horizon Hotel)</div>
                      <div className="text-[10px] text-slate-500">Drop 1 • Noida Sector 62 • Delivery: Today</div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">400 kg</span>
                      <div className="text-[10px] text-slate-400 mt-0.5">₹23/kg delivered</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-emerald-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">Buyer B (FreshChoice Supermarket)</div>
                      <div className="text-[10px] text-slate-500">Drop 2 • Greater Noida Knowledge Park</div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">300 kg</span>
                      <div className="text-[10px] text-slate-400 mt-0.5">₹23/kg delivered</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-emerald-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">Buyer C (GreenBite Community Kitchen)</div>
                      <div className="text-[10px] text-slate-500">Drop 3 • Indirapuram, Ghaziabad</div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">300 kg</span>
                      <div className="text-[10px] text-slate-400 mt-0.5">₹23/kg delivered</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Price Breakdown */}
              <div className="p-3 bg-white rounded-xl border border-emerald-300 space-y-2 text-xs">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Transparent Price Recommendation:</span>
                  <span className="font-mono text-emerald-800 text-sm font-black">₹23 / kg Total</span>
                </div>

                <div className="space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600 font-sans">1. Direct Farmer Realization (Take-Home):</span>
                    <span className="font-bold text-emerald-700">₹{customFarmerPrice}.00 / kg</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600 font-sans">2. Consolidated Multi-Drop Reefer Freight:</span>
                    <span className="font-bold text-slate-800">₹{customLogisticsFee}.00 / kg</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600 font-sans">3. KisanDirect Escrow & Digital Assay:</span>
                    <span className="font-bold text-slate-800">₹{customPlatformFee}.00 / kg</span>
                  </div>
                  <div className="flex justify-between py-1 font-bold text-slate-900">
                    <span className="font-sans">Buyer Pays Delivered:</span>
                    <span className="text-emerald-700 font-black">₹{directBuyerPrice}.00 / kg</span>
                  </div>
                </div>
              </div>

              {/* Route Optimization */}
              <div className="p-2.5 bg-emerald-950 text-white rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between text-emerald-300 font-bold text-[11px]">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Consolidated Route Optimization</span>
                  </span>
                  <span className="font-mono">198 km • 4.2 Hours</span>
                </div>
                <div className="text-[11px] text-slate-300 font-mono">
                  Farm (Agra) → Drop 1 (Greater Noida) → Drop 2 (Noida Sec 62) → Drop 3 (Ghaziabad)
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Verification & Impact Comparison Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-300 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <h4 className="font-bold text-base text-slate-900">
                Mathematical Verification of Results
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              
              <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs">
                <div className="text-xs text-slate-500 font-bold uppercase">FARMER REVENUE</div>
                <div className="text-2xl font-black text-emerald-800 font-mono mt-1">₹12 → ₹{customFarmerPrice}</div>
                <div className="text-xs font-bold text-emerald-700 mt-0.5">+{farmerUpliftPct}% Earnings</div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">₹20,000 total vs ₹12,000 mandi</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-cyan-200 shadow-2xs">
                <div className="text-xs text-slate-500 font-bold uppercase">BUYER / CONSUMER COST</div>
                <div className="text-2xl font-black text-cyan-800 font-mono mt-1">₹30 → ₹{directBuyerPrice}</div>
                <div className="text-xs font-bold text-cyan-700 mt-0.5">-{buyerSavingsPct}% Cost Reduction</div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">₹23,000 total vs ₹30,000 retail</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-2xs">
                <div className="text-xs text-slate-500 font-bold uppercase">INTERMEDIARY COMPRESSION</div>
                <div className="text-2xl font-black text-purple-800 font-mono mt-1">5 → 1</div>
                <div className="text-xs font-bold text-purple-700 mt-0.5">Collapsed into 1 Platform</div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">Instant UPI vs 15-day delayed credit</div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CUSTOM MULTI-FACTOR SANDBOX */}
      {/* ========================================================================= */}
      {activeTab === 'custom_sandbox' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-700" />
                <span>Custom Algorithmic Matching Sandbox</span>
              </h4>
              <p className="text-xs text-slate-500">
                Adjust variables to test multi-factor distance, price elasticity, freshness, and delivery scoring.
              </p>
            </div>

            <button
              onClick={resetToCanonical}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Parameters</span>
            </button>
          </div>

          {/* Two-Column Sliders (Farmer Supply vs Buyer Demand) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Farmer Supply Parameters */}
            <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <span className="font-extrabold text-emerald-950 text-sm flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span>Simulated Farmer Supply</span>
                </span>
                <span className="text-[10px] text-emerald-800 font-bold uppercase">Supply Node</span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Crop & Variety</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={farmerCrop}
                    onChange={(e) => setFarmerCrop(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-semibold"
                    placeholder="Crop name"
                  />
                  <input
                    type="text"
                    value={farmerVariety}
                    onChange={(e) => setFarmerVariety(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-semibold"
                    placeholder="Variety"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-700 font-bold">Available Quantity:</span>
                  <span className="font-mono font-extrabold text-emerald-800">{farmerQty.toLocaleString()} kg</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={10000}
                  step={50}
                  value={farmerQty}
                  onChange={(e) => setFarmerQty(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-700 font-bold">Farmer Minimum Floor Price:</span>
                  <span className="font-mono font-extrabold text-emerald-800">₹{farmerMinPrice}/kg</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={120}
                  step={0.5}
                  value={farmerMinPrice}
                  onChange={(e) => setFarmerMinPrice(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-700 font-bold">Transit Distance to Buyer:</span>
                  <span className="font-mono font-extrabold text-emerald-800">{farmerDistance} km</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={500}
                  step={2}
                  value={farmerDistance}
                  onChange={(e) => setFarmerDistance(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={farmerOrganic}
                    onChange={(e) => setFarmerOrganic(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Certified Organic</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={coldChain}
                    onChange={(e) => setColdChain(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Cold Chain Pre-Cooled</span>
                </label>
              </div>
            </div>

            {/* Right: Buyer Demand Parameters */}
            <div className="p-5 rounded-2xl bg-blue-50/40 border border-blue-200 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                <span className="font-extrabold text-blue-950 text-sm flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span>Simulated Buyer Demand</span>
                </span>
                <span className="text-[10px] text-blue-800 font-bold uppercase">Demand Node</span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Required Crop & Variety</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={buyerCrop}
                    onChange={(e) => setBuyerCrop(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-semibold"
                    placeholder="Crop required"
                  />
                  <input
                    type="text"
                    value={buyerVariety}
                    onChange={(e) => setBuyerVariety(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-semibold"
                    placeholder="Variety"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-700 font-bold">Quantity Required:</span>
                  <span className="font-mono font-extrabold text-blue-800">{buyerQty.toLocaleString()} kg</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={10000}
                  step={50}
                  value={buyerQty}
                  onChange={(e) => setBuyerQty(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-700 font-bold">Buyer Maximum Ceiling Budget:</span>
                  <span className="font-mono font-extrabold text-blue-800">₹{buyerMaxBudget}/kg</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={120}
                  step={0.5}
                  value={buyerMaxBudget}
                  onChange={(e) => setBuyerMaxBudget(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Urgency Level</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['urgent', 'high', 'medium', 'low'] as const).map((urg) => (
                    <button
                      key={urg}
                      type="button"
                      onClick={() => setBuyerUrgency(urg)}
                      className={`py-1 rounded-lg font-bold text-[11px] capitalize border transition-all ${
                        buyerUrgency === urg
                          ? 'bg-blue-800 text-white border-blue-900 shadow-2xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {urg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={buyerOrganicReq}
                    onChange={(e) => setBuyerOrganicReq(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Strict Certified Organic Requirement</span>
                </label>
              </div>
            </div>
          </div>

          {/* Live Calculated Score Card */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Live Algorithmic Result
                </div>
                <div className="text-2xl sm:text-3xl font-black flex items-center gap-3 mt-1">
                  <span>{compositeScore} / 100</span>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-extrabold border ${
                      compositeScore >= 80
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                        : compositeScore >= 60
                        ? 'bg-blue-500/20 text-blue-300 border-blue-400/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                    }`}
                  >
                    {compositeScore >= 85
                      ? 'Excellent Match'
                      : compositeScore >= 70
                      ? 'Good Match'
                      : compositeScore >= 50
                      ? 'Possible Match'
                      : 'Low Match Score'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs text-slate-300">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Est. Deal Price</div>
                  <div className="text-base font-bold text-white">₹{priceEval.estimatedPrice}/kg</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Freight Cost</div>
                  <div className="text-base font-bold text-white">₹{deliveryEval.totalDeliveryCost.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Fulfillment</div>
                  <div className="text-base font-bold text-white">{qtyEval.fulfillmentPct}%</div>
                </div>
              </div>
            </div>

            {/* 8-Factor Sub-Score Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="text-[10px] text-slate-400">Product Score (25%)</div>
                <div className="text-sm font-bold text-emerald-400">{productEval.score}%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="text-[10px] text-slate-400">Quantity Score (15%)</div>
                <div className="text-sm font-bold text-blue-400">{qtyEval.score}%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="text-[10px] text-slate-400">Distance Score (15%)</div>
                <div className="text-sm font-bold text-teal-400">{distEval.score}%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="text-[10px] text-slate-400">Price Score (15%)</div>
                <div className="text-sm font-bold text-amber-400">{priceEval.score}%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="text-[10px] text-slate-400">Freight Score (10%)</div>
                <div className="text-sm font-bold text-purple-400">{deliveryEval.deliveryScore}%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="text-[10px] text-slate-400">Demand Score (8%)</div>
                <div className="text-sm font-bold text-indigo-400">{demandEval.score}%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="text-[10px] text-slate-400">Harvest Sync (7%)</div>
                <div className="text-sm font-bold text-green-400">{harvestEval.score}%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="text-[10px] text-slate-400">Freshness (5%)</div>
                <div className="text-sm font-bold text-emerald-400">{freshnessEval.score}%</div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

