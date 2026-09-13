import React, { useState, useEffect } from 'react';
import {
  X,
  Package,
  Plus,
  Save,
  DollarSign,
  Calendar,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { FarmerProductItem } from './ProductCard';

interface AddEditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: FarmerProductItem) => void;
  initialProduct?: FarmerProductItem | null;
}

const CROP_TEMPLATES = [
  { name: 'Tomato', emoji: '🍅', variety: 'Abhinav Hybrid F1', defaultPrice: 23, marketPrice: 22, grade: 'A' as const },
  { name: 'Potato', emoji: '🥔', variety: 'Kufri Jyoti', defaultPrice: 19, marketPrice: 18, grade: 'A' as const },
  { name: 'Onion', emoji: '🧅', variety: 'Nashik Red', defaultPrice: 28, marketPrice: 27, grade: 'A' as const },
  { name: 'Basmati Rice', emoji: '🌾', variety: '1121 Pusa Supreme', defaultPrice: 74, marketPrice: 72, grade: 'Organic' as const },
  { name: 'Green Chilli', emoji: '🌶️', variety: 'G4 Hot Hybrid', defaultPrice: 48, marketPrice: 45, grade: 'A' as const },
  { name: 'Garlic', emoji: '🧄', variety: 'Yamuna Safed (G-1)', defaultPrice: 125, marketPrice: 120, grade: 'A' as const },
  { name: 'Cauliflower', emoji: '🥦', variety: 'Snowball White', defaultPrice: 32, marketPrice: 30, grade: 'B' as const },
];

export const AddEditProductModal: React.FC<AddEditProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct,
}) => {
  const [name, setName] = useState('Tomato');
  const [emoji, setEmoji] = useState('🍅');
  const [variety, setVariety] = useState('Abhinav Hybrid F1');
  const [availableQuantityKg, setAvailableQuantityKg] = useState<number>(500);
  const [askingPricePerKg, setAskingPricePerKg] = useState<number>(23);
  const [currentMarketPricePerKg, setCurrentMarketPricePerKg] = useState<number>(22);
  const [grade, setGrade] = useState<'A' | 'B' | 'Organic'>('A');
  const [status, setStatus] = useState<FarmerProductItem['status']>('ACTIVE');

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setEmoji(initialProduct.emoji);
      setVariety(initialProduct.variety);
      setAvailableQuantityKg(initialProduct.availableQuantityKg);
      setAskingPricePerKg(initialProduct.askingPricePerKg);
      setCurrentMarketPricePerKg(initialProduct.currentMarketPricePerKg);
      setGrade(initialProduct.grade || 'A');
      setStatus(initialProduct.status);
    } else {
      // Reset to default
      setName('Tomato');
      setEmoji('🍅');
      setVariety('Abhinav Hybrid F1');
      setAvailableQuantityKg(500);
      setAskingPricePerKg(23);
      setCurrentMarketPricePerKg(22);
      setGrade('A');
      setStatus('ACTIVE');
    }
  }, [initialProduct, isOpen]);

  if (!isOpen) return null;

  const handleSelectTemplate = (tpl: typeof CROP_TEMPLATES[0]) => {
    setName(tpl.name);
    setEmoji(tpl.emoji);
    setVariety(tpl.variety);
    setAskingPricePerKg(tpl.defaultPrice);
    setCurrentMarketPricePerKg(tpl.marketPrice);
    setGrade(tpl.grade);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product: FarmerProductItem = {
      id: initialProduct ? initialProduct.id : `prod-${Date.now()}`,
      name,
      emoji,
      variety,
      availableQuantityKg: Number(availableQuantityKg),
      askingPricePerKg: Number(askingPricePerKg),
      currentMarketPricePerKg: Number(currentMarketPricePerKg),
      activeOrdersCount: initialProduct ? initialProduct.activeOrdersCount : 0,
      status,
      grade,
      harvestDate: new Date().toISOString().split('T')[0],
    };
    onSave(product);
    onClose();
  };

  const totalLotValue = availableQuantityKg * askingPricePerKg;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white gradient-border-organic border-0 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold">
              {emoji}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                {initialProduct ? 'Edit Listed Product' : 'Add New Harvest Product'}
              </h3>
              <p className="text-xs text-slate-500">
                List your produce directly to restaurants, supermarkets, and B2B buyers.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Quick Preset Buttons */}
          {!initialProduct && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Quick Select Popular Crops:
              </label>
              <div className="flex flex-wrap gap-2">
                {CROP_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.name}
                    type="button"
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      name === tpl.name
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{tpl.emoji}</span>
                    <span>{tpl.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Row 1: Crop Name & Variety */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Crop Name & Icon
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  className="w-14 text-center py-2 text-lg gradient-border-organic border-0 rounded-xl focus:outline-emerald-600 bg-slate-50"
                  title="Emoji Icon"
                />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs gradient-border-organic border-0 rounded-xl focus:outline-emerald-600"
                  placeholder="e.g. Tomato, Potato"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Crop Variety / Cultivar
              </label>
              <input
                type="text"
                required
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full px-3.5 py-2 text-xs gradient-border-organic border-0 rounded-xl focus:outline-emerald-600"
                placeholder="e.g. Abhinav Hybrid F1, Nashik Red"
              />
            </div>
          </div>

          {/* Row 2: Quantity & Quality Grade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Available Harvest Quantity (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={10}
                  step={10}
                  value={availableQuantityKg}
                  onChange={(e) => setAvailableQuantityKg(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs gradient-border-organic border-0 rounded-xl focus:outline-emerald-600 font-mono font-bold"
                />
                <span className="absolute right-3 top-2 text-xs text-slate-400 font-bold">
                  kg ({(availableQuantityKg / 100).toFixed(1)} Quintal)
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Quality Grade
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['A', 'B', 'Organic'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrade(g)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      grade === g
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-black'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Grade {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Asking Price & Benchmark Market Rate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl gradient-border-organic border-0">
            <div>
              <label className="text-xs font-bold text-emerald-900 block mb-1">
                Your Direct Asking Price (₹/kg)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-emerald-700 font-bold">₹</span>
                <input
                  type="number"
                  required
                  min={1}
                  step={0.5}
                  value={askingPricePerKg}
                  onChange={(e) => setAskingPricePerKg(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 text-sm border border-emerald-300 rounded-xl focus:outline-emerald-600 font-mono font-black text-emerald-900 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                Current Mandi Benchmark Price (₹/kg)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  required
                  min={1}
                  step={0.5}
                  value={currentMarketPricePerKg}
                  onChange={(e) => setCurrentMarketPricePerKg(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 text-sm gradient-border-organic border-0 rounded-xl focus:outline-slate-600 font-mono font-bold text-slate-700 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Projected Lot Value Summary */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs text-emerald-950">
            <div>
              <span className="font-bold block">Estimated Direct Contract Realization:</span>
              <span className="text-[11px] text-emerald-800">
                {availableQuantityKg} kg × ₹{askingPricePerKg}/kg (Zero middlemen cuts)
              </span>
            </div>
            <div className="text-right">
              <div className="text-xl font-black text-emerald-900 font-mono">
                ₹{totalLotValue.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-emerald-700 font-bold">
                Protected by Smart Escrow
              </span>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{initialProduct ? 'Update Product' : 'List Harvest Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
