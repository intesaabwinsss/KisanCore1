import { MongoClient, Db, Collection } from 'mongodb';
import { 
  DbUser, 
  DbFarmer, 
  DbBuyer, 
  DbCrop, 
  DbInventory, 
  DbOrder, 
  DbTruck, 
  DbTransportationTrip,
  DbMandiPrice,
  MandiPriceFilter
} from '../types/dbTypes';

let mongoClient: MongoClient | null = null;
let database: Db | null = null;
let isConnected = false;
let connectionAttempted = false;
let lastConnectionError: string | null = null;

// In-memory fallback repository when MONGODB_URI is not provided yet or offline
class MemoryStore {
  users: Map<string, DbUser> = new Map();
  farmers: Map<string, DbFarmer> = new Map();
  buyers: Map<string, DbBuyer> = new Map();
  crops: Map<string, DbCrop> = new Map();
  inventory: Map<string, DbInventory> = new Map();
  orders: Map<string, DbOrder> = new Map();
  trucks: Map<string, DbTruck> = new Map();
  trips: Map<string, DbTransportationTrip> = new Map();
  mandiPrices: Map<string, DbMandiPrice> = new Map();
}

const inMemoryDb = new MemoryStore();

/**
 * Initial Default Data for Seeding
 */
const SEED_USERS: DbUser[] = [
  {
    userId: 'farmer-001',
    name: 'Rameshwar B. Patil',
    mobile: '9823145012',
    email: 'rameshwar.patil.krishi@gmail.com',
    role: 'farmer',
    location: 'Pimpalgaon Baswant',
    district: 'Nashik',
    state: 'Maharashtra',
    password: 'password123',
    walletBalance: 142800,
    isVerified: true,
    createdAt: new Date('2024-10-01').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    userId: 'buyer-001',
    name: 'Anand Kulkarni',
    mobile: '9820044102',
    email: 'procurement@reliancefresh.com',
    role: 'buyer',
    location: 'Bhiwandi Hub, Thane',
    district: 'Thane',
    state: 'Maharashtra',
    password: 'password123',
    isVerified: true,
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    userId: 'consumer-001',
    name: 'Pooja Sharma',
    mobile: '9810198234',
    email: 'pooja.sharma@gmail.com',
    role: 'consumer',
    location: 'Bandra West, Mumbai',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    password: 'password123',
    isVerified: true,
    createdAt: new Date('2025-02-01').toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const SEED_FARMERS: DbFarmer[] = [
  {
    farmerId: 'farmer-001',
    userId: 'farmer-001',
    name: 'Rameshwar B. Patil',
    phone: '+91 98231 45012',
    farmName: 'Shree Ganesh Krishi Farm & Orchards',
    village: 'Pimpalgaon Baswant',
    taluk: 'Niphad',
    district: 'Nashik',
    state: 'Maharashtra',
    pincode: '422209',
    location: 'Pimpalgaon Baswant, Nashik',
    landHoldingAcres: 14.5,
    kccNumber: 'KCC-MH-NSK-8891024',
    fpoName: 'Sahyadri Farmers Producer Company (Nashik)',
    isVerified: true,
    primaryCrops: ['Onion', 'Tomato', 'Potato', 'Garlic', 'Capsicum', 'Wheat', 'Pomegranate'],
    bankAccount: {
      accountHolder: 'Rameshwar Bapu Patil',
      bankName: 'Bank of Maharashtra (Pimpalgaon Branch)',
      accountNumber: '6019842104910',
      ifscCode: 'MAHB0000421',
      upiId: 'rameshwar.patil@okaxis',
    },
    memberSince: 'October 2024',
    totalEarningsDirect: 1428000,
    traditionalCutSaved: 148500,
    transportationOwnership: 'kisandirect',
    createdAt: new Date('2024-10-01').toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const SEED_BUYERS: DbBuyer[] = [
  {
    buyerId: 'buyer-001',
    userId: 'buyer-001',
    name: 'Anand Kulkarni (Procurement Lead)',
    businessName: 'Reliance Fresh Retail Logistics Ltd',
    buyerCompany: 'Reliance Fresh Retail Logistics Ltd',
    phone: '+91 98200 44102',
    email: 'procurement@reliancefresh.com',
    location: 'Reliance Distribution Center, Bhiwandi, Thane Hub',
    buyerType: 'Supermarket Chain',
    verifiedStatus: true,
    totalProcuredKg: 120000,
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    buyerId: 'buyer-002',
    userId: 'buyer-002',
    name: 'Vikramjit Singh',
    businessName: 'Haldiram Snacks Agro Processing Ltd',
    buyerCompany: 'Haldiram Snacks Agro Processing Ltd',
    phone: '+91 98110 55192',
    email: 'agro.sourcing@haldiram.com',
    location: 'Haldiram Plant #4, Nagpur Industrial Area',
    buyerType: 'Food Processor',
    verifiedStatus: true,
    totalProcuredKg: 350000,
    createdAt: new Date('2025-01-20').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    buyerId: 'buyer-003',
    userId: 'buyer-003',
    name: 'Dr. Suresh Nair',
    businessName: 'Mother Dairy & Safal Fresh Outlets',
    buyerCompany: 'Mother Dairy & Safal Fresh Outlets',
    phone: '+91 98450 11984',
    email: 'sourcing.fresh@motherdairy.com',
    location: 'Safal Cold Packhouse, Navi Mumbai APMC Hub',
    buyerType: 'Supermarket Chain',
    verifiedStatus: true,
    totalProcuredKg: 85000,
    createdAt: new Date('2025-02-10').toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const SEED_INVENTORY: DbInventory[] = [
  {
    inventoryId: 'LOT-NSK-904',
    farmerId: 'farmer-001',
    farmerName: 'Rameshwar B. Patil',
    farmerPhone: '+91 98231 45012',
    cropName: 'Red Onion',
    variety: 'Nashik Garwa Red (Grade A+)',
    category: 'Vegetables',
    quantityKg: 14000,
    availableQuantityKg: 11500,
    unit: 'kg',
    qualityGrade: 'A+',
    qualityScore: 96,
    freshnessScore: 97,
    blemishRate: 2.1,
    shelfLifeDays: 45,
    pricePerKg: 42,
    mandiBenchmarkPrice: 36,
    location: 'Nashik Packhouse Yard, Pimpalgaon',
    district: 'Nashik',
    state: 'Maharashtra',
    status: 'active',
    harvestDate: '2026-08-28',
    expiryDate: '2026-10-15',
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
    suitableForExport: true,
    coldChainRequired: false,
    assayReportSummary: 'AGMARK Extra-Special certified. Double skin tight bulb, zero sprouting.',
    isDemo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    inventoryId: 'LOT-KLR-308',
    farmerId: 'farmer-001',
    farmerName: 'Rameshwar B. Patil',
    cropName: 'Tomato',
    variety: 'Hybrid Roma F1 (Thick Pericarp)',
    category: 'Vegetables',
    quantityKg: 7500,
    availableQuantityKg: 5700,
    unit: 'kg',
    qualityGrade: 'A',
    qualityScore: 91,
    freshnessScore: 94,
    blemishRate: 3.5,
    shelfLifeDays: 14,
    pricePerKg: 34,
    mandiBenchmarkPrice: 28,
    location: 'Kolar Cold Storage Facility, Karnataka',
    district: 'Kolar',
    state: 'Karnataka',
    status: 'active',
    harvestDate: '2026-08-30',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    suitableForExport: true,
    coldChainRequired: true,
    assayReportSummary: 'High brix level (5.2), firm pericarp suitable for long distance reefer transport.',
    isDemo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    inventoryId: 'LOT-AGR-201',
    farmerId: 'farmer-001',
    farmerName: 'Rameshwar B. Patil',
    cropName: 'Potato',
    variety: 'Chip-Grade Kufri Jyoti',
    category: 'Vegetables',
    quantityKg: 20000,
    availableQuantityKg: 16000,
    unit: 'kg',
    qualityGrade: 'A',
    qualityScore: 89,
    freshnessScore: 92,
    blemishRate: 4.0,
    shelfLifeDays: 60,
    pricePerKg: 26,
    mandiBenchmarkPrice: 22,
    location: 'Fatehabad Cold Store, Agra',
    district: 'Agra',
    state: 'Uttar Pradesh',
    status: 'active',
    harvestDate: '2026-08-25',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    suitableForExport: false,
    coldChainRequired: true,
    assayReportSummary: 'Low reducing sugars (<0.1%), optimal for snack processing.',
    isDemo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    inventoryId: 'LOT-OOT-512',
    farmerId: 'farmer-001',
    farmerName: 'Rameshwar B. Patil',
    cropName: 'Garlic',
    variety: 'Ooty Giant Hill Clove',
    category: 'Spices',
    quantityKg: 3000,
    availableQuantityKg: 1800,
    unit: 'kg',
    qualityGrade: 'A+',
    qualityScore: 98,
    freshnessScore: 99,
    blemishRate: 1.2,
    shelfLifeDays: 90,
    pricePerKg: 165,
    mandiBenchmarkPrice: 140,
    location: 'Ooty Agro Cooperative, Nilgiris',
    district: 'Nilgiris',
    state: 'Tamil Nadu',
    status: 'active',
    harvestDate: '2026-08-20',
    imageUrl: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=600&q=80',
    suitableForExport: true,
    coldChainRequired: false,
    assayReportSummary: 'High allicin content, large export-grade cloves.',
    isDemo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const SEED_ORDERS: DbOrder[] = [
  {
    orderId: 'ord-101',
    orderNumber: 'KM-ORD-88210',
    buyerId: 'buyer-001',
    buyerName: 'Anand Kulkarni (Procurement Lead)',
    buyerCompany: 'Reliance Fresh Retail Logistics Ltd',
    buyerType: 'Supermarket Chain',
    buyerPhone: '+91 98200 44102',
    farmerId: 'farmer-001',
    farmerName: 'Rameshwar B. Patil',
    farmerPhone: '+91 98231 45012',
    cropId: 'LOT-NSK-904',
    inventoryId: 'LOT-NSK-904',
    cropName: 'Onion',
    variety: 'Nashik Garwa Red (Grade A+)',
    quantityKg: 2500,
    unit: 'kg',
    agreedPricePerKg: 42,
    totalAmount: 105000,
    mandiBenchmarkPrice: 36,
    extraEarnedVsMandi: 15000,
    commissionSaved: 8400,
    pickupLocation: 'Nashik Packhouse Yard, Pimpalgaon',
    deliveryLocation: 'Reliance Distribution Center, Bhiwandi, Thane Hub',
    status: 'accepted',
    escrowStatus: 'locked_in_escrow',
    orderDate: '2026-08-30',
    expectedDeliveryDate: '2026-09-03',
    notes: 'Grade A+ quality verified by AI assay. Palletized delivery requested.',
    isDemo: true,
    createdAt: new Date('2026-08-30').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    orderId: 'ord-102',
    orderNumber: 'KM-ORD-88211',
    buyerId: 'buyer-002',
    buyerName: 'Vikramjit Singh',
    buyerCompany: 'Haldiram Snacks Agro Processing Ltd',
    buyerType: 'Food Processor',
    buyerPhone: '+91 98110 55192',
    farmerId: 'farmer-001',
    farmerName: 'Rameshwar B. Patil',
    farmerPhone: '+91 98231 45012',
    cropId: 'LOT-AGR-201',
    inventoryId: 'LOT-AGR-201',
    cropName: 'Potato',
    variety: 'Chip-Grade Kufri Jyoti',
    quantityKg: 4000,
    unit: 'kg',
    agreedPricePerKg: 26,
    totalAmount: 104000,
    mandiBenchmarkPrice: 22,
    extraEarnedVsMandi: 16000,
    commissionSaved: 8320,
    pickupLocation: 'Fatehabad Cold Store, Agra',
    deliveryLocation: 'Haldiram Plant #4, Nagpur Industrial Area',
    status: 'dispatched',
    escrowStatus: 'locked_in_escrow',
    orderDate: '2026-08-29',
    expectedDeliveryDate: '2026-09-02',
    notes: 'Low sugar content verified. Cold truck temperature monitored at 10°C.',
    isDemo: true,
    createdAt: new Date('2026-08-29').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    orderId: 'ord-103',
    orderNumber: 'KM-ORD-88208',
    buyerId: 'buyer-003',
    buyerName: 'Dr. Suresh Nair',
    buyerCompany: 'Mother Dairy & Safal Fresh Outlets',
    buyerType: 'Supermarket Chain',
    buyerPhone: '+91 98450 11984',
    farmerId: 'farmer-001',
    farmerName: 'Rameshwar B. Patil',
    cropName: 'Tomato',
    variety: 'Hybrid Roma F1 (Thick Pericarp)',
    quantityKg: 1800,
    unit: 'kg',
    agreedPricePerKg: 34,
    totalAmount: 61200,
    mandiBenchmarkPrice: 28,
    extraEarnedVsMandi: 10800,
    commissionSaved: 4896,
    pickupLocation: 'Kolar Cold Storage Facility, Karnataka',
    deliveryLocation: 'Safal Cold Packhouse, Navi Mumbai APMC Hub',
    status: 'delivered',
    escrowStatus: 'released_to_bank',
    orderDate: '2026-08-27',
    expectedDeliveryDate: '2026-08-29',
    deliveredDate: '2026-08-29',
    notes: 'Inspection cleared with zero transit bruising. Full escrow payout approved.',
    isDemo: true,
    createdAt: new Date('2026-08-27').toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const SEED_TRUCKS: DbTruck[] = [
  {
    truckId: 'TRK-01',
    truckNumber: 'MH-15-BT-1092',
    vehicleNumber: 'MH-15-BT-1092',
    truckType: 'Bolero / 14ft Reefer (3.5 MT)',
    capacityMT: 3.5,
    refrigerationType: 'Active Cold Compressor',
    temperatureRange: '-20°C to +15°C',
    targetTempC: 12,
    driverName: 'Rameshwar Kale',
    driverPhone: '+91 98220 55192',
    currentHub: 'Nashik Packhouse Yard, Pimpalgaon',
    currentLocation: 'Nashik, Maharashtra',
    availability: true,
    status: 'available',
    baseRatePerKm: 25,
    rating: 4.9,
    isDemo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    truckId: 'TRK-02',
    truckNumber: 'MH-12-QX-5541',
    vehicleNumber: 'MH-12-QX-5541',
    truckType: 'Eicher Pro 20ft Reefer (7.5 MT)',
    capacityMT: 7.5,
    refrigerationType: 'Active Cold Compressor',
    temperatureRange: '-25°C to +15°C',
    targetTempC: 8,
    driverName: 'Sambhaji Shinde',
    driverPhone: '+91 94230 88129',
    currentHub: 'Pune Agro Cold Store, Hadapsar',
    currentLocation: 'Pune, Maharashtra',
    availability: true,
    status: 'available',
    baseRatePerKm: 32,
    rating: 4.8,
    isDemo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    truckId: 'TRK-03',
    truckNumber: 'DL-01-AA-8902',
    vehicleNumber: 'DL-01-AA-8902',
    truckType: 'BharatBenz 24ft Heavy Reefer (14 MT)',
    capacityMT: 14,
    refrigerationType: 'Multi-Zone Chiller',
    temperatureRange: '-25°C to +15°C',
    targetTempC: 4,
    driverName: 'Harbhajan Singh',
    driverPhone: '+91 98140 33190',
    currentHub: 'Azadpur Terminal Mandi, Delhi',
    currentLocation: 'Delhi NCR',
    availability: true,
    status: 'available',
    baseRatePerKm: 38,
    rating: 5.0,
    isDemo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    truckId: 'TRK-04',
    truckNumber: 'KA-07-M-3419',
    vehicleNumber: 'KA-07-M-3419',
    truckType: 'Tata Ace Reefer (1.5 MT)',
    capacityMT: 1.5,
    refrigerationType: 'Compact Chiller',
    temperatureRange: '-18°C to +15°C',
    targetTempC: 10,
    driverName: 'G. Venkatesh',
    driverPhone: '+91 94481 22910',
    currentHub: 'Kolar Cold Storage Facility, Karnataka',
    currentLocation: 'Kolar, Karnataka',
    availability: true,
    status: 'available',
    baseRatePerKm: 20,
    rating: 4.7,
    isDemo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    truckId: 'TRK-05',
    truckNumber: 'AP-07-TT-8890',
    vehicleNumber: 'AP-07-TT-8890',
    truckType: 'Multi-Axle 32ft Long Haul (22 MT)',
    capacityMT: 22,
    refrigerationType: 'Deep Freeze & Controlled Atmosphere',
    temperatureRange: '-25°C to +15°C',
    targetTempC: 2,
    driverName: 'V. Ramanjaneyulu',
    driverPhone: '+91 98480 77123',
    currentHub: 'Guntur Packhouse Yard, Andhra Pradesh',
    currentLocation: 'Guntur, Andhra Pradesh',
    availability: true,
    status: 'available',
    baseRatePerKm: 46,
    rating: 4.9,
    isDemo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const SEED_TRIPS: DbTransportationTrip[] = [
  {
    tripId: 'TRP-101',
    farmerId: 'farmer-001',
    farmerName: 'Rameshwar B. Patil',
    orderId: 'ord-101',
    lotId: 'LOT-NSK-904',
    crop: 'Nashik Red Onions',
    quantityKg: 14000,
    pickupLocation: 'Nashik Packhouse Yard, Pimpalgaon',
    destination: 'Vashi APMC Mandi, Mumbai',
    destinationLocation: 'Vashi APMC Mandi, Mumbai',
    distanceKm: 165,
    transportationOwnership: 'kisandirect',
    ownershipType: 'kisandirect',
    truckType: 'BharatBenz 24ft Heavy Reefer (14 MT)',
    truckId: 'TRK-03',
    vehicleNumber: 'MH-15-DC-4421',
    driverName: 'Balwant Singh',
    driverPhone: '+91 98114 88201',
    requiredDate: '2026-09-14',
    targetTempC: 14,
    status: 'In Transit',
    baseCostPerKm: 25,
    applicableRatePerKm: 25,
    baseTransportationCost: 165 * 25, // 4125
    baseCost: 165 * 25,
    kisanDirectServiceCharge: 15 * 5 + (165 - 15) * 3, // 525
    serviceCharge: 525,
    totalTransportationCost: (165 * 25) + 525, // 4650
    totalCost: (165 * 25) + 525,
    first15Km: 15,
    remainingKm: 150,
    dispatchedAt: '2026-09-12 06:30',
    eta: 'Today 17:30',
    routeProgressPct: 65,
    notes: 'Pre-cooled to 14°C at packhouse. Escrow verified.',
    isDemo: true,
    createdAt: new Date('2026-09-12').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    tripId: 'TRP-102',
    farmerId: 'farmer-001',
    farmerName: 'Rameshwar B. Patil',
    orderId: 'ord-103',
    lotId: 'LOT-KLR-308',
    crop: 'Roma Hybrid Tomatoes',
    quantityKg: 7500,
    pickupLocation: 'Kolar Cold Storage Facility, Kolar',
    destination: 'Hosur Distribution Center, Bengaluru',
    destinationLocation: 'Hosur Distribution Center, Bengaluru',
    distanceKm: 70,
    transportationOwnership: 'own',
    ownershipType: 'own',
    truckType: 'Farmer Owned Bolero Maxi Truck',
    vehicleNumber: 'KA-08-E-9022',
    driverName: 'M. Selvakumar',
    driverPhone: '+91 94432 10988',
    requiredDate: '2026-09-13',
    targetTempC: 11,
    status: 'Delivered',
    baseCostPerKm: 25,
    applicableRatePerKm: 25,
    baseTransportationCost: 70 * 25, // 1750
    baseCost: 70 * 25,
    kisanDirectServiceCharge: 0,
    serviceCharge: 0,
    totalTransportationCost: 70 * 25,
    totalCost: 70 * 25,
    first15Km: 15,
    remainingKm: 55,
    dispatchedAt: '2026-09-11 05:00',
    eta: 'Delivered Yesterday 12:00',
    routeProgressPct: 100,
    notes: 'Delivered on time with zero spoilage claims.',
    isDemo: true,
    createdAt: new Date('2026-09-11').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    tripId: 'TRP-103',
    farmerId: 'farmer-001',
    farmerName: 'Rameshwar B. Patil',
    orderId: 'ord-102',
    lotId: 'LOT-SML-502',
    crop: 'Royal Delicious Apples',
    quantityKg: 18000,
    pickupLocation: 'Kotgarh CA Cold Store, Shimla',
    destination: 'Azadpur Terminal Mandi, Delhi',
    destinationLocation: 'Azadpur Terminal Mandi, Delhi',
    distanceKm: 360,
    transportationOwnership: 'kisandirect',
    ownershipType: 'kisandirect',
    truckType: 'Multi-Axle 32ft Long Haul (22 MT)',
    truckId: 'TRK-05',
    vehicleNumber: 'HP-10-B-3109',
    driverName: 'Gurmeet Pal',
    driverPhone: '+91 98762 55431',
    requiredDate: '2026-09-15',
    targetTempC: 2,
    status: 'Truck Assigned',
    baseCostPerKm: 28,
    applicableRatePerKm: 28,
    baseTransportationCost: 360 * 28, // 10080
    baseCost: 360 * 28,
    kisanDirectServiceCharge: 15 * 5 + (360 - 15) * 3, // 1110
    serviceCharge: 1110,
    totalTransportationCost: (360 * 28) + 1110, // 11190
    totalCost: (360 * 28) + 1110,
    first15Km: 15,
    remainingKm: 345,
    dispatchedAt: '2026-09-12 14:00',
    eta: 'Tomorrow 08:00',
    routeProgressPct: 15,
    notes: 'Controlled Atmosphere (CA) unit with continuous nitrogen flushing.',
    isDemo: true,
    createdAt: new Date('2026-09-12').toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Seed memory store
function populateMemoryStore() {
  SEED_USERS.forEach(u => inMemoryDb.users.set(u.userId, { ...u }));
  SEED_FARMERS.forEach(f => inMemoryDb.farmers.set(f.farmerId, { ...f }));
  SEED_BUYERS.forEach(b => inMemoryDb.buyers.set(b.buyerId, { ...b }));
  SEED_INVENTORY.forEach(i => inMemoryDb.inventory.set(i.inventoryId, { ...i }));
  SEED_ORDERS.forEach(o => inMemoryDb.orders.set(o.orderId, { ...o }));
  SEED_TRUCKS.forEach(t => inMemoryDb.trucks.set(t.truckId, { ...t }));
  SEED_TRIPS.forEach(tr => inMemoryDb.trips.set(tr.tripId, { ...tr }));
}
populateMemoryStore();

/**
 * Initializes and connects to MongoDB Atlas
 */
export async function connectDatabase(): Promise<{ success: boolean; message: string }> {
  connectionAttempted = true;
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || 'KisanDirect';

  if (!uri || uri.trim() === '') {
    const msg = 'MONGODB_URI environment variable is not configured. Running in memory-buffered mode.';
    console.log(`[MongoDB Service] ${msg}`);
    lastConnectionError = 'MONGODB_URI not set';
    return { success: false, message: msg };
  }

  try {
    console.log(`[MongoDB Service] Connecting to MongoDB Atlas cluster (Database: "${dbName}")...`);
    mongoClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    await mongoClient.connect();
    database = mongoClient.db(dbName);
    isConnected = true;
    lastConnectionError = null;
    console.log(`[MongoDB Service] Successfully connected to MongoDB Atlas database "${dbName}"!`);

    // Ensure Indexes
    await initializeIndexes(database);

    // Auto-seed if collections are empty
    await seedMongoCollectionsIfEmpty(database);

    return { success: true, message: `Connected to MongoDB Atlas: ${dbName}` };
  } catch (err: any) {
    isConnected = false;
    lastConnectionError = err.message || 'Unknown MongoDB connection error';
    console.error('[MongoDB Service] Connection error:', lastConnectionError);
    return { success: false, message: `MongoDB Connection Failed: ${lastConnectionError}` };
  }
}

/**
 * Ensures indexes on MongoDB collections
 */
async function initializeIndexes(db: Db) {
  try {
    await db.collection('users').createIndex({ userId: 1 }, { unique: true });
    await db.collection('users').createIndex({ mobile: 1 });
    await db.collection('users').createIndex({ email: 1 });

    await db.collection('farmers').createIndex({ farmerId: 1 }, { unique: true });
    await db.collection('farmers').createIndex({ userId: 1 });

    await db.collection('buyers').createIndex({ buyerId: 1 }, { unique: true });
    await db.collection('buyers').createIndex({ userId: 1 });

    await db.collection('crops').createIndex({ cropId: 1 }, { unique: true });
    await db.collection('crops').createIndex({ farmerId: 1 });

    await db.collection('inventory').createIndex({ inventoryId: 1 }, { unique: true });
    await db.collection('inventory').createIndex({ farmerId: 1 });
    await db.collection('inventory').createIndex({ status: 1 });

    await db.collection('orders').createIndex({ orderId: 1 }, { unique: true });
    await db.collection('orders').createIndex({ orderNumber: 1 });
    await db.collection('orders').createIndex({ farmerId: 1 });
    await db.collection('orders').createIndex({ buyerId: 1 });
    await db.collection('orders').createIndex({ status: 1 });

    await db.collection('trucks').createIndex({ truckId: 1 }, { unique: true });
    await db.collection('trucks').createIndex({ status: 1 });

    await db.collection('transportationTrips').createIndex({ tripId: 1 }, { unique: true });
    await db.collection('transportationTrips').createIndex({ farmerId: 1 });
    await db.collection('transportationTrips').createIndex({ orderId: 1 });
    await db.collection('transportationTrips').createIndex({ status: 1 });

    console.log('[MongoDB Service] Successfully verified indexes on all KisanDirect collections.');
  } catch (err) {
    console.warn('[MongoDB Service] Index creation warning:', err);
  }
}

/**
 * Seeds initial demo documents if collections are empty in MongoDB
 */
async function seedMongoCollectionsIfEmpty(db: Db) {
  try {
    const userCount = await db.collection('users').countDocuments();
    if (userCount === 0) {
      await db.collection('users').insertMany(SEED_USERS as any);
      console.log(`[MongoDB Service] Seeded ${SEED_USERS.length} users into MongoDB.`);
    }

    const farmerCount = await db.collection('farmers').countDocuments();
    if (farmerCount === 0) {
      await db.collection('farmers').insertMany(SEED_FARMERS as any);
      console.log(`[MongoDB Service] Seeded ${SEED_FARMERS.length} farmers into MongoDB.`);
    }

    const buyerCount = await db.collection('buyers').countDocuments();
    if (buyerCount === 0) {
      await db.collection('buyers').insertMany(SEED_BUYERS as any);
      console.log(`[MongoDB Service] Seeded ${SEED_BUYERS.length} buyers into MongoDB.`);
    }

    const inventoryCount = await db.collection('inventory').countDocuments();
    if (inventoryCount === 0) {
      await db.collection('inventory').insertMany(SEED_INVENTORY as any);
      console.log(`[MongoDB Service] Seeded ${SEED_INVENTORY.length} inventory items into MongoDB.`);
    }

    const orderCount = await db.collection('orders').countDocuments();
    if (orderCount === 0) {
      await db.collection('orders').insertMany(SEED_ORDERS as any);
      console.log(`[MongoDB Service] Seeded ${SEED_ORDERS.length} orders into MongoDB.`);
    }

    const truckCount = await db.collection('trucks').countDocuments();
    if (truckCount === 0) {
      await db.collection('trucks').insertMany(SEED_TRUCKS as any);
      console.log(`[MongoDB Service] Seeded ${SEED_TRUCKS.length} trucks into MongoDB.`);
    }

    const tripCount = await db.collection('transportationTrips').countDocuments();
    if (tripCount === 0) {
      await db.collection('transportationTrips').insertMany(SEED_TRIPS as any);
      console.log(`[MongoDB Service] Seeded ${SEED_TRIPS.length} trips into MongoDB.`);
    }
  } catch (err) {
    console.warn('[MongoDB Service] Auto-seed warning:', err);
  }
}

export function isDatabaseConnected(): boolean {
  return isConnected;
}

export function getDatabase(): Db | null {
  return database;
}

export function getDatabaseStatus() {
  return {
    configured: Boolean(process.env.MONGODB_URI),
    connected: isConnected,
    databaseName: process.env.MONGODB_DB_NAME || 'KisanDirect',
    connectionAttempted,
    lastError: lastConnectionError,
    mode: isConnected ? 'MONGODB_ATLAS' : (process.env.MONGODB_URI ? 'CONNECTING_OR_RETRYING' : 'IN_MEMORY_PREVIEW'),
  };
}

// Unified CRUD Data Access Repositories (Auto-syncs with MongoDB when connected, fallback to MemoryStore)
export const dbRepository = {
  // Users
  async getUsers(): Promise<DbUser[]> {
    if (isConnected && database) {
      return (await database.collection('users').find({}).toArray()) as unknown as DbUser[];
    }
    return Array.from(inMemoryDb.users.values());
  },

  async getUserById(userId: string): Promise<DbUser | null> {
    if (isConnected && database) {
      return (await database.collection('users').findOne({ userId })) as unknown as DbUser | null;
    }
    return inMemoryDb.users.get(userId) || null;
  },

  async getUserByMobileOrEmail(identifier: string): Promise<DbUser | null> {
    if (isConnected && database) {
      return (await database.collection('users').findOne({
        $or: [{ mobile: identifier }, { email: identifier }]
      })) as unknown as DbUser | null;
    }
    return Array.from(inMemoryDb.users.values()).find(
      u => u.mobile === identifier || u.email === identifier
    ) || null;
  },

  async saveUser(user: DbUser): Promise<DbUser> {
    const updated = { ...user, updatedAt: new Date().toISOString() };
    inMemoryDb.users.set(user.userId, updated);
    if (isConnected && database) {
      await database.collection('users').updateOne(
        { userId: user.userId },
        { $set: updated },
        { upsert: true }
      );
    }
    return updated;
  },

  // Farmers
  async getFarmerById(farmerId: string): Promise<DbFarmer | null> {
    if (isConnected && database) {
      return (await database.collection('farmers').findOne({ farmerId })) as unknown as DbFarmer | null;
    }
    return inMemoryDb.farmers.get(farmerId) || null;
  },

  async saveFarmer(farmer: DbFarmer): Promise<DbFarmer> {
    const updated = { ...farmer, updatedAt: new Date().toISOString() };
    inMemoryDb.farmers.set(farmer.farmerId, updated);
    if (isConnected && database) {
      await database.collection('farmers').updateOne(
        { farmerId: farmer.farmerId },
        { $set: updated },
        { upsert: true }
      );
    }
    return updated;
  },

  // Buyers
  async getBuyerById(buyerId: string): Promise<DbBuyer | null> {
    if (isConnected && database) {
      return (await database.collection('buyers').findOne({ buyerId })) as unknown as DbBuyer | null;
    }
    return inMemoryDb.buyers.get(buyerId) || null;
  },

  async getBuyers(): Promise<DbBuyer[]> {
    if (isConnected && database) {
      return (await database.collection('buyers').find({}).toArray()) as unknown as DbBuyer[];
    }
    return Array.from(inMemoryDb.buyers.values());
  },

  async saveBuyer(buyer: DbBuyer): Promise<DbBuyer> {
    const updated = { ...buyer, updatedAt: new Date().toISOString() };
    inMemoryDb.buyers.set(buyer.buyerId, updated);
    if (isConnected && database) {
      await database.collection('buyers').updateOne(
        { buyerId: buyer.buyerId },
        { $set: updated },
        { upsert: true }
      );
    }
    return updated;
  },

  // Inventory
  async getInventory(filter: { farmerId?: string; status?: string } = {}): Promise<DbInventory[]> {
    if (isConnected && database) {
      const mongoFilter: any = {};
      if (filter.farmerId) mongoFilter.farmerId = filter.farmerId;
      if (filter.status && filter.status !== 'all') mongoFilter.status = filter.status;
      return (await database.collection('inventory').find(mongoFilter).sort({ createdAt: -1 }).toArray()) as unknown as DbInventory[];
    }
    let items = Array.from(inMemoryDb.inventory.values());
    if (filter.farmerId) items = items.filter(i => i.farmerId === filter.farmerId);
    if (filter.status && filter.status !== 'all') items = items.filter(i => i.status === filter.status);
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getInventoryById(inventoryId: string): Promise<DbInventory | null> {
    if (isConnected && database) {
      return (await database.collection('inventory').findOne({ inventoryId })) as unknown as DbInventory | null;
    }
    return inMemoryDb.inventory.get(inventoryId) || null;
  },

  async saveInventory(item: DbInventory): Promise<DbInventory> {
    const updated = { ...item, updatedAt: new Date().toISOString() };
    inMemoryDb.inventory.set(item.inventoryId, updated);
    if (isConnected && database) {
      await database.collection('inventory').updateOne(
        { inventoryId: item.inventoryId },
        { $set: updated },
        { upsert: true }
      );
    }
    return updated;
  },

  async deleteInventory(inventoryId: string): Promise<boolean> {
    inMemoryDb.inventory.delete(inventoryId);
    if (isConnected && database) {
      const res = await database.collection('inventory').deleteOne({ inventoryId });
      return res.deletedCount > 0;
    }
    return true;
  },

  // Orders
  async getOrders(filter: { farmerId?: string; buyerId?: string; status?: string } = {}): Promise<DbOrder[]> {
    if (isConnected && database) {
      const mongoFilter: any = {};
      if (filter.farmerId) mongoFilter.farmerId = filter.farmerId;
      if (filter.buyerId) mongoFilter.buyerId = filter.buyerId;
      if (filter.status && filter.status !== 'all') mongoFilter.status = filter.status;
      return (await database.collection('orders').find(mongoFilter).sort({ createdAt: -1 }).toArray()) as unknown as DbOrder[];
    }
    let items = Array.from(inMemoryDb.orders.values());
    if (filter.farmerId) items = items.filter(o => o.farmerId === filter.farmerId);
    if (filter.buyerId) items = items.filter(o => o.buyerId === filter.buyerId);
    if (filter.status && filter.status !== 'all') items = items.filter(o => o.status === filter.status);
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getOrderById(orderId: string): Promise<DbOrder | null> {
    if (isConnected && database) {
      return (await database.collection('orders').findOne({ orderId })) as unknown as DbOrder | null;
    }
    return inMemoryDb.orders.get(orderId) || null;
  },

  async saveOrder(order: DbOrder): Promise<DbOrder> {
    const updated = { ...order, updatedAt: new Date().toISOString() };
    inMemoryDb.orders.set(order.orderId, updated);
    if (isConnected && database) {
      await database.collection('orders').updateOne(
        { orderId: order.orderId },
        { $set: updated },
        { upsert: true }
      );
    }
    return updated;
  },

  // Trucks
  async getTrucks(): Promise<DbTruck[]> {
    if (isConnected && database) {
      return (await database.collection('trucks').find({}).toArray()) as unknown as DbTruck[];
    }
    return Array.from(inMemoryDb.trucks.values());
  },

  async saveTruck(truck: DbTruck): Promise<DbTruck> {
    const updated = { ...truck, updatedAt: new Date().toISOString() };
    inMemoryDb.trucks.set(truck.truckId, updated);
    if (isConnected && database) {
      await database.collection('trucks').updateOne(
        { truckId: truck.truckId },
        { $set: updated },
        { upsert: true }
      );
    }
    return updated;
  },

  // Transportation Trips
  async getTrips(filter: { farmerId?: string; status?: string } = {}): Promise<DbTransportationTrip[]> {
    if (isConnected && database) {
      const mongoFilter: any = {};
      if (filter.farmerId) mongoFilter.farmerId = filter.farmerId;
      if (filter.status && filter.status !== 'all') mongoFilter.status = filter.status;
      return (await database.collection('transportationTrips').find(mongoFilter).sort({ createdAt: -1 }).toArray()) as unknown as DbTransportationTrip[];
    }
    let items = Array.from(inMemoryDb.trips.values());
    if (filter.farmerId) items = items.filter(t => t.farmerId === filter.farmerId);
    if (filter.status && filter.status !== 'all') items = items.filter(t => t.status === filter.status);
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getTripById(tripId: string): Promise<DbTransportationTrip | null> {
    if (isConnected && database) {
      return (await database.collection('transportationTrips').findOne({ tripId })) as unknown as DbTransportationTrip | null;
    }
    return inMemoryDb.trips.get(tripId) || null;
  },

  async saveTrip(trip: DbTransportationTrip): Promise<DbTransportationTrip> {
    const updated = { ...trip, updatedAt: new Date().toISOString() };
    inMemoryDb.trips.set(trip.tripId, updated);
    if (isConnected && database) {
      await database.collection('transportationTrips').updateOne(
        { tripId: trip.tripId },
        { $set: updated },
        { upsert: true }
      );
    }
    return updated;
  },

  async deleteTrip(tripId: string): Promise<boolean> {
    inMemoryDb.trips.delete(tripId);
    if (isConnected && database) {
      const res = await database.collection('transportationTrips').deleteOne({ tripId });
      return res.deletedCount > 0;
    }
    return true;
  },

  // Mandi Prices (Govt of India / data.gov.in AGMARKNET Cache)
  async getMandiPrices(filter: MandiPriceFilter = {}): Promise<DbMandiPrice[]> {
    const limit = filter.limit || 100;
    const offset = filter.offset || 0;

    if (isConnected && database) {
      const mongoFilter: any = {};
      if (filter.commodity) {
        mongoFilter.commodity = { $regex: new RegExp(filter.commodity, 'i') };
      }
      if (filter.state && filter.state !== 'All' && filter.state !== 'all') {
        mongoFilter.state = { $regex: new RegExp(filter.state, 'i') };
      }
      if (filter.district && filter.district !== 'All' && filter.district !== 'all') {
        mongoFilter.district = { $regex: new RegExp(filter.district, 'i') };
      }
      if (filter.market && filter.market !== 'All' && filter.market !== 'all') {
        mongoFilter.market = { $regex: new RegExp(filter.market, 'i') };
      }
      if (filter.search) {
        const sRegex = new RegExp(filter.search, 'i');
        mongoFilter.$or = [
          { commodity: sRegex },
          { market: sRegex },
          { district: sRegex },
          { state: sRegex },
          { variety: sRegex }
        ];
      }

      return (await database
        .collection('mandiPrices')
        .find(mongoFilter)
        .sort({ arrivalDate: -1, modalPriceQuintal: -1 })
        .skip(offset)
        .limit(limit)
        .toArray()) as unknown as DbMandiPrice[];
    }

    let items = Array.from(inMemoryDb.mandiPrices.values());
    if (filter.commodity) {
      const c = filter.commodity.toLowerCase();
      items = items.filter(p => p.commodity.toLowerCase().includes(c));
    }
    if (filter.state && filter.state !== 'All' && filter.state !== 'all') {
      const s = filter.state.toLowerCase();
      items = items.filter(p => p.state.toLowerCase().includes(s));
    }
    if (filter.district && filter.district !== 'All' && filter.district !== 'all') {
      const d = filter.district.toLowerCase();
      items = items.filter(p => p.district.toLowerCase().includes(d));
    }
    if (filter.market && filter.market !== 'All' && filter.market !== 'all') {
      const m = filter.market.toLowerCase();
      items = items.filter(p => p.market.toLowerCase().includes(m));
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      items = items.filter(p => 
        p.commodity.toLowerCase().includes(q) ||
        p.market.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.variety.toLowerCase().includes(q)
      );
    }

    return items
      .sort((a, b) => b.modalPriceKg - a.modalPriceKg)
      .slice(offset, offset + limit);
  },

  async saveMandiPrices(prices: DbMandiPrice[]): Promise<DbMandiPrice[]> {
    for (const item of prices) {
      inMemoryDb.mandiPrices.set(item.id, item);
    }
    if (isConnected && database && prices.length > 0) {
      const bulkOps = prices.map(p => ({
        updateOne: {
          filter: { id: p.id },
          update: { $set: p },
          upsert: true
        }
      }));
      await database.collection('mandiPrices').bulkWrite(bulkOps as any);
    }
    return prices;
  },

  async getMandiSummary(): Promise<{ commodities: string[]; states: string[]; markets: string[] }> {
    if (isConnected && database) {
      const commodities = await database.collection('mandiPrices').distinct('commodity');
      const states = await database.collection('mandiPrices').distinct('state');
      const markets = await database.collection('mandiPrices').distinct('market');
      return {
        commodities: commodities.filter(Boolean).sort(),
        states: states.filter(Boolean).sort(),
        markets: markets.filter(Boolean).sort(),
      };
    }
    const all = Array.from(inMemoryDb.mandiPrices.values());
    const commodities = Array.from(new Set(all.map(p => p.commodity))).sort();
    const states = Array.from(new Set(all.map(p => p.state))).sort();
    const markets = Array.from(new Set(all.map(p => p.market))).sort();
    return { commodities, states, markets };
  }
};
