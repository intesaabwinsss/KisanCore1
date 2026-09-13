import React from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  Tractor
} from 'lucide-react';
import { ConsumerCartItem, ConsumerProduct } from './ConsumerTypes';

interface ConsumerCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: ConsumerCartItem[];
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const ConsumerCartDrawer: React.FC<ConsumerCartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const produceSubtotal = cartItems.reduce(
    (acc, item) => acc + item.product.kisanDirectPricePerKg * item.quantityKg,
    0
  );

  const traditionalRetailSubtotal = cartItems.reduce(
    (acc, item) => acc + item.product.traditionalRetailPricePerKg * item.quantityKg,
    0
  );

  const totalFarmerPayout = cartItems.reduce(
    (acc, item) => acc + item.product.farmerSharePerKg * item.quantityKg,
    0
  );

  // Transportation fee is calculated dynamically (₹15 standard local delivery or ₹0 if cart >= ₹300)
  const transportFee = produceSubtotal > 0 ? 15 : 0;
  const grandTotal = produceSubtotal + transportFee;
  const consumerSavings = traditionalRetailSubtotal - produceSubtotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-display font-black text-slate-900">Your Cart</h3>
                <p className="text-xs text-slate-500 font-medium">Direct Farmgate Produce</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-3xl">
                  🛒
                </div>
                <h4 className="text-base font-bold text-slate-800">Your cart is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explore fresh farm produce, enjoy lower consumer prices, and support local farmers directly.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => {
                  const itemTotal = item.product.kisanDirectPricePerKg * item.quantityKg;
                  const itemFarmerShare = item.product.farmerSharePerKg * item.quantityKg;

                  return (
                    <div 
                      key={item.product.id}
                      className="p-4 rounded-2xl bg-slate-50 gradient-border-organic border-0 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{item.product.emoji}</span>
                          <div>
                            <h4 className="text-sm font-black text-slate-900">{item.product.name}</h4>
                            <span className="text-xs text-slate-500 font-medium">
                              {item.quantityKg} {item.product.unit} × ₹{item.product.kisanDirectPricePerKg}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-base font-display font-black text-slate-900">
                            ₹{itemTotal}
                          </span>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-slate-400 hover:text-rose-600 ml-2 text-xs"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Quantity Controls & Farmer Payout Tag */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Tractor className="w-3 h-3 text-emerald-700" />
                          <span>Farmer gets ₹{itemFarmerShare}</span>
                        </span>

                        <div className="flex items-center gap-2 bg-white p-1 rounded-xl gradient-border-organic border-0 shadow-2xs">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantityKg - 1))}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-extrabold text-slate-900">
                            {item.quantityKg}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantityKg + 1)}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer with Calculations and Proceed to Payment */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-4">
              
              {/* Savings & Farmer Payout Banner */}
              <div className="p-3 rounded-xl bg-emerald-100/80 border border-emerald-200 flex items-center justify-between text-xs font-bold text-emerald-950">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Direct Farmer Payout:</span>
                </span>
                <span className="text-emerald-900 font-extrabold text-sm">₹{totalFarmerPayout} (85%+)</span>
              </div>

              {/* Cost Summary Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Produce Value</span>
                  <span className="font-bold text-slate-800">₹{produceSubtotal}</span>
                </div>

                <div className="flex justify-between text-slate-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-sky-600" />
                    <span>Transportation</span>
                  </span>
                  <span className="font-bold text-slate-800">₹{transportFee}</span>
                </div>

                <div className="flex justify-between text-emerald-800 font-bold">
                  <span>Your Savings vs Retail</span>
                  <span>-₹{consumerSavings}</span>
                </div>

                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-950">
                  <span>Total</span>
                  <span className="text-xl font-display font-black text-emerald-950">₹{grandTotal}</span>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                id="cart-proceed-checkout-btn"
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit Encrypted • No raw card data stored</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
