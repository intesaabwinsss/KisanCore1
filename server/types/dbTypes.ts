export interface DbUser {
  userId: string;
  name: string;
  email?: string;
  mobile: string;
  role: 'farmer' | 'consumer' | 'buyer' | 'admin';
  language?: string;
  location?: string;
  district?: string;
  state?: string;
  password?: string;
  walletBalance?: number;
  isVerified?: boolean;
  documents?: {
    aadhaar?: { name: string; size: number; type: string };
    pan?: { name: string; size: number; type: string };
  };
  transactions?: Array<{
    id: string;
    date: string;
    type: string;
    description: string;
    amount: number;
    isCredit: boolean;
    balanceAfter: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface DbFarmer {
  farmerId: string;
  userId: string;
  name: string;
  phone: string;
  location: string;
  farmName: string;
  village: string;
  taluk?: string;
  district: string;
  state: string;
  pincode?: string;
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
  transportationOwnership?: 'own' | 'kisandirect';
  createdAt: string;
  updatedAt: string;
}

export interface DbBuyer {
  buyerId: string;
  userId: string;
  name: string;
  businessName?: string;
  buyerCompany?: string;
  phone: string;
  email?: string;
  location: string;
  buyerType: 'Supermarket Chain' | 'Food Processor' | 'Export House' | 'Direct Retailer' | 'Institutional' | 'Consumer';
  verifiedStatus: boolean;
  totalProcuredKg?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DbCrop {
  cropId: string;
  name: string;
  variety?: string;
  category: string;
  farmerId: string;
  farmerName?: string;
  farmerLocation?: string;
  quantity: number;
  unit: string;
  qualityGrade: string;
  qualityScore?: number;
  freshnessScore?: number;
  location: string;
  price: number;
  mandiBenchmarkPrice?: number;
  availability: 'in_stock' | 'harvesting_soon' | 'sold_out';
  harvestDate?: string;
  imageUrl?: string;
  coldChainRequired?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DbInventory {
  inventoryId: string;
  farmerId: string;
  farmerName: string;
  farmerPhone?: string;
  cropId?: string;
  cropName: string;
  variety: string;
  category: string;
  quantityKg: number;
  availableQuantityKg: number;
  unit: string;
  qualityGrade: 'A+' | 'A' | 'B' | 'C';
  qualityScore: number;
  freshnessScore: number;
  blemishRate?: number;
  shelfLifeDays?: number;
  pricePerKg: number;
  mandiBenchmarkPrice: number;
  location: string;
  state?: string;
  district?: string;
  status: 'active' | 'reserved' | 'sold_out' | 'archived';
  harvestDate: string;
  expiryDate?: string;
  imageUrl?: string;
  suitableForExport?: boolean;
  coldChainRequired?: boolean;
  assayReportSummary?: string;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DbOrder {
  orderId: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerCompany?: string;
  buyerType?: string;
  buyerPhone?: string;
  farmerId: string;
  farmerName?: string;
  farmerPhone?: string;
  cropId?: string;
  inventoryId?: string;
  cropName: string;
  variety?: string;
  quantityKg: number;
  unit: string;
  agreedPricePerKg: number;
  totalAmount: number;
  mandiBenchmarkPrice?: number;
  extraEarnedVsMandi?: number;
  commissionSaved?: number;
  pickupLocation: string;
  deliveryLocation: string;
  status: 'pending' | 'accepted' | 'dispatched' | 'delivered' | 'completed' | 'cancelled';
  escrowStatus: 'locked_in_escrow' | 'released_to_bank' | 'refunded' | 'pending';
  orderDate: string;
  expectedDeliveryDate?: string;
  deliveredDate?: string;
  deliveryAddress?: string;
  notes?: string;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DbTruck {
  truckId: string;
  truckNumber: string;
  vehicleNumber: string;
  truckType: string;
  capacityMT: number;
  refrigerationType: string;
  temperatureRange: string;
  targetTempC?: number;
  driverName: string;
  driverPhone: string;
  currentHub: string;
  currentLocation: string;
  availability: boolean;
  status: 'available' | 'on_trip' | 'maintenance' | 'reserved';
  baseRatePerKm: number;
  rating?: number;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DbTransportationTrip {
  tripId: string;
  farmerId?: string;
  farmerName?: string;
  orderId?: string;
  lotId?: string;
  crop: string;
  quantityKg: number;
  pickupLocation: string;
  destination: string;
  destinationLocation: string;
  distanceKm: number;
  transportationOwnership: 'own' | 'kisandirect';
  ownershipType: 'own' | 'kisandirect';
  truckType: string;
  truckId?: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  requiredDate: string;
  targetTempC: number;
  status: 'Requested' | 'Truck Assigned' | 'In Transit' | 'Delivered' | 'Completed' | 'Cancelled';
  baseCostPerKm: number;
  applicableRatePerKm: number;
  baseTransportationCost: number;
  baseCost: number;
  kisanDirectServiceCharge: number;
  serviceCharge: number;
  totalTransportationCost: number;
  totalCost: number;
  first15Km?: number;
  remainingKm?: number;
  dispatchedAt?: string;
  eta?: string;
  routeProgressPct?: number;
  notes?: string;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DbMandiPrice {
  id: string;
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  grade?: string;
  arrivalDate: string;
  minPriceQuintal: number;
  maxPriceQuintal: number;
  modalPriceQuintal: number;
  minPriceKg: number;
  maxPriceKg: number;
  modalPriceKg: number;
  kisanDirectFairPriceKg: number;
  arrivalsTonnes?: number;
  source: string;
  cachedAt: string;
  expiresAt?: string;
}

export interface MandiPriceFilter {
  commodity?: string;
  state?: string;
  district?: string;
  market?: string;
  search?: string;
  limit?: number;
  offset?: number;
}
