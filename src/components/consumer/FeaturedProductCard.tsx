import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Scale, 
  Plus, 
  Minus, 
  ArrowRight,
  Info,
  CheckCircle2,
  Tractor
} from 'lucide-react';
import { ConsumerProduct } from './ConsumerTypes';

interface FeaturedProductCardProps {
  product: ConsumerProduct;
  onAddToCart: (product: ConsumerProduct, quantityKg: number) => void;
  onBuyNow: (product: ConsumerProduct, quantityKg: number) => void;
  onViewSource: (product: ConsumerProduct) => void;
  onViewBreakdown?: (product: ConsumerProduct) => void;
}

export const FeaturedProductCard: React.FC<FeaturedProductCardProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  onViewSource,
  onViewBreakdown,
}) => {
  const [selectedKg, setSelectedKg] = useState<number>(2);

  const handleIncrement = () => setSelectedKg(prev => Math.min(prev + 1, 50));
  const handleDecrement = () => setSelectedKg(prev => Math.max(prev - 1, 1));

  const totalCost = selectedKg * product.kisanDirectPricePerKg;
  const retailCost = selectedKg * product.traditionalRetailPricePerKg;
  const totalSavings = retailCost - totalCost;

  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 bg-gradient-to-br from-white/80 via-emerald-50/40 to-slate-50/70 border-2 border-emerald-600/20 p-6 sm:p-8 shadow-lg shadow-emerald-900/5 overflow-hidden">
      {/* Decorative Ribbon Badge */}
      <div className="absolute -right-12 top-7 bg-gradient-to-r from-emerald-800 to-teal-800 text-white text-[10px] font-black uppercase tracking-wider py-1 px-12 rotate-45 shadow-sm">
        Featured Farm Produce
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Visual Presentation & Key Indicators */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-sm aspect-4/3 rounded-3xl bg-gradient-to-tr from-rose-100 via-rose-50 to-amber-50 border border-rose-200/80 flex flex-col items-center justify-center p-6 text-center shadow-inner group">
            
            {/* Freshness Badge Floating */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-emerald-800 text-xs font-black shadow-xs border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>{product.freshnessScore}% Freshness Index</span>
            </div>

            {/* Farm Grade */}
            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wide shadow-xs">
              {product.grade}
            </div>

            {/* Giant Emoji Display with Realistic Glow */}
            <div className="text-8xl sm:text-9xl filter drop-shadow-lg transform group-hover:scale-105 transition-transform duration-300 select-none">
              {product.emoji}
            </div>

            {/* Harvest Stamp */}
            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-700 bg-white/80 px-3.5 py-1.5 rounded-2xl gradient-border-organic border-0 font-semibold">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              <span>{product.harvestTimeAgo}</span>
            </div>
          </div>

          {/* Sourcing Guarantee Footer */}
          <div className="mt-4 w-full flex items-center justify-between text-xs text-slate-600 px-2">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Direct Farmgate Sourced</span>
            </div>
            <button
              onClick={() => onViewSource(product)}
              className="text-emerald-700 hover:text-emerald-900 font-bold underline flex items-center gap-1"
            >
              <span>View Source</span>
              <Info className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right Column: Details, Price Breakdown Preview & Controls */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Sourcing Banner */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-950 text-xs font-black">
            <Tractor className="w-4 h-4 text-emerald-800" />
            <span>From: {product.sourceNetwork}</span>
            <span className="text-[10px] text-emerald-800 font-normal">({product.sourceLocation})</span>
          </div>

          {/* Product Title and Price */}
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-950 tracking-tight flex items-center gap-3">
                <span>{product.name}</span>
                <span className="text-sm font-bold text-slate-500 font-sans">
                  ({product.variety})
                </span>
              </h2>

              <div className="text-right">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-emerald-900 font-display">
                    ₹{product.kisanDirectPricePerKg}
                  </span>
                  <span className="text-slate-500 font-bold text-sm">/ {product.unit}</span>
                </div>
                <div className="text-xs text-slate-400 line-through font-semibold">
                  Retail: ₹{product.traditionalRetailPricePerKg}/{product.unit}
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 py-1">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-white gradient-border-organic border-0">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Available Lot</span>
              <span className="text-sm font-extrabold text-slate-900">{product.availableKg} kg</span>
            </div>

            <div className="p-2.5 sm:p-3 rounded-2xl bg-white gradient-border-organic border-0">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Estimated Delivery</span>
              <span className="text-sm font-extrabold text-emerald-800">Today, 6:30 PM</span>
            </div>

            <div className="p-2.5 sm:p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] text-emerald-700 font-black block uppercase tracking-wider">Consumer Savings</span>
              <span className="text-sm font-black text-emerald-900">
                ₹{product.traditionalRetailPricePerKg - product.kisanDirectPricePerKg}/kg (15.6%)
              </span>
            </div>
          </div>

          {/* Quantity Selector and Dynamic Subtotal */}
          <div className="p-4 rounded-2xl bg-white gradient-border-organic border-0 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Select Quantity:</span>
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl gradient-border-organic border-0">
                <button
                  onClick={handleDecrement}
                  className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center text-slate-800 font-black shadow-2xs transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-12 text-center text-sm font-black text-slate-900">
                  {selectedKg} {product.unit}
                </span>
                <button
                  onClick={handleIncrement}
                  className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center text-slate-800 font-black shadow-2xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="text-right flex items-center gap-4">
              <div>
                <span className="text-[10px] text-slate-500 block font-semibold">Subtotal</span>
                <span className="text-lg font-black text-slate-900 font-display">₹{totalCost}</span>
              </div>
              <div className="pl-3 border-l border-slate-200 text-left">
                <span className="text-[10px] text-emerald-700 block font-bold">You Save</span>
                <span className="text-sm font-black text-emerald-700">₹{totalSavings}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              id="featured-add-to-cart-btn"
              onClick={() => onAddToCart(product, selectedKg)}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 text-xs sm:text-sm font-bold border-2 border-slate-200 shadow-xs flex items-center justify-center gap-2 hover:border-slate-300 active:scale-98 transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-700" />
              <span>Add {selectedKg} kg to Cart</span>
            </button>

            <button
              id="featured-buy-now-btn"
              onClick={() => onBuyNow(product, selectedKg)}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Buy Now • ₹{totalCost}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
