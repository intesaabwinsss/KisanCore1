import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Language, 
  RoleType,
  ProduceListing,
  CartItem
} from './types';

// Agriculture Ecosystem Components
import { Navbar } from './components/Navbar';
import { HeroLanding } from './components/HeroLanding';
import { FarmerPortal } from './components/FarmerPortal';
import { ConsumerDashboard } from './components/consumer/ConsumerDashboard';
import { GovernmentDashboard } from './components/government/GovernmentDashboard';
import { B2BPortal } from './components/B2BPortal';
import { RetailPortal } from './components/RetailPortal';
import { LogisticsPortal } from './components/LogisticsPortal';
import { AdminPortal } from './components/AdminPortal';
import { KisanDirectTrucksPortal } from './components/KisanDirectTrucksPortal';
import { CartDrawer } from './components/CartDrawer';
import { TraceabilityModal } from './components/TraceabilityModal';
import { AIAdvisoryModal } from './components/AIAdvisoryModal';
import { PriceBreakdownModal } from './components/PriceBreakdownModal';

// Price Alert & Notification System
import { LanguageProvider } from './context/LanguageContext';
import { PriceAlertProvider } from './context/PriceAlertContext';
import { PriceAlertModal } from './components/PriceAlertModal';
import { NotificationCenterDrawer } from './components/NotificationCenterDrawer';
import { AlertToastNotification } from './components/AlertToastNotification';

// Smart Matching Engine
import { SmartMatchingProvider } from './context/SmartMatchingContext';
import { SmartMatchingDashboard } from './components/SmartMatchingDashboard';

// Transportation Context
import { TransportationProvider } from './context/TransportationContext';

// Crop Distress Engine
import { CropDistressDemo } from './components/CropDistressDemo';

import { SupportChatbot } from './components/SupportChatbot';

