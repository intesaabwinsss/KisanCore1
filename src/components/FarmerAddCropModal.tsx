import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Camera, 
  Sparkles, 
  Calendar, 
  Scale, 
  Coins, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  FileImage, 
  ThermometerSnowflake, 
  ShieldCheck, 
  TrendingUp,
  Clock,
  Warehouse
} from 'lucide-react';
import { ProduceListing, QualityGradeResult, QualityGrade } from '../types';

interface FarmerAddCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (newListing: ProduceListing) => void;
  farmerName: string;
  farmerPhone: string;
  farmLocation: string;
  district: string;
  state: string;
  defaultCrop?: string;
  defaultVariety?: string;
  defaultPrice?: number;
}

export const FarmerAddCropModal: React.FC<FarmerAddCropModalProps> = ({
  isOpen,
  onClose,
  onAddListing,
  farmerName,
  farmerPhone,
  farmLocation,
  district,
  state,
  defaultCrop = 'Tomato',
  defaultVariety = 'Hybrid Roma F1',
  defaultPrice = 34,
}) => {
  const [cropName, setCropName] = useState(defaultCrop);
  const [variety, setVariety] = useState(defaultVariety);
  const [category, setCategory] = useState<'Vegetables' | 'Fruits' | 'Grains & Pulses' | 'Spices & Cash Crops'>('Vegetables');
  const [lotTitle, setLotTitle] = useState(`Farm Fresh Grade-A ${defaultVariety} ${defaultCrop}`);
  
  // Quantity and Units
  const [rawQuantity, setRawQuantity] = useState<number>(3000);
  const [quantityUnit, setQuantityUnit] = useState<'kg' | 'quintal' | 'metric_ton' | 'crates_25kg' | 'bags_50kg'>('kg');
  
  // Pricing
  const [minAcceptablePrice, setMinAcceptablePrice] = useState<number>(28); // Floor reserve price
  const [targetPrice, setTargetPrice] = useState<number>(defaultPrice); // Listing price
  const [mandiBenchmark, setMandiBenchmark] = useState<number>(28);

  // Dates & Storage
  const [harvestDate, setHarvestDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [storageType, setStorageType] = useState<'ventilated_shed' | 'cold_storage' | 'farmgate_ambient'>('ventilated_shed');
  const [shelfLifeDays, setShelfLifeDays] = useState<number>(14);
  const [isOrganic, setIsOrganic] = useState<boolean>(true);
  const [chemicalFree, setChemicalFree] = useState<boolean>(true);
  const [moisturePct, setMoisturePct] = useState<number>(12.5);

  // Photos & AI Assay
  const [uploadedImage, setUploadedImage] = useState<string>('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [aiAssayResult, setAiAssayResult] = useState<QualityGradeResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Convert raw quantity to standard kg
  const getCalculatedKg = () => {
    switch (quantityUnit) {
      case 'quintal': return rawQuantity * 100;
      case 'metric_ton': return rawQuantity * 1000;
      case 'crates_25kg': return rawQuantity * 25;
      case 'bags_50kg': return rawQuantity * 50;
      case 'kg':
      default: return rawQuantity;
    }
  };

  const calculatedKg = getCalculatedKg();
  const estimatedGrossPayout = calculatedKg * targetPrice;
  const traditionalRealizationLoss = Math.round(estimatedGrossPayout * 0.08); // 8% avg arhatiya/kata loss

  const handleProcessFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image (JPG, PNG, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setUploadedImage(base64);
      setUploadedFileName(file.name);
      runAiGrading(base64, cropName, variety);
    };
    reader.readAsDataURL(file);
  };

  const runAiGrading = async (base64: string, crop: string, varName: string) => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/gemini/quality-grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: crop,
          variety: varName,
          imageBase64: base64,
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        setAiAssayResult(data.analysis);
        if (data.analysis.recommendedPricePerKg) {
          setTargetPrice(data.analysis.recommendedPricePerKg);
        }
        if (data.analysis.mandiBenchmarkPrice) {
          setMandiBenchmark(data.analysis.mandiBenchmarkPrice);
          setMinAcceptablePrice(Math.round(data.analysis.mandiBenchmarkPrice * 0.9));
        }
        if (data.analysis.shelfLifeDays) {
          setShelfLifeDays(data.analysis.shelfLifeDays);
        }
      }
    } catch (err) {
      console.error('AI Grading error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const gradeToUse: QualityGrade = aiAssayResult?.grade || 'A';
    const newLot: ProduceListing = {
      id: `prod-lot-${Date.now()}`,
      title: lotTitle || `${variety} ${cropName}`,
      cropName,
      variety,
      category,
      farmerName,
      farmerPhone,
      farmLocation,
      district,
      state,
      quantityKg: calculatedKg,
      minOrderKg: Math.min(50, Math.round(calculatedKg * 0.1)),
      pricePerKg: targetPrice,
      mandiBenchmarkPrice: mandiBenchmark,
      grade: gradeToUse,
      freshnessScore: aiAssayResult?.freshnessScore || 94,
      harvestDate,
      image: uploadedImage,
      isOrganic,
      chemicalFree,
      coldChainStored: storageType === 'cold_storage',
      shelfLifeDays,
      traceabilityHash: `KM-${district.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`,
      moisturePercentage: moisturePct,
      lotNumber: `LOT-${cropName.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      description: `Harvest inspected & verified. Reserve floor price: ₹${minAcceptablePrice}/kg. Storage: ${storageType}. Direct farmgate supply with guaranteed quality grade.`,
      rating: 5.0,
      reviewsCount: 0,
    };

    onAddListing(newLot);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 gradient-border-organic border-0 shadow-2xl animate-in zoom-in-95 my-8 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-display font-extrabold text-slate-900">
              Add New Harvest / Crop Lot
            </h2>
            <p className="text-xs text-slate-500">
              Publish directly to 1,840+ verified buyers with transparent pricing & zero middleman cut
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Crop Selection & Lot Title */}
          <div className="space-y-4">
            <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
              1. Crop & Variety Details
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Crop Name *
                </label>
                <select
                  value={cropName}
                  onChange={(e) => {
                    setCropName(e.target.value);
                    setLotTitle(`Grade-A ${variety} ${e.target.value}`);
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600 bg-white"
                >
                  <option value="Tomato">Tomato (Tamatar)</option>
                  <option value="Onion">Onion (Pyaaz)</option>
                  <option value="Potato">Potato (Aloo)</option>
                  <option value="Garlic">Garlic (Lahsun)</option>
                  <option value="Capsicum">Capsicum / Bell Pepper</option>
                  <option value="Wheat">Wheat (Gehu)</option>
                  <option value="Basmati Rice">Basmati Rice (Dhan)</option>
                  <option value="Tur Dal">Tur Dal (Arhar)</option>
                  <option value="Chana">Chana (Bengal Gram)</option>
                  <option value="Green Chilli">Green Chilli (Hari Mirch)</option>
                  <option value="Ginger">Ginger (Adrak)</option>
                  <option value="Apple">Apple (Seb)</option>
                  <option value="Orange">Orange (Santra)</option>
                  <option value="Pomegranate">Pomegranate (Anaar)</option>
                  <option value="Mango">Mango (Aam)</option>
                  <option value="Okra (Bhindi)">Okra (Bhindi)</option>
                  <option value="Lemon (Nimbu)">Lemon (Nimbu)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Variety / Cultivar *
                </label>
                <input
                  type="text"
                  required
                  value={variety}
                  onChange={(e) => {
                    setVariety(e.target.value);
                    setLotTitle(`Grade-A ${e.target.value} ${cropName}`);
                  }}
                  placeholder="e.g. Hybrid Roma F1, Garwa Red"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600 bg-white"
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Grains & Pulses">Grains & Pulses</option>
                  <option value="Spices & Cash Crops">Spices & Cash Crops</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Listing Title / Headline
              </label>
              <input
                type="text"
                value={lotTitle}
                onChange={(e) => setLotTitle(e.target.value)}
                placeholder="e.g. Premium Export Grade Vine-Ripened Hybrid Roma Tomatoes"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600"
              />
            </div>
          </div>

          {/* 2. Quantity & Units */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 gradient-border-organic border-0">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-emerald-700" />
                <span>2. Available Quantity & Unit</span>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Total: {calculatedKg.toLocaleString()} kg ({ (calculatedKg / 1000).toFixed(2) } Metric Tonnes)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Harvest Lot Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={rawQuantity}
                  onChange={(e) => setRawQuantity(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-emerald-600 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Unit of Measurement *
                </label>
                <select
                  value={quantityUnit}
                  onChange={(e) => setQuantityUnit(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-emerald-600 font-medium"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="quintal">Quintals (100 kg / qtl)</option>
                  <option value="metric_ton">Metric Tonnes (1,000 kg / MT)</option>
                  <option value="crates_25kg">Standard Crates (25 kg / Crate)</option>
                  <option value="bags_50kg">Gunny Bags (50 kg / Bag)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Pricing & Minimum Acceptable Reserve Price */}
          <div className="space-y-4 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-emerald-700" />
                <span>3. Direct Target Price & Minimum Acceptable Floor Price</span>
              </div>
              <span className="text-[11px] font-bold text-slate-600">
                Mandi Benchmark: ₹{mandiBenchmark}/kg
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  Your Target Direct Selling Price (₹ per kg) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-emerald-600 font-extrabold text-emerald-900"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Listed to buyers on KisanMandi marketplace with 0% platform commission deduction.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  Minimum Acceptable Price / Reserve Floor (₹ per kg) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={minAcceptablePrice}
                    onChange={(e) => setMinAcceptablePrice(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-emerald-600 font-bold text-slate-800"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Bids below this floor will be automatically declined to protect your farm profit.
                </p>
              </div>
            </div>

            {/* Price Realization comparison */}
            <div className="p-3 rounded-xl bg-white border border-emerald-300 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="text-[11px] text-slate-500">Estimated Gross Revenue:</div>
                <div className="text-base font-extrabold text-emerald-900">
                  ₹{estimatedGrossPayout.toLocaleString()} (100% Direct to Bank/UPI)
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-emerald-700 font-semibold">Middleman Cut Saved:</div>
                <div className="text-sm font-bold text-emerald-700">
                  +₹{traditionalRealizationLoss.toLocaleString()} Extra Profit vs Traditional Mandi
                </div>
              </div>
            </div>
          </div>

          {/* 4. Harvest Date & Storage Details */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>4. Harvest Date, Storage & Shelf Life</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Harvest Date / Picking Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Current Storage Condition *
                </label>
                <select
                  value={storageType}
                  onChange={(e) => setStorageType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600 bg-white"
                >
                  <option value="ventilated_shed">Ventilated Dry Barn / Shed</option>
                  <option value="cold_storage">Temperature Controlled Cold Store</option>
                  <option value="farmgate_ambient">Farmgate Ambient / Field Packing</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Estimated Shelf Life (Days) *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    min="1"
                    required
                    value={shelfLifeDays}
                    onChange={(e) => setShelfLifeDays(parseInt(e.target.value) || 7)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOrganic}
                  onChange={(e) => setIsOrganic(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span>Organic / NPOP Certified Farm</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={chemicalFree}
                  onChange={(e) => setChemicalFree(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span>Zero Pesticide Residue Tested</span>
              </label>
            </div>
          </div>

          {/* 5. Crop Photo Upload & AI Quality Inspection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>5. Upload Crop Photos for AI Quality Inspection</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                AGMARK Certified Model
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
              {/* Image Preview */}
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-900 gradient-border-organic border-0 flex flex-col justify-end">
                <img
                  src={uploadedImage}
                  alt="Harvest Preview"
                  className="w-full h-full object-cover absolute inset-0"
                />
                <div className="relative z-10 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between text-white text-xs">
                  <div>
                    <span className="font-bold">{cropName} - {variety}</span>
                    <div className="text-[10px] text-slate-300">
                      {uploadedFileName || 'Standard Reference Photo'}
                    </div>
                  </div>
                  {aiAssayResult && (
                    <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">
                      Grade {aiAssayResult.grade}
                    </span>
                  )}
                </div>
              </div>

              {/* Upload Dropzone & Camera buttons */}
              <div className="flex flex-col justify-between space-y-2">
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleProcessFile(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex-1 flex flex-col items-center justify-center ${
                    isDragging
                      ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-100'
                      : 'border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/40'
                  }`}
                >
                  <Upload className="w-5 h-5 text-emerald-700 mb-1" />
                  <span className="text-xs font-bold text-slate-800">
                    {uploadedFileName ? 'Change Photo' : 'Upload Harvest Photo'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Supports JPG, PNG, WEBP (from Phone/Camera)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Camera Snap</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => runAiGrading(uploadedImage, cropName, variety)}
                    disabled={isScanning}
                    className="py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60"
                  >
                    {isScanning ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    )}
                    <span>Run AI Assay</span>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleProcessFile(file);
                  }}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleProcessFile(file);
                  }}
                  className="hidden"
                />
              </div>
            </div>

            {/* AI Result Banner if run */}
            {aiAssayResult && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-900">AI Quality Inspection: Grade {aiAssayResult.grade}</span>
                  <span className="text-slate-600 ml-2">(Score: {aiAssayResult.score}/100, Freshness: {aiAssayResult.freshnessScore}%, Blemish: {aiAssayResult.blemishRate}%)</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Verified for Direct Listing
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all"
            >
              Publish Harvest Lot to Marketplace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
