export interface HistoricalDataPoint {
  date: string;
  displayDate: string;
  mandiPrice: number;
  kisanPrice: number;
  mspFloor: number;
  arrivalsMT: number;
  retailPrice: number;
  isForecast?: boolean;
}

export interface CropPriceTrendProfile {
  id: string;
  name: string;
  category: 'Vegetables' | 'Fruits' | 'Grains & Pulses';
  variety: string;
  unit: string;
  currentMandi: number;
  currentKisan: number;
  mspFloor: number;
  weeklyChangePercent: number;
  primaryMandi: string;
  highestPrice30D: number;
  lowestPrice30D: number;
  aiForecast7D: {
    targetPrice: number;
    trend: 'Bullish' | 'Bearish' | 'Stable';
    confidence: number;
    recommendedAction: string;
    catalysts: string[];
  };
  arbitrageMandis: {
    mandi: string;
    state: string;
    price: number;
    spread: number;
  }[];
  data7D: HistoricalDataPoint[];
  data30D: HistoricalDataPoint[];
  data3M: HistoricalDataPoint[];
  data1Y: HistoricalDataPoint[];
}

// Helper to generate realistic historical trend points
function generateTrendPoints(
  baseMandi: number,
  kisanPremiumPct: number,
  msp: number,
  volatility: number,
  trendSlope: number,
  baseArrivals: number,
  days: number,
  intervalDays: number = 1
): HistoricalDataPoint[] {
  const points: HistoricalDataPoint[] = [];
  const today = new Date();

  for (let i = days; i >= 0; i -= intervalDays) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const displayDate = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

    // deterministic pseudo-random wave based on day index
    const wave = Math.sin(i * 0.45) * volatility + Math.cos(i * 0.2) * (volatility * 0.6);
    const trendEffect = (days - i) * trendSlope;
    const mandiVal = Math.max(Math.round((baseMandi + wave + trendEffect) * 10) / 10, msp * 0.8);
    const kisanVal = Math.round(mandiVal * (1 + kisanPremiumPct / 100) * 10) / 10;
    const retailVal = Math.round((kisanVal * 1.35 + 5) * 10) / 10;
    const arrivalVal = Math.max(10, Math.round(baseArrivals - (wave * 8) + (Math.sin(i * 0.8) * (baseArrivals * 0.2))));

    points.push({
      date: dateStr,
      displayDate,
      mandiPrice: mandiVal,
      kisanPrice: kisanVal,
      mspFloor: msp,
      arrivalsMT: arrivalVal,
      retailPrice: retailVal,
      isForecast: false,
    });
  }

  return points;
}

// Add 3-day projection points to 7D & 30D datasets
function attachForecastPoints(
  history: HistoricalDataPoint[],
  targetForecast: number,
  kisanPremiumPct: number,
  msp: number
): HistoricalDataPoint[] {
  const result = [...history];
  const lastPoint = history[history.length - 1];
  const lastDate = new Date(lastPoint.date);

  const step = (targetForecast - lastPoint.mandiPrice) / 3;

  for (let i = 1; i <= 3; i++) {
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + i);
    const dateStr = nextDate.toISOString().split('T')[0];
    const displayDate = nextDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) + ' (Est)';
    const mandiVal = Math.round((lastPoint.mandiPrice + step * i) * 10) / 10;
    const kisanVal = Math.round(mandiVal * (1 + kisanPremiumPct / 100) * 10) / 10;

    result.push({
      date: dateStr,
      displayDate,
      mandiPrice: mandiVal,
      kisanPrice: kisanVal,
      mspFloor: msp,
      arrivalsMT: Math.round(lastPoint.arrivalsMT * 0.95),
      retailPrice: Math.round(kisanVal * 1.35 * 10) / 10,
      isForecast: true,
    });
  }

  return result;
}

