import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  QrCode, 
  CreditCard, 
  Wallet, 
  Smartphone, 
  CheckCircle2, 
  Sparkles, 
  Truck, 
  ArrowRight,
  KeyRound,
  AlertTriangle,
  FileCheck,
  ShoppingCart
} from 'lucide-react';
import { ConsumerCartItem, ConsumerOrder, ConsumerTransactionRecord } from './ConsumerTypes';

interface ConsumerCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: ConsumerCartItem[];
  deliveryLocation: string;
  onOrderSuccess: (order: ConsumerOrder, transaction: ConsumerTransactionRecord) => void;
}

export const ConsumerCheckoutModal: React.FC<ConsumerCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  deliveryLocation,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<'ORDER_SUMMARY' | 'PAYMENT_METHOD' | 'OTP_VERIFY' | 'PROCESSING' | 'SUCCESS'>('ORDER_SUMMARY');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'wallet' | 'card'>('upi');
  const [upiId, setUpiId] = useState('ananya@okhdfcbank');
  const [otpValue, setOtpValue] = useState('123456');
  const [otpError, setOtpError] = useState('');
  const [fraudScore, setFraudScore] = useState('0.002% (Safe)');

  useEffect(() => {
    if (isOpen) {
      setStep('ORDER_SUMMARY');
      setOtpValue('123456');
      setOtpError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const produceSubtotal = cartItems.reduce(
    (acc, item) => acc + item.product.kisanDirectPricePerKg * item.quantityKg,
    0
  );
  const transportFee = produceSubtotal > 0 ? 15 : 0;
  const platformFee = 5;
  const grandTotal = produceSubtotal + transportFee;

  const primaryItem = cartItems[0] || {
    product: { name: 'Tomatoes', emoji: '🍅', sourceNetwork: 'Local Farmer Network', kisanDirectPricePerKg: 27 },
    quantityKg: 5
  };

  const handleStartVerification = () => {
    setStep('OTP_VERIFY');
  };

  const handleVerifyOtpAndPay = () => {
    if (otpValue.length < 4) {
      setOtpError('Please enter a valid 6-digit verification code.');
      return;
    }
    setOtpError('');
    setStep('PROCESSING');

    setTimeout(() => {
      const orderNum = `#${Math.floor(10000 + Math.random() * 90000)}`;
      const txId = `TX${orderNum.replace('#', '')}`;
      const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      const newOrder: ConsumerOrder = {
        id: `order-${orderNum}`,
        orderNumber: orderNum,
        txHash: `0x${randomHex}`,
        productName: cartItems.length === 1 
          ? primaryItem.product.name 
          : `${primaryItem.product.name} + ${cartItems.length - 1} more items`,
        emoji: primaryItem.product.emoji,
        quantityKg: cartItems.reduce((a, c) => a + c.quantityKg, 0),
        pricePerKg: primaryItem.product.kisanDirectPricePerKg,
        subtotal: produceSubtotal,
        transportFee,
        platformFee,
        totalAmount: grandTotal,
        farmerNetwork: primaryItem.product.sourceNetwork,
        orderTimestamp: 'Just now',
        expectedDelivery: 'Today, 6:30 PM',
        statusStep: 'CONFIRMED',
        paymentMethod: paymentMethod === 'upi' ? `UPI (${upiId})` : paymentMethod === 'card' ? 'Tokenized Card' : 'Escrow Wallet',
        paymentStatus: 'COMPLETED',
        deliveryAddress: deliveryLocation || 'Flat 402, Green Meadows, Baner, Pune',
      };

      const newTx: ConsumerTransactionRecord = {
        txId,
        orderNumber: orderNum,
        productTitle: `${primaryItem.product.name} — ${newOrder.quantityKg} kg`,
        emoji: primaryItem.product.emoji,
        quantityFormatted: `${newOrder.quantityKg} kg`,
        farmerNetwork: primaryItem.product.sourceNetwork,
        productValue: produceSubtotal,
        transportationFee: transportFee,
        platformFee: platformFee,
        totalPaid: grandTotal,
        savingsVsRetail: Math.round(produceSubtotal * 0.18),
        paymentMethod: newOrder.paymentMethod,
        status: 'COMPLETED',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
        blockHash: `0x${randomHex}`,
        securityCipher: 'AES-256-GCM + SHA-256 Chained',
        auditVerified: true,
      };

      setStep('SUCCESS');
      setTimeout(() => {
        onOrderSuccess(newOrder, newTx);
      }, 1500);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl gradient-border-organic border-0 relative my-8">
        
        {/* Close Button */}
        {step !== 'PROCESSING' && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-700 flex items-center justify-center text-white">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-display font-black text-slate-900">
              {step === 'ORDER_SUMMARY' && 'Review Your Order'}
              {step === 'PAYMENT_METHOD' && 'Secure Digital Checkout'}
              {step === 'OTP_VERIFY' && 'Bank 2FA Authorization'}
              {step === 'PROCESSING' && 'Settling Direct Escrow...'}
              {step === 'SUCCESS' && 'Payment Verified & Confirmed!'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Zero Raw Card Data Stored • Direct Farmer Escrow
            </p>
          </div>
        </div>

        {step === 'ORDER_SUMMARY' && (
          <div className="py-5 space-y-5">
            <div className="bg-slate-50 rounded-2xl gradient-border-organic border-0 p-4 space-y-3">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-emerald-700" />
                Order Items ({cartItems.length})
              </h4>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                {cartItems.map((item, idx) => (
                  <div key={item.product.id + idx} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{item.product.emoji}</div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{item.product.name}</div>
                        <div className="text-[10px] text-slate-500">{item.product.sourceLocation}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-slate-900">₹{item.product.kisanDirectPricePerKg * item.quantityKg}</div>
                      <div className="text-[10px] text-slate-500">{item.quantityKg} {item.product.unit} × ₹{item.product.kisanDirectPricePerKg}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white gradient-border-organic border-0 shadow-sm">
              <div className="space-y-2 text-xs text-slate-600 border-b border-slate-100 pb-3 mb-3">
                <div className="flex justify-between">
                  <span>Farmgate Produce Subtotal</span>
                  <span className="font-bold text-slate-900">₹{produceSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transport Logistics</span>
                  <span className="font-bold text-slate-900">₹{transportFee}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-black text-slate-900">Grand Total</span>
                <span className="text-2xl font-display font-black text-emerald-700">₹{grandTotal}</span>
              </div>
            </div>

            <button
              onClick={() => setStep('PAYMENT_METHOD')}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <span>Confirm Order & Proceed to Pay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 1: PAYMENT METHOD SELECTION */}
        {step === 'PAYMENT_METHOD' && (
          <div className="py-5 space-y-5">
            {/* Order Summary Pill */}
            <div className="p-4 rounded-2xl bg-slate-50 gradient-border-organic border-0 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-bold block">Cart Total Payable</span>
                <span className="text-2xl font-display font-black text-slate-900">₹{grandTotal}</span>
              </div>
              <div className="text-right text-xs">
                <span className="text-slate-500 block">{cartItems.length} items</span>
                <span className="text-emerald-800 font-extrabold">Delivery: Today 6:30 PM</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                Select Secure Payment Method
              </span>

              {/* UPI Option */}
              <label 
                className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'upi' ? 'border-emerald-600 bg-emerald-50/60' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="payMethod" 
                    checked={paymentMethod === 'upi'} 
                    onChange={() => setPaymentMethod('upi')}
                    className="accent-emerald-700" 
                  />
                  <div>
                    <span className="text-sm font-black text-slate-900 block flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-emerald-700" />
                      <span>Instant UPI / QR (Google Pay, PhonePe)</span>
                    </span>
                    <span className="text-[11px] text-slate-500">Fast zero-fee direct settlement</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">Instant</span>
              </label>

              {paymentMethod === 'upi' && (
                <div className="p-3 bg-white rounded-xl border border-emerald-300 space-y-2 text-xs animate-in fade-in">
                  <label className="text-[11px] font-bold text-slate-700 block">Enter UPI ID / VPA</label>
                  <input 
                    type="text" 
                    value={upiId} 
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. mobile@upi"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-emerald-700"
                  />
                </div>
              )}

              {/* Digital Wallet Option */}
              <label 
                className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'wallet' ? 'border-emerald-600 bg-emerald-50/60' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="payMethod" 
                    checked={paymentMethod === 'wallet'} 
                    onChange={() => setPaymentMethod('wallet')}
                    className="accent-emerald-700" 
                  />
                  <div>
                    <span className="text-sm font-black text-slate-900 block flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-sky-600" />
                      <span>KisanDirect Escrow Wallet</span>
                    </span>
                    <span className="text-[11px] text-slate-500">Available Balance: ₹2,450.00</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-900">1-Click</span>
              </label>

              {/* Card Gateway Option */}
              <label 
                className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'card' ? 'border-emerald-600 bg-emerald-50/60' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="payMethod" 
                    checked={paymentMethod === 'card'} 
                    onChange={() => setPaymentMethod('card')}
                    className="accent-emerald-700" 
                  />
                  <div>
                    <span className="text-sm font-black text-slate-900 block flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-purple-600" />
                      <span>Credit / Debit Card (Tokenized Gateway)</span>
                    </span>
                    <span className="text-[11px] text-slate-500">RuPay, Visa, MasterCard supported</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900">Encrypted</span>
              </label>
            </div>

            {/* Proceed Action */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep('ORDER_SUMMARY')}
                className="flex-1 py-3.5 rounded-2xl gradient-border-organic border-0 text-sm font-bold text-slate-700 hover:bg-slate-100"
              >
                Back
              </button>
              <button
                id="confirm-pay-proceed-btn"
                onClick={handleStartVerification}
                className="flex-[2] py-3.5 px-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2"
              >
                <span>Authorize Payment of ₹{grandTotal}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: BANK 2FA OTP VERIFICATION */}
        {step === 'OTP_VERIFY' && (
          <div className="py-5 space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <KeyRound className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-lg font-black text-slate-900">Bank OTP Verification</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Enter the 6-digit security code sent to your registered mobile number for ₹{grandTotal} authorization.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl gradient-border-organic border-0 max-w-xs mx-auto space-y-2">
              <input
                type="text"
                maxLength={6}
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                className="w-full text-center text-2xl tracking-widest font-mono font-black py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-emerald-700"
                placeholder="123456"
              />
              <span className="text-[10px] text-slate-400 block font-medium">Demo Default: 123456</span>
              {otpError && <p className="text-xs text-rose-600 font-bold">{otpError}</p>}
            </div>

            {/* Fraud Risk Indicator */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-950 font-bold max-w-sm mx-auto">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>AI Fraud Risk Score:</span>
              </span>
              <span className="text-emerald-800">{fraudScore}</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setStep('PAYMENT_METHOD')}
                className="flex-1 py-3 rounded-xl gradient-border-organic border-0 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Back
              </button>
              <button
                onClick={handleVerifyOtpAndPay}
                className="flex-2 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black shadow-xs flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Verify & Confirm Order</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PROCESSING ESCROW */}
        {step === 'PROCESSING' && (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-emerald-700 animate-spin mx-auto"></div>
            <h4 className="text-lg font-black text-slate-900">Recording Transaction to Ledger...</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Allocating ₹{produceSubtotal} to local farmer escrow and generating SHA-256 block hash.
            </p>
          </div>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION */}
        {step === 'SUCCESS' && (
          <div className="py-10 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <h4 className="text-xl font-display font-black text-emerald-950">Payment Successful!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Your farmgate produce has been booked. Redirecting to live order tracker...
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
