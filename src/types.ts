// ==========================================
// 1. Language & Navigation Types
// ==========================================
export type LanguageCode = 'en' | 'hi' | 'bn' | 'ta' | 'mr';
export type Language = LanguageCode;

export type NavSection = 
  | 'dashboard'
  | 'overview' 
  | 'photo-studio' 
  | 'ai-assistant' 
  | 'market-assistant'
  | 'volunteer-hub' 
  | 'finance'
  | 'finance-hub' 
  | 'provenance' 
  | 'marketplace' 
  | 'training' 
  | 'chat';

export type ActiveViewMode = 'artisan' | 'volunteer' | 'customer';

// ==========================================
// 2. AI Photo Studio & Artisan Platform Types
// ==========================================
export type PhotoThemeId = 'clean-modern' | 'vibrant-celebration' | 'creative-showcase' | 'rustic-earthy';

export interface PhotoThemeOption {
  id: PhotoThemeId;
  name: string;
  subtitle: string;
  iconName: string;
  badge: string;
  lightingDescription: string;
}

export interface CraftItem {
  id: string;
  title: string;
  artisanName: string;
  artisanLocation: string;
  craftCluster: string;
  state: string;
  category: string;
  rawImage: string;
  themeImages: Record<PhotoThemeId, string>;
  price: number;
  marketSuggestedPrice: number;
  materials: string[];
  hoursToCraft: number;
  description?: string;
  isGIStory?: boolean;
  giTagNumber?: string;
  giTagCertificate?: string;
  giTagVerified?: boolean;
  provenanceHash?: string;
  provenanceId?: string;
  heritageStory?: string;
  culturalStory?: string;
  tags?: string[];
  rating?: number;
  reviewsCount?: number;
  stock?: number;
  inMarketplace?: boolean;
  badge?: string;
  currentResultImage?: string;
}

export interface VolunteerTask {
  id: string;
  title: string;
  category: 'photography' | 'translation' | 'cataloging' | 'storytelling' | string;
  artisanName: string;
  location?: string;
  craftCluster?: string;
  rewardPoints?: number;
  status: 'open' | 'in-progress' | 'completed' | 'Open' | 'In Progress' | 'Completed' | string;
  urgency: 'high' | 'medium' | 'low' | 'High' | 'Medium' | 'Low' | string;
  description: string;
  dueDays?: number;
  timeEstimate?: string;
  artisanAvatar?: string;
  tags?: string[];
  contactEmail?: string;
}

export interface FinanceTransaction {
  id: string;
  date: string;
  craftName: string;
  buyerName: string;
  grossAmount: number;
  platformFee: number;
  logisticsFee: number;
  netPayout: number;
  paymentStatus: string;
  utrNumber: string;
  type?: 'sale' | 'advance' | 'escrow-release' | 'grant' | string;
  amount?: number;
  title?: string;
  status?: 'completed' | 'processing' | 'held-in-escrow' | string;
  buyerOrEntity?: string;
  payoutMethod?: string;
  referenceId?: string;
}

export interface ProvenanceRecord {
  craftId: string;
  artisanId: string;
  artisanName: string;
  giTagNumber: string;
  blockchainHash: string;
  timestamp: string;
  materialsOrigin: string;
  clusterVerification: string;
  inspectedBy?: string;
}

export interface TrainingModule {
  id: string | number;
  title: string;
  category: string;
  durationMinutes: number;
  language?: string;
  languageAvailable?: string[];
  thumbnail: string;
  completed?: boolean;
  completedPercent?: number;
  keyTakeaways?: string[];
  description?: string;
}

export interface ChatMessage {
  id: string;
  sender?: 'artisan' | 'ai' | 'volunteer' | 'buyer' | string;
  senderName?: string;
  senderRole?: string;
  avatar?: string;
  text: string;
  translatedText?: string;
  originalLanguage?: string;
  isCurrentUser?: boolean;
  timestamp: string;
  actionRequired?: boolean;
  audioUrl?: string;
}

// ==========================================
// 3. Agriculture & KisanMandi Ecosystem Types
// ==========================================
export type RoleType = 'landing' | 'farmer' | 'b2b' | 'retail' | 'consumer' | 'government' | 'logistics' | 'admin' | 'matching' | 'distress_demo' | 'trucks';

export type TruckOwnershipType = 'own' | 'kisandirect';

export type TripStatus = 'Requested' | 'Truck Assigned' | 'In Transit' | 'Delivered' | 'Completed';

