import React, { useState, useEffect, useMemo } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Users, Truck, ShoppingCart, Activity, RefreshCw, Box, MapPin, Building2, CheckCircle2, Factory, Store, Play, Search, Sliders, Tractor } from 'lucide-react';
import { CropDistressAlert, MatchingBuyerRequirement, MatchingFarmerListing } from '../types';
import { detectCropDistress } from '../services/cropDistressService';
import { DEMO_BUYER_REQUIREMENTS, DEMO_FARMER_LISTINGS } from '../services/smartMatchingService';

export const CropDistressDemo: React.FC = () => {
  const [alertData, setAlertData] = useState<CropDistressAlert | null>(null);
  const [demoState, setDemoState] = useState<'initial' | 'detected' | 'searching' | 'matched'>('initial');
  
  const [inputSupply, setInputSupply] = useState<number>(10000);
  const [inputDemand, setInputDemand] = useState<number>(6000);

  // Generate mock farmers based on total supply requested (assuming ~500kg per farmer for demo)
  const DEMO_FARMERS = useMemo(() => {
    const numFarmers = Math.ceil(inputSupply / 500);
    return Array.from({ length: numFarmers }).map((_, i) => {
      // distribute exact remainder on the last farmer if not a multiple of 500
      const qty = (i === numFarmers - 1 && inputSupply % 500 !== 0) ? inputSupply % 500 : 500;
      return {
        ...DEMO_FARMER_LISTINGS[0],
        id: `farmer-distress-${i}`,
        farmerName: `Demo Farmer ${i+1}`,
        quantityAvailableKg: qty,
        harvestDate: '2026-09-10'
      } as MatchingFarmerListing;
    });
  }, [inputSupply]);

  const DEMO_BUYERS: MatchingBuyerRequirement[] = useMemo(() => [
    {
      ...DEMO_BUYER_REQUIREMENTS[0],
      buyerType: 'Food Processor',
      quantityRequiredKg: 2000,
      buyerName: 'National Food Processors Ltd',
      cropRequired: 'Tomato'
    },
    {
      ...DEMO_BUYER_REQUIREMENTS[1],
      buyerType: 'Supermarket Chain',
      quantityRequiredKg: 1000,
      buyerName: 'Reliance Fresh Retail',
      cropRequired: 'Tomato'
    },
    {
      ...DEMO_BUYER_REQUIREMENTS[2],
      buyerType: 'Retailer',
      quantityRequiredKg: 1000,
      buyerName: 'Local Buyers Association',
      cropRequired: 'Tomato'
    },
    {
      ...DEMO_BUYER_REQUIREMENTS[0],
      id: 'buyer-extra-1',
      buyerType: 'Wholesaler',
      quantityRequiredKg: 2000,
      buyerName: 'City School District Catering',
      cropRequired: 'Tomato'
    }
  ], []); // Total potential recovery = 6000 kg

  // Re-run simulation dynamically if state changes while in detected or matched state
  useEffect(() => {
    if (demoState === 'detected') {
      const initialAlert = detectCropDistress({
        farmers: DEMO_FARMERS,
        buyers: [],
        targetCrop: 'Tomato',
        targetRegion: '',
        confirmedDemandKg: inputDemand
      });
      setAlertData(initialAlert);
    } else if (demoState === 'matched') {
      const recoveredAlert = detectCropDistress({
        farmers: DEMO_FARMERS,
        buyers: DEMO_BUYERS,
        targetCrop: 'Tomato',
        targetRegion: '',
        confirmedDemandKg: inputDemand
      });
      setAlertData(recoveredAlert);
    }
  }, [inputSupply, inputDemand, DEMO_FARMERS, DEMO_BUYERS, demoState]);


  const handleStartDemo = () => {
    setDemoState('detected');
    const initialAlert = detectCropDistress({
      farmers: DEMO_FARMERS,
      buyers: [],
      targetCrop: 'Tomato',
      targetRegion: '',
      confirmedDemandKg: inputDemand
    });
    setAlertData(initialAlert);
  };

  const handleSearchBuyers = () => {
    setDemoState('searching');
    setTimeout(() => {
      const recoveredAlert = detectCropDistress({
        farmers: DEMO_FARMERS,
        buyers: DEMO_BUYERS,
        targetCrop: 'Tomato',
        targetRegion: '',
        confirmedDemandKg: inputDemand
      });
      setAlertData(recoveredAlert);
      setDemoState('matched');
    }, 1500);
  };

  const handleReset = () => {
    setDemoState('initial');
    setAlertData(null);
  };

  const getAlertBannerColor = () => {
    if (demoState === 'matched') {
      if (alertData?.status === 'PARTIALLY_RECOVERED') return 'bg-orange-50 border-orange-300';
      if (alertData?.status === 'FULLY_RECOVERED') return 'bg-emerald-50 border-emerald-300';
    }
    return 'bg-red-50 border-red-300';
  };

  const getAlertBannerText = () => {
    if (demoState === 'matched') {
      if (alertData?.status === 'PARTIALLY_RECOVERED') return 'PARTIAL RECOVERY';
      if (alertData?.status === 'FULLY_RECOVERED') return 'SURPLUS RECOVERED';
    }
    return 'CROP DISTRESS ALERT';
  };

  const getAlertBannerIconColor = () => {
    if (demoState === 'matched') {
      if (alertData?.status === 'PARTIALLY_RECOVERED') return 'text-orange-800 bg-orange-100 border-orange-200';
      if (alertData?.status === 'FULLY_RECOVERED') return 'text-emerald-800 bg-emerald-100 border-emerald-200';
    }
    return 'text-red-800 bg-red-100 border-red-200';
  };

  const getAlertTitle = () => {
    if (demoState === 'matched') {
      if (alertData?.status === 'FULLY_RECOVERED') return `${alertData.additionalDemandKg.toLocaleString()} kg additional demand found`;
      if (alertData?.status === 'PARTIALLY_RECOVERED') return `${alertData.additionalDemandKg.toLocaleString()} kg demand recovered`;
      return `${alertData?.additionalDemandKg.toLocaleString()} kg demand found`;
    }
    if (alertData?.expectedSurplusKg === 0) return `Supply is balanced with demand`;
    return `Expected tomato surplus: ${alertData?.expectedSurplusKg.toLocaleString()} kg`;
  };

  const getAlertDescription = () => {
    if (demoState === 'matched') {
      if (alertData?.status === 'FULLY_RECOVERED') return 'Remaining expected surplus: 0 kg. Recovery: 100%.';
      if (alertData?.status === 'PARTIALLY_RECOVERED') return `${alertData.remainingSurplusKg.toLocaleString()} kg surplus remains. Continue searching...`;
    }
    if (alertData?.expectedSurplusKg === 0) return 'No surplus risk detected at this time.';
    return 'System has detected upcoming harvest volume exceeding regional demand.';
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              CROP DISTRESS & DEMAND RECOVERY ENGINE
            </h1>
            <p className="text-sm text-slate-600 mt-1">Predictive multi-factor analysis to prevent distress selling before harvest.</p>
          </div>
          
          <div className="flex gap-3">
            {demoState !== 'initial' && (
              <button onClick={handleReset} className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl text-sm flex items-center gap-2 hover:bg-slate-300">
                <RefreshCw className="w-4 h-4" /> Reset
              </button>
            )}
            {demoState === 'initial' && (
              <button onClick={handleStartDemo} className="px-5 py-2 bg-red-600 text-white font-bold rounded-xl text-sm flex items-center gap-2 hover:bg-red-700 shadow-md transition-all">
                <Play className="w-4 h-4" /> START CROP DISTRESS DEMO
              </button>
            )}
            {demoState === 'detected' && (
              <button onClick={handleSearchBuyers} disabled={alertData?.expectedSurplusKg === 0} className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-sm flex items-center gap-2 hover:bg-emerald-700 shadow-md disabled:opacity-50 transition-all">
                <ShoppingCart className="w-4 h-4" /> Run Demand Recovery
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Controls */}
        <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-6 rounded-3xl gradient-border-organic border-0 shadow-xs flex flex-col md:flex-row gap-8 items-center">
          <div className="flex items-center gap-2 text-slate-700 font-bold shrink-0">
            <Sliders className="w-5 h-5 text-indigo-600" /> Demo Variables:
          </div>
          
          <div className="flex-1 w-full space-y-2">
            <div className="flex justify-between text-sm font-bold">
              <span className="text-slate-600">Expected Supply</span>
              <span className="text-emerald-700">{inputSupply.toLocaleString()} kg</span>
            </div>
            <input 
              type="range" 
              min={2000} max={20000} step={500} 
              value={inputSupply} 
              onChange={e => setInputSupply(Number(e.target.value))} 
              className="w-full accent-emerald-600"
            />
          </div>

          <div className="flex-1 w-full space-y-2">
            <div className="flex justify-between text-sm font-bold">
              <span className="text-slate-600">Confirmed Demand</span>
              <span className="text-blue-700">{inputDemand.toLocaleString()} kg</span>
            </div>
            <input 
              type="range" 
              min={0} max={20000} step={500} 
              value={inputDemand} 
              onChange={e => setInputDemand(Number(e.target.value))} 
              className="w-full accent-blue-600"
            />
          </div>
        </div>

        {demoState === 'initial' && (
          <div className="bg-white gradient-border-organic border-0 p-12 rounded-3xl text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Ready to run scenario</h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Using the sliders above, you can simulate different market conditions. Currently set to {inputSupply.toLocaleString()} kg supply and {inputDemand.toLocaleString()} kg demand.
            </p>
          </div>
        )}

        {alertData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Top Alert Banner */}
            <div className={`p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-500 ${getAlertBannerColor()}`}>
              <div className="space-y-2">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getAlertBannerIconColor()}`}>
                  {demoState === 'matched' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  {getAlertBannerText()}
                </div>
                <h3 className={`text-xl font-black ${demoState === 'matched' ? (alertData.status === 'PARTIALLY_RECOVERED' ? 'text-orange-900' : 'text-emerald-900') : 'text-red-900'}`}>
                  {getAlertTitle()}
                </h3>
                <p className={`text-sm ${demoState === 'matched' ? (alertData.status === 'PARTIALLY_RECOVERED' ? 'text-orange-700' : 'text-emerald-700') : 'text-red-700'}`}>
                  {getAlertDescription()}
                </p>
              </div>

              <div className="flex gap-4 shrink-0">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center shadow-xs min-w-[120px]">
                  <div className="text-xs text-slate-500 font-bold mb-1">Expected Supply</div>
                  <div className="text-xl font-black text-slate-900">{alertData.expectedSupplyKg.toLocaleString()} kg</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center shadow-xs min-w-[120px]">
                  <div className="text-xs text-slate-500 font-bold mb-1">Remaining Surplus</div>
                  <div className={`text-xl font-black ${alertData.remainingSurplusKg === 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {alertData.remainingSurplusKg.toLocaleString()} kg
                  </div>
                </div>
              </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-5 rounded-2xl gradient-border-organic border-0">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <Box className="w-4 h-4" /> <span className="font-bold text-xs uppercase">Initial Surplus</span>
                </div>
                <div className="text-2xl font-black text-slate-900">{alertData.expectedSurplusKg.toLocaleString()} kg</div>
                <div className="text-xs font-bold text-red-500 mt-1">{alertData.surplusPercentage}% of expected supply</div>
              </div>

              <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-5 rounded-2xl gradient-border-organic border-0">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <Users className="w-4 h-4" /> <span className="font-bold text-xs uppercase">Farmers at Risk</span>
                </div>
                <div className="text-2xl font-black text-slate-900">{alertData.affectedFarmersCount}</div>
                <div className="text-xs font-bold text-slate-500 mt-1">Aggregated supply pool</div>
              </div>

              <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-5 rounded-2xl gradient-border-organic border-0">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <ShoppingCart className="w-4 h-4" /> <span className="font-bold text-xs uppercase">Recovery Demand</span>
                </div>
                <div className="text-2xl font-black text-emerald-600">+{alertData.additionalDemandKg.toLocaleString()} kg</div>
                <div className="text-xs font-bold text-emerald-700 mt-1">From {alertData.matchedBuyersCount} alternative buyers</div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-white">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Activity className="w-4 h-4" /> <span className="font-bold text-xs uppercase">Status</span>
                </div>
                <div className="text-xl font-black text-white leading-tight">{alertData.status.replace(/_/g, ' ')}</div>
                <div className="text-xs font-bold text-emerald-400 mt-1">{alertData.recoveryPercentage}% Recovery Rate</div>
              </div>
            </div>

            {/* Dual Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column: Farmer View & Logistics */}
              <div className="space-y-6">
                
                <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-6 rounded-3xl gradient-border-organic border-0">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                    <Tractor className="w-4 h-4 text-emerald-600" /> Farmer Alert Notification
                  </h3>
                  
                  {alertData.expectedSurplusKg > 0 ? (
                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-3">
                      <div className="font-bold text-amber-900 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> SURPLUS RISK DETECTED
                      </div>
                      <div className="text-sm text-amber-800 space-y-1">
                        <p><strong>Your expected harvest:</strong> ~500 kg Tomatoes</p>
                        <p><strong>Regional context:</strong> Current confirmed demand coverage is limited.</p>
                        <p><strong>Estimated regional surplus:</strong> {alertData.expectedSurplusKg.toLocaleString()} kg</p>
                      </div>
                      <div className="bg-white/60 p-3 rounded-xl border border-amber-300 text-sm font-medium text-amber-900">
                        Don't wait until harvest. KisanDirect is currently searching for additional institutional buyers.
                      </div>
                      {demoState === 'matched' && alertData.additionalDemandKg > 0 && (
                        <div className="mt-3 bg-emerald-100 p-3 rounded-xl border border-emerald-300 text-emerald-900 font-bold text-sm flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0" /> Recovery match found! View new bulk order options to secure your sale.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-3">
                      <div className="font-bold text-emerald-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> DEMAND BALANCED
                      </div>
                      <div className="text-sm text-emerald-800">
                        Current confirmed demand meets or exceeds expected harvest. No distress risk at this time.
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-6 rounded-3xl gradient-border-organic border-0">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" /> Estimated Value Protection
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-100">
                      <span className="text-sm text-red-900 font-medium">Distress-sale estimate (Mandi):</span>
                      <span className="font-black text-red-700">₹14/kg</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <span className="text-sm text-emerald-900 font-medium">Protected buyer match price:</span>
                      <span className="font-black text-emerald-700">₹18/kg</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl gradient-border-organic border-0">
                      <span className="text-sm text-slate-700 font-bold">Protected total value ({alertData.additionalDemandKg.toLocaleString()} kg):</span>
                      <span className="font-black text-slate-900">+₹{(4 * alertData.additionalDemandKg).toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 text-center">*Indicative prices based on real-time matched buyer budgets vs distress wholesale trends.</p>
                  </div>
                </div>

              </div>

              {/* Right Column: Buyer Matching & Recovery */}
              <div className="space-y-6">
                
                <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-6 rounded-3xl gradient-border-organic border-0">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Search className="w-4 h-4 text-indigo-600" /> Demand Recovery Engine
                    </h3>
                    {demoState === 'searching' && <span className="text-xs font-bold text-indigo-600 animate-pulse">Searching...</span>}
                  </div>
                  
                  {demoState === 'detected' && alertData.expectedSurplusKg > 0 && (
                    <div className="text-center py-10 text-slate-500 text-sm">
                      Engine idle. Ready to scan buyer database for {alertData.expectedSurplusKg.toLocaleString()} kg of Tomatoes.
                    </div>
                  )}

                  {demoState === 'detected' && alertData.expectedSurplusKg === 0 && (
                    <div className="text-center py-10 text-slate-500 text-sm">
                      No surplus to recover.
                    </div>
                  )}

                  {demoState === 'searching' && (
                    <div className="text-center py-10 text-slate-500 text-sm flex flex-col items-center">
                      <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mb-4" />
                      Scanning restaurants, processors, and retailers...
                    </div>
                  )}

                  {demoState === 'matched' && (
                    <div className="space-y-3">
                      <div className="text-xs font-bold text-slate-500 uppercase">Alternative Buyers Allocated</div>
                      
                      {alertData.matchedBuyers.length > 0 ? (
                         alertData.matchedBuyers.map((buyer, idx) => (
                          <div key={buyer.id || idx} className="p-4 bg-slate-50 rounded-xl gradient-border-organic border-0 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center">
                                {buyer.buyerType === 'Food Processor' ? <Factory className="w-4 h-4" /> : 
                                 buyer.buyerType.includes('Supermarket') ? <Store className="w-4 h-4" /> : 
                                 <Building2 className="w-4 h-4" />}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900">{buyer.buyerType}</div>
                                <div className="text-xs text-slate-500">{buyer.buyerName}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-black text-emerald-700">{buyer.quantityRequiredKg.toLocaleString()} kg</div>
                              <div className="text-[10px] text-slate-400">Match score generated</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-slate-500 text-sm gradient-border-organic border-0 rounded-xl border-dashed">
                          No suitable buyers found to match the criteria.
                        </div>
                      )}

                    </div>
                  )}
                </div>

                {demoState === 'matched' && alertData.additionalDemandKg > 0 && (
                  <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 text-white animate-in fade-in zoom-in-95 duration-500 delay-150">
                    <h3 className="text-sm font-bold text-white border-b border-slate-700 pb-3 mb-4 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-400" /> Group Supply Opportunity & Logistics
                    </h3>
                    <div className="space-y-4 text-sm">
                      <p className="text-slate-300">
                        <strong className="text-white">Aggregated Supply:</strong> {alertData.affectedFarmersCount} farmers ({alertData.expectedSupplyKg.toLocaleString()} kg Tomatoes)
                      </p>
                      <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex justify-between items-center">
                        <span className="text-slate-300 font-medium">Est. Regional Aggregation & Transport:</span>
                        <span className="font-black text-emerald-400">₹1.80/kg</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Route optimized for {alertData.matchedBuyersCount} drops to alternative buyers, combining {alertData.affectedFarmersCount} small farmgate pickups.</p>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
