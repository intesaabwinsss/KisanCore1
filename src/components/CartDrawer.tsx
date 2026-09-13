import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  ArrowRight,
  Coins
} from 'lucide-react';
import { CartItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (produceId: string, delta: number) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onClearCart,
}) => {
  const { language, t, tCrop, tUnit } = useLanguage();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.produce.pricePerKg * item.quantityKg, 0);
  // Option A: 2.0% Buyer Platform Facilitation & Escrow Fee (0% deducted from farmers)
  const platformFee = Math.round(subtotal * 0.02);
  const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const grandTotal = subtotal + platformFee + deliveryFee;

  const handleCheckout = () => {
    const generatedId = `KM-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);
    setOrderPlaced(true);
  };

  const handleFinish = () => {
    onClearCart();
    setOrderPlaced(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">{t('cart')}</h2>
            <span className="text-[10px] uppercase tracking-widest bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
              {cartItems.length} {language === 'hi' ? 'लॉट' : language === 'mr' ? 'लॉट' : 'Lots'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all active:scale-[0.98]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {orderPlaced ? (
          /* Order Confirmation Screen */
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-slate-900">
                {language === 'hi' ? 'ऑर्डर एस्क्रो में सुरक्षित!' : language === 'mr' ? 'ऑर्डर एस्क्रोमध्ये सुरक्षित!' : 'Order Secured in Escrow!'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'hi' ? 'ऑर्डर आईडी:' : language === 'mr' ? 'ऑर्डर आयडी:' : 'Order ID:'} <span className="font-mono font-bold text-emerald-800">{orderId}</span>
              </p>
            </div>

            {/* Transparent Payout & Fee Ledger Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 text-left text-xs gradient-border-organic border-0 w-full space-y-2">
              <div className="font-bold text-slate-900 pb-1 border-b border-slate-200 flex items-center justify-between">
                <span>{t('paymentBreakdown')}</span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {language === 'hi' ? 'विकल्प A मॉडल' : language === 'mr' ? 'पर्याय A मॉडेल' : 'Option A Model'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{language === 'hi' ? 'किसान को सीधा भुगतान (100%):' : language === 'mr' ? 'शेतकऱ्याला थेट मोबदला (100%):' : 'Direct Farmer Payout (100%):'}</span>
                <span className="font-bold text-slate-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{language === 'hi' ? 'किसान से काटी गई कमीशन:' : language === 'mr' ? 'शेतकऱ्याकडून कापलेले कमिशन:' : 'Farmer Commission Deducted:'}</span>
                <span className="font-bold text-emerald-700">{language === 'hi' ? '₹0 (0% निःशुल्क)' : language === 'mr' ? '₹0 (0% मोफत)' : '₹0 (0% Free)'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{language === 'hi' ? 'क्रेता सुविधा शुल्क (2% एस्क्रो व गुणवत्ता):' : language === 'mr' ? 'खरेदीदार सुविधा शुल्क (2% एस्क्रो व प्रतवारी):' : 'Buyer Platform Fee (2% Facilitation & Escrow):'}</span>
                <span className="font-bold text-slate-900">₹{platformFee}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{language === 'hi' ? 'कोल्ड-चेन परिवहन:' : language === 'mr' ? 'कोल्ड-चेन वाहतूक:' : 'Cold-Chain Transit:'}</span>
                <span className="font-bold text-slate-900">{deliveryFee === 0 ? (language === 'hi' ? 'निःशुल्क' : language === 'mr' ? 'मोफत' : 'Free') : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between font-extrabold text-slate-900 pt-1.5 border-t border-slate-200 text-sm">
                <span>{language === 'hi' ? 'कुल एस्क्रो जमा:' : language === 'mr' ? 'एकूण एस्क्रो जमा:' : 'Total Escrow Deposited:'}</span>
                <span className="text-emerald-800 font-mono">₹{grandTotal}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 text-left text-xs text-emerald-950 space-y-2 border border-emerald-200 w-full">
              <div className="font-bold flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-700" />
                {language === 'hi' ? 'रेफ्रिजरेटेड कोल्ड वाहन रवाना' : language === 'mr' ? 'शीतकरण वाहन रवाना' : 'Reefer Cold Transit Dispatched'}
              </div>
              <p className="text-[11px] text-emerald-800/90 leading-relaxed">
                {language === 'hi' 
                  ? `आपकी फसल किसान पैकहाउस से आवंटित कर दी गई है। 100% फसल मूल्य (₹${subtotal}) एस्क्रो में सुरक्षित है और माल की भौतिक जांच के बाद सीधे किसान के खाते में भेज दिया जाएगा।`
                  : language === 'mr'
                  ? `आपला शेतीमाल शेतकरी पॅकहाऊसमधून रवाना करण्यात आला आहे. १००% मालाचे मूल्य (₹${subtotal}) एस्क्रोमध्ये सुरक्षित असून पोहोच पडताळणीनंतर थेट शेतकऱ्याच्या बँक खात्यात जमा केले जाईल.`
                  : `Your produce has been allocated from the farmer packhouse. 100% of the produce value (₹${subtotal}) is held in escrow and released directly to the farmer bank account upon physical arrival verification.`}
              </p>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
            >
              {language === 'hi' ? 'खरीदारी जारी रखें' : language === 'mr' ? 'खरेदी सुरू ठेवा' : 'Continue Sourcing'}
            </button>
          </div>
        ) : (
          /* Normal Cart Contents */
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 text-center">
                  <ShoppingBag className="w-12 h-12 stroke-1 text-slate-300" />
                  <p className="text-xs">{language === 'hi' ? 'आपकी कार्ट खाली है' : language === 'mr' ? 'आपली कार्ट रिकामी आहे' : 'Your procurement cart is empty'}</p>
                  <p className="text-[11px] text-slate-400">
                    {language === 'hi' ? 'रिटेल या बी2बी पोर्टल में खेत के ताज़े लॉट देखें' : language === 'mr' ? 'किरकोळ किंवा बी2बी पोर्टलमध्ये ताजे शेतीमाल पहा' : 'Browse farm-fresh lots in the Retail or B2B Portal'}
                  </p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.produce.id}
                    className="p-3.5 rounded-2xl bg-slate-50 gradient-border-organic border-0 flex items-center justify-between gap-3"
                  >
                    <img
                      src={item.produce.image}
                      alt={item.produce.title}
                      className="w-14 h-14 rounded-xl object-cover gradient-border-organic border-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {tCrop(item.produce.cropName)} {item.produce.variety && `(${item.produce.variety})`}
                      </h4>
                      <div className="text-[11px] text-slate-500">
                        ₹{item.produce.pricePerKg}{tUnit('/kg')} • {language === 'hi' ? 'लॉट सं.' : language === 'mr' ? 'लॉट क्र.' : 'Lot #'} {item.produce.lotNumber}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-semibold">
                        {language === 'hi' ? 'किसान:' : language === 'mr' ? 'शेतकरी:' : 'Farmer:'} {item.produce.farmerName} {language === 'hi' ? '(100% खेत भाव)' : language === 'mr' ? '(100% शेत भाव)' : '(100% Farmgate)'}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <div className="text-xs font-bold text-slate-900">
                        ₹{item.produce.pricePerKg * item.quantityKg}
                      </div>
                      <div className="flex items-center gap-1 bg-white gradient-border-organic border-0 rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQty(item.produce.id, -1)}
                          className="w-5 h-5 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="text-[11px] font-bold px-1 text-slate-800">
                          {item.quantityKg}{tUnit('kg')}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.produce.id, 1)}
                          className="w-5 h-5 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer & Checkout */}
            {cartItems.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-3 shrink-0">
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>{language === 'hi' ? 'उपज का मूल्य (100% किसान को):' : language === 'mr' ? 'मालाचे मूल्य (100% शेतकऱ्याला):' : 'Produce Value (100% to Farmer):'}</span>
                    <span className="font-semibold text-slate-900">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-emerald-700 font-semibold">{language === 'hi' ? 'किसान से काटी गई कमीशन:' : language === 'mr' ? 'शेतकऱ्याकडून कापलेले कमिशन:' : 'Farmer Commission Deducted:'}</span>
                    <span className="font-bold text-emerald-700">{language === 'hi' ? '₹0 (0% निःशुल्क)' : language === 'mr' ? '₹0 (0% मोफत)' : '₹0 (0% Cut)'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <span>{language === 'hi' ? 'प्लेटफॉर्म सुविधा शुल्क (2.0%):' : language === 'mr' ? 'प्लॅटफॉर्म सुविधा शुल्क (2.0%):' : 'Platform Facilitation Fee (2.0%):'}</span>
                      <span className="text-[10px] text-slate-400 font-medium">({language === 'hi' ? 'AI जांच + एस्क्रो' : language === 'mr' ? 'AI तपासणी + एस्क्रो' : 'AI Assay + Escrow'})</span>
                    </span>
                    <span className="font-semibold text-slate-900">₹{platformFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'hi' ? 'कोल्ड-चेन परिवहन:' : language === 'mr' ? 'कोल्ड-चेन वाहतूक:' : 'Cold-Chain Transit:'}</span>
                    <span>{deliveryFee === 0 ? <strong className="text-emerald-700">{language === 'hi' ? 'निःशुल्क' : language === 'mr' ? 'मोफत' : 'Free'}</strong> : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-slate-100">
                    <span>{language === 'hi' ? 'कुल देय एस्क्रो राशि:' : language === 'mr' ? 'एकूण देय एस्क्रो रक्कम:' : 'Total Escrow Payable:'}</span>
                    <span className="text-emerald-800 font-extrabold font-mono">₹{grandTotal}</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-[11px] text-blue-900 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-blue-600 shrink-0" />
                  <span><strong>{language === 'hi' ? 'उचित व्यापार मॉडल:' : language === 'mr' ? 'रास्त व्यापार मॉडेल:' : 'Fair-Trade Model:'}</strong> {language === 'hi' ? 'किसानों पर 0% कमीशन। 2% खरीदार शुल्क तत्काल UPI एस्क्रो और प्रयोगशाला जांच को निधि देता है।' : language === 'mr' ? 'शेतकऱ्यांवर 0% कमिशन. 2% खरेदीदार शुल्क तात्काळ UPI एस्क्रो व गुणवत्ता तपासणीला निधी पुरवते.' : '0% commission on farmers. 2% buyer facilitation fee funds instant UPI escrow & lab assay.'}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-[0_4px_14px_rgb(4,120,87,0.2)] hover:shadow-[0_6px_20px_rgb(4,120,87,0.3)] hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{language === 'hi' ? 'सुरक्षित भुगतान चेकआउट' : language === 'mr' ? 'सुरक्षित चेकआउट' : 'Secure Checkout'}</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
