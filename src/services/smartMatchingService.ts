import {
  MatchingFarmerListing,
  MatchingBuyerRequirement,
  SmartMatch,
  MultiFarmerBundle,
  MatchingConfig,
  ScoreBreakdown,
  MatchQualityRating,
  MatchingGeoLocation,
  MatchingAnalyticsData,
  DeliveryCostConfig,
} from '../types';

// ==========================================
// 1. Central Config & Weights Configuration
// ==========================================

export const DEFAULT_MATCHING_CONFIG: MatchingConfig = {
  weights: {
    product: 25,
    quantity: 15,
    distance: 15,
    price: 15,
    delivery: 10,
    demand: 8,
    harvest: 7,
    freshness: 5,
  },
  maxDistanceKm: 400,
  minMatchScoreThreshold: 35,
  deliveryCostParams: {
    baseCost: 350,            // ₹350 base loading & dispatch cost
    ratePerKm: 12.5,          // ₹12.5 per km transport rate
    perKgHandlingRate: 0.65,  // ₹0.65 per kg handling & crate fee
    vehicleCapacityKg: 3000,
  },
  productShelfLifeDays: {
    'Tomato': 6,
    'Onion': 45,
    'Potato': 60,
    'Apple': 28,
    'Basmati Rice': 365,
    'Wheat': 365,
    'Capsicum': 14,
    'Green Peas': 7,
    'Garlic': 90,
    'Spinach': 4,
    'Okra (Bhindi)': 7,
    'Carrot': 20,
    'Brinjal (Baingan)': 8,
    'Green Chilli': 14,
    'Ginger': 40,
    'Lemon (Nimbu)': 25,
    'Orange (Santra)': 21,
    'Grapes': 28,
    'Pomegranate (Anaar)': 35,
    'Banana': 9,
    'Tur Dal (Red Gram)': 365,
    'Chickpeas (Chana)': 365,
    'Moong Dal (Green Gram)': 365,
    'Pearl Millet (Bajra)': 240,
    'Gobindobhog Rice': 365,
    'Red Chilli': 180,
    'Mango': 12,
  },
  urgencyBonusDays: {
    urgent: 1,
    high: 3,
    medium: 7,
    low: 14,
  },
};

// ==========================================
// 2. Canonical Demo Dataset (Farmers & Buyers)
// ==========================================

