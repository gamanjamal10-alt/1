
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Product, Order, ShippingRequest, UserRole, OrderStatus, ShippingStatus } from '../types';
import { mockApi } from '../services/mockApi';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  products: Product[];
  orders: Order[];
  shippingRequests: ShippingRequest[];
  login: (userId: string) => void;
  logout: () => void;
  addProduct: (product: Omit<Product, 'productId' | 'dateAdded'>) => Promise<void>;
  updateProduct: (productId: string, updatedData: Partial<Product>) => Promise<void>;
  updateProductStock: (productId: string, newStock: number) => Promise<void>;
  placeOrder: (orderData: Omit<Order, 'orderId' | 'date' | 'orderStatus' | 'totalPrice'>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  createShippingRequest: (requestData: Omit<ShippingRequest, 'requestId' | 'date' | 'status' | 'deliveryPrice' | 'transportCompanyId'>) => Promise<void>;
  updateShippingRequest: (requestId: string, status: ShippingStatus, transportCompanyId?: string, price?: number) => Promise<void>;
  refreshData: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [shippingRequests, setShippingRequests] = useState<ShippingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [usersData, productsData, ordersData, shippingRequestsData] = await Promise.all([
      mockApi.getUsers(),
      mockApi.getProducts(),
      mockApi.getOrders(),
      mockApi.getShippingRequests(),
    ]);
    setUsers(usersData);
    setProducts(productsData);
    setOrders(ordersData);
    setShippingRequests(shippingRequestsData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const login = (userId: string) => {
    const user = users.find(u => u.userId === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };
  
  const refreshData = () => {
      fetchData();
  };

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


  const value = {
    currentUser,
    users,
    products,
    orders,
    shippingRequests,
    login,
    logout,
    addProduct,
    updateProduct,
    updateProductStock,
    placeOrder,
    updateOrderStatus,
    createShippingRequest,
    updateShippingRequest,
    refreshData
  };

  return (
    <AppContext.Provider value={value}>
      {loading ? <div className="flex items-center justify-center h-screen bg-secondary">Loading...</div> : children}
    </AppContext.Provider>
  );
};