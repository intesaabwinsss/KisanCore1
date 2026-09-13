/**
 * KisanDirect Centralized Transportation Pricing Service
 * 
 * Distance-based tiered rates:
 * 0–10 KM: ₹25/KM
 * 11–25 KM: ₹24/KM
 * 26–50 KM: ₹22/KM
 * 51–100 KM: ₹20/KM
 * 101–200 KM: ₹18/KM
 * >200 KM: ₹18/KM
 */
export function getTransportationRate(distanceKm: number): number {
  const safeDistance = Math.max(0, Number(distanceKm) || 0);
  if (safeDistance <= 10) return 25;
  if (safeDistance <= 25) return 24;
  if (safeDistance <= 50) return 22;
  if (safeDistance <= 100) return 20;
  return 18;
}

export interface TransportationCalculationResult {
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

/**
 * Calculates transportation cost based on distance and ownership.
 * 
 * Rules:
 * 1. Applicable Rate = customBaseCostPerKm if provided > 0, else getTransportationRate(distance)
 * 2. Base Transportation Cost = Distance * Applicable Rate
 * 3. If farmer owns truck: Total Cost = Base Transportation Cost (Service Charge = 0)
 * 4. If KisanDirect Trucks:
 *    - First 15 KM: ₹5 per KM
 *    - Beyond 15 KM: ₹3 per additional KM
 *    - Service Charge = (min(distance, 15) * 5) + (max(0, distance - 15) * 3)
 *    - Total Cost = Base Transportation Cost + Service Charge
 */
export function calculateTransportationCost(
  distanceKm: number,
  customBaseCostPerKm?: number,
  transportationOwnership: 'own' | 'kisandirect' = 'kisandirect'
): TransportationCalculationResult {
  const safeDistance = Math.max(0, Number(distanceKm) || 0);
  const normalizedOwnership: 'own' | 'kisandirect' = 
    transportationOwnership === 'own' ? 'own' : 'kisandirect';

  const applicableRatePerKm = customBaseCostPerKm !== undefined && customBaseCostPerKm > 0
    ? customBaseCostPerKm
    : getTransportationRate(safeDistance);

  const baseTransportationCost = Math.round(safeDistance * applicableRatePerKm);
  const first15Km = Math.min(safeDistance, 15);
  const remainingKm = Math.max(0, safeDistance - 15);

  const first15Rate = 5;
  const remainingRate = 3;

  let first15ServiceCharge = 0;
  let remainingServiceCharge = 0;
  let kisanDirectServiceCharge = 0;

  if (normalizedOwnership === 'kisandirect') {
    first15ServiceCharge = Math.round(first15Km * first15Rate);
    remainingServiceCharge = Math.round(remainingKm * remainingRate);
    kisanDirectServiceCharge = first15ServiceCharge + remainingServiceCharge;
  }

  const totalTransportationCost = baseTransportationCost + kisanDirectServiceCharge;
  const ownTruckEquivalentCost = baseTransportationCost;
  const serviceChargeDifference = totalTransportationCost - ownTruckEquivalentCost;

  return {
    distanceKm: safeDistance,
    ownershipType: normalizedOwnership,
    applicableRatePerKm,
    baseTransportationCost,
    first15Km,
    remainingKm,
    first15Rate,
    remainingRate,
    first15ServiceCharge,
    remainingServiceCharge,
    kisanDirectServiceCharge,
    totalTransportationCost,
    ownTruckEquivalentCost,
    serviceChargeDifference,
  };
}
