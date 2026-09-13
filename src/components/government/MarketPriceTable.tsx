import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Search, 
  Filter, 
  AlertTriangle, 
  Download, 
  ArrowUpDown, 
  CheckCircle2, 
  Sparkles, 
  Layers
} from 'lucide-react';
import { MARKET_PRICES_DATA } from './GovernmentData';
import { MarketPriceRecord } from './GovernmentTypes';

interface MarketPriceTableProps {
  onSelectAnomaly?: (record: MarketPriceRecord) => void;
}

export const MarketPriceTable: React.FC<MarketPriceTableProps> = ({
  onSelectAnomaly
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDemand, setSelectedDemand] = useState('ALL');
  const [selectedSupply, setSelectedSupply] = useState('ALL');
  const [showOnlyAnomalies, setShowOnlyAnomalies] = useState(false);

  const filteredRecords = MARKET_PRICES_DATA.filter(record => {
    const matchesSearch = record.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.dominantDistrict.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || record.category === selectedCategory;
    const matchesDemand = selectedDemand === 'ALL' || record.demandLevel === selectedDemand;
    const matchesSupply = selectedSupply === 'ALL' || record.supplyLevel === selectedSupply;
    const matchesAnomaly = !showOnlyAnomalies || record.anomalyDetected;

    return matchesSearch && matchesCategory && matchesDemand && matchesSupply && matchesAnomaly;
  });

  const categories = ['ALL', 'Vegetables', 'Tubers', 'Grains'];

  return (
    <div className="bg-white rounded-2xl gradient-border-organic border-0 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Market Price Equilibrium & Anomaly Monitoring
              </h3>
              <p className="text-xs text-slate-500">
                Real-time price discoveries, retail-to-farmgate margins, and algorithmic price anomaly tracking
              </p>
            </div>
          </div>
        </div>

        {/* Action Toggle: Show Anomalies Only */}
        <button
          onClick={() => setShowOnlyAnomalies(!showOnlyAnomalies)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer self-start md:self-auto ${
            showOnlyAnomalies 
              ? 'bg-amber-600 text-white border-amber-600 shadow-xs' 
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{showOnlyAnomalies ? 'Showing Price Anomalies' : 'Filter Price Anomalies'}</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search crop, variety, or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
          />
        </div>

        {/* Category */}
        <div className="flex items-center gap-1">
          <label className="text-xs text-slate-500 whitespace-nowrap">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white focus:ring-emerald-500"
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat === 'ALL' ? 'All Categories' : cat}</option>)}
          </select>
        </div>

        {/* Demand Level */}
        <div className="flex items-center gap-1">
          <label className="text-xs text-slate-500 whitespace-nowrap">Demand:</label>
          <select
            value={selectedDemand}
            onChange={(e) => setSelectedDemand(e.target.value)}
            className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white focus:ring-emerald-500"
          >
            <option value="ALL">All Demand</option>
            <option value="HIGH">High Demand</option>
            <option value="MEDIUM">Medium Demand</option>
            <option value="LOW">Low Demand</option>
          </select>
        </div>

        {/* Supply Level */}
        <div className="flex items-center gap-1">
          <label className="text-xs text-slate-500 whitespace-nowrap">Supply:</label>
          <select
            value={selectedSupply}
            onChange={(e) => setSelectedSupply(e.target.value)}
            className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white focus:ring-emerald-500"
          >
            <option value="ALL">All Supply Levels</option>
            <option value="SURPLUS">Surplus</option>
            <option value="ADEQUATE">Adequate</option>
            <option value="DEFICIT">Deficit</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto gradient-border-organic border-0 rounded-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <th className="py-3 px-4">Commodity & Variety</th>
              <th className="py-3 px-4">Avg Platform Price</th>
              <th className="py-3 px-4">Traditional Retail</th>
              <th className="py-3 px-4">Trend (7d)</th>
              <th className="py-3 px-4">Demand</th>
              <th className="py-3 px-4">Supply Level</th>
              <th className="py-3 px-4">Key Ingress Hub</th>
              <th className="py-3 px-4">Status / Anomaly</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-slate-400">
                  No commodities matched the selected filters.
                </td>
              </tr>
            ) : (
              filteredRecords.map((item) => {
                return (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-slate-50/80 transition ${item.anomalyDetected ? 'bg-amber-50/30' : ''}`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.product}</div>
                      <div className="text-[11px] text-slate-500">{item.variety}</div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                      ₹{item.avgPricePerKg.toFixed(1)} /kg
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500 line-through">
                      ₹{item.traditionalRetailPricePerKg.toFixed(1)} /kg
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 font-semibold ${
                        item.trendDirection === 'up' ? 'text-red-600' :
                        item.trendDirection === 'down' ? 'text-emerald-600' :
                        'text-slate-500'
                      }`}>
                        {item.trendDirection === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
                        {item.trendDirection === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
                        {item.trendDirection === 'stable' && <Minus className="w-3.5 h-3.5" />}
                        <span>{item.priceTrendPct > 0 ? `+${item.priceTrendPct}%` : `${item.priceTrendPct}%`}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.demandLevel === 'HIGH' ? 'bg-red-100 text-red-700' :
                        item.demandLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {item.demandLevel}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.supplyLevel === 'SURPLUS' ? 'bg-emerald-100 text-emerald-800' :
                        item.supplyLevel === 'ADEQUATE' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.supplyLevel}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {item.dominantDistrict}
                    </td>

                    <td className="py-3 px-4">
                      {item.anomalyDetected ? (
                        <button
                          onClick={() => onSelectAnomaly?.(item)}
                          className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded border border-amber-300 transition cursor-pointer"
                        >
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>Price Anomaly</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Equilibrium</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <span>Showing {filteredRecords.length} monitored agricultural commodities</span>
        <span className="font-mono">Last Sync: Today 17:45 IST • APMC & KisanDirect Integrated Feed</span>
      </div>
    </div>
  );
};