export interface TransportationPricingBreakdown {
  distance: number;
  baseCostPerKm: number;
  ownershipType: TruckOwnershipType;
  baseCost: number;
  first15Km: number;
  remainingKm: number;
  first15Rate: number; // ₹5
  remainingRate: number; // ₹3
  first15ServiceCharge: number;
  remainingServiceCharge: number;
  totalServiceCharge: number;
  totalCost: number;
  ownTruckEquivalentCost: number;
  serviceChargeDifference: number;
}

export interface TruckTrip {
  id: string;
  lotId?: string;
  crop: string;
  quantityKg: number;
  pickupLocation: string;
  destinationLocation: string;
  distanceKm: number;
  baseCostPerKm: number;
  ownershipType: TruckOwnershipType;
  truckType: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  requiredDate: string;
  targetTempC: number;
  status: TripStatus;
  baseCost: number;
  serviceCharge: number;
  totalCost: number;
  dispatchedAt: string;
  eta: string;
  routeProgressPct: number;
  notes?: string;
}

export interface AvailableTruck {
  id: string;
  truckType: string;
  capacityMT: number;
  currentHub: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  tempRange: string;
  isAvailable: boolean;
  baseRatePerKm: number;
  rating: number;
}

export type ProduceCategory = 'Vegetables' | 'Fruits' | 'Grains & Pulses' | 'Spices & Cash Crops';

export type QualityGrade = 'A+' | 'A' | 'B' | 'C';

export interface ProduceListing {
  id: string;
  title: string;
  cropName: string;
  variety: string;
  category: ProduceCategory;
  farmerName: string;
  farmerPhone: string;
  farmLocation: string;
  state: string;
  district: string;
  quantityKg: number;
  minOrderKg: number;
  pricePerKg: number;
  mandiBenchmarkPrice: number;
  grade: QualityGrade;
  freshnessScore: number; // 0 - 100
  harvestDate: string;
  image: string;
  isOrganic: boolean;
  chemicalFree: boolean;
  coldChainStored: boolean;
  shelfLifeDays: number;
  traceabilityHash: string;
  moisturePercentage: number;
  lotNumber: string;
  description: string;
  rating: number;
  reviewsCount: number;
}

export interface RFQItem {
  id: string;
  buyerName: string;
  buyerCompany: string;
  buyerType: 'Food Processor' | 'Export House' | 'Supermarket Chain' | 'Restaurant Group';
  cropRequired: string;
  variety: string;
  quantityMT: number; // Metric Tonnes
  targetPricePerKg: number;
  deliveryLocation: string;
  deadlineDate: string;
  status: 'Open' | 'Bidding Active' | 'Fulfilled';
  bidsCount: number;
  verifiedBuyer: boolean;
  paymentTerms: string;
}

export interface Shipment {
  id: string;
  lotId: string;
  cropName: string;
  quantityMT: number;
  originFarm: string;
  destinationHub: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  temperatureC: number;
  targetTempC: number;
  humidityPct: number;
  transitStatus: 'In Transit' | 'At Packhouse' | 'Customs Cleared' | 'Delivered';
  departureTime: string;
  eta: string;
  routeProgressPct: number;
  coldChainCompliant: boolean;
}

export interface MandiPriceTicker {
  mandiName: string;
  state: string;
  crop: string;
  modalPrice: number;
  unit: string;
  priceChange: number;
  arrivalsMT: number;
}

export interface QualityGradeResult {
  grade: QualityGrade;
  score: number;
  freshnessScore: number;
  blemishRate: number;
  colorUniformity: number;
  shelfLifeDays: number;
  recommendedPricePerKg: number;
  mandiBenchmarkPrice: number;
  premiumPercentage: number;
  defectSummary: string;
  diseaseDetected?: string;
  isDiseasedOrInfected?: boolean;
  quarantineAction?: string;
  detectedCrop?: string;
  detectedVariety?: string;
  inspectorNotes: string;
  suitableForExport: boolean;
  coldChainRequired: boolean;
}

export interface DemandForecast {
  crop: string;
  region: string;
  currentMandiPrice: number;
  recommendedPlatformPrice: number;
  projectedPriceTomorrow?: number;
  projectedPrice3Days?: number;
  projectedPrice7Days: number;
  demandTrend: 'Rising' | 'Falling' | 'Stable' | 'Volatile' | 'Surging' | 'Softening' | string;
  weatherImpactFactor: string;
  forecastAccuracyPct: number | string;
  keyAdvice: string;
  sources?: string[];
  forecastData?: { day: string; price: number }[];
}

