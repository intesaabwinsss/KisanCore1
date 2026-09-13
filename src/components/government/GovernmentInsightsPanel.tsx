import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Package, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle,
  Lightbulb,
  ShieldCheck
} from 'lucide-react';
import { KEY_GOVERNMENT_INSIGHTS } from './GovernmentData';

export const GovernmentInsightsPanel: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 border border-slate-800 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">
                Key Government Agricultural Intelligence & Policy Insights
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                Algorithmic Synthesis
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Automated high-confidence supply chain conclusions derived from real-time transaction telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Real-time Confidence: 98.4%</span>
        </div>
      </div>

      {/* 5 Numbered Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {KEY_GOVERNMENT_INSIGHTS.map((insight, idx) => (
          <div
            key={insight.id}
            className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/80 hover:border-emerald-500/50 transition flex flex-col justify-between space-y-2.5"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/60 flex items-center justify-center text-xs font-bold font-mono">
                  {idx + 1}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-700/60 text-slate-300">
                  {insight.tag}
                </span>
              </div>

              <h4 className="font-bold text-sm text-white leading-snug">
                {insight.title}
              </h4>

              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {insight.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 font-semibold">{insight.impactScore}</span>
              <span className="text-slate-400 font-mono">Verified Node Data</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
