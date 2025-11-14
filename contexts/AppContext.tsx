
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Store, Subscription, Product, Order, ShippingRequest, SubscriptionPlan, OrderStatus, ShippingStatus, Language } from '../types';
import { mockApi } from '../services/mockApi';

interface AppContextType {
  // State
  currentUser: User | null;
  currentStore: Store | null;
  userStores: Store[];
  users: User[];
  stores: Store[];
  products: Product[];
  orders: Order[];
  shippingRequests: ShippingRequest[];
  subscriptionPlans: SubscriptionPlan[];
  language: Language;

  // Actions
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  registerUser: (userData: Omit<User, 'userId' | 'registrationDate' | 'language'>) => Promise<User>;
  selectStore: (store: Store) => void;
  unselectStore: () => void;
  
  createStore: (storeData: Omit<Store, 'storeId' | 'createdAt' | 'status' | 'address' | 'locationGps' | 'profilePhoto' | 'whatsAppLink'>) => Promise<Store>;
  updateUser: (userId: string, updatedData: Partial<User>) => Promise<User | undefined>;
  setLanguage: (lang: Language) => void;
  addProduct: (product: Omit<Product, 'productId' | 'dateAdded'>) => Promise<void>;
  updateProduct: (productId: string, updatedData: Partial<Product>) => Promise<void>;
  placeOrder: (orderData: Omit<Order, 'orderId' | 'date' | 'orderStatus' | 'totalPrice'>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  createShippingRequest: (requestData: Omit<ShippingRequest, 'requestId' | 'date' | 'status' | 'deliveryPrice' | 'transportStoreId'>) => Promise<void>;
  updateShippingRequest: (requestId: string, status: ShippingStatus, transportStoreId?: string, price?: number) => Promise<void>;
  updateSubscription: (storeId: string, planId: 'FREE_30' | 'PLAN_6M' | 'PLAN_12M') => Promise<void>;
  updateStore: (storeId: string, updatedData: Partial<Store>) => Promise<Store | undefined>;
  deleteStore: (storeId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  refreshData: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [userStores, setUserStores] = useState<Store[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [shippingRequests, setShippingRequests] = useState<ShippingRequest[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [usersData, storesData, productsData, ordersData, shippingRequestsData, plansData] = await Promise.all([
      mockApi.getUsers(),
      mockApi.getStores(),
      mockApi.getProducts(),
      mockApi.getOrders(),
      mockApi.getShippingRequests(),
      mockApi.getSubscriptionPlans(),
    ]);
    setUsers(usersData);
    setStores(storesData);
    setProducts(productsData);
    setOrders(ordersData);
    setShippingRequests(shippingRequestsData);
    setSubscriptionPlans(plansData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchUserStores = async (userId: string) => {
      const stores = await mockApi.getStoresByUserId(userId);
      // Check subscription status for each store
      const storesWithStatus = await Promise.all(stores.map(async (store) => {
          const sub = await mockApi.getSubscriptionByStoreId(store.storeId);
          return { ...store, subscriptionStatus: sub?.status };
      }));
      setUserStores(storesWithStatus);
  };

  const login = async (email: string, password: string): Promise<User | null> => {
    const user = await mockApi.getUserByEmail(email);
    if (user && user.password === password) {
      setCurrentUser(user);
      setLanguage(user.language);
      await fetchUserStores(user.userId);
      return user;
    }
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentStore(null);
    setUserStores([]);
  };

  const selectStore = (store: Store) => {
      setCurrentStore(store);
  };
  
  const unselectStore = () => {
      setCurrentStore(null);
  }
  
  const refreshData = () => {
      fetchData();
      if(currentUser) fetchUserStores(currentUser.userId);
  };

  const registerUser = async (userData: Omit<User, 'userId' | 'registrationDate' | 'language'>) => {
      const newUser = await mockApi.registerUser(userData);
      refreshData();
      return newUser;
  }

  const createStore = async (storeData: Omit<Store, 'storeId' | 'createdAt' | 'status' | 'address' | 'locationGps' | 'profilePhoto' | 'whatsAppLink'>) => {
      const newStore = await mockApi.createStore(storeData);
      await fetchUserStores(storeData.userId);
      return newStore;
  }
  
  const updateUser = async (userId: string, updatedData: Partial<User>): Promise<User | undefined> => {
    const updatedUser = await mockApi.updateUser(userId, updatedData);
    if(updatedUser && currentUser?.userId === userId) {
        setCurrentUser(updatedUser);
    }
    refreshData();
    return updatedUser;
  };

  const updateStore = async (storeId: string, updatedData: Partial<Store>): Promise<Store | undefined> => {
      const updatedStore = await mockApi.updateStore(storeId, updatedData);
      if (updatedStore && currentStore?.storeId === storeId) {
          setCurrentStore({ ...currentStore, ...updatedStore });
      }
      refreshData();
      return updatedStore;
  };

  const deleteStore = async (storeId: string) => {
      await mockApi.deleteStore(storeId);
      if (currentStore?.storeId === storeId) {
          setCurrentStore(null);
      }
      refreshData();
  };

  const deleteUser = async (userId: string) => {
      await mockApi.deleteUser(userId);
      logout(); // Logout after deleting the account
  };

  const addProduct = async (product: Omit<Product, 'productId' | 'dateAdded'>) => {
    await mockApi.addProduct(product);
    refreshData();
  };

  const updateProduct = async (productId: string, updatedData: Partial<Product>) => {
    await mockApi.updateProduct(productId, updatedData);
    refreshData();
  };

  const placeOrder = async (orderData: Omit<Order, 'orderId' | 'date' | 'orderStatus' | 'totalPrice'>) => {
    await mockApi.createOrder(orderData);
    refreshData();
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await mockApi.updateOrderStatus(orderId, status);
    refreshData();
  };
  
  const createShippingRequest = async (requestData: Omit<ShippingRequest, 'requestId' | 'date' | 'status' | 'deliveryPrice' | 'transportStoreId'>) => {
    await mockApi.createShippingRequest(requestData);
    refreshData();
  };
  
  const updateShippingRequest = async (requestId: string, status: ShippingStatus, transportStoreId?: string, price?: number) => {
    await mockApi.updateShippingRequest(requestId, status, transportStoreId, price);
    refreshData();
  };

  const updateSubscription = async (storeId: string, planId: 'FREE_30' | 'PLAN_6M' | 'PLAN_12M') => {
      await mockApi.updateSubscription(storeId, planId);
      if(currentUser) {
          await fetchUserStores(currentUser.userId);
          const updatedStore = (await mockApi.getStoresByUserId(currentUser.userId)).find(s => s.storeId === storeId);
          if (updatedStore) {
              const sub = await mockApi.getSubscriptionByStoreId(updatedStore.storeId);
              setCurrentStore({ ...updatedStore, subscriptionStatus: sub?.status });
          }
      }
      refreshData();
  }

  const value = {
    currentUser,
    currentStore,
    userStores,
    users,
    stores,
    products,
    orders,
    shippingRequests,
    subscriptionPlans,
    language,
    login,
    logout,
    registerUser,
    selectStore,
    unselectStore,
    createStore,
    updateUser,
    setLanguage,
    addProduct,
    updateProduct,
    placeOrder,
    updateOrderStatus,
    createShippingRequest,
    updateShippingRequest,
    updateSubscription,
    updateStore,
    deleteStore,
    deleteUser,
    refreshData
  };

  return (
    <AppContext.Provider value={value}>
      {loading ? <div className="flex items-center justify-center h-screen bg-secondary">Loading...</div> : children}
    </AppContext.Provider>
  );
};