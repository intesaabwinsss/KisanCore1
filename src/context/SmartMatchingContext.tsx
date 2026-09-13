import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  MatchingFarmerListing,
  MatchingBuyerRequirement,
  SmartMatch,
  MultiFarmerBundle,
  MatchingConfig,
  MatchingAnalyticsData,
  MatchStatus,
} from '../types';
import {
  smartMatchingService,
  DEFAULT_MATCHING_CONFIG,
  DEMO_FARMER_LISTINGS,
  DEMO_BUYER_REQUIREMENTS,
} from '../services/smartMatchingService';

export type MatchingFilterTab =
  | 'recommended'
  | 'best_price'
  | 'nearest'
  | 'highest_qty'
  | 'freshest'
  | 'urgent'
  | 'bundles'
  | 'all';

interface SmartMatchingContextType {
  farmerListings: MatchingFarmerListing[];
  buyerRequirements: MatchingBuyerRequirement[];
  matches: SmartMatch[];
  multiFarmerBundles: MultiFarmerBundle[];
  matchingConfig: MatchingConfig;
  analytics: MatchingAnalyticsData;
  isLoading: boolean;
  selectedMatch: SmartMatch | null;
  setSelectedMatch: (match: SmartMatch | null) => void;
  selectedBundle: MultiFarmerBundle | null;
  setSelectedBundle: (bundle: MultiFarmerBundle | null) => void;
  activeFilterTab: MatchingFilterTab;
  setActiveFilterTab: (tab: MatchingFilterTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCropFilter: string;
  setSelectedCropFilter: (crop: string) => void;
  actionMessage: { type: 'success' | 'info' | 'error'; text: string } | null;
  
  // Actions
  acceptMatch: (matchId: string) => Promise<boolean>;
  sendOffer: (matchId: string, offerPrice?: number) => Promise<boolean>;
  negotiatePrice: (matchId: string, counterPrice: number) => Promise<boolean>;
  createOrderFromMatch: (matchId: string) => Promise<{ success: boolean; orderNumber?: string }>;
  rejectMatch: (matchId: string) => void;
  acceptBundle: (bundleId: string) => Promise<boolean>;
  addFarmerListing: (listing: Omit<MatchingFarmerListing, 'id' | 'initialQuantityKg' | 'reservedQuantityKg' | 'status'>) => void;
  addBuyerRequirement: (requirement: Omit<MatchingBuyerRequirement, 'id' | 'priorityScore' | 'status'>) => void;
  updateMatchingConfig: (newConfig: Partial<MatchingConfig>) => void;
  resetToDemoData: () => void;
  getMatchesForFarmer: (farmerId: string) => SmartMatch[];
  getMatchesForBuyer: (buyerId: string) => SmartMatch[];
  clearActionMessage: () => void;
}

const SmartMatchingContext = createContext<SmartMatchingContextType | undefined>(undefined);

export const SmartMatchingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [farmerListings, setFarmerListings] = useState<MatchingFarmerListing[]>(() => {
    const saved = localStorage.getItem('kisanmandi_farmer_listings');
    return saved ? JSON.parse(saved) : DEMO_FARMER_LISTINGS;
  });

  const [buyerRequirements, setBuyerRequirements] = useState<MatchingBuyerRequirement[]>(() => {
    const saved = localStorage.getItem('kisanmandi_buyer_requirements');
    return saved ? JSON.parse(saved) : DEMO_BUYER_REQUIREMENTS;
  });

  const [matchingConfig, setMatchingConfig] = useState<MatchingConfig>(() => {
    const saved = localStorage.getItem('kisanmandi_matching_config');
    return saved ? JSON.parse(saved) : DEFAULT_MATCHING_CONFIG;
  });

