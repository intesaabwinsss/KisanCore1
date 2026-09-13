import React, { useState } from 'react';
import {
  Tractor,
  Sparkles,
  Plus,
  TrendingUp,
  Coins,
  QrCode,
  ShieldCheck,
  AlertCircle,
  Calendar,
  MapPin,
  Building2,
  RefreshCw,
  Bell,
  Eye,
  LogOut,
  User,
  ShoppingBag,
  ArrowRight,
  Zap,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { MarketPriceCard, MarketPriceItem } from './MarketPriceCard';
import { EarningsComparison } from './EarningsComparison';
import { ProductCard, FarmerProductItem } from './ProductCard';
import { OrderTable, FarmerOrderItem } from './OrderTable';
import { SecurityStatus } from './SecurityStatus';
import { NotificationPanel, FarmerNotificationItem } from './NotificationPanel';
import { AddEditProductModal } from './AddEditProductModal';
import { FarmerOrderDetailsModal } from './FarmerOrderDetailsModal';
import { TransactionLedgerModal } from './TransactionLedgerModal';
import { MarketPricesModal } from './MarketPricesModal';

const INITIAL_MARKET_PRICES: MarketPriceItem[] = [
  {
    id: 'p-1',
    name: 'Tomato',
    emoji: '🍅',
    variety: 'Hybrid Roma & Abhinav',
    currentPrice: 22,
    previousPrice: 19.5,
    trend: 'up',
    changeAmount: 2.5,
    unit: 'kg',
    lastUpdated: 'Just now',
    highDemand: true,
  },
  {
    id: 'p-2',
    name: 'Potato',
    emoji: '🥔',
    variety: 'Kufri Jyoti / Chip Grade',
    currentPrice: 18,
    previousPrice: 18.0,
    trend: 'stable',
    changeAmount: 0.0,
    unit: 'kg',
    lastUpdated: '15 mins ago',
  },
  {
    id: 'p-3',
    name: 'Onion',
    emoji: '🧅',
    variety: 'Nashik Garwa Red Grade A',
    currentPrice: 27,
    previousPrice: 28.2,
    trend: 'down',
    changeAmount: 1.2,
    unit: 'kg',
    lastUpdated: '30 mins ago',
  },
];

const INITIAL_FARMER_PRODUCTS: FarmerProductItem[] = [
  {
    id: 'prod-1',
    name: 'Tomato',
    emoji: '🍅',
    variety: 'Abhinav Hybrid F1',
    availableQuantityKg: 500,
    askingPricePerKg: 23,
    currentMarketPricePerKg: 22,
    activeOrdersCount: 5,
    status: 'ACTIVE',
    grade: 'A',
    harvestDate: '2026-09-02',
  },
  {
    id: 'prod-2',
    name: 'Potato',
    emoji: '🥔',
    variety: 'Kufri Jyoti',
    availableQuantityKg: 800,
    askingPricePerKg: 19,
    currentMarketPricePerKg: 18,
    activeOrdersCount: 2,
    status: 'ACTIVE',
    grade: 'A',
    harvestDate: '2026-08-30',
  },
  {
    id: 'prod-3',
    name: 'Onion',
    emoji: '🧅',
    variety: 'Nashik Red Grade A',
    availableQuantityKg: 1200,
    askingPricePerKg: 28,
    currentMarketPricePerKg: 27,
    activeOrdersCount: 4,
    status: 'HARVEST_READY',
    grade: 'A',
    harvestDate: '2026-09-05',
  },
  {
    id: 'prod-4',
    name: 'Basmati Rice',
    emoji: '🌾',
    variety: '1121 Pusa Supreme',
    availableQuantityKg: 600,
    askingPricePerKg: 74,
    currentMarketPricePerKg: 72,
    activeOrdersCount: 3,
    status: 'RESERVED',
    grade: 'Organic',
    harvestDate: '2026-08-25',
  },
];

const INITIAL_RECENT_ORDERS: FarmerOrderItem[] = [
  {
    id: 'ord-10243',
    orderNumber: '#10243',
    productName: 'Tomato',
    emoji: '🍅',
    variety: 'Abhinav Hybrid F1',
    quantityKg: 500,
    ratePerKg: 22,
    buyerName: 'Restaurant XYZ',
    buyerType: 'Restaurant',
    buyerLocation: 'Baner Food Hub, Pune',
    totalAmount: 11000,
    paymentStatus: 'COMPLETED',
    orderDate: 'Sept 02, 2026',
    deliveryDate: 'Sept 03, 2026',
    txHash: '0x8f2a9c14e712ba6d9410ef39b207ca91834fd2a7',
  },
  {
    id: 'ord-10244',
    orderNumber: '#10244',
    productName: 'Potato',
    emoji: '🥔',
    variety: 'Kufri Jyoti',
    quantityKg: 300,
    ratePerKg: 18,
    buyerName: 'FreshMart Supermarket',
    buyerType: 'Supermarket',
    buyerLocation: 'Kalyani Nagar, Pune',
    totalAmount: 5400,
    paymentStatus: 'PENDING',
    orderDate: 'Sept 02, 2026',
    deliveryDate: 'Sept 04, 2026',
    txHash: '0x9a3b0d25f823cb7e0521fe40c318db02945fe3b8',
  },
  {
    id: 'ord-10245',
    orderNumber: '#10245',
    productName: 'Onion',
    emoji: '🧅',
    variety: 'Nashik Red Grade A',
    quantityKg: 200,
    ratePerKg: 28,
    buyerName: 'Taj City Bistro',
    buyerType: 'Restaurant',
    buyerLocation: 'Shivaji Nagar, Pune',
    totalAmount: 5600,
    paymentStatus: 'COMPLETED',
    orderDate: 'Sept 01, 2026',
    deliveryDate: 'Sept 02, 2026',
    txHash: '0xab4c1e36a934dc8f1632af51d429ec13056af4c9',
  },
  {
    id: 'ord-10246',
    orderNumber: '#10246',
    productName: 'Basmati Rice',
    emoji: '🌾',
    variety: '1121 Pusa Supreme',
    quantityKg: 150,
    ratePerKg: 72,
    buyerName: 'Daily Organics Store',
    buyerType: 'Retailer',
    buyerLocation: 'Kothrud, Pune',
    totalAmount: 10800,
    paymentStatus: 'ESCROW_HELD',
    orderDate: 'Aug 31, 2026',
    deliveryDate: 'Sept 05, 2026',
    txHash: '0x3c5d7e91a0b3c4d5e6f8f2a9c14e712ba6d9410e',
  },
];

const INITIAL_NOTIFICATIONS: FarmerNotificationItem[] = [
  {
    id: 'notif-1',
    type: 'PRICE_ALERT',
    title: 'Tomato Price Surge',
    message: '🔔 Tomato price increased to ₹22/kg in your district (+₹2.50 today).',
    timeAgo: '10m ago',
    isRead: false,
    actionLabel: 'Check Market Rates',
  },
  {
    id: 'notif-2',
    type: 'NEW_ORDER',
    title: 'New Bulk Order Received',
    message: '📦 New order #10243 (500 kg Tomato) received from Restaurant XYZ.',
    timeAgo: '45m ago',
    isRead: false,
    actionLabel: 'View Order',
  },
  {
    id: 'notif-3',
    type: 'PAYMENT',
    title: 'Direct Escrow Payout Credited',
    message: '💰 Payment of ₹11,000 received directly into Bank A/C ending in **4821.',
    timeAgo: '2h ago',
    isRead: false,
    actionLabel: 'View Ledger',
  },
  {
    id: 'notif-4',
    type: 'SECURITY',
    title: 'Cyber Security Alert',
    message: '⚠️ Unusual transaction detected — review required (Unverified buyer bid quarantined by Escrow Guard).',
    timeAgo: '4h ago',
    isRead: true,
    actionLabel: 'Audit Security Log',
  },
  {
    id: 'notif-5',
    type: 'DEMAND',
    title: 'High Regional Demand',
    message: '📈 Demand for onions is increasing (+34%) in your area. 4 restaurants seeking harvest lots.',
    timeAgo: '6h ago',
    isRead: true,
    actionLabel: 'List Onion Lot',
  },
];

interface FarmerDashboardOverviewProps {
  onNavigateTab?: (tab: string) => void;
  onOpenProfile?: () => void;
  onLogout?: () => void;
}

export const FarmerDashboardOverview: React.FC<FarmerDashboardOverviewProps> = ({
  onNavigateTab,
  onOpenProfile,
  onLogout,
}) => {
  // State
  const [marketPrices, setMarketPrices] = useState<MarketPriceItem[]>(INITIAL_MARKET_PRICES);
  const [products, setProducts] = useState<FarmerProductItem[]>(INITIAL_FARMER_PRODUCTS);
  const [orders, setOrders] = useState<FarmerOrderItem[]>(INITIAL_RECENT_ORDERS);
  const [notifications, setNotifications] = useState<FarmerNotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Modals & Popovers
  const [isRefreshingPrices, setIsRefreshingPrices] = useState(false);
  const [isMarketPricesModalOpen, setIsMarketPricesModalOpen] = useState(false);
  const [isAddEditProductModalOpen, setIsAddEditProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<FarmerProductItem | null>(null);
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<FarmerOrderItem | null>(null);
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  // Price Simulation
  const handleRefreshPrices = () => {
    setIsRefreshingPrices(true);
    setTimeout(() => {
      setMarketPrices((prev) =>
        prev.map((item) => {
          const delta = (Math.random() * 2 - 0.8).toFixed(1);
          const numDelta = Number(delta);
          const newPrice = Math.max(12, Number((item.currentPrice + numDelta).toFixed(1)));
          return {
            ...item,
            currentPrice: newPrice,
            changeAmount: Math.abs(numDelta),
            trend: numDelta > 0 ? 'up' : numDelta < 0 ? 'down' : 'stable',
            lastUpdated: 'Just now',
          };
        })
      );
      setIsRefreshingPrices(false);
    }, 600);
  };

  // Product CRUD
  const handleSaveProduct = (product: FarmerProductItem) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) => (p.id === product.id ? product : p));
      }
      return [product, ...prev];
    });
    setEditingProduct(null);
  };

  const handleEditProduct = (product: FarmerProductItem) => {
    setEditingProduct(product);
    setIsAddEditProductModalOpen(true);
  };

  const handleRemoveProduct = (productId: string) => {
    if (confirm('Are you sure you want to remove this product listing?')) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  const handleViewOrdersForProduct = (product: FarmerProductItem) => {
    // If dedicated tab navigation available
    if (onNavigateTab) {
      onNavigateTab('orders');
    } else {
      const matched = orders.find((o) => o.productName.toLowerCase() === product.name.toLowerCase());
      if (matched) {
        setSelectedOrder(matched);
        setIsOrderDetailsModalOpen(true);
      } else {
        alert(`Viewing ${product.activeOrdersCount} direct buyer orders for ${product.name}.`);
      }
    }
  };

  // Notification actions
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationAction = (n: FarmerNotificationItem) => {
    if (n.type === 'PRICE_ALERT') setIsMarketPricesModalOpen(true);
    else if (n.type === 'NEW_ORDER') {
      const o = orders[0];
      setSelectedOrder(o);
      setIsOrderDetailsModalOpen(true);
    } else if (n.type === 'PAYMENT' || n.type === 'SECURITY') {
      setIsLedgerModalOpen(true);
    } else if (n.type === 'DEMAND') {
      setEditingProduct(null);
      setIsAddEditProductModalOpen(true);
    }
    setIsNotificationPanelOpen(false);
  };

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* ========================================================================= */}
      {/* 1. DASHBOARD HEADER & WELCOME BAR */}
      {/* ========================================================================= */}
      <div
        id="farmer-dashboard-header"
        className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden"
      >
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-3xl shrink-0 shadow-xs">
            👨‍🌾
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Welcome, Ramesh Kumar 👨‍🌾
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Verified Direct Farmer</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Village Khed, Pune District, Maharashtra</span>
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span>Landholding: 4.5 Acres</span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="font-mono text-emerald-800 font-bold">Kisan ID: #KD-8821</span>
            </div>
          </div>
        </div>

        {/* Quick Top Actions & Notifications Popover trigger */}
        <div className="flex items-center gap-2.5 self-start md:self-auto relative">
          <button
            id="notifications-toggle-btn"
            onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all relative gradient-border-organic border-0"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-700 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          <button
            id="add-product-quick-btn"
            onClick={() => {
              setEditingProduct(null);
              setIsAddEditProductModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition-all flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>

          {/* Floating Notification Panel Popover */}
          {isNotificationPanelOpen && (
            <div className="absolute right-0 top-14 z-50 animate-in fade-in slide-in-from-top-2">
              <NotificationPanel
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onClose={() => setIsNotificationPanelOpen(false)}
                onSelectAction={handleNotificationAction}
              />
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUGGESTED 2-COLUMN GRID: TODAY'S MARKET & EARNINGS COMPARISON */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Section 1: Today's Market */}
        <MarketPriceCard
          prices={marketPrices}
          onViewAllPrices={() => setIsMarketPricesModalOpen(true)}
          onRefreshPrices={handleRefreshPrices}
          isRefreshing={isRefreshingPrices}
        />

        {/* Section 3: Your Earnings (Comparison) */}
        <EarningsComparison
          traditionalEarnings={8500}
          kisanDirectEarnings={11000}
          volumeKg={500}
          cropName="Tomato (500 kg Lot)"
        />
      </div>

      {/* ========================================================================= */}
      {/* 3. SECTION 2: MY PRODUCTS */}
      {/* ========================================================================= */}
      <div id="my-products-section" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Your Listed Products</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
                {products.length} Crops Active
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Harvest inventory available for direct procurement by restaurants and supermarket chains
            </p>
          </div>

          <button
            onClick={() => {
              setEditingProduct(null);
              setIsAddEditProductModalOpen(true);
            }}
            className="px-4 py-2 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Crop</span>
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEditProduct={handleEditProduct}
              onViewOrders={handleViewOrdersForProduct}
              onRemoveProduct={handleRemoveProduct}
            />
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. SECTION 4: RECENT ORDERS */}
      {/* ========================================================================= */}
      <OrderTable
        orders={orders}
        onViewOrderDetails={(order) => {
          setSelectedOrder(order);
          setIsOrderDetailsModalOpen(true);
        }}
      />

      {/* ========================================================================= */}
      {/* 5. SECTION 5: SECURE TRANSACTION INDICATOR (CYBER SECURITY SPECIALIZATION) */}
      {/* ========================================================================= */}
      <SecurityStatus
        onOpenLedger={() => setIsLedgerModalOpen(true)}
        totalSecuredVolume="₹2,48,500"
        activeEscrowCount={3}
      />

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}
      {/* Add / Edit Product Modal */}
      <AddEditProductModal
        isOpen={isAddEditProductModalOpen}
        onClose={() => {
          setIsAddEditProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
      />

      {/* Order Details Modal */}
      <FarmerOrderDetailsModal
        order={selectedOrder}
        isOpen={isOrderDetailsModalOpen}
        onClose={() => {
          setIsOrderDetailsModalOpen(false);
          setSelectedOrder(null);
        }}
        onConfirmDispatch={(orderId) => {
          setOrders((prev) =>
            prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: 'DISPATCHED' } : o))
          );
        }}
      />

      {/* Cryptographic Transaction Ledger Modal */}
      <TransactionLedgerModal
        isOpen={isLedgerModalOpen}
        onClose={() => setIsLedgerModalOpen(false)}
      />

      {/* Live Mandi Benchmark & Prices Modal */}
      <MarketPricesModal
        isOpen={isMarketPricesModalOpen}
        onClose={() => setIsMarketPricesModalOpen(false)}
        prices={marketPrices}
        onRefreshPrices={handleRefreshPrices}
      />
    </div>
  );
};