export const DEMO_FARMER_LISTINGS: MatchingFarmerListing[] = [
  {
    id: 'farmer-listing-a',
    farmerId: 'farmer-a',
    farmerName: 'Farmer A (Raghuvir Yadav)',
    farmerPhone: '+91 98101 22340',
    farmName: 'Raghuvir Eco-Farms',
    cropName: 'Tomato',
    variety: 'Abhinav Hybrid F1',
    category: 'Vegetables',
    quantityAvailableKg: 500,
    initialQuantityKg: 500,
    reservedQuantityKg: 0,
    unit: 'kg',
    minimumPricePerKg: 18,
    qualityGrade: 'A',
    harvestDate: '2026-09-10',
    shelfLifeDays: 6,
    location: {
      name: 'Greater Noida',
      district: 'Gautam Buddha Nagar',
      state: 'Uttar Pradesh',
      latitude: 28.4744,
      longitude: 77.5040,
    },
    isOrganic: true,
    chemicalFree: true,
    coldChainStored: true,
    packagingType: 'Crates (25kg plastic ventilated)',
    status: 'active',
    notes: 'Firm vine-ripened Roma tomatoes, ideal for restaurant salads and curries.',
    isDemoData: true,
  },
  {
    id: 'farmer-listing-b',
    farmerId: 'farmer-b',
    farmerName: 'Farmer B (Satish Tyagi)',
    farmerPhone: '+91 98112 55670',
    farmName: 'Hindon Valley Green Produce',
    cropName: 'Tomato',
    variety: 'Abhinav Hybrid F1',
    category: 'Vegetables',
    quantityAvailableKg: 300,
    initialQuantityKg: 300,
    reservedQuantityKg: 0,
    unit: 'kg',
    minimumPricePerKg: 17,
    qualityGrade: 'A',
    harvestDate: '2026-09-09',
    shelfLifeDays: 6,
    location: {
      name: 'Ghaziabad',
      district: 'Ghaziabad',
      state: 'Uttar Pradesh',
      latitude: 28.6692,
      longitude: 77.4538,
    },
    isOrganic: false,
    chemicalFree: true,
    coldChainStored: true,
    packagingType: 'Standard Mandi Crates',
    status: 'active',
    notes: 'Smooth bright red tomatoes, pre-cooled at packhouse.',
    isDemoData: true,
  },
  {
    id: 'farmer-listing-c',
    farmerId: 'farmer-c',
    farmerName: 'Farmer C (Devender Solanki)',
    farmerPhone: '+91 98290 88912',
    farmName: 'Solanki Organic Orchards',
    cropName: 'Tomato',
    variety: 'Abhinav Hybrid F1',
    category: 'Vegetables',
    quantityAvailableKg: 700,
    initialQuantityKg: 700,
    reservedQuantityKg: 0,
    unit: 'kg',
    minimumPricePerKg: 20,
    qualityGrade: 'A+',
    harvestDate: '2026-09-11',
    shelfLifeDays: 7,
    location: {
      name: 'Bulandshahr',
      district: 'Bulandshahr',
      state: 'Uttar Pradesh',
      latitude: 28.4070,
      longitude: 77.8498,
    },
    isOrganic: true,
    chemicalFree: true,
    coldChainStored: true,
    packagingType: 'Export Carton Boxes',
    status: 'active',
    notes: 'Grade-A+ polyhouse premium tomatoes with 100% color uniformity.',
    isDemoData: true,
  },
  {
    id: 'farmer-listing-d',
    farmerId: 'farmer-patil',
    farmerName: 'Rameshwar B. Patil (Nashik FPO)',
    farmerPhone: '+91 98231 45012',
    farmName: 'Sahyadri Onion Growers Collective',
    cropName: 'Onion',
    variety: 'Nashik Garwa Red',
    category: 'Vegetables',
    quantityAvailableKg: 8500,
    initialQuantityKg: 8500,
    reservedQuantityKg: 0,
    unit: 'kg',
    minimumPricePerKg: 42,
    qualityGrade: 'A+',
    harvestDate: '2026-08-25',
    shelfLifeDays: 45,
    location: {
      name: 'Pimpalgaon Baswant',
      district: 'Nashik',
      state: 'Maharashtra',
      latitude: 20.1706,
      longitude: 73.9870,
    },
    isOrganic: false,
    chemicalFree: true,
    coldChainStored: true,
    packagingType: '50kg Jute Mesh Bags',
    status: 'active',
    notes: 'Medium-to-large 55mm+ double skinned cured onions.',
    isDemoData: true,
  },
  {
    id: 'farmer-listing-e',
    farmerId: 'farmer-gowda',
    farmerName: 'Venkatesh Gowda',
    farmerPhone: '+91 94481 77319',
    farmName: 'Kolar GreenFields',
    cropName: 'Tomato',
    variety: 'Kolar Roma Hybrid',
    category: 'Vegetables',
    quantityAvailableKg: 4200,
    initialQuantityKg: 4200,
    reservedQuantityKg: 0,
    unit: 'kg',
    minimumPricePerKg: 34,
    qualityGrade: 'A',
    harvestDate: '2026-08-27',
    shelfLifeDays: 9,
    location: {
      name: 'Srinivaspur',
      district: 'Kolar',
      state: 'Karnataka',
      latitude: 13.1367,
      longitude: 78.1291,
    },
    isOrganic: true,
    chemicalFree: true,
    coldChainStored: true,
    packagingType: 'Plastic Stackable Crates',
    status: 'active',
    notes: 'Thick-walled oval Roma tomatoes for retail and institutional packing.',
    isDemoData: true,
  },
  {
    id: 'farmer-listing-f',
    farmerId: 'farmer-kushwaha',
    farmerName: 'Mahendra Singh Kushwaha',
    farmerPhone: '+91 97190 28411',
    farmName: 'Taj Agro Cold Reserves',
    cropName: 'Potato',
    variety: 'Kufri Jyoti',
    category: 'Vegetables',
    quantityAvailableKg: 14000,
    initialQuantityKg: 14000,
    reservedQuantityKg: 0,
    unit: 'kg',
    minimumPricePerKg: 26,
    qualityGrade: 'A',
    harvestDate: '2026-08-23',
    shelfLifeDays: 60,
    location: {
      name: 'Fatehabad',
      district: 'Agra',
      state: 'Uttar Pradesh',
      latitude: 27.0984,
      longitude: 78.3090,
    },
    isOrganic: false,
    chemicalFree: true,
    coldChainStored: true,
    packagingType: '50kg Gunny Sacks',
    status: 'active',
    notes: 'Chip-grade low reducing sugar oval tubers.',
    isDemoData: true,
  },
  {
    id: 'farmer-listing-g',
    farmerId: 'farmer-dhillon',
    farmerName: 'Harpreet Singh Dhillon',
    farmerPhone: '+91 98721 66340',
    farmName: 'Dhillon Heritage Paddy Farm',
    cropName: 'Basmati Rice',
    variety: 'Pusa 1121 Basmati',
    category: 'Grains & Pulses',
    quantityAvailableKg: 22000,
    initialQuantityKg: 22000,
    reservedQuantityKg: 0,
    unit: 'kg',
    minimumPricePerKg: 95,
    qualityGrade: 'A+',
    harvestDate: '2026-08-15',
    shelfLifeDays: 365,
    location: {
      name: 'Ajnala',
      district: 'Amritsar',
      state: 'Punjab',
      latitude: 31.8406,
      longitude: 74.7601,
    },
    isOrganic: true,
    chemicalFree: true,
    coldChainStored: false,
    packagingType: '25kg HDPE Bags',
    status: 'active',
    notes: 'Aged 1121 steam basmati rice with extra-long grain elongation.',
    isDemoData: true,
  },
];

