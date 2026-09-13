import React, { useState } from 'react';
import { 
  Sprout, 
  Sparkles, 
  ShoppingBag, 
  MapPin, 
  Search, 
  Tractor, 
  TrendingDown, 
  ShieldCheck, 
  PackageCheck, 
  Receipt,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  User,
  Zap,
  Leaf
} from 'lucide-react';

import { ConsumerProduct, ConsumerCartItem, ConsumerOrder, ConsumerTransactionRecord } from './ConsumerTypes';
import { CONSUMER_PRODUCTS, INITIAL_CONSUMER_ORDER, INITIAL_CONSUMER_TRANSACTIONS } from './ConsumerData';

import { ConsumerHeader } from './ConsumerHeader';
import { FeaturedProductCard } from './FeaturedProductCard';
import { TransparentPriceBreakdown } from './TransparentPriceBreakdown';
import { PriceComparisonSection } from './PriceComparisonSection';
import { DualImpactSection } from './DualImpactSection';
import { ProductCategoriesGrid } from './ProductCategoriesGrid';
import { FarmerSourceModal } from './FarmerSourceModal';
import { ConsumerSecurityStrip } from './ConsumerSecurityStrip';
import { ConsumerCartDrawer } from './ConsumerCartDrawer';
import { ConsumerCheckoutModal } from './ConsumerCheckoutModal';
import { ConsumerOrderTracker } from './ConsumerOrderTracker';
import { ConsumerTransactionLedger } from './ConsumerTransactionLedger';

interface ConsumerDashboardProps {
  onSwitchToFarmer?: () => void;
}

