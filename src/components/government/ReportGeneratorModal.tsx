import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  FileSpreadsheet, 
  Eye,
  X,
  Loader2
} from 'lucide-react';
import { GOVERNMENT_REPORTS } from './GovernmentData';
import { ReportConfig } from './GovernmentTypes';

interface ReportGeneratorModalProps {
  onClose?: () => void;
}

export const ReportGeneratorModal: React.FC<ReportGeneratorModalProps> = ({
  onClose
}) => {
  const [selectedReport, setSelectedReport] = useState<ReportConfig>(GOVERNMENT_REPORTS[0]);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [activePreview, setActivePreview] = useState<ReportConfig | null>(null);
  const [generationSuccess, setGenerationSuccess] = useState<string | null>(null);

  const handleAction = (reportId: string, actionType: 'PDF' | 'CSV' | 'VIEW') => {
    if (actionType === 'VIEW') {
      const rep = GOVERNMENT_REPORTS.find(r => r.id === reportId) || GOVERNMENT_REPORTS[0];
      setActivePreview(rep);
      return;
    }

    setIsGenerating(`${reportId}-${actionType}`);
    setTimeout(() => {
      setIsGenerating(null);
      setGenerationSuccess(`Official ${actionType} report generated & downloaded securely.`);
      setTimeout(() => setGenerationSuccess(null), 3500);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-2xl gradient-border-organic border-0 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Official Agricultural Policy & Supply Chain Report Generator
              </h3>
              <p className="text-xs text-slate-500">
                Ministry-compliant statistical dossiers, cryptographic audit packages, and policy whitepapers
              </p>
            </div>
          </div>
        </div>

        {generationSuccess && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{generationSuccess}</span>
          </div>
        )}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {GOVERNMENT_REPORTS.map((report) => (
          <div
            key={report.id}
            className="p-4 rounded-xl gradient-border-organic border-0 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition flex flex-col justify-between space-y-3 shadow-2xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                  {report.category}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">{report.size}</span>
              </div>

              <h4 className="font-bold text-sm text-slate-900 leading-snug">{report.title}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{report.description}</p>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pb-2.5 border-b border-slate-200">
                <span>Generated: {report.generatedAt}</span>
                <span>{report.recordCount.toLocaleString('en-IN')} Records</span>
              </div>

              <div className="flex items-center gap-1.5 pt-2.5">
                <button
                  onClick={() => handleAction(report.id, 'VIEW')}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>

                <button
                  disabled={!!isGenerating}
                  onClick={() => handleAction(report.id, 'PDF')}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer disabled:opacity-50"
                >
                  {isGenerating === `${report.id}-PDF` ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Printer className="w-3.5 h-3.5" />
                  )}
                  <span>PDF</span>
                </button>

                <button
                  disabled={!!isGenerating}
                  onClick={() => handleAction(report.id, 'CSV')}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer disabled:opacity-50"
                >
                  {isGenerating === `${report.id}-CSV` ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span>CSV</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Preview Modal */}
      {activePreview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl gradient-border-organic border-0 shadow-2xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                  {activePreview.category} Report Preview
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-1">{activePreview.title}</h3>
                <p className="text-xs text-slate-500 font-mono">Document Hash: 0x9f88c3a1b02948e7... • {activePreview.generatedAt}</p>
              </div>
              <button
                onClick={() => setActivePreview(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Document Content Sample */}
            <div className="p-4 bg-slate-50 rounded-xl gradient-border-organic border-0 text-xs text-slate-800 space-y-3 font-mono">
              <div className="border-b border-slate-200 pb-2 flex justify-between font-bold text-slate-900 font-sans">
                <span>GOVERNMENT OF INDIA • AGRICULTURAL INTELLIGENCE CELL</span>
                <span>CONFIDENTIAL / OFFICIAL</span>
              </div>

              <div className="space-y-1">
                <div>Scope: Delhi National Capital Region (7 Monitoring Clusters)</div>
                <div>Monitored Farmers: 12,482 Active KYC Verified</div>
                <div>Recorded Output: 1,284 Metric Tonnes Traded</div>
                <div>Net Farmer Income Uplift: +18.4% (p &lt; 0.001 statistically significant)</div>
                <div>Average Consumer Price Moderation: -9.2%</div>
                <div>Intermediaries Eliminated: 2.3 Per Transaction Flow</div>
              </div>

              <div className="p-2 bg-emerald-50 rounded border border-emerald-200 text-emerald-950 font-sans">
                <span className="font-bold">Executive Summary: </span>
                Direct transactions via KisanDirect have successfully truncated speculative wholesale margins, enhancing smallholder realization to ₹10,065/MT while simultaneously shielding urban consumer baskets from artificial food inflation.
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Government Cryptographic Seal Verified</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAction(activePreview.id, 'PDF')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Download Signed PDF
                </button>
                <button
                  onClick={() => setActivePreview(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