export const DEMO_BUYER_REQUIREMENTS: MatchingBuyerRequirement[] = [
  {
    id: 'buyer-req-a',
    buyerId: 'buyer-rest-a',
    buyerName: 'Restaurant A (Chef Rahul Awasthi)',
    buyerCompany: 'Grand Heritage Gourmet Hospitality',
    buyerType: 'Restaurant',
    buyerPhone: '+91 98110 33491',
    cropRequired: 'Tomato',
    variety: 'Abhinav Hybrid / Roma',
    category: 'Vegetables',
    quantityRequiredKg: 400,
    maximumBudgetPerKg: 25,
    qualityRequirement: 'A',
    deliveryLocation: {
      name: 'Noida Sector 62',
      district: 'Gautam Buddha Nagar',
      state: 'Uttar Pradesh',
      latitude: 28.5355,
      longitude: 77.3910,
    },
    requiredDeliveryDate: '2026-09-11',
    urgency: 'high',
    priorityScore: 88,
    isOrganicRequired: false,
    packagingPreference: 'Crates preferred',
    status: 'active',
    notes: 'Urgent tomato procurement for weekend banquet dinners.',
    isDemoData: true,
  },
  {
    id: 'buyer-req-b',
    buyerId: 'buyer-ret-b',
    buyerName: 'Retailer B (Sunil Gupta)',
    buyerCompany: 'Apna Fresh Daily Kirana & Mart',
    buyerType: 'Retailer',
    buyerPhone: '+91 98104 77810',
    cropRequired: 'Tomato',
    variety: 'Hybrid F1',
    category: 'Vegetables',
    quantityRequiredKg: 300,
    maximumBudgetPerKg: 23,
    qualityRequirement: 'A',
    deliveryLocation: {
      name: 'Delhi (Azadpur Metro Hub)',
      district: 'North Delhi',
      state: 'Delhi',
      latitude: 28.7041,
      longitude: 77.1025,
    },
    requiredDeliveryDate: '2026-09-11',
    urgency: 'medium',
    priorityScore: 75,
    isOrganicRequired: false,
    packagingPreference: '20kg stackable crates',
    status: 'active',
    notes: 'Daily retail pack supplies for urban storefront distribution.',
    isDemoData: true,
  },
  {
    id: 'buyer-req-c',
    buyerId: 'buyer-rest-c',
    buyerName: 'Restaurant C (Chef Amit Khurana)',
    buyerCompany: 'The Urban Bistro & Cloud Kitchens (4 Outlets)',
    buyerType: 'Restaurant',
    buyerPhone: '+91 98188 90123',
    cropRequired: 'Tomato',
    variety: 'Hybrid Roma',
    category: 'Vegetables',
    quantityRequiredKg: 600,
    maximumBudgetPerKg: 24,
    qualityRequirement: 'A',
    deliveryLocation: {
      name: 'Greater Noida Knowledge Park',
      district: 'Gautam Buddha Nagar',
      state: 'Uttar Pradesh',
      latitude: 28.4744,
      longitude: 77.5040,
    },
    requiredDeliveryDate: '2026-09-12',
    urgency: 'high',
    priorityScore: 84,
    isOrganicRequired: false,
    packagingPreference: 'Clean crates',
    status: 'active',
    notes: 'Bulk pureed gravy and culinary prep requirements.',
    isDemoData: true,
  },
  {
    id: 'buyer-req-mega',
    buyerId: 'buyer-mega-kitchen',
    buyerName: 'Institutional Hub (Chef Vikram Malhotra)',
    buyerCompany: 'Noida Institutional Mega Catering (Central Kitchen)',
    buyerType: 'Food Processor',
    buyerPhone: '+91 98100 11990',
    cropRequired: 'Tomato',
    variety: 'Hybrid Roma / Abhinav',
    category: 'Vegetables',
    quantityRequiredKg: 1000,
    maximumBudgetPerKg: 26,
    qualityRequirement: 'A',
    deliveryLocation: {
      name: 'Noida Industrial Area Phase 2',
      district: 'Gautam Buddha Nagar',
      state: 'Uttar Pradesh',
      latitude: 28.5355,
      longitude: 77.3910,
    },
    requiredDeliveryDate: '2026-09-11',
    urgency: 'urgent',
    priorityScore: 96,
    isOrganicRequired: false,
    packagingPreference: 'Standard 25kg crates',
    status: 'active',
    notes: 'Requires 1,000 kg total tomatoes. Demonstrates Multi-Farmer Matching combination!',
    isDemoData: true,
  },
  {
    id: 'buyer-req-onion',
    buyerId: 'buyer-freshpicks',
    buyerName: 'Vikram Sethi',
    buyerCompany: 'FreshPicks Retail Hypermarkets',
    buyerType: 'Supermarket Chain',
    buyerPhone: '+91 98200 44810',
    cropRequired: 'Onion',
    variety: 'Nashik Garwa Red (45-55mm)',
    category: 'Vegetables',
    quantityRequiredKg: 4000,
    maximumBudgetPerKg: 46,
    qualityRequirement: 'A+',
    deliveryLocation: {
      name: 'Bhiwandi Central Fulfillment Center',
      district: 'Thane',
      state: 'Maharashtra',
      latitude: 19.2967,
      longitude: 73.0631,
    },
    requiredDeliveryDate: '2026-09-02',
    urgency: 'urgent',
    priorityScore: 92,
    isOrganicRequired: false,
    packagingPreference: '50kg mesh bags',
    status: 'active',
    notes: 'Hypermarket weekly shelf stock replenishment.',
    isDemoData: true,
  },
  {
    id: 'buyer-req-potato',
    buyerId: 'buyer-haldiram',
    buyerName: 'Sanjay Gupta',
    buyerCompany: 'Haldiram Snacks & Pure Foods Ltd',
    buyerType: 'Food Processor',
    buyerPhone: '+91 98112 00981',
    cropRequired: 'Potato',
    variety: 'Chip-Grade Kufri Jyoti',
    category: 'Vegetables',
    quantityRequiredKg: 10000,
    maximumBudgetPerKg: 29,
    qualityRequirement: 'A',
    deliveryLocation: {
      name: 'Noida Industrial Processing Unit 3',
      district: 'Gautam Buddha Nagar',
      state: 'Uttar Pradesh',
      latitude: 28.5355,
      longitude: 77.3910,
    },
    requiredDeliveryDate: '2026-09-04',
    urgency: 'high',
    priorityScore: 90,
    isOrganicRequired: false,
    packagingPreference: '50kg gunny bags',
    status: 'active',
    notes: 'Continuous processing line potato supply.',
    isDemoData: true,
  },
];

// ==========================================
// 3. Mathematical & Algorithmic Utilities
// ==========================================

/**
 * Calculates the great-circle distance between two geographic coordinates using the Haversine formula.
 * Returns distance in kilometers (rounded to 1 decimal place).
 */