export const ConsumerDashboard: React.FC<ConsumerDashboardProps> = ({
  onSwitchToFarmer,
}) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'browse' | 'orders' | 'comparison' | 'ledger' | 'profile'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('📍 Baner & Aundh, Pune (30-45 mins)');

  // Data State
  const [products] = useState<ConsumerProduct[]>(CONSUMER_PRODUCTS);
  const [orders, setOrders] = useState<ConsumerOrder[]>([INITIAL_CONSUMER_ORDER]);
  const [transactions, setTransactions] = useState<ConsumerTransactionRecord[]>(INITIAL_CONSUMER_TRANSACTIONS);

  // Cart State (Initialized with sample Tomatoes for immediate realistic look)
  const [cartItems, setCartItems] = useState<ConsumerCartItem[]>([
    {
      product: CONSUMER_PRODUCTS[0], // Tomatoes
      quantityKg: 5,
    }
  ]);

  // Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [sourceModalProduct, setSourceModalProduct] = useState<ConsumerProduct | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart Handlers
  const handleAddToCart = (product: ConsumerProduct, quantityKg: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantityKg: item.quantityKg + quantityKg }
            : item
        );
      }
      return [...prev, { product, quantityKg }];
    });
    showToast(`Added ${quantityKg} ${product.unit} ${product.name} to cart`);
  };

  const handleBuyNow = (product: ConsumerProduct, quantityKg: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantityKg: item.quantityKg + quantityKg }
            : item
        );
      }
      return [...prev, { product, quantityKg }];
    });
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantityKg: newQty } : item
    ));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart');
  };

  // Checkout Success Callback
  const handleOrderSuccess = (newOrder: ConsumerOrder, newTx: ConsumerTransactionRecord) => {
    setOrders(prev => [newOrder, ...prev]);
    setTransactions(prev => [newTx, ...prev]);
    setCartItems([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setActiveTab('orders');
    showToast(`Order ${newOrder.orderNumber} successfully booked and secured!`);
  };

  const featuredTomato = products.find(p => p.id === 'prod-tomato') || products[0];
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantityKg, 0);

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-slate-900 pb-16 font-sans">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Consumer Header */}
      <ConsumerHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q && activeTab !== 'browse' && activeTab !== 'home') {
            setActiveTab('browse');
          }
        }}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        onSwitchToFarmer={onSwitchToFarmer}
      />

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">
        
        {/* ========================================================================= */}
        {/* VIEW 1: HOME DASHBOARD (All core sections ordered precisely) */}
        {/* ========================================================================= */}
        {activeTab === 'home' && (
          <>
            {/* Hero Subheader */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md relative overflow-hidden">
              <div className="space-y-2 relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Direct Farmgate Pipeline</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white">
                  Fresh produce directly from local farmers 🌱
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100/80 font-medium leading-relaxed">
                  Eliminating unnecessary intermediaries so you pay lower prices while local farmers earn substantially more.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab('browse')}
                  className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Browse All 9 Items</span>
                </button>
                <button
                  onClick={() => setActiveTab('comparison')}
                  className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <TrendingDown className="w-4 h-4 text-emerald-300" />
                  <span>View Savings</span>
                </button>
              </div>
            </div>

            {/* 2. Featured Product Card (Tomatoes ₹27/kg) */}
            <FeaturedProductCard
              product={featuredTomato}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onViewSource={setSourceModalProduct}
            />

            {/* 3 & 4. Transparent Price Breakdown & Traditional vs KisanDirect Price Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* Where does your ₹27 go? */}
              <TransparentPriceBreakdown
                productName={featuredTomato.name}
                totalPrice={featuredTomato.kisanDirectPricePerKg}
                farmerAmount={featuredTomato.farmerSharePerKg}
                transportAmount={featuredTomato.transportSharePerKg}
                platformAmount={featuredTomato.platformSharePerKg}
                unit={featuredTomato.unit}
              />

              {/* Traditional Retail vs KisanDirect Comparison */}
              <PriceComparisonSection
                onSelectProduct={(id) => {
                  const target = products.find(p => p.id === id);
                  if (target) setSourceModalProduct(target);
                }}
              />
            </div>

            {/* 5. Dual Impact Section */}
            <DualImpactSection />

            {/* 6 & 7. Product Categories Grid */}
            <ProductCategoriesGrid
              products={products}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onViewSource={setSourceModalProduct}
              searchQuery={searchQuery}
            />

            {/* 8. Secure Transaction Indicator Strip */}
            <ConsumerSecurityStrip />
          </>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: BROWSE CATALOG */}
        {/* ========================================================================= */}
        {activeTab === 'browse' && (
          <div className="space-y-8">
            <ProductCategoriesGrid
              products={products}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onViewSource={setSourceModalProduct}
              searchQuery={searchQuery}
            />
            <ConsumerSecurityStrip />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: MY ORDERS TRACKER */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-8">
            <ConsumerOrderTracker
              orders={orders}
              onViewTransaction={() => setActiveTab('ledger')}
            />
            <ConsumerSecurityStrip />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: PRICE COMPARISON & SAVINGS ANALYTICS */}
        {/* ========================================================================= */}
        {activeTab === 'comparison' && (
          <div className="space-y-8">
            <PriceComparisonSection
              onSelectProduct={(id) => {
                const target = products.find(p => p.id === id);
                if (target) setSourceModalProduct(target);
              }}
            />
            <TransparentPriceBreakdown />
            <DualImpactSection />
            <ConsumerSecurityStrip />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 5: TRANSACTION HISTORY LEDGER */}
        {/* ========================================================================= */}
        {activeTab === 'ledger' && (
          <div className="space-y-8">
            <ConsumerTransactionLedger
              transactions={transactions}
            />
            <ConsumerSecurityStrip />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 6: CONSUMER PROFILE & IMPACT SUMMARY */}
        {/* ========================================================================= */}
        {activeTab === 'profile' && (
          <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-3xl gradient-border-organic border-0 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white flex items-center justify-center text-2xl font-black shadow-md">
                AS
              </div>
              <div>
                <h3 className="text-xl font-display font-black text-slate-900">Ananya Sharma</h3>
                <p className="text-xs text-slate-500 font-medium">Verified Direct Consumer • Baner, Pune</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black">
                    8 Orders Completed
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black">
                    ₹640 Lifetime Savings
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Farmer Payout Supported</span>
                <span className="text-2xl font-display font-black text-emerald-950">₹2,840</span>
                <p className="text-[11px] text-emerald-800/80 mt-1">Paid directly to 4 farmer collectives</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 gradient-border-organic border-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Produce Purchased</span>
                <span className="text-2xl font-display font-black text-slate-900">42 kg</span>
                <p className="text-[11px] text-slate-500 mt-1">100% direct farmgate quality</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Average Consumer Savings</span>
                <span className="text-2xl font-display font-black text-amber-950">17.4%</span>
                <p className="text-[11px] text-amber-800/80 mt-1">Compared to urban supermarkets</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('orders')}
                className="px-4 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900"
              >
                Track Active Orders
              </button>
              <button
                onClick={() => setActiveTab('ledger')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200"
              >
                Download Ledger Audit
              </button>
              {onSwitchToFarmer && (
                <button
                  onClick={onSwitchToFarmer}
                  className="px-4 py-2.5 rounded-xl border border-emerald-600 text-emerald-800 text-xs font-black hover:bg-emerald-50"
                >
                  Switch to Farmer Portal View
                </button>
              )}
            </div>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODALS & DRAWERS */}
      {/* ========================================================================= */}
      
      {/* 1. Sourcing Transparency Modal */}
      <FarmerSourceModal
        product={sourceModalProduct}
        onClose={() => setSourceModalProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* 2. Interactive Cart Drawer */}
      <ConsumerCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 3. Secure Digital Checkout Modal */}
      <ConsumerCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        deliveryLocation={selectedLocation}
        onOrderSuccess={handleOrderSuccess}
      />

    </div>
  );
};