export interface CartItem {
  produce: ProduceListing;
  quantityKg: number;
}

// ==========================================
// 6. Price Alert & Notification Types
// ==========================================
export type PriceAlertCondition = 'ABOVE_OR_EQUAL' | 'BELOW_OR_EQUAL' | 'RANGE';
export type AlertPriceType = 'KISAN_DIRECT' | 'APMC_MANDI' | 'RETAIL';
export type NotificationChannel = 'in_app' | 'whatsapp' | 'sms' | 'push';

export interface PriceAlert {
  id: string;
  commodityId: string;
  commodityName: string;
  variety: string;
  category: 'Vegetables' | 'Fruits' | 'Grains & Pulses';
  targetPrice: number;
  targetPriceMax?: number; // for RANGE
  condition: PriceAlertCondition;
  priceType: AlertPriceType;
  unit: string;
  channels: NotificationChannel[];
  phoneOrEmail?: string;
  note?: string;
  isActive: boolean;
  createdAt: string;
  lastTriggeredAt?: string;
  triggerCount: number;
}

export interface MarketNotification {
  id: string;
  alertId?: string;
  commodityId: string;
  commodityName: string;
  title: string;
  message: string;
  timestamp: string;
  currentPrice: number;
  targetPrice: number;
  unit: string;
  condition: PriceAlertCondition;
  priceType: AlertPriceType;
  isRead: boolean;
  priority: 'normal' | 'high' | 'urgent';
  actionLabel?: string;
  actionRole?: RoleType;
}

// ==========================================
// 7. Farmer Profile, Orders & Payment Types
// ==========================================
export interface FarmerProfile {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  farmName: string;
  village: string;
  taluk: string;
  district: string;
  state: string;
  pincode: string;
  landHoldingAcres: number;
  kccNumber?: string;
  fpoName?: string;
  isVerified: boolean;
  primaryCrops: string[];
  bankAccount: {
    accountHolder: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    upiId: string;
  };
  memberSince: string;
  totalEarningsDirect: number;
  traditionalCutSaved: number;
}

export interface FarmerOrder {
  id: string;
  orderNumber: string;
  buyerName: string;
  buyerCompany: string;
  buyerType: 'Supermarket Chain' | 'Food Processor' | 'Export House' | 'Direct Retailer' | 'FPO Aggregator';
  buyerPhone: string;
  cropName: string;
  variety: string;
  quantityKg: number;
  unit: string;
  agreedPricePerKg: number;
  totalAmount: number;
  mandiBenchmarkPrice: number;
  extraEarnedVsMandi: number;
  commissionSaved: number;
  status: 'pending' | 'accepted' | 'dispatched' | 'delivered' | 'completed' | 'rejected';
  escrowStatus: 'locked_in_escrow' | 'released_to_bank' | 'refunded';
  orderDate: string;
  expectedDeliveryDate: string;
  deliveryLocation: string;
  notes?: string;
}

export interface FarmerPaymentTransaction {
  id: string;
  transactionRef: string;
  orderNumber: string;
  cropLot: string;
  buyerName: string;
  grossAmount: number;
  commissionDeducted: number; // ₹0 for KisanMandi
  traditionalCommissionLost: number; // e.g., 8% = ₹X lost if done via traditional Mandi
  netPayoutAmount: number;
  payoutMethod: 'Instant UPI' | 'Direct Bank IMPS' | 'Escrow Secured';
  status: 'settled' | 'in_escrow' | 'processing';
  date: string;
  utrNumber: string;
}

// ==========================================
// 8. Direct Price Transparency & Supply Chain Types
// ==========================================
export type SupplyChainActorType = 
  | 'farmer' 
  | 'local_trader' 
  | 'commission_agent' 
  | 'wholesaler' 
  | 'retailer' 
  | 'consumer';

export type CostItemCategory = 'operational_cost' | 'intermediary_margin';

export interface StageCostItem {
  id: string;
  name: string;
  amountPerKg: number;
  category: CostItemCategory;
  description: string;
  isLeakageOrWastage?: boolean;
}

