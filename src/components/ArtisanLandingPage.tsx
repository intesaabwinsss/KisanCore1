import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Camera, 
  Users, 
  ShieldCheck, 
  Wallet, 
  ShoppingBag, 
  CheckCircle2, 
  Globe, 
  Sparkle, 
  Sliders, 
  Eye, 
  Award, 
  Layers, 
  Compass, 
  ChevronRight, 
  Heart,
  Play
} from 'lucide-react';
import { LanguageCode, CraftItem, PhotoThemeId, ActiveViewMode, NavSection } from '../types';
import { SAMPLE_CRAFTS, PHOTO_THEMES, MULTILINGUAL_STRINGS } from '../data/artisanData';

interface ArtisanLandingPageProps {
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onEnterDashboard: (section?: NavSection, viewMode?: ActiveViewMode) => void;
  onInspectProvenance: (craft: CraftItem) => void;
  onOpenMarketplace: () => void;
}

export const ArtisanLandingPage: React.FC<ArtisanLandingPageProps> = ({
  currentLanguage,
  onSelectLanguage,
  onEnterDashboard,
  onInspectProvenance,
  onOpenMarketplace,
}) => {
  const strings = MULTILINGUAL_STRINGS[currentLanguage] || MULTILINGUAL_STRINGS.en;

  // Interactive Live Studio Sandbox State on Landing Page
  const [sandboxCraftIndex, setSandboxCraftIndex] = useState(0);
  const [sandboxTheme, setSandboxTheme] = useState<PhotoThemeId>('rustic-earthy');
  const [sandboxSplit, setSandboxSplit] = useState(50);
  const [isSandboxComparing, setIsSandboxComparing] = useState(true);

  // Ecosystem Tab
  const [activeEcosystemTab, setActiveEcosystemTab] = useState<'artisan' | 'volunteer' | 'customer'>('artisan');

  // Selected Craft Cluster on Map
  const [selectedCluster, setSelectedCluster] = useState<number>(0);

  const currentSandboxCraft = SAMPLE_CRAFTS[sandboxCraftIndex];
  const activeSandboxResultImage = currentSandboxCraft.themeImages[sandboxTheme];

  const languageOptions: { code: LanguageCode; label: string; name: string }[] = [
    { code: 'en', label: 'A', name: 'English' },
    { code: 'hi', label: 'अ', name: 'Hindi' },
    { code: 'bn', label: 'অ', name: 'Bengali' },
    { code: 'ta', label: 'அ', name: 'Tamil' },
    { code: 'mr', label: 'म', name: 'Marathi' },
  ];

  const craftClusters = [
    { name: 'Gorakhpur & Pali Terracotta', state: 'Rajasthan / UP', craft: 'Terracotta Kalash & Murals', artisans: '1,420 Artisans', impact: '+52% income', image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80' },
    { name: 'Jaipur Blue Pottery Guild', state: 'Rajasthan', craft: 'Quartz Egyptian Glaze', artisans: '860 Artisans', impact: '+64% global sales', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80' },
    { name: 'Mithila / Madhubani Guild', state: 'Bihar', craft: 'Natural Pigment Bharni Art', artisans: '2,100 Artisans', impact: '88% women-led', image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=400&q=80' },
    { name: 'Rainawari Walnut Woodcraft', state: 'Kashmir', craft: 'Micro-Relief Chinar Carving', artisans: '640 Artisans', impact: '100% GI Protected', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-teal-500 selection:text-white">
      
      {/* 1. TOP HEADER (Exact Match of Screenshot 2) */}
      <header className="fixed top-0 inset-x-0 z-50 bg-slate-900/60 backdrop-blur-md border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <div className="relative">
                <Sparkle className="w-5 h-5 fill-white" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-300"></span>
              </div>
            </div>
            <span className="text-xl font-display font-extrabold text-white tracking-tight">
              KisanMandi
            </span>
          </div>

          {/* Right Header Navigation Items (Direct Match of Screenshot 2) */}
          <div className="flex items-center gap-3 sm:gap-6">
            
            {/* Language Switcher Pill (A, अ, অ, அ, म) */}
            <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/15">
              {languageOptions.map((opt) => (
                <button
                  key={opt.code}
                  id={`landing-lang-${opt.code}`}
                  onClick={() => onSelectLanguage(opt.code)}
                  title={opt.name}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                    currentLanguage === opt.code
                      ? 'bg-teal-500 text-white shadow-xs'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Enter as Guest */}
            <button
              id="btn-landing-guest"
              onClick={() => onEnterDashboard('dashboard', 'artisan')}
              className="text-xs sm:text-sm font-semibold text-white/90 hover:text-white transition-colors hidden sm:block"
            >
              {strings.enterAsGuest}
            </button>

            {/* Log In */}
            <button
              id="btn-landing-login"
              onClick={() => onEnterDashboard('dashboard', 'artisan')}
              className="text-xs sm:text-sm font-semibold text-white/90 hover:text-white transition-colors hidden md:block"
            >
              {strings.logIn}
            </button>

            {/* Get Started Button (Teal Pill) */}
            <button
              id="btn-landing-get-started"
              onClick={() => onEnterDashboard('photo-studio', 'artisan')}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-teal-500 hover:bg-teal-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-500/25 transition-all hover:scale-105 active:scale-95"
            >
              {strings.getStarted}
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION (Matches Screenshot 2 with Rich Indian Artisan Imagery & High-Contrast Typography) */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Fullscreen Rich Background Image with Ambient Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=2000&q=85"
            alt="Traditional Indian Artisan Crafting Pottery"
            className="w-full h-full object-cover object-center scale-105 filter brightness-75"
          />
          {/* Subtle dark gradient overlay for crystal clear text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/65 to-slate-950/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,23,42,0.6)_100%)]" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8">
          
          {/* Main Title (Screenshot 2 Match) */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold text-white tracking-tight drop-shadow-sm">
            KisanMandi
          </h1>

          {/* Subtitle Accent Line (Screenshot 2 Match in Mint/Teal) */}
          <p className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-teal-400 tracking-tight">
            {strings.tagline}
          </p>

          {/* Descriptive Body Copy (Screenshot 2 Match) */}
          <p className="text-sm sm:text-base md:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl mx-auto text-balance drop-shadow-xs">
            {strings.subTagline}
          </p>

          {/* CTA Buttons Row (Screenshot 2 Match) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              id="btn-hero-join-community"
              onClick={() => onEnterDashboard('photo-studio', 'artisan')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-teal-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{strings.joinCommunity}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn-hero-launch-studio"
              onClick={() => {
                const el = document.getElementById('interactive-studio-sandbox');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4 text-teal-400" />
              <span>Try AI Studio Live</span>
            </button>

            <button
              id="btn-hero-explore-marketplace"
              onClick={onOpenMarketplace}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-slate-800/80 hover:bg-slate-800 text-white font-semibold text-sm sm:text-base border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Shop Authentic Crafts</span>
            </button>
          </div>

          {/* Live Platform Highlights Pill */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>100% GI Heritage Authenticity</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>0% Artisan Commission Fee</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Photo Studio 3.0</span>
            </div>
          </div>
        </div>

        {/* Subtle bottom fade transition into the rest of the landing page */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* 3. INTERACTIVE LIVE AI PHOTO STUDIO SANDBOX (High Craftsmanship Interactive Demo) */}
      <section id="interactive-studio-sandbox" className="py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Instant Interactive Sandbox</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
              Test the AI Photo Studio Right Here
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Traditional artisans shoot photos using basic mobile phones in rural workshops. 
              Our AI instantly transforms raw photos into magazine-ready commercial sets with authentic cultural staging.
            </p>
          </div>

          {/* Interactive Playground Card */}
          <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-3xl gradient-border-organic border-0 shadow-xl overflow-hidden p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Sandbox Controls: Theme Selector & Craft Selector */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Step 1: Pick an Indian Craft
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {SAMPLE_CRAFTS.map((craft, idx) => (
                      <button
                        key={craft.id}
                        onClick={() => setSandboxCraftIndex(idx)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center gap-2 ${
                          sandboxCraftIndex === idx
                            ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <img src={craft.rawImage} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        <span className="truncate">{craft.title.split(' ')[0]} {craft.title.split(' ')[1]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Step 2: Click Any Studio Lighting Theme
                  </label>
                  <div className="grid grid-cols-2 gap-2.5 mt-2">
                    {PHOTO_THEMES.map((theme) => {
                      const isSelected = sandboxTheme === theme.id;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => setSandboxTheme(theme.id)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-xs ring-1 ring-teal-500/30'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="text-xs font-bold">{theme.name}</div>
                          <div className="text-[10px] text-slate-500 truncate mt-0.5">{theme.subtitle}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Craft Context & Price Impact */}
                <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-teal-950">Market Value Uplift</span>
                    <span className="font-bold text-emerald-700">
                      ₹{currentSandboxCraft.price} → ₹{currentSandboxCraft.marketSuggestedPrice} (+{Math.round(((currentSandboxCraft.marketSuggestedPrice - currentSandboxCraft.price) / currentSandboxCraft.price) * 100)}%)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    By enhancing lighting and providing GI verification, buyer inquiries jump 4.2x with zero discount requests.
                  </p>
                </div>

                {/* Launch Full Studio in Dashboard */}
                <button
                  onClick={() => onEnterDashboard('photo-studio', 'artisan')}
                  className="w-full py-3 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>Upload Your Own Craft in Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Right Sandbox Interactive Before/After Visualizer */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Interactive Before / After Comparison</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsSandboxComparing(!isSandboxComparing)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold"
                    >
                      {isSandboxComparing ? 'Split Mode' : 'Full Result'}
                    </button>
                  </div>
                </div>

                {/* Image Container with Slider */}
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-900 gradient-border-organic border-0 shadow-md select-none group">
                  {isSandboxComparing ? (
                    <>
                      {/* Enhanced Background */}
                      <img
                        src={activeSandboxResultImage}
                        alt="AI Studio Result"
                        className="absolute inset-0 w-full h-full object-cover"
                      />

                      {/* Raw Foreground with clip */}
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ clipPath: `polygon(0 0, ${sandboxSplit}% 0, ${sandboxSplit}% 100%, 0 100%)` }}
                      >
                        <img
                          src={currentSandboxCraft.rawImage}
                          alt="Raw Photo"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/70 text-white text-[10px] font-mono">
                          Raw Smartphone Shot
                        </div>
                      </div>

                      <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-teal-800/90 text-white text-[10px] font-mono">
                        Theme: {PHOTO_THEMES.find(t => t.id === sandboxTheme)?.name}
                      </div>

                      {/* Slider Bar */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-white shadow-xl cursor-ew-resize"
                        style={{ left: `${sandboxSplit}%` }}
                      >
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-800 shadow-lg flex items-center justify-center text-xs font-bold">
                          ⇄
                        </div>
                      </div>

                      <input
                        type="range"
                        min="5"
                        max="95"
                        value={sandboxSplit}
                        onChange={(e) => setSandboxSplit(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                      />
                    </>
                  ) : (
                    <img
                      src={activeSandboxResultImage}
                      alt="AI Studio Result"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Drag slider horizontally to see studio lighting difference</span>
                  <span className="font-mono text-teal-700 font-bold">4K Studio Lighting</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4. THE 3-WAY ECOSYSTEM (Artisans, Volunteers, Customers) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-wider text-teal-700 uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Community Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
              A Flourishing Ecosystem for Everyone
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Built to bridge the digital divide: connecting rural heritage creators with passionate global volunteers and mindful patrons.
            </p>
          </div>

          {/* Interactive Ecosystem Switcher Tabs */}
          <div className="flex items-center justify-center gap-2 max-w-md mx-auto p-1.5 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setActiveEcosystemTab('artisan')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeEcosystemTab === 'artisan'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Artisans
            </button>
            <button
              onClick={() => setActiveEcosystemTab('volunteer')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeEcosystemTab === 'volunteer'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Volunteers
            </button>
            <button
              onClick={() => setActiveEcosystemTab('customer')}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeEcosystemTab === 'customer'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Customers
            </button>
          </div>

          {/* Dynamic Tab Content Cards */}
          <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 gradient-border-organic border-0">
            {activeEcosystemTab === 'artisan' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white gradient-border-organic border-0 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <Camera className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">AI Photo Studio</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Convert raw phone camera snaps into e-commerce catalog photos with 4 curated lighting themes.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-white gradient-border-organic border-0 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">0% Commission Payouts</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    100% of fair customer payment lands directly in the artisan’s bank account via instant UPI.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-white gradient-border-organic border-0 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Digital Provenance</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Each craft receives a tamper-proof blockchain seal verifying geographic GI origin and master identity.
                  </p>
                </div>
              </div>
            )}

            {activeEcosystemTab === 'volunteer' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white gradient-border-organic border-0 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Skill Volunteering</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Contribute your skills in photography touch-ups, copy editing, or international packaging design.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-white gradient-border-organic border-0 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Multilingual Translation</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Translate rural artisan oral stories from Awadhi, Maithili, or Rajasthani into English, German, and French.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-white gradient-border-organic border-0 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Volunteer Badges & Hours</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Track verified community service hours and receive United Nations Sustainable Development impact recognition.
                  </p>
                </div>
              </div>
            )}

            {activeEcosystemTab === 'customer' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white gradient-border-organic border-0 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Direct From Masters</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Buy authentic Indian craft heritage without middlemen or commercial retail markups.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-white gradient-border-organic border-0 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Tamper-Proof Provenance</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Scan the certificate QR code on your parcel to see the master craftsman's video and GI tag validation.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-white gradient-border-organic border-0 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Cultural Preservation</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Keep ancient Indian craft lineages alive by sustaining generational artisan livelihood.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 5. CURATED HERITAGE MARKETPLACE SHOWCASE */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Live Verified Masterworks</span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 mt-1">
                Authentic Indian Handicrafts
              </h2>
            </div>
            <button
              onClick={onOpenMarketplace}
              className="text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1.5"
            >
              <span>View Full Marketplace Catalog</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Craft Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SAMPLE_CRAFTS.map((craft) => (
              <div
                key={craft.id}
                className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 rounded-2xl gradient-border-organic border-0 overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    <img
                      src={craft.themeImages['rustic-earthy']}
                      alt={craft.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-1 rounded-md bg-black/60 text-white text-[10px] font-mono">
                      {craft.craftCluster.split(' ')[0]}
                    </span>
                    {craft.giTagVerified && (
                      <span className="absolute top-2.5 right-2.5 px-2 py-1 rounded-md bg-teal-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                        <ShieldCheck className="w-3 h-3" />
                        <span>GI Certified</span>
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                      {craft.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      By {craft.artisanName} • {craft.state}
                    </p>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {craft.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-base font-extrabold text-slate-900">₹{craft.price}</span>
                    <span className="text-[10px] text-emerald-600 block font-medium">Direct to Artisan</span>
                  </div>
                  <button
                    onClick={() => onInspectProvenance(craft)}
                    className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-colors"
                  >
                    Provenance
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. IMPACT NUMBERS */}
      <section className="py-16 bg-teal-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-display font-extrabold text-teal-300">4,850+</p>
              <p className="text-xs sm:text-sm text-teal-100 font-medium">Master Artisans Onboarded</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-display font-extrabold text-teal-300">+48%</p>
              <p className="text-xs sm:text-sm text-teal-100 font-medium">Average Income Growth</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-display font-extrabold text-teal-300">100%</p>
              <p className="text-xs sm:text-sm text-teal-100 font-medium">Zero Platform Deductions</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-display font-extrabold text-teal-300">32</p>
              <p className="text-xs sm:text-sm text-teal-100 font-medium">Protected GI Craft Guilds</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-12 bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
              <Sparkle className="w-4 h-4 fill-white" />
            </div>
            <span className="text-sm font-display font-bold text-white">KisanMandi</span>
            <span className="text-slate-600">|</span>
            <span>Empowering Artisans, Preserving Heritage</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => onEnterDashboard('photo-studio', 'artisan')} className="hover:text-white transition-colors">
              AI Photo Studio
            </button>
            <button onClick={() => onEnterDashboard('volunteer-hub', 'volunteer')} className="hover:text-white transition-colors">
              Volunteer Hub
            </button>
            <button onClick={() => onEnterDashboard('provenance', 'artisan')} className="hover:text-white transition-colors">
              Digital Provenance
            </button>
            <button onClick={onOpenMarketplace} className="hover:text-white transition-colors">
              Marketplace
            </button>
          </div>

          <p className="text-slate-600">
            © 2026 KisanMandi. Empowering Indian Craft Clusters.
          </p>
        </div>
      </footer>

    </div>
  );
};
