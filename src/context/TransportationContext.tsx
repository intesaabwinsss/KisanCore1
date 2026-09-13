import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TruckTrip, AvailableTruck, TruckOwnershipType } from '../types';
import { calculateTransportationPricing } from '../utils/transportationPricing';

const INITIAL_TRIPS: TruckTrip[] = [
  {
    id: 'TRP-101',
    lotId: 'LOT-NSK-904',
    crop: 'Nashik Red Onions',
    quantityKg: 14000,
    pickupLocation: 'Nashik Packhouse Yard, Pimpalgaon',
    destinationLocation: 'Vashi APMC Mandi, Mumbai',
    distanceKm: 165,
    baseCostPerKm: 25,
    ownershipType: 'kisandirect',
    truckType: 'BharatBenz 24ft Heavy Reefer (14 MT)',
    vehicleNumber: 'MH-15-DC-4421',
    driverName: 'Balwant Singh',
    driverPhone: '+91 98114 88201',
    requiredDate: '2026-09-14',
    targetTempC: 14,
    status: 'In Transit',
    baseCost: 165 * 25, // 4125
    serviceCharge: 15 * 5 + (165 - 15) * 3, // 75 + 450 = 525
    totalCost: (165 * 25) + 525, // 4650
    dispatchedAt: '2026-09-12 06:30',
    eta: 'Today 17:30',
    routeProgressPct: 65,
    notes: 'Pre-cooled to 14°C at packhouse. Escrow verified.',
  },
  {
    id: 'TRP-102',
    lotId: 'LOT-KLR-308',
    crop: 'Roma Hybrid Tomatoes',
    quantityKg: 7500,
    pickupLocation: 'Kolar Cold Storage Facility, Kolar',
    destinationLocation: 'Hosur Distribution Center, Bengaluru',
    distanceKm: 70,
    baseCostPerKm: 25,
    ownershipType: 'own',
    truckType: 'Farmer Owned Bolero Maxi Truck',
    vehicleNumber: 'KA-08-E-9022',
    driverName: 'M. Selvakumar',
    driverPhone: '+91 94432 10988',
    requiredDate: '2026-09-13',
    targetTempC: 11,
    status: 'Delivered',
    baseCost: 70 * 25, // 1750
    serviceCharge: 0,
    totalCost: 70 * 25, // 1750
    dispatchedAt: '2026-09-11 05:00',
    eta: 'Delivered Yesterday 12:00',
    routeProgressPct: 100,
    notes: 'Delivered on time with zero spoilage claims.',
  },
  {
    id: 'TRP-103',
    lotId: 'LOT-SML-502',
    crop: 'Royal Delicious Apples',
    quantityKg: 18000,
    pickupLocation: 'Kotgarh CA Cold Store, Shimla',
    destinationLocation: 'Azadpur Terminal Mandi, Delhi',
    distanceKm: 360,
    baseCostPerKm: 28,
    ownershipType: 'kisandirect',
    truckType: 'Multi-Axle 32ft Long Haul (22 MT)',
    vehicleNumber: 'HP-10-B-3109',
    driverName: 'Gurmeet Pal',
    driverPhone: '+91 98762 55431',
    requiredDate: '2026-09-15',
    targetTempC: 2,
    status: 'Truck Assigned',
    baseCost: 360 * 28, // 10080
    serviceCharge: 15 * 5 + (360 - 15) * 3, // 75 + 1035 = 1110
    totalCost: (360 * 28) + 1110, // 11190
    dispatchedAt: '2026-09-12 14:00',
    eta: 'Tomorrow 08:00',
    routeProgressPct: 15,
    notes: 'Controlled Atmosphere (CA) unit with continuous nitrogen flushing.',
  },
];