export interface SupplyChainStage {
  id: string;
  actorType: SupplyChainActorType;
  actorName: string;
  roleTitle: string;
  locationContext: string;
  iconName: string;
  baseStagePricePerKg: number;
  amountAddedPerKg: number;
  cumulativePricePerKg: number;
  operationalCostPerKg: number;
  intermediaryMarginPerKg: number;
  percentageOfFinalPrice: number;
  wastagePercentage: number;
  timeDelayDays: number;
  costItems: StageCostItem[];
  operationalNotes: string;
  keyProblems: string[];
}

export interface DirectMarketplaceModel {
  farmerFarmgatePrice: number;
  platformFacilitationFee: number; // e.g. 2% (₹0.70/kg)
  coldChainLogisticsFee: number; // e.g. ₹3.50/kg
  finalDirectBuyerPrice: number; // e.g. ₹39.20/kg vs ₹52.00 traditional retail
  farmerGainPerKg: number;
  farmerGainPercentage: number;
  buyerSavingsPerKg: number;
  buyerSavingsPercentage: number;
  traditionalFinalRetailPrice: number;
  spoilageTraditionalPct: number; // ~25-30%
  spoilageDirectPct: number; // <2.5%
  intermediariesEliminatedCount: number;
  paymentSettlementTime: string; // "Instant UPI (2 hours)" vs "15-45 Days"
}

export interface CommodityPriceChain {
  commodityId: string;
  commodityName: string;
  hindiName: string;
  variety: string;
  category: ProduceCategory;
  defaultUnit: string;
  originRegion: string;
  destinationMarket: string;
  sampleImage: string;
  farmerReceivedPricePerKg: number;
  traditionalStages: SupplyChainStage[];
  directModel: DirectMarketplaceModel;
  keyInsights: {
    summary: string;
    farmerShareTraditionalPct: number;
    operationalCostsPct: number;
    intermediaryMarginsPct: number;
    wastageImpactNote: string;
  };
}

export interface BatchCalculationResult {
  commodityName: string;
  quantityKg: number;
  unit: string;
  farmerRevenueTraditional: number;
  farmerRevenueDirect: number;
  farmerNetGainAmount: number;
  farmerGainPct: number;
  consumerSpendTraditional: number;
  consumerSpendDirect: number;
  consumerNetSavingsAmount: number;
  consumerSavingsPct: number;
  totalIntermediaryCutsBypassed: number;
  totalTransitWastageSavedKg: number;
  totalWastageValueSaved: number;
}

// ==========================================
// 9. Smart Farmer-Buyer Matching Engine Types
// ==========================================
export type MatchQualityRating = 'Excellent Match' | 'Good Match' | 'Possible Match' | 'Weak Match' | 'Poor Match';

export type MatchStatus = 
  | 'suggested' 
  | 'offer_sent' 
  | 'negotiating' 
  | 'accepted' 
  | 'order_created' 
  | 'rejected'
  | 'reserved';

export type BuyerUrgencyLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface MatchingGeoLocation {
  name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
}

export interface MatchingFarmerListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmName?: string;
  cropName: string;
  variety: string;
  category: ProduceCategory;
  quantityAvailableKg: number;
  initialQuantityKg: number;
  reservedQuantityKg: number;
  unit: string;
  minimumPricePerKg: number;
  qualityGrade: QualityGrade;
  harvestDate: string; // YYYY-MM-DD
  shelfLifeDays: number;
  location: MatchingGeoLocation;
  isOrganic: boolean;
  chemicalFree: boolean;
  coldChainStored: boolean;
  packagingType?: string;
  status: 'active' | 'reserved' | 'completed' | 'cancelled';
  notes?: string;
  isDemoData?: boolean;
}

export interface MatchingBuyerRequirement {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  buyerType: 'Restaurant' | 'Retailer' | 'Supermarket Chain' | 'Food Processor' | 'Export House' | 'Wholesaler';
  buyerPhone: string;
  cropRequired: string;
  variety: string;
  category: ProduceCategory;
  quantityRequiredKg: number;
  maximumBudgetPerKg: number;
  qualityRequirement: QualityGrade | 'Any';
  deliveryLocation: MatchingGeoLocation;
  requiredDeliveryDate: string; // YYYY-MM-DD
  urgency: BuyerUrgencyLevel;
  priorityScore: number; // 1 - 100
  isOrganicRequired: boolean;
  packagingPreference?: string;
  status: 'active' | 'partially_fulfilled' | 'fulfilled' | 'expired' | 'cancelled';
  notes?: string;
  isDemoData?: boolean;
}

