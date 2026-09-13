import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  Eye,
  Search,
  Filter,
  ArrowUpRight,
  Truck,
  Building2,
  Receipt,
  FileText,
} from 'lucide-react';

export interface FarmerOrderItem {
  id: string;
  orderNumber: string;
  productName: string;
  emoji: string;
  variety: string;
  quantityKg: number;
  ratePerKg: number;
  buyerName: string;
  buyerType: 'Restaurant' | 'Supermarket' | 'Food Processor' | 'Retailer';
  buyerLocation: string;
  totalAmount: number;
  paymentStatus: 'COMPLETED' | 'PENDING' | 'ESCROW_HELD' | 'DISPATCHED';
  orderDate: string;
  deliveryDate: string;
  txHash?: string;
}

interface OrderTableProps {
  orders: FarmerOrderItem[];
  onViewOrderDetails: (order: FarmerOrderItem) => void;
  onFilterProduct?: string | null;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onViewOrderDetails,
  onFilterProduct,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredOrders = orders.filter((o) => {
    if (onFilterProduct && !o.productName.toLowerCase().includes(onFilterProduct.toLowerCase())) {
      return false;
    }
    if (filterStatus !== 'ALL' && o.paymentStatus !== filterStatus) {
      return false;
    }
    if (
      searchTerm &&
      !o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !o.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !o.buyerName.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: FarmerOrderItem['paymentStatus']) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Completed</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>Pending</span>
          </span>
        );
      case 'ESCROW_HELD':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-black border border-blue-300">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            <span>Escrow Held</span>
          </span>
        );
      case 'DISPATCHED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-black border border-purple-300">
            <Truck className="w-3.5 h-3.5 text-purple-700" />
            <span>Dispatched</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      id="recent-orders-section"
      className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-6 shadow-xs space-y-4"
    >
      {/* Table Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Recent Orders</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                {filteredOrders.length} Direct Deals
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Contracts signed directly with verified restaurants and supermarket buyers
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search order, buyer, crop..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 gradient-border-organic border-0 rounded-xl focus:outline-emerald-600 w-44 sm:w-56"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            {['ALL', 'COMPLETED', 'PENDING', 'ESCROW_HELD'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg transition-all text-[11px] ${
                  filterStatus === st
                    ? 'bg-white text-slate-900 font-black shadow-2xs'
                    : 'hover:text-slate-900'
                }`}
              >
                {st === 'ALL' ? 'All' : st === 'ESCROW_HELD' ? 'Escrow' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop & Tablet Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-100 hidden sm:block">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Product & Volume</th>
              <th className="px-4 py-3">Direct Buyer</th>
              <th className="px-4 py-3">Total Amount</th>
              <th className="px-4 py-3">Payment Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  No orders match your filter criteria.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  <td className="px-4 py-3.5 font-mono font-black text-slate-900">
                    <span className="bg-slate-100 px-2 py-1 rounded-md text-xs">
                      {order.orderNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{order.emoji}</span>
                      <div>
                        <div className="font-extrabold text-slate-900">
                          {order.productName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {order.quantityKg} kg @ ₹{order.ratePerKg}/kg
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-900">{order.buyerName}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      <span>{order.buyerType} • {order.buyerLocation}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono font-black text-slate-900 text-sm">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3.5">{getStatusBadge(order.paymentStatus)}</td>
                  <td className="px-4 py-3.5 text-slate-500 font-medium">
                    {order.orderDate}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => onViewOrderDetails(order)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 font-bold text-xs transition-all flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (Below 640px) */}
      <div className="space-y-3 sm:hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl">
            No orders found.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-4 rounded-2xl bg-slate-50/80 gradient-border-organic border-0 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-xs bg-white px-2 py-0.5 rounded gradient-border-organic border-0 text-slate-900">
                  {order.orderNumber}
                </span>
                {getStatusBadge(order.paymentStatus)}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{order.emoji}</span>
                  <div>
                    <div className="font-black text-sm text-slate-900">
                      {order.productName} — {order.quantityKg} kg
                    </div>
                    <div className="text-xs text-slate-500">
                      Buyer: {order.buyerName}
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono font-black text-slate-900 text-base">
                  ₹{order.totalAmount.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500">{order.orderDate}</span>
                <button
                  onClick={() => onViewOrderDetails(order)}
                  className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