import { AuthModal } from './components/AuthModal';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { currentUser } = useAuth();
  const [activeRole, setActiveRole] = useState<RoleType>((localStorage.getItem('app_activeRole') as RoleType) || 'landing');
  useEffect(() => { localStorage.setItem('app_activeRole', activeRole); }, [activeRole]);
  
  
  // Sync initial role if logged in
  useEffect(() => {
    if (currentUser) {
      setActiveRole(currentUser.role === 'farmer' ? 'farmer' : 'consumer');
    }
  }, [currentUser]);
  
  // Modals and Drawers
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdvisoryOpen, setIsAdvisoryOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [inspectedProduce, setInspectedProduce] = useState<ProduceListing | null>(null);
  const [inspectedBreakdownProduce, setInspectedBreakdownProduce] = useState<ProduceListing | null>(null);
  
  // E-commerce State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => { try { const saved = localStorage.getItem('app_cartItems'); return saved ? JSON.parse(saved) : []; } catch { return []; } });
  useEffect(() => { localStorage.setItem('app_cartItems', JSON.stringify(cartItems)); }, [cartItems]);

  const handleAddToCart = (produce: ProduceListing, quantityKg: number = produce.minOrderKg) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.produce.id === produce.id);
      if (existing) {
        return prev.map(item => 
          item.produce.id === produce.id 
            ? { ...item, quantityKg: item.quantityKg + quantityKg }
            : item
        );
      }
      return [...prev, { produce, quantityKg }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (produceId: string, quantityKg: number) => {
    setCartItems(prev => prev.map(item => 
      item.produce.id === produceId ? { ...item, quantityKg } : item
    ));
  };

  const handleRemoveFromCart = (produceId: string) => {
    setCartItems(prev => prev.filter(item => item.produce.id !== produceId));
  };

  return (
    <LanguageProvider>
      <PriceAlertProvider>
        <SmartMatchingProvider>
          <TransportationProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased relative selection:bg-emerald-200 selection:text-emerald-900 overflow-x-hidden">
          {/* Global Premium Architectural Grid */}
          <div className="fixed inset-0 z-0 pointer-events-none flex justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-slate-300)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-300)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50"></div>
            <div className="absolute top-0 w-full max-w-7xl h-[600px] bg-emerald-400/5 blur-[120px] rounded-full"></div>
          </div>

          <div className="relative z-10 flex flex-col min-h-screen">
            {/* Global Navbar */}
            <Navbar
              activeRole={activeRole}
              onSelectRole={setActiveRole}
              
              
              onOpenAdvisory={() => setIsAdvisoryOpen(true)}
              cartItems={cartItems}
              onOpenCart={() => setIsCartOpen(true)}
              onOpenAuth={() => setIsAuthModalOpen(true)}
            />

            {/* Main Routing based on Role */}
          <AnimatePresence mode="wait">
            <motion.main 
              key={activeRole}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="pt-32 pb-12"
            >
              {activeRole === 'landing' && (
                <HeroLanding
                  onSelectRole={setActiveRole}
                  onOpenAdvisory={() => setIsAdvisoryOpen(true)}
                  onInspectTraceability={setInspectedProduce}
                  onInspectPriceBreakdown={setInspectedBreakdownProduce}
                  onAddToCart={(produce) => handleAddToCart(produce)}
                  
                />
              )}

              {activeRole === 'matching' && (
                <SmartMatchingDashboard />
              )}

              {activeRole === 'distress_demo' && (
                <CropDistressDemo />
              )}

              {activeRole === 'farmer' && (
                <FarmerPortal
                  
                  onOpenAdvisory={() => setIsAdvisoryOpen(true)}
                  onInspectTraceability={setInspectedProduce}
                  onInspectPriceBreakdown={setInspectedBreakdownProduce}
                />
              )}

              {activeRole === 'consumer' && (
                <ConsumerDashboard
                  onSwitchToFarmer={() => setActiveRole('farmer')}
                />
              )}

              {activeRole === 'government' && (
                <GovernmentDashboard
                  onLogout={() => setActiveRole('landing')}
                  onNavigateHome={() => setActiveRole('landing')}
                />
              )}

              {activeRole === 'b2b' && (
                <B2BPortal
                  
                  onInspectTraceability={setInspectedProduce}
                  onAddToCart={(produce) => handleAddToCart(produce)}
                />
              )}

              {activeRole === 'retail' && (
                <RetailPortal
                  
                  onInspectTraceability={setInspectedProduce}
                  onInspectPriceBreakdown={setInspectedBreakdownProduce}
                  cartItems={cartItems}
                  onAddToCart={(produce) => handleAddToCart(produce, 10)} // Retail default to smaller amounts
                  onUpdateCartQty={(produceId, delta) => {
                    const item = cartItems.find(c => c.produce.id === produceId);
                    if (item) {
                      const newQty = item.quantityKg + delta;
                      if (newQty <= 0) handleRemoveFromCart(produceId);
                      else handleUpdateCartQuantity(produceId, newQty);
                    }
                  }}
                />
              )}

              {activeRole === 'trucks' && (
                <KisanDirectTrucksPortal
                  onSelectRole={setActiveRole}
                />
              )}

              {activeRole === 'logistics' && (
                <LogisticsPortal
                  onNavigateToTrucks={() => setActiveRole('trucks')}
                />
              )}

              {activeRole === 'admin' && (
                <AdminPortal
                  
                  onInspectTraceability={setInspectedProduce}
                />
              )}
            </motion.main>
          </AnimatePresence>

          {/* Global Modals and Drawers */}
          {isAdvisoryOpen && (
            <AIAdvisoryModal
              onClose={() => setIsAdvisoryOpen(false)}
              
            />
          )}

          {isCartOpen && (
            <CartDrawer
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              cartItems={cartItems}
              onUpdateQty={(produceId, delta) => {
                const item = cartItems.find(c => c.produce.id === produceId);
                if (item) {
                  const newQty = item.quantityKg + delta;
                  if (newQty <= 0) handleRemoveFromCart(produceId);
                  else handleUpdateCartQuantity(produceId, newQty);
                }
              }}
              onClearCart={() => setCartItems([])}
            />
          )}

          {inspectedProduce && (
            <TraceabilityModal
              produce={inspectedProduce}
              onClose={() => setInspectedProduce(null)}
              
            />
          )}

          {inspectedBreakdownProduce && (
            <PriceBreakdownModal
              produce={inspectedBreakdownProduce}
              onClose={() => setInspectedBreakdownProduce(null)}
              
            />
          )}

          {/* Price Alert & Notification Modals */}
          <PriceAlertModal />
          <NotificationCenterDrawer onSelectRole={setActiveRole} />
          <AlertToastNotification onSelectRole={setActiveRole} />
          <SupportChatbot />
          
          {isAuthModalOpen && (
            <AuthModal 
              onClose={() => setIsAuthModalOpen(false)} 
              onLoginSuccess={(role) => setActiveRole(role)}
            />
          )}
          </div>
        </div>
          </TransportationProvider>
      </SmartMatchingProvider>
    </PriceAlertProvider>
    </LanguageProvider>
  );
}

