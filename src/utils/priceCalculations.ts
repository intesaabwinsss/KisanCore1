import { 
  CommodityPriceChain, 
  SupplyChainStage, 
  BatchCalculationResult,
  ProduceListing
} from '../types';

/**
 * Direct Price Transparency Calculation Engine & Pre-calibrated Agricultural Chains
 * Realistically maps Indian APMC supply chains vs KisanMandi Direct Digital Logistics
 */

export const COMMODITY_PRICE_CHAINS: CommodityPriceChain[] = [
  {
    commodityId: 'tomato',
    commodityName: 'Tomato',
    hindiName: 'टमाटर (Roma Hybrid)',
    variety: 'Abhinav Hybrid F1',
    category: 'Vegetables',
    defaultUnit: 'kg',
    originRegion: 'Kolar & Madanapalle Corridor',
    destinationMarket: 'Delhi-NCR / Bengaluru Retail Hubs',
    sampleImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    farmerReceivedPricePerKg: 18.0,
    traditionalStages: [
      {
        id: 'stage-1-farmer',
        actorType: 'farmer',
        actorName: 'Farmgate Producer',
        roleTitle: 'Farmer / Grower',
        locationContext: 'Village Farmpack, Kolar',
        iconName: 'Tractor',
        baseStagePricePerKg: 18.0,
        amountAddedPerKg: 18.0,
        cumulativePricePerKg: 18.0,
        operationalCostPerKg: 12.5, // Seeds, water, labor, harvesting
        intermediaryMarginPerKg: 5.5, // Farmer net income
        percentageOfFinalPrice: 34.6,
        wastagePercentage: 4.0,
        timeDelayDays: 0,
        costItems: [
          { id: 'c1', name: 'Field Cultivation & Seed Cost', amountPerKg: 7.0, category: 'operational_cost', description: 'Certified hybrid seeds, drip fertigation, and nursery care' },
          { id: 'c2', name: 'Manual Harvesting & Field Crates', amountPerKg: 5.5, category: 'operational_cost', description: 'Labor for selective ripe picking and field-level sorting' },
          { id: 'c3', name: 'Farmer Net Income', amountPerKg: 5.5, category: 'intermediary_margin', description: 'Net take-home realization for the grower family' },
        ],
        operationalNotes: 'Farmers bear 100% weather, water, and pest risks.',
        keyProblems: ['No minimum price assurance', 'Distress selling during peak arrivals'],
      },
      {
        id: 'stage-2-trader',
        actorType: 'local_trader',
        actorName: 'Village Aggregator (Kachha Arhatiya)',
        roleTitle: 'Village-Level Trader',
        locationContext: 'Taluk Hub, Karnataka',
        iconName: 'Store',
        baseStagePricePerKg: 18.0,
        amountAddedPerKg: 6.5,
        cumulativePricePerKg: 24.5,
        operationalCostPerKg: 3.5,
        intermediaryMarginPerKg: 3.0,
        percentageOfFinalPrice: 12.5,
        wastagePercentage: 6.0,
        timeDelayDays: 1,
        costItems: [
          { id: 't1', name: 'Village Aggregation & Wooden Crates', amountPerKg: 1.8, category: 'operational_cost', description: 'Packing in rough wooden crates that often damage skin' },
          { id: 't2', name: 'Local Diesel Freight to District Yard', amountPerKg: 1.7, category: 'operational_cost', description: 'Short-haul tractor/mini-truck transport to APMC yard' },
          { id: 't3', name: 'Local Trader Margin', amountPerKg: 3.0, category: 'intermediary_margin', description: 'Middleman trading profit and village cash financing spread' },
        ],
        operationalNotes: 'Aggregates smallholder lots into mini-trucks for mandis.',
        keyProblems: ['Arbitrary visual deductions', 'Unreceipted village-level loans'],
      },
      {
        id: 'stage-3-mandi',
        actorType: 'commission_agent',
        actorName: 'APMC Mandi Commission Agent (Pakka Arhatiya)',
        roleTitle: 'Mandi Commission Agent',
        locationContext: 'District APMC Mandi Yard',
        iconName: 'Building2',
        baseStagePricePerKg: 24.5,
        amountAddedPerKg: 7.5,
        cumulativePricePerKg: 32.0,
        operationalCostPerKg: 3.2,
        intermediaryMarginPerKg: 4.3,
        percentageOfFinalPrice: 14.4,
        wastagePercentage: 7.5,
        timeDelayDays: 2,
        costItems: [
          { id: 'm1', name: 'APMC User Cess & Mandi Market Tax (1.5-2%)', amountPerKg: 0.8, category: 'operational_cost', description: 'Statutory market committee yard fee' },
          { id: 'm2', name: 'Palledari (Unloading, Weighment & Handling)', amountPerKg: 1.4, category: 'operational_cost', description: 'Manual unloading, physical scale weighment, and stacking' },
          { id: 'm3', name: 'Auction Yard Spoilage & Bruising Loss', amountPerKg: 1.0, category: 'operational_cost', description: 'Exposure to sunlight on open concrete auction floors' },
          { id: 'm4', name: 'Commission Agent Cut (6% - 8.5%)', amountPerKg: 4.3, category: 'intermediary_margin', description: 'Commission agent brokerage spread' },
        ],
        operationalNotes: 'Closed bidding auction with delayed settlement cheques.',
        keyProblems: ['Kata / scale weighment discrepancies', '6-8.5% commission deducted directly'],
      },
      {
        id: 'stage-4-wholesaler',
        actorType: 'wholesaler',
        actorName: 'Secondary Wholesaler & Inter-City Distributor',
        roleTitle: 'Metro Wholesaler',
        locationContext: 'Azadpur / Vashi Terminal Hub',
        iconName: 'Truck',
        baseStagePricePerKg: 32.0,
        amountAddedPerKg: 9.0,
        cumulativePricePerKg: 41.0,
        operationalCostPerKg: 5.2,
        intermediaryMarginPerKg: 3.8,
        percentageOfFinalPrice: 17.3,
        wastagePercentage: 8.0,
        timeDelayDays: 2,
        costItems: [
          { id: 'w1', name: 'Long-haul Non-AC Truck Freight', amountPerKg: 3.2, category: 'operational_cost', description: 'Highway diesel toll and multi-axle open truck transit' },
          { id: 'w2', name: 'Terminal Unloading & Re-crating', amountPerKg: 1.0, category: 'operational_cost', description: 'Terminal night shift labor & crate transfer' },
          { id: 'w3', name: 'Transit Compression Spoilage (5-8%)', amountPerKg: 1.0, category: 'operational_cost', description: 'Crushed and overheated tomatoes during long road transit' },
          { id: 'w4', name: 'Wholesale Distributor Margin', amountPerKg: 3.8, category: 'intermediary_margin', description: 'Wholesale distributor holding and financing profit' },
        ],
        operationalNotes: 'Distributes in bulk to city sub-mandis and pushcart vendors.',
        keyProblems: ['Non-refrigerated transport causes severe rot', 'Multiple loading impacts'],
      },
      {
        id: 'stage-5-retailer',
        actorType: 'retailer',
        actorName: 'Urban Retailer / Kirana / Pushcart Vendor',
        roleTitle: 'Local Retail Vendor',
        locationContext: 'Neighborhood Market / Kirana',
        iconName: 'Store',
        baseStagePricePerKg: 41.0,
        amountAddedPerKg: 11.0,
        cumulativePricePerKg: 52.0,
        operationalCostPerKg: 6.0,
        intermediaryMarginPerKg: 5.0,
        percentageOfFinalPrice: 21.2,
        wastagePercentage: 10.0,
        timeDelayDays: 1,
        costItems: [
          { id: 'r1', name: 'Last-Mile Mini-Tempo / Auto Freight', amountPerKg: 1.5, category: 'operational_cost', description: 'Early morning pickup from wholesale mandi to local stall' },
          { id: 'r2', name: 'Retail Spoilage & End-of-Day Markdown Buffer', amountPerKg: 3.0, category: 'operational_cost', description: 'Over-ripe or damaged tomatoes discarded by evening (10-15%)' },
          { id: 'r3', name: 'Shop Rent, Polythene, & Stash Labor', amountPerKg: 1.5, category: 'operational_cost', description: 'Retail store overheads, electricity, and weighing bags' },
          { id: 'r4', name: 'Retailer Net Trade Margin', amountPerKg: 5.0, category: 'intermediary_margin', description: 'Retailer family income and risk cushion' },
        ],
        operationalNotes: 'Sells small quantities (1-2 kg) to final household consumers.',
        keyProblems: ['High retail markups required to cover 25-30% cumulative food spoilage'],
      },
    ],
    directModel: {
      farmerFarmgatePrice: 28.0, // Farmer gets ₹28.0 instead of ₹18.0 (+55.5%)
      platformFacilitationFee: 0.80, // Transparent 2% digital escrow fee
      coldChainLogisticsFee: 5.20, // Reer truck + digital quality assay
      finalDirectBuyerPrice: 34.0, // Consumer pays ₹34.0 instead of ₹52.0 (-34.6%)
      farmerGainPerKg: 10.0,
      farmerGainPercentage: 55.6,
      buyerSavingsPerKg: 18.0,
      buyerSavingsPercentage: 34.6,
      traditionalFinalRetailPrice: 52.0,
      spoilageTraditionalPct: 27.5,
      spoilageDirectPct: 1.8,
      intermediariesEliminatedCount: 4,
      paymentSettlementTime: 'Instant UPI (Within 2 Hours)',
    },
    keyInsights: {
      summary: 'In the traditional tomato supply chain, farmers receive only 34.6% of the consumer rupee while 65.4% is absorbed by 4 layers of middlemen and massive 27.5% transit rotting.',
      farmerShareTraditionalPct: 34.6,
      operationalCostsPct: 36.5,
      intermediaryMarginsPct: 28.9,
      wastageImpactNote: 'Over 27% of tomatoes rot in non-AC trucks. KisanMandi multi-temp cold-chain reduces this to under 2%, preserving real economic value for both farmer and consumer.',
    },
  },
  {
    commodityId: 'onion',
    commodityName: 'Red Onion',
    hindiName: 'प्याज (Nashik Red)',
    variety: 'Garwa / Gavran Medium',
    category: 'Vegetables',
    defaultUnit: 'kg',
    originRegion: 'Lasalgaon & Pimpalgaon Hub, Maharashtra',
    destinationMarket: 'Mumbai & Pan-India Metros',
    sampleImage: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
    farmerReceivedPricePerKg: 24.0,
    traditionalStages: [
      {
        id: 'st-on-1',
        actorType: 'farmer',
        actorName: 'Onion Farmer',
        roleTitle: 'Farmer / Chawl Storage Owner',
        locationContext: 'Niphad / Pimpalgaon',
        iconName: 'Tractor',
        baseStagePricePerKg: 24.0,
        amountAddedPerKg: 24.0,
        cumulativePricePerKg: 24.0,
        operationalCostPerKg: 16.0,
        intermediaryMarginPerKg: 8.0,
        percentageOfFinalPrice: 40.0,
        wastagePercentage: 5.0,
        timeDelayDays: 0,
        costItems: [
          { id: 'oc1', name: 'Seedling, Land Prep & Fertilizer', amountPerKg: 9.0, category: 'operational_cost', description: 'Certified onion nursery, potash, and micronutrients' },
          { id: 'oc2', name: 'Farmgate De-topping & Bagging', amountPerKg: 7.0, category: 'operational_cost', description: 'Labor for dry curing and jute mesh bagging' },
          { id: 'oc3', name: 'Farmer Take-Home Realization', amountPerKg: 8.0, category: 'intermediary_margin', description: 'Net return on 5-month cultivation cycle' },
        ],
        operationalNotes: 'Requires 4-5 months of hard farm labor plus ventilated shade curing.',
        keyProblems: ['Cartel pricing during peak rabi arrivals', 'Delayed cash payment'],
      },
      {
        id: 'st-on-2',
        actorType: 'local_trader',
        actorName: 'Mandi Commission Broker (Adathiya)',
        roleTitle: 'APMC Broker',
        locationContext: 'Lasalgaon APMC Market',
        iconName: 'Building2',
        baseStagePricePerKg: 24.0,
        amountAddedPerKg: 9.0,
        cumulativePricePerKg: 33.0,
        operationalCostPerKg: 3.5,
        intermediaryMarginPerKg: 5.5,
        percentageOfFinalPrice: 15.0,
        wastagePercentage: 4.0,
        timeDelayDays: 2,
        costItems: [
          { id: 'on-m1', name: 'Mandi Cess, Toll & Labor Handling', amountPerKg: 1.5, category: 'operational_cost', description: 'Market committee cess and palledari charges' },
          { id: 'on-m2', name: 'Weighment Deductions & Bag Handling', amountPerKg: 2.0, category: 'operational_cost', description: 'Re-bagging in 50kg gunny bags' },
          { id: 'on-m3', name: 'Commission Agent Spread (8%)', amountPerKg: 5.5, category: 'intermediary_margin', description: 'Agent commission on auction lot' },
        ],
        operationalNotes: 'Auctioned under open outcry; price swings heavily hourly.',
        keyProblems: ['Kata / weight manipulation', 'Cartel buying rings'],
      },
      {
        id: 'st-on-3',
        actorType: 'wholesaler',
        actorName: 'Wholesale Stockist & Transporter',
        roleTitle: 'Wholesale Stockist',
        locationContext: 'Vashi Market / Azadpur Mandi',
        iconName: 'Truck',
        baseStagePricePerKg: 33.0,
        amountAddedPerKg: 12.0,
        cumulativePricePerKg: 45.0,
        operationalCostPerKg: 6.5,
        intermediaryMarginPerKg: 5.5,
        percentageOfFinalPrice: 20.0,
        wastagePercentage: 6.0,
        timeDelayDays: 3,
        costItems: [
          { id: 'on-w1', name: 'Inter-State Multi-Axle Freight', amountPerKg: 3.5, category: 'operational_cost', description: 'Diesel, toll tax, and driver allowances' },
          { id: 'on-w2', name: 'Moisture Weight Shrinkage & Sprouting Loss', amountPerKg: 3.0, category: 'operational_cost', description: 'Natural 4-6% desiccation & black mold loss during transit' },
          { id: 'on-w3', name: 'Wholesaler Speculative Spread', amountPerKg: 5.5, category: 'intermediary_margin', description: 'Stock holding profit margin' },
        ],
        operationalNotes: 'Holds buffer stocks in sheds to exploit spot price spikes.',
        keyProblems: ['Artificial hoarding creates artificial retail inflation'],
      },
      {
        id: 'st-on-4',
        actorType: 'retailer',
        actorName: 'Neighborhood Retailer & Supermarket',
        roleTitle: 'Retailer',
        locationContext: 'Urban Kitchen Point',
        iconName: 'Store',
        baseStagePricePerKg: 45.0,
        amountAddedPerKg: 15.0,
        cumulativePricePerKg: 60.0,
        operationalCostPerKg: 6.0,
        intermediaryMarginPerKg: 9.0,
        percentageOfFinalPrice: 25.0,
        wastagePercentage: 8.0,
        timeDelayDays: 2,
        costItems: [
          { id: 'on-r1', name: 'Last Mile Cartage & Grading Labor', amountPerKg: 2.5, category: 'operational_cost', description: 'Cleaning outer loose peel and sorting sizes' },
          { id: 'on-r2', name: 'Rotten Bulb Shrinkage Cushion', amountPerKg: 3.5, category: 'operational_cost', description: 'Damaged/mushy onions sorted out' },
          { id: 'on-r3', name: 'Retail Margin & Store Rent', amountPerKg: 9.0, category: 'intermediary_margin', description: 'Retail markup on perishable items' },
        ],
        operationalNotes: 'Sells in small 1-5 kg bags to retail consumers.',
        keyProblems: ['Retail price reaches ₹60/kg while farmer got only ₹24/kg'],
      },
    ],
    directModel: {
      farmerFarmgatePrice: 36.0, // Farmer gets ₹36.0 instead of ₹24.0 (+50.0%)
      platformFacilitationFee: 0.90, // 2% digital escrow fee
      coldChainLogisticsFee: 5.10, // Aerated crate transport + sorting
      finalDirectBuyerPrice: 42.0, // Buyer pays ₹42.0 instead of ₹60.0 (-30.0%)
      farmerGainPerKg: 12.0,
      farmerGainPercentage: 50.0,
      buyerSavingsPerKg: 18.0,
      buyerSavingsPercentage: 30.0,
      traditionalFinalRetailPrice: 60.0,
      spoilageTraditionalPct: 19.5,
      spoilageDirectPct: 1.5,
      intermediariesEliminatedCount: 3,
      paymentSettlementTime: 'Instant Bank UPI (Same Day)',
    },
    keyInsights: {
      summary: 'For onions, middlemen take 60% of consumer spend. KisanMandi direct farmgate pickup pays farmers ₹36/kg (+50%) while lowering consumer kitchen cost from ₹60 to ₹42/kg.',
      farmerShareTraditionalPct: 40.0,
      operationalCostsPct: 31.7,
      intermediaryMarginsPct: 28.3,
      wastageImpactNote: 'Direct aerated crate transit prevents neck rot and moisture shrinkage, cutting spoilage by over 90%.',
    },
  },
  {
    commodityId: 'potato',
    commodityName: 'Potato',
    hindiName: 'आलू (Kufri Jyoti / Chip-Grade)',
    variety: 'Kufri Jyoti 45mm+',
    category: 'Vegetables',
    defaultUnit: 'kg',
    originRegion: 'Agra & Farrukhabad Belt, UP',
    destinationMarket: 'Delhi-NCR & Kanpur Urban Belt',
    sampleImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    farmerReceivedPricePerKg: 13.0,
    traditionalStages: [
      {
        id: 'st-pot-1',
        actorType: 'farmer',
        actorName: 'Potato Cultivator',
        roleTitle: 'Farmer',
        locationContext: 'Fatehabad, Agra',
        iconName: 'Tractor',
        baseStagePricePerKg: 13.0,
        amountAddedPerKg: 13.0,
        cumulativePricePerKg: 13.0,
        operationalCostPerKg: 9.5,
        intermediaryMarginPerKg: 3.5,
        percentageOfFinalPrice: 38.2,
        wastagePercentage: 3.0,
        timeDelayDays: 0,
        costItems: [
          { id: 'p1', name: 'Seed Tubers & Fertilizer', amountPerKg: 6.0, category: 'operational_cost', description: 'Certified seed potatoes and basal fertilizer' },
          { id: 'p2', name: 'Tractor Digging & Field Labor', amountPerKg: 3.5, category: 'operational_cost', description: 'Mechanical harvest and manual pickers' },
          { id: 'p3', name: 'Farmer Net Profit', amountPerKg: 3.5, category: 'intermediary_margin', description: 'Take-home per kg' },
        ],
        operationalNotes: 'Highly capital intensive seed tuber investment.',
        keyProblems: ['Glut at harvest leads to distress sale below cost of production'],
      },
      {
        id: 'st-pot-2',
        actorType: 'local_trader',
        actorName: 'Cold Storage Owner & Mandi Trader',
        roleTitle: 'Storage Operator & Trader',
        locationContext: 'Agra Cold Storage Belt',
        iconName: 'Building2',
        baseStagePricePerKg: 13.0,
        amountAddedPerKg: 7.0,
        cumulativePricePerKg: 20.0,
        operationalCostPerKg: 3.5,
        intermediaryMarginPerKg: 3.5,
        percentageOfFinalPrice: 20.6,
        wastagePercentage: 4.0,
        timeDelayDays: 30,
        costItems: [
          { id: 'p-c1', name: 'Cold Store Power & Rent (3-4 Months)', amountPerKg: 2.2, category: 'operational_cost', description: 'Electricity and warehouse holding rent' },
          { id: 'p-c2', name: 'Jute Bagging & Handling', amountPerKg: 1.3, category: 'operational_cost', description: 'Gunny bags and loading' },
          { id: 'p-c3', name: 'Storage Trader Margin', amountPerKg: 3.5, category: 'intermediary_margin', description: 'Capital holding spread' },
        ],
        operationalNotes: 'Farmers often pledge potato bags at high interest.',
        keyProblems: ['High storage pledge interest traps growers'],
      },
      {
        id: 'st-pot-3',
        actorType: 'wholesaler',
        actorName: 'Secondary Wholesaler',
        roleTitle: 'Wholesaler',
        locationContext: 'Delhi Azadpur Yard',
        iconName: 'Truck',
        baseStagePricePerKg: 20.0,
        amountAddedPerKg: 5.5,
        cumulativePricePerKg: 25.5,
        operationalCostPerKg: 2.5,
        intermediaryMarginPerKg: 3.0,
        percentageOfFinalPrice: 16.2,
        wastagePercentage: 3.5,
        timeDelayDays: 2,
        costItems: [
          { id: 'p-w1', name: 'Highway Truck Freight & Tolls', amountPerKg: 1.7, category: 'operational_cost', description: 'Transit from storage belt to consumer mandi' },
          { id: 'p-w2', name: 'Yard Palledari & Cess', amountPerKg: 0.8, category: 'operational_cost', description: 'Unloading fee' },
          { id: 'p-w3', name: 'Wholesale Broker Margin', amountPerKg: 3.0, category: 'intermediary_margin', description: 'Brokerage fee' },
        ],
        operationalNotes: 'Secondary auctioning to semi-wholesalers.',
        keyProblems: ['Double loading causes bruised skin'],
      },
      {
        id: 'st-pot-4',
        actorType: 'retailer',
        actorName: 'Local Kirana / Cart Vendor',
        roleTitle: 'Retailer',
        locationContext: 'Residential Local Market',
        iconName: 'Store',
        baseStagePricePerKg: 25.5,
        amountAddedPerKg: 8.5,
        cumulativePricePerKg: 34.0,
        operationalCostPerKg: 3.0,
        intermediaryMarginPerKg: 5.5,
        percentageOfFinalPrice: 25.0,
        wastagePercentage: 5.0,
        timeDelayDays: 1,
        costItems: [
          { id: 'p-r1', name: 'Last-Mile Transport & Spoilage Cushion', amountPerKg: 3.0, category: 'operational_cost', description: 'Sorting cut/green potatoes' },
          { id: 'p-r2', name: 'Retailer Net Spread', amountPerKg: 5.5, category: 'intermediary_margin', description: 'Retail trade margin' },
        ],
        operationalNotes: 'Sells in 2kg to 5kg consumer lots.',
        keyProblems: ['Consumers pay ₹34/kg while farmer earned only ₹13/kg'],
      },
    ],
    directModel: {
      farmerFarmgatePrice: 20.0, // Farmer gets ₹20.0 instead of ₹13.0 (+53.8%)
      platformFacilitationFee: 0.50,
      coldChainLogisticsFee: 4.50,
      finalDirectBuyerPrice: 25.0, // Consumer pays ₹25.0 instead of ₹34.0 (-26.5%)
      farmerGainPerKg: 7.0,
      farmerGainPercentage: 53.8,
      buyerSavingsPerKg: 9.0,
      buyerSavingsPercentage: 26.5,
      traditionalFinalRetailPrice: 34.0,
      spoilageTraditionalPct: 14.5,
      spoilageDirectPct: 1.2,
      intermediariesEliminatedCount: 3,
      paymentSettlementTime: 'Instant Escrow UPI (2 Hours)',
    },
    keyInsights: {
      summary: 'Potato growers in UP often face severe harvest crashes down to ₹6-10/kg. KisanMandi connects farm cold-stores directly to modern retail & processors at ₹20/kg with instant settlement.',
      farmerShareTraditionalPct: 38.2,
      operationalCostsPct: 32.4,
      intermediaryMarginsPct: 29.4,
      wastageImpactNote: 'Direct chip-grade sorting and temperature-controlled dispatch prevents greening and sprout defects.',
    },
  },
  {
    commodityId: 'garlic',
    commodityName: 'Garlic',
    hindiName: 'लहसुन (Mandsaur / Ooty Clove)',
    variety: 'G-2 Bold Clove',
    category: 'Vegetables',
    defaultUnit: 'kg',
    originRegion: 'Mandsaur & Neemuch Belt, MP',
    destinationMarket: 'Pan-India Urban Consumptive Metros',
    sampleImage: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=600&q=80',
    farmerReceivedPricePerKg: 95.0,
    traditionalStages: [
      {
        id: 'st-g-1',
        actorType: 'farmer',
        actorName: 'Garlic Farmer',
        roleTitle: 'Farmer',
        locationContext: 'Mandsaur, MP',
        iconName: 'Tractor',
        baseStagePricePerKg: 95.0,
        amountAddedPerKg: 95.0,
        cumulativePricePerKg: 95.0,
        operationalCostPerKg: 65.0,
        intermediaryMarginPerKg: 30.0,
        percentageOfFinalPrice: 43.2,
        wastagePercentage: 4.0,
        timeDelayDays: 0,
        costItems: [
          { id: 'g1', name: 'High-Value Seed Cloves & Curing', amountPerKg: 42.0, category: 'operational_cost', description: 'Certified seed cloves and specialized shade drying' },
          { id: 'g2', name: 'Labor & Manual Cleaning', amountPerKg: 23.0, category: 'operational_cost', description: 'Manual root trimming and grading' },
          { id: 'g3', name: 'Farmer Net Take-Home', amountPerKg: 30.0, category: 'intermediary_margin', description: 'Grower margin' },
        ],
        operationalNotes: 'High capital crop requiring strict humidity management.',
        keyProblems: ['Price volatility is extreme in speculative mandis'],
      },
      {
        id: 'st-g-2',
        actorType: 'local_trader',
        actorName: 'Mandi Commission Agent',
        roleTitle: 'Commission Agent',
        locationContext: 'Mandsaur Mandi Yard',
        iconName: 'Building2',
        baseStagePricePerKg: 95.0,
        amountAddedPerKg: 25.0,
        cumulativePricePerKg: 120.0,
        operationalCostPerKg: 8.0,
        intermediaryMarginPerKg: 17.0,
        percentageOfFinalPrice: 11.4,
        wastagePercentage: 3.0,
        timeDelayDays: 2,
        costItems: [
          { id: 'g-m1', name: 'Mandi Tax & Sorting Labor', amountPerKg: 8.0, category: 'operational_cost', description: 'Yard cess and mesh packaging' },
          { id: 'g-m2', name: 'Commission Cut (8-10%)', amountPerKg: 17.0, category: 'intermediary_margin', description: 'High-value commodity commission' },
        ],
        operationalNotes: 'Agents charge high percentage on high-ticket commodities.',
        keyProblems: ['Huge commission cuts on high-value cash crops'],
      },
      {
        id: 'st-g-3',
        actorType: 'wholesaler',
        actorName: 'Interstate Spice Wholesaler',
        roleTitle: 'Metro Stockist',
        locationContext: 'Delhi / Mumbai Spice Yard',
        iconName: 'Truck',
        baseStagePricePerKg: 120.0,
        amountAddedPerKg: 45.0,
        cumulativePricePerKg: 165.0,
        operationalCostPerKg: 15.0,
        intermediaryMarginPerKg: 30.0,
        percentageOfFinalPrice: 20.4,
        wastagePercentage: 5.0,
        timeDelayDays: 4,
        costItems: [
          { id: 'g-w1', name: 'Ventilated Freight & Desiccation Loss', amountPerKg: 15.0, category: 'operational_cost', description: 'Transport and clove weight shrinkage' },
          { id: 'g-w2', name: 'Wholesale Speculation Spread', amountPerKg: 30.0, category: 'intermediary_margin', description: 'Wholesale trading profit' },
        ],
        operationalNotes: 'Stockists hoard garlic during off-seasons.',
        keyProblems: ['Speculative price gouging in off-peak months'],
      },
      {
        id: 'st-g-4',
        actorType: 'retailer',
        actorName: 'Urban Supermarket & Kirana',
        roleTitle: 'Retailer',
        locationContext: 'Retail Shelf',
        iconName: 'Store',
        baseStagePricePerKg: 165.0,
        amountAddedPerKg: 55.0,
        cumulativePricePerKg: 220.0,
        operationalCostPerKg: 18.0,
        intermediaryMarginPerKg: 37.0,
        percentageOfFinalPrice: 25.0,
        wastagePercentage: 6.0,
        timeDelayDays: 3,
        costItems: [
          { id: 'g-r1', name: 'Retail Packaging & Clove Loose Loss', amountPerKg: 18.0, category: 'operational_cost', description: 'Small 250g mesh pouch packing and dry flakes' },
          { id: 'g-r2', name: 'Retailer Margin', amountPerKg: 37.0, category: 'intermediary_margin', description: 'High margin on grocery staples' },
        ],
        operationalNotes: 'Retail price surges to ₹220/kg while farmer gets ₹95.',
        keyProblems: ['Retail consumers pay more than 2.3x the farmgate price'],
      },
    ],
    directModel: {
      farmerFarmgatePrice: 135.0, // Farmer gets ₹135 instead of ₹95 (+42.1%)
      platformFacilitationFee: 3.20,
      coldChainLogisticsFee: 16.80,
      finalDirectBuyerPrice: 155.0, // Consumer pays ₹155 instead of ₹220 (-29.5%)
      farmerGainPerKg: 40.0,
      farmerGainPercentage: 42.1,
      buyerSavingsPerKg: 65.0,
      buyerSavingsPercentage: 29.5,
      traditionalFinalRetailPrice: 220.0,
      spoilageTraditionalPct: 16.0,
      spoilageDirectPct: 1.0,
      intermediariesEliminatedCount: 3,
      paymentSettlementTime: 'Instant Escrow UPI (2 Hours)',
    },
    keyInsights: {
      summary: 'High-value spices like garlic have the largest absolute middleman spreads (up to ₹125/kg). Direct selling yields ₹40,000 extra per Metric Tonne for growers while saving buyers ₹65,000.',
      farmerShareTraditionalPct: 43.2,
      operationalCostsPct: 29.5,
      intermediaryMarginsPct: 27.3,
      wastageImpactNote: 'Moisture-controlled ventilated transit prevents hollow-clove drying and fungal mold.',
    },
  },
  {
    commodityId: 'apple',
    commodityName: 'Apple',
    hindiName: 'सेब (Shimla Royal Delicious)',
    variety: 'Royal Delicious Extra-Fancy',
    category: 'Fruits',
    defaultUnit: 'kg',
    originRegion: 'Kotgarh & Rohru, Himachal Pradesh',
    destinationMarket: 'Delhi-NCR & Western Metros',
    sampleImage: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    farmerReceivedPricePerKg: 65.0,
    traditionalStages: [
      {
        id: 'st-ap-1',
        actorType: 'farmer',
        actorName: 'Apple Orchardist',
        roleTitle: 'Farmer / Grower',
        locationContext: 'Kotgarh Orchards, HP',
        iconName: 'Tractor',
        baseStagePricePerKg: 65.0,
        amountAddedPerKg: 65.0,
        cumulativePricePerKg: 65.0,
        operationalCostPerKg: 42.0,
        intermediaryMarginPerKg: 23.0,
        percentageOfFinalPrice: 36.1,
        wastagePercentage: 4.0,
        timeDelayDays: 0,
        costItems: [
          { id: 'ap1', name: 'Orchard Maintenance, Spraying & Pruning', amountPerKg: 25.0, category: 'operational_cost', description: 'Year-round orchard management and hail net protection' },
          { id: 'ap2', name: 'Manual Ladder Plucking & Corrugated Tray Boxes', amountPerKg: 17.0, category: 'operational_cost', description: 'High-altitude manual picking and telescope cartons' },
          { id: 'ap3', name: 'Orchardist Take-Home Profit', amountPerKg: 23.0, category: 'intermediary_margin', description: 'Net return on year-long orchard investment' },
        ],
        operationalNotes: 'One harvest per year; vulnerable to unseasonal hailstorms.',
        keyProblems: ['Carton costs are high and traders slash prices for minor color variation'],
      },
      {
        id: 'st-ap-2',
        actorType: 'local_trader',
        actorName: 'Valley Aggregator & Transporter',
        roleTitle: 'Valley Trader',
        locationContext: 'Parwanoo / Shimla Mandi',
        iconName: 'Truck',
        baseStagePricePerKg: 65.0,
        amountAddedPerKg: 28.0,
        cumulativePricePerKg: 93.0,
        operationalCostPerKg: 14.0,
        intermediaryMarginPerKg: 14.0,
        percentageOfFinalPrice: 15.6,
        wastagePercentage: 6.0,
        timeDelayDays: 2,
        costItems: [
          { id: 'ap-t1', name: 'Mountain Road Freight to Foothills', amountPerKg: 8.0, category: 'operational_cost', description: 'Dangerous mountain road transit in small trucks' },
          { id: 'ap-t2', name: 'Parwanoo Toll & APMC Fee', amountPerKg: 6.0, category: 'operational_cost', description: 'Mandi tax and barrier checks' },
          { id: 'ap-t3', name: 'Valley Commission Agent Spread', amountPerKg: 14.0, category: 'intermediary_margin', description: 'Trader margin' },
        ],
        operationalNotes: 'Transfers boxes from hill trucks to multi-axle plains trucks.',
        keyProblems: ['Transit jolts cause internal flesh bruising in wooden crates'],
      },
      {
        id: 'st-ap-3',
        actorType: 'wholesaler',
        actorName: 'Terminal Fruit Commission Agent & CA Cold Store',
        roleTitle: 'CA Cold Store Wholesaler',
        locationContext: 'Azadpur Terminal Yard, Delhi',
        iconName: 'Building2',
        baseStagePricePerKg: 93.0,
        amountAddedPerKg: 42.0,
        cumulativePricePerKg: 135.0,
        operationalCostPerKg: 22.0,
        intermediaryMarginPerKg: 20.0,
        percentageOfFinalPrice: 23.3,
        wastagePercentage: 7.0,
        timeDelayDays: 14,
        costItems: [
          { id: 'ap-w1', name: 'CA (Controlled Atmosphere) Storage & Pre-cooling', amountPerKg: 14.0, category: 'operational_cost', description: 'Nitrogen controlled cold storage up to 3 months' },
          { id: 'ap-w2', name: 'Bruised Fruit Sorting Spoilage', amountPerKg: 8.0, category: 'operational_cost', description: 'Discarded bruised apples' },
          { id: 'ap-w3', name: 'Terminal Commission Cut & Profit', amountPerKg: 20.0, category: 'intermediary_margin', description: 'Terminal auction spread' },
        ],
        operationalNotes: 'Controlled Atmosphere storage enables artificial off-season price spikes.',
        keyProblems: ['Growers rarely benefit from off-season CA price doubling'],
      },
      {
        id: 'st-ap-4',
        actorType: 'retailer',
        actorName: 'Metro Premium Fruit Boutique / Supermarket',
        roleTitle: 'Retailer',
        locationContext: 'Urban Gourmet Store / Fruit Stall',
        iconName: 'Store',
        baseStagePricePerKg: 135.0,
        amountAddedPerKg: 45.0,
        cumulativePricePerKg: 180.0,
        operationalCostPerKg: 15.0,
        intermediaryMarginPerKg: 30.0,
        percentageOfFinalPrice: 25.0,
        wastagePercentage: 8.0,
        timeDelayDays: 3,
        costItems: [
          { id: 'ap-r1', name: 'Individual Foam Net Wrapping & Display Retail Air-Conditioning', amountPerKg: 15.0, category: 'operational_cost', description: 'Foam nets, premium packaging, store AC' },
          { id: 'ap-r2', name: 'Retail Margin', amountPerKg: 30.0, category: 'intermediary_margin', description: 'Retail markup on premium fruits' },
        ],
        operationalNotes: 'Sells at ₹180-200/kg in city stores.',
        keyProblems: ['Consumers pay ₹180/kg while mountain farmer earned only ₹65/kg'],
      },
    ],
    directModel: {
      farmerFarmgatePrice: 105.0, // Farmer gets ₹105 instead of ₹65 (+61.5%)
      platformFacilitationFee: 2.80,
      coldChainLogisticsFee: 22.20, // Mountain reefer + foam net packaging
      finalDirectBuyerPrice: 130.0, // Consumer pays ₹130 instead of ₹180 (-27.8%)
      farmerGainPerKg: 40.0,
      farmerGainPercentage: 61.5,
      buyerSavingsPerKg: 50.0,
      buyerSavingsPercentage: 27.8,
      traditionalFinalRetailPrice: 180.0,
      spoilageTraditionalPct: 23.0,
      spoilageDirectPct: 2.0,
      intermediariesEliminatedCount: 3,
      paymentSettlementTime: 'Instant Bank IMPS (24 Hours)',
    },
    keyInsights: {
      summary: 'Mountain apple growers lose over 63% of consumer spend to plains traders and CA store owners. KisanMandi direct reefer dispatch boosts grower earnings from ₹65 to ₹105/kg.',
      farmerShareTraditionalPct: 36.1,
      operationalCostsPct: 35.5,
      intermediaryMarginsPct: 28.4,
      wastageImpactNote: 'Direct foam net packaging at orchard packhouse prevents transit friction damage.',
    },
  },
  {
    commodityId: 'rice',
    commodityName: 'Basmati Rice',
    hindiName: 'बासमती चावल (Pusa 1121)',
    variety: 'Pusa 1121 Aged Steam',
    category: 'Grains & Pulses',
    defaultUnit: 'kg',
    originRegion: 'Karnal & Taraori Belt, Haryana',
    destinationMarket: 'National & Export Consumer Channels',
    sampleImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    farmerReceivedPricePerKg: 46.0,
    traditionalStages: [
      {
        id: 'st-rc-1',
        actorType: 'farmer',
        actorName: 'Paddy Grower',
        roleTitle: 'Farmer',
        locationContext: 'Taraori, Haryana',
        iconName: 'Tractor',
        baseStagePricePerKg: 46.0,
        amountAddedPerKg: 46.0,
        cumulativePricePerKg: 46.0,
        operationalCostPerKg: 33.0,
        intermediaryMarginPerKg: 13.0,
        percentageOfFinalPrice: 41.8,
        wastagePercentage: 2.0,
        timeDelayDays: 0,
        costItems: [
          { id: 'rc1', name: 'Seeds, Drip Irrigation & Combine Harvest', amountPerKg: 22.0, category: 'operational_cost', description: 'Certified Pusa 1121 seeds and mechanical harvesting' },
          { id: 'rc2', name: 'Field Drying & Jute Bagging', amountPerKg: 11.0, category: 'operational_cost', description: 'Moisture reduction to 14%' },
          { id: 'rc3', name: 'Farmer Take-Home Realization', amountPerKg: 13.0, category: 'intermediary_margin', description: 'Net return on 120-day paddy cycle' },
        ],
        operationalNotes: 'Paddy moisture penalties are often arbitrarily imposed in mandis.',
        keyProblems: ['Moisture cuts (kata) up to 4-6% deducted unfairly'],
      },
      {
        id: 'st-rc-2',
        actorType: 'local_trader',
        actorName: 'Mandi Commission Agent & Rice Miller',
        roleTitle: 'Miller & Agent',
        locationContext: 'Karnal Grain Mandi & Mill',
        iconName: 'Building2',
        baseStagePricePerKg: 46.0,
        amountAddedPerKg: 24.0,
        cumulativePricePerKg: 70.0,
        operationalCostPerKg: 14.0,
        intermediaryMarginPerKg: 10.0,
        percentageOfFinalPrice: 21.8,
        wastagePercentage: 3.0,
        timeDelayDays: 10,
        costItems: [
          { id: 'rc-m1', name: 'Paddy Milling, De-husking & Polishing Loss', amountPerKg: 10.0, category: 'operational_cost', description: '65% milling recovery ratio conversion cost' },
          { id: 'rc-m2', name: 'Mandi Cess, RDF & Handling', amountPerKg: 4.0, category: 'operational_cost', description: 'State rural development fund & market fees' },
          { id: 'rc-m3', name: 'Miller & Broker Net Spread', amountPerKg: 10.0, category: 'intermediary_margin', description: 'Milling transformation profit' },
        ],
        operationalNotes: 'Converts rough raw paddy to 8.35mm polished Basmati rice.',
        keyProblems: ['Farmer does not get share of husk and bran by-product value'],
      },
      {
        id: 'st-rc-3',
        actorType: 'wholesaler',
        actorName: 'Aged Rice Stockist & Brand Distributor',
        roleTitle: 'Distributor',
        locationContext: 'Central Logistics Hub',
        iconName: 'Truck',
        baseStagePricePerKg: 70.0,
        amountAddedPerKg: 20.0,
        cumulativePricePerKg: 90.0,
        operationalCostPerKg: 8.0,
        intermediaryMarginPerKg: 12.0,
        percentageOfFinalPrice: 18.2,
        wastagePercentage: 1.5,
        timeDelayDays: 60,
        costItems: [
          { id: 'rc-w1', name: 'Silo Aging (12-18 Months) & Freight', amountPerKg: 6.0, category: 'operational_cost', description: 'Controlled humidity silos for non-sticky aroma development' },
          { id: 'rc-w2', name: 'Primary 5kg/10kg Food-Grade Polybag Packaging', amountPerKg: 2.0, category: 'operational_cost', description: 'Sealed moisture-proof bags' },
          { id: 'rc-w3', name: 'Brand Distributor Margin', amountPerKg: 12.0, category: 'intermediary_margin', description: 'Wholesale distribution margin' },
        ],
        operationalNotes: 'Ages rice for aroma development.',
        keyProblems: ['Huge distributor markups on branded packages'],
      },
      {
        id: 'st-rc-4',
        actorType: 'retailer',
        actorName: 'Supermarket & Kirana Retail Chain',
        roleTitle: 'Retailer',
        locationContext: 'Retail Shelf',
        iconName: 'Store',
        baseStagePricePerKg: 90.0,
        amountAddedPerKg: 20.0,
        cumulativePricePerKg: 110.0,
        operationalCostPerKg: 5.0,
        intermediaryMarginPerKg: 15.0,
        percentageOfFinalPrice: 18.2,
        wastagePercentage: 1.0,
        timeDelayDays: 15,
        costItems: [
          { id: 'rc-r1', name: 'Store Handling, Shelf Space & Overhead', amountPerKg: 5.0, category: 'operational_cost', description: 'Modern retail shelf slotting and logistics' },
          { id: 'rc-r2', name: 'Retailer Trade Profit', amountPerKg: 15.0, category: 'intermediary_margin', description: 'Retail trade markup' },
        ],
        operationalNotes: 'Sells in 1kg/5kg consumer branded pouches.',
        keyProblems: ['Retail price reaches ₹110-120/kg while farmer earned only ₹46/kg on paddy equivalent'],
      },
    ],
    directModel: {
      farmerFarmgatePrice: 65.0, // Farmer gets ₹65 instead of ₹46 (+41.3%)
      platformFacilitationFee: 1.80,
      coldChainLogisticsFee: 13.20, // Certified contract milling + hermetic packaging
      finalDirectBuyerPrice: 80.0, // Consumer pays ₹80 instead of ₹110 (-27.3%)
      farmerGainPerKg: 19.0,
      farmerGainPercentage: 41.3,
      buyerSavingsPerKg: 30.0,
      buyerSavingsPercentage: 27.3,
      traditionalFinalRetailPrice: 110.0,
      spoilageTraditionalPct: 7.5,
      spoilageDirectPct: 0.5,
      intermediariesEliminatedCount: 3,
      paymentSettlementTime: 'Instant Escrow UPI (Same Day)',
    },
    keyInsights: {
      summary: 'For Basmati grains, contract custom milling with certified moisture assay returns ₹19/kg extra directly to farmer FPOs while delivering pure, unadulterated aged rice at ₹80/kg.',
      farmerShareTraditionalPct: 41.8,
      operationalCostsPct: 29.1,
      intermediaryMarginsPct: 29.1,
      wastageImpactNote: 'Digital moisture meters ensure zero arbitrary weight deductions for farmers.',
    },
  },
];

