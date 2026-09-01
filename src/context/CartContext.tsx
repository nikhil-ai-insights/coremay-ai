import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';
import { useProducts } from './ProductContext';
import { logAuditEvent } from '../services/auditLogger';
import { db, doc, setDoc, getDoc } from '../lib/firebase';

export interface UpsellSuggestion {
  product: Product;
  reason: string;
  sourceProductId?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, options?: { viaAI?: boolean; reason?: string }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  discount: number;
  taxes: number;
  finalAmount: number;
  upsellSuggestions: UpsellSuggestion[];
  crossSellRecommendations: Product[];
  dismissUpsell: (productId: string) => void;
  acceptUpsell: (upsell: UpsellSuggestion) => void;
  isAiAnalyzing: boolean;
  refreshAiRecommendations: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('gp_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [upsellSuggestions, setUpsellSuggestions] = useState<UpsellSuggestion[]>([]);
  const [crossSellRecommendations, setCrossSellRecommendations] = useState<Product[]>([]);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const { profile } = useAuth();
  const { products } = useProducts();

  // Save to localStorage and Firestore when cart changes
  useEffect(() => {
    try {
      localStorage.setItem('gp_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('LocalStorage cart save failed', e);
    }

    if (profile?.uid) {
      try {
        setDoc(doc(db, 'carts', profile.uid), {
          items: cart,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('Firestore cart sync error:', err);
      }
    }
  }, [cart, profile?.uid]);

  // Analyze cart with AI for intelligent upselling and cross-selling
  const refreshAiRecommendations = async () => {
    if (cart.length === 0 || products.length === 0) {
      setUpsellSuggestions([]);
      setCrossSellRecommendations([]);
      return;
    }

    setIsAiAnalyzing(true);
    try {
      const res = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cart,
          catalog: products
        })
      });

      if (res.ok) {
        const data = await res.json();
        const rawRecs: { productId: string; reason: string }[] = data.recommendations || [];
        
        const suggestions: UpsellSuggestion[] = [];
        const existingCartIds = cart.map((c) => c.product.id);

        for (const item of rawRecs) {
          if (!existingCartIds.includes(item.productId)) {
            const product = products.find((p) => p.id === item.productId);
            if (product && product.stock > 0) {
              suggestions.push({
                product,
                reason: item.reason
              });
            }
          }
        }

        setUpsellSuggestions(suggestions);

        // Cross-sell complementary products
        const crossSellPool: Product[] = [];
        for (const c of cart) {
          if (c.product.frequentlyBoughtWith) {
            for (const relId of c.product.frequentlyBoughtWith) {
              if (!existingCartIds.includes(relId) && !crossSellPool.some(p => p.id === relId)) {
                const found = products.find(p => p.id === relId);
                if (found) crossSellPool.push(found);
              }
            }
          }
        }
        setCrossSellRecommendations(crossSellPool.slice(0, 4));

        if (suggestions.length > 0) {
          await logAuditEvent({
            userId: profile?.uid || 'guest_user',
            userEmail: profile?.email,
            userName: profile?.name,
            actionType: 'UPSELL_SUGGESTION',
            description: `Coremay AI generated ${suggestions.length} dynamic upsell suggestions for current cart`,
            metadata: {
              suggestedProducts: suggestions.map(s => ({ id: s.product.id, name: s.product.name, reason: s.reason }))
            }
          });
        }
      }
    } catch (e) {
      console.warn('AI Cart recommendations fetch error:', e);
      // Fallback heuristics
      const existingCartIds = cart.map((c) => c.product.id);
      const fallbackRecs: UpsellSuggestion[] = [];
      for (const item of cart) {
        if (item.product.frequentlyBoughtWith) {
          for (const fid of item.product.frequentlyBoughtWith) {
            if (!existingCartIds.includes(fid) && !fallbackRecs.some(r => r.product.id === fid)) {
              const p = products.find(prod => prod.id === fid);
              if (p) {
                fallbackRecs.push({
                  product: p,
                  reason: `Frequently purchased together with ${item.product.name}.`
                });
              }
            }
          }
        }
      }
      setUpsellSuggestions(fallbackRecs.slice(0, 3));
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  useEffect(() => {
    refreshAiRecommendations();
  }, [cart.length, products.length]);

  const addToCart = (product: Product, quantity = 1, options?: { viaAI?: boolean; reason?: string }) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(product.stock, updated[existingIndex].quantity + quantity);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        return updated;
      }
      return [
        ...prev,
        {
          product,
          quantity: Math.min(product.stock, quantity),
          addedViaAI: options?.viaAI || false,
          recommendationReason: options?.reason
        }
      ];
    });

    logAuditEvent({
      userId: profile?.uid || 'guest_user',
      userEmail: profile?.email,
      userName: profile?.name,
      actionType: 'CART_ADD',
      description: `Added "${product.name}" to cart (Qty: ${quantity}${options?.viaAI ? ', via AI Assistant' : ''})`,
      relatedProductId: product.id,
      relatedProductName: product.name,
      metadata: { price: product.discountPrice || product.price, viaAI: options?.viaAI }
    });
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find(c => c.product.id === productId);
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    if (item) {
      logAuditEvent({
        userId: profile?.uid || 'guest_user',
        userEmail: profile?.email,
        userName: profile?.name,
        actionType: 'CART_ADD',
        description: `Removed "${item.product.name}" from shopping cart`,
        relatedProductId: productId,
        relatedProductName: item.product.name
      });
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const validQty = Math.min(item.product.stock, quantity);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const acceptUpsell = (upsell: UpsellSuggestion) => {
    addToCart(upsell.product, 1, { viaAI: true, reason: upsell.reason });
    setUpsellSuggestions((prev) => prev.filter((s) => s.product.id !== upsell.product.id));

    logAuditEvent({
      userId: profile?.uid || 'guest_user',
      userEmail: profile?.email,
      userName: profile?.name,
      actionType: 'UPSELL_ACCEPTED',
      description: `Customer accepted AI upsell: "${upsell.product.name}" (₹${upsell.product.discountPrice || upsell.product.price})`,
      relatedProductId: upsell.product.id,
      relatedProductName: upsell.product.name,
      metadata: { reason: upsell.reason }
    });
  };

  const dismissUpsell = (productId: string) => {
    const upsell = upsellSuggestions.find((s) => s.product.id === productId);
    setUpsellSuggestions((prev) => prev.filter((s) => s.product.id !== productId));

    if (upsell) {
      logAuditEvent({
        userId: profile?.uid || 'guest_user',
        userEmail: profile?.email,
        userName: profile?.name,
        actionType: 'UPSELL_REJECTED',
        description: `Customer dismissed AI upsell suggestion: "${upsell.product.name}"`,
        relatedProductId: upsell.product.id,
        relatedProductName: upsell.product.name
      });
    }
  };

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.product.discountPrice || item.product.price) * item.quantity, 0);
  
  // Applied discounts: 5% automated AI cart saver discount if order > ₹3000
  const discount = subtotal > 3000 ? Math.round(subtotal * 0.05) : 0;
  const taxes = Math.round((subtotal - discount) * 0.18); // 18% GST standard e-commerce
  const finalAmount = Math.max(0, subtotal - discount + taxes);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        discount,
        taxes,
        finalAmount,
        upsellSuggestions,
        crossSellRecommendations,
        dismissUpsell,
        acceptUpsell,
        isAiAnalyzing,
        refreshAiRecommendations
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
