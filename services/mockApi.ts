
import { User, Store, Subscription, Product, Order, ShippingRequest, SubscriptionPlan, UserRole, OrderType, OrderStatus, ShippingStatus, Language, StoreStatus, SubscriptionStatus, PaymentMethod } from '../types';

const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
const today = new Date();

let users: User[] = [
  {
    userId: 'user1',
    fullName: 'Karim Benali',
    email: 'karim.benali@example.com',
    password: 'password123',
    phone: '213512345678',
    country: 'Algeria',
    twoFactorEnabled: true,
    language: Language.EN,
    registrationDate: '2023-01-15',
  },
  {
    userId: 'user2',
    fullName: 'Fatima Zahra',
    email: 'fatima.zahra@example.com',
    password: 'password123',
    phone: '213623456789',
    country: 'Algeria',
    twoFactorEnabled: false,
    language: Language.FR,
    registrationDate: '2023-02-20',
  },
   {
    userId: 'adminuser',
    fullName: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    phone: '213700000000',
    country: 'Algeria',
    twoFactorEnabled: false,
    language: Language.EN,
    registrationDate: '2023-01-01',
  },
];

let stores: Store[] = [
    {
        storeId: 'store1',
        userId: 'user1',
        storeName: 'Green Valley Farms',
        storeType: UserRole.FARMER,
        country: 'Algeria',
        wilaya: '26 - Médéa',
        createdAt: '2023-01-15',
        status: StoreStatus.ACTIVE,
        address: 'Route Nationale 1, Médéa',
        locationGps: { lat: 36.2676, lng: 2.7539 },
        profilePhoto: 'https://picsum.photos/seed/farmer1/200',
        whatsAppLink: 'https://wa.me/213512345678',
        categories: ['Vegetables', 'Fruits'],
        themeColors: { primary: '#004e92', secondary: '#f4e9d2', accent: '#6da34d' },
    },
    {
        storeId: 'store2',
        userId: 'user2',
        storeName: 'AgriBulk Traders',
        storeType: UserRole.WHOLESALER,
        country: 'Algeria',
        wilaya: '16 - Alger',
        createdAt: '2023-02-20',
        status: StoreStatus.ACTIVE,
        address: '123 Rue Didouche Mourad, Algiers',
        locationGps: { lat: 36.7762, lng: 3.0588 },
        profilePhoto: 'https://picsum.photos/seed/wholesaler1/200',
        whatsAppLink: 'https://wa.me/213623456789',
        categories: ['Fruits', 'Imported Goods'],
        themeColors: { primary: '#004e92', secondary: '#f4e9d2', accent: '#6da34d' },
    },
    {
        storeId: 'store3',
        userId: 'user2',
        storeName: 'The Fresh Corner',
        storeType: UserRole.RETAILER,
        country: 'Algeria',
        wilaya: '31 - Oran',
        createdAt: '2023-03-10',
        status: StoreStatus.EXPIRED,
        address: '45 Boulevard de la Soummam, Oran',
        locationGps: { lat: 35.7051, lng: -0.6322 },
        profilePhoto: 'https://picsum.photos/seed/retailer1/200',
        whatsAppLink: 'https://wa.me/213634567890',
        categories: ['Fresh Produce', 'Dairy', 'Bakery'],
        themeColors: { primary: '#004e92', secondary: '#f4e9d2', accent: '#6da34d' },
    },
    {
        storeId: 'store4',
        userId: 'user1',
        storeName: 'Karim Express',
        storeType: UserRole.TRANSPORT,
        country: 'Algeria',
        wilaya: '42 - Tipaza',
        createdAt: '2023-04-05',
        status: StoreStatus.ACTIVE,
        address: 'Port de Tipaza',
        locationGps: { lat: 36.5931, lng: 2.4439 },
        profilePhoto: 'https://picsum.photos/seed/transport1/200',
        whatsAppLink: 'https://wa.me/213512345678',
        themeColors: { primary: '#004e92', secondary: '#f4e9d2', accent: '#6da34d' },
    },
     {
        storeId: 'adminstore',
        userId: 'adminuser',
        storeName: 'Souk El Fellah HQ',
        storeType: UserRole.ADMIN,
        country: 'Algeria',
        wilaya: '16 - Alger',
        createdAt: '2023-01-01',
        status: StoreStatus.ACTIVE,
        address: 'Algiers, Algeria',
        locationGps: { lat: 36.775, lng: 3.05 },
        profilePhoto: 'https://picsum.photos/seed/admin1/200',
        whatsAppLink: 'https://wa.me/213700000000',
        themeColors: { primary: '#004e92', secondary: '#f4e9d2', accent: '#6da34d' },
    },
]

