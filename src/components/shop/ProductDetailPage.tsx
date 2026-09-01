import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Star, 
  ShoppingCart, 
  Zap, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles, 
  Plus, 
  Check, 
  Bot,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Product } from '../../types';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { GrowthPilotAssistant } from '../ai/GrowthPilotAssistant';
import { useToast } from '../ui/Toast';
import { logAuditEvent } from '../../services/auditLogger';
import { useAuth } from '../../context/AuthContext';

interface ProductDetailPageProps {
  productId: string;
  onBack: () => void;
  onNavigate: (path: string) => void;
  onSelectProduct: (productId: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onBack,
  onNavigate,
  onSelectProduct
}) => {
  const { products, getProductById } = useProducts();
  const { addToCart } = useCart();
  const { profile } = useAuth();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'ai-insights'>('overview');

  const product = getProductById(productId) || products[0];

  // Frequently Bought Together (AI Cross-selling Bundle)
  const bundleProducts = useMemo(() => {
    if (!product || !product.frequentlyBoughtWith) return [];
    return product.frequentlyBoughtWith
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => p !== undefined)
      .slice(0, 2);
  }, [product, products]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0b0f17] text-white p-12 text-center">
        <h2 className="text-xl font-bold mb-4">Product Not Found</h2>
        <button onClick={onBack} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">
          Back to Catalog
        </button>
      </div>
    );
  }

  const effectivePrice = product.discountPrice || product.price;
  const bundleTotalPrice = effectivePrice + bundleProducts.reduce((sum, p) => sum + (p.discountPrice || p.price), 0);
  const bundleDiscountedPrice = Math.round(bundleTotalPrice * 0.90); // 10% instant bundle discount

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(`Added ${quantity}x "${product.name}" to cart!`, 'success');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onNavigate('/checkout');
  };

  const handleAddBundleToCart = () => {
    addToCart(product, 1);
    for (const b of bundleProducts) {
      addToCart(b, 1, { viaAI: true, reason: `Frequently Bought Together bundle with ${product.name}` });
    }
    showToast(`Added full 3-item bundle to cart with 10% savings!`, 'success', 'Bundle Added');

    logAuditEvent({
      userId: profile?.uid || 'guest_user',
      userEmail: profile?.email,
      userName: profile?.name,
      actionType: 'CROSS_SELL_VIEWED',
      description: `Customer accepted "Frequently Bought Together" bundle with ${product.name}`,
      relatedProductId: product.id,
      metadata: { bundleItems: bundleProducts.map(p => p.name) }
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 pb-20">
      
      {/* Breadcrumb Navigation */}
      <div className="border-b border-white/10 bg-slate-950/60 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Products
          </button>
          
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span>Shop</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-300">{product.category}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-amber-400 font-medium truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* ========================================================= */}
          {/* LEFT: Product Images & AI Cross-Sell Bundles (col-span-7) */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Main Product Image Stage */}
            <div className="rounded-3xl bg-slate-900 border border-white/10 overflow-hidden shadow-2xl relative aspect-[4/3] flex items-center justify-center group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-amber-500 text-slate-950 shadow-lg">
                    {product.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Product Details Tabs */}
            <div className="rounded-2xl bg-slate-900/80 border border-white/10 p-6 space-y-6">
              <div className="flex border-b border-white/10 gap-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-3 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                    activeTab === 'overview'
                      ? 'border-amber-400 text-amber-400'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Overview & Specs
                </button>
                <button
                  onClick={() => setActiveTab('features')}
                  className={`pb-3 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                    activeTab === 'features'
                      ? 'border-amber-400 text-amber-400'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Key Highlights ({product.features?.length || 0})
                </button>
              </div>

              {activeTab === 'overview' && (
                <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                  <p>{product.description}</p>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                      <span className="text-xs text-slate-400 block mb-1">Authenticity</span>
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Verified Genuine
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5">
                      <span className="text-xs text-slate-400 block mb-1">Dispatch Speed</span>
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-amber-400" /> Express 2-Day Air
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <ul className="space-y-3">
                  {product.features?.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* FREQUENTLY BOUGHT TOGETHER (AI Cross-Selling Bundle) */}
            {bundleProducts.length > 0 && (
              <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-amber-300 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Frequently Bought Together (AI Bundle)
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-xs font-bold">
                    Save 10% Bundle Discount
                  </span>
                </div>

                {/* Items in bundle visual row */}
                <div className="flex flex-wrap items-center gap-3">
                  
                  {/* Base Product */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-white/10 flex items-center gap-3 w-64">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{product.name}</p>
                      <p className="text-xs font-bold text-amber-400">₹{effectivePrice.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <span className="text-amber-400 font-extrabold text-lg">+</span>

                  {/* Bundle Complementary Items */}
                  {bundleProducts.map((bundleItem, idx) => (
                    <React.Fragment key={bundleItem.id}>
                      <div 
                        onClick={() => onSelectProduct(bundleItem.id)}
                        className="p-3 rounded-xl bg-slate-950 border border-white/10 hover:border-amber-500/40 transition-colors flex items-center gap-3 w-64 cursor-pointer"
                      >
                        <img
                          src={bundleItem.image}
                          alt={bundleItem.name}
                          className="w-12 h-12 rounded-lg object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{bundleItem.name}</p>
                          <p className="text-xs font-bold text-amber-400">
                            ₹{(bundleItem.discountPrice || bundleItem.price).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                      {idx < bundleProducts.length - 1 && (
                        <span className="text-amber-400 font-extrabold text-lg">+</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Bundle Summary & Add Button */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-slate-400">Bundle Price:</span>
                      <span className="text-xl font-extrabold text-white font-['Space_Grotesk']">
                        ₹{bundleDiscountedPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500 line-through">
                        ₹{bundleTotalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-400">Includes 1x Main Product + {bundleProducts.length}x Complementary Accessories</p>
                  </div>

                  <button
                    onClick={handleAddBundleToCart}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add All {bundleProducts.length + 1} Items to Cart
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* ========================================================= */}
          {/* RIGHT: Buy Box & Coremay Assistant (col-span-5) */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Purchase Control Card */}
            <div className="rounded-3xl bg-slate-900 border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl">
              
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/20 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400 font-normal">({product.reviewsCount || 48} ratings)</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Price Row */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">Special Online Price</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white font-['Space_Grotesk']">
                      ₹{effectivePrice.toLocaleString('en-IN')}
                    </span>
                    {product.discountPrice && (
                      <span className="text-sm text-slate-500 line-through">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-emerald-400 font-semibold block">Inclusive of GST</span>
                  <span className={`text-xs font-bold ${product.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {product.stock > 0 ? `● ${product.stock} In Stock` : '○ Out of stock'}
                  </span>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="space-y-2">
                <label className="block text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-slate-950 border border-white/10 rounded-xl p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center font-bold text-base cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-white text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-8 h-8 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center font-bold text-base cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-slate-400">
                    Total: <strong className="text-white">₹{(effectivePrice * quantity).toLocaleString('en-IN')}</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  Buy Now with AI Checkout
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-400">
                <div className="p-2 rounded-lg bg-slate-950/40">
                  <ShieldCheck className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <span>Secure Razorpay</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/40">
                  <Truck className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <span>Free Express Air</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/40">
                  <RotateCcw className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <span>7-Day Return</span>
                </div>
              </div>

            </div>

            {/* Embedded Product AI Assistant */}
            <div className="rounded-2xl border border-amber-500/20 overflow-hidden shadow-xl">
              <GrowthPilotAssistant
                currentProduct={product}
                onSelectProduct={onSelectProduct}
                compact
              />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
