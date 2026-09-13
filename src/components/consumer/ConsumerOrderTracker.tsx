import React, { useState } from 'react';
import { 
  PackageCheck, 
  CheckCircle2, 
  Circle, 
  Clock, 
  MapPin, 
  Tractor, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  Download,
  Phone,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { ConsumerOrder } from './ConsumerTypes';

interface ConsumerOrderTrackerProps {
  orders: ConsumerOrder[];
  onViewTransaction?: (txHash: string) => void;
}

const ORDER_STEPS = [
  { id: 'CONFIRMED', label: 'Order Confirmed', description: 'Payment verified & digitally signed' },
  { id: 'FARMER_CONFIRMED', label: 'Farmer Confirmed', description: 'Farm cluster reserved fresh harvest lot' },
  { id: 'BEING_PREPARED', label: 'Being Prepared', description: 'Washed, graded & packed at farmgate packhouse' },
  { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', description: 'Cold chain vehicle en-route to local hub' },
  { id: 'DELIVERED', label: 'Delivered', description: 'Fresh produce reached customer doorstep' },
];

export const ConsumerOrderTracker: React.FC<ConsumerOrderTrackerProps> = ({
  orders,
  onViewTransaction,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [orderState, setOrderState] = useState<Record<string, number>>({
    'order-10243': 2, // 0: CONFIRMED, 1: FARMER_CONFIRMED, 2: BEING_PREPARED, 3: OUT_FOR_DELIVERY, 4: DELIVERED
  });

  const activeOrder = orders.find(o => o.id === selectedOrderId) || orders[0];
  if (!activeOrder) return null;

  const currentStepIdx = orderState[activeOrder.id] !== undefined ? orderState[activeOrder.id] : 2;

  const handleAdvanceStep = () => {
    setOrderState(prev => ({
      ...prev,
      [activeOrder.id]: Math.min((prev[activeOrder.id] || 2) + 1, 4),
    }));
  };

  const handleResetStep = () => {
    setOrderState(prev => ({
      ...prev,
      [activeOrder.id]: 0,
    }));
  };

  return (
    <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-3xl gradient-border-organic border-0 p-6 sm:p-8 shadow-sm space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-black tracking-wide uppercase flex items-center gap-1">
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Live Order Tracking</span>
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-950 mt-1">
            Order {activeOrder.orderNumber}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Directly linked with {activeOrder.farmerNetwork}
          </p>
        </div>

        {/* Order Selector if multiple */}
        {orders.length > 1 && (
          <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-2xl gradient-border-organic border-0 overflow-hidden shrink-0 max-w-[200px] sm:max-w-xs">
            <span className="text-xs font-bold text-slate-500 pl-2 whitespace-nowrap">Select Order:</span>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="bg-transparent border-none text-slate-900 text-sm font-black focus:outline-none w-full cursor-pointer pr-4"
            >
              {orders.map((ord) => (
                <option key={ord.id} value={ord.id}>
                  {ord.orderNumber} - {ord.productName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Order Card & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Product Summary Card */}
        <div className="lg:col-span-5 bg-slate-50 rounded-3xl p-6 gradient-border-organic border-0 space-y-5">
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <span className="text-5xl">{activeOrder.emoji}</span>
              <div>
                <h4 className="text-xl font-display font-black text-slate-900">
                  {activeOrder.productName}
                </h4>
                <p className="text-xs font-bold text-emerald-800">
                  {activeOrder.quantityKg} kg • ₹{activeOrder.pricePerKg}/kg
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
              ₹{activeOrder.totalAmount}
            </span>
          </div>

          {/* Delivery & Source Metadata */}
          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-2xl gradient-border-organic border-0 flex items-center justify-between">
              <span className="text-slate-500 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Expected Delivery</span>
              </span>
              <span className="font-black text-emerald-900 text-sm">
                {activeOrder.expectedDelivery}
              </span>
            </div>

            <div className="p-3 bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-2xl gradient-border-organic border-0 flex items-center justify-between">
              <span className="text-slate-500 font-bold flex items-center gap-1.5">
                <Tractor className="w-3.5 h-3.5 text-emerald-700" />
                <span>Sourcing Origin</span>
              </span>
              <span className="font-extrabold text-slate-800 truncate max-w-[180px]">
                {activeOrder.farmerNetwork}
              </span>
            </div>

            <div className="p-3 bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-2xl gradient-border-organic border-0 flex items-center justify-between">
              <span className="text-slate-500 font-bold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Delivery Address</span>
              </span>
              <span className="font-semibold text-slate-700 truncate max-w-[180px]">
                {activeOrder.deliveryAddress}
              </span>
            </div>
          </div>

          {/* Demonstration Simulation Controls */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
            <button
              onClick={handleAdvanceStep}
              className="flex-1 py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-black shadow-2xs flex items-center justify-center gap-1"
            >
              <span>Advance Step (Demo)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetStep}
              className="py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold"
            >
              Reset
            </button>
          </div>

        </div>

        {/* Right Column: Exact 5-Step Order Progress Timeline */}
        <div className="lg:col-span-7 bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-3xl p-6 border-2 border-slate-100 shadow-xs space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-base font-black text-slate-900">
              Live Fulfillment Status
            </h4>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
              Step {currentStepIdx + 1} of 5 Completed
            </span>
          </div>

          {/* Vertical Progress List */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {ORDER_STEPS.map((step, idx) => {
              const isCompleted = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;

              return (
                <div key={step.id} className="relative flex items-start gap-4">
                  {/* Step Icon Badge */}
                  <div 
                    className={`absolute -left-6 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      isCompleted
                        ? 'bg-emerald-700 text-white shadow-xs scale-110'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                    }`}
                  >
                    {isCompleted ? '✓' : '○'}
                  </div>

                  {/* Step Text Details */}
                  <div className={`space-y-0.5 ${isCurrent ? 'bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 -ml-2' : ''}`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-black ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.label}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.2 rounded-full bg-emerald-700 text-white text-[9px] font-black uppercase animate-pulse">
                          In Progress
                        </span>
                      )}
                    </div>
                    <p className={`text-xs ${isCompleted ? 'text-slate-600' : 'text-slate-400'}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expected Delivery Callout Box */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                  Expected Delivery
                </span>
                <span className="text-base font-display font-black text-emerald-300">
                  {activeOrder.expectedDelivery}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Payment Mode</span>
              <span className="text-xs font-bold text-white">{activeOrder.paymentMethod}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
