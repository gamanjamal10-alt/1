
export enum UserRole {
  FARMER = 'Farmer',
  WHOLESALER = 'Wholesaler',
  RETAILER = 'Retailer',
  TRANSPORT = 'Transport',
  ADMIN = 'Admin',
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
  planId: string;
  nameKey: string;
  price: number; // DZD
  durationDays: number;
  features: string[];
}

export interface User {
  userId: string;
  fullName: string;
  email: string;
  password?: string; // Mocked
  country: string;
  enable2FA: boolean;
  language: Language;
  accountType: UserRole;
  phoneNumber: string;
  whatsAppLink: string;
  businessName: string; // Store Name
  address: string;
  locationGps: { lat: number; lng: number };
  profilePhoto: string;
  registrationDate: string;
  subscriptionPlanId: string;
  subscriptionEndDate: string;
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
  farmerId: string;
  productLocation: string;
  dateAdded: string;
}

export interface Order {
  orderId: string;
  productId: string;
  buyerId: string;
  sellerId: string;
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
  transportCompanyId: string | null;
  status: ShippingStatus;
  date: string;
}