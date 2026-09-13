import React from 'react';
import { TrendingUp, TrendingDown, Minus, BrainCircuit, Activity } from 'lucide-react';

export const GovernmentPriceIntelligence: React.FC = () => {
  const data = [
    { crop: 'Tomato', curr: 22, pred: 25, trend: '+13.6%', risk: 'Low', color: 'text-emerald-500' },
    { crop: 'Onion', curr: 35, pred: 31, trend: '-11.4%', risk: 'High', color: 'text-red-500' },
    { crop: 'Potato', curr: 18, pred: 20, trend: '+11.1%', risk: 'Medium', color: 'text-amber-500' },
    { crop: 'Wheat', curr: 28, pred: 28, trend: '+0.0%', risk: 'Low', color: 'text-emerald-500' }
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 rounded-lg">
            <BrainCircuit className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Agricultural Price Intelligence (AI)</h3>
            <p className="text-xs text-slate-500">15-Day predictive crop movement & volatility risk</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-[10px] font-bold border border-emerald-200">
          <Activity className="w-3 h-3" /> System Active
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map(item => (
          <div key={item.crop} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-sm font-bold text-slate-800 mb-1">{item.crop}</div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-slate-500">Predicted (15d)</span>
              <span className={`text-sm font-bold ${item.color}`}>{item.trend}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-slate-500">Price Risk</span>
              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                item.risk === 'Low' ? 'bg-emerald-100 text-emerald-800' :
                item.risk === 'High' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
              }`}>{item.risk}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
