import { Router, Request, Response } from 'express';
import { dbRepository, getDatabaseStatus } from '../config/database';
import { calculateTransportationCost } from '../services/transportationPricing';
import { mandiPriceService } from '../services/mandiPriceService';
import { 
  DbUser, 
  DbFarmer, 
  DbBuyer, 
  DbInventory, 
  DbOrder, 
  DbTruck, 
  DbTransportationTrip,
  MandiPriceFilter
} from '../types/dbTypes';

export const apiRouter = Router();

// ==========================================
// 1. DATABASE & SYSTEM STATUS
// ==========================================
apiRouter.get('/db-status', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    database: getDatabaseStatus(),
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// 2. USERS & AUTH
// ==========================================
apiRouter.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await dbRepository.getUsers();
    res.json({ success: true, users });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.get('/users/:userId', async (req: Request, res: Response) => {
  try {
    const user = await dbRepository.getUserById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.post('/users/login', async (req: Request, res: Response) => {
  try {
    const { identifier, password, role } = req.body;
    if (!identifier) {
      return res.status(400).json({ success: false, error: 'Phone or email required' });
    }
    let user = await dbRepository.getUserByMobileOrEmail(identifier);
    if (!user) {
      // Create user on first login if not found for quick demo/onboarding
      const newUserId = (role || 'farmer') + '-' + Math.floor(1000 + Math.random() * 9000);
      const isPhone = /^[0-9+]+$/.test(identifier);
      user = await dbRepository.saveUser({
        userId: newUserId,
        name: isPhone ? `Kisan User (${identifier.slice(-4)})` : identifier.split('@')[0],
        mobile: isPhone ? identifier : '9820000000',
        email: !isPhone ? identifier : undefined,
        role: role || 'farmer',
        password: password || 'password123',
        walletBalance: role === 'farmer' ? 142800 : 50000,
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.post('/users', async (req: Request, res: Response) => {
  try {
    const userData: DbUser = req.body;
    if (!userData.userId) {
      userData.userId = 'user-' + Date.now();
    }
    const saved = await dbRepository.saveUser(userData);
    res.json({ success: true, user: saved });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 3. FARMERS & PROFILES
// ==========================================
apiRouter.get('/farmers/:farmerId', async (req: Request, res: Response) => {
  try {
    const farmer = await dbRepository.getFarmerById(req.params.farmerId);
    if (!farmer) {
      return res.status(404).json({ success: false, error: 'Farmer profile not found' });
    }
    res.json({ success: true, farmer });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.post('/farmers', async (req: Request, res: Response) => {
  try {
    const farmerData: DbFarmer = req.body;
    if (!farmerData.farmerId) {
      farmerData.farmerId = 'farmer-' + Date.now();
    }
    const saved = await dbRepository.saveFarmer(farmerData);
    res.json({ success: true, farmer: saved });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 4. BUYERS
// ==========================================
apiRouter.get('/buyers', async (req: Request, res: Response) => {
  try {
    const buyers = await dbRepository.getBuyers();
    res.json({ success: true, buyers });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.get('/buyers/:buyerId', async (req: Request, res: Response) => {
  try {
    const buyer = await dbRepository.getBuyerById(req.params.buyerId);
    if (!buyer) {
      return res.status(404).json({ success: false, error: 'Buyer not found' });
    }
    res.json({ success: true, buyer });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 5. INVENTORY & PRODUCE LISTINGS
// ==========================================
apiRouter.get('/inventory', async (req: Request, res: Response) => {
  try {
    const { farmerId, status } = req.query;
    const items = await dbRepository.getInventory({
      farmerId: farmerId as string,
      status: status as string,
    });
    res.json({ success: true, inventory: items, count: items.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.get('/inventory/:inventoryId', async (req: Request, res: Response) => {
  try {
    const item = await dbRepository.getInventoryById(req.params.inventoryId);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Produce listing not found' });
    }
    res.json({ success: true, inventory: item });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.post('/inventory', async (req: Request, res: Response) => {
  try {
    const data: Partial<DbInventory> = req.body;
    if (!data.cropName || !data.quantityKg || !data.pricePerKg) {
      return res.status(400).json({ success: false, error: 'Crop name, quantity, and price are required' });
    }

    const inventoryId = data.inventoryId || `LOT-${(data.cropName || 'CRP').slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newItem: DbInventory = {
      inventoryId,
      farmerId: data.farmerId || 'farmer-001',
      farmerName: data.farmerName || 'Rameshwar B. Patil',
      farmerPhone: data.farmerPhone || '+91 98231 45012',
      cropName: data.cropName,
      variety: data.variety || 'Commercial Hybrid',
      category: data.category || 'Vegetables',
      quantityKg: Number(data.quantityKg),
      availableQuantityKg: data.availableQuantityKg !== undefined ? Number(data.availableQuantityKg) : Number(data.quantityKg),
      unit: data.unit || 'kg',
      qualityGrade: data.qualityGrade || 'A',
      qualityScore: data.qualityScore || 88,
      freshnessScore: data.freshnessScore || 90,
      blemishRate: data.blemishRate || 5,
      shelfLifeDays: data.shelfLifeDays || 10,
      pricePerKg: Number(data.pricePerKg),
      mandiBenchmarkPrice: Number(data.mandiBenchmarkPrice || Math.round(data.pricePerKg * 0.82)),
      location: data.location || 'Nashik Packhouse Yard, Pimpalgaon',
      district: data.district || 'Nashik',
      state: data.state || 'Maharashtra',
      status: data.status || 'active',
      harvestDate: data.harvestDate || new Date().toISOString().split('T')[0],
      expiryDate: data.expiryDate,
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
      suitableForExport: data.suitableForExport ?? false,
      coldChainRequired: data.coldChainRequired ?? false,
      assayReportSummary: data.assayReportSummary || 'Direct farm-gate produce verified on KisanDirect.',
      isDemo: data.isDemo ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await dbRepository.saveInventory(newItem);
    res.status(201).json({ success: true, inventory: saved });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.put('/inventory/:inventoryId', async (req: Request, res: Response) => {
  try {
    const existing = await dbRepository.getInventoryById(req.params.inventoryId);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }
    const updated: DbInventory = {
      ...existing,
      ...req.body,
      inventoryId: req.params.inventoryId,
      updatedAt: new Date().toISOString(),
    };
    const saved = await dbRepository.saveInventory(updated);
    res.json({ success: true, inventory: saved });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.delete('/inventory/:inventoryId', async (req: Request, res: Response) => {
  try {
    const success = await dbRepository.deleteInventory(req.params.inventoryId);
    res.json({ success, message: success ? 'Listing deleted' : 'Item not found' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 6. ORDERS & ESCROW TRANSACTIONS
// ==========================================
apiRouter.get('/orders', async (req: Request, res: Response) => {
  try {
    const { farmerId, buyerId, status } = req.query;
    const orders = await dbRepository.getOrders({
      farmerId: farmerId as string,
      buyerId: buyerId as string,
      status: status as string,
    });
    res.json({ success: true, orders, count: orders.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.get('/orders/:orderId', async (req: Request, res: Response) => {
  try {
    const order = await dbRepository.getOrderById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.post('/orders', async (req: Request, res: Response) => {
  try {
    const data: Partial<DbOrder> = req.body;
    if (!data.cropName || !data.quantityKg || !data.agreedPricePerKg) {
      return res.status(400).json({ success: false, error: 'Crop, quantity, and price per kg are required' });
    }

    const orderId = data.orderId || `ord-${Date.now().toString().slice(-6)}`;
    const orderNumber = data.orderNumber || `KM-ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const quantityKg = Number(data.quantityKg);
    const agreedPricePerKg = Number(data.agreedPricePerKg);
    const totalAmount = data.totalAmount || (quantityKg * agreedPricePerKg);
    const mandiBenchmarkPrice = data.mandiBenchmarkPrice || Math.round(agreedPricePerKg * 0.82);
    const extraEarnedVsMandi = (agreedPricePerKg - mandiBenchmarkPrice) * quantityKg;
    const commissionSaved = Math.round(totalAmount * 0.08); // 8% saved vs commission agent

    const newOrder: DbOrder = {
      orderId,
      orderNumber,
      buyerId: data.buyerId || 'buyer-001',
      buyerName: data.buyerName || 'Reliance Fresh Retail Logistics Ltd',
      buyerCompany: data.buyerCompany || data.buyerName,
      buyerType: data.buyerType || 'Supermarket Chain',
      buyerPhone: data.buyerPhone || '+91 98200 44102',
      farmerId: data.farmerId || 'farmer-001',
      farmerName: data.farmerName || 'Rameshwar B. Patil',
      farmerPhone: data.farmerPhone || '+91 98231 45012',
      cropId: data.cropId,
      inventoryId: data.inventoryId,
      cropName: data.cropName,
      variety: data.variety || 'Commercial Grade',
      quantityKg,
      unit: data.unit || 'kg',
      agreedPricePerKg,
      totalAmount,
      mandiBenchmarkPrice,
      extraEarnedVsMandi: Math.max(0, extraEarnedVsMandi),
      commissionSaved,
      pickupLocation: data.pickupLocation || 'Nashik Packhouse Yard, Pimpalgaon',
      deliveryLocation: data.deliveryLocation || 'Bhiwandi Hub, Thane',
      status: data.status || 'accepted',
      escrowStatus: data.escrowStatus || 'locked_in_escrow',
      orderDate: data.orderDate || new Date().toISOString().split('T')[0],
      expectedDeliveryDate: data.expectedDeliveryDate,
      notes: data.notes,
      isDemo: data.isDemo ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await dbRepository.saveOrder(newOrder);

    // If linked to inventory, reduce available quantity
    if (data.inventoryId) {
      const inv = await dbRepository.getInventoryById(data.inventoryId);
      if (inv) {
        inv.availableQuantityKg = Math.max(0, inv.availableQuantityKg - quantityKg);
        if (inv.availableQuantityKg === 0) inv.status = 'sold_out';
        await dbRepository.saveInventory(inv);
      }
    }

    res.status(201).json({ success: true, order: saved });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.put('/orders/:orderId/status', async (req: Request, res: Response) => {
  try {
    const { status, escrowStatus } = req.body;
    const order = await dbRepository.getOrderById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (status) order.status = status;
    if (escrowStatus) order.escrowStatus = escrowStatus;
    if (status === 'delivered' && !order.deliveredDate) {
      order.deliveredDate = new Date().toISOString().split('T')[0];
    }
    order.updatedAt = new Date().toISOString();

    const saved = await dbRepository.saveOrder(order);
    res.json({ success: true, order: saved });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 7. TRUCKS FLEET
// ==========================================
apiRouter.get('/trucks', async (req: Request, res: Response) => {
  try {
    const trucks = await dbRepository.getTrucks();
    res.json({ success: true, trucks, count: trucks.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.post('/trucks', async (req: Request, res: Response) => {
  try {
    const data: DbTruck = req.body;
    if (!data.truckId) {
      data.truckId = `TRK-${Math.floor(10 + Math.random() * 90)}`;
    }
    const saved = await dbRepository.saveTruck(data);
    res.json({ success: true, truck: saved });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 8. TRANSPORTATION PRICING CALCULATION
// ==========================================
apiRouter.post('/transportation/quote', (req: Request, res: Response) => {
  try {
    const { distanceKm, customBaseCostPerKm, ownershipType } = req.body;
    if (distanceKm === undefined || isNaN(Number(distanceKm))) {
      return res.status(400).json({ success: false, error: 'distanceKm is required' });
    }

    const calc = calculateTransportationCost(
      Number(distanceKm),
      customBaseCostPerKm ? Number(customBaseCostPerKm) : undefined,
      ownershipType
    );

    res.json({ success: true, quote: calc });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 9. TRANSPORTATION TRIPS & DISPATCH
// ==========================================
apiRouter.get('/trips', async (req: Request, res: Response) => {
  try {
    const { farmerId, status } = req.query;
    const trips = await dbRepository.getTrips({
      farmerId: farmerId as string,
      status: status as string,
    });
    res.json({ success: true, trips, count: trips.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.get('/trips/:tripId', async (req: Request, res: Response) => {
  try {
    const trip = await dbRepository.getTripById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }
    res.json({ success: true, trip });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.post('/trips', async (req: Request, res: Response) => {
  try {
    const data: Partial<DbTransportationTrip> = req.body;
    const distanceKm = Number(data.distanceKm) || 50;
    const ownershipType = (data.ownershipType || data.transportationOwnership || 'kisandirect') as 'own' | 'kisandirect';

    // Recalculate official server pricing
    const pricing = calculateTransportationCost(
      distanceKm,
      data.baseCostPerKm || data.applicableRatePerKm,
      ownershipType
    );

    const tripId = data.tripId || `TRP-${Math.floor(100 + Math.random() * 900)}`;
    const newTrip: DbTransportationTrip = {
      tripId,
      farmerId: data.farmerId || 'farmer-001',
      farmerName: data.farmerName || 'Rameshwar B. Patil',
      orderId: data.orderId,
      lotId: data.lotId,
      crop: data.crop || 'Produce Harvest',
      quantityKg: Number(data.quantityKg) || 1000,
      pickupLocation: data.pickupLocation || 'Farm Gate',
      destination: data.destination || data.destinationLocation || 'Mandi Hub',
      destinationLocation: data.destinationLocation || data.destination || 'Mandi Hub',
      distanceKm: pricing.distanceKm,
      transportationOwnership: pricing.ownershipType,
      ownershipType: pricing.ownershipType,
      truckType: data.truckType || (pricing.ownershipType === 'own' ? 'Farmer Owned Vehicle' : 'KisanDirect Cold Reefer (3.5 MT)'),
      truckId: data.truckId,
      vehicleNumber: data.vehicleNumber || 'MH-15-KD-0001',
      driverName: data.driverName || 'KisanDirect Assigned Driver',
      driverPhone: data.driverPhone || '+91 98200 12345',
      requiredDate: data.requiredDate || new Date().toISOString().split('T')[0],
      targetTempC: data.targetTempC !== undefined ? Number(data.targetTempC) : 10,
      status: data.status || 'Requested',
      baseCostPerKm: pricing.applicableRatePerKm,
      applicableRatePerKm: pricing.applicableRatePerKm,
      baseTransportationCost: pricing.baseTransportationCost,
      baseCost: pricing.baseTransportationCost,
      kisanDirectServiceCharge: pricing.kisanDirectServiceCharge,
      serviceCharge: pricing.kisanDirectServiceCharge,
      totalTransportationCost: pricing.totalTransportationCost,
      totalCost: pricing.totalTransportationCost,
      first15Km: pricing.first15Km,
      remainingKm: pricing.remainingKm,
      dispatchedAt: data.dispatchedAt,
      eta: data.eta || 'Within 24 Hours',
      routeProgressPct: data.routeProgressPct || 0,
      notes: data.notes,
      isDemo: data.isDemo ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await dbRepository.saveTrip(newTrip);
    res.status(201).json({ success: true, trip: saved, pricingBreakdown: pricing });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.put('/trips/:tripId/status', async (req: Request, res: Response) => {
  try {
    const { status, routeProgressPct } = req.body;
    const trip = await dbRepository.getTripById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }

    if (status) trip.status = status;
    if (routeProgressPct !== undefined) trip.routeProgressPct = Number(routeProgressPct);
    trip.updatedAt = new Date().toISOString();

    const saved = await dbRepository.saveTrip(trip);
    res.json({ success: true, trip: saved });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.delete('/trips/:tripId', async (req: Request, res: Response) => {
  try {
    const success = await dbRepository.deleteTrip(req.params.tripId);
    res.json({ success, message: success ? 'Trip deleted' : 'Trip not found' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 8. GOVERNMENT OF INDIA REAL-TIME MANDI PRICES (data.gov.in / AGMARKNET)
// ==========================================

apiRouter.get('/mandi-prices', async (req: Request, res: Response) => {
  try {
    const { commodity, state, district, market, search, limit, offset } = req.query;
    
    const filter: MandiPriceFilter = {
      commodity: commodity ? String(commodity) : undefined,
      state: state ? String(state) : undefined,
      district: district ? String(district) : undefined,
      market: market ? String(market) : undefined,
      search: search ? String(search) : undefined,
      limit: limit ? parseInt(String(limit), 10) : 50,
      offset: offset ? parseInt(String(offset), 10) : 0,
    };

    const result = await mandiPriceService.getMandiPrices(filter);
    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/mandi-prices:', error);
    res.status(500).json({ success: false, error: error.message, records: [], total: 0 });
  }
});

apiRouter.get('/mandi-prices/summary', async (req: Request, res: Response) => {
  try {
    const summary = await mandiPriceService.getSummary();
    res.json({ success: true, summary });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.get('/mandi-prices/comparison', async (req: Request, res: Response) => {
  try {
    const commodity = req.query.commodity ? String(req.query.commodity) : 'Tomato';
    const comparison = await mandiPriceService.getCommodityComparison(commodity);
    res.json({ success: true, ...comparison });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

