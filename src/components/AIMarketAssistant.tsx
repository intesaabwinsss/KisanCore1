import React, { useState } from 'react';
import { 
  Sparkles, 
  Calculator, 
  FileText, 
  TrendingUp, 
  RefreshCw, 
  Copy, 
  Check, 
  DollarSign, 
  Wand2, 
  Compass, 
  Languages 
} from 'lucide-react';
import { CraftItem, LanguageCode } from '../types';
import { SAMPLE_CRAFTS } from '../data/artisanData';

interface AIMarketAssistantProps {
  currentLanguage: LanguageCode;
  isDarkMode?: boolean;
}

export const AIMarketAssistant: React.FC<AIMarketAssistantProps> = ({
  currentLanguage,
  isDarkMode = false,
}) => {
  const [selectedCraft, setSelectedCraft] = useState<CraftItem>(SAMPLE_CRAFTS[0]);

  // Pricing Calculator State
  const [craftHours, setCraftHours] = useState(selectedCraft.hoursToCraft);
  const [hourlyWage, setHourlyWage] = useState(120); // Fair master wage INR/hr
  const [rawMaterialCost, setRawMaterialCost] = useState(250);
  const [firingLossPercent, setFiringLossPercent] = useState(10);
  const [packagingCost, setPackagingCost] = useState(90);

  // Story Generator State
  const [storyTone, setStoryTone] = useState<'Heritage' | 'Luxury' | 'Festive' | 'Eco-Friendly'>('Heritage');
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [copiedStory, setCopiedStory] = useState(false);
  const [generatedStory, setGeneratedStory] = useState(
    `Handcrafted in the royal hinterlands of Rajasthan, this Warli Terracotta Kalash represents a 4th-generation pottery lineage. Each vessel is shaped on an authentic manual wooden wheel from riverbed alluvial clay, then sun-cured and pit-fired with slow rice husks. The traditional white harvest motifs celebrate sacred fertility and rain festivals, creating an heirloom accent that brings earthen peace to modern spaces.`
  );

  // Derived pricing calculations
  const laborCost = craftHours * hourlyWage;
  const directCost = laborCost + rawMaterialCost + packagingCost;
  const bufferCost = Math.round(directCost * (firingLossPercent / 100));
  const totalBaseCost = directCost + bufferCost;
  const recommendedFairPrice = Math.round(totalBaseCost * 1.35); // 35% artisan profit margin
  const middlemanDistressPrice = Math.round(directCost * 0.75); // What local traders exploitatively pay

  const handleGenerateStory = () => {
    setIsGeneratingStory(true);
    setTimeout(() => {
      if (storyTone === 'Luxury') {
        setGeneratedStory(
          `An exquisite testament to Indian master pottery. Hand-thrown by national award artisan ${selectedCraft.artisanName}, this sculptural terracotta urn balances timeless tribal geometries with minimalist warmth. Pit-fired using organic wood fuel to achieve its deep mineral hue, it stands as an authentic conversation centerpiece for distinguished collectors.`
        );
      } else if (storyTone === 'Festive') {
        setGeneratedStory(
          `Infuse festive sacred warmth into your celebration. Hand-painted with auspicious folk motifs honoring the harvest sun and river deities, this piece radiates joy and positive energy. Certified authentic under ${selectedCraft.giTagNumber || 'Indian Craft Guild'}, direct from the master artisan’s wheel to your sanctuary.`
        );
      } else {
        setGeneratedStory(
          `Handcrafted in ${selectedCraft.state} by ${selectedCraft.artisanName}, this creation preserves ${selectedCraft.hoursToCraft} hours of patience and uncompromised artisanal discipline. 100% natural, biodegradable clay pigments with zero synthetic chemicals, connecting your home directly with authentic Indian heritage.`
        );
      }
      setIsGeneratingStory(false);
    }, 600);
  };

  const handleCopyStory = () => {
    navigator.clipboard.writeText(generatedStory);
    setCopiedStory(true);
    setTimeout(() => setCopiedStory(false), 2000);
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300">
            <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-slate-100">
            AI Market & Pricing Assistant
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Stop distress-selling to commission middlemen. Calculate real master hourly wages, formulate global market pricing, and generate poetic heritage storytelling for international buyers.
        </p>
      </div>

      {/* Craft Selector Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Select Craft:</span>
        {SAMPLE_CRAFTS.map((craft) => (
          <button
            key={craft.id}
            onClick={() => {
              setSelectedCraft(craft);
              setCraftHours(craft.hoursToCraft);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCraft.id === craft.id
                ? 'bg-teal-600 text-white shadow-2xs'
                : isDarkMode
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {craft.title}
          </button>
        ))}
      </div>

      {/* Two Column Assistant Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Interactive Fair Pricing Calculator (6 cols) */}
        <div className={`lg:col-span-6 rounded-2xl border p-5 sm:p-6 space-y-5 ${
          isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/80 pb-3">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Fair Artisan Wage & Price Calculator
              </h3>
            </div>
            <span className="text-[11px] font-mono text-teal-700 dark:text-teal-400 font-bold bg-teal-50 dark:bg-teal-900/50 px-2 py-0.5 rounded-md">
              Zero Exploitation
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Hours Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span>Handcrafting Labor Time</span>
                <span className="font-mono text-teal-600 font-bold">{craftHours} Hours</span>
              </div>
              <input
                type="range"
                min="4"
                max="48"
                value={craftHours}
                onChange={(e) => setCraftHours(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            {/* Master Wage Rate */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span>Artisan Wage Rate (per hour)</span>
                <span className="font-mono text-teal-600 font-bold">₹{hourlyWage}/hr</span>
              </div>
              <input
                type="range"
                min="60"
                max="300"
                step="10"
                value={hourlyWage}
                onChange={(e) => setHourlyWage(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            {/* Raw Material Cost */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span>Raw Materials (Clay, Pigments, Wood, Fuel)</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">₹{rawMaterialCost}</span>
              </div>
              <input
                type="range"
                min="50"
                max="1200"
                step="25"
                value={rawMaterialCost}
                onChange={(e) => setRawMaterialCost(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            {/* Firing & Breakage Risk Buffer */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-semibold">
                <span>Kiln Firing & Breakage Risk Allowance</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{firingLossPercent}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                value={firingLossPercent}
                onChange={(e) => setFiringLossPercent(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Pricing Results Summary */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 gradient-border-organic border-0 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                  Recommended Fair E-Commerce Price
                </span>
                <span className="text-2xl font-display font-extrabold text-teal-700 dark:text-teal-400">
                  ₹{recommendedFairPrice}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-red-500 font-semibold uppercase tracking-wider block">
                  Local Trader Distress Offer
                </span>
                <span className="text-lg font-display font-bold text-red-600 dark:text-red-400 line-through">
                  ₹{middlemanDistressPrice}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <span>Artisan Net Profit Margin: <strong>35% (₹{recommendedFairPrice - totalBaseCost})</strong></span>
              <span className="text-emerald-600 font-bold">+₹{recommendedFairPrice - middlemanDistressPrice} vs Middlemen</span>
            </div>
          </div>
        </div>

        {/* Right: AI Cultural Story & SEO Description Generator (6 cols) */}
        <div className={`lg:col-span-6 rounded-2xl border p-5 sm:p-6 space-y-5 ${
          isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/80 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                AI Cultural Storytelling Generator
              </h3>
            </div>
            
            {/* Tone Selector */}
            <div className="flex items-center gap-1">
              {(['Heritage', 'Luxury', 'Festive'] as const).map((tone) => (
                <button
                  key={tone}
                  onClick={() => setStoryTone(tone)}
                  className={`text-[11px] px-2 py-1 rounded-md font-semibold transition-all ${
                    storyTone === tone
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <textarea
                rows={6}
                value={generatedStory}
                onChange={(e) => setGeneratedStory(e.target.value)}
                className={`w-full p-3.5 rounded-xl border text-xs leading-relaxed focus:outline-hidden transition-colors ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-slate-100'
                    : 'bg-slate-50/70 border-slate-200 text-slate-800'
                }`}
              />
              {isGeneratingStory && (
                <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-2xs rounded-xl flex items-center justify-center text-white text-xs font-bold gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
                  <span>Weaving craft story with Gemini...</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleGenerateStory}
                disabled={isGeneratingStory}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Regenerate with {storyTone} Voice</span>
              </button>

              <button
                onClick={handleCopyStory}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                {copiedStory ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy to Clipboard</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Trending Global Keywords */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              High-Converting Global Search Tags (AI Suggested)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Authentic Terracotta Urn', 
                'Indian Handmade Home Decor', 
                'GI Certified Pottery', 
                'Wabi-Sabi Earthen Vessel', 
                'Zero-Chemical Pit Fired', 
                'Fair Trade Artisan Direct'
              ].map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-mono border border-teal-200/80 dark:border-teal-800/80"
                >
                  +{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
