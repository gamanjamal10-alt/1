
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Product, Order, ShippingRequest, SubscriptionPlan, UserRole, OrderStatus, ShippingStatus, Language } from '../types';
import { mockApi } from '../services/mockApi';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  products: Product[];
  orders: Order[];
  shippingRequests: ShippingRequest[];
  subscriptionPlans: SubscriptionPlan[];
  language: Language;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  registerUser: (userData: Omit<User, 'userId' | 'registrationDate' | 'subscriptionPlanId' | 'subscriptionEndDate' | 'whatsAppLink' | 'locationGps' | 'profilePhoto' | 'address'>) => Promise<User>;
  updateUser: (userId: string, data: Partial<User>) => Promise<void>;
  setLanguage: (lang: Language) => void;
  addProduct: (product: Omit<Product, 'productId' | 'dateAdded'>) => Promise<void>;
  updateProduct: (productId: string, updatedData: Partial<Product>) => Promise<void>;
  updateProductStock: (productId: string, newStock: number) => Promise<void>;
  placeOrder: (orderData: Omit<Order, 'orderId' | 'date' | 'orderStatus' | 'totalPrice'>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  createShippingRequest: (requestData: Omit<ShippingRequest, 'requestId' | 'date' | 'status' | 'deliveryPrice' | 'transportCompanyId'>) => Promise<void>;
  updateShippingRequest: (requestId: string, status: ShippingStatus, transportCompanyId?: string, price?: number) => Promise<void>;
  updateSubscription: (userId: string, planId: string) => Promise<void>;
  refreshData: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [shippingRequests, setShippingRequests] = useState<ShippingRequest[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [usersData, productsData, ordersData, shippingRequestsData, plansData] = await Promise.all([
      mockApi.getUsers(),
      mockApi.getProducts(),
      mockApi.getOrders(),
      mockApi.getShippingRequests(),
      mockApi.getSubscriptionPlans(),
    ]);
    setUsers(usersData);
    setProducts(productsData);
    setOrders(ordersData);
    setShippingRequests(shippingRequestsData);
    setSubscriptionPlans(plansData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const login = async (email: string, password: string): Promise<User | null> => {
    const user = await mockApi.getUserByEmail(email);
    if (user && user.password === password) {
      setCurrentUser(user);
      setLanguage(user.language);
      return user;
    }
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
  };
  
  const refreshData = () => {
      fetchData();
  };

  const registerUser = async (userData: Omit<User, 'userId' | 'registrationDate' | 'subscriptionPlanId' | 'subscriptionEndDate' | 'whatsAppLink' | 'locationGps' | 'profilePhoto' | 'address'>) => {
      const newUser = await mockApi.registerUser(userData);
      refreshData();
      return newUser;
  }
  
  const updateUser = async (userId: string, data: Partial<User>) => {
      await mockApi.updateUser(userId, data);
      if (currentUser?.userId === userId) {
          const updatedUser = await mockApi.getUserById(userId);
          if (updatedUser) setCurrentUser(updatedUser);
      }
      refreshData();
  }

  const addProduct = async (product: Omit<Product, 'productId' | 'dateAdded'>) => {
    await mockApi.addProduct(product);
    refreshData();
  };

  const updateProduct = async (productId: string, updatedData: Partial<Product>) => {
    await mockApi.updateProduct(productId, updatedData);
    refreshData();
  };

  const updateProductStock = async (productId: string, newStock: number) => {
    await mockApi.updateProductStock(productId, newStock);
    refreshData();
  }

  const placeOrder = async (orderData: Omit<Order, 'orderId' | 'date' | 'orderStatus' | 'totalPrice'>) => {
    await mockApi.createOrder(orderData);
    refreshData();
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await mockApi.updateOrderStatus(orderId, status);
    refreshData();
  };
  
  const createShippingRequest = async (requestData: Omit<ShippingRequest, 'requestId' | 'date' | 'status' | 'deliveryPrice' | 'transportCompanyId'>) => {
    await mockApi.createShippingRequest(requestData);
    refreshData();
  };
  
  const updateShippingRequest = async (requestId: string, status: ShippingStatus, transportCompanyId?: string, price?: number) => {
    await mockApi.updateShippingRequest(requestId, status, transportCompanyId, price);
    refreshData();
  };

  const updateSubscription = async (userId: string, planId: string) => {
      await mockApi.updateSubscription(userId, planId);
      if(currentUser?.userId === userId) {
          const user = await mockApi.getUserById(userId);
          if(user) setCurrentUser(user);
      }
      refreshData();
  }

  const value = {
    currentUser,
    users,
    products,
    orders,
    shippingRequests,
    subscriptionPlans,
    language,
    login,
    logout,
    registerUser,
    updateUser,
    setLanguage,
    addProduct,
    updateProduct,
    updateProductStock,
    placeOrder,
    updateOrderStatus,
    createShippingRequest,
    updateShippingRequest,
    updateSubscription,
    refreshData
  };

  return (
    <AppContext.Provider value={value}>
      {loading ? <div className="flex items-center justify-center h-screen bg-secondary">Loading...</div> : children}
    </AppContext.Provider>
  );
};