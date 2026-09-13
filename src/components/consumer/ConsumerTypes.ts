export interface ConsumerProduct {
  id: string;
  name: string;
  emoji: string;
  category: 'Vegetables' | 'Fruits';
  variety: string;
  kisanDirectPricePerKg: number;
  traditionalRetailPricePerKg: number;
  farmerSharePerKg: number;
  transportSharePerKg: number;
  platformSharePerKg: number;
  sourceNetwork: string;
  sourceLocation: string;
  distanceKm: number;
  harvestTimeAgo: string;
  freshnessScore: number;
  availableKg: number;
  unit: string;
  grade: 'Grade A+' | 'Grade A' | 'Organic Certified';
  imagePlaceholderColor: string;
  description: string;
  featured?: boolean;
}

export interface ConsumerCartItem {
  product: ConsumerProduct;
  quantityKg: number;
}

export interface ConsumerOrder {
  id: string;
  orderNumber: string;
  txHash: string;
  productName: string;
  emoji: string;
  quantityKg: number;
  pricePerKg: number;
  subtotal: number;
  transportFee: number;
  platformFee: number;
  totalAmount: number;
  farmerNetwork: string;
  orderTimestamp: string;
  expectedDelivery: string;
  statusStep: 'CONFIRMED' | 'FARMER_CONFIRMED' | 'BEING_PREPARED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  paymentMethod: string;
  paymentStatus: 'COMPLETED' | 'ESCROW_LOCKED';
  deliveryAddress: string;
}

export interface ConsumerTransactionRecord {
  txId: string;
  orderNumber: string;
  productTitle: string;
  emoji: string;
  quantityFormatted: string;
  farmerNetwork: string;
  productValue: number;
  transportationFee: number;
  platformFee: number;
  totalPaid: number;
  savingsVsRetail: number;
  paymentMethod: string;
  status: 'COMPLETED';
  timestamp: string;
  blockHash: string;
  securityCipher: string;
  auditVerified: boolean;
}
