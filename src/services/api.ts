import { 
  ProduceListing, 
  TruckTrip, 
  FarmerOrder, 
  FarmerProfile, 
  AvailableTruck, 
  TripStatus, 
  TruckOwnershipType, 
  QualityGrade, 
  ProduceCategory,
  MandiPriceRecord,
  MandiPriceSearchResponse
} from '../types';

export interface DatabaseStatus {
  configured: boolean;
  connected: boolean;
  databaseName: string;
  connectionAttempted: boolean;
  lastError: string | null;
  mode: 'MONGODB_ATLAS' | 'CONNECTING_OR_RETRYING' | 'IN_MEMORY_PREVIEW';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TransportationQuoteResponse {
  distanceKm: number;
  ownershipType: 'own' | 'kisandirect';
  applicableRatePerKm: number;
  baseTransportationCost: number;
  first15Km: number;
  remainingKm: number;
  first15Rate: number;
  remainingRate: number;
  first15ServiceCharge: number;
  remainingServiceCharge: number;
  kisanDirectServiceCharge: number;
  totalTransportationCost: number;
  ownTruckEquivalentCost: number;
  serviceChargeDifference: number;
}

// REST API Methods for KisanDirect
export const api = {
  // DB Health & Status
  async getDbStatus(): Promise<{ status: string; database: DatabaseStatus }> {
    try {
      const res = await fetch('/api/db-status');
      return await res.json();
    } catch {
      return {
        status: 'error',
        database: {
          configured: false,
          connected: false,
          databaseName: 'KisanDirect',
          connectionAttempted: true,
          lastError: 'Network or fetch failure',
          mode: 'IN_MEMORY_PREVIEW'
        }
      };
    }
  },

  // Inventory / Produce Listings
  async getInventory(farmerId?: string): Promise<ProduceListing[]> {
    try {
      const url = farmerId ? `/api/inventory?farmerId=${encodeURIComponent(farmerId)}` : '/api/inventory';
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && Array.isArray(json.inventory)) {
        return json.inventory.map((item: any): ProduceListing => ({
          id: item.inventoryId || item.id,
          title: item.title || `Grade-${item.qualityGrade || 'A'} ${item.variety || ''} ${item.cropName || 'Produce'}`,
          cropName: item.cropName || item.name || 'Tomato',
          variety: item.variety || 'Commercial',
          category: (item.category as ProduceCategory) || 'Vegetables',
          farmerName: item.farmerName || 'Rameshwar B. Patil',
          farmerPhone: item.farmerPhone || '+91 98231 45012',
          farmLocation: item.farmLocation || item.location || 'Nashik, Maharashtra',
          state: item.state || 'Maharashtra',
          district: item.district || 'Nashik',
          quantityKg: item.quantityKg || item.quantity || 1000,
          minOrderKg: item.minOrderKg || 100,
          pricePerKg: item.pricePerKg || item.price || 30,
          mandiBenchmarkPrice: item.mandiBenchmarkPrice || Math.round((item.pricePerKg || 30) * 0.8),
          grade: (item.qualityGrade || item.grade || 'A') as QualityGrade,
          freshnessScore: item.freshnessScore || 90,
          harvestDate: item.harvestDate || new Date().toISOString().split('T')[0],
          image: item.imageUrl || item.image || 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
          isOrganic: item.isOrganic !== undefined ? Boolean(item.isOrganic) : true,
          chemicalFree: item.chemicalFree !== undefined ? Boolean(item.chemicalFree) : true,
          coldChainStored: Boolean(item.coldChainRequired || item.coldChainStored),
          shelfLifeDays: item.shelfLifeDays || 14,
          traceabilityHash: item.traceabilityHash || `AGMARK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          moisturePercentage: item.moisturePercentage || 12.5,
          lotNumber: item.lotNumber || `LOT-${Math.floor(100 + Math.random() * 900)}`,
          description: item.description || item.assayReportSummary || 'Fresh farm-gate produce graded and verified.',
          rating: item.rating || 4.9,
          reviewsCount: item.reviewsCount || 12,
        }));
      }
      return [];
    } catch (err) {
      console.warn('[API Client] Error fetching inventory:', err);
      return [];
    }
  },

  async createInventory(listing: Partial<ProduceListing>): Promise<ProduceListing | null> {
    try {
      const payload = {
        cropName: listing.cropName || 'Tomato',
        variety: listing.variety || 'Commercial',
        category: listing.category || 'Vegetables',
        quantityKg: listing.quantityKg || 1000,
        unit: 'kg',
        pricePerKg: listing.pricePerKg || 30,
        mandiBenchmarkPrice: listing.mandiBenchmarkPrice || 25,
        qualityGrade: listing.grade || 'A',
        qualityScore: listing.freshnessScore || 90,
        freshnessScore: listing.freshnessScore || 90,
        blemishRate: 2.5,
        location: listing.farmLocation || `${listing.district || 'Nashik'}, ${listing.state || 'Maharashtra'}`,
        farmerId: 'farmer-001',
        farmerName: listing.farmerName || 'Rameshwar B. Patil',
        farmerPhone: listing.farmerPhone || '+91 98231 45012',
        imageUrl: listing.image || 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
        suitableForExport: listing.grade === 'A+',
        coldChainRequired: Boolean(listing.coldChainStored),
        assayReportSummary: listing.description,
        harvestDate: listing.harvestDate || new Date().toISOString().split('T')[0],
      };

      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success && json.inventory) {
        const item = json.inventory;
        return {
          id: item.inventoryId,
          title: `Grade-${item.qualityGrade || 'A'} ${item.variety || ''} ${item.cropName}`,
          cropName: item.cropName,
          category: (item.category as ProduceCategory) || 'Vegetables',
          variety: item.variety,
          farmerName: item.farmerName,
          farmerPhone: item.farmerPhone,
          farmLocation: item.location,
          state: 'Maharashtra',
          district: 'Nashik',
          quantityKg: item.quantityKg,
          minOrderKg: 100,
          pricePerKg: item.pricePerKg,
          mandiBenchmarkPrice: item.mandiBenchmarkPrice,
          grade: (item.qualityGrade || 'A') as QualityGrade,
          freshnessScore: item.freshnessScore || 90,
          harvestDate: item.harvestDate,
          image: item.imageUrl,
          isOrganic: true,
          chemicalFree: true,
          coldChainStored: item.coldChainRequired,
          shelfLifeDays: item.shelfLifeDays || 14,
          traceabilityHash: `AGMARK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          moisturePercentage: 12.5,
          lotNumber: `LOT-${item.inventoryId.slice(-4)}`,
          description: item.assayReportSummary || 'Farm fresh produce.',
          rating: 4.9,
          reviewsCount: 1,
        };
      }
      return null;
    } catch (err) {
      console.error('[API Client] Error creating inventory listing:', err);
      return null;
    }
  },

  async deleteInventory(inventoryId: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/inventory/${encodeURIComponent(inventoryId)}`, { method: 'DELETE' });
      const json = await res.json();
      return Boolean(json.success);
    } catch {
      return false;
    }
  },

  // Orders
  async getOrders(farmerId?: string, buyerId?: string): Promise<FarmerOrder[]> {
    try {
      let url = '/api/orders';
      const params = new URLSearchParams();
      if (farmerId) params.append('farmerId', farmerId);
      if (buyerId) params.append('buyerId', buyerId);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      const json = await res.json();
      if (json.success && Array.isArray(json.orders)) {
        return json.orders.map((o: any): FarmerOrder => ({
          id: o.orderId,
          orderNumber: o.orderNumber,
          buyerName: o.buyerName,
          buyerCompany: o.buyerCompany || o.buyerName,
          buyerType: (o.buyerType || 'Supermarket Chain') as any,
          buyerPhone: o.buyerPhone || '+91 98200 44102',
          cropName: o.cropName,
          variety: o.variety || 'Commercial Grade',
          quantityKg: o.quantityKg || 1000,
          unit: o.unit || 'kg',
          agreedPricePerKg: o.agreedPricePerKg || 30,
          totalAmount: o.totalAmount || (o.quantityKg * (o.agreedPricePerKg || 30)),
          mandiBenchmarkPrice: o.mandiBenchmarkPrice || Math.round((o.agreedPricePerKg || 30) * 0.8),
          extraEarnedVsMandi: o.extraEarnedVsMandi || Math.round((o.totalAmount || 30000) * 0.15),
          commissionSaved: o.commissionSaved || Math.round((o.totalAmount || 30000) * 0.08),
          status: o.status === 'accepted' ? 'accepted' : o.status === 'dispatched' ? 'dispatched' : o.status === 'delivered' ? 'delivered' : 'pending',
          escrowStatus: o.escrowStatus === 'released_to_bank' ? 'released_to_bank' : 'locked_in_escrow',
          orderDate: o.orderDate || new Date().toISOString().split('T')[0],
          expectedDeliveryDate: o.expectedDeliveryDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          deliveryLocation: o.deliveryLocation || 'Vashi Mandi, Navi Mumbai',
          notes: o.notes,
        }));
      }
      return [];
    } catch (err) {
      console.warn('[API Client] Error fetching orders:', err);
      return [];
    }
  },

  async createOrder(orderData: any): Promise<any> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      return await res.json();
    } catch (err) {
      console.error('[API Client] Error creating order:', err);
      return { success: false, error: 'Network error' };
    }
  },

  async updateOrderStatus(orderId: string, status: string, escrowStatus?: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, escrowStatus }),
      });
      const json = await res.json();
      return Boolean(json.success);
    } catch {
      return false;
    }
  },

  // Transportation Trucks & Trips
  async getTrucks(): Promise<AvailableTruck[]> {
    try {
      const res = await fetch('/api/trucks');
      const json = await res.json();
      if (json.success && Array.isArray(json.trucks)) {
        return json.trucks.map((t: any): AvailableTruck => ({
          id: t.truckId,
          truckType: t.truckType,
          capacityMT: t.capacityMT,
          currentHub: t.currentHub,
          driverName: t.driverName,
          driverPhone: t.driverPhone,
          vehicleNumber: t.vehicleNumber,
          tempRange: t.refrigerationType === 'deep_freeze' ? '-25°C to -15°C' : '-4°C to +15°C',
          isAvailable: t.availability === 'available' || t.status === 'active',
          baseRatePerKm: t.baseRatePerKm,
          rating: t.rating || 4.9,
        }));
      }
      return [];
    } catch (err) {
      console.warn('[API Client] Error fetching trucks:', err);
      return [];
    }
  },

  async getTrips(farmerId?: string): Promise<TruckTrip[]> {
    try {
      const url = farmerId ? `/api/trips?farmerId=${encodeURIComponent(farmerId)}` : '/api/trips';
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && Array.isArray(json.trips)) {
        return json.trips.map((tr: any): TruckTrip => ({
          id: tr.tripId,
          lotId: tr.lotId,
          crop: tr.crop,
          quantityKg: tr.quantityKg,
          pickupLocation: tr.pickupLocation,
          destinationLocation: tr.destinationLocation || tr.destination,
          distanceKm: tr.distanceKm,
          baseCostPerKm: tr.baseCostPerKm || tr.applicableRatePerKm || 25,
          ownershipType: (tr.transportationOwnership || tr.ownershipType || 'kisandirect') as TruckOwnershipType,
          truckType: tr.truckType,
          vehicleNumber: tr.vehicleNumber,
          driverName: tr.driverName,
          driverPhone: tr.driverPhone,
          requiredDate: tr.requiredDate,
          targetTempC: tr.targetTempC || 12,
          status: (tr.status || 'In Transit') as TripStatus,
          baseCost: tr.baseCost || tr.baseTransportationCost || (tr.distanceKm * 25),
          serviceCharge: tr.serviceCharge || tr.kisanDirectServiceCharge || 0,
          totalCost: tr.totalCost || tr.totalTransportationCost || ((tr.distanceKm * 25) + (tr.serviceCharge || 0)),
          dispatchedAt: tr.dispatchedAt || new Date().toISOString().replace('T', ' ').substring(0, 16),
          eta: tr.eta || 'Scheduled',
          routeProgressPct: tr.routeProgressPct || 25,
          notes: tr.notes,
        }));
      }
      return [];
    } catch (err) {
      console.warn('[API Client] Error fetching trips:', err);
      return [];
    }
  },

  async calculateTripQuote(distanceKm: number, customRate?: number, ownershipType: 'own' | 'kisandirect' = 'kisandirect'): Promise<TransportationQuoteResponse | null> {
    try {
      const res = await fetch('/api/transportation/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ distanceKm, customBaseCostPerKm: customRate, ownershipType }),
      });
      const json = await res.json();
      if (json.success && json.quote) {
        return json.quote;
      }
      return null;
    } catch (err) {
      console.warn('[API Client] Error getting transportation quote:', err);
      return null;
    }
  },

  async createTrip(tripData: any): Promise<TruckTrip | null> {
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData),
      });
      const json = await res.json();
      if (json.success && json.trip) {
        const tr = json.trip;
        return {
          id: tr.tripId,
          lotId: tr.lotId,
          crop: tr.crop,
          quantityKg: tr.quantityKg,
          pickupLocation: tr.pickupLocation,
          destinationLocation: tr.destinationLocation,
          distanceKm: tr.distanceKm,
          baseCostPerKm: tr.baseCostPerKm,
          ownershipType: tr.transportationOwnership || tr.ownershipType,
          truckType: tr.truckType,
          vehicleNumber: tr.vehicleNumber,
          driverName: tr.driverName,
          driverPhone: tr.driverPhone,
          requiredDate: tr.requiredDate,
          targetTempC: tr.targetTempC,
          status: (tr.status || 'In Transit') as TripStatus,
          baseCost: tr.baseCost,
          serviceCharge: tr.serviceCharge,
          totalCost: tr.totalCost,
          dispatchedAt: tr.dispatchedAt,
          eta: tr.eta,
          routeProgressPct: tr.routeProgressPct || 15,
          notes: tr.notes,
        };
      }
      return null;
    } catch (err) {
      console.error('[API Client] Error creating trip:', err);
      return null;
    }
  },

  async updateTripStatus(tripId: string, status: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/trips/${encodeURIComponent(tripId)}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      return Boolean(json.success);
    } catch {
      return false;
    }
  },

  // Farmer Profile
  async getFarmerProfile(farmerId = 'farmer-001'): Promise<FarmerProfile | null> {
    try {
      const res = await fetch(`/api/farmers/${encodeURIComponent(farmerId)}`);
      const json = await res.json();
      if (json.success && json.farmer) {
        const f = json.farmer;
        return {
          id: f.farmerId,
          fullName: f.name || f.fullName,
          phone: f.phone,
          farmName: f.farmName,
          village: f.village,
          taluk: f.taluk,
          district: f.district,
          state: f.state,
          pincode: f.pincode,
          landHoldingAcres: f.landHoldingAcres,
          kccNumber: f.kccNumber,
          fpoName: f.fpoName,
          isVerified: f.isVerified,
          primaryCrops: f.primaryCrops,
          bankAccount: f.bankAccount,
          memberSince: f.memberSince,
          totalEarningsDirect: f.totalEarningsDirect,
          traditionalCutSaved: f.traditionalCutSaved,
        };
      }
      return null;
    } catch {
      return null;
    }
  },

  // Government of India Mandi Prices (data.gov.in / AGMARKNET)
  async getMandiPrices(filters: {
    commodity?: string;
    state?: string;
    district?: string;
    market?: string;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<MandiPriceSearchResponse> {
    try {
      const params = new URLSearchParams();
      if (filters.commodity) params.set('commodity', filters.commodity);
      if (filters.state) params.set('state', filters.state);
      if (filters.district) params.set('district', filters.district);
      if (filters.market) params.set('market', filters.market);
      if (filters.search) params.set('search', filters.search);
      if (filters.limit) params.set('limit', String(filters.limit));
      if (filters.offset) params.set('offset', String(filters.offset));

      const res = await fetch(`/api/mandi-prices?${params.toString()}`);
      const json = await res.json();
      return json;
    } catch (err: any) {
      console.warn('[API Client] Error fetching mandi prices:', err);
      return {
        success: false,
        records: [],
        total: 0,
        source: 'AGMARKNET Cache',
        apiKeyConfigured: false,
        lastUpdated: new Date().toISOString(),
        message: 'Unable to connect to Mandi Price service.'
      };
    }
  },

  async getMandiSummary(): Promise<{ commodities: string[]; states: string[]; markets: string[] }> {
    try {
      const res = await fetch('/api/mandi-prices/summary');
      const json = await res.json();
      if (json.success && json.summary) {
        return json.summary;
      }
      return { commodities: [], states: [], markets: [] };
    } catch {
      return { commodities: [], states: [], markets: [] };
    }
  },

  async getMandiComparison(commodity = 'Tomato'): Promise<{
    commodity: string;
    averageModalPriceKg: number;
    highestMandi: MandiPriceRecord | null;
    lowestMandi: MandiPriceRecord | null;
    mandis: MandiPriceRecord[];
  }> {
    try {
      const res = await fetch(`/api/mandi-prices/comparison?commodity=${encodeURIComponent(commodity)}`);
      const json = await res.json();
      return json;
    } catch {
      return {
        commodity,
        averageModalPriceKg: 0,
        highestMandi: null,
        lowestMandi: null,
        mandis: [],
      };
    }
  }
};
