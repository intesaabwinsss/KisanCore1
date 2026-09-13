import React, { useState } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Tractor, 
  Plus, 
  Info,
  Check,
  ChevronRight,
  Zap
} from 'lucide-react';
import { ConsumerProduct } from './ConsumerTypes';

interface ProductCategoriesGridProps {
  products: ConsumerProduct[];
  onAddToCart: (product: ConsumerProduct, quantityKg: number) => void;
  onBuyNow: (product: ConsumerProduct, quantityKg: number) => void;
  onViewSource: (product: ConsumerProduct) => void;
  searchQuery?: string;
}

export const ProductCategoriesGrid: React.FC<ProductCategoriesGridProps> = ({
  products,
  onAddToCart,
  onBuyNow,
  onViewSource,
  searchQuery = '',
}) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Vegetables' | 'Fruits'>('All');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleQuickAdd = (product: ConsumerProduct) => {
    const qty = quantities[product.id] || 1;
    onAddToCart(product, qty);
    setAddedItemIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  const handleQtyChange = (productId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[productId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sourceLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const vegetableProducts = products.filter(p => p.category === 'Vegetables');
  const fruitProducts = products.filter(p => p.category === 'Fruits');

  return (
    <div className="space-y-8">
      
      {/* Category Tabs & Filter Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-950">
            Fresh Produce Catalog
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            100% farm-direct produce harvested daily with transparent cost breakdown.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl gradient-border-organic border-0">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'All'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Produce ({products.length})
          </button>
          <button
            onClick={() => setActiveCategory('Vegetables')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeCategory === 'Vegetables'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>🍅 Fresh Vegetables</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-900">
              {vegetableProducts.length}
            </span>
          </button>
          <button
            onClick={() => setActiveCategory('Fruits')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeCategory === 'Fruits'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>🍎 Fresh Fruits</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-900">
              {fruitProducts.length}
            </span>
          </button>
        </div>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const savings = product.traditionalRetailPricePerKg - product.kisanDirectPricePerKg;
          const isAdded = !!addedItemIds[product.id];

          return (
            <div
              key={product.id}
              className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 hover:border-emerald-500/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Product Card Top: Image/Emoji & Badges */}
              <div className="p-5 pb-0">
                <div className={`relative aspect-4/3 rounded-2xl bg-gradient-to-br ${product.imagePlaceholderColor} border border-slate-100 flex flex-col items-center justify-center p-4 text-center group-hover:scale-[1.02] transition-transform`}>
                  
                  {/* Freshness Badge */}
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-white/90 text-emerald-900 text-[10px] font-black shadow-2xs border border-emerald-200">
                    {product.freshnessScore}% Fresh
                  </span>

                  {/* Savings Tag */}
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black shadow-2xs">
                    Save ₹{savings}/{product.unit}
                  </span>

                  {/* Giant Emoji Icon */}
                  <div className="text-6xl select-none filter drop-shadow-md">
                    {product.emoji}
                  </div>

                  {/* Harvest Time */}
                  <span className="mt-3 text-[11px] text-slate-700 bg-white/80 px-2.5 py-0.5 rounded-xl font-bold flex items-center gap-1 gradient-border-organic border-0/60">
                    <Clock className="w-3 h-3 text-emerald-700" />
                    <span>{product.harvestTimeAgo}</span>
                  </span>
                </div>

                {/* Sourcing Info Block */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1">
                      <Tractor className="w-3.5 h-3.5" />
                      <span>{product.sourceNetwork}</span>
                    </span>
                    <button
                      onClick={() => onViewSource(product)}
                      className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold underline flex items-center gap-0.5"
                    >
                      <span>View Source</span>
                      <Info className="w-3 h-3" />
                    </button>
                  </div>

                  <h4 className="text-lg font-black text-slate-900 tracking-tight flex items-center justify-between">
                    <span>{product.name}</span>
                    <span className="text-xs font-semibold text-slate-400">{product.variety}</span>
                  </h4>

                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{product.sourceLocation}</span>
                  </div>
                </div>
              </div>

              {/* Middle Section: Transparent Pricing Breakdown Pill Box */}
              <div className="px-5 py-3 mt-3 bg-slate-50 border-y border-slate-100 text-xs">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Price Distribution (₹/{product.unit})</span>
                  <span className="text-emerald-800 font-black">
                    {((product.farmerSharePerKg / product.kisanDirectPricePerKg) * 100).toFixed(0)}% to Farmer
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-1 text-center font-bold">
                  <div className="bg-emerald-100/70 p-1.5 rounded-lg text-emerald-950">
                    <span className="text-[9px] block text-emerald-800 font-extrabold uppercase">Farmer</span>
                    <span className="text-xs font-black">₹{product.farmerSharePerKg}</span>
                  </div>
                  <div className="bg-slate-200/70 p-1.5 rounded-lg text-slate-800">
                    <span className="text-[9px] block text-slate-500 font-extrabold uppercase">Transport</span>
                    <span className="text-xs font-black">₹{product.transportSharePerKg}</span>
                  </div>
                  <div className="bg-slate-200/70 p-1.5 rounded-lg text-slate-800">
                    <span className="text-[9px] block text-slate-500 font-extrabold uppercase">Platform</span>
                    <span className="text-xs font-black">₹{product.platformSharePerKg}</span>
                  </div>
                </div>
              </div>

              {/* Bottom: Price & Add to Cart Controls */}
              <div className="p-5 pt-3 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-display font-black text-slate-900">
                        ₹{product.kisanDirectPricePerKg}
                      </span>
                      <span className="text-xs text-slate-500 font-bold">/ {product.unit}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 line-through">
                      Retail: ₹{product.traditionalRetailPricePerKg}/{product.unit}
                    </span>
                  </div>

                  <span className="text-[11px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Lot: {product.availableKg} {product.unit} left
                  </span>
                </div>

                <div className="flex items-center justify-between mb-3 bg-slate-50 gradient-border-organic border-0 rounded-xl p-1">
                  <span className="text-xs font-bold text-slate-500 pl-2">Quantity:</span>
                  <div className="flex items-center bg-white gradient-border-organic border-0 rounded-lg shadow-sm">
                    <button onClick={() => handleQtyChange(product.id, -1)} className="px-2.5 py-1 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-l-lg transition-colors">-</button>
                    <span className="px-2 text-xs font-black text-slate-900 w-8 text-center">{quantities[product.id] || 1}</span>
                    <button onClick={() => handleQtyChange(product.id, 1)} className="px-2.5 py-1 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-r-lg transition-colors">+</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleQuickAdd(product)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isAdded
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => onBuyNow(product, quantities[product.id] || 1)}
                    className="py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold shadow-xs flex items-center justify-center gap-1 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="p-12 text-center bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-3xl gradient-border-organic border-0">
          <p className="text-lg font-bold text-slate-800">No produce matching "{searchQuery}"</p>
          <p className="text-xs text-slate-500 mt-1">Try searching for Tomatoes, Potatoes, Onions, Apples, Mangoes, or Bananas.</p>
        </div>
      )}

    </div>
  );
};
