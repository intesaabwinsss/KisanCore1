import React from 'react';
import {
  Package,
  TrendingUp,
  Tag,
  Clock,
  Eye,
  Edit2,
  Trash2,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Truck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface FarmerProductItem {
  id: string;
  name: string;
  emoji: string;
  variety: string;
  availableQuantityKg: number;
  askingPricePerKg: number;
  currentMarketPricePerKg: number;
  activeOrdersCount: number;
  status: 'ACTIVE' | 'LOW_STOCK' | 'HARVEST_READY' | 'RESERVED';
  harvestDate?: string;
  grade?: 'A' | 'B' | 'Organic';
  image?: string;
}

interface ProductCardProps {
  product: FarmerProductItem;
  onEditProduct: (product: FarmerProductItem) => void;
  onViewOrders: (product: FarmerProductItem) => void;
  onRemoveProduct: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEditProduct,
  onViewOrders,
  onRemoveProduct,
}) => {
  const { language, tCrop, tUnit } = useLanguage();

  const getStatusBadge = (status: FarmerProductItem['status']) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-black border border-emerald-300">
            {language === 'hi' ? 'सक्रिय लिस्टिंग' : language === 'mr' ? 'सक्रिय सूची' : 'Active Listing'}
          </span>
        );
      case 'HARVEST_READY':
        return (
          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-300">
            {language === 'hi' ? 'कटाई हेतु तैयार' : language === 'mr' ? 'कापणीसाठी तयार' : 'Ready for Harvest'}
          </span>
        );
      case 'LOW_STOCK':
        return (
          <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 text-[10px] font-black border border-rose-300">
            {language === 'hi' ? 'कम स्टॉक' : language === 'mr' ? 'कमी साठा' : 'Low Stock'}
          </span>
        );
      case 'RESERVED':
        return (
          <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 text-[10px] font-black border border-blue-300">
            {language === 'hi' ? 'एस्क्रो आरक्षित' : language === 'mr' ? 'एस्क्रो आरक्षित' : 'Escrow Reserved'}
          </span>
        );
      default:
        return null;
    }
  };

  const spread = product.askingPricePerKg - product.currentMarketPricePerKg;

  return (
    <div
      id={`product-card-${product.id}`}
      className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-[2px] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between group"
    >
      <div>
        {/* Top bar with Icon, Name & Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 gradient-border-organic border-0 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform duration-300">
              {product.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-black text-slate-900 leading-tight tracking-tight">
                  {tCrop(product.name)}
                </h4>
                {product.grade && (
                  <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wider">
                    {language === 'hi' ? `ग्रेड ${product.grade}` : language === 'mr' ? `श्रेणी ${product.grade}` : `Grade ${product.grade}`}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium tracking-tight">{product.variety}</p>
            </div>
          </div>

          <div className="shrink-0">{getStatusBadge(product.status)}</div>
        </div>

        {/* Quantities and Asking Price */}
        <div className="grid grid-cols-2 gap-2 my-4 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              {language === 'hi' ? 'उपलब्ध मात्रा' : language === 'mr' ? 'उपलब्ध प्रमाण' : 'Available Quantity'}
            </span>
            <div className="text-base font-black text-slate-900 font-mono mt-0.5 tabular-nums tracking-tighter">
              {product.availableQuantityKg.toLocaleString('en-IN')}{' '}
              <span className="text-xs font-medium font-sans text-slate-500 tracking-normal">{tUnit('kg')}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium tabular-nums">
              ({(product.availableQuantityKg / 100).toFixed(1)} {language === 'hi' ? 'क्विंटल' : language === 'mr' ? 'क्विंटल' : 'Quintals'})
            </span>
          </div>

          <div className="border-l border-slate-200 pl-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              {language === 'hi' ? 'आपकी माँग कीमत' : language === 'mr' ? 'आपली मागणी किंमत' : 'Your Asking Price'}
            </span>
            <div className="text-base font-black text-emerald-800 font-mono mt-0.5 tabular-nums tracking-tighter">
              ₹{product.askingPricePerKg}
              <span className="text-xs font-medium font-sans text-slate-500 tracking-normal">/{tUnit('kg')}</span>
            </div>
            <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium tabular-nums">
              <span>{language === 'hi' ? 'बाज़ार:' : language === 'mr' ? 'बाजार:' : 'Market:'} ₹{product.currentMarketPricePerKg}/{tUnit('kg')}</span>
              {spread > 0 ? (
                <span className="text-emerald-800 font-bold">(+₹{spread})</span>
              ) : spread < 0 ? (
                <span className="text-rose-800 font-bold">(₹{spread})</span>
              ) : (
                <span className="text-slate-500">(=)</span>
              )}
            </div>
          </div>
        </div>

        {/* Active Orders Indicator */}
        <div className="flex items-center justify-between text-xs px-1 py-1 text-slate-600 font-medium">
          <span className="flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'hi' ? 'सक्रिय खरीदार ऑर्डर:' : language === 'mr' ? 'सक्रिय ग्राहक ऑर्डर्स:' : 'Active Buyer Orders:'}</span>
          </span>
          <span className="font-mono font-black text-blue-900 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200/70 tabular-nums">
            {product.activeOrdersCount} {language === 'hi' ? 'ऑर्डर' : language === 'mr' ? 'ऑर्डर्स' : (product.activeOrdersCount === 1 ? 'Order' : 'Orders')}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onViewOrders(product)}
          className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-[0.98] hover:shadow-md cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-emerald-400" />
          <span>{language === 'hi' ? 'ऑर्डर देखें' : language === 'mr' ? 'ऑर्डर्स पहा' : 'View Orders'}</span>
        </button>

        <button
          onClick={() => onEditProduct(product)}
          title={language === 'hi' ? 'उत्पाद मूल्य / मात्रा संपादित करें' : language === 'mr' ? 'उत्पादन किंमत / प्रमाण संपादित करा' : 'Edit Product Price / Quantity'}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 gradient-border-organic border-0 transition-all active:scale-[0.98] cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onRemoveProduct(product.id)}
          title={language === 'hi' ? 'उत्पाद हटाएं' : language === 'mr' ? 'उत्पादन काढा' : 'Remove Product'}
          className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 gradient-border-organic border-0 transition-all active:scale-[0.98] cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