let subscriptions: Subscription[] = [
    { subscriptionId: 'sub1', storeId: 'store1', planId: 'PLAN_6M', startDate: today.toISOString().split('T')[0], endDate: addDays(today, 180).toISOString().split('T')[0], status: SubscriptionStatus.ACTIVE },
    { subscriptionId: 'sub2', storeId: 'store2', planId: 'PLAN_12M', startDate: today.toISOString().split('T')[0], endDate: addDays(today, 365).toISOString().split('T')[0], status: SubscriptionStatus.ACTIVE },
    { subscriptionId: 'sub3', storeId: 'store3', planId: 'FREE_30', startDate: addDays(today, -35).toISOString().split('T')[0], endDate: addDays(today, -5).toISOString().split('T')[0], status: SubscriptionStatus.EXPIRED },
    { subscriptionId: 'sub4', storeId: 'store4', planId: 'PLAN_6M', startDate: today.toISOString().split('T')[0], endDate: addDays(today, 90).toISOString().split('T')[0], status: SubscriptionStatus.ACTIVE },
    { subscriptionId: 'subadmin', storeId: 'adminstore', planId: 'PLAN_12M', startDate: '2023-01-01', endDate: '9999-12-31', status: SubscriptionStatus.ACTIVE },
];


let products: Product[] = [
  {
    productId: 'prod1',
    productName: 'Organic Tomatoes',
    category: 'Vegetables',
    wholesalePrice: 120,
    retailPrice: 180,
    minimumOrderQuantity: 100, // kg
    stockQuantity: 5000,
    photos: ['https://picsum.photos/seed/tomato1/800/600', 'https://picsum.photos/seed/tomato2/800/600'],
    description: 'Fresh, juicy organic tomatoes grown in the fertile lands of Médéa. Perfect for salads, sauces, and cooking.',
    storeId: 'store1',
    productLocation: 'Médéa',
    dateAdded: '2023-10-01',
  },
  {
    productId: 'prod2',
    productName: 'Mitidja Oranges',
    category: 'Fruits',
    wholesalePrice: 80,
    retailPrice: 120,
    minimumOrderQuantity: 200, // kg
    stockQuantity: 10000,
    photos: ['https://picsum.photos/seed/orange1/800/600', 'https://picsum.photos/seed/orange2/800/600'],
    description: 'Sweet and flavorful oranges from the Mitidja plains. High in Vitamin C.',
    storeId: 'store1',
    productLocation: 'Blida',
    dateAdded: '2023-10-05',
  },
];

let orders: Order[] = [
    {
        orderId: 'order1',
        productId: 'prod1',
        buyerStoreId: 'store2',
        sellerStoreId: 'store1',
        orderType: OrderType.WHOLESALE,
        quantity: 250,
        totalPrice: 30000,
        orderStatus: OrderStatus.CONFIRMED,
        notes: 'Need delivery to Algiers.',
        date: '2023-10-10',
        customerFullName: 'Fatima Zahra',
        customerPhone: '213623456789',
        customerWilaya: '16 - Alger',
        customerAddress: '123 Rue Didouche Mourad, Algiers',
        paymentMethod: PaymentMethod.COD,
    }
];

let shippingRequests: ShippingRequest[] = [
    {
        requestId: 'req1',
        orderId: 'order1',
        pickupAddress: 'Route Nationale 1, Médéa',
        deliveryAddress: '123 Rue Didouche Mourad, Algiers',
        deliveryPrice: 8000,
        transportStoreId: 'store4',
        status: ShippingStatus.ACCEPTED,
        date: '2023-10-11'
    }
];