export function calculateHaversineDistance(
  locA: MatchingGeoLocation,
  locB: MatchingGeoLocation
): number {
  if (!locA || !locB) return 50; // Fallback distance

  // If exact coordinates match
  if (locA.latitude === locB.latitude && locA.longitude === locB.longitude) {
    return 3.5; // Intra-city local transit
  }

  const R = 6371; // Earth's mean radius in km
  const dLat = ((locB.latitude - locA.latitude) * Math.PI) / 180;
  const dLon = ((locB.longitude - locA.longitude) * Math.PI) / 180;

  const lat1 = (locA.latitude * Math.PI) / 180;
  const lat2 = (locB.latitude * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const rawDistance = R * c;

  // Add 15% road route circuity factor for Indian highways / local roads
  const roadDistance = rawDistance * 1.15;
  return Math.max(1, Math.round(roadDistance * 10) / 10);
}

/**
 * Helper to calculate days difference between two YYYY-MM-DD date strings.
 */
export function calculateDaysDifference(dateStr1: string, dateStr2: string): number {
  try {
    const d1 = new Date(dateStr1);
    const d2 = new Date(dateStr2);
    const diffTime = d2.getTime() - d1.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

// ==========================================
// 4. Individual Factor Scoring Engines
// ==========================================

/**
 * Factor A: Product Compatibility (0 - 100)
 */
export function scoreProductCompatibility(
  farmer: MatchingFarmerListing,
  buyer: MatchingBuyerRequirement
): { score: number; reasons: string[] } {
  const reasons: string[] = [];

  const farmerCrop = farmer.cropName.trim().toLowerCase();
  const buyerCrop = buyer.cropRequired.trim().toLowerCase();

  // Strict mismatch -> 0 score
  if (!farmerCrop.includes(buyerCrop) && !buyerCrop.includes(farmerCrop)) {
    return { score: 0, reasons: [`Crop mismatch: Farmer has ${farmer.cropName}, Buyer needs ${buyer.cropRequired}`] };
  }

  let score = 85;
  reasons.push(`✓ Exact commodity match: ${farmer.cropName}`);

  // Variety compatibility
  const farmerVariety = (farmer.variety || '').toLowerCase();
  const buyerVariety = (buyer.variety || '').toLowerCase();
  if (farmerVariety && buyerVariety && (farmerVariety.includes(buyerVariety) || buyerVariety.includes(farmerVariety))) {
    score += 8;
    reasons.push(`✓ Variety alignment: ${farmer.variety}`);
  }

  // Quality Grade compatibility
  const gradeRank: Record<string, number> = { 'A+': 4, 'A': 3, 'B': 2, 'C': 1 };
  const farmerGradeScore = gradeRank[farmer.qualityGrade] || 2;
  const buyerRequiredGrade = buyer.qualityRequirement === 'Any' ? 'B' : buyer.qualityRequirement;
  const buyerGradeScore = gradeRank[buyerRequiredGrade] || 2;

  if (farmerGradeScore >= buyerGradeScore) {
    score += 7;
    reasons.push(`✓ Grade ${farmer.qualityGrade} meets or exceeds buyer requirement (${buyer.qualityRequirement})`);
  } else {
    score -= 15;
    reasons.push(`⚠ Grade ${farmer.qualityGrade} is lower than preferred ${buyer.qualityRequirement}`);
  }

  // Organic compliance
  if (buyer.isOrganicRequired) {
    if (farmer.isOrganic) {
      score += 5;
      reasons.push(`✓ Organic certification compliant`);
    } else {
      score -= 25;
      reasons.push(`⚠ Buyer requested certified organic, farmer is conventional`);
    }
  }

  return { score: Math.min(100, Math.max(0, score)), reasons };
}

/**
 * Factor B: Quantity Compatibility (0 - 100)
 */
export function scoreQuantityCompatibility(
  farmerQtyAvailable: number,
  buyerQtyRequired: number
): {
  score: number;
  matchedQty: number;
  remainingQty: number;
  isPartial: boolean;
  fulfillmentPct: number;
  explanation: string;
} {
  const matchedQty = Math.min(farmerQtyAvailable, buyerQtyRequired);
  const remainingQty = Math.max(0, buyerQtyRequired - matchedQty);
  const fulfillmentPct = Math.round((matchedQty / buyerQtyRequired) * 100);
  const isPartial = fulfillmentPct < 100;

  let score = 0;
  let explanation = '';

  if (fulfillmentPct >= 100) {
    score = 100;
    explanation = `✓ 100% quantity fulfillment (${matchedQty.toLocaleString()} kg available)`;
  } else if (fulfillmentPct >= 75) {
    score = 88;
    explanation = `✓ High partial fulfillment (${fulfillmentPct}% — ${matchedQty.toLocaleString()}/${buyerQtyRequired.toLocaleString()} kg)`;
  } else if (fulfillmentPct >= 50) {
    score = 75;
    explanation = `✓ Substantial partial fulfillment (${fulfillmentPct}% — ${matchedQty.toLocaleString()} kg, remaining ${remainingQty.toLocaleString()} kg)`;
  } else if (fulfillmentPct >= 25) {
    score = 55;
    explanation = `ℹ Moderate partial batch (${fulfillmentPct}% — ${matchedQty.toLocaleString()} kg)`;
  } else {
    score = 35;
    explanation = `ℹ Small partial match (${fulfillmentPct}% — ${matchedQty.toLocaleString()} kg)`;
  }

  return {
    score,
    matchedQty,
    remainingQty,
    isPartial,
    fulfillmentPct,
    explanation,
  };
}

/**
 * Factor C: Distance Scoring (0 - 100)
 */
export function scoreDistance(
  distanceKm: number,
  maxDistanceKm: number = 400
): { score: number; explanation: string } {
  if (distanceKm <= 10) {
    return { score: 100, explanation: `✓ Ultra-local transit (only ${distanceKm} km away)` };
  }
  if (distanceKm <= 25) {
    return { score: 96, explanation: `✓ Close proximity (${distanceKm} km away)` };
  }
  if (distanceKm <= 60) {
    return { score: 88, explanation: `✓ Same metropolitan/district cluster (${distanceKm} km)` };
  }
  if (distanceKm <= 120) {
    return { score: 76, explanation: `✓ Regional transit distance (${distanceKm} km)` };
  }
  if (distanceKm <= 250) {
    return { score: 60, explanation: `ℹ Inter-district corridor (${distanceKm} km)` };
  }
  if (distanceKm <= maxDistanceKm) {
    const decay = Math.max(20, Math.round(60 - ((distanceKm - 250) / (maxDistanceKm - 250)) * 40));
    return { score: decay, explanation: `⚠ Long-haul route (${distanceKm} km)` };
  }

  return { score: 10, explanation: `⚠ Exceeds standard matching radius (${distanceKm} km > ${maxDistanceKm} km)` };
}

/**
 * Factor D: Price Compatibility (0 - 100)
 */
export function scorePriceCompatibility(
  farmerMinPrice: number,
  buyerMaxBudget: number
): {
  score: number;
  estimatedPrice: number;
  isCompatible: boolean;
  explanation: string;
} {
  const priceSpread = buyerMaxBudget - farmerMinPrice;

  // Ideal: Farmer minimum is less than or equal to buyer budget
  if (priceSpread >= 0) {
    // Estimated deal price: calculated as fair midpoint
    const estimatedPrice = Math.round((farmerMinPrice + buyerMaxBudget) / 2 * 10) / 10;
    
    // Higher spread gives high negotiation flexibility
    const spreadPct = (priceSpread / buyerMaxBudget) * 100;
    let score = 90;
    if (spreadPct >= 20) score = 100;
    else if (spreadPct >= 10) score = 95;
    else score = 90;

    return {
      score,
      estimatedPrice,
      isCompatible: true,
      explanation: `✓ Price compatible: Farmer min ₹${farmerMinPrice}/kg is within buyer's max budget of ₹${buyerMaxBudget}/kg (Est. Deal: ₹${estimatedPrice}/kg)`,
    };
  }

  // Price deficit: Farmer wants more than buyer budget
  const deficitPct = Math.abs(priceSpread) / buyerMaxBudget * 100;
  if (deficitPct <= 10) {
    // Minor negotiation gap (e.g. ₹18 vs ₹17)
    return {
      score: 50,
      estimatedPrice: farmerMinPrice,
      isCompatible: false,
      explanation: `⚠ Small price gap: Farmer min ₹${farmerMinPrice}/kg exceeds budget of ₹${buyerMaxBudget}/kg by ${Math.round(deficitPct)}% (Negotiable)`,
    };
  }

  return {
    score: Math.max(5, Math.round(30 - deficitPct)),
    estimatedPrice: farmerMinPrice,
    isCompatible: false,
    explanation: `⚠ Price mismatch: Farmer min ₹${farmerMinPrice}/kg exceeds buyer budget of ₹${buyerMaxBudget}/kg`,
  };
}

/**
 * Factor E: Delivery Cost Estimation & Scoring (0 - 100)
 */
export function calculateDeliveryCostAndScore(
  distanceKm: number,
  quantityKg: number,
  config: DeliveryCostConfig
): {
  totalDeliveryCost: number;
  costPerKg: number;
  deliveryScore: number;
  explanation: string;
} {
  const { baseCost, ratePerKm, perKgHandlingRate } = config;
  
  // Formula: baseCost + (distance × ratePerKm) + (quantity × perKgHandlingRate)
  const transportCost = distanceKm * ratePerKm;
  const handlingCost = quantityKg * perKgHandlingRate;
  const totalDeliveryCost = Math.round(baseCost + transportCost + handlingCost);
  const costPerKg = Math.round((totalDeliveryCost / quantityKg) * 100) / 100;

  let deliveryScore = 80;
  if (costPerKg <= 1.5) deliveryScore = 100;
  else if (costPerKg <= 3.0) deliveryScore = 92;
  else if (costPerKg <= 5.0) deliveryScore = 80;
  else if (costPerKg <= 8.0) deliveryScore = 65;
  else deliveryScore = 40;

  return {
    totalDeliveryCost,
    costPerKg,
    deliveryScore,
    explanation: `✓ Estimated logistics cost: ₹${totalDeliveryCost.toLocaleString()} (₹${costPerKg}/kg)`,
  };
}

/**
 * Factor F: Demand & Urgency Scoring (0 - 100)
 */
export function scoreDemandUrgency(
  buyer: MatchingBuyerRequirement
): { score: number; explanation: string } {
  let score = 70;
  const urgency = buyer.urgency || 'medium';

  if (urgency === 'urgent') {
    score = 98;
  } else if (urgency === 'high') {
    score = 90;
  } else if (urgency === 'medium') {
    score = 75;
  } else {
    score = 60;
  }

  // Large volume priority boost
  if (buyer.quantityRequiredKg >= 5000) score = Math.min(100, score + 10);
  else if (buyer.quantityRequiredKg >= 1000) score = Math.min(100, score + 5);

  return {
    score,
    explanation: `✓ Demand Priority: ${urgency.toUpperCase()} urgency (${buyer.quantityRequiredKg.toLocaleString()} kg required by ${buyer.buyerCompany})`,
  };
}

/**
 * Factor G: Harvest Date Compatibility (0 - 100)
 */
export function scoreHarvestDate(
  harvestDateStr: string,
  requiredDeliveryDateStr: string,
  shelfLifeDays: number
): { score: number; explanation: string } {
  const daysBetween = calculateDaysDifference(harvestDateStr, requiredDeliveryDateStr);

  if (daysBetween >= 0 && daysBetween <= 2) {
    return {
      score: 100,
      explanation: `✓ Perfect harvest synchronization: Harvested ${harvestDateStr} for delivery on ${requiredDeliveryDateStr} (${daysBetween} days window)`,
    };
  }
  if (daysBetween >= 3 && daysBetween <= 5) {
    return {
      score: 85,
      explanation: `✓ Fresh harvest batch: Harvested ${daysBetween} days prior to required delivery`,
    };
  }
  if (daysBetween > 5 && daysBetween <= shelfLifeDays) {
    const freshnessRetention = Math.max(30, Math.round(80 - (daysBetween / shelfLifeDays) * 50));
    return {
      score: freshnessRetention,
      explanation: `ℹ Cured / Stored inventory: Harvested ${daysBetween} days ago (within ${shelfLifeDays}d shelf life)`,
    };
  }
  if (daysBetween < 0) {
    // Harvest date is AFTER required delivery date -> invalid timeline
    return {
      score: 10,
      explanation: `⚠ Harvest date (${harvestDateStr}) is after the required delivery date (${requiredDeliveryDateStr})`,
    };
  }

  return {
    score: 15,
    explanation: `⚠ Exceeds optimal freshness threshold (harvested ${daysBetween} days ago)`,
  };
}

/**
 * Factor H: Freshness Score (0 - 100)
 */
export function scoreFreshness(
  harvestDateStr: string,
  shelfLifeDays: number,
  coldChainStored: boolean
): { score: number; explanation: string } {
  const today = '2026-09-02'; // Synchronized environment timestamp
  const ageDays = Math.max(0, calculateDaysDifference(harvestDateStr, today));

  if (shelfLifeDays >= 180) {
    // Non-perishable commodities (Grains, Pulses, Spices)
    return { score: 98, explanation: `✓ Non-perishable staple with stable shelf life (${shelfLifeDays} days)` };
  }

  const decayRatio = ageDays / shelfLifeDays;
  let rawScore = Math.max(10, Math.round((1 - decayRatio) * 100));

  if (coldChainStored) {
    rawScore = Math.min(100, rawScore + 8); // Cold chain preservation bonus
  }

  return {
    score: Math.min(100, Math.max(10, rawScore)),
    explanation: `✓ Estimated Freshness: ${rawScore}% (Shelf life ${shelfLifeDays} days, ${coldChainStored ? 'Cold-Chain Stored' : 'Ambient'})`,
  };
}

// ==========================================
// 5. Composite Match Engine & Scoring Pipeline
// ==========================================

export class SmartMatchingService {
  private config: MatchingConfig;

  constructor(config: MatchingConfig = DEFAULT_MATCHING_CONFIG) {
    this.config = config;
  }

  public getConfig(): MatchingConfig {
    return this.config;
  }

  public updateConfig(newConfig: Partial<MatchingConfig>): MatchingConfig {
    this.config = { ...this.config, ...newConfig };
    return this.config;
  }

  /**
   * Evaluates a single Farmer Listing against a Buyer Requirement and returns a SmartMatch object.
   */
  public calculateMatch(
    farmer: MatchingFarmerListing,
    buyer: MatchingBuyerRequirement
  ): SmartMatch | null {
    // Check active status
    if (farmer.status !== 'active' || buyer.status !== 'active') {
      return null;
    }

    if (farmer.quantityAvailableKg <= 0 || buyer.quantityRequiredKg <= 0) {
      return null;
    }

    // 1. Product Compatibility check
    const productEval = scoreProductCompatibility(farmer, buyer);
    if (productEval.score < 20) {
      // Incompatible crop entirely
      return null;
    }

    // 2. Quantity calculation
    const qtyEval = scoreQuantityCompatibility(farmer.quantityAvailableKg, buyer.quantityRequiredKg);

    // 3. Geographic Distance
    const distanceKm = calculateHaversineDistance(farmer.location, buyer.deliveryLocation);
    const distEval = scoreDistance(distanceKm, this.config.maxDistanceKm);

    // 4. Price Compatibility
    const priceEval = scorePriceCompatibility(farmer.minimumPricePerKg, buyer.maximumBudgetPerKg);

    // 5. Delivery Cost
    const deliveryEval = calculateDeliveryCostAndScore(
      distanceKm,
      qtyEval.matchedQty,
      this.config.deliveryCostParams
    );

    // 6. Demand & Urgency
    const demandEval = scoreDemandUrgency(buyer);

    // 7. Harvest Date
    const shelfLife = this.config.productShelfLifeDays[farmer.cropName] || farmer.shelfLifeDays || 14;
    const harvestEval = scoreHarvestDate(farmer.harvestDate, buyer.requiredDeliveryDate, shelfLife);

    // 8. Freshness
    const freshnessEval = scoreFreshness(farmer.harvestDate, shelfLife, farmer.coldChainStored);

    // Weighted composite score calculation
    const weights = this.config.weights;
    const totalWeight =
      weights.product +
      weights.quantity +
      weights.distance +
      weights.price +
      weights.delivery +
      weights.demand +
      weights.harvest +
      weights.freshness;

    const weightedScoreSum =
      productEval.score * weights.product +
      qtyEval.score * weights.quantity +
      distEval.score * weights.distance +
      priceEval.score * weights.price +
      deliveryEval.deliveryScore * weights.delivery +
      demandEval.score * weights.demand +
      harvestEval.score * weights.harvest +
      freshnessEval.score * weights.freshness;

    const compositeScore = Math.round((weightedScoreSum / totalWeight) * 10) / 10;

    // Filter out matches below minimum threshold
    if (compositeScore < this.config.minMatchScoreThreshold) {
      return null;
    }

    // Determine Match Quality Rating
    let matchQuality: MatchQualityRating = 'Poor Match';
    if (compositeScore >= 90) matchQuality = 'Excellent Match';
    else if (compositeScore >= 75) matchQuality = 'Good Match';
    else if (compositeScore >= 60) matchQuality = 'Possible Match';
    else if (compositeScore >= 40) matchQuality = 'Weak Match';

    // Build Score Breakdown
    const scoreBreakdown: ScoreBreakdown = {
      productScore: productEval.score,
      quantityScore: qtyEval.score,
      distanceScore: distEval.score,
      priceScore: priceEval.score,
      deliveryScore: deliveryEval.deliveryScore,
      demandScore: demandEval.score,
      harvestScore: harvestEval.score,
      freshnessScore: freshnessEval.score,
      weightsUsed: { ...weights },
    };

    // Synthesize Explanation Bullet Points
    const explanationPoints: string[] = [
      ...productEval.reasons,
      qtyEval.explanation,
      `✓ Only ${distanceKm} km transit distance (${farmer.location.name} → ${buyer.deliveryLocation.name})`,
      priceEval.explanation,
      deliveryEval.explanation,
      harvestEval.explanation,
      freshnessEval.explanation,
    ];

    const whySummary = `${farmer.cropName} • ${distanceKm} km away • ₹${priceEval.estimatedPrice}/kg deal • ${freshnessEval.score}% freshness`;

    const matchCode = `MTCH-${farmer.cropName.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      id: `match-${farmer.id}-${buyer.id}`,
      matchCode,
      farmerListing: farmer,
      buyerRequirement: buyer,
      matchedQuantityKg: qtyEval.matchedQty,
      remainingRequirementKg: qtyEval.remainingQty,
      isPartialMatch: qtyEval.isPartial,
      fulfillmentPct: qtyEval.fulfillmentPct,
      estimatedPricePerKg: priceEval.estimatedPrice,
      negotiationRange: {
        farmerMin: farmer.minimumPricePerKg,
        buyerMax: buyer.maximumBudgetPerKg,
      },
      totalEstimatedDeal: Math.round(qtyEval.matchedQty * priceEval.estimatedPrice),
      distanceKm,
      estimatedDeliveryCost: deliveryEval.totalDeliveryCost,
      deliveryCostPerKg: deliveryEval.costPerKg,
      freshnessScore: freshnessEval.score,
      matchScore: compositeScore,
      matchQuality,
      scoreBreakdown,
      explanationPoints,
      whySummary,
      status: 'suggested',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Generates all ranked matches between a pool of active farmer listings and buyer requirements.
   */
  public generateAllMatches(
    listings: MatchingFarmerListing[],
    requirements: MatchingBuyerRequirement[]
  ): SmartMatch[] {
    const matches: SmartMatch[] = [];

    for (const req of requirements) {
      for (const listing of listings) {
        const match = this.calculateMatch(listing, req);
        if (match) {
          matches.push(match);
        }
      }
    }

    // Sort in descending order of Match Score
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Finds and ranks all matching buyer requirements for a given Farmer Listing.
   */
  public findMatchesForFarmer(
    farmerId: string,
    listings: MatchingFarmerListing[],
    requirements: MatchingBuyerRequirement[]
  ): SmartMatch[] {
    const farmerListings = listings.filter((l) => l.farmerId === farmerId || l.id === farmerId);
    const matches: SmartMatch[] = [];

    for (const listing of farmerListings) {
      for (const req of requirements) {
        const match = this.calculateMatch(listing, req);
        if (match) {
          matches.push(match);
        }
      }
    }

    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Finds and ranks all matching farmer listings for a given Buyer Requirement.
   */
  public findMatchesForBuyer(
    buyerId: string,
    listings: MatchingFarmerListing[],
    requirements: MatchingBuyerRequirement[]
  ): SmartMatch[] {
    const buyerReqs = requirements.filter((r) => r.buyerId === buyerId || r.id === buyerId);
    const matches: SmartMatch[] = [];

    for (const req of buyerReqs) {
      for (const listing of listings) {
        const match = this.calculateMatch(listing, req);
        if (match) {
          matches.push(match);
        }
      }
    }

    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Optimizes a Multi-Farmer Bundle when a single farmer cannot fulfill the full volume.
   * e.g., Buyer needs 1,000 kg -> Farmer A (500kg) + Farmer B (300kg) + Farmer C (200kg) = 1,000 kg.
   */
  public optimizeMultiFarmerBundle(
    buyer: MatchingBuyerRequirement,
    availableListings: MatchingFarmerListing[]
  ): MultiFarmerBundle | null {
    // Filter compatible crop listings
    const compatibleListings = availableListings.filter((l) => {
      if (l.status !== 'active' || l.quantityAvailableKg <= 0) return false;
      return l.cropName.toLowerCase().includes(buyer.cropRequired.toLowerCase());
    });

    if (compatibleListings.length === 0) return null;

    // Calculate individual matches for each candidate farmer
    const candidateMatches = compatibleListings
      .map((listing) => this.calculateMatch(listing, buyer))
      .filter((m): m is SmartMatch => m !== null)
      .sort((a, b) => b.matchScore - a.matchScore);

    if (candidateMatches.length === 0) return null;

    // Greedy knapsack bundling to minimize distance and maximize match quality
    let totalMatched = 0;
    const selectedMatches: SmartMatch[] = [];

    for (const match of candidateMatches) {
      if (totalMatched >= buyer.quantityRequiredKg) break;

      const needed = buyer.quantityRequiredKg - totalMatched;
      const allocatedQty = Math.min(match.farmerListing.quantityAvailableKg, needed);

      // Create tailored slice match for this bundle
      const adjustedDelivery = calculateDeliveryCostAndScore(
        match.distanceKm,
        allocatedQty,
        this.config.deliveryCostParams
      );

      const sliceMatch: SmartMatch = {
        ...match,
        matchedQuantityKg: allocatedQty,
        remainingRequirementKg: Math.max(0, needed - allocatedQty),
        fulfillmentPct: Math.round((allocatedQty / buyer.quantityRequiredKg) * 100),
        totalEstimatedDeal: Math.round(allocatedQty * match.estimatedPricePerKg),
        estimatedDeliveryCost: adjustedDelivery.totalDeliveryCost,
        deliveryCostPerKg: adjustedDelivery.costPerKg,
      };

      selectedMatches.push(sliceMatch);
      totalMatched += allocatedQty;
    }

    if (selectedMatches.length === 0) return null;

    const totalRequired = buyer.quantityRequiredKg;
    const fulfillmentPct = Math.round((totalMatched / totalRequired) * 100);
    const isFullyFulfilled = totalMatched >= totalRequired;

    // Weighted aggregates
    const totalDeliveryCost = selectedMatches.reduce((sum, m) => sum + m.estimatedDeliveryCost, 0);
    const weightedPriceSum = selectedMatches.reduce(
      (sum, m) => sum + m.estimatedPricePerKg * m.matchedQuantityKg,
      0
    );
    const weightedAvgPrice = Math.round((weightedPriceSum / totalMatched) * 10) / 10;
    const avgDistance =
      Math.round((selectedMatches.reduce((sum, m) => sum + m.distanceKm, 0) / selectedMatches.length) * 10) / 10;
    const combinedScore =
      Math.round(
        (selectedMatches.reduce((sum, m) => sum + m.matchScore * m.matchedQuantityKg, 0) / totalMatched) * 10
      ) / 10;

    const farmersSummary = selectedMatches
      .map((m) => `${m.farmerListing.farmerName} (${m.matchedQuantityKg.toLocaleString()} kg)`)
      .join(' + ');

    const bundleExplanation = `Multi-Farmer Optimization: Combined ${selectedMatches.length} farmers (${farmersSummary}) to satisfy ${totalMatched.toLocaleString()} of ${totalRequired.toLocaleString()} kg (${fulfillmentPct}% fulfillment) at avg ₹${weightedAvgPrice}/kg.`;

    return {
      id: `bundle-${buyer.id}-${Date.now()}`,
      bundleCode: `BNDL-${buyer.cropRequired.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      buyerRequirement: buyer,
      totalRequiredKg: totalRequired,
      totalMatchedKg: totalMatched,
      fulfillmentPct,
      isFullyFulfilled,
      participatingMatches: selectedMatches,
      farmersCount: selectedMatches.length,
      weightedAvgPricePerKg: weightedAvgPrice,
      totalDeliveryCost,
      combinedMatchScore: combinedScore,
      avgDistanceKm: avgDistance,
      bundleExplanation,
      status: 'active',
    };
  }

  /**
   * Generates mock/realistic analytics metrics for dashboard reporting.
   */
  public generateAnalytics(
    allMatches: SmartMatch[],
    allBundles: MultiFarmerBundle[]
  ): MatchingAnalyticsData {
    const totalMatches = allMatches.length;
    const acceptedMatches = allMatches.filter(
      (m) => m.status === 'accepted' || m.status === 'order_created'
    ).length;
    const avgScore =
      totalMatches > 0
        ? Math.round((allMatches.reduce((sum, m) => sum + m.matchScore, 0) / totalMatches) * 10) / 10
        : 88.5;
    const avgDist =
      totalMatches > 0
        ? Math.round((allMatches.reduce((sum, m) => sum + m.distanceKm, 0) / totalMatches) * 10) / 10
        : 28.4;

    return {
      totalMatchesGenerated: totalMatches + 42,
      matchesAcceptedCount: acceptedMatches + 38,
      acceptanceRatePct: totalMatches > 0 ? Math.round(((acceptedMatches + 38) / (totalMatches + 42)) * 100) : 84.5,
      avgMatchScore: avgScore,
      avgDistanceKm: avgDist,
      avgDeliveryCostSavings: 2850,
      successfulTransactionsCount: 36,
      multiFarmerBundlesCount: allBundles.length + 8,
      partialMatchesCount: allMatches.filter((m) => m.isPartialMatch).length + 12,
      avgTimeToMatchHours: 1.4,
      topMatchedCommodities: [
        { crop: 'Tomato', matchCount: 24, volumeMT: 18.5 },
        { crop: 'Onion', matchCount: 16, volumeMT: 42.0 },
        { crop: 'Potato', matchCount: 14, volumeMT: 58.0 },
        { crop: 'Basmati Rice', matchCount: 9, volumeMT: 22.0 },
      ],
      recentMatchEvents: [
        {
          id: 'evt-1',
          timestamp: 'Just now',
          type: 'deal_accepted',
          description: 'Farmer A matched with Restaurant A (400 kg Tomato @ ₹21.5/kg) — Escrow Locked',
        },
        {
          id: 'evt-2',
          timestamp: '12 mins ago',
          type: 'bundle_formed',
          description: 'Multi-Farmer Bundle Formed: 1,000 kg Tomato fulfilled across 3 local farmers',
        },
        {
          id: 'evt-3',
          timestamp: '45 mins ago',
          type: 'offer_sent',
          description: 'Farmer B sent quotation to Retailer B (300 kg Tomato @ ₹20/kg)',
        },
        {
          id: 'evt-4',
          timestamp: '1 hour ago',
          type: 'inventory_reserved',
          description: 'Nashik FPO 4,000 kg Red Onion lot reserved for FreshPicks Hypermarket',
        },
      ],
    };
  }
}

// Global Singleton Instance
export const smartMatchingService = new SmartMatchingService();
