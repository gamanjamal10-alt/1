
import { User, Product, Order, ShippingRequest, SubscriptionPlan, UserRole, OrderType, OrderStatus, ShippingStatus, Language } from '../types';

const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
const today = new Date();

let users: User[] = [
  {
    userId: 'farmer1',
    fullName: 'Ahmed Hassan',
    email: 'ahmed.hassan@example.com',
    password: 'password123',
    country: 'Morocco',
    enable2FA: true,
    language: Language.EN,
    accountType: UserRole.FARMER,
    phoneNumber: '212612345678',
    whatsAppLink: 'https://wa.me/212612345678',
    businessName: 'Green Valley Farms',
    address: 'Route de Fes, Meknes',
    locationGps: { lat: 33.8935, lng: -5.5473 },
    profilePhoto: 'https://picsum.photos/seed/farmer1/200',
    registrationDate: '2023-01-15',
    subscriptionPlanId: 'plan2',
    subscriptionEndDate: addDays(today, 100).toISOString().split('T')[0],
  },
  {
    userId: 'wholesaler1',
    fullName: 'Fatima Zahra',
    email: 'fatima.zahra@example.com',
    password: 'password123',
    country: 'Morocco',
    enable2FA: false,
    language: Language.FR,
    accountType: UserRole.WHOLESALER,
    phoneNumber: '212623456789',
    whatsAppLink: 'https://wa.me/212623456789',
    businessName: 'AgriBulk Traders',
    address: 'Marjane Market, Casablanca',
    locationGps: { lat: 33.5731, lng: -7.5898 },
    profilePhoto: 'https://picsum.photos/seed/wholesaler1/200',
    registrationDate: '2023-02-20',
    subscriptionPlanId: 'plan3',
    subscriptionEndDate: addDays(today, 250).toISOString().split('T')[0],
  },
  {
    userId: 'retailer1',
    fullName: 'Youssef Alami',
    email: 'youssef.alami@example.com',
    password: 'password123',
    country: 'Algeria',
    enable2FA: false,
    language: Language.AR,
    accountType: UserRole.RETAILER,
    phoneNumber: '212634567890',
    whatsAppLink: 'https://wa.me/212634567890',
    businessName: 'The Fresh Corner',
    address: 'Rue de la Liberte, Rabat',
    locationGps: { lat: 34.0209, lng: -6.8417 },
    profilePhoto: 'https://picsum.photos/seed/retailer1/200',
    registrationDate: '2023-03-10',
    subscriptionPlanId: 'plan1',
    subscriptionEndDate: addDays(today, 15).toISOString().split('T')[0],
  },
  {
    userId: 'transport1',
    fullName: 'Karim Express',
    email: 'karim.express@example.com',
    password: 'password123',
    country: 'Morocco',
    enable2FA: true,
    language: Language.EN,
    accountType: UserRole.TRANSPORT,
    phoneNumber: '212645678901',
    whatsAppLink: 'https://wa.me/212645678901',
    businessName: 'Karim Express',
    address: 'Port de Tanger Med',
    locationGps: { lat: 35.884, lng: -5.526 },
    profilePhoto: 'https://picsum.photos/seed/transport1/200',
    registrationDate: '2023-04-05',
    subscriptionPlanId: 'plan2',
    subscriptionEndDate: addDays(today, 50).toISOString().split('T')[0],
  },
  {
    userId: 'admin1',
    fullName: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    country: 'Morocco',
    enable2FA: false,
    language: Language.EN,
    accountType: UserRole.ADMIN,
    phoneNumber: '212600000000',
    whatsAppLink: 'https://wa.me/212600000000',
    businessName: 'Souk El Fellah HQ',
    address: 'Casablanca, Morocco',
    locationGps: { lat: 33.5731, lng: -7.5898 },
    profilePhoto: 'https://picsum.photos/seed/admin1/200',
    registrationDate: '2023-01-01',
    subscriptionPlanId: 'plan3',
    subscriptionEndDate: '9999-12-31',
  },
];

