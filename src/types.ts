export type UserRole = 'customer' | 'merchant';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  profileCompleted: boolean;
  storeName?: string;
  avatarUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Electronics' | 'Fashion' | 'Accessories' | 'Smart Home' | string;
  price: number;
  discountPrice?: number;
  stock: number;
  description: string;
  features: string[];
  rating: number;
  reviewsCount?: number;
  image: string;
  tags?: string[];
  frequentlyBoughtWith?: string[]; // IDs of complementary products
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedViaAI?: boolean;
  recommendationReason?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type PaymentStatus = 'Pending' | 'Processing' | 'Successful' | 'Failed';
export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Completed' | 'Cancelled';

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  taxes: number;
  shippingFee: number;
  finalAmount: number;
  shippingAddress: ShippingAddress;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentDetails: {
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    method: string;
    currency: string;
    isTestMode: boolean;
  };
  createdAt: string;
  estimatedDelivery: string;
  aiAssisted: boolean;
  aiUpsellCount: number;
}

export type AuditActionType =
  | 'CUSTOMER_SEARCH'
  | 'AI_RECOMMENDATION'
  | 'CART_ADD'
  | 'UPSELL_OFFERED'
  | 'UPSELL_SUGGESTION'
  | 'UPSELL_ACCEPTED'
  | 'UPSELL_REJECTED'
  | 'CROSS_SELL_VIEWED'
  | 'CHECKOUT_REVIEW'
  | 'PAYMENT_INITIATED'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED'
  | 'STATUS_CHANGE'
  | 'PRODUCT_CREATED'
  | 'PRODUCT_UPDATED'
  | 'PRODUCT_DELETED';

export type AuditLogAction = AuditActionType;

export interface AuditLog {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  actionType: AuditActionType;
  description: string;
  relatedProductId?: string;
  relatedProductName?: string;
  relatedOrderId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestedProducts?: Product[];
  upsellProduct?: {
    product: Product;
    reason: string;
  };
  filterApplied?: {
    category?: string;
    maxPrice?: number;
  };
}

export interface AIRecommendation {
  id: string;
  userId?: string;
  query?: string;
  context: 'conversational' | 'product_detail' | 'cart_upsell' | 'frequently_bought';
  recommendedProductIds: string[];
  accepted: boolean;
  acceptedProductId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface MerchantMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  aiConversations: number;
  aiRecommendedProducts: number;
  aiAssistedSales: number;
  upsellRevenue: number;
  crossSellRevenue: number;
  conversionRate: number;
  revenueHistory: { date: string; revenue: number; aiRevenue: number }[];
  ordersHistory: { date: string; orders: number; aiOrders: number }[];
  categoryPerformance: { category: string; sales: number; count: number }[];
}
