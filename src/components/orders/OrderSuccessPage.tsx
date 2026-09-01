import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Calendar, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Printer
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';

interface OrderSuccessPageProps {
  orderId: string;
  onNavigate: (path: string) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ orderId, onNavigate }) => {
  const { getOrderById } = useOrders();
  const order = getOrderById(orderId);

  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#10b981', '#ffffff']
      });
    } catch (e) {
      console.warn('Confetti effect failed', e);
    }
  }, []);

  const formatDate = (isoString?: string) => {
    if (!isoString) return new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' });
    return new Date(isoString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Success Card */}
        <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 p-8 sm:p-10 text-center space-y-6 shadow-2xl relative overflow-hidden">
          
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase tracking-wider inline-block mb-3">
              Payment Verified & Confirmed
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk']">
              Thank you for your order!
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
              Your payment was processed securely via Razorpay. We are preparing your shipment for dispatch.
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5">
              <span className="text-[11px] text-slate-400 block mb-1">Order Reference</span>
              <span className="font-mono text-xs sm:text-sm font-bold text-white truncate block">
                #{orderId}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5">
              <span className="text-[11px] text-slate-400 block mb-1">Payment Status</span>
              <span className="font-semibold text-xs sm:text-sm text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Successful
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5">
              <span className="text-[11px] text-slate-400 block mb-1">Total Paid</span>
              <span className="font-extrabold text-xs sm:text-sm text-amber-400">
                ₹{(order?.finalAmount || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5">
              <span className="text-[11px] text-slate-400 block mb-1">Est. Delivery</span>
              <span className="font-semibold text-xs sm:text-sm text-slate-200">
                {formatDate(order?.estimatedDelivery)}
              </span>
            </div>
          </div>

          {/* Items Breakdown */}
          {order && order.items && (
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 text-left space-y-4">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-400" />
                Ordered Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
              </h3>

              <div className="divide-y divide-white/5">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-900 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{item.product.name}</p>
                        <p className="text-[11px] text-slate-400">Qty: {item.quantity} × ₹{(item.product.discountPrice || item.product.price).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white font-['Space_Grotesk']">
                      ₹{((item.product.discountPrice || item.product.price) * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs text-slate-400">
                <span>Shipping: Express Delivery to {order.shippingAddress?.city || 'Customer Address'}</span>
                <span className="font-bold text-white text-sm">
                  Paid: ₹{order.finalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('/shop')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </button>
            <button
              onClick={() => onNavigate('/customer/orders')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>View All My Orders</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
