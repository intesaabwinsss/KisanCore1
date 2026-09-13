import { TruckOwnershipType, TransportationPricingBreakdown } from '../types';

/**
 * Distance-based tiered rate structure:
 * 0–10 KM: ₹25/KM
 * 11–25 KM: ₹24/KM
 * 26–50 KM: ₹22/KM
 * 51–100 KM: ₹20/KM
 * 101–200 KM: ₹18/KM
 * >200 KM: ₹18/KM
 */
export function getTransportationRate(distance: number): number {
  const safeDistance = Math.max(0, Number(distance) || 0);
  if (safeDistance <= 10) return 25;
  if (safeDistance <= 25) return 24;
  if (safeDistance <= 50) return 22;
  if (safeDistance <= 100) return 20;
  return 18;
}

/**
 * KisanDirect Trucks Centralized Pricing Engine
 * 
 * Rules:
 * 1. Applicable Rate = getTransportationRate(distance) or custom baseCostPerKm if explicitly overridden
 * 2. Base Transportation Cost = Distance × Applicable Cost Per KM
 * 3. If farmer owns truck: Total Cost = Base Transportation Cost
 * 4. If KisanDirect Trucks:
 *    - First 15 KM: ₹5 per KM
 *    - Beyond 15 KM: ₹3 per additional KM
 *    - Service Charge = (first 15 KM × ₹5) + (remaining KM × ₹3)
 *    - Total Cost = Base Transportation Cost + Service Charge
 */
export function calculateTransportationPricing(
  distance: number,
  customBaseCostPerKm?: number,
  ownershipType: TruckOwnershipType = 'kisandirect'
): TransportationPricingBreakdown {
  const safeDistance = Math.max(0, Number(distance) || 0);
  const applicableRate = customBaseCostPerKm !== undefined && customBaseCostPerKm > 0 
    ? customBaseCostPerKm 
    : getTransportationRate(safeDistance);

  const baseCost = Math.round(safeDistance * applicableRate);
  const first15Km = Math.min(safeDistance, 15);
  const remainingKm = Math.max(0, safeDistance - 15);

  const first15Rate = 5;
  const remainingRate = 3;

  let first15ServiceCharge = 0;
  let remainingServiceCharge = 0;
  let totalServiceCharge = 0;

  if (ownershipType === 'kisandirect') {
    first15ServiceCharge = Math.round(first15Km * first15Rate);
    remainingServiceCharge = Math.round(remainingKm * remainingRate);
    totalServiceCharge = first15ServiceCharge + remainingServiceCharge;
  }

  const totalCost = baseCost + totalServiceCharge;
  const ownTruckEquivalentCost = baseCost;
  const serviceChargeDifference = totalCost - ownTruckEquivalentCost;

  return {
    distance: safeDistance,
    baseCostPerKm: applicableRate,
    ownershipType,
    baseCost,
    first15Km,
    remainingKm,
    first15Rate,
    remainingRate,
    first15ServiceCharge,
    remainingServiceCharge,
    totalServiceCharge,
    totalCost,
    ownTruckEquivalentCost,
    serviceChargeDifference,
  };
}

export const PRESET_DISTANCES = [10, 25, 50, 100, 200];

export interface ScalingRowData {
  distance: number;
  ratePerKm: number;
  ownTruckCost: number;
  serviceCharge: number;
  kisandirectTotal: number;
}

export function getDynamicScalingRows(): ScalingRowData[] {
  return [10, 25, 50, 100, 200].map(km => {
    const ownPricing = calculateTransportationPricing(km, undefined, 'own');
    const kdPricing = calculateTransportationPricing(km, undefined, 'kisandirect');
    return {
      distance: km,
      ratePerKm: ownPricing.baseCostPerKm,
      ownTruckCost: ownPricing.totalCost,
      serviceCharge: kdPricing.totalServiceCharge,
      kisandirectTotal: kdPricing.totalCost,
    };
  });
}

export const CRITICAL_TEST_CASES = [
  { distance: 10, expectedRate: 25, expectedBase: 250, expectedService: 50, expectedTotalKd: 300 },
  { distance: 25, expectedRate: 24, expectedBase: 600, expectedService: 105, expectedTotalKd: 705 },
  { distance: 50, expectedRate: 22, expectedBase: 1100, expectedService: 180, expectedTotalKd: 1280 },
  { distance: 100, expectedRate: 20, expectedBase: 2000, expectedService: 330, expectedTotalKd: 2330 },
  { distance: 200, expectedRate: 18, expectedBase: 3600, expectedService: 630, expectedTotalKd: 4230 },
];

export const STANDARD_REEFER_TYPES = [
  { id: 'reefer-mini', name: 'Tata Ace Reefer (1.5 MT)', minTemp: -18, maxTemp: 15, defaultRate: 20 },
  { id: 'reefer-14ft', name: 'Bolero / 14ft Reefer (3.5 MT)', minTemp: -20, maxTemp: 15, defaultRate: 25 },
  { id: 'reefer-20ft', name: 'Eicher Pro 20ft Reefer (7.5 MT)', minTemp: -25, maxTemp: 15, defaultRate: 32 },
  { id: 'reefer-24ft', name: 'BharatBenz 24ft Heavy Reefer (14 MT)', minTemp: -25, maxTemp: 15, defaultRate: 38 },
  { id: 'reefer-32ft', name: 'Multi-Axle 32ft Long Haul (22 MT)', minTemp: -25, maxTemp: 15, defaultRate: 46 },
];

export const POPULAR_AGRI_ROUTES = [
  { origin: 'Nashik Packhouse Yard', destination: 'Vashi APMC Mandi, Mumbai', distance: 165 },
  { origin: 'Pimpalgaon Baswant', destination: 'Azadpur Terminal Mandi, Delhi', distance: 1250 },
  { origin: 'Kolar Cold Storage Facility', destination: 'Hosur Hub, Bengaluru', distance: 70 },
  { origin: 'Guntur Packhouse Yard', destination: 'Koyambedu Wholesale, Chennai', distance: 380 },
  { origin: 'Pune Agro Cold Store', destination: 'Navi Mumbai Cold Warehouse', distance: 140 },
  { origin: 'Fatehabad Cold Storage, Agra', destination: 'Sahibabad Wholesale Hub', distance: 210 },
  { origin: 'Katol Packhouse, Nagpur', destination: 'Bhopal Agro Processing Park', distance: 340 },
  { origin: 'Shimla CA Cold Storage', destination: 'Azadpur Mandi, Delhi', distance: 360 },
];
