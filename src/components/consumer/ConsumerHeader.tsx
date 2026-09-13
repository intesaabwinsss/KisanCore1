import React, { useState } from 'react';
import { 
  Sprout, 
  Search, 
  MapPin, 
  ShoppingBag, 
  User, 
  Receipt, 
  TrendingDown, 
  PackageCheck, 
  ShieldCheck, 
  Check, 
  ChevronDown,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ConsumerHeaderProps {
  activeTab: 'home' | 'browse' | 'orders' | 'comparison' | 'ledger' | 'profile';
  onSelectTab: (tab: 'home' | 'browse' | 'orders' | 'comparison' | 'ledger' | 'profile') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  onSwitchToFarmer?: () => void;
}

const AVAILABLE_LOCATIONS = [
  // Maharashtra
  '📍 Baner & Aundh, Pune (30-45 mins)',
  '📍 Kothrud & Deccan, Pune (45 mins)',
  '📍 Viman Nagar & Kharadi, Pune (40 mins)',
  '📍 Andheri & Bandra, Mumbai (Same Day)',
  '📍 Colaba & Fort, Mumbai (Same Day)',
  '📍 Sitabuldi & Dharampeth, Nagpur (1-2 Days)',
  // Karnataka
  '📍 Indiranagar & Koramangala, Bangalore (Same Day)',
  '📍 Whitefield & Bellandur, Bangalore (Same Day)',
  '📍 Gokulam & Jayalakshmipuram, Mysore (1-2 Days)',
  // Delhi NCR
  '📍 Gurugram Sector 54, NCR (Same Day)',
  '📍 South Extension & Defence Colony, Delhi (Same Day)',
  '📍 Vasant Kunj & Vasant Vihar, Delhi (Same Day)',
  '📍 Hauz Khas & Green Park, Delhi (Same Day)',
  '📍 Dwarka Sector 11 & 14, Delhi (Same Day)',
  '📍 Rohini Sector 9 & 13, Delhi (Same Day)',
  '📍 Connaught Place & Chanakyapuri, Delhi (Same Day)',
  '📍 Noida Sector 15 & 18, UP (Same Day)',
  '📍 Noida Sector 50 & 51, UP (Same Day)',
  '📍 Noida Sector 62 & 137, UP (Same Day)',
  '📍 Noida Extension (Greater Noida West), UP (Same Day)',
  '📍 Greater Noida Alpha & Beta, UP (1-2 Days)',
  // Telangana & AP
  '📍 Banjara Hills & Jubilee Hills, Hyderabad (Same Day)',
  '📍 Gachibowli & Madhapur, Hyderabad (Same Day)',
  '📍 MVP Colony & Dwaraka Nagar, Visakhapatnam (1-2 Days)',
  // Tamil Nadu
  '📍 Anna Nagar & T. Nagar, Chennai (Same Day)',
  '📍 RS Puram & Peelamedu, Coimbatore (1-2 Days)',
  // West Bengal
  '📍 Salt Lake & New Town, Kolkata (Same Day)',
  '📍 Ballygunge & Alipore, Kolkata (Same Day)',
  // Gujarat
  '📍 Satellite & SG Highway, Ahmedabad (Same Day)',
  '📍 Vesu & Piplod, Surat (1-2 Days)',
  // Rajasthan
  '📍 Civil Lines & Mansarovar, Jaipur (1-2 Days)',
  '📍 Sardarpura & Ratanada, Jodhpur (1-2 Days)',
  // UP & Bihar
  '📍 Gomti Nagar & Hazratganj, Lucknow (1-2 Days)',
  '📍 Kankarbagh & Boring Road, Patna (1-2 Days)',
  // MP & Chhattisgarh
  '📍 Saket & Malviya Nagar, Indore (1-2 Days)',
  '📍 TT Nagar & Arera Colony, Bhopal (1-2 Days)',
  '📍 Shankar Nagar & Civil Lines, Raipur (1-2 Days)',
  // Odisha
  '📍 Saheed Nagar & Patia, Bhubaneswar (1-2 Days)',
  // Punjab & Chandigarh
  '📍 Sector 17 & 35, Chandigarh (1-2 Days)',
  '📍 Model Town & Sarabha Nagar, Ludhiana (1-2 Days)',
  // Kerala
  '📍 Ernakulam & Fort Kochi, Kochi (1-2 Days)',
  '📍 Kowdiar & Sasthamangalam, Trivandrum (1-2 Days)',
  // Assam
  '📍 Paltan Bazaar & Dispur, Guwahati (1-2 Days)',
];

export const ConsumerHeader: React.FC<ConsumerHeaderProps> = ({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  selectedLocation,
  onSelectLocation,
  onSwitchToFarmer,
}) => {
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const { currentUser } = useAuth();

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Banner Tagline */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-[11px] sm:text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="font-bold text-emerald-100">Direct From Farmgate:</span>
            <span className="hidden sm:inline text-emerald-200/90">
              Zero middlemen • 85%+ payment to local farmers • ₹5–₹80/kg consumer savings
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-emerald-200/90 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>AES-256 Encrypted & Ledger Verified</span>
            </div>
            {onSwitchToFarmer && (
              <button
                onClick={onSwitchToFarmer}
                className="bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded text-[10px] font-bold transition-all flex items-center gap-1"
              >
                <ArrowRightLeft className="w-3 h-3" />
                <span>Switch to Farmer View</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-display font-black text-emerald-950 tracking-tight">
                  KISANDIRECT
                </span>
                <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-black tracking-wide uppercase">
                  Consumer
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block -mt-0.5">
                Farm-to-Kitchen Direct Marketplace
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search fresh vegetables, fruits, farm sources..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 gradient-border-organic border-0 rounded-2xl focus:bg-white focus:outline-emerald-700 focus:border-emerald-600 transition-all placeholder:text-slate-400 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Location Selector */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200/80 rounded-2xl text-xs font-semibold text-slate-800 transition-all gradient-border-organic border-0/60"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <div className="text-left hidden sm:block">
                <span className="text-[10px] text-slate-500 block leading-tight font-medium">Your Location</span>
                <span className="font-bold text-slate-900 truncate max-w-[130px] block leading-tight">
                  {selectedLocation.split('(')[0].replace('📍', '').trim()}
                </span>
              </div>
              <span className="sm:hidden font-bold">Pune</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {isLocationMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 max-h-[70vh] overflow-y-auto bg-white/95 backdrop-blur-xl border border-emerald-900/10 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-100 sticky top-0 bg-white z-10 space-y-2">
                  <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Select Delivery Location
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search city or area..."
                      value={locationSearchQuery}
                      onChange={(e) => setLocationSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 gradient-border-organic border-0 rounded-xl text-xs focus:outline-emerald-700"
                    />
                  </div>
                </div>
                {AVAILABLE_LOCATIONS.filter(loc => loc.toLowerCase().includes(locationSearchQuery.toLowerCase())).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      onSelectLocation(loc);
                      setIsLocationMenuOpen(false);
                      setLocationSearchQuery('');
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between transition-colors ${
                      selectedLocation === loc
                        ? 'bg-emerald-50 text-emerald-900 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{loc}</span>
                    {selectedLocation === loc && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                  </button>
                ))}
                {AVAILABLE_LOCATIONS.filter(loc => loc.toLowerCase().includes(locationSearchQuery.toLowerCase())).length === 0 && (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No locations found matching "{locationSearchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Controls: Cart & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart Button */}
            <button
              id="consumer-cart-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md shadow-emerald-900/10 active:scale-95 transition-all"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-100" />
              <span className="hidden sm:inline">Cart</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-emerald-950 font-black text-[11px]">
                {cartCount}
              </span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 gradient-border-organic border-0 transition-all"
                title="Consumer Profile"
              >
                <User className="w-4 h-4 text-slate-800" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl border border-emerald-900/10 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{currentUser?.name || 'Ananya Sharma'}</p>
                    <p className="text-[11px] text-slate-500">{currentUser?.email || currentUser?.mobile || 'ananya.sharma@example.com'}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Verified Direct Consumer
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onSelectTab('orders');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <PackageCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>My Orders</span>
                  </button>
                  <button
                    onClick={() => {
                      onSelectTab('ledger');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Receipt className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Transaction History</span>
                  </button>
                  <button
                    onClick={() => {
                      onSelectTab('comparison');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Price Comparison & Savings</span>
                  </button>
                  {onSwitchToFarmer && (
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onSwitchToFarmer();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-emerald-700 font-bold hover:bg-emerald-50 flex items-center gap-2"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span>Switch to Farmer Dashboard</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search vegetables, fruits..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 gradient-border-organic border-0 rounded-xl focus:bg-white focus:outline-emerald-700"
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar border-t border-slate-100 py-2">
          <button
            id="tab-consumer-home"
            onClick={() => onSelectTab('home')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'home'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Home
          </button>

          <button
            id="tab-consumer-browse"
            onClick={() => onSelectTab('browse')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'browse'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>Browse Products</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-900 font-extrabold">
              9 Live
            </span>
          </button>

          <button
            id="tab-consumer-orders"
            onClick={() => onSelectTab('orders')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>My Orders</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          </button>

          <button
            id="tab-consumer-comparison"
            onClick={() => onSelectTab('comparison')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'comparison'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
            <span>Price Comparison</span>
            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
              Save ₹5-₹80/kg
            </span>
          </button>

          <button
            id="tab-consumer-ledger"
            onClick={() => onSelectTab('ledger')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'ledger'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Transaction History</span>
          </button>

          <button
            id="tab-consumer-profile"
            onClick={() => onSelectTab('profile')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Profile
          </button>
        </div>
      </div>
    </div>
  );
};
