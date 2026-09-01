import React, { createContext, useContext, useEffect, useState } from 'react';
import { Order, AuditLog, OrderStatus, PaymentStatus } from '../types';
import { useAuth } from './AuthContext';
import { 
  db, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from '../lib/firebase';
import { logAuditEvent } from '../services/auditLogger';

interface OrderContextType {
  orders: Order[];
  auditLogs: AuditLog[];
  loadingOrders: boolean;
  loadingAuditLogs: boolean;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  getUserOrders: (userId: string) => Order[];
  refreshLogs: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Initial mock orders to populate analytics realistically upon initial startup
const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'ord_gp_882194',
    userId: 'demo_customer_101',
    customerName: 'Aarav Mehta',
    customerEmail: 'aarav.m@example.com',
    items: [
      {
        product: {
          id: 'prod_elec_003',
          name: 'AeroBook Pro M3 14" Creator Laptop',
          category: 'Electronics',
          price: 68999,
          discountPrice: 62999,
          stock: 11,
          description: 'High performance creator laptop',
          features: ['2.8K OLED', '16GB RAM'],
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80'
        },
        quantity: 1
      },
      {
        product: {
          id: 'prod_acc_003',
          name: 'GlideMaster Ergonomic Multi-Device Wireless Mouse',
          category: 'Accessories',
          price: 1699,
          discountPrice: 1299,
          stock: 45,
          description: 'Ergonomic silent mouse',
          features: ['Tri-mode wireless', '4000 DPI'],
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80'
        },
        quantity: 1,
        addedViaAI: true,
        recommendationReason: 'AI Upsell matched with AeroBook Creator Laptop'
      }
    ],
    subtotal: 64298,
    discount: 3214,
    taxes: 10995,
    shippingFee: 0,
    finalAmount: 72079,
    shippingAddress: {
      fullName: 'Aarav Mehta',
      phone: '+91 98765 43210',
      street: '402 High-Tech Residency, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India'
    },
    paymentStatus: 'Successful',
    orderStatus: 'Completed',
    paymentDetails: {
      razorpayOrderId: 'order_gp_rzp_101',
      razorpayPaymentId: 'pay_rzp_994101',
      method: 'Razorpay Test (UPI)',
      currency: 'INR',
      isTestMode: true
    },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    estimatedDelivery: new Date(Date.now() + 86400000 * 2).toISOString(),
    aiAssisted: true,
    aiUpsellCount: 1
  },
  {
    id: 'ord_gp_882195',
    userId: 'demo_customer_102',
    customerName: 'Pooja Sharma',
    customerEmail: 'pooja.s@gmail.com',
    items: [
      {
        product: {
          id: 'prod_elec_001',
          name: 'Coremay Aura Pro Wireless ANC Headphones',
          category: 'Electronics',
          price: 4999,
          discountPrice: 3999,
          stock: 24,
          description: 'Flagship ANC headphones',
          features: ['Hybrid ANC', '50hr battery'],
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
        },
        quantity: 1,
        addedViaAI: true,
        recommendationReason: 'AI Assistant recommended under ₹5000 audio query'
      }
    ],
    subtotal: 3999,
    discount: 200,
    taxes: 683,
    shippingFee: 0,
    finalAmount: 4482,
    shippingAddress: {
      fullName: 'Pooja Sharma',
      phone: '+91 98221 11223',
      street: '12-B Silver Oaks, Viman Nagar',
      city: 'Pune',
      state: 'Maharashtra',
      postalCode: '411014',
      country: 'India'
    },
    paymentStatus: 'Successful',
    orderStatus: 'Processing',
    paymentDetails: {
      razorpayOrderId: 'order_gp_rzp_102',
      razorpayPaymentId: 'pay_rzp_994102',
      method: 'Razorpay Test (Card)',
      currency: 'INR',
      isTestMode: true
    },
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    estimatedDelivery: new Date(Date.now() + 86400000 * 3).toISOString(),
    aiAssisted: true,
    aiUpsellCount: 0
  }
];