let products: Product[] = [
  {
    productId: 'prod1',
    productName: 'Organic Tomatoes',
    category: 'Vegetables',
    wholesalePrice: 8,
    retailPrice: 12,
    minimumOrderQuantity: 100, // kg
    stockQuantity: 5000,
    photos: ['https://picsum.photos/seed/tomato1/800/600', 'https://picsum.photos/seed/tomato2/800/600'],
    description: 'Fresh, juicy organic tomatoes grown in the fertile lands of Meknes. Perfect for salads, sauces, and cooking.',
    farmerId: 'farmer1',
    productLocation: 'Meknes',
    dateAdded: '2023-10-01',
  },
  {
    productId: 'prod2',
    productName: 'Beldi Oranges',
    category: 'Fruits',
    wholesalePrice: 5,
    retailPrice: 8,
    minimumOrderQuantity: 200, // kg
    stockQuantity: 10000,
    photos: ['https://picsum.photos/seed/orange1/800/600', 'https://picsum.photos/seed/orange2/800/600'],
    description: 'Sweet and flavorful Beldi oranges from the Souss region. High in Vitamin C.',
    farmerId: 'farmer1',
    productLocation: 'Agadir',
    dateAdded: '2023-10-05',
  },
];

let orders: Order[] = [
    {
        orderId: 'order1',
        productId: 'prod1',
        buyerId: 'wholesaler1',
        sellerId: 'farmer1',
        orderType: OrderType.WHOLESALE,
        quantity: 250,
        totalPrice: 2000,
        orderStatus: OrderStatus.CONFIRMED,
        notes: 'Need delivery to Casablanca.',
        date: '2023-10-10'
    }
];

let shippingRequests: ShippingRequest[] = [
    {
        requestId: 'req1',
        orderId: 'order1',
        pickupAddress: 'Route de Fes, Meknes',
        deliveryAddress: 'Marjane Market, Casablanca',
        deliveryPrice: 500,
        transportCompanyId: 'transport1',
        status: ShippingStatus.ACCEPTED,
        date: '2023-10-11'
    }
];

const subscriptionPlans: SubscriptionPlan[] = [
    {
        planId: 'plan1',
        nameKey: 'freePlan',
        price: 0,
        durationDays: 30,
        features: ['basicUsage'],
    },
    {
        planId: 'plan2',
        nameKey: 'sixMonthPlan',
        price: 6500,
        durationDays: 180,
        features: ['fullFeatures'],
    },
    {
        planId: 'plan3',
        nameKey: 'twelveMonthPlan',
        price: 9500,
        durationDays: 365,
        features: ['fullFeatures', 'prioritySupport'],
    },
];

