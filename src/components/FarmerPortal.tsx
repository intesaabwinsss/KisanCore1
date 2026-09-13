import React, { useState, useRef } from 'react';
import { 
  Tractor, BrainCircuit, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  Plus, 
  TrendingUp, 
  Coins, 
  QrCode, 
  ShieldCheck, 
  AlertCircle, 
  Loader2,
  Calendar,
  MapPin,
  Scale,
  ThermometerSnowflake,
  ExternalLink,
  Camera,
  RefreshCw,
  FileImage,
  X,
  ScanLine,
  TrendingDown,
  AlertTriangle,
  ShoppingBag,
  CreditCard,
  Building2,
  Calculator,
  UserCheck,
  Smartphone,
  Eye
} from 'lucide-react';
import { ProduceListing, QualityGradeResult, Language, FarmerProfile, FarmerOrder, FarmerPaymentTransaction } from '../types';
import { MOCK_PRODUCE_LISTINGS } from '../data/mockData';
import { INITIAL_FARMER_PROFILE, INITIAL_FARMER_ORDERS, INITIAL_FARMER_PAYMENTS } from '../data/farmerData';
import { FarmerPriceTrendsChart } from './FarmerPriceTrendsChart';
import { LiveMandiSearchHub } from './LiveMandiSearchHub';
import { FarmerProfileModal } from './FarmerProfileModal';
import { FarmerAddCropModal } from './FarmerAddCropModal';
import { AIPricePredictor } from "./AIPricePredictor";
import { FarmerOrdersTab } from './FarmerOrdersTab';
import { FarmerPaymentsTab } from './FarmerPaymentsTab';
import { FarmerTraditionalComparison } from './FarmerTraditionalComparison';
import { FarmerSmartMatchesView } from './FarmerSmartMatchesView';
import { FarmerDashboardOverview } from './FarmerDashboardOverview';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface FarmerPortalProps {
  
  onInspectTraceability: (produce: ProduceListing) => void;
  onInspectPriceBreakdown?: (produce: ProduceListing) => void;
  onOpenAdvisory?: () => void;
  onLogout?: () => void;
}

export type FarmerActiveTab = 'dashboard' | 'inventory' | 'smart_matches' | 'orders' | 'market_prices' | 'payments' | 'comparison' | 'price_predictor';