/**
 * Helper function to retrieve price chain for any commodity by ID or produce listing
 */
export function getPriceChainForCommodity(commodityIdOrName: string): CommodityPriceChain {
  const query = (commodityIdOrName || 'tomato').toLowerCase();
  
  const found = COMMODITY_PRICE_CHAINS.find(
    c => c.commodityId.toLowerCase() === query || 
         c.commodityName.toLowerCase().includes(query) ||
         query.includes(c.commodityId.toLowerCase()) ||
         query.includes(c.commodityName.toLowerCase())
  );

  return found || COMMODITY_PRICE_CHAINS[0];
}

/**
 * Calculates batch impact for a given quantity in Kilograms
 */
export function calculateBatchImpact(
  chain: CommodityPriceChain,
  quantityKg: number = 1000
): BatchCalculationResult {
  const safeQty = Math.max(1, quantityKg);
  
  const farmerRevenueTraditional = Math.round(chain.farmerReceivedPricePerKg * safeQty);
  const farmerRevenueDirect = Math.round(chain.directModel.farmerFarmgatePrice * safeQty);
  const farmerNetGainAmount = farmerRevenueDirect - farmerRevenueTraditional;
  const farmerGainPct = Number(chain.directModel.farmerGainPercentage.toFixed(1));

  const consumerSpendTraditional = Math.round(chain.directModel.traditionalFinalRetailPrice * safeQty);
  const consumerSpendDirect = Math.round(chain.directModel.finalDirectBuyerPrice * safeQty);
  const consumerNetSavingsAmount = consumerSpendTraditional - consumerSpendDirect;
  const consumerSavingsPct = Number(chain.directModel.buyerSavingsPercentage.toFixed(1));

  // Intermediary cuts bypassed
  const totalIntermediaryMarginPerKg = chain.traditionalStages.reduce(
    (acc, stage) => acc + (stage.actorType !== 'farmer' ? stage.intermediaryMarginPerKg : 0), 
    0
  );
  const totalIntermediaryCutsBypassed = Math.round(totalIntermediaryMarginPerKg * safeQty);

  // Wastage saved
  const traditionalWastageKg = safeQty * (chain.directModel.spoilageTraditionalPct / 100);
  const directWastageKg = safeQty * (chain.directModel.spoilageDirectPct / 100);
  const totalTransitWastageSavedKg = Math.round(traditionalWastageKg - directWastageKg);
  const totalWastageValueSaved = Math.round(totalTransitWastageSavedKg * chain.farmerReceivedPricePerKg);

  return {
    commodityName: chain.commodityName,
    quantityKg: safeQty,
    unit: chain.defaultUnit,
    farmerRevenueTraditional,
    farmerRevenueDirect,
    farmerNetGainAmount,
    farmerGainPct,
    consumerSpendTraditional,
    consumerSpendDirect,
    consumerNetSavingsAmount,
    consumerSavingsPct,
    totalIntermediaryCutsBypassed,
    totalTransitWastageSavedKg,
    totalWastageValueSaved,
  };
}