const INITIAL_AVAILABLE_TRUCKS: AvailableTruck[] = [
  {
    id: 'TRK-01',
    truckType: 'Bolero / 14ft Reefer (3.5 MT)',
    capacityMT: 3.5,
    currentHub: 'Nashik Packhouse Yard, Pimpalgaon',
    driverName: 'Rameshwar Kale',
    driverPhone: '+91 98220 55192',
    vehicleNumber: 'MH-15-BT-1092',
    tempRange: '-20°C to +15°C',
    isAvailable: true,
    baseRatePerKm: 25,
    rating: 4.9,
  },
  {
    id: 'TRK-02',
    truckType: 'Eicher Pro 20ft Reefer (7.5 MT)',
    capacityMT: 7.5,
    currentHub: 'Pune Agro Cold Store, Hadapsar',
    driverName: 'Sambhaji Shinde',
    driverPhone: '+91 94230 88129',
    vehicleNumber: 'MH-12-QX-5541',
    tempRange: '-25°C to +15°C',
    isAvailable: true,
    baseRatePerKm: 32,
    rating: 4.8,
  },
  {
    id: 'TRK-03',
    truckType: 'BharatBenz 24ft Heavy Reefer (14 MT)',
    capacityMT: 14,
    currentHub: 'Azadpur Terminal Mandi, Delhi',
    driverName: 'Harbhajan Singh',
    driverPhone: '+91 98140 33190',
    vehicleNumber: 'DL-01-AA-8902',
    tempRange: '-25°C to +15°C',
    isAvailable: true,
    baseRatePerKm: 38,
    rating: 5.0,
  },
  {
    id: 'TRK-04',
    truckType: 'Tata Ace Reefer (1.5 MT)',
    capacityMT: 1.5,
    currentHub: 'Kolar Cold Storage Facility, Karnataka',
    driverName: 'G. Venkatesh',
    driverPhone: '+91 94481 22910',
    vehicleNumber: 'KA-07-M-3419',
    tempRange: '-18°C to +15°C',
    isAvailable: true,
    baseRatePerKm: 20,
    rating: 4.7,
  },
  {
    id: 'TRK-05',
    truckType: 'Multi-Axle 32ft Long Haul (22 MT)',
    capacityMT: 22,
    currentHub: 'Guntur Packhouse Yard, Andhra Pradesh',
    driverName: 'V. Ramanjaneyulu',
    driverPhone: '+91 98480 77123',
    vehicleNumber: 'AP-07-TT-8890',
    tempRange: '-25°C to +15°C',
    isAvailable: true,
    baseRatePerKm: 46,
    rating: 4.9,
  },
];

interface DispatchTripInput {
  crop: string;
  quantityKg: number;
  pickupLocation: string;
  destinationLocation: string;
  distanceKm: number;
  baseCostPerKm: number;
  ownershipType: TruckOwnershipType;
  truckType: string;
  requiredDate: string;
  targetTempC: number;
  customVehicleNumber?: string;
  customDriverName?: string;
  customDriverPhone?: string;
  notes?: string;
}

interface TransportationContextType {
  trips: TruckTrip[];
  availableTrucks: AvailableTruck[];
  dispatchTrip: (input: DispatchTripInput) => TruckTrip;
  selectedTripForModal: TruckTrip | null;
  setSelectedTripForModal: (trip: TruckTrip | null) => void;
  deleteTrip: (id: string) => void;
  stats: {
    availableTrucksCount: number;
    activeTripsCount: number;
    upcomingTripsCount: number;
    completedTripsCount: number;
    totalTransportationSpending: number;
    averageCostPerKm: number;
  };
}

const TransportationContext = createContext<TransportationContextType | undefined>(undefined);

