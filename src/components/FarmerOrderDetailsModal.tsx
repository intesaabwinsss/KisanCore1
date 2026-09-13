import React, { useState } from 'react';
import {
  X,
  Package,
  Building2,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  Phone,
  QrCode,
  Download,
  DollarSign,
  Lock,
} from 'lucide-react';
import { FarmerOrderItem } from './OrderTable';

interface FarmerOrderDetailsModalProps {
  order: FarmerOrderItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDispatch?: (orderId: string) => void;
}

export const FarmerOrderDetailsModal: React.FC<FarmerOrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onConfirmDispatch,
}) => {
  const [isDispatched, setIsDispatched] = useState(false);

  if (!isOpen || !order) return null;

  const handleDispatch = () => {
    setIsDispatched(true);
    if (onConfirmDispatch) {
      onConfirmDispatch(order.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white gradient-border-organic border-0 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-3xl shrink-0">
              {order.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900">
                  Order Details: {order.orderNumber}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
                  Direct B2B Deal
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Contract signed on {order.orderDate}
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Produce & Price Strip */}
          <div className="p-4 rounded-2xl bg-slate-50 gradient-border-organic border-0 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Product</span>
              <span className="font-extrabold text-slate-900 text-sm">{order.productName}</span>
              <div className="text-slate-500 text-[11px]">{order.variety}</div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Contract Quantity</span>
              <span className="font-black text-slate-900 text-sm font-mono">{order.quantityKg} kg</span>
              <div className="text-slate-500 text-[11px]">{(order.quantityKg / 100).toFixed(1)} Quintals</div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Contract Rate</span>
              <span className="font-black text-emerald-800 text-sm font-mono">₹{order.ratePerKg}/kg</span>
              <div className="text-slate-500 text-[11px]">Fixed Direct Price</div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Net Payout</span>
              <span className="font-black text-emerald-800 text-base font-mono">
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </span>
              <div className="text-emerald-700 font-bold text-[10px]">Zero Commission</div>
            </div>
          </div>

          {/* Direct Buyer Information */}
          <div className="p-4 rounded-2xl bg-white gradient-border-organic border-0 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-700" />
                <span>Direct Buyer Profile</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-bold text-[11px]">
                {order.buyerType}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600 bg-slate-50/70 p-3 rounded-xl">
              <div className="space-y-1">
                <div className="font-bold text-slate-900">{order.buyerName}</div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Delivery Hub: {order.buyerLocation}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Target Delivery: {order.deliveryDate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Escrow Status: 100% Funds Deposited</span>
                </div>
              </div>
            </div>
          </div>

          {/* QR Dispatch Pass */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white p-2 rounded-xl shrink-0 flex items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-900" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Digital Gate Dispatch QR</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Scan at pickup to trigger instant UPI bank release to farmer account.
                </p>
                <div className="text-emerald-400 font-mono text-[10px] mt-1">
                  Auth Hash: {order.txHash || '0x8f2a9c14e712ba6d9410ef39b207ca91'}
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(`Gate Pass for ${order.orderNumber} downloaded successfully!`)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 border border-slate-700 shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download Pass</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-bold transition-colors"
          >
            Close
          </button>

          <button
            onClick={handleDispatch}
            disabled={isDispatched || order.paymentStatus === 'DISPATCHED'}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Truck className="w-4 h-4" />
            <span>
              {isDispatched || order.paymentStatus === 'DISPATCHED'
                ? 'Harvest Dispatched ✓'
                : 'Mark Produce as Dispatched'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