/**
 * Dynamically computes a custom price chain if the user overrides the farmgate price or retail price
 */
export function calculateCustomPriceChain(
  baseChain: CommodityPriceChain,
  customFarmgatePrice?: number,
  customRetailPrice?: number
): CommodityPriceChain {
  if (!customFarmgatePrice && !customRetailPrice) return baseChain;

  const farmgate = customFarmgatePrice || baseChain.farmerReceivedPricePerKg;
  const retail = customRetailPrice || baseChain.directModel.traditionalFinalRetailPrice;
  const spread = Math.max(1, retail - farmgate);

  // Re-scale traditional stages proportionally
  const updatedStages = baseChain.traditionalStages.map((stage, idx) => {
    if (idx === 0) {
      return {
        ...stage,
        baseStagePricePerKg: farmgate,
        amountAddedPerKg: farmgate,
        cumulativePricePerKg: farmgate,
        percentageOfFinalPrice: Number(((farmgate / retail) * 100).toFixed(1)),
      };
    }
    const weight = stage.amountAddedPerKg / (baseChain.directModel.traditionalFinalRetailPrice - baseChain.farmerReceivedPricePerKg);
    const newAdded = Number((spread * weight).toFixed(1));
    return {
      ...stage,
      amountAddedPerKg: newAdded,
      percentageOfFinalPrice: Number(((newAdded / retail) * 100).toFixed(1)),
    };
  });

  // Recompute cumulative prices
  let running = farmgate;
  for (let i = 1; i < updatedStages.length; i++) {
    running += updatedStages[i].amountAddedPerKg;
    updatedStages[i].cumulativePricePerKg = Number(running.toFixed(1));
  }

  // KisanMandi direct model calculation:
  // Farmer gets ~25% higher than traditional farmgate
  const directFarmerPrice = Number((farmgate * 1.35).toFixed(1));
  const platformFee = Number((directFarmerPrice * 0.02).toFixed(2));
  const logisticsFee = Number((spread * 0.25).toFixed(1));
  const finalDirectBuyer = Number((directFarmerPrice + platformFee + logisticsFee).toFixed(1));

  const farmerGainPerKg = Number((directFarmerPrice - farmgate).toFixed(1));
  const farmerGainPercentage = Number(((farmerGainPerKg / farmgate) * 100).toFixed(1));
  const buyerSavingsPerKg = Number((retail - finalDirectBuyer).toFixed(1));
  const buyerSavingsPercentage = Number(((buyerSavingsPerKg / retail) * 100).toFixed(1));

  return {
    ...baseChain,
    farmerReceivedPricePerKg: farmgate,
    traditionalStages: updatedStages,
    directModel: {
      ...baseChain.directModel,
      farmerFarmgatePrice: directFarmerPrice,
      platformFacilitationFee: platformFee,
      coldChainLogisticsFee: logisticsFee,
      finalDirectBuyerPrice: finalDirectBuyer,
      farmerGainPerKg,
      farmerGainPercentage,
      buyerSavingsPerKg,
      buyerSavingsPercentage,
      traditionalFinalRetailPrice: retail,
    },
  };
}

/**
 * Format Indian Currency with standard formatting (₹, Lakhs, Crores)
 */
export function formatIndianRupees(
  amount: number, 
  options?: { compact?: boolean; precision?: number }
): string {
  const precision = options?.precision ?? 0;
  
  if (options?.compact) {
    if (Math.abs(amount) >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (Math.abs(amount) >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    if (Math.abs(amount) >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}k`;
    }
  }

  // Standard Indian comma separator: e.g. 1,50,000
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const fixedStr = absAmount.toFixed(precision);
  const [integerPart, decimalPart] = fixedStr.split('.');

  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formattedInt = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  const result = decimalPart ? `${formattedInt}.${decimalPart}` : formattedInt;

  return `${isNegative ? '-' : ''}₹${result}`;
}
