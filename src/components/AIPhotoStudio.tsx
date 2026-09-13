import React, { useState } from 'react';
import { 
  Box, 
  Sparkles, 
  Feather, 
  Flame, 
  Upload, 
  Download, 
  ShoppingBag, 
  Share2, 
  RefreshCw, 
  Check, 
  Sliders, 
  Wand2, 
  Eye, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import { PhotoThemeId, CraftItem, LanguageCode } from '../types';
import { PHOTO_THEMES, SAMPLE_CRAFTS, MULTILINGUAL_STRINGS } from '../data/artisanData';

interface AIPhotoStudioProps {
  currentLanguage: LanguageCode;
  onPublishToMarketplace?: (craft: CraftItem) => void;
  isDarkMode?: boolean;
}

export const AIPhotoStudio: React.FC<AIPhotoStudioProps> = ({
  currentLanguage,
  onPublishToMarketplace,
  isDarkMode = false,
}) => {
  const strings = MULTILINGUAL_STRINGS[currentLanguage] || MULTILINGUAL_STRINGS.en;

  // Selected craft from presets or custom
  const [selectedCraftIndex, setSelectedCraftIndex] = useState(0);
  const currentCraft = SAMPLE_CRAFTS[selectedCraftIndex];

  // Theme selection: defaults to 'rustic-earthy' exactly matching Image 1
  const [selectedTheme, setSelectedTheme] = useState<PhotoThemeId>('rustic-earthy');
  
  // Custom detail prompt: defaults to 'make it look authentic' matching Image 1
  const [additionalDetails, setAdditionalDetails] = useState('make it look authentic');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'result' | 'split' | 'original'>('result');
  const [splitSliderPosition, setSplitSliderPosition] = useState(50);
  const [showListingDrawer, setShowListingDrawer] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Custom uploaded image state
  const [customImage, setCustomImage] = useState<string | null>(null);

  // Get active raw and result images
  const rawImage = customImage || currentCraft.rawImage;
  const resultImage = currentCraft.themeImages[selectedTheme] || currentCraft.themeImages['rustic-earthy'];

  const handleSelectPreset = (index: number) => {
    setCustomImage(null);
    setSelectedCraftIndex(index);
    setPublishSuccess(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImage(event.target.result as string);
          setPublishSuccess(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            setViewMode('result');
          }, 300);
          return 100;
        }
        return prev + 15;
      });
    }, 120);
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);

    // Trigger simulated file download
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `${currentCraft.title.replace(/\s+/g, '_')}_${selectedTheme}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePublish = () => {
    setPublishSuccess(true);
    if (onPublishToMarketplace) {
      onPublishToMarketplace({
        ...currentCraft,
        currentResultImage: resultImage,
      });
    }
  };

  const promptSuggestions = [
    'make it look authentic',
    'placed on reclaimed raw teak wood with dried Indian spices',
    'warm morning sunlight streaming from an earthen courtyard window',
    'minimalist white marble pedestal with soft drop shadows',
    'festive marigold flowers and glowing brass diyas',
  ];

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      
      {/* Studio Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-slate-100">
            {strings.aiPhotoStudio}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Turn smartphone craft photos into commercial, studio-lit e-commerce imagery in seconds.
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Craft Samples:</span>
          {SAMPLE_CRAFTS.map((craft, idx) => (
            <button
              key={craft.id}
              onClick={() => handleSelectPreset(idx)}
              className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                selectedCraftIndex === idx && !customImage
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : isDarkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {craft.title.split(' ')[0]} {craft.title.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Two-Column Grid (Direct match of User Image 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* LEFT COLUMN: 1. Upload, 2. Theme Selection, 3. Details (5 or 6 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* STEP 1: Upload Your Photo */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>{strings.uploadYourPhoto}</span>
              </h3>
              <label 
                htmlFor="photo-upload-input" 
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New</span>
              </label>
              <input 
                id="photo-upload-input" 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </div>

            {/* Dotted Upload Dropzone (Matches Screenshot 1) */}
            <div 
              id="photo-upload-dropzone"
              className={`border-2 border-dashed rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center transition-all relative overflow-hidden group ${
                isDarkMode 
                  ? 'border-slate-700 bg-slate-800/50 hover:border-teal-500' 
                  : 'border-slate-300 bg-slate-50/70 hover:border-teal-500'
              }`}
            >
              <div className="relative w-48 sm:w-56 h-48 sm:h-56 rounded-xl overflow-hidden shadow-sm gradient-border-organic border-0 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center">
                <img 
                  src={rawImage} 
                  alt="Raw Craft Upload" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label 
                    htmlFor="photo-upload-input" 
                    className="px-3 py-1.5 rounded-lg bg-white/90 text-slate-900 text-xs font-bold shadow-md cursor-pointer hover:bg-white flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
                    Replace Image
                  </label>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-mono">{customImage ? 'Custom Photo' : currentCraft.title}</span>
                <span>•</span>
                <span>Ready for Studio Enhancer</span>
              </div>
            </div>
          </div>

          {/* STEP 2: Choose a Theme (Optional) - 2x2 Grid Matching Screenshot 1 */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {strings.chooseTheme}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PHOTO_THEMES.map((theme) => {
                const isSelected = selectedTheme === theme.id;
                
                return (
                  <button
                    key={theme.id}
                    id={`theme-card-${theme.id}`}
                    type="button"
                    onClick={() => {
                      setSelectedTheme(theme.id);
                      setPublishSuccess(false);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? isDarkMode
                          ? 'border-teal-400 bg-teal-950/40 shadow-xs ring-1 ring-teal-400/50'
                          : 'border-teal-500 bg-teal-50/50 shadow-xs ring-1 ring-teal-500/30'
                        : isDarkMode
                          ? 'border-slate-700/80 bg-slate-800/60 hover:border-slate-600'
                          : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div>
                      {/* Icon */}
                      <div className="mb-2">
                        {theme.id === 'clean-modern' && (
                          <Box className={`w-5 h-5 ${isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                        )}
                        {theme.id === 'vibrant-celebration' && (
                          <Sparkles className={`w-5 h-5 ${isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                        )}
                        {theme.id === 'creative-showcase' && (
                          <Feather className={`w-5 h-5 ${isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                        )}
                        {theme.id === 'rustic-earthy' && (
                          <Flame className={`w-5 h-5 ${isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                        )}
                      </div>

                      {/* Title */}
                      <h4 className={`text-sm font-bold leading-snug ${
                        isSelected ? 'text-teal-900 dark:text-teal-200' : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {theme.name}
                      </h4>

                      {/* Subtitle */}
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {theme.subtitle}
                      </p>
                    </div>

                    {isSelected && (
                      <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-teal-500 ring-2 ring-white dark:ring-slate-900"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Add More Details (Optional) - Matching Screenshot 1 */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {strings.addMoreDetails}
            </h3>

            <div className="space-y-2">
              <textarea
                id="photo-details-input"
                rows={2}
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                placeholder="make it look authentic"
                className={`w-full p-3 rounded-xl border text-xs leading-relaxed focus:outline-hidden transition-colors resize-none ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-teal-400'
                    : 'bg-white border-slate-300 text-slate-800 focus:border-teal-500'
                }`}
              />

              {/* Suggested detail chips */}
              <div className="flex flex-wrap gap-1.5">
                {promptSuggestions.slice(0, 3).map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAdditionalDetails(prompt)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-teal-50 hover:text-teal-700 dark:hover:text-teal-300 gradient-border-organic border-0 dark:border-slate-700 transition-colors"
                  >
                    + {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            id="btn-generate-studio-photo"
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-3.5 px-5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
              isGenerating
                ? 'bg-teal-700 text-white opacity-80 cursor-wait'
                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/25 hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Generating Studio Shot... ({generationProgress}%)</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-teal-200" />
                <span>{strings.generateButton}</span>
              </>
            )}
          </button>
        </div>

        {/* RIGHT COLUMN: Result Preview (7 cols) - Direct Match of User Image 1 */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {strings.result}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono font-bold border border-emerald-200 dark:border-emerald-800">
                4K Studio Quality
              </span>
            </div>

            {/* View Mode Switcher: Result, Split Slider, Original */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('result')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  viewMode === 'result'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Studio Shot
              </button>
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                  viewMode === 'split'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sliders className="w-3 h-3" />
                <span>Split Compare</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('original')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  viewMode === 'original'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Original
              </button>
            </div>
          </div>

          {/* Large Result Visualizer (Matches Screenshot 1) */}
          <div 
            id="studio-result-display"
            className="rounded-2xl gradient-border-organic border-0 dark:border-slate-700 overflow-hidden bg-slate-950 relative shadow-md group"
          >
            {/* Standard Result View */}
            {viewMode === 'result' && (
              <div className="relative aspect-4/5 sm:aspect-16/11 w-full bg-slate-900 flex items-center justify-center overflow-hidden">
                <img
                  src={resultImage}
                  alt="Enhanced Studio Result"
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    isGenerating ? 'opacity-30 blur-xs' : 'opacity-100'
                  }`}
                />

                {isGenerating && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-xs p-6 text-center text-white space-y-3">
                    <div className="w-12 h-12 rounded-full border-4 border-teal-400 border-t-transparent animate-spin" />
                    <p className="text-sm font-bold">Composing Studio Lighting...</p>
                    <p className="text-xs text-slate-300 max-w-xs">
                      Applying {PHOTO_THEMES.find(t => t.id === selectedTheme)?.lightingDescription}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Split Slider Compare View */}
            {viewMode === 'split' && (
              <div className="relative aspect-4/5 sm:aspect-16/11 w-full bg-slate-900 select-none overflow-hidden">
                {/* Background Image (Enhanced Result) */}
                <img
                  src={resultImage}
                  alt="Enhanced Studio Result"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Foreground Image (Original Raw) Clipped */}
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `polygon(0 0, ${splitSliderPosition}% 0, ${splitSliderPosition}% 100%, 0 100%)` }}
                >
                  <img
                    src={rawImage}
                    alt="Original Raw"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/60 text-white text-[10px] font-mono">
                    Before: Raw Smartphone Photo
                  </div>
                </div>

                <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-teal-800/80 text-white text-[10px] font-mono">
                  After: AI Studio Shot
                </div>

                {/* Slider divider line and handle */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-lg"
                  style={{ left: `${splitSliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white text-slate-800 shadow-md flex items-center justify-center text-[10px] font-bold">
                    ⇄
                  </div>
                </div>

                {/* Range Slider for Interaction */}
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={splitSliderPosition}
                  onChange={(e) => setSplitSliderPosition(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                />
              </div>
            )}

            {/* Original View */}
            {viewMode === 'original' && (
              <div className="relative aspect-4/5 sm:aspect-16/11 w-full bg-slate-900 flex items-center justify-center overflow-hidden">
                <img
                  src={rawImage}
                  alt="Original Raw"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 text-white text-xs font-mono">
                  Original Raw Upload
                </div>
              </div>
            )}

            {/* Floating Metadata Tag over image */}
            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Theme: <strong>{PHOTO_THEMES.find(t => t.id === selectedTheme)?.name}</strong></span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-300">Ready for E-Commerce</span>
            </div>
          </div>

          {/* Action Toolbar Below Result (Download, Publish, Copy, Story) */}
          <div className="p-4 rounded-xl gradient-border-organic border-0 dark:border-slate-700 bg-white dark:bg-slate-800/80 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {currentCraft.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  By {currentCraft.artisanName} • {currentCraft.craftCluster}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Download Button */}
                <button
                  id="btn-download-studio-shot"
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs"
                >
                  {downloadSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Downloaded!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>{strings.downloadHd}</span>
                    </>
                  )}
                </button>

                {/* AI Listing Copy Details Toggle */}
                <button
                  id="btn-toggle-listing-details"
                  type="button"
                  onClick={() => setShowListingDrawer(!showListingDrawer)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold hover:bg-teal-100 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>AI Listing Copy</span>
                </button>

                {/* Publish to Storefront Button */}
                <button
                  id="btn-publish-to-marketplace"
                  type="button"
                  onClick={handlePublish}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    publishSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`}
                >
                  {publishSuccess ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>Published!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{strings.publishMarketplace}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Expandable AI Listing Generator Drawer */}
            {showListingDrawer && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 gradient-border-organic border-0 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wide text-[10px]">
                      AI Auto-Generated E-Commerce Listing
                    </span>
                    <span className="text-[11px] font-mono text-emerald-600 font-bold">
                      Recommended: ₹{currentCraft.marketSuggestedPrice} (Base: ₹{currentCraft.price})
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-xs">
                    Title: {currentCraft.title} ({PHOTO_THEMES.find(t => t.id === selectedTheme)?.name} Edition)
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    "{currentCraft.description} Handcrafted by master artisan {currentCraft.artisanName} in {currentCraft.state}, certified under {currentCraft.giTagNumber || 'GI Heritage Guild'}."
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {currentCraft.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
