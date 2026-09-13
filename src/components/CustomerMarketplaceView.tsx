import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Search, 
  Filter, 
  Heart, 
  CheckCircle2, 
  ArrowLeft, 
  Star, 
  Truck, 
  X,
  CreditCard,
  Check
} from 'lucide-react';
import { CraftItem, LanguageCode } from '../types';
import { SAMPLE_CRAFTS } from '../data/artisanData';

interface CustomerMarketplaceViewProps {
  currentLanguage: LanguageCode;
  onInspectProvenance: (craft: CraftItem) => void;
  onBackToArtisanView?: () => void;
  isDarkMode?: boolean;
}

export const CustomerMarketplaceView: React.FC<CustomerMarketplaceViewProps> = ({
  currentLanguage,
  onInspectProvenance,
  onBackToArtisanView,
  isDarkMode = false,
}) => {
  const [crafts, setCrafts] = useState<CraftItem[]>(SAMPLE_CRAFTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<{ craft: CraftItem; quantity: number }[]>([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  const categories = ['All', 'Pottery & Ceramics', 'Painting & Folk Art', 'Woodwork & Carving'];

  const filteredCrafts = crafts.filter((craft) => {
    const matchesCategory = selectedCategory === 'All' || craft.category === selectedCategory;
    const matchesSearch = craft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          craft.artisanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          craft.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (craft: CraftItem) => {
    setCart((prev) => {
      const existing = prev.find(item => item.craft.id === craft.id);
      if (existing) {
        return prev.map(item => item.craft.id === craft.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { craft, quantity: 1 }];
    });
    setShowCartDrawer(true);
  };

  const removeFromCart = (craftId: string) => {
    setCart(cart.filter(item => item.craft.id !== craftId));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.craft.price * item.quantity), 0);

  const handleCheckout = () => {
    setOrderCompleted(true);
    setTimeout(() => {
      setCart([]);
      setOrderCompleted(false);
      setShowCartDrawer(false);
    }, 3000);
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest uppercase text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-200">
              Customer Storefront View
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            Authentic Indian Craft Marketplace
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Every creation is verified authentic with GI tag provenance. 100% of fair value reaches rural master artisans.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onBackToArtisanView && (
            <button
              onClick={onBackToArtisanView}
              className="px-3.5 py-2 rounded-xl gradient-border-organic border-0 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
            >
              Back to Artisan Studio
            </button>
          )}

          {/* Cart Trigger */}
          <button
            onClick={() => setShowCartDrawer(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Bag ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search crafts by name, master artisan, or region (e.g. Warli, Jaipur, Kashmir)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:outline-hidden transition-colors ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700 text-slate-100' 
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : isDarkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Crafts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCrafts.map((craft) => (
          <div
            key={craft.id}
            className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all group ${
              isDarkMode 
                ? 'bg-slate-800/80 border-slate-700' 
                : 'bg-white border-slate-200 shadow-2xs hover:shadow-md'
            }`}
          >
            <div>
              {/* Studio Enhanced Image Preview */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-900">
                <img
                  src={craft.themeImages['rustic-earthy']}
                  alt={craft.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* GI Tag Seal */}
                {craft.giTagVerified && (
                  <span className="absolute top-2.5 left-2.5 px-2 py-1 rounded-md bg-teal-700 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="w-3 h-3" />
                    <span>GI Certified</span>
                  </span>
                )}

                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-mono">
                  {craft.craftCluster.split(' ')[0]}
                </span>
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-1">
                  {craft.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  By {craft.artisanName} • {craft.state}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {craft.description}
                </p>

                <div className="flex items-center gap-1 text-amber-500 text-xs pt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{craft.rating}</span>
                  <span className="text-slate-400">({craft.reviewsCount} verified reviews)</span>
                </div>
              </div>
            </div>

            {/* Bottom Price & Add to Bag */}
            <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-700/80 mt-2 flex items-center justify-between">
              <div>
                <span className="text-lg font-display font-extrabold text-slate-900 dark:text-slate-100">
                  ₹{craft.price}
                </span>
                <span className="text-[10px] text-emerald-600 block font-medium">Zero Markup Payout</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onInspectProvenance(craft)}
                  className="px-2.5 py-1.5 rounded-lg gradient-border-organic border-0 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Verify
                </button>
                <button
                  onClick={() => addToCart(craft)}
                  className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-2xs"
                >
                  Add to Bag
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Drawer */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full p-6 flex flex-col justify-between shadow-2xl border-l border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-teal-600" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Artisan Direct Shopping Bag
                  </h3>
                </div>
                <button 
                  onClick={() => setShowCartDrawer(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="py-20 text-center text-slate-400 space-y-2">
                  <ShoppingBag className="w-10 h-10 mx-auto stroke-1" />
                  <p className="text-xs">Your bag is empty.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[60vh] overflow-y-auto mt-4 space-y-2">
                  {cart.map(({ craft, quantity }) => (
                    <div key={craft.id} className="pt-3 pb-2 flex items-center gap-3">
                      <img src={craft.themeImages['rustic-earthy']} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{craft.title}</p>
                        <p className="text-[10px] text-slate-500">By {craft.artisanName}</p>
                        <p className="text-xs font-mono font-bold text-teal-600">₹{craft.price} × {quantity}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(craft.id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Checkout Action */}
            {cart.length > 0 && (
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Artisan Fair Value (100% Direct)</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Artisan Commission Deducted</span>
                    <span className="font-mono text-emerald-600 font-bold">₹0 (0% Free)</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Platform Facilitation Fee (2.0%)</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">₹{Math.round(cartTotal * 0.02)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-slate-100 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                    <span>Total Escrow Payable</span>
                    <span className="font-mono text-teal-600 font-extrabold">₹{cartTotal + Math.round(cartTotal * 0.02)}</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 text-[10px] text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  <span><strong>Fair-Trade Escrow:</strong> 100% of craft value held safely for the artisan until your physical parcel arrives.</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={orderCompleted}
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  {orderCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Order Confirmed! Payout Escrowed.</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Pay ₹{cartTotal + Math.round(cartTotal * 0.02)} via UPI / Card</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