export const mockApi = {
  // USER
  getUsers: async (): Promise<User[]> => Promise.resolve(users),
  getUserById: async (id: string): Promise<User | undefined> => Promise.resolve(users.find(u => u.userId === id)),
  getUserByEmail: async (email: string): Promise<User | undefined> => Promise.resolve(users.find(u => u.email.toLowerCase() === email.toLowerCase())),
  registerUser: async (userData: Omit<User, 'userId' | 'registrationDate' | 'subscriptionPlanId' | 'subscriptionEndDate' | 'whatsAppLink' | 'locationGps' | 'profilePhoto' | 'address'>): Promise<User> => {
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        throw new Error("User with this email already exists.");
    }
    const newUser: User = {
        ...userData,
        userId: `user${Date.now()}`,
        registrationDate: new Date().toISOString().split('T')[0],
        subscriptionPlanId: 'plan1', // Free plan
        subscriptionEndDate: addDays(new Date(), 30).toISOString().split('T')[0],
        whatsAppLink: `https://wa.me/${userData.phoneNumber.replace(/\D/g, '')}`,
        locationGps: { lat: 0, lng: 0 }, // Default location
        profilePhoto: `https://picsum.photos/seed/user${Date.now()}/200`,
        address: 'Not specified',
    };
    users.push(newUser);
    return Promise.resolve(newUser);
  },
  updateUser: async (userId: string, updatedData: Partial<User>): Promise<User | undefined> => {
    const userIndex = users.findIndex(u => u.userId === userId);
    if (userIndex > -1) {
      users[userIndex] = { ...users[userIndex], ...updatedData };
      return Promise.resolve(users[userIndex]);
    }
    return Promise.resolve(undefined);
  },
  
  // PRODUCT
  getProducts: async (): Promise<Product[]> => Promise.resolve(products),
  getProductById: async (id: string): Promise<Product | undefined> => Promise.resolve(products.find(p => p.productId === id)),
  getProductsByFarmer: async (farmerId: string): Promise<Product[]> => Promise.resolve(products.filter(p => p.farmerId === farmerId)),
  addProduct: async (product: Omit<Product, 'productId' | 'dateAdded'>): Promise<Product> => {
    const newProduct: Product = {
      ...product,
      productId: `prod${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    products.push(newProduct);
    return Promise.resolve(newProduct);
  },
   updateProduct: async (productId: string, updatedData: Partial<Product>): Promise<Product | undefined> => {
    const productIndex = products.findIndex(p => p.productId === productId);
    if (productIndex > -1) {
      products[productIndex] = { ...products[productIndex], ...updatedData };
      return Promise.resolve(products[productIndex]);
    }
    return Promise.resolve(undefined);
  },
  updateProductStock: async (productId: string, newStock: number): Promise<Product | undefined> => {
    const product = products.find(p => p.productId === productId);
    if(product) {
      product.stockQuantity = newStock;
      return Promise.resolve(product);
    }
    return Promise.resolve(undefined);
  },

  // ORDER
  getOrders: async (): Promise<Order[]> => Promise.resolve(orders),
  getOrdersForBuyer: async (buyerId: string): Promise<Order[]> => Promise.resolve(orders.filter(o => o.buyerId === buyerId)),
  getOrdersForSeller: async (sellerId: string): Promise<Order[]> => Promise.resolve(orders.filter(o => o.sellerId === sellerId)),
  createOrder: async (orderData: Omit<Order, 'orderId' | 'date' | 'orderStatus' | 'totalPrice'>): Promise<Order> => {
    const product = await mockApi.getProductById(orderData.productId);
    if (!product) throw new Error("Product not found");
    const price = orderData.orderType === OrderType.WHOLESALE ? product.wholesalePrice : product.retailPrice;

    const newOrder: Order = {
        ...orderData,
        orderId: `order${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        orderStatus: OrderStatus.PENDING,
        totalPrice: price * orderData.quantity,
    };
    orders.push(newOrder);
    return Promise.resolve(newOrder);
  },
  updateOrderStatus: async(orderId: string, status: OrderStatus): Promise<Order | undefined> => {
    const order = orders.find(o => o.orderId === orderId);
    if(order) {
        order.orderStatus = status;
        return Promise.resolve(order);
    }
    return Promise.resolve(undefined);
  },

  // SHIPPING
  getShippingRequests: async (): Promise<ShippingRequest[]> => Promise.resolve(shippingRequests),
  getShippingRequestByOrder: async(orderId: string): Promise<ShippingRequest | undefined> => Promise.resolve(shippingRequests.find(sr => sr.orderId === orderId)),
  getShippingRequestsForTransporter: async (transportCompanyId: string): Promise<ShippingRequest[]> => Promise.resolve(shippingRequests.filter(sr => sr.transportCompanyId === transportCompanyId)),
  createShippingRequest: async (requestData: Omit<ShippingRequest, 'requestId' | 'date' | 'status' | 'deliveryPrice' | 'transportCompanyId'>): Promise<ShippingRequest> => {
    const newRequest: ShippingRequest = {
      ...requestData,
      requestId: `req${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: ShippingStatus.WAITING,
      deliveryPrice: null,
      transportCompanyId: null,
    };
    shippingRequests.push(newRequest);
    return Promise.resolve(newRequest);
  },
  updateShippingRequest: async(requestId: string, status: ShippingStatus, transportCompanyId?: string, price?: number): Promise<ShippingRequest | undefined> => {
    const request = shippingRequests.find(r => r.requestId === requestId);
    if(request) {
        request.status = status;
        if(transportCompanyId) request.transportCompanyId = transportCompanyId;
        if(price) request.deliveryPrice = price;
        return Promise.resolve(request);
    }
    return Promise.resolve(undefined);
  },

  // SUBSCRIPTION
  getSubscriptionPlans: async(): Promise<SubscriptionPlan[]> => Promise.resolve(subscriptionPlans),
  updateSubscription: async(userId: string, planId: string): Promise<User | undefined> => {
      const user = users.find(u => u.userId === userId);
      const plan = subscriptionPlans.find(p => p.planId === planId);
      if(user && plan) {
          user.subscriptionPlanId = plan.planId;
          user.subscriptionEndDate = addDays(new Date(), plan.durationDays).toISOString().split('T')[0];
          return Promise.resolve(user);
      }
      return Promise.resolve(undefined);
  }
};