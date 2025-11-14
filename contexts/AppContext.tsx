
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Store, Subscription, Product, Order, ShippingRequest, SubscriptionPlan, OrderStatus, ShippingStatus, Language, HelpTopic, UserRole, CartItem, OrderType } from '../types';
import { mockApi } from '../services/mockApi';
import { GoogleGenAI } from "@google/genai";
import { translations } from '../utils/translations'; // Import translations directly

// This would be in a .env file in a real app
const API_KEY = process.env.API_KEY;

interface HelpPosition {
    top: number;
    left: number;
}

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
  helpContent: string | null;
  isHelpVisible: boolean;
  helpPosition: HelpPosition | null;
  isPreviewing: boolean;
  cart: CartItem[];
  viewToNavigate: string | null;

  // Actions
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  registerUser: (userData: Omit<User, 'userId' | 'registrationDate' | 'language'>) => Promise<User>;
  selectStore: (store: Store) => void;
  unselectStore: () => void;
  
  createStore: (storeData: Omit<Store, 'storeId' | 'createdAt' | 'status' | 'address' | 'locationGps' | 'profilePhoto' | 'whatsAppLink'>) => Promise<Store>;
  updateUser: (userId: string, updatedData: Partial<User>) => Promise<void>;
  setLanguage: (lang: Language) => void;
  addProduct: (product: Omit<Product, 'productId' | 'dateAdded'>) => Promise<void>;
  updateProduct: (productId: string, updatedData: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  createShippingRequest: (requestData: Omit<ShippingRequest, 'requestId' | 'date' | 'status' | 'deliveryPrice' | 'transportStoreId'>) => Promise<void>;
  updateShippingRequest: (requestId: string, status: ShippingStatus, transportStoreId?: string, price?: number) => Promise<void>;
  updateSubscription: (storeId: string, planId: 'FREE_30' | 'PLAN_6M' | 'PLAN_12M') => Promise<void>;
  updateStore: (storeId: string, updatedData: Partial<Store>) => Promise<void>;
  deleteStore: (storeId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  refreshData: () => void;
  showHelp: (topic: HelpTopic, element: HTMLElement) => void;
  hideHelp: () => void;
  setIsPreviewing: (isPreviewing: boolean) => void;
  // Cart Actions
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrders: (checkoutDetails: Omit<Order, 'orderId' | 'date' | 'orderStatus' | 'totalPrice' | 'productId' | 'buyerStoreId' | 'sellerStoreId' | 'orderType' | 'quantity' | 'notes'>) => Promise<void>;
  navigateToDashboardView: (view: string) => void;
  clearDashboardNavigation: () => void;
  getAssistantResponse: (question: string) => Promise<string>;
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

  // AI Help State
  const [helpContent, setHelpContent] = useState<string | null>(null);
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [helpPosition, setHelpPosition] = useState<HelpPosition | null>(null);

  // Preview State
  const [isPreviewing, setIsPreviewing] = useState(false);
  
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Navigation State
  const [viewToNavigate, setViewToNavigate] = useState<string | null>(null);


  const getTranslation = (key: keyof typeof translations.en, replacements?: { [key: string]: string }) => {
      const langKey = language === Language.AR ? 'ar' : language === Language.FR ? 'fr' : 'en';
      let text = translations[langKey][key] || translations.en[key];
      if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            text = text.replace(`{{${placeholder}}}`, replacements[placeholder]);
        });
      }
      return text;
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
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
    } catch (error) {
        console.error("Failed to fetch initial data:", error);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchUserStores = async (userId: string) => {
      const userStoresData = await mockApi.getStoresByUserId(userId);
      const storesWithStatus = await Promise.all(userStoresData.map(async (store) => {
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
    setIsPreviewing(false);
    setCart([]);
  };

  const selectStore = (store: Store) => {
      setCurrentStore(store);
      setIsPreviewing(false);
      setViewToNavigate(null);
  };
  
  const unselectStore = () => {
      setCurrentStore(null);
      setIsPreviewing(false);
      setCart([]);
      setViewToNavigate(null);
  }
  
  const refreshData = useCallback(() => {
      fetchData();
      if(currentUser) fetchUserStores(currentUser.userId);
  }, [fetchData, currentUser]);

  const registerUser = async (userData: Omit<User, 'userId' | 'registrationDate' | 'language'>) => {
      const newUser = await mockApi.registerUser(userData);
      setUsers(prev => [...prev, newUser]);
      return newUser;
  }

  const createStore = async (storeData: Omit<Store, 'storeId' | 'createdAt' | 'status' | 'address' | 'locationGps' | 'profilePhoto' | 'whatsAppLink'>) => {
      const newStore = await mockApi.createStore(storeData);
      setStores(prev => [...prev, newStore]);
      await fetchUserStores(storeData.userId); // refetch user stores specifically
      return newStore;
  }
  
  const updateUser = async (userId: string, updatedData: Partial<User>) => {
    const updatedUser = await mockApi.updateUser(userId, updatedData);
    if(updatedUser) {
        setUsers(prev => prev.map(u => u.userId === userId ? updatedUser : u));
        if (currentUser?.userId === userId) {
            setCurrentUser(updatedUser);
        }
    }
  };

  const updateStore = async (storeId: string, updatedData: Partial<Store>) => {
      const updatedStore = await mockApi.updateStore(storeId, updatedData);
      if (updatedStore) {
          setStores(prev => prev.map(s => s.storeId === storeId ? updatedStore : s));
          setUserStores(prev => prev.map(s => s.storeId === storeId ? {...s, ...updatedStore} : s));
          if (currentStore?.storeId === storeId) {
              setCurrentStore(prev => prev ? { ...prev, ...updatedStore } : null);
          }
      }
  };

  const deleteStore = async (storeId: string) => {
      await mockApi.deleteStore(storeId);
      setStores(prev => prev.filter(s => s.storeId !== storeId));
      setUserStores(prev => prev.filter(s => s.storeId !== storeId));
      if (currentStore?.storeId === storeId) {
          setCurrentStore(null);
      }
  };

  const deleteUser = async (userId: string) => {
      await mockApi.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.userId !== userId));
      logout();
  };

  const addProduct = async (productData: Omit<Product, 'productId' | 'dateAdded'>) => {
    const newProduct = await mockApi.addProduct(productData);
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = async (productId: string, updatedData: Partial<Product>) => {
    const updatedProduct = await mockApi.updateProduct(productId, updatedData);
    if (updatedProduct) {
        setProducts(prev => prev.map(p => p.productId === productId ? updatedProduct : p));
    }
  };

  const deleteProduct = async (productId: string) => {
    await mockApi.deleteProduct(productId);
    setProducts(prev => prev.filter(p => p.productId !== productId));
    setOrders(prev => prev.filter(o => o.productId !== productId));
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const updatedOrder = await mockApi.updateOrderStatus(orderId, status);
    if (updatedOrder) {
        setOrders(prev => prev.map(o => o.orderId === orderId ? updatedOrder : o));
    }
  };
  
  const createShippingRequest = async (requestData: Omit<ShippingRequest, 'requestId' | 'date' | 'status' | 'deliveryPrice' | 'transportStoreId'>) => {
    const newRequest = await mockApi.createShippingRequest(requestData);
    setShippingRequests(prev => [...prev, newRequest]);
  };
  
  const updateShippingRequest = async (requestId: string, status: ShippingStatus, transportStoreId?: string, price?: number) => {
    const updatedRequest = await mockApi.updateShippingRequest(requestId, status, transportStoreId, price);
    if (updatedRequest) {
        setShippingRequests(prev => prev.map(r => r.requestId === requestId ? updatedRequest : r));
    }
  };

  const updateSubscription = async (storeId: string, planId: 'FREE_30' | 'PLAN_6M' | 'PLAN_12M') => {
      const updatedSub = await mockApi.updateSubscription(storeId, planId);
      if (updatedSub && currentUser) {
          // Manually update store status in local state
          const updatedStore = stores.find(s => s.storeId === storeId);
          if (updatedStore) {
              const newStoreState = { ...updatedStore, status: updatedSub.status as any, subscriptionStatus: updatedSub.status };
              setStores(prev => prev.map(s => s.storeId === storeId ? newStoreState : s));
              setUserStores(prev => prev.map(s => s.storeId === storeId ? newStoreState : s));
              if (currentStore?.storeId === storeId) {
                  setCurrentStore(newStoreState);
              }
          }
      }
  }

  // AI Help Functions
  const showHelp = async (topic: HelpTopic, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    setHelpPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    setHelpContent(null); // Show loading spinner
    setIsHelpVisible(true);

    try {
        if (!API_KEY) {
            throw new Error("API_KEY is not set for Gemini API.");
        }
        if (!currentStore) {
            throw new Error("No store selected.");
        }

        const ai = new GoogleGenAI({apiKey: API_KEY});
        const roleName = currentStore.storeType;
        const promptKey = `helpPrompt_${topic}` as any;
        const promptTemplate = getTranslation(promptKey, { role: roleName });
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: promptTemplate,
        });
        
        setHelpContent(response.text);

    } catch (error) {
        console.error("Error fetching help content:", error);
        setHelpContent("Sorry, I couldn't fetch help at this moment.");
    }
  };

  const hideHelp = () => {
    setIsHelpVisible(false);
    setHelpContent(null);
    setHelpPosition(null);
  };

   // AI Assistant Chat
  const getAssistantResponse = async (question: string): Promise<string> => {
     try {
        if (!API_KEY) {
            throw new Error("API_KEY is not set for Gemini API.");
        }
        if (!currentStore) {
            throw new Error("No store selected.");
        }
        const ai = new GoogleGenAI({apiKey: API_KEY});
        
        const role = currentStore.storeType;
        const contextKey = `assistantContext_${role.toLowerCase()}` as keyof typeof translations.en;
        const systemInstruction = getTranslation(contextKey);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: question,
            config: {
                systemInstruction,
            }
        });

        return response.text;

     } catch (error) {
         console.error("Error getting assistant response:", error);
         return getTranslation('assistantError');
     }
  };

  // Cart Functions
    const addToCart = (productId: string, quantity: number) => {
        const product = products.find(p => p.productId === productId);
        if (!product) return;

        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.productId === productId);
            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;
                return prevCart.map(item => 
                    item.productId === productId 
                        ? { ...item, quantity: newQuantity > product.stockQuantity ? product.stockQuantity : newQuantity } 
                        : item
                );
            }
            const newQuantity = quantity > product.stockQuantity ? product.stockQuantity : quantity;
            return [...prevCart, { productId, quantity: newQuantity }];
        });
    };

    const updateCartQuantity = (productId: string, quantity: number) => {
        const product = products.find(p => p.productId === productId);
        if (!product) return;

        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            setCart(prevCart => prevCart.map(item => 
                item.productId === productId ? { ...item, quantity: quantity > product.stockQuantity ? product.stockQuantity : quantity } : item
            ));
        }
    };

    const removeFromCart = (productId: string) => {
        setCart(prevCart => prevCart.filter(item => item.productId !== productId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const placeOrders = async (checkoutDetails: Omit<Order, 'orderId' | 'date' | 'orderStatus' | 'totalPrice' | 'productId' | 'buyerStoreId' | 'sellerStoreId' | 'orderType' | 'quantity' | 'notes'>) => {
        if (!currentStore) throw new Error("No buyer store selected.");
        if (cart.length === 0) throw new Error("Cart is empty.");

        const newOrdersPromises = cart.map(item => {
            const product = products.find(p => p.productId === item.productId);
            if (!product) return Promise.reject(`Product ${item.productId} not found`);

            const orderType = currentStore.storeType === UserRole.WHOLESALER ? OrderType.WHOLESALE : OrderType.RETAIL;

            return mockApi.createOrder({
                productId: item.productId,
                buyerStoreId: currentStore.storeId,
                sellerStoreId: product.storeId,
                orderType,
                quantity: item.quantity,
                notes: '', // Notes are per-item and not in this flow
                ...checkoutDetails
            });
        });
        
        const createdOrders = await Promise.all(newOrdersPromises);
        setOrders(prev => [...prev, ...createdOrders]);
        clearCart();
    };

    const navigateToDashboardView = (view: string) => {
        setViewToNavigate(view);
    };

    const clearDashboardNavigation = () => {
        setViewToNavigate(null);
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
    helpContent,
    isHelpVisible,
    helpPosition,
    isPreviewing,
    cart,
    viewToNavigate,
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
    deleteProduct,
    updateOrderStatus,
    createShippingRequest,
    updateShippingRequest,
    updateSubscription,
    updateStore,
    deleteStore,
    deleteUser,
    refreshData,
    showHelp,
    hideHelp,
    setIsPreviewing,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    placeOrders,
    navigateToDashboardView,
    clearDashboardNavigation,
    getAssistantResponse,
  };

  return (
    <AppContext.Provider value={value}>
      {loading ? <div className="flex items-center justify-center h-screen bg-secondary">Loading...</div> : children}
    </AppContext.Provider>
  );
};
