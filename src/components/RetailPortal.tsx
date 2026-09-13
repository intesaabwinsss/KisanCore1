import React, { useState } from 'react';
import { 
  Store, 
  Search, 
  Filter, 
  ShoppingBag, 
  QrCode, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  Coins
} from 'lucide-react';
import { ProduceListing, ProduceCategory, CartItem, Language } from '../types';
import { MOCK_PRODUCE_LISTINGS } from '../data/mockData';

interface RetailPortalProps {
  
  onInspectTraceability: (produce: ProduceListing) => void;
  onInspectPriceBreakdown?: (produce: ProduceListing) => void;
  cartItems: CartItem[];
  onAddToCart: (produce: ProduceListing) => void;
  onUpdateCartQty: (produceId: string, delta: number) => void;
}

export const RetailPortal: React.FC<RetailPortalProps> = ({
  onInspectTraceability,
  onInspectPriceBreakdown,
  cartItems,
  onAddToCart,
  onUpdateCartQty,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [organicOnly, setOrganicOnly] = useState(false);

  const categories: string[] = ['All', 'Vegetables', 'Fruits', 'Grains & Pulses', 'Spices & Cash Crops'];

  const filteredProduce = MOCK_PRODUCE_LISTINGS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOrganic = !organicOnly || item.isOrganic;
    return matchesCategory && matchesSearch && matchesOrganic;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600/80 border border-emerald-400/40 flex items-center justify-center text-white shrink-0">
            <Store className="w-8 h-8 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-display font-extrabold text-white">
                Farm-Direct Retail Market
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                100% Farm to Kitchen
              </span>
            </div>
            <p className="text-xs text-emerald-100/80 mt-1">
              Fresh vegetables, fruits, and cold-pressed staples directly from verified farmers without warehouse markups.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl text-xs font-semibold backdrop-blur-xs">
          <Truck className="w-4 h-4 text-emerald-400" />
          <span>Same-Day Cold Transit to Urban Hubs</span>
        </div>
      </div>

      {/* Filter and Search Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 p-4 rounded-2xl gradient-border-organic border-0 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search farm, crop, or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs gradient-border-organic border-0 rounded-xl focus:outline-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => setOrganicOnly(!organicOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 border transition-all ${
              organicOnly
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            🌱 Organic Only
          </button>
        </div>
      </div>

      {/* Produce Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProduce.map((produce) => {
          const inCartItem = cartItems.find((c) => c.produce.id === produce.id);
          return (
            <div
              key={produce.id}
              className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-4/3 overflow-hidden bg-slate-900">
                  <img
                    src={produce.image}
                    alt={produce.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white text-[10px] font-bold shadow-xs">
                      Grade {produce.grade}
                    </span>
                    {produce.isOrganic && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 text-[10px] font-bold shadow-xs">
                        Organic
                      </span>
                    )}
                  </div>
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-mono">
                    {produce.freshnessScore}% Freshness
                  </span>
                </div>

                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {produce.district}, {produce.state}
                    </span>
                    <span className="font-semibold text-emerald-700">Lot #{produce.lotNumber}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {produce.title}
                  </h3>

                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <span>Farmer:</span>
                    <strong className="text-slate-800">{produce.farmerName}</strong>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {produce.description}
                  </p>

                  <div className="pt-2 flex items-baseline justify-between border-t border-slate-100">
                    <div>
                      <span className="text-lg font-extrabold text-slate-900">₹{produce.pricePerKg}</span>
                      <span className="text-xs text-slate-400">/kg</span>
                    </div>
                    <span className="text-[10px] text-slate-400 line-through">
                      Mandi: ₹{produce.mandiBenchmarkPrice}/kg
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 space-y-2">
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => onInspectTraceability(produce)}
                    className="py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <QrCode className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Passport</span>
                  </button>

                  <button
                    onClick={() => onInspectPriceBreakdown?.(produce)}
                    className="py-2 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 border border-emerald-200"
                    title="Inspect traditional supply chain intermediary vs direct farmer realization breakdown"
                  >
                    <Coins className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Price Split</span>
                  </button>
                </div>

                {inCartItem ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 rounded-xl p-1.5">
                    <button
                      onClick={() => onUpdateCartQty(produce.id, -1)}
                      className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center font-bold text-xs shadow-2xs hover:bg-slate-50"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-emerald-900">
                      {inCartItem.quantityKg} kg in cart
                    </span>
                    <button
                      onClick={() => onUpdateCartQty(produce.id, 1)}
                      className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-2xs hover:bg-emerald-800"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onAddToCart(produce)}
                    className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