const subscriptionPlans: SubscriptionPlan[] = [
    {
        planId: 'FREE_30',
        nameKey: 'freePlan',
        price: 0,
        durationDays: 30,
        features: ['basicUsage'],
    },
    {
        planId: 'PLAN_6M',
        nameKey: 'sixMonthPlan',
        price: 6500,
        durationDays: 180,
        features: ['fullFeatures'],
    },
    {
        planId: 'PLAN_12M',
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
  registerUser: async (userData: Omit<User, 'userId' | 'registrationDate' | 'language'>): Promise<User> => {
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        throw new Error("User with this email already exists.");
    }
    const newUser: User = {
        ...userData,
        userId: `user${Date.now()}`,
        registrationDate: new Date().toISOString().split('T')[0],
        language: Language.EN,
    };
    users = [...users, newUser];
    return Promise.resolve(newUser);
  },
  updateUser: async (userId: string, updatedData: Partial<User>): Promise<User | undefined> => {
    let updatedUser: User | undefined;
    users = users.map(u => {
      if (u.userId === userId) {
        updatedUser = { ...u, ...updatedData };
        return updatedUser;
      }
      return u;
    });
    return Promise.resolve(updatedUser);
  },
  deleteUser: async (userId: string): Promise<boolean> => {
      const initialLength = users.length;
      const storesToDelete = stores.filter(s => s.userId === userId).map(s => s.storeId);
      
      for (const storeId of storesToDelete) {
          await mockApi.deleteStore(storeId);
      }
      
      users = users.filter(u => u.userId !== userId);
      return Promise.resolve(users.length < initialLength);
  },
  
  // STORE
  getStores: async (): Promise<Store[]> => Promise.resolve(stores),
  getStoresByUserId: async (userId: string): Promise<Store[]> => Promise.resolve(stores.filter(s => s.userId === userId)),
  createStore: async (storeData: Omit<Store, 'storeId' | 'createdAt' | 'status' | 'address' | 'locationGps' | 'profilePhoto' | 'whatsAppLink'>): Promise<Store> => {
      const user = await mockApi.getUserById(storeData.userId);
      if (!user) throw new Error("User not found");
      const newStore: Store = {
          ...storeData,
          storeId: `store${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
          status: StoreStatus.ACTIVE,
          address: 'Not specified',
          locationGps: { lat: 0, lng: 0 },
          profilePhoto: `https://picsum.photos/seed/store${Date.now()}/200`,
          whatsAppLink: `https://wa.me/${user.phone.replace(/\D/g, '')}`,
          categories: ['General'],
          themeColors: {
            primary: '#004e92',
            secondary: '#f4e9d2',
            accent: '#6da34d',
          },
      };
      stores = [...stores, newStore];
      
      const newSubscription: Subscription = {
          subscriptionId: `sub${Date.now()}`,
          storeId: newStore.storeId,
          planId: 'FREE_30',
          startDate: newStore.createdAt,
          endDate: addDays(new Date(newStore.createdAt), 30).toISOString().split('T')[0],
          status: SubscriptionStatus.ACTIVE,
      };
      subscriptions = [...subscriptions, newSubscription];
      return Promise.resolve(newStore);
  },
  updateStore: async (storeId: string, updatedData: Partial<Store>): Promise<Store | undefined> => {
    let updatedStore: Store | undefined;
    stores = stores.map(s => {
      if (s.storeId === storeId) {
        updatedStore = { ...s, ...updatedData };
        return updatedStore;
      }
      return s;
    });
    return Promise.resolve(updatedStore);
  },
  deleteStore: async (storeId: string): Promise<boolean> => {
    const initialLength = stores.length;
    stores = stores.filter(s => s.storeId !== storeId);
    subscriptions = subscriptions.filter(sub => sub.storeId !== storeId);
    products = products.filter(p => p.storeId !== storeId);
    orders = orders.filter(o => o.sellerStoreId !== storeId || o.buyerStoreId !== storeId);
    return Promise.resolve(stores.length < initialLength);
  },

  // PRODUCT
  getProducts: async (): Promise<Product[]> => Promise.resolve(products),
  getProductById: async (id: string): Promise<Product | undefined> => Promise.resolve(products.find(p => p.productId === id)),
  getProductsByStore: async (storeId: string): Promise<Product[]> => Promise.resolve(products.filter(p => p.storeId === storeId)),
  addProduct: async (product: Omit<Product, 'productId' | 'dateAdded'>): Promise<Product> => {
    const newProduct: Product = {
      ...product,
      productId: `prod${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    products = [...products, newProduct];
    return Promise.resolve(newProduct);
  },
   updateProduct: async (productId: string, updatedData: Partial<Product>): Promise<Product | undefined> => {
    let updatedProduct: Product | undefined;
    products = products.map(p => {
        if (p.productId === productId) {
            updatedProduct = { ...p, ...updatedData };
            return updatedProduct;
        }
        return p;
    });
    return Promise.resolve(updatedProduct);
  },

  // ORDER
  getOrders: async (): Promise<Order[]> => Promise.resolve(orders),
  getOrdersForBuyerStore: async (storeId: string): Promise<Order[]> => Promise.resolve(orders.filter(o => o.buyerStoreId === storeId)),
  getOrdersForSellerStore: async (storeId: string): Promise<Order[]> => Promise.resolve(orders.filter(o => o.sellerStoreId === storeId)),
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
    orders = [...orders, newOrder];
    return Promise.resolve(newOrder);
  },
  updateOrderStatus: async(orderId: string, status: OrderStatus): Promise<Order | undefined> => {
    let updatedOrder: Order | undefined;
    orders = orders.map(o => {
        if (o.orderId === orderId) {
            updatedOrder = { ...o, orderStatus: status };
            return updatedOrder;
        }
        return o;
    });
    return Promise.resolve(updatedOrder);
  },

  // SHIPPING
  getShippingRequests: async (): Promise<ShippingRequest[]> => Promise.resolve(shippingRequests),
  getShippingRequestByOrder: async (orderId: string): Promise<ShippingRequest | undefined> => Promise.resolve(shippingRequests.find(sr => sr.orderId === orderId)),
  getShippingRequestsForStore: async (storeId: string): Promise<ShippingRequest[]> => Promise.resolve(shippingRequests.filter(sr => sr.transportStoreId === storeId)),
  createShippingRequest: async (requestData: Omit<ShippingRequest, 'requestId' | 'date' | 'status' | 'deliveryPrice' | 'transportStoreId'>): Promise<ShippingRequest> => {
    const newRequest: ShippingRequest = {
      ...requestData,
      requestId: `req${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: ShippingStatus.WAITING,
      deliveryPrice: null,
      transportStoreId: null,
    };
    shippingRequests = [...shippingRequests, newRequest];
    return Promise.resolve(newRequest);
  },
  updateShippingRequest: async(requestId: string, status: ShippingStatus, transportStoreId?: string, price?: number): Promise<ShippingRequest | undefined> => {
    let updatedRequest: ShippingRequest | undefined;
    shippingRequests = shippingRequests.map(r => {
        if(r.requestId === requestId) {
            updatedRequest = { ...r, status };
            if (transportStoreId) updatedRequest.transportStoreId = transportStoreId;
            if (price) updatedRequest.deliveryPrice = price;
            return updatedRequest;
        }
        return r;
    });
    return Promise.resolve(updatedRequest);
  },

  // SUBSCRIPTION
  getSubscriptionPlans: async(): Promise<SubscriptionPlan[]> => Promise.resolve(subscriptionPlans),
  getSubscriptionByStoreId: async(storeId: string): Promise<Subscription | undefined> => Promise.resolve(subscriptions.find(s => s.storeId === storeId)),
  updateSubscription: async(storeId: string, planId: 'FREE_30' | 'PLAN_6M' | 'PLAN_12M'): Promise<Subscription | undefined> => {
      let updatedSub: Subscription | undefined;
      const plan = subscriptionPlans.find(p => p.planId === planId);
      if (!plan) return Promise.resolve(undefined);

      subscriptions = subscriptions.map(sub => {
          if (sub.storeId === storeId) {
              updatedSub = {
                  ...sub,
                  planId: plan.planId,
                  startDate: today.toISOString().split('T')[0],
                  endDate: addDays(today, plan.durationDays).toISOString().split('T')[0],
                  status: SubscriptionStatus.ACTIVE,
              };
              return updatedSub;
          }
          return sub;
      });

      if (updatedSub) {
          stores = stores.map(s => {
              if (s.storeId === storeId) {
                  return { ...s, status: StoreStatus.ACTIVE };
              }
              return s;
          });
      }
      return Promise.resolve(updatedSub);
  }
};