export const FarmerPortal: React.FC<FarmerPortalProps> = ({
  onInspectTraceability,
  onInspectPriceBreakdown,
  onLogout,
}) => {
  const { currentUser, updateWallet } = useAuth();
  const { language, t, tCrop, tUnit, tLocation } = useLanguage();
  // Navigation
  const [activeTab, setActiveTab] = useState<FarmerActiveTab>('dashboard');

  // Farmer State
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile>(INITIAL_FARMER_PROFILE);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNewRegistration, setIsNewRegistration] = useState(false);

  // Produce Inventory State
  const [listings, setListings] = useState<ProduceListing[]>(MOCK_PRODUCE_LISTINGS);
  const [isAddCropModalOpen, setIsAddCropModalOpen] = useState(false);
  const [prefilledCrop, setPrefilledCrop] = useState<string>('Tomato');
  const [prefilledVariety, setPrefilledVariety] = useState<string>('Hybrid Roma F1');
  const [prefilledPrice, setPrefilledPrice] = useState<number>(34);

  // Orders State
  const [orders, setOrders] = useState<FarmerOrder[]>(INITIAL_FARMER_ORDERS);

  // Payments State
  const [transactions, setTransactions] = useState<FarmerPaymentTransaction[]>(INITIAL_FARMER_PAYMENTS);
  const [withdrawalNotice, setWithdrawalNotice] = useState<string | null>(null);

  // AI Quality Grading Scanner State
  const [selectedCrop, setSelectedCrop] = useState('Onion');
  const [selectedVariety, setSelectedVariety] = useState('Nashik Garwa Red');
  const [sampleImage, setSampleImage] = useState('https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80');
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const [gradingResult, setGradingResult] = useState<QualityGradeResult | null>({
    grade: 'A+',
    score: 96,
    freshnessScore: 97,
    blemishRate: 2.1,
    colorUniformity: 98,
    shelfLifeDays: 45,
    recommendedPricePerKg: 42,
    mandiBenchmarkPrice: 36,
    premiumPercentage: 17,
    defectSummary: 'Extremely firm bulb, intact double-skin parchment, zero neck softening or sprouting.',
    inspectorNotes: 'Meets AGMARK Grade Extra-Special specification. Suitable for containerized export.',
    suitableForExport: true,
    coldChainRequired: true,
  });

  const sampleCropPresets = [
    { crop: 'Onion', variety: 'Nashik Garwa Red', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80' },
    { crop: 'Tomato', variety: 'Hybrid Roma F1', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
    { crop: 'Potato', variety: 'Kufri Jyoti Chip-Grade', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80' },
    { crop: 'Capsicum', variety: 'Indra F1 Blocky', image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80' },
    { crop: 'Garlic', variety: 'Ooty Giant Clove', image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=600&q=80' },
    { crop: 'Orange', variety: 'Nagpur Mandarin F1', image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80' },
    { crop: 'Basmati Rice', variety: 'Pusa 1121 Paddy', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
    { crop: 'Tur Dal', variety: 'Gulbarga Maruti Gulyal', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
    { crop: 'Apple', variety: 'Shimla Royal Delicious', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80' },
  ];

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPEG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setUploadedBase64(base64);
      setSampleImage(base64);
      setUploadedFileName(file.name);
      inspectProduce(base64, selectedCrop, selectedVariety);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const inspectProduce = async (imgBase64: string, crop: string, variety: string) => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/gemini/quality-grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: crop,
          variety: variety,
          imageBase64: imgBase64,
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        setGradingResult(data.analysis);
        if (data.analysis.detectedCrop) {
          setSelectedCrop(data.analysis.detectedCrop);
        }
        if (data.analysis.detectedVariety) {
          setSelectedVariety(data.analysis.detectedVariety);
        }
      }
    } catch (err) {
      console.error('Error grading produce:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleRunAiInspection = () => {
    inspectProduce(uploadedBase64 || sampleImage, selectedCrop, selectedVariety);
  };

  const handleClearUpload = () => {
    setUploadedBase64(null);
    setUploadedFileName(null);
    const defaultPreset = sampleCropPresets[0];
    setSelectedCrop(defaultPreset.crop);
    setSelectedVariety(defaultPreset.variety);
    setSampleImage(defaultPreset.image);
  };

  const handleSelectCropForListing = (cropName: string, variety: string, recommendedPrice: number) => {
    setPrefilledCrop(cropName);
    setPrefilledVariety(variety);
    setPrefilledPrice(recommendedPrice);
    setIsAddCropModalOpen(true);
  };

  const handleAddNewListing = (newLot: ProduceListing) => {
    setListings([newLot, ...listings]);
    setActiveTab('inventory');
  };

  const handleUpdateOrderStatus = (
    orderId: string, 
    newStatus: FarmerOrder['status'], 
    escrowStatus?: FarmerOrder['escrowStatus']
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedEscrow = escrowStatus || ord.escrowStatus;
          return {
            ...ord,
            status: newStatus,
            escrowStatus: updatedEscrow,
          };
        }
        return ord;
      })
    );

    // If marked delivered, create a settled payment transaction
    if (newStatus === 'delivered') {
      const targetOrder = orders.find(o => o.id === orderId);
      if (targetOrder) {
        const newTx: FarmerPaymentTransaction = {
          id: `tx-${Date.now()}`,
          transactionRef: `TXN-UPI-${Date.now().toString().slice(-8)}`,
          orderNumber: targetOrder.orderNumber,
          cropLot: `${targetOrder.cropName} (${targetOrder.quantityKg} kg)`,
          buyerName: targetOrder.buyerCompany,
          grossAmount: targetOrder.totalAmount,
          commissionDeducted: 0,
          traditionalCommissionLost: targetOrder.commissionSaved,
          netPayoutAmount: targetOrder.totalAmount,
          payoutMethod: 'Instant UPI',
          status: 'settled',
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          utrNumber: `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}/MAHB`,
        };
        setTransactions([newTx, ...transactions]);
      }
    }
  };

  const handleInstantWithdraw = () => {
    const utr = `UPI-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    setWithdrawalNotice(
      language === 'hi'
        ? `₹1,42,800 तुरंत ${farmerProfile.bankAccount.bankName} खाते में (अंतिम 4 अंक ${farmerProfile.bankAccount.accountNumber.slice(-4)}) UPI ID: ${farmerProfile.bankAccount.upiId} द्वारा जमा किए गए (बैंक UTR: ${utr})`
        : language === 'mr'
        ? `₹1,42,800 त्वरित ${farmerProfile.bankAccount.bankName} खात्यात (शेवटचे 4 अंक ${farmerProfile.bankAccount.accountNumber.slice(-4)}) UPI ID: ${farmerProfile.bankAccount.upiId} द्वारे जमा केले (बँक UTR: ${utr})`
        : `₹1,42,800 credited instantly to ${farmerProfile.bankAccount.bankName} A/C ending in ${farmerProfile.bankAccount.accountNumber.slice(-4)} via UPI ID: ${farmerProfile.bankAccount.upiId} (Bank UTR: ${utr})`
    );
    setTimeout(() => {
      setWithdrawalNotice(null);
    }, 7000);
  };

  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Farmer Identity & Quick Controls */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-700/80 border border-emerald-500/40 flex items-center justify-center text-white shrink-0 shadow-inner">
            <Tractor className="w-8 h-8 text-emerald-200" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-display font-extrabold text-white">
                {currentUser?.name || farmerProfile.fullName}
              </h1>
              {currentUser?.isVerified ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {language === 'hi' ? 'सत्यापित किसान' : language === 'mr' ? 'सत्यापित शेतकरी' : 'Verified Kisan'}
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-500/20 text-slate-300 text-[11px] font-bold border border-slate-500/30 flex items-center gap-1">
                  {language === 'hi' ? 'सत्यापन लंबित' : language === 'mr' ? 'पडताळणी प्रलंबित' : 'Pending Verification'}
                </span>
              )}

              <button
                onClick={() => {
                  setIsNewRegistration(false);
                  setIsProfileModalOpen(true);
                }}
                className="px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-emerald-200 text-[10px] font-bold transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'प्रोफ़ाइल व बैंक विवरण संपादित करें' : language === 'mr' ? 'प्रोफाइल व बँक तपशील संपादित करा' : 'Edit Profile & Bank Details'}
              </button>
            </div>
            <p className="text-xs text-emerald-200/80 mt-1 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {currentUser?.location ? tLocation(currentUser.location) : tLocation(farmerProfile.village)}, {currentUser?.district ? tLocation(currentUser.district) : tLocation(farmerProfile.district)}, {currentUser?.state || farmerProfile.state}
              </span>
              <span>•</span>
              <span>{farmerProfile.landHoldingAcres} {language === 'hi' ? 'एकड़ खेत' : language === 'mr' ? 'एकर शेत' : 'Acres Farm'}</span>
              <span>•</span>
              <span className="text-emerald-300 font-mono font-bold">UPI: {currentUser?.mobile ? `${currentUser.mobile}@ybl` : farmerProfile.bankAccount.upiId}</span>
            </p>
          </div>
        </div>

        {/* Financial Escrow Snapshot & Action */}
        <div className="flex flex-wrap items-center gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
          <div>
            <div className="text-[10px] text-emerald-300 uppercase font-semibold">
              {language === 'hi' ? 'तत्काल भुगतान हेतु उपलब्ध' : language === 'mr' ? 'त्वरित वितरणासाठी उपलब्ध' : 'Available for Instant Payout'}
            </div>
            <div className="text-xl font-extrabold text-white">
              ₹{currentUser?.walletBalance !== undefined ? currentUser.walletBalance.toLocaleString('en-IN') : '1,42,800'}
            </div>
          </div>
          <button
            onClick={handleInstantWithdraw}
            className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Coins className="w-4 h-4 text-slate-950" />
            <span>{language === 'hi' ? 'तत्काल UPI भुगतान' : language === 'mr' ? 'त्वरित UPI वितरण' : 'Instant UPI Payout'}</span>
          </button>
        </div>
      </div>

      {/* Global Withdrawal Notice */}
      {withdrawalNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{withdrawalNotice}</span>
        </div>
      )}

      {/* Primary Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            id="tab-farmer-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Tractor className="w-4 h-4" />
            <span>{language === 'hi' ? 'डैशबोर्ड' : language === 'mr' ? 'डॅशबोर्ड' : 'Dashboard'}</span>
          </button>

          <button
            id="tab-farmer-inventory"
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>{language === 'hi' ? 'मेरे उत्पाद व AI ग्रेडिंग' : language === 'mr' ? 'माझी उत्पादने व AI ग्रेडिंग' : 'My Products & AI Grading'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">
              {listings.length}
            </span>
          </button>

          <button
            id="tab-farmer-orders"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{language === 'hi' ? 'ऑर्डर' : language === 'mr' ? 'ऑर्डर्स' : 'Orders'}</span>
            {pendingOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-amber-950 text-[10px] font-extrabold animate-pulse">
                {pendingOrdersCount} {language === 'hi' ? 'नए' : language === 'mr' ? 'नवीन' : 'New'}
              </span>
            )}
          </button>

          <button
            id="tab-farmer-smart-matches"
            onClick={() => setActiveTab('smart_matches')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'smart_matches'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>{language === 'hi' ? 'स्मार्ट मिलान 🤖' : language === 'mr' ? 'स्मार्ट जुळण्या 🤖' : 'Smart Matches 🤖'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
              {language === 'hi' ? 'AI युग्मित' : language === 'mr' ? 'AI जोडलेले' : 'AI Paired'}
            </span>
          </button>

          <button
            id="tab-farmer-comparison"
            onClick={() => setActiveTab('comparison')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'comparison'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>{language === 'hi' ? 'कमाई' : language === 'mr' ? 'कमाई' : 'Earnings'}</span>
          </button>

          <button
            id="tab-farmer-payments"
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{language === 'hi' ? 'लेन-देन व बहीखाता' : language === 'mr' ? 'व्यवहार व खातेवही' : 'Transactions & Ledger'}</span>
          </button>

          <button
            id="tab-farmer-market-prices"
            onClick={() => setActiveTab('market_prices')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'market_prices'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{language === 'hi' ? 'बाज़ार भाव' : language === 'mr' ? 'बाजार भाव' : 'Market Prices'}</span>
          </button>

          <button
            id="tab-farmer-price-predictor"
            onClick={() => setActiveTab('price_predictor')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'price_predictor'
                ? 'bg-amber-500 text-amber-950 shadow-sm'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>{language === 'hi' ? 'AI मूल्य भविष्यवक्ता' : language === 'mr' ? 'AI किंमत अंदाज' : 'AI Price Predictor'}</span>
            <span className="bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">
              {language === 'hi' ? 'नया' : language === 'mr' ? 'नवीन' : 'New'}
            </span>
          </button>

        </div>

        {/* Global Action: Add New Harvest Lot */}
        <button
          onClick={() => {
            setPrefilledCrop('Tomato');
            setPrefilledVariety('Hybrid Roma F1');
            setPrefilledPrice(34);
            setIsAddCropModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'hi' ? 'फसल / उत्पाद जोड़ें' : language === 'mr' ? 'पीक / उत्पादन जोडा' : 'Add Crop / Product'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 0: MASTER DASHBOARD OVERVIEW (KISANDIRECT) */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <FarmerDashboardOverview
          onNavigateTab={(t) => setActiveTab(t as any)}
          onOpenProfile={() => {
            setIsNewRegistration(false);
            setIsProfileModalOpen(true);
          }}
          onLogout={onLogout}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 1: INVENTORY & AI QUALITY INSPECTION */}
      {/* ========================================================================= */}
      {activeTab === 'inventory' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Main Grid: AI Quality Scanner & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: AI Produce Quality Inspector (7 cols) */}
            <div className="lg:col-span-7 bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-6 sm:p-7 shadow-2xs space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {language === 'hi' ? 'AI उत्पाद गुणवत्ता ग्रेडिंग स्कैनर' : language === 'mr' ? 'AI उत्पादन गुणवत्ता ग्रेडिंग स्कॅनर' : 'AI Produce Quality Grading Scanner'}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {language === 'hi' ? 'एगमार्क ग्रेड, दाग दर और उचित मूल्य हेतु कंप्यूटर विज़न निरीक्षण' : language === 'mr' ? 'एगमार्क ग्रेड, डाग प्रमाण आणि वाजवी भावासाठी संगणक दृष्टी तपासणी' : 'Computer vision inspection for AGMARK Grade, blemish rate, and fair price'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {language === 'hi' ? 'एगमार्क न्यूरल मॉडल' : language === 'mr' ? 'एगमार्क न्यूरल मॉडेल' : 'AGMARK Neural Model'}
                </span>
              </div>

              {/* Preset Sample Crop Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  {language === 'hi' ? 'नमूना फसल चुनें या कैमरे से फ़ोटो अपलोड करें:' : language === 'mr' ? 'नमुना पीक निवडा किंवा कॅमेऱ्यातून फोटो अपलोड करा:' : 'Select Sample Harvest or Upload Camera Photo:'}
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {sampleCropPresets.map((preset) => (
                    <button
                      key={preset.crop}
                      onClick={() => {
                        setSelectedCrop(preset.crop);
                        setSelectedVariety(preset.variety);
                        setSampleImage(preset.image);
                        setUploadedBase64(null);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                        selectedCrop === preset.crop && !uploadedBase64
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {tCrop(preset.crop)} ({preset.variety})
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Preview & Custom Upload Trigger */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
                {/* Produce Image with Scanner Laser Effect */}
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-900 gradient-border-organic border-0 shadow-inner flex flex-col justify-end">
                  <img
                    src={sampleImage}
                    alt="Selected Produce"
                    className="w-full h-full object-cover absolute inset-0"
                  />

                  {/* Scanning Laser Animation */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-emerald-950/30 z-10 flex flex-col justify-between p-4 overflow-hidden pointer-events-none">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:16px_16px]" />
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-[bounce_2s_infinite]" />

                      <div className="relative z-20 flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md bg-black/70 text-emerald-400 text-[10px] font-mono font-bold tracking-wider flex items-center gap-1.5 border border-emerald-500/30">
                          <ScanLine className="w-3 h-3 animate-pulse" />
                          AGMARK OPTICAL SCAN
                        </span>
                        <span className="text-[10px] font-mono text-emerald-300">512×512 TENSOR</span>
                      </div>

                      <div className="relative z-20 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 text-white text-xs font-semibold backdrop-blur-xs border border-emerald-500/40">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                          <span>{language === 'hi' ? 'छिलके की एकरूपता और दाग की पहचान कर रहे हैं...' : language === 'mr' ? 'सालाची एकसमानता आणि डाग शोधत आहे...' : 'Detecting Skin Uniformity & Blemishes...'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Produce Label Overlay */}
                  <div className="relative z-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-between">
                    <div className="text-white text-xs">
                      <div className="font-bold flex items-center gap-1.5">
                        <span>{tCrop(selectedCrop)} - {selectedVariety}</span>
                        {uploadedFileName && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/80 text-white text-[9px] font-semibold">
                            {language === 'hi' ? 'कस्टम फ़ोटो' : language === 'mr' ? 'कस्टम फोटो' : 'Custom Photo'}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-300">
                        {uploadedFileName ? uploadedFileName : (language === 'hi' ? 'एगमार्क न्यूरल निरीक्षण के लिए तैयार' : language === 'mr' ? 'एगमार्क न्यूरल तपासणीसाठी तयार' : 'Ready for AGMARK neural inspection')}
                      </div>
                    </div>

                    {uploadedBase64 && (
                      <button
                        onClick={handleClearUpload}
                        title={language === 'hi' ? 'नमूना फ़ोटो पर रीसेट करें' : language === 'mr' ? 'नमुना फोटोवर रीसेट करा' : 'Reset to sample photo'}
                        className="p-1.5 rounded-lg bg-black/60 hover:bg-red-600/80 text-white transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Drag & Drop Upload Zone + Camera Actions */}
                <div className="flex flex-col justify-between space-y-3">
                  <div
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all text-center flex-1 ${
                      isDragging
                        ? 'border-emerald-500 bg-emerald-100/70 scale-[1.01] ring-4 ring-emerald-200'
                        : uploadedFileName
                        ? 'border-emerald-400 bg-emerald-50/50'
                        : 'border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/40'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 shadow-xs">
                      {uploadedFileName ? (
                        <FileImage className="w-5 h-5 text-emerald-700" />
                      ) : (
                        <Upload className="w-5 h-5 text-emerald-700" />
                      )}
                    </div>

                    <span className="text-xs font-bold text-slate-900">
                      {uploadedFileName 
                        ? (language === 'hi' ? 'खेत का फ़ोटो बदलें' : language === 'mr' ? 'शेताचा फोटो बदला' : 'Change Farm Photo')
                        : (language === 'hi' ? 'फसल का फ़ोटो अपलोड करें' : language === 'mr' ? 'पिकाचा फोटो अपलोड करा' : 'Upload Harvest Photo')}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      {language === 'hi' ? 'कैमरा व फ़ाइल अपलोड समर्थित (30MB तक)' : language === 'mr' ? 'कॅमेरा व फाईल अपलोड समर्थित (30MB पर्यंत)' : 'Supports Camera & File Uploads (up to 30MB)'}
                    </span>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        cameraInputRef.current?.click();
                      }}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-slate-600" />
                      <span>{language === 'hi' ? 'कैमरा फ़ोटो' : language === 'mr' ? 'कॅमेरा फोटो' : 'Camera Snap'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-slate-600" />
                      <span>{language === 'hi' ? 'फ़ाइलें चुनें' : language === 'mr' ? 'फायली निवडा' : 'Browse Files'}</span>
                    </button>
                  </div>

                  <button
                    onClick={handleRunAiInspection}
                    disabled={isScanning}
                    className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold text-xs shadow-md shadow-emerald-700/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>{language === 'hi' ? 'जेमिनी विज़न द्वारा उत्पाद ग्रेडिंग जारी...' : language === 'mr' ? 'जेमिनी व्हिजनद्वारे उत्पादनाची प्रतवारी चालू आहे...' : 'Grading Produce with Gemini Vision...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>
                          {uploadedFileName 
                            ? (language === 'hi' ? 'अपलोड की गई फ़ोटो पर AI परख चलाएं' : language === 'mr' ? 'अपलोड केलेल्या फोटोवर AI तपासणी चालवा' : 'Run AI Assay on Uploaded Photo')
                            : (language === 'hi' ? 'AI गुणवत्ता निरीक्षण चलाएं' : language === 'mr' ? 'AI गुणवत्ता तपासणी चालवा' : 'Run AI Quality Inspection')}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* AI Inspection Results Card */}
              {gradingResult && (
                <div className={`p-5 rounded-2xl border space-y-4 transition-all ${
                  gradingResult.grade === 'A+' || gradingResult.grade === 'A'
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : gradingResult.grade === 'B'
                    ? 'bg-amber-50/40 border-amber-200'
                    : 'bg-rose-50/50 border-rose-200'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 border-slate-200">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-2xl font-display font-extrabold ${
                        gradingResult.grade === 'A+' || gradingResult.grade === 'A'
                          ? 'text-emerald-800'
                          : gradingResult.grade === 'B'
                          ? 'text-amber-800'
                          : 'text-rose-800'
                      }`}>
                        {language === 'hi' ? `ग्रेड ${gradingResult.grade}` : language === 'mr' ? `श्रेणी ${gradingResult.grade}` : `Grade ${gradingResult.grade}`}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        ({language === 'hi' ? 'गुणवत्ता स्कोर' : language === 'mr' ? 'गुणवत्ता स्कोअर' : 'Quality Score'}: {gradingResult.score}/100)
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {gradingResult.suitableForExport ? (
                        <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                          {language === 'hi' ? 'निर्यात प्रमाणित' : language === 'mr' ? 'निर्यात प्रमाणित' : 'Export Certified'}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          {language === 'hi' ? 'घरेलू थोक' : language === 'mr' ? 'घरगुती घाऊक' : 'Domestic Wholesale'}
                        </span>
                      )}
                      {gradingResult.coldChainRequired && (
                        <span className="px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-bold flex items-center gap-1">
                          <ThermometerSnowflake className="w-3 h-3 text-cyan-600" />
                          {language === 'hi' ? 'कोल्ड चेन आवश्यक' : language === 'mr' ? 'कोल्ड चेन आवश्यक' : 'Cold Chain Required'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-2.5 rounded-xl bg-white gradient-border-organic border-0">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">{language === 'hi' ? 'ताज़गी' : language === 'mr' ? 'ताजेपणा' : 'Freshness'}</div>
                      <div className="text-base font-bold text-emerald-700">{gradingResult.freshnessScore}%</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white gradient-border-organic border-0">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">{language === 'hi' ? 'दाग दर' : language === 'mr' ? 'डागांचे प्रमाण' : 'Blemish Rate'}</div>
                      <div className="text-base font-bold text-emerald-700">{gradingResult.blemishRate}%</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white gradient-border-organic border-0">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">{language === 'hi' ? 'शेल्फ लाइफ' : language === 'mr' ? 'टिकण्याची क्षमता' : 'Shelf Life'}</div>
                      <div className="text-base font-bold text-blue-700">{gradingResult.shelfLifeDays} {language === 'hi' ? 'दिन' : language === 'mr' ? 'दिवस' : 'Days'}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white gradient-border-organic border-0">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">{language === 'hi' ? 'रंग एकरूपता' : language === 'mr' ? 'रंग एकसमानता' : 'Color Uniform'}</div>
                      <div className="text-base font-bold text-slate-700">{gradingResult.colorUniformity}%</div>
                    </div>
                  </div>

                  {/* Price Realization Analysis */}
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {language === 'hi' ? 'अनुशंसित किसान डायरेक्ट सीधा मूल्य:' : language === 'mr' ? 'शिफारस केलेली किसान डायरेक्ट थेट किंमत:' : 'Recommended KisanMandi Direct Price:'}
                      </div>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-2xl font-extrabold text-emerald-800">
                          ₹{gradingResult.recommendedPricePerKg}/{tUnit('kg')}
                        </span>
                        <span className="text-xs text-slate-500">
                          {language === 'hi' ? `बनाम स्थानीय मंडी ₹${gradingResult.mandiBenchmarkPrice}/${tUnit('kg')}` : language === 'mr' ? `विरुद्ध स्थानिक बाजार ₹${gradingResult.mandiBenchmarkPrice}/${tUnit('kg')}` : `vs Local Mandi ₹${gradingResult.mandiBenchmarkPrice}/kg`}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-600 text-white">
                        <TrendingUp className="w-3.5 h-3.5" />
                        +{gradingResult.premiumPercentage}% {language === 'hi' ? 'अतिरिक्त लाभ' : language === 'mr' ? 'प्रीमियम' : 'Premium'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Listing Trigger from AI Assay */}
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleSelectCropForListing(selectedCrop, selectedVariety, gradingResult.recommendedPricePerKg)}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? `यह लॉट सीधे ₹${gradingResult.recommendedPricePerKg}/${tUnit('kg')} पर सूचीबद्ध करें` : language === 'mr' ? `हा लॉट थेट ₹${gradingResult.recommendedPricePerKg}/${tUnit('kg')} वर सूचीबद्ध करा` : `List This Lot Directly at ₹${gradingResult.recommendedPricePerKg}/kg`}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Earnings & Produce Listing Action (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Quick Summary Card */}
              <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    {language === 'hi' ? 'फसल लॉट प्रबंधन' : language === 'mr' ? 'पीक लॉट व्यवस्थापन' : 'Harvest Lot Management'}
                  </h3>
                  <button
                    onClick={() => {
                      setPrefilledCrop('Tomato');
                      setPrefilledVariety('Hybrid Roma F1');
                      setPrefilledPrice(34);
                      setIsAddCropModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{language === 'hi' ? 'नया लॉट सूचीबद्ध करें' : language === 'mr' ? 'नवीन लॉट सूचीबद्ध करा' : 'List New Lot'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {language === 'hi' ? '0% मध्यस्थ कटौती के साथ 1,840+ सत्यापित B2B खरीदारों और सुपरमार्केट को निरीक्षण किए गए लॉट प्रकाशित करें।' : language === 'mr' ? '0% मध्यस्थ कपातीसह 1,840+ सत्यापित B2B खरेदीदार आणि सुपरमार्केटना तपासलेले लॉट प्रकाशित करा.' : 'Publish inspected lots to 1,840+ verified B2B buyers and supermarkets with 0% intermediary deductions.'}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-50 gradient-border-organic border-0">
                    <div className="text-[11px] text-slate-500 font-medium">{language === 'hi' ? 'सक्रिय लॉट सूचीबद्ध' : language === 'mr' ? 'सक्रिय लॉट्स सूचीबद्ध' : 'Active Lots Listed'}</div>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5">{listings.length} {language === 'hi' ? 'लॉट' : language === 'mr' ? 'लॉट्स' : 'Lots'}</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <div className="text-[11px] text-emerald-800 font-medium">{language === 'hi' ? 'कुल मात्रा' : language === 'mr' ? 'एकूण प्रमाण' : 'Total Quantity'}</div>
                    <div className="text-xl font-extrabold text-emerald-900 mt-0.5">
                      {(listings.reduce((acc, l) => acc + l.quantityKg, 0) / 1000).toFixed(1)} {language === 'hi' ? 'मीट्रिक टन' : language === 'mr' ? 'मेट्रिक टन' : 'MT'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mandi vs KisanMandi Price Advantage Card */}
              <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-6 shadow-2xs space-y-3">
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'hi' ? 'बिचौलियों की लागत का उन्मूलन' : language === 'mr' ? 'मध्यस्थ खर्चाचे उच्चाटन' : 'Middleman Cost Elimination'}
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2.5 rounded-xl bg-rose-50 text-rose-900 font-medium">
                    <span>{language === 'hi' ? 'पारंपरिक APMC बिचौलियों की कटौती:' : language === 'mr' ? 'पारंपारिक APMC मध्यस्थांची कपात:' : 'Traditional APMC Middlemen Cut:'}</span>
                    <span className="font-bold">{language === 'hi' ? '6% - 12% नुकसान' : language === 'mr' ? '6% - 12% तोटा' : '6% - 12% Loss'}</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-emerald-50 text-emerald-900 font-bold">
                    <span>{language === 'hi' ? 'किसान डायरेक्ट कमीशन:' : language === 'mr' ? 'किसान डायरेक्ट कमिशन:' : 'KisanMandi Commission:'}</span>
                    <span className="text-emerald-700">{language === 'hi' ? '0% (पूरी तरह मुफ़्त)' : language === 'mr' ? '0% (पूर्णपणे मोफत)' : '0% (Completely Free)'}</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-blue-50 text-blue-900 font-medium">
                    <span>{language === 'hi' ? 'भुगतान निपटान:' : language === 'mr' ? 'देयक पूर्तता:' : 'Payment Settlement:'}</span>
                    <span className="font-bold">{language === 'hi' ? 'रवानगी पर तत्काल एस्क्रो' : language === 'mr' ? 'रवाना होताच त्वरित एस्क्रो' : 'Instant Escrow on Dispatch'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Produce Inventory Table */}
          <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-6 sm:p-8 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {language === 'hi' ? `आपकी सक्रिय उपज सूची (${listings.length} लॉट)` : language === 'mr' ? `तुमची सक्रिय कृषी उत्पादन यादी (${listings.length} लॉट्स)` : `Your Active Produce Inventory (${listings.length} Lots)`}
                </h2>
                <p className="text-xs text-slate-500">
                  {language === 'hi' ? 'इन्वेंट्री प्रबंधित करें, न्यूनतम मूल्य आरक्षित करें और फार्म ट्रेसिबिलिटी पासपोर्ट का निरीक्षण करें' : language === 'mr' ? 'साठा व्यवस्थापित करा, किमान भाव निश्चित करा आणि शेताचे ट्रेसिबिलिटी पासपोर्ट तपासा' : 'Manage inventory, reserve floor prices, and inspect farm traceability passports'}
                </p>
              </div>
              <button
                onClick={() => {
                  setPrefilledCrop('Tomato');
                  setPrefilledVariety('Hybrid Roma F1');
                  setPrefilledPrice(34);
                  setIsAddCropModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'hi' ? 'फसल लॉट जोड़ें' : language === 'mr' ? 'पीक लॉट जोडा' : 'Add Crop Lot'}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-3">{language === 'hi' ? 'लॉट व फसल' : language === 'mr' ? 'लॉट व पीक' : 'Lot & Crop'}</th>
                    <th className="py-3 px-3">{language === 'hi' ? 'ग्रेड' : language === 'mr' ? 'श्रेणी' : 'Grade'}</th>
                    <th className="py-3 px-3">{language === 'hi' ? 'उपलब्ध मात्रा' : language === 'mr' ? 'उपलब्ध प्रमाण' : 'Available Quantity'}</th>
                    <th className="py-3 px-3">{language === 'hi' ? 'आपकी कीमत' : language === 'mr' ? 'तुमचा भाव' : 'Your Price'}</th>
                    <th className="py-3 px-3">{language === 'hi' ? 'APMC मॉडल भाव' : language === 'mr' ? 'APMC सरासरी भाव' : 'APMC Modal'}</th>
                    <th className="py-3 px-3">{language === 'hi' ? 'कटाई तिथि' : language === 'mr' ? 'कापणी तारीख' : 'Harvest Date'}</th>
                    <th className="py-3 px-3">{language === 'hi' ? 'ट्रेसिबिलिटी' : language === 'mr' ? 'ट्रेसिबिलिटी' : 'Traceability'}</th>
                    <th className="py-3 px-3 text-right">{language === 'hi' ? 'कार्रवाई' : language === 'mr' ? 'कृती' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {listings.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-10 h-10 rounded-xl object-cover gradient-border-organic border-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{tCrop(item.cropName)}</div>
                            <div className="text-[11px] text-slate-400">{item.variety} • {item.lotNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {language === 'hi' ? `ग्रेड ${item.grade}` : language === 'mr' ? `श्रेणी ${item.grade}` : `Grade ${item.grade}`}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-700">
                        {item.quantityKg.toLocaleString()} {tUnit('kg')}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-emerald-800">
                        ₹{item.pricePerKg}/{tUnit('kg')}
                      </td>
                      <td className="py-3.5 px-3 text-slate-400 line-through">
                        ₹{item.mandiBenchmarkPrice}/{tUnit('kg')}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 font-medium">
                        {item.harvestDate}
                      </td>
                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => onInspectTraceability(item)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{item.traceabilityHash}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onInspectPriceBreakdown?.(item)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1 transition-colors border border-emerald-200 cursor-pointer"
                            title={language === 'hi' ? 'बिचौलिया बनाम प्रत्यक्ष मूल्य विभाजन देखें' : language === 'mr' ? 'मध्यस्थ विरुद्ध थेट किंमत विभागणी पहा' : 'View Intermediary vs Direct Price Split'}
                          >
                            <Coins className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{language === 'hi' ? 'मूल्य विभाजन' : language === 'mr' ? 'किंमत विभागणी' : 'Price Split'}</span>
                          </button>
                          <button
                            onClick={() => onInspectTraceability(item)}
                            className="text-emerald-700 hover:underline font-bold text-xs cursor-pointer"
                          >
                            {language === 'hi' ? 'पासपोर्ट' : language === 'mr' ? 'पासपोर्ट' : 'Passport'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: INCOMING ORDERS & BIDS */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="animate-in fade-in">
          <FarmerOrdersTab
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: SMART MATCHES (ALGORITHMIC BUYER PAIRING) */}
      {/* ========================================================================= */}
      {activeTab === 'smart_matches' && (
        <div className="space-y-6 animate-in fade-in">
          <FarmerSmartMatchesView />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LIVE MANDI PRICES & MARKET INTELLIGENCE */}
      {/* ========================================================================= */}
      {activeTab === 'market_prices' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Recharts Dynamic Historical Price Trends Section */}
          <FarmerPriceTrendsChart onSelectCropForListing={handleSelectCropForListing} />

          {/* Live Google Search Grounded Mandi Intelligence */}
          <LiveMandiSearchHub />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TRACK PAYMENTS & ESCROW */}
      {/* ========================================================================= */}
      {activeTab === 'payments' && (
        <div className="animate-in fade-in">
          <FarmerPaymentsTab
            transactions={transactions}
            profile={farmerProfile}
            onInstantWithdraw={handleInstantWithdraw}
            withdrawalNotice={withdrawalNotice}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: TRADITIONAL VS DIRECT MANDI COMPARISON */}
      {/* ========================================================================= */}
      {activeTab === 'comparison' && (
        <div className="animate-in fade-in">
          <FarmerTraditionalComparison
            totalSavingsToDate={farmerProfile.traditionalCutSaved}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: AI COMMODITY PRICE & SUPPLY-DEMAND FORECASTING */}
      {/* ========================================================================= */}
      {activeTab === 'price_predictor' && (
        <div className="animate-in fade-in">
          <AIPricePredictor />
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}
      
      {/* Farmer Profile / Registration Modal */}
      <FarmerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={farmerProfile}
        onSaveProfile={(updated) => setFarmerProfile(updated)}
        isNewRegistration={isNewRegistration}
      />

      {/* Add Crop / Product Modal */}
      <FarmerAddCropModal
        isOpen={isAddCropModalOpen}
        onClose={() => setIsAddCropModalOpen(false)}
        onAddListing={handleAddNewListing}
        farmerName={currentUser?.name || farmerProfile.fullName}
        farmerPhone={currentUser?.mobile || farmerProfile.phone}
        farmLocation={currentUser?.location || farmerProfile.village}
        district={currentUser?.district || farmerProfile.district}
        state={currentUser?.state || farmerProfile.state}
        defaultCrop={prefilledCrop}
        defaultVariety={prefilledVariety}
        defaultPrice={prefilledPrice}
      />
    </div>
  );
};
