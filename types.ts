
export enum UserRole {
  FARMER = 'Farmer',
  WHOLESALER = 'Wholesaler',
  RETAILER = 'Retailer',
  TRANSPORT = 'Transport',
  ADMIN = 'Admin',
}

export enum StoreStatus {
    ACTIVE = 'active',
    SUSPENDED = 'suspended',
    EXPIRED = 'expired',
}

export enum SubscriptionStatus {
    ACTIVE = 'active',
    EXPIRED = 'expired',
    PENDING = 'pending_payment',
}

export enum OrderType {
  WHOLESALE = 'Wholesale',
  RETAIL = 'Retail',
}

export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed',
}

export enum ShippingStatus {
  WAITING = 'Waiting',
  ACCEPTED = 'Accepted',
  ON_WAY = 'On Way',
  DELIVERED = 'Delivered',
  REJECTED = 'Rejected',
}

export enum Language {
  EN = 'English',
  FR = 'French',
  AR = 'Arabic',
}

export interface SubscriptionPlan {
  planId: 'FREE_30' | 'PLAN_6M' | 'PLAN_12M';
  nameKey: string;
  price: number; // DZD
  durationDays: number;
  features: string[];
}

export interface User {
  userId: string;
  fullName: string;
  email: string;
  password?: string;
  phone: string;
  country: string;
  twoFactorEnabled: boolean;
  language: Language;
  registrationDate: string;
}

export interface Store {
    storeId: string;
    userId: string;
    storeName: string;
    storeType: UserRole;
    wilaya?: string;
    createdAt: string;
    status: StoreStatus;
    address: string;
    locationGps: { lat: number; lng: number };
    profilePhoto: string;
    whatsAppLink: string;
    themeColors?: {
        primary: string;
        secondary: string;
        accent: string;
    };
    // This will be added in context, not DB
    subscriptionStatus?: SubscriptionStatus; 
}

export interface Subscription {
    subscriptionId: string;
    storeId: string;
    planId: 'FREE_30' | 'PLAN_6M' | 'PLAN_12M';
    startDate: string;
    endDate: string;
    status: SubscriptionStatus;
}


export interface Product {
  productId: string;
  productName: string;
  category: string;
  wholesalePrice: number;
  retailPrice: number;
  minimumOrderQuantity: number;
  stockQuantity: number;
  photos: string[];
  description: string;
  storeId: string; // Changed from farmerId
  productLocation: string;
  dateAdded: string;
}

export interface Order {
  orderId: string;
  productId: string;
  buyerStoreId: string; // Changed from buyerId
  sellerStoreId: string; // Changed from sellerId
  orderType: OrderType;
  quantity: number;
  totalPrice: number;
  orderStatus: OrderStatus;
  notes: string;
  date: string;
}

export interface ShippingRequest {
  requestId: string;
  orderId: string;
  pickupAddress: string;
  deliveryAddress: string;
  deliveryPrice: number | null;
  transportStoreId: string | null; // Changed from transportCompanyId
  status: ShippingStatus;
  date: string;
}