export const TransportationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<TruckTrip[]>(() => {
    try {
      const saved = localStorage.getItem('kisandirect_truck_trips');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not parse kisandirect_truck_trips', e);
    }
    return INITIAL_TRIPS;
  });

  const [availableTrucks] = useState<AvailableTruck[]>(INITIAL_AVAILABLE_TRUCKS);
  const [selectedTripForModal, setSelectedTripForModal] = useState<TruckTrip | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('kisandirect_truck_trips', JSON.stringify(trips));
    } catch (e) {
      console.warn('Could not save kisandirect_truck_trips', e);
    }
  }, [trips]);

  const dispatchTrip = (input: DispatchTripInput): TruckTrip => {
    const pricing = calculateTransportationPricing(
      input.distanceKm,
      input.baseCostPerKm,
      input.ownershipType
    );

    const now = new Date();
    const formattedNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Auto assign driver/truck if KisanDirect, or use farmer's own details
    let assignedVehicle = input.customVehicleNumber || 'MH-15-DC-9921';
    let assignedDriver = input.customDriverName || 'KisanDirect Verified Captain';
    let assignedPhone = input.customDriverPhone || '+91 98220 12345';

    if (input.ownershipType === 'kisandirect') {
      const matchedTruck = availableTrucks.find(t => t.isAvailable) || availableTrucks[0];
      if (matchedTruck) {
        assignedVehicle = matchedTruck.vehicleNumber;
        assignedDriver = matchedTruck.driverName;
        assignedPhone = matchedTruck.driverPhone;
      }
    } else {
      assignedVehicle = input.customVehicleNumber || 'Own Farm Truck';
      assignedDriver = input.customDriverName || 'Self / Farm Driver';
    }

    const newTrip: TruckTrip = {
      id: `TRP-${Math.floor(100 + Math.random() * 900)}`,
      lotId: `LOT-${Math.floor(100 + Math.random() * 900)}`,
      crop: input.crop,
      quantityKg: Number(input.quantityKg) || 1000,
      pickupLocation: input.pickupLocation,
      destinationLocation: input.destinationLocation,
      distanceKm: pricing.distance,
      baseCostPerKm: pricing.baseCostPerKm,
      ownershipType: input.ownershipType,
      truckType: input.truckType,
      vehicleNumber: assignedVehicle,
      driverName: assignedDriver,
      driverPhone: assignedPhone,
      requiredDate: input.requiredDate || new Date().toISOString().split('T')[0],
      targetTempC: Number(input.targetTempC) || 12,
      status: 'In Transit',
      baseCost: pricing.baseCost,
      serviceCharge: pricing.totalServiceCharge,
      totalCost: pricing.totalCost,
      dispatchedAt: formattedNow,
      eta: 'In Transit (Scheduled)',
      routeProgressPct: 15,
      notes: input.notes,
    };

    setTrips(prev => [newTrip, ...prev]);
    return newTrip;
  };

  const deleteTrip = (id: string) => {
    setTrips(prev => prev.filter(t => t.id !== id));
  };

  // Compute live statistics
  const activeTripsCount = trips.filter(t => t.status === 'In Transit').length;
  const upcomingTripsCount = trips.filter(t => t.status === 'Requested' || t.status === 'Truck Assigned').length;
  const completedTripsCount = trips.filter(t => t.status === 'Delivered' || t.status === 'Completed').length;
  const totalTransportationSpending = trips.reduce((acc, t) => acc + t.totalCost, 0);
  const totalKmSum = trips.reduce((acc, t) => acc + t.distanceKm, 0);
  const averageCostPerKm = totalKmSum > 0 ? Math.round(totalTransportationSpending / totalKmSum * 10) / 10 : 25;

  const stats = {
    availableTrucksCount: availableTrucks.length,
    activeTripsCount,
    upcomingTripsCount,
    completedTripsCount,
    totalTransportationSpending,
    averageCostPerKm,
  };

  return (
    <TransportationContext.Provider
      value={{
        trips,
        availableTrucks,
        dispatchTrip,
        selectedTripForModal,
        setSelectedTripForModal,
        deleteTrip,
        stats,
      }}
    >
      {children}
    </TransportationContext.Provider>
  );
};

export const useTransportation = () => {
  const context = useContext(TransportationContext);
  if (!context) {
    throw new Error('useTransportation must be used within a TransportationProvider');
  }
  return context;
};
