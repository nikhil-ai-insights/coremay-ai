import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types';
import { INITIAL_DEMO_PRODUCTS } from '../data/demoProducts';
import { 
  db, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  onSnapshot 
} from '../lib/firebase';
import { logAuditEvent } from '../services/auditLogger';
import { useAuth } from './AuthContext';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateStock: (id: string, newStock: number) => Promise<void>;
  updatePrice: (id: string, newPrice: number, newDiscountPrice?: number) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  resetToDemoProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_DEMO_PRODUCTS);
  const [loading, setLoading] = useState<boolean>(true);
  const { profile } = useAuth();

  useEffect(() => {
    let isSubscribed = true;

    async function initProducts() {
      try {
        const prodCollection = collection(db, 'products');
        const snapshot = await getDocs(prodCollection);

        if (snapshot.empty) {
          // Seed Firestore with initial demo products
          for (const prod of INITIAL_DEMO_PRODUCTS) {
            await setDoc(doc(db, 'products', prod.id), prod);
          }
          if (isSubscribed) {
            setProducts(INITIAL_DEMO_PRODUCTS);
            setLoading(false);
          }
        } else {
          const loaded: Product[] = [];
          snapshot.forEach((d) => {
            loaded.push({ id: d.id, ...(d.data() as Omit<Product, 'id'>) });
          });
          if (isSubscribed) {
            setProducts(loaded.length > 0 ? loaded : INITIAL_DEMO_PRODUCTS);
            setLoading(false);
          }
        }
      } catch (err) {
        console.warn('[ProductContext] Firestore fetch fallback to local demo dataset:', err);
        if (isSubscribed) {
          setProducts(INITIAL_DEMO_PRODUCTS);
          setLoading(false);
        }
      }
    }

    initProducts();

    // Subscribe to live updates if Firestore is accessible
    try {
      const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
        if (!snapshot.empty) {
          const updated: Product[] = [];
          snapshot.forEach((d) => {
            updated.push({ id: d.id, ...(d.data() as Omit<Product, 'id'>) });
          });
          setProducts(updated);
        }
      }, (err) => {
        console.warn('Realtime products listener fallback:', err);
      });

      return () => {
        isSubscribed = false;
        unsub();
      };
    } catch {
      return () => { isSubscribed = false; };
    }
  }, []);

  const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
    const id = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newProduct: Product = { id, ...productData };

    // Optimistic UI update
    setProducts((prev) => [newProduct, ...prev]);

    try {
      await setDoc(doc(db, 'products', id), newProduct);
    } catch (err) {
      console.warn('Failed to write product to Firestore:', err);
    }

    await logAuditEvent({
      userId: profile?.uid || 'merchant_admin',
      userEmail: profile?.email,
      userName: profile?.name,
      actionType: 'PRODUCT_CREATED',
      description: `Merchant added new product: "${newProduct.name}" (₹${newProduct.price})`,
      relatedProductId: newProduct.id,
      relatedProductName: newProduct.name,
      metadata: { category: newProduct.category, price: newProduct.price, stock: newProduct.stock }
    });

    return newProduct;
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );

    try {
      await updateDoc(doc(db, 'products', id), updates);
    } catch (err) {
      console.warn('Failed to update product in Firestore:', err);
    }

    const updatedProd = products.find((p) => p.id === id);
    await logAuditEvent({
      userId: profile?.uid || 'merchant_admin',
      userEmail: profile?.email,
      userName: profile?.name,
      actionType: 'PRODUCT_UPDATED',
      description: `Merchant updated product: "${updatedProd?.name || id}"`,
      relatedProductId: id,
      relatedProductName: updatedProd?.name,
      metadata: updates
    });
  };

  const deleteProduct = async (id: string): Promise<void> => {
    const targetProd = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      console.warn('Failed to delete product from Firestore:', err);
    }

    await logAuditEvent({
      userId: profile?.uid || 'merchant_admin',
      userEmail: profile?.email,
      userName: profile?.name,
      actionType: 'PRODUCT_DELETED',
      description: `Merchant removed product: "${targetProd?.name || id}"`,
      relatedProductId: id,
      relatedProductName: targetProd?.name
    });
  };

  const updateStock = async (id: string, newStock: number): Promise<void> => {
    await updateProduct(id, { stock: Math.max(0, newStock) });
  };

  const updatePrice = async (id: string, newPrice: number, newDiscountPrice?: number): Promise<void> => {
    await updateProduct(id, { price: newPrice, discountPrice: newDiscountPrice });
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find((p) => p.id === id);
  };

  const resetToDemoProducts = async (): Promise<void> => {
    setProducts(INITIAL_DEMO_PRODUCTS);
    try {
      for (const prod of INITIAL_DEMO_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }
    } catch (e) {
      console.warn('Reset demo warning:', e);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        updatePrice,
        getProductById,
        resetToDemoProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
