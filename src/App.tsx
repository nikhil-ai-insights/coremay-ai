import React, { useState, useEffect } from 'react';
import { ToastProvider } from './components/ui/Toast';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/home/LandingPage';
import { ShopPage } from './components/shop/ShopPage';
import { ProductDetailPage } from './components/shop/ProductDetailPage';
import { CartPage } from './components/cart/CartPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderSuccessPage } from './components/orders/OrderSuccessPage';
import { CustomerOrdersPage } from './components/orders/CustomerOrdersPage';
import { MerchantSidebar } from './components/merchant/MerchantSidebar';
import { MerchantDashboard } from './components/merchant/MerchantDashboard';
import { MerchantProducts } from './components/merchant/MerchantProducts';
import { MerchantOrders } from './components/merchant/MerchantOrders';
import { MerchantAnalytics } from './components/merchant/MerchantAnalytics';
import { MerchantAuditLogs } from './components/merchant/MerchantAuditLogs';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [merchantTab, setMerchantTab] = useState<'dashboard' | 'products' | 'orders' | 'analytics' | 'audit-logs'>('dashboard');

  // Handle URL changes & history pushState
  const navigate = (path: string) => {
    if (path.startsWith('/#')) {
      // Anchor scroll
      const elementId = path.replace('/#', '');
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    if (path.startsWith('/product/')) {
      const pid = path.replace('/product/', '');
      setSelectedProductId(pid);
      setCurrentPath('/product');
    } else if (path.startsWith('/order-success/')) {
      const oid = path.replace('/order-success/', '');
      setSelectedOrderId(oid);
      setCurrentPath('/order-success');
    } else if (path.startsWith('/merchant/')) {
      const tab = path.replace('/merchant/', '') as any;
      if (['dashboard', 'products', 'orders', 'analytics', 'audit-logs'].includes(tab)) {
        setMerchantTab(tab);
      }
      setCurrentPath('/merchant');
    } else {
      setCurrentPath(path);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isMerchantRoute = currentPath === '/merchant' || currentPath.startsWith('/merchant');

  return (
    <ToastProvider>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <div className="min-h-screen bg-[#0A0A0A] text-gray-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
                
                {/* Global Navigation Header */}
                <Navbar currentPath={currentPath} onNavigate={navigate} />

                {/* Main Content Area */}
                <main className="flex-1">
                  
                  {/* Landing / Home */}
                  {currentPath === '/' && (
                    <LandingPage
                      onNavigate={navigate}
                      onSelectProduct={(id) => {
                        setSelectedProductId(id);
                        setCurrentPath('/product');
                      }}
                    />
                  )}

                  {/* Customer Shop Catalog */}
                  {currentPath === '/shop' && (
                    <ShopPage
                      onNavigate={navigate}
                      onSelectProduct={(id) => {
                        setSelectedProductId(id);
                        setCurrentPath('/product');
                      }}
                    />
                  )}

                  {/* Product Details Page */}
                  {currentPath === '/product' && selectedProductId && (
                    <ProductDetailPage
                      productId={selectedProductId}
                      onBack={() => navigate('/shop')}
                      onNavigate={navigate}
                      onSelectProduct={(id) => {
                        setSelectedProductId(id);
                        navigate(`/product/${id}`);
                      }}
                    />
                  )}

                  {/* Shopping Cart */}
                  {currentPath === '/cart' && (
                    <CartPage
                      onNavigate={navigate}
                      onSelectProduct={(id) => {
                        setSelectedProductId(id);
                        navigate(`/product/${id}`);
                      }}
                    />
                  )}

                  {/* Checkout Flow */}
                  {currentPath === '/checkout' && (
                    <CheckoutPage
                      onNavigate={navigate}
                      onOrderCompleted={(orderId) => {
                        setSelectedOrderId(orderId);
                        setCurrentPath('/order-success');
                      }}
                    />
                  )}

                  {/* Order Success */}
                  {currentPath === '/order-success' && selectedOrderId && (
                    <OrderSuccessPage
                      orderId={selectedOrderId}
                      onNavigate={navigate}
                    />
                  )}

                  {/* Customer Orders */}
                  {currentPath === '/customer/orders' && (
                    <CustomerOrdersPage
                      onNavigate={navigate}
                      onSelectOrder={(orderId) => {
                        setSelectedOrderId(orderId);
                        setCurrentPath('/order-success');
                      }}
                    />
                  )}

                  {/* Merchant Hub Layout */}
                  {isMerchantRoute && (
                    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
                      <MerchantSidebar
                        activeTab={merchantTab}
                        onSelectTab={setMerchantTab}
                        onNavigate={navigate}
                      />
                      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl">
                        {merchantTab === 'dashboard' && (
                          <MerchantDashboard onNavigateTab={setMerchantTab} />
                        )}
                        {merchantTab === 'products' && <MerchantProducts />}
                        {merchantTab === 'orders' && <MerchantOrders />}
                        {merchantTab === 'analytics' && <MerchantAnalytics />}
                        {merchantTab === 'audit-logs' && <MerchantAuditLogs />}
                      </div>
                    </div>
                  )}

                  {/* Authentication */}
                  {currentPath === '/login' && (
                    <LoginPage onNavigate={navigate} />
                  )}

                  {currentPath === '/signup' && (
                    <SignupPage onNavigate={navigate} />
                  )}

                </main>

                {/* Global Footer (hidden on merchant console for workspace feel) */}
                {!isMerchantRoute && <Footer onNavigate={navigate} />}

              </div>
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
