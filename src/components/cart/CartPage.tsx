import React from 'react';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Bot,
  Check,
  X
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { useToast } from '../ui/Toast';

interface CartPageProps {
  onNavigate: (path: string) => void;
  onSelectProduct: (productId: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate, onSelectProduct }) => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    subtotal, 
    discount, 
    taxes, 
    finalAmount, 
    upsellSuggestions,
    crossSellRecommendations,
    acceptUpsell,
    dismissUpsell,
    isAiAnalyzing 
  } = useCart();
  const { showToast } = useToast();

  if (cart.length === 0) {
    return (
      <div className="min-h-[75vh] bg-[#0b0f17] flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl bg-slate-900/90 border border-white/10 p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">Your Cart is Empty</h2>
            <p className="text-sm text-slate-400 mt-2">
              Discover curated premium tech, fashion, and lifestyle gear powered by our conversational AI.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/shop')}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            Explore Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 pb-24">
      
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-950/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Autonomous Cart Optimization Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
              Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
            </h1>
          </div>

          <button
            onClick={clearCart}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Cart
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* ========================================================= */}
          {/* LEFT: Cart Items & AI Recommendations (col-span-8) */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Itemized Cart List */}
            <div className="rounded-2xl bg-slate-900/90 border border-white/10 divide-y divide-white/5 overflow-hidden shadow-xl">
              {cart.map((item) => {
                const effectivePrice = item.product.discountPrice || item.product.price;
                const itemTotal = effectivePrice * item.quantity;

                return (
                  <div key={item.product.id} className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    <div 
                      onClick={() => onSelectProduct(item.product.id)}
                      className="flex items-center gap-4 cursor-pointer group min-w-0 flex-1"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-950 border border-white/10 shrink-0 group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                          {item.product.category}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                          {item.product.name}
                        </h3>
                        {item.addedViaAI && (
                          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-medium">
                            <Sparkles className="w-2.5 h-2.5" />
                            Added via AI Assistant
                          </span>
                        )}
                        <p className="text-xs text-slate-400 mt-1">
                          Unit Price: ₹{effectivePrice.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Quantity controls & Price */}
                    <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                      <div className="flex items-center bg-slate-950 border border-white/10 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-extrabold text-white font-['Space_Grotesk'] block">
                          ₹{itemTotal.toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors mt-0.5 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* AI SMART UPSELLING SECTION */}
            {upsellSuggestions.length > 0 && (
              <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-amber-300 text-sm uppercase tracking-wider">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    AI Upselling & Complementary Recommendations
                  </div>
                  <span className="text-xs text-slate-400 hidden sm:inline-block">
                    Requires Explicit Confirmation
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  Coremay AI analyzed your cart items and found these high-value accessories that are frequently purchased together.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {upsellSuggestions.map((upsell) => (
                    <div
                      key={upsell.product.id}
                      className="p-4 rounded-xl bg-slate-950/90 border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-3 relative group"
                    >
                      <button
                        onClick={() => dismissUpsell(upsell.product.id)}
                        className="absolute top-2.5 right-2.5 text-slate-500 hover:text-white p-1"
                        title="Dismiss recommendation"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-start gap-3">
                        <img
                          src={upsell.product.image}
                          alt={upsell.product.name}
                          className="w-14 h-14 rounded-lg object-cover bg-slate-900 border border-white/10 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 pr-4">
                          <h4 className="font-bold text-white text-xs truncate">{upsell.product.name}</h4>
                          <p className="text-[11px] text-amber-300/90 leading-tight mt-1">
                            💡 {upsell.reason}
                          </p>
                          <p className="font-extrabold text-sm text-white mt-1.5 font-['Space_Grotesk']">
                            ₹{(upsell.product.discountPrice || upsell.product.price).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          acceptUpsell(upsell);
                          showToast(`Added "${upsell.product.name}" to cart!`, 'success');
                        }}
                        className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Approve & Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Cross-Sell Recommendations ("AI Recommendations for You") */}
            {crossSellRecommendations.length > 0 && (
              <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-6 space-y-4">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  AI Recommendations for You
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {crossSellRecommendations.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => onSelectProduct(prod.id)}
                      className="p-3 rounded-xl bg-slate-950 border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer group"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full aspect-square rounded-lg object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <h5 className="font-semibold text-xs text-white truncate mt-2 group-hover:text-amber-300">
                        {prod.name}
                      </h5>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-bold text-amber-400">
                          ₹{(prod.discountPrice || prod.price).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400">★ {prod.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ========================================================= */}
          {/* RIGHT: Order Summary Card (col-span-4) */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl bg-slate-900 border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl sticky top-24">
              
              <h2 className="text-xl font-bold text-white font-['Space_Grotesk'] border-b border-white/10 pb-4">
                Order Summary
              </h2>

              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Cart Subtotal</span>
                  <span className="font-semibold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> AI Cart Saver (5%)
                    </span>
                    <span className="font-semibold">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-300">
                  <span>GST Taxes (18%)</span>
                  <span className="font-semibold text-white">₹{taxes.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-emerald-400 uppercase text-xs">FREE EXPRESS</span>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
                  <span className="text-base font-bold text-white">Final Amount</span>
                  <span className="text-2xl font-black text-amber-400 font-['Space_Grotesk']">
                    ₹{finalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('/checkout')}
                className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
              >
                <span>Proceed to AI Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 text-xs text-slate-400 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Zero AI charges without customer confirmation. Razorpay Test Mode enabled.</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
