export type TimeframeOption = 'Today' | '7 Days' | '30 Days' | '6 Months' | '1 Year';

export type MapViewMode = 'Supply' | 'Demand' | 'Price' | 'Transaction' | 'Logistics';

export interface GovernmentKPIs {
  farmersOnboarded: number;
  farmersTrendPct: number;
  farmersTrendDir: 'up' | 'down' | 'stable';

  activeBuyers: number;
  buyersTrendPct: number;
  buyersTrendDir: 'up' | 'down' | 'stable';

  transactionsCount: number;
  transactionsTrendPct: number;
  transactionsTrendDir: 'up' | 'down' | 'stable';

  avgFarmerIncomePct: number;
  farmerIncomeTrendDir: 'up' | 'down' | 'stable';

  avgConsumerPricePct: number;
  consumerPriceTrendDir: 'up' | 'down' | 'stable';

  intermediariesEliminated: number;
  intermediariesTrendDir: 'up' | 'down' | 'stable';

  produceTradedTonnes: number;
  produceTrendPct: number;
  produceTrendDir: 'up' | 'down' | 'stable';
}

export interface FarmerIncomeMetric {
  commodity: string;
  traditionalIncome: number;
  kisanDirectIncome: number;
  percentageIncrease: number;
  farmerSharePctTraditional: number;
  farmerSharePctKisanDirect: number;
}

export interface ConsumerPriceMetric {
  commodity: string;
  traditionalPricePerKg: number;
  kisanDirectPricePerKg: number;
  savingAmount: number;
  savingPercentage: number;
}

export interface DistrictData {
  id: string;
  name: string;
  state: string;
  coordinates: { x: number; y: number; lat: number; lng: number };
  densityDots: string; // e.g. "●●●●●"
  farmersCount: number;
  activeBuyersCount: number;
  totalTransactions: number;
  incomeImpactPct: number;
  produceAvailable: {
    name: string;
    variety: string;
    tonnes: number;
    demandLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    avgPrice: number;
    priceTrend: string;
    supplyStatus: 'SURPLUS' | 'BALANCED' | 'SHORTAGE';
  }[];
  primaryProduce: string;
  availableTonnes: number;
  demandTrendPct: number;
  averageTomatoPrice: number;
  logisticsStatus: 'OPTIMAL' | 'MODERATE_CONGESTION' | 'BOTTLENECK_ALERT';
  supplyScore: number; // 0-100
  demandScore: number; // 0-100
  priceIndex: number; // base 100
  transactionDensity: number; // tx / sq km
}

export interface HotspotAlert {
  id: string;
  type: 'HIGH_DEMAND' | 'SUPPLY_SURPLUS' | 'POTENTIAL_SHORTAGE';
  badgeColor: 'red' | 'amber' | 'yellow';
  district: string;
  commodity: string;
  metricLabel: string;
  recommendation: string;
  severity: 'CRITICAL' | 'WARNING' | 'ADVISORY';
  timestamp: string;
}

export interface ProduceMovementRecord {
  id: string;
  origin: string;
  destination: string;
  commodity: string;
  quantityTonnes: number;
  transportationCost: number;
  deliveryStatus: 'IN_TRANSIT' | 'DISPATCHED' | 'DELIVERED' | 'BOTTLENECK_DELAY';
  avgDeliveryTimeHrs: number;
  vehicleCount: number;
  coldChainCompliancePct: number;
  hasBottleneck: boolean;
  bottleneckReason?: string;
}

export interface MarketPriceRecord {
  id: string;
  product: string;
  category: string;
  variety: string;
  avgPricePerKg: number;
  traditionalRetailPricePerKg: number;
  priceTrendPct: number;
  trendDirection: 'up' | 'down' | 'stable';
  demandLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  supplyLevel: 'SURPLUS' | 'ADEQUATE' | 'DEFICIT';
  dominantDistrict: string;
  anomalyDetected: boolean;
  anomalyDetails?: string;
  lastUpdated: string;
}

export interface GovernmentSecurityAlert {
  id: string;
  alertType: 'HIGH_DEMAND' | 'SUPPLY_SURPLUS' | 'PRICE_ANOMALY' | 'SECURITY_ALERT';
  title: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  timestamp: string;
  entityAffected: string;
  recommendedAction: string;
  status: 'ACTIVE' | 'INVESTIGATING' | 'RESOLVED';
}

export interface TransactionSecurityStats {
  totalTransactions: number;
  verifiedTransactions: number;
  flaggedTransactions: number;
  fraudRiskAlerts: number;
  suspiciousVolumeAlerts: number;
  failedPaymentSurges: number;
  abnormalPriceShifts: number;
  unusualAccountActivity: number;
}

export interface FraudFlagRecord {
  id: string;
  txId: string;
  buyerOrFarmer: string;
  amount: number;
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
  reason: string;
  timestamp: string;
  investigationStatus: 'UNDER_REVIEW' | 'ESCALATED' | 'CLEARED';
}

export interface TransactionAuditRecord {
  txId: string;
  orderRef: string;
  action: string;
  user: string;
  userRole: 'Buyer' | 'Farmer' | 'Logistics' | 'FPO Admin';
  commodity: string;
  quantityKg: number;
  totalAmount: number;
  farmerPayout: number;
  timestamp: string;
  status: 'VERIFIED' | 'FLAGGED' | 'COMPLETED';
  auditRecordStatus: 'SECURE' | 'TAMPER_EVIDENT' | 'ENCRYPTED';
  sha256Hash: string;
  signerPublicKey: string;
  otpVerified: boolean;
}

export interface ReportConfig {
  id: string;
  title: string;
  description: string;
  category: 'Farmers' | 'Logistics' | 'Pricing' | 'Supply & Demand' | 'Impact' | 'Security & Audit';
  generatedAt: string;
  size: string;
  recordCount: number;
}
