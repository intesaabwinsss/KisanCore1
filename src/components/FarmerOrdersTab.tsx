import React, { useState } from 'react';
import { 
  ShoppingBag, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  MapPin, 
  Phone, 
  Building, 
  FileText, 
  TrendingUp, 
  ChevronRight, 
  Coins, 
  X,
  MessageSquare,
  ArrowUpRight
} from 'lucide-react';
import { FarmerOrder } from '../types';

interface FarmerOrdersTabProps {
  orders: FarmerOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: FarmerOrder['status'], escrowStatus?: FarmerOrder['escrowStatus']) => void;
}

export const FarmerOrdersTab: React.FC<FarmerOrdersTabProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<FarmerOrder | null>(null);
  const [negotiatingOrder, setNegotiatingOrder] = useState<FarmerOrder | null>(null);
  const [counterPrice, setCounterPrice] = useState<number>(0);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const filteredOrders = orders.filter((ord) => {
    if (filterStatus === 'all') return true;
    return ord.status === filterStatus;
  });

  const handleAction = (orderId: string, status: FarmerOrder['status'], escrow?: FarmerOrder['escrowStatus'], msg?: string) => {
    onUpdateOrderStatus(orderId, status, escrow);
    if (msg) {
      setActionNotice(msg);
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  const handleCounterOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (negotiatingOrder) {
      setActionNotice(`Counter-offer of ₹${counterPrice}/kg sent to ${negotiatingOrder.buyerCompany}.`);
      setNegotiatingOrder(null);
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Filter Bar */}
      <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                Incoming Buyer Orders & Contracts
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                {orders.length} Total Orders
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct procurement contracts from verified B2B buyers, retailers, and food processors with 100% Escrow security
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'pending', label: 'Pending Approval' },
              { id: 'accepted', label: 'Ready to Dispatch' },
              { id: 'dispatched', label: 'In Transit' },
              { id: 'delivered', label: 'Delivered / Completed' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterStatus === tab.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4 pt-2">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl p-6">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-700">No orders in this category</div>
              <p className="text-xs text-slate-400 mt-1">
                When buyers place orders for your listed lots, they will appear here with instant escrow protection.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusColors = {
                pending: 'bg-amber-100 text-amber-800 border-amber-200',
                accepted: 'bg-blue-100 text-blue-800 border-blue-200',
                dispatched: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                rejected: 'bg-rose-100 text-rose-800 border-rose-200',
              };

              const escrowColors = {
                locked_in_escrow: 'bg-emerald-50 text-emerald-900 border-emerald-300',
                released_to_bank: 'bg-blue-50 text-blue-900 border-blue-300',
                refunded: 'bg-slate-100 text-slate-700 border-slate-300',
              };

              return (
                <div
                  key={order.id}
                  className="p-5 sm:p-6 rounded-2xl gradient-border-organic border-0 bg-white hover:border-emerald-300 transition-all shadow-xs space-y-4"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                        {order.cropName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">
                            {order.orderNumber}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-700">{order.buyerCompany}</span>
                          <span>• {order.buyerType}</span>
                        </div>
                      </div>
                    </div>

                    {/* Escrow Badge */}
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${escrowColors[order.escrowStatus]}`}>
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>
                          {order.escrowStatus === 'locked_in_escrow'
                            ? `₹${order.totalAmount.toLocaleString()} Escrow Secured`
                            : `₹${order.totalAmount.toLocaleString()} Released to UPI/Bank`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Crop Lot & Financials Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl text-xs">
                    <div>
                      <div className="text-slate-400 font-semibold">Produce Lot</div>
                      <div className="font-bold text-slate-900 text-sm mt-0.5">
                        {order.cropName}
                      </div>
                      <div className="text-[11px] text-slate-500">{order.variety}</div>
                    </div>

                    <div>
                      <div className="text-slate-400 font-semibold">Quantity & Rate</div>
                      <div className="font-bold text-slate-900 text-sm mt-0.5">
                        {order.quantityKg.toLocaleString()} kg
                      </div>
                      <div className="text-[11px] text-emerald-700 font-bold">
                        @ ₹{order.agreedPricePerKg}/kg
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 font-semibold">Total Order Value</div>
                      <div className="font-extrabold text-emerald-900 text-sm mt-0.5">
                        ₹{order.totalAmount.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-slate-500">0% Commission</div>
                    </div>

                    <div>
                      <div className="text-slate-400 font-semibold">Extra Profit vs APMC</div>
                      <div className="font-extrabold text-emerald-700 text-sm mt-0.5 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                        <span>+₹{order.extraEarnedVsMandi.toLocaleString()}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Saved ₹{order.commissionSaved.toLocaleString()} fee
                      </div>
                    </div>
                  </div>

                  {/* Delivery Location & Dates */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-md">{order.deliveryLocation}</span>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 text-[11px]">
                      <span>Ordered: <b>{order.orderDate}</b></span>
                      <span>Expected: <b>{order.expectedDeliveryDate}</b></span>
                    </div>
                  </div>

                  {/* Action Controls based on Order State */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedOrderForInvoice(order)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>View Invoice & Gate Pass</span>
                      </button>

                      <a
                        href={`tel:${order.buyerPhone}`}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>Contact Buyer</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => {
                              setNegotiatingOrder(order);
                              setCounterPrice(order.agreedPricePerKg + 2);
                            }}
                            className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
                          >
                            Counter-Offer
                          </button>
                          <button
                            onClick={() => handleAction(order.id, 'accepted', 'locked_in_escrow', `Order ${order.orderNumber} accepted! Buyer notified for packhouse pickup.`)}
                            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Accept Order (Lock Escrow)</span>
                          </button>
                        </>
                      )}

                      {order.status === 'accepted' && (
                        <button
                          onClick={() => handleAction(order.id, 'dispatched', 'locked_in_escrow', `Order ${order.orderNumber} marked as dispatched to logistics transit.`)}
                          className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <Truck className="w-4 h-4" />
                          <span>Dispatch Lot & Assign Truck</span>
                        </button>
                      )}

                      {order.status === 'dispatched' && (
                        <button
                          onClick={() => handleAction(order.id, 'delivered', 'released_to_bank', `Order ${order.orderNumber} delivered! ₹${order.totalAmount.toLocaleString()} released instantly to your bank.`)}
                          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <Coins className="w-4 h-4" />
                          <span>Confirm Delivery (Release ₹{order.totalAmount.toLocaleString()})</span>
                        </button>
                      )}

                      {(order.status === 'delivered' || order.status === 'completed') && (
                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>100% Escrow Payment Settled</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Invoice & Gate Pass Modal */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 gradient-border-organic border-0 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-slate-900">
                  Direct Mandi Tax Invoice & Gate Pass
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-slate-50 gradient-border-organic border-0">
                <div>
                  <div className="text-slate-400 font-semibold">Order Number:</div>
                  <div className="font-extrabold text-slate-900">{selectedOrderForInvoice.orderNumber}</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400 font-semibold">Invoice Date:</div>
                  <div className="font-bold text-slate-800">{selectedOrderForInvoice.orderDate}</div>
                </div>
              </div>

              <div className="space-y-2 border-y border-slate-200 py-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Buyer Entity:</span>
                  <span className="font-bold text-slate-900">{selectedOrderForInvoice.buyerCompany}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Crop Lot & Variety:</span>
                  <span className="font-bold text-slate-900">{selectedOrderForInvoice.cropName} ({selectedOrderForInvoice.variety})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Billed Quantity:</span>
                  <span className="font-bold text-slate-900">{selectedOrderForInvoice.quantityKg.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Agreed Unit Rate:</span>
                  <span className="font-bold text-slate-900">₹{selectedOrderForInvoice.agreedPricePerKg}/kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Platform Commission (0%):</span>
                  <span className="font-bold text-emerald-700">₹0.00</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-950 text-sm pt-2 border-t border-slate-200">
                  <span>Net Direct Farmer Credit:</span>
                  <span className="text-emerald-800 font-extrabold">₹{selectedOrderForInvoice.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 text-[11px] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified KisanMandi Direct Escrow Transaction</span>
                </div>
                <p className="text-slate-600">
                  Funds are protected under KisanMandi Escrow. Payment is automatically transferred to Farmer UPI/Bank account upon delivery receipt confirmation.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedOrderForInvoice(null)}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                >
                  Close Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Counter Offer Modal */}
      {negotiatingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-3xl max-w-md w-full p-6 space-y-4 gradient-border-organic border-0 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">
              Submit Counter-Offer to {negotiatingOrder.buyerCompany}
            </h3>
            <p className="text-xs text-slate-500">
              Current offer is ₹{negotiatingOrder.agreedPricePerKg}/kg. Enter your desired counter price.
            </p>

            <form onSubmit={handleCounterOffer} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Counter Rate (₹ per kg)
                </label>
                <input
                  type="number"
                  required
                  step="0.5"
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 text-sm font-bold border border-slate-300 rounded-xl focus:outline-emerald-600"
                />
              </div>

              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                <span>Total revised order value: </span>
                <span className="font-bold text-emerald-800">
                  ₹{(negotiatingOrder.quantityKg * counterPrice).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNegotiatingOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
                >
                  Send Counter Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