export interface ScoreBreakdown {
  productScore: number;     // 0 - 100
  quantityScore: number;    // 0 - 100
  distanceScore: number;    // 0 - 100
  priceScore: number;       // 0 - 100
  deliveryScore: number;    // 0 - 100
  demandScore: number;      // 0 - 100
  harvestScore: number;     // 0 - 100
  freshnessScore: number;   // 0 - 100
  weightsUsed: {
    product: number;
    quantity: number;
    distance: number;
    price: number;
    delivery: number;
    demand: number;
    harvest: number;
    freshness: number;
  };
}

export interface SmartMatch {
  id: string;
  matchCode: string;
  farmerListing: MatchingFarmerListing;
  buyerRequirement: MatchingBuyerRequirement;
  matchedQuantityKg: number;
  remainingRequirementKg: number;
  isPartialMatch: boolean;
  fulfillmentPct: number;
  estimatedPricePerKg: number;
  negotiationRange: {
    farmerMin: number;
    buyerMax: number;
  };
  totalEstimatedDeal: number;
  distanceKm: number;
  estimatedDeliveryCost: number;
  deliveryCostPerKg: number;
  freshnessScore: number; // 0 - 100
  matchScore: number;     // 0 - 100
  matchQuality: MatchQualityRating;
  scoreBreakdown: ScoreBreakdown;
  explanationPoints: string[];
  whySummary: string;
  status: MatchStatus;
  orderNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MultiFarmerBundle {
  id: string;
  bundleCode: string;
  buyerRequirement: MatchingBuyerRequirement;
  totalRequiredKg: number;
  totalMatchedKg: number;
  fulfillmentPct: number;
  isFullyFulfilled: boolean;
  participatingMatches: SmartMatch[];
  farmersCount: number;
  weightedAvgPricePerKg: number;
  totalDeliveryCost: number;
  combinedMatchScore: number;
  avgDistanceKm: number;
  bundleExplanation: string;
  status: 'active' | 'partially_accepted' | 'accepted' | 'order_created';
}

export interface MatchingWeightsConfig {
  product: number;    // default 25
  quantity: number;   // default 15
  distance: number;   // default 15
  price: number;      // default 15
  delivery: number;   // default 10
  demand: number;     // default 8
  harvest: number;    // default 7
  freshness: number;  // default 5
}

export interface DeliveryCostConfig {
  baseCost: number;            // default ₹350
  ratePerKm: number;           // default ₹12/km
  perKgHandlingRate: number;   // default ₹0.65/kg
  vehicleCapacityKg: number;   // default 3000
}

export interface MatchingConfig {
  weights: MatchingWeightsConfig;
  maxDistanceKm: number;
  minMatchScoreThreshold: number;
  deliveryCostParams: DeliveryCostConfig;
  productShelfLifeDays: Record<string, number>;
  urgencyBonusDays: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface MatchingAnalyticsData {
  totalMatchesGenerated: number;
  matchesAcceptedCount: number;
  acceptanceRatePct: number;
  avgMatchScore: number;
  avgDistanceKm: number;
  avgDeliveryCostSavings: number;
  successfulTransactionsCount: number;
  multiFarmerBundlesCount: number;
  partialMatchesCount: number;
  avgTimeToMatchHours: number;
  topMatchedCommodities: { crop: string; matchCount: number; volumeMT: number }[];
  recentMatchEvents: {
    id: string;
    timestamp: string;
    type: 'match_created' | 'offer_sent' | 'deal_accepted' | 'bundle_formed' | 'inventory_reserved';
    description: string;
  }[];
}

export interface CropDistressAlert {
  id: string;
  crop: string;
  region: string;
  expectedSupplyKg: number;
  confirmedDemandKg: number;
  expectedSurplusKg: number;
  surplusPercentage: number;
  harvestWindowStart: string;
  harvestWindowEnd: string;
  severity: 'LOW' | 'WATCH' | 'HIGH RISK' | 'CRITICAL';
  affectedFarmersCount: number;
  matchedBuyersCount: number;
  additionalDemandKg: number;
  remainingSurplusKg: number;
  recoveryPercentage: number;
  status: 'DETECTED' | 'BUYERS_SEARCHING' | 'PARTIALLY_RECOVERED' | 'FULLY_RECOVERED' | 'CRITICAL';
  createdAt: string;
  updatedAt: string;
  matchedBuyers: MatchingBuyerRequirement[];
  eligibleFarmers: MatchingFarmerListing[];
}