const INITIAL_DEMO_LOGS: AuditLog[] = [
  {
    id: 'log_001',
    userId: 'demo_customer_101',
    userEmail: 'aarav.m@example.com',
    userName: 'Aarav Mehta',
    actionType: 'CUSTOMER_SEARCH',
    description: 'Customer searched: "I need a laptop for creator and design work"',
    timestamp: new Date(Date.now() - 86400000 * 2 - 3600000).toISOString(),
    metadata: { query: 'laptop for creator' }
  },
  {
    id: 'log_002',
    userId: 'demo_customer_101',
    userEmail: 'aarav.m@example.com',
    userName: 'Aarav Mehta',
    actionType: 'AI_RECOMMENDATION',
    description: 'Coremay AI recommended AeroBook Pro M3 OLED Laptop based on creative workload parameters',
    relatedProductId: 'prod_elec_003',
    relatedProductName: 'AeroBook Pro M3 14" Creator Laptop',
    timestamp: new Date(Date.now() - 86400000 * 2 - 3500000).toISOString()
  },
  {
    id: 'log_003',
    userId: 'demo_customer_101',
    userEmail: 'aarav.m@example.com',
    userName: 'Aarav Mehta',
    actionType: 'CART_ADD',
    description: 'Added "AeroBook Pro M3 14" Creator Laptop" to cart',
    relatedProductId: 'prod_elec_003',
    relatedProductName: 'AeroBook Pro M3 14" Creator Laptop',
    timestamp: new Date(Date.now() - 86400000 * 2 - 3400000).toISOString()
  },
  {
    id: 'log_004',
    userId: 'demo_customer_101',
    userEmail: 'aarav.m@example.com',
    userName: 'Aarav Mehta',
    actionType: 'UPSELL_SUGGESTION',
    description: 'Coremay AI suggested complementary accessory: GlideMaster Ergonomic Wireless Mouse',
    relatedProductId: 'prod_acc_003',
    relatedProductName: 'GlideMaster Ergonomic Wireless Mouse',
    timestamp: new Date(Date.now() - 86400000 * 2 - 3300000).toISOString()
  },
  {
    id: 'log_005',
    userId: 'demo_customer_101',
    userEmail: 'aarav.m@example.com',
    userName: 'Aarav Mehta',
    actionType: 'UPSELL_ACCEPTED',
    description: 'Customer approved AI upsell and added GlideMaster Wireless Mouse to cart',
    relatedProductId: 'prod_acc_003',
    relatedProductName: 'GlideMaster Ergonomic Wireless Mouse',
    timestamp: new Date(Date.now() - 86400000 * 2 - 3200000).toISOString()
  },
  {
    id: 'log_006',
    userId: 'demo_customer_101',
    userEmail: 'aarav.m@example.com',
    userName: 'Aarav Mehta',
    actionType: 'CHECKOUT_REVIEW',
    description: 'Customer reviewed itemized summary (₹72,079 including taxes) and gave explicit checkout confirmation',
    relatedOrderId: 'ord_gp_882194',
    timestamp: new Date(Date.now() - 86400000 * 2 - 3000000).toISOString()
  },
  {
    id: 'log_007',
    userId: 'demo_customer_101',
    userEmail: 'aarav.m@example.com',
    userName: 'Aarav Mehta',
    actionType: 'PAYMENT_SUCCESS',
    description: 'Razorpay Test Payment verified successfully. Transaction ID: pay_rzp_994101',
    relatedOrderId: 'ord_gp_882194',
    timestamp: new Date(Date.now() - 86400000 * 2 - 2900000).toISOString(),
    metadata: { amount: 72079, method: 'UPI' }
  }
];

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_DEMO_ORDERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_DEMO_LOGS);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingAuditLogs, setLoadingAuditLogs] = useState(true);
  const { profile } = useAuth();

  // Load / listen to Orders from Firestore
  useEffect(() => {
    let isSubscribed = true;

    async function initOrders() {
      try {
        const snap = await getDocs(collection(db, 'orders'));
        if (snap.empty) {
          // seed initial demo orders
          for (const ord of INITIAL_DEMO_ORDERS) {
            await setDoc(doc(db, 'orders', ord.id), ord);
          }
          if (isSubscribed) {
            setOrders(INITIAL_DEMO_ORDERS);
            setLoadingOrders(false);
          }
        } else {
          const loaded: Order[] = [];
          snap.forEach((d) => loaded.push({ id: d.id, ...(d.data() as Omit<Order, 'id'>) }));
          if (isSubscribed) {
            setOrders(loaded.length > 0 ? loaded : INITIAL_DEMO_ORDERS);
            setLoadingOrders(false);
          }
        }
      } catch (err) {
        console.warn('Orders Firestore fallback:', err);
        if (isSubscribed) {
          setOrders(INITIAL_DEMO_ORDERS);
          setLoadingOrders(false);
        }
      }
    }

    initOrders();

    try {
      const unsub = onSnapshot(collection(db, 'orders'), (snapshot) => {
        if (!snapshot.empty) {
          const updated: Order[] = [];
          snapshot.forEach((d) => updated.push({ id: d.id, ...(d.data() as Omit<Order, 'id'>) }));
          // Sort newest first
          updated.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(updated);
        }
      }, (e) => console.warn('Orders listener fallback', e));

      return () => {
        isSubscribed = false;
        unsub();
      };
    } catch {
      return () => { isSubscribed = false; };
    }
  }, []);

  // Load / listen to Audit Logs from Firestore
  useEffect(() => {
    let isSubscribed = true;

    async function initLogs() {
      try {
        const snap = await getDocs(collection(db, 'auditLogs'));
        if (snap.empty) {
          for (const l of INITIAL_DEMO_LOGS) {
            await setDoc(doc(db, 'auditLogs', l.id), l);
          }
          if (isSubscribed) {
            setAuditLogs(INITIAL_DEMO_LOGS);
            setLoadingAuditLogs(false);
          }
        } else {
          const loaded: AuditLog[] = [];
          snap.forEach((d) => loaded.push({ id: d.id, ...(d.data() as Omit<AuditLog, 'id'>) }));
          loaded.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          if (isSubscribed) {
            setAuditLogs(loaded.length > 0 ? loaded : INITIAL_DEMO_LOGS);
            setLoadingAuditLogs(false);
          }
        }
      } catch (err) {
        console.warn('Audit logs Firestore fallback:', err);
        if (isSubscribed) {
          setAuditLogs(INITIAL_DEMO_LOGS);
          setLoadingAuditLogs(false);
        }
      }
    }

    initLogs();

    try {
      const unsub = onSnapshot(collection(db, 'auditLogs'), (snapshot) => {
        if (!snapshot.empty) {
          const updated: AuditLog[] = [];
          snapshot.forEach((d) => updated.push({ id: d.id, ...(d.data() as Omit<AuditLog, 'id'>) }));
          updated.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setAuditLogs(updated);
        }
      }, (e) => console.warn('Audit log listener fallback', e));

      return () => {
        isSubscribed = false;
        unsub();
      };
    } catch {
      return () => { isSubscribed = false; };
    }
  }, []);

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
    const id = `ord_gp_${Math.floor(100000 + Math.random() * 900000)}`;
    const createdAt = new Date().toISOString();
    const newOrder: Order = {
      id,
      createdAt,
      ...orderData
    };

    setOrders((prev) => [newOrder, ...prev]);

    try {
      await setDoc(doc(db, 'orders', id), {
        ...newOrder,
        serverCreatedAt: serverTimestamp()
      });
    } catch (e) {
      console.warn('Failed to write order to Firestore:', e);
    }

    await logAuditEvent({
      userId: newOrder.userId,
      userEmail: newOrder.customerEmail,
      userName: newOrder.customerName,
      actionType: 'PAYMENT_SUCCESS',
      description: `Order #${newOrder.id} placed successfully for ₹${newOrder.finalAmount.toLocaleString('en-IN')}`,
      relatedOrderId: newOrder.id,
      metadata: {
        itemCount: newOrder.items.length,
        finalAmount: newOrder.finalAmount,
        aiAssisted: newOrder.aiAssisted,
        aiUpsellCount: newOrder.aiUpsellCount
      }
    });

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            orderStatus: status,
            paymentStatus: paymentStatus || ord.paymentStatus
          };
        }
        return ord;
      })
    );

    try {
      const updates: any = { orderStatus: status };
      if (paymentStatus) updates.paymentStatus = paymentStatus;
      await setDoc(doc(db, 'orders', orderId), updates, { merge: true });
    } catch (err) {
      console.warn('Update order status Firestore error:', err);
    }

    await logAuditEvent({
      userId: profile?.uid || 'merchant_admin',
      userEmail: profile?.email,
      userName: profile?.name,
      actionType: 'PRODUCT_UPDATED',
      description: `Order #${orderId} status changed to ${status}${paymentStatus ? ` (Payment: ${paymentStatus})` : ''}`,
      relatedOrderId: orderId
    });
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((o) => o.id === orderId);
  };

  const getUserOrders = (userId: string): Order[] => {
    // If demo user or current user, return matching orders or all for easy preview
    if (!userId || userId === 'guest_user') return orders;
    return orders.filter((o) => o.userId === userId || o.customerEmail === profile?.email);
  };

  const refreshLogs = async () => {
    try {
      const snap = await getDocs(collection(db, 'auditLogs'));
      const loaded: AuditLog[] = [];
      snap.forEach((d) => loaded.push({ id: d.id, ...(d.data() as Omit<AuditLog, 'id'>) }));
      loaded.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setAuditLogs(loaded);
    } catch (e) {
      console.warn('Refresh logs error', e);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        auditLogs,
        loadingOrders,
        loadingAuditLogs,
        createOrder,
        updateOrderStatus,
        getOrderById,
        getUserOrders,
        refreshLogs
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