  const [matches, setMatches] = useState<SmartMatch[]>([]);
  const [multiFarmerBundles, setMultiFarmerBundles] = useState<MultiFarmerBundle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<SmartMatch | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<MultiFarmerBundle | null>(null);
  const [activeFilterTab, setActiveFilterTab] = useState<MatchingFilterTab>('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  // Sync config into service
  useEffect(() => {
    smartMatchingService.updateConfig(matchingConfig);
    localStorage.setItem('kisanmandi_matching_config', JSON.stringify(matchingConfig));
  }, [matchingConfig]);

  // Persist listings & requirements
  useEffect(() => {
    localStorage.setItem('kisanmandi_farmer_listings', JSON.stringify(farmerListings));
  }, [farmerListings]);

  useEffect(() => {
    localStorage.setItem('kisanmandi_buyer_requirements', JSON.stringify(buyerRequirements));
  }, [buyerRequirements]);

  // Recalculate matches & multi-farmer bundles whenever listings, requirements, or config change
  useEffect(() => {
    setIsLoading(true);
    try {
      const computedMatches = smartMatchingService.generateAllMatches(farmerListings, buyerRequirements);
      setMatches(computedMatches);

      // Compute multi-farmer bundles for requirements requiring >= 500kg
      const bundles: MultiFarmerBundle[] = [];
      for (const req of buyerRequirements) {
        if (req.quantityRequiredKg >= 500 && req.status === 'active') {
          const bundle = smartMatchingService.optimizeMultiFarmerBundle(req, farmerListings);
          if (bundle && bundle.farmersCount > 1) {
            bundles.push(bundle);
          }
        }
      }
      setMultiFarmerBundles(bundles);
    } catch (error) {
      console.error('Error generating smart matches:', error);
    } finally {
      setIsLoading(false);
    }
  }, [farmerListings, buyerRequirements, matchingConfig]);

  const analytics = useMemo(() => {
    return smartMatchingService.generateAnalytics(matches, multiFarmerBundles);
  }, [matches, multiFarmerBundles]);

  const clearActionMessage = () => setActionMessage(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setActionMessage({ type, text });
    setTimeout(() => {
      setActionMessage(null);
    }, 5000);
  };

  // Action: Accept Match (Reserves inventory safely)
  const acceptMatch = async (matchId: string): Promise<boolean> => {
    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch) return false;

    const { farmerListing, matchedQuantityKg } = targetMatch;

    // Check available inventory
    if (farmerListing.quantityAvailableKg < matchedQuantityKg) {
      showToast(`Cannot accept match: Only ${farmerListing.quantityAvailableKg} kg remaining in stock.`, 'error');
      return false;
    }

    // Reserve inventory
    setFarmerListings((prev) =>
      prev.map((listing) => {
        if (listing.id === farmerListing.id) {
          const newAvailable = Math.max(0, listing.quantityAvailableKg - matchedQuantityKg);
          const newReserved = (listing.reservedQuantityKg || 0) + matchedQuantityKg;
          return {
            ...listing,
            quantityAvailableKg: newAvailable,
            reservedQuantityKg: newReserved,
            status: newAvailable === 0 ? 'reserved' : 'active',
          };
        }
        return listing;
      })
    );

    // Update match status
    setMatches((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, status: 'accepted' as MatchStatus } : m))
    );

    showToast(
      `Match accepted! ${matchedQuantityKg.toLocaleString()} kg of ${farmerListing.cropName} reserved for ${targetMatch.buyerRequirement.buyerCompany}. Escrow locked at ₹${targetMatch.estimatedPricePerKg}/kg.`,
      'success'
    );
    return true;
  };

  // Action: Send Offer
  const sendOffer = async (matchId: string, offerPrice?: number): Promise<boolean> => {
    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch) return false;

    const price = offerPrice || targetMatch.estimatedPricePerKg;

    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? {
              ...m,
              status: 'offer_sent' as MatchStatus,
              estimatedPricePerKg: price,
              totalEstimatedDeal: Math.round(m.matchedQuantityKg * price),
            }
          : m
      )
    );

    showToast(
      `Offer of ₹${price}/kg for ${targetMatch.matchedQuantityKg.toLocaleString()} kg dispatched to ${targetMatch.buyerRequirement.buyerCompany}. Notification sent!`,
      'success'
    );
    return true;
  };

  // Action: Negotiate Price
  const negotiatePrice = async (matchId: string, counterPrice: number): Promise<boolean> => {
    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch) return false;

    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? {
              ...m,
              status: 'negotiating' as MatchStatus,
              estimatedPricePerKg: counterPrice,
              totalEstimatedDeal: Math.round(m.matchedQuantityKg * counterPrice),
            }
          : m
      )
    );

    showToast(
      `Counter-proposal of ₹${counterPrice}/kg submitted for ${targetMatch.matchedQuantityKg.toLocaleString()} kg. Both parties notified.`,
      'info'
    );
    return true;
  };

  // Action: Create Order From Match
  const createOrderFromMatch = async (
    matchId: string
  ): Promise<{ success: boolean; orderNumber?: string }> => {
    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch) return { success: false };

    const orderNumber = `KM-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    // Update match status to order_created
    setMatches((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, status: 'order_created' as MatchStatus, orderNumber } : m))
    );

    showToast(
      `Direct Escrow Contract Confirmed! Order #${orderNumber} created for ${targetMatch.matchedQuantityKg.toLocaleString()} kg of ${targetMatch.farmerListing.cropName} at ₹${targetMatch.estimatedPricePerKg}/kg.`,
      'success'
    );
    return { success: true, orderNumber };
  };

  // Action: Reject Match
  const rejectMatch = (matchId: string) => {
    setMatches((prev) => prev.filter((m) => m.id !== matchId));
    showToast('Match recommendation dismissed from dashboard.', 'info');
  };

  // Action: Accept Bundle
  const acceptBundle = async (bundleId: string): Promise<boolean> => {
    const targetBundle = multiFarmerBundles.find((b) => b.id === bundleId);
    if (!targetBundle) return false;

    // Reserve for all participating farmers
    for (const match of targetBundle.participatingMatches) {
      await acceptMatch(match.id);
    }

    setMultiFarmerBundles((prev) =>
      prev.map((b) => (b.id === bundleId ? { ...b, status: 'accepted' } : b))
    );

    showToast(
      `Multi-Farmer Bundle Confirmed! ${targetBundle.totalMatchedKg.toLocaleString()} kg fulfilled across ${targetBundle.farmersCount} farmers with guaranteed escrow.`,
      'success'
    );
    return true;
  };

  // Action: Add Farmer Listing (triggers automatic re-ranking)
  const addFarmerListing = (
    listingData: Omit<MatchingFarmerListing, 'id' | 'initialQuantityKg' | 'reservedQuantityKg' | 'status'>
  ) => {
    const newListing: MatchingFarmerListing = {
      ...listingData,
      id: `farmer-listing-${Date.now()}`,
      initialQuantityKg: listingData.quantityAvailableKg,
      reservedQuantityKg: 0,
      status: 'active',
    };

    setFarmerListings((prev) => [newListing, ...prev]);
    showToast(`New produce lot "${newListing.cropName}" listed! Smart Matching recalculated.`, 'success');
  };

  // Action: Add Buyer Requirement (triggers automatic re-ranking)
  const addBuyerRequirement = (
    requirementData: Omit<MatchingBuyerRequirement, 'id' | 'priorityScore' | 'status'>
  ) => {
    const newReq: MatchingBuyerRequirement = {
      ...requirementData,
      id: `buyer-req-${Date.now()}`,
      priorityScore: requirementData.urgency === 'urgent' ? 95 : requirementData.urgency === 'high' ? 85 : 70,
      status: 'active',
    };

    setBuyerRequirements((prev) => [newReq, ...prev]);
    showToast(`New bulk demand for "${newReq.cropRequired}" posted! Smart Matching recalculated.`, 'success');
  };

  // Action: Update Config
  const updateMatchingConfig = (newConfig: Partial<MatchingConfig>) => {
    setMatchingConfig((prev) => {
      const updated = {
        ...prev,
        ...newConfig,
        weights: newConfig.weights ? { ...prev.weights, ...newConfig.weights } : prev.weights,
        deliveryCostParams: newConfig.deliveryCostParams
          ? { ...prev.deliveryCostParams, ...newConfig.deliveryCostParams }
          : prev.deliveryCostParams,
      };
      return updated;
    });
    showToast('Matching algorithm weights and logistics parameters updated successfully.', 'success');
  };

  // Action: Reset Demo
  const resetToDemoData = () => {
    setFarmerListings(DEMO_FARMER_LISTINGS);
    setBuyerRequirements(DEMO_BUYER_REQUIREMENTS);
    setMatchingConfig(DEFAULT_MATCHING_CONFIG);
    localStorage.removeItem('kisanmandi_farmer_listings');
    localStorage.removeItem('kisanmandi_buyer_requirements');
    localStorage.removeItem('kisanmandi_matching_config');
    showToast('Smart Matching environment reset to canonical demo dataset.', 'info');
  };

  const getMatchesForFarmer = (farmerId: string) => {
    return matches.filter((m) => m.farmerListing.farmerId === farmerId || m.farmerListing.id === farmerId);
  };

  const getMatchesForBuyer = (buyerId: string) => {
    return matches.filter((m) => m.buyerRequirement.buyerId === buyerId || m.buyerRequirement.id === buyerId);
  };

  return (
    <SmartMatchingContext.Provider
      value={{
        farmerListings,
        buyerRequirements,
        matches,
        multiFarmerBundles,
        matchingConfig,
        analytics,
        isLoading,
        selectedMatch,
        setSelectedMatch,
        selectedBundle,
        setSelectedBundle,
        activeFilterTab,
        setActiveFilterTab,
        searchQuery,
        setSearchQuery,
        selectedCropFilter,
        setSelectedCropFilter,
        actionMessage,
        acceptMatch,
        sendOffer,
        negotiatePrice,
        createOrderFromMatch,
        rejectMatch,
        acceptBundle,
        addFarmerListing,
        addBuyerRequirement,
        updateMatchingConfig,
        resetToDemoData,
        getMatchesForFarmer,
        getMatchesForBuyer,
        clearActionMessage,
      }}
    >
      {children}
    </SmartMatchingContext.Provider>
  );
};

export const useSmartMatching = (): SmartMatchingContextType => {
  const context = useContext(SmartMatchingContext);
  if (!context) {
    throw new Error('useSmartMatching must be used within a SmartMatchingProvider');
  }
  return context;
};
