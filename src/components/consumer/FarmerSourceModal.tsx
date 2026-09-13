import React from 'react';
import { 
  X, 
  MapPin, 
  Tractor, 
  Clock, 
  ShieldCheck, 
  Leaf, 
  QrCode, 
  CheckCircle2, 
  Sparkles,
  Truck,
  Building2,
  Lock
} from 'lucide-react';
import { ConsumerProduct } from './ConsumerTypes';

interface FarmerSourceModalProps {
  product: ConsumerProduct | null;
  onClose: () => void;
  onAddToCart?: (product: ConsumerProduct) => void;
}

export const FarmerSourceModal: React.FC<FarmerSourceModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl gradient-border-organic border-0 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="text-4xl p-2 rounded-2xl bg-emerald-50 border border-emerald-200">
            {product.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-display font-black text-slate-900">
                {product.name} Sourcing Transparency
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Verified Farmgate Provenance & Safe Direct Sourcing
            </p>
          </div>
        </div>

        {/* Origin & Network Details */}
        <div className="py-4 space-y-4">
          
          {/* Main Sourcing Card */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-emerald-950 flex items-center gap-1.5">
                <Tractor className="w-4 h-4 text-emerald-800" />
                <span>{product.sourceNetwork}</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-black">
                {product.grade}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-900 font-semibold">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{product.sourceLocation} • {product.distanceKm} km from delivery hub</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
              <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{product.harvestTimeAgo}</span>
            </div>
          </div>

          {/* Privacy & Safety Note */}
          <div className="p-3.5 rounded-2xl bg-slate-50 gradient-border-organic border-0 flex items-start gap-2.5 text-xs text-slate-600">
            <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">Producer Privacy & Fair Trade Protection</span>
              <span>
                Individual smallholder KYC is verified through Government FPO registers while personal contact details are kept private to protect farmers from predatory middlemen calls.
              </span>
            </div>
          </div>

          {/* Sourcing Cost Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Transparent Farmgate Breakdown (per {product.unit})
            </h4>

            <div className="divide-y divide-slate-100 bg-slate-50 rounded-2xl p-4 gradient-border-organic border-0 text-xs">
              <div className="flex justify-between py-1.5 font-bold text-emerald-900">
                <span className="flex items-center gap-1.5">
                  <Tractor className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Farmer Share (Direct Payout)</span>
                </span>
                <span className="text-sm font-black">₹{product.farmerSharePerKg}</span>
              </div>

              <div className="flex justify-between py-1.5 text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-sky-600" />
                  <span>Transportation & Cold Ingress</span>
                </span>
                <span className="font-bold text-slate-800">₹{product.transportSharePerKg}</span>
              </div>

              <div className="flex justify-between py-1.5 text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Platform Operations & AI Grading</span>
                </span>
                <span className="font-bold text-slate-800">₹{product.platformSharePerKg}</span>
              </div>

              <div className="flex justify-between pt-2.5 font-black text-slate-900 text-sm border-t border-slate-200">
                <span>Total Consumer Price</span>
                <span className="text-emerald-900 text-base">₹{product.kisanDirectPricePerKg}/{product.unit}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
          {onAddToCart && (
            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs flex items-center gap-2"
            >
              <span>Add to Cart (₹{product.kisanDirectPricePerKg})</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