export const CROP_PRICE_PROFILES: CropPriceTrendProfile[] = [
  // 1. Tomato
  {
    id: 'tomato',
    name: 'Tomato',
    category: 'Vegetables',
    variety: 'Hybrid Roma F1',
    unit: '₹/kg',
    currentMandi: 28,
    currentKisan: 34,
    mspFloor: 16,
    weeklyChangePercent: +8.5,
    primaryMandi: 'Pimpalgaon Baswant (Nashik)',
    highestPrice30D: 36,
    lowestPrice30D: 22,
    aiForecast7D: {
      targetPrice: 38,
      trend: 'Bullish',
      confidence: 94.2,
      recommendedAction: 'Hold non-perishable lots in cold reefer for 3-4 days; peak price window ahead.',
      catalysts: [
        'Southern corridor rains slowing tomato dispatches from Kolar',
        'Festival season institutional wholesale purchase orders +35%',
        'Nashik APMC daily arrivals down by 18% week-on-week'
      ]
    },
    arbitrageMandis: [
      { mandi: 'Azadpur', state: 'Delhi', price: 42, spread: +14 },
      { mandi: 'Vashi', state: 'Mumbai', price: 37, spread: +9 },
      { mandi: 'Kolar', state: 'Karnataka', price: 29, spread: +1 },
      { mandi: 'Surat', state: 'Gujarat', price: 34, spread: +6 },
    ],
    data7D: attachForecastPoints(generateTrendPoints(26, 21.4, 16, 1.8, 0.4, 420, 7), 38, 21.4, 16),
    data30D: attachForecastPoints(generateTrendPoints(22, 22.0, 16, 3.2, 0.25, 450, 30), 38, 22.0, 16),
    data3M: generateTrendPoints(20, 20.0, 16, 5.5, 0.1, 480, 90, 3),
    data1Y: generateTrendPoints(24, 21.0, 16, 9.0, 0.05, 500, 365, 12),
  },

  // 2. Onion
  {
    id: 'onion',
    name: 'Onion',
    category: 'Vegetables',
    variety: 'Nashik Garwa Red',
    unit: '₹/kg',
    currentMandi: 36,
    currentKisan: 43,
    mspFloor: 20,
    weeklyChangePercent: +6.2,
    primaryMandi: 'Lasalgaon APMC (Nashik)',
    highestPrice30D: 40,
    lowestPrice30D: 30,
    aiForecast7D: {
      targetPrice: 42,
      trend: 'Bullish',
      confidence: 91.8,
      recommendedAction: 'Direct supply to export buyers via KisanMandi reefer escrow for +20% gain.',
      catalysts: [
        'Bangladesh and UAE export container quotas expanding',
        'Buffer stock procurement by NAFED providing strong price floor',
        'Garwa storage losses reported low at <4% due to dry weather'
      ]
    },
    arbitrageMandis: [
      { mandi: 'Azadpur', state: 'Delhi', price: 46, spread: +10 },
      { mandi: 'Vashi', state: 'Mumbai', price: 42, spread: +6 },
      { mandi: 'Mahuva', state: 'Gujarat', price: 34, spread: -2 },
      { mandi: 'Kurnool', state: 'Andhra Pradesh', price: 38, spread: +2 },
    ],
    data7D: attachForecastPoints(generateTrendPoints(33, 19.4, 20, 1.2, 0.5, 850, 7), 42, 19.4, 20),
    data30D: attachForecastPoints(generateTrendPoints(29, 20.0, 20, 2.5, 0.25, 900, 30), 42, 20.0, 20),
    data3M: generateTrendPoints(25, 19.0, 20, 4.2, 0.12, 950, 90, 3),
    data1Y: generateTrendPoints(28, 20.0, 20, 8.5, 0.04, 980, 365, 12),
  },

  // 3. Potato
  {
    id: 'potato',
    name: 'Potato',
    category: 'Vegetables',
    variety: 'Kufri Jyoti (Chip Grade)',
    unit: '₹/kg',
    currentMandi: 22,
    currentKisan: 27,
    mspFloor: 14,
    weeklyChangePercent: -2.1,
    primaryMandi: 'Agra Mandi (Uttar Pradesh)',
    highestPrice30D: 25,
    lowestPrice30D: 20,
    aiForecast7D: {
      targetPrice: 24,
      trend: 'Stable',
      confidence: 88.5,
      recommendedAction: 'Dispatch chip-grade sorted potatoes directly to snack processors on B2B contracts.',
      catalysts: [
        'Cold stores operating at 82% inventory capacity in UP belt',
        'Steady processing demand from FMCG wafer manufacturers',
        'New crop sowings in Punjab on schedule'
      ]
    },
    arbitrageMandis: [
      { mandi: 'Azadpur', state: 'Delhi', price: 26, spread: +4 },
      { mandi: 'Kolkata Posta', state: 'West Bengal', price: 29, spread: +7 },
      { mandi: 'Vashi', state: 'Mumbai', price: 28, spread: +6 },
      { mandi: 'Farrukhabad', state: 'UP', price: 21, spread: -1 },
    ],
    data7D: attachForecastPoints(generateTrendPoints(23, 22.7, 14, 0.8, -0.1, 620, 7), 24, 22.7, 14),
    data30D: attachForecastPoints(generateTrendPoints(22, 22.5, 14, 1.4, 0.05, 650, 30), 24, 22.5, 14),
    data3M: generateTrendPoints(19, 21.0, 14, 2.5, 0.08, 680, 90, 3),
    data1Y: generateTrendPoints(20, 22.0, 14, 4.8, 0.02, 700, 365, 12),
  },

  // 4. Garlic
  {
    id: 'garlic',
    name: 'Garlic (Lahsun)',
    category: 'Vegetables',
    variety: 'Ooty & Mandsaur Giant Clove',
    unit: '₹/kg',
    currentMandi: 140,
    currentKisan: 165,
    mspFloor: 90,
    weeklyChangePercent: +12.4,
    primaryMandi: 'Mandsaur APMC (Madhya Pradesh)',
    highestPrice30D: 155,
    lowestPrice30D: 115,
    aiForecast7D: {
      targetPrice: 175,
      trend: 'Bullish',
      confidence: 96.0,
      recommendedAction: 'High export spread. Clean and grade into 35mm+ bulbs for premium auction.',
      catalysts: [
        'Low global crop yield in competing Mediterranean regions',
        'Domestic spice processing units stockpiling for winter production',
        'Mandsaur arrivals down by 28% due to farmers withholding dry stock'
      ]
    },
    arbitrageMandis: [
      { mandi: 'Azadpur', state: 'Delhi', price: 180, spread: +40 },
      { mandi: 'Vashi', state: 'Mumbai', price: 175, spread: +35 },
      { mandi: 'Neemuch', state: 'MP', price: 138, spread: -2 },
      { mandi: 'Kochi', state: 'Kerala', price: 195, spread: +55 },
    ],
    data7D: attachForecastPoints(generateTrendPoints(128, 17.8, 90, 4.5, 1.8, 180, 7), 175, 17.8, 90),
    data30D: attachForecastPoints(generateTrendPoints(115, 18.0, 90, 7.2, 0.9, 210, 30), 175, 18.0, 90),
    data3M: generateTrendPoints(95, 17.5, 90, 12.0, 0.5, 230, 90, 3),
    data1Y: generateTrendPoints(100, 18.0, 90, 22.0, 0.15, 250, 365, 12),
  },

  // 5. Capsicum
  {
    id: 'capsicum',
    name: 'Capsicum / Bell Pepper',
    category: 'Vegetables',
    variety: 'Indra F1 Polyhouse',
    unit: '₹/kg',
    currentMandi: 40,
    currentKisan: 48,
    mspFloor: 22,
    weeklyChangePercent: +7.0,
    primaryMandi: 'Narayangaon / Pune (Maharashtra)',
    highestPrice30D: 46,
    lowestPrice30D: 32,
    aiForecast7D: {
      targetPrice: 52,
      trend: 'Bullish',
      confidence: 90.4,
      recommendedAction: 'Direct supply to hospitality chains in Mumbai and Pune for consistent ₹48/kg.',
      catalysts: [
        'QSR pizza chains increased weekly contract volumes by 20%',
        'Polyhouse harvest yield in Belgaum constrained by high humidity',
        'Grade A 4-lobe blocky bell peppers commanding 25% premium'
      ]
    },
    arbitrageMandis: [
      { mandi: 'Vashi', state: 'Mumbai', price: 54, spread: +14 },
      { mandi: 'Bengaluru Yeshwantpur', state: 'Karnataka', price: 46, spread: +6 },
      { mandi: 'Ahmedabad', state: 'Gujarat', price: 48, spread: +8 },
      { mandi: 'Nashik', state: 'Maharashtra', price: 38, spread: -2 },
    ],
    data7D: attachForecastPoints(generateTrendPoints(36, 20.0, 22, 1.5, 0.6, 210, 7), 52, 20.0, 22),
    data30D: attachForecastPoints(generateTrendPoints(32, 20.5, 22, 2.8, 0.3, 230, 30), 52, 20.5, 22),
    data3M: generateTrendPoints(28, 19.5, 22, 4.5, 0.15, 250, 90, 3),
    data1Y: generateTrendPoints(34, 20.0, 22, 7.5, 0.03, 270, 365, 12),
  },

  // 6. Royal Delicious Apple
  {
    id: 'apple',
    name: 'Apple',
    category: 'Fruits',
    variety: 'Shimla Royal Delicious',
    unit: '₹/kg',
    currentMandi: 118,
    currentKisan: 140,
    mspFloor: 75,
    weeklyChangePercent: +4.8,
    primaryMandi: 'Shimla / Parwanoo (Himachal Pradesh)',
    highestPrice30D: 125,
    lowestPrice30D: 102,
    aiForecast7D: {
      targetPrice: 132,
      trend: 'Bullish',
      confidence: 93.0,
      recommendedAction: 'Utilize CA cold-storage chambers; release Grade A+ extra-fancy cartons gradually.',
      catalysts: [
        'High-altitude orchard harvest entering peak color grade phase',
        'Festival gift-hamper demand surging across metro cities',
        'Imported Washington apple tariffs keeping domestic rates buoyant'
      ]
    },
    arbitrageMandis: [
      { mandi: 'Azadpur', state: 'Delhi', price: 148, spread: +30 },
      { mandi: 'Vashi', state: 'Mumbai', price: 160, spread: +42 },
      { mandi: 'Koyambedu', state: 'Chennai', price: 172, spread: +54 },
      { mandi: 'Chandigarh', state: 'Punjab', price: 128, spread: +10 },
    ],
    data7D: attachForecastPoints(generateTrendPoints(112, 18.6, 75, 2.8, 1.0, 340, 7), 132, 18.6, 75),
    data30D: attachForecastPoints(generateTrendPoints(104, 19.0, 75, 5.0, 0.5, 380, 30), 132, 19.0, 75),
    data3M: generateTrendPoints(92, 18.0, 75, 9.0, 0.3, 410, 90, 3),
    data1Y: generateTrendPoints(110, 18.5, 75, 18.0, 0.05, 450, 365, 12),
  },

  // 7. Nagpur Mandarin Orange
  {
    id: 'orange',
    name: 'Nagpur Orange (Santra)',
    category: 'Fruits',
    variety: 'Mridia Bahar Crop',
    unit: '₹/kg',
    currentMandi: 52,
    currentKisan: 65,
    mspFloor: 32,
    weeklyChangePercent: +9.2,
    primaryMandi: 'Nagpur Cotton Market (Maharashtra)',
    highestPrice30D: 58,
    lowestPrice30D: 44,
    aiForecast7D: {
      targetPrice: 62,
      trend: 'Bullish',
      confidence: 89.6,
      recommendedAction: 'Direct supply to industrial juicing and urban retail packs for 25% price bump.',
      catalysts: [
        'Mridia Bahar crop sugar-acid ratio at optimum 11.5 Brix',
        'Heavy procurement by Southern retail supermarket chains',
        'Cold-chain reefers cutting transit weight loss from 8% to <1%'
      ]
    },
    arbitrageMandis: [
      { mandi: 'Kolkata Posta', state: 'West Bengal', price: 74, spread: +22 },
      { mandi: 'Vashi', state: 'Mumbai', price: 68, spread: +16 },
      { mandi: 'Azadpur', state: 'Delhi', price: 70, spread: +18 },
      { mandi: 'Amravati', state: 'Maharashtra', price: 50, spread: -2 },
    ],
    data7D: attachForecastPoints(generateTrendPoints(47, 25.0, 32, 1.8, 0.8, 280, 7), 62, 25.0, 32),
    data30D: attachForecastPoints(generateTrendPoints(42, 24.0, 32, 3.2, 0.4, 300, 30), 62, 24.0, 32),
    data3M: generateTrendPoints(38, 23.0, 32, 6.0, 0.2, 330, 90, 3),
    data1Y: generateTrendPoints(45, 24.0, 32, 11.0, 0.03, 350, 365, 12),
  },

  // 8. Sharbati Wheat
  {
    id: 'wheat',
    name: 'Wheat (Gehun)',
    category: 'Grains & Pulses',
    variety: 'MP Sharbati C-306 Golden',
    unit: '₹/qtl',
    currentMandi: 2900,
    currentKisan: 3500,
    mspFloor: 2275,
    weeklyChangePercent: +3.2,
    primaryMandi: 'Sehore Mandi (Madhya Pradesh)',
    highestPrice30D: 3050,
    lowestPrice30D: 2750,
    aiForecast7D: {
      targetPrice: 3100,
      trend: 'Bullish',
      confidence: 95.5,
      recommendedAction: 'Hold premium Sharbati grain in hermetic silos; chakki flour mills paying high premium.',
      catalysts: [
        'Government MSP increased to ₹2,275/qtl establishing strong floor',
        'High protein (>14%) Sharbati lot demand from premium packaged flour brands',
        'Stable export demand from Southeast Asian markets'
      ]
    },
    arbitrageMandis: [
      { mandi: 'Khanna', state: 'Punjab', price: 2950, spread: +50 },
      { mandi: 'Hapur', state: 'UP', price: 2880, spread: -20 },
      { mandi: 'Kota', state: 'Rajasthan', price: 2920, spread: +20 },
      { mandi: 'Surat', state: 'Gujarat', price: 3150, spread: +250 },
    ],
    data7D: attachForecastPoints(generateTrendPoints(2820, 20.7, 2275, 40, 15, 1200, 7), 3100, 20.7, 2275),
    data30D: attachForecastPoints(generateTrendPoints(2720, 21.0, 2275, 75, 8, 1250, 30), 3100, 21.0, 2275),
    data3M: generateTrendPoints(2550, 20.0, 2275, 120, 4, 1300, 90, 3),
    data1Y: generateTrendPoints(2600, 20.5, 2275, 210, 1.2, 1400, 365, 12),
  },

  // 9. Pusa 1121 Basmati Rice
  {
    id: 'basmati_rice',
    name: 'Basmati Rice (Paddy)',
    category: 'Grains & Pulses',
    variety: 'Pusa 1121 Extra Long',
    unit: '₹/qtl',
    currentMandi: 8400,
    currentKisan: 9500,
    mspFloor: 4800,
    weeklyChangePercent: +5.0,
    primaryMandi: 'Taraori / Karnal (Haryana)',
    highestPrice30D: 8700,
    lowestPrice30D: 7900,
    aiForecast7D: {
      targetPrice: 8900,
      trend: 'Bullish',
      confidence: 92.5,
      recommendedAction: 'Export miller RFQs active on B2B portal; lock in contracts for 50MT+ lots.',
      catalysts: [
        'Saudi Arabia and Iran opening major Basmati import tenders',
        'Aged steam paddy inventory low at private millers',
        '8.35mm raw grain length lots receiving 12% export premium'
      ]
    },
    arbitrageMandis: [
      { mandi: 'Amritsar', state: 'Punjab', price: 8600, spread: +200 },
      { mandi: 'Kaithal', state: 'Haryana', price: 8350, spread: -50 },
      { mandi: 'Najafgarh', state: 'Delhi', price: 8550, spread: +150 },
      { mandi: 'Bundi', state: 'Rajasthan', price: 8200, spread: -200 },
    ],
    data7D: attachForecastPoints(generateTrendPoints(8100, 13.1, 4800, 90, 45, 1600, 7), 8900, 13.1, 4800),
    data30D: attachForecastPoints(generateTrendPoints(7800, 13.5, 4800, 160, 22, 1700, 30), 8900, 13.5, 4800),
    data3M: generateTrendPoints(7200, 13.0, 4800, 280, 14, 1800, 90, 3),
    data1Y: generateTrendPoints(7500, 13.2, 4800, 520, 3.5, 1900, 365, 12),
  },

  // 10. Tur Dal / Red Gram
  {
    id: 'tur_dal',
    name: 'Tur Dal (Red Gram / Arhar)',
    category: 'Grains & Pulses',
    variety: 'Kalaburagi Maruti GI',
    unit: '₹/qtl',
    currentMandi: 12800,
    currentKisan: 14500,
    mspFloor: 7550,
    weeklyChangePercent: +3.8,
    primaryMandi: 'Kalaburagi APMC (Karnataka)',
    highestPrice30D: 13200,
    lowestPrice30D: 12100,
    aiForecast7D: {
      targetPrice: 13500,
      trend: 'Bullish',
      confidence: 94.0,
      recommendedAction: 'Direct supply to regional dal millers via digital escrow for ₹145/kg net.',
      catalysts: [
        'Domestic pulse buffer procurement active under PM-AASHA',
        'Quick-cooking GI Kalaburagi variety commanding brand loyalty',
        'Sowing acreage in Maharashtra slightly constrained by erratic monsoon'
      ]
    },
    arbitrageMandis: [
      { mandi: 'Latur', state: 'Maharashtra', price: 13050, spread: +250 },
      { mandi: 'Akola', state: 'Maharashtra', price: 12900, spread: +100 },
      { mandi: 'Tandur', state: 'Telangana', price: 12750, spread: -50 },
      { mandi: 'Indore', state: 'MP', price: 13200, spread: +400 },
    ],
    data7D: attachForecastPoints(generateTrendPoints(12400, 13.3, 7550, 120, 60, 540, 7), 13500, 13.3, 7550),
    data30D: attachForecastPoints(generateTrendPoints(11900, 13.5, 7550, 220, 32, 580, 30), 13500, 13.5, 7550),
    data3M: generateTrendPoints(11200, 13.0, 7550, 420, 18, 620, 90, 3),
    data1Y: generateTrendPoints(10800, 13.2, 7550, 750, 6.0, 650, 365, 12),
  },

  // 11. Pomegranate (Bhagwa)
  {
    id: 'pomegranate',
    name: 'Pomegranate (Anaar)',
    category: 'Fruits',
    variety: 'Bhagwa Super Red',
    unit: '₹/kg',
    currentMandi: 110,
    currentKisan: 135,
    mspFloor: 65,
    weeklyChangePercent: +6.5,
    primaryMandi: 'Solapur APMC (Maharashtra)',
    highestPrice30D: 120,
    lowestPrice30D: 98,
    aiForecast7D: {
      targetPrice: 124,
      trend: 'Bullish',
      confidence: 91.0,
      recommendedAction: 'Pre-cool lots at 5°C and dispatch via refrigerated containers for zero aril browning.',
      catalysts: [
        'European export pesticide residue clearance MRL compliance 100%',
        'High antioxidant health demand driving institutional supermarket contracts',
        'Solapur arrivals lower due to tight orchard grading'
      ]
    },
    arbitrageMandis: [
      { mandi: 'Vashi', state: 'Mumbai', price: 145, spread: +35 },
      { mandi: 'Azadpur', state: 'Delhi', price: 152, spread: +42 },
      { mandi: 'Ahmednagar', state: 'Maharashtra', price: 112, spread: +2 },
      { mandi: 'Bengaluru', state: 'Karnataka', price: 138, spread: +28 },
    ],
    data7D: attachForecastPoints(generateTrendPoints(104, 22.7, 65, 2.5, 0.9, 195, 7), 124, 22.7, 65),
    data30D: attachForecastPoints(generateTrendPoints(96, 23.0, 65, 4.5, 0.45, 220, 30), 124, 23.0, 65),
    data3M: generateTrendPoints(88, 22.0, 65, 7.8, 0.25, 240, 90, 3),
    data1Y: generateTrendPoints(100, 22.5, 65, 14.0, 0.04, 260, 365, 12),
  },

  // 12. Desi Chana / Chickpeas
  {
    id: 'chana',
    name: 'Chickpeas (Chana)',
    category: 'Grains & Pulses',
    variety: 'Vijay Desi Brown',
    unit: '₹/qtl',
    currentMandi: 6600,
    currentKisan: 7800,
    mspFloor: 5440,
    weeklyChangePercent: +4.2,
    primaryMandi: 'Latur APMC (Maharashtra)',
    highestPrice30D: 6850,
    lowestPrice30D: 6200,
    aiForecast7D: {
      targetPrice: 7000,
      trend: 'Bullish',
      confidence: 93.4,
      recommendedAction: 'Besan millers active on B2B procurement; lock forward rate above ₹7,800/qtl.',
      catalysts: [
        'Festive sweet-making season demand driving massive besan milling',
        'NAFED buffer procurement holding floor at MSP + 20%',
        'Import parity from Australia costing higher due to freight rates'
      ]
    },
    arbitrageMandis: [
      { mandi: 'Bikaner', state: 'Rajasthan', price: 6750, spread: +150 },
      { mandi: 'Indore', state: 'MP', price: 6800, spread: +200 },
      { mandi: 'Akola', state: 'Maharashtra', price: 6580, spread: -20 },
      { mandi: 'Gulbarga', state: 'Karnataka', price: 6650, spread: +50 },
    ],
    data7D: attachForecastPoints(generateTrendPoints(6350, 18.2, 5440, 60, 38, 720, 7), 7000, 18.2, 5440),
    data30D: attachForecastPoints(generateTrendPoints(6100, 18.5, 5440, 110, 18, 760, 30), 7000, 18.5, 5440),
    data3M: generateTrendPoints(5700, 18.0, 5440, 190, 10, 800, 90, 3),
    data1Y: generateTrendPoints(5900, 18.3, 5440, 340, 2.5, 830, 365, 12),
  }
];
