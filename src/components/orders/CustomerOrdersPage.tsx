import React from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  ShoppingBag, 
  ArrowRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';

interface CustomerOrdersPageProps {
  onNavigate: (path: string) => void;
  onSelectOrder: (orderId: string) => void;
}

export const CustomerOrdersPage: React.FC<CustomerOrdersPageProps> = ({ onNavigate, onSelectOrder }) => {
  const { orders } = useOrders();
  const { user } = useAuth();

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Recent';
    return new Date(isoString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 pb-24">
      
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-950/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Package className="w-3.5 h-3.5" />
              Verified Purchase History
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
              My Orders & Receipts
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Track live shipment statuses, view transaction references, and download invoices.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/shop')}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all self-start sm:self-auto cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            Explore Store
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {orders.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-white/10 space-y-4 max-w-lg mx-auto">
            <Package className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Orders Found Yet</h3>
            <p className="text-sm text-slate-400">
              When you purchase products via our AI Shopping concierge, your verified receipts and live delivery tracking will appear here.
            </p>
            <button
              onClick={() => onNavigate('/shop')}
              className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);

              return (
                <div
                  key={order.id}
                  className="rounded-2xl bg-slate-900/90 border border-white/10 hover:border-white/20 transition-all overflow-hidden shadow-xl"
                >
                  
                  {/* Order Top Bar */}
                  <div className="px-6 py-4 bg-slate-950/80 border-b border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Order Placed</span>
                        <span className="text-slate-300 font-medium">{formatDate(order.createdAt)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Order ID</span>
                        <span className="font-mono text-amber-400 font-bold">#{order.id}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Paid</span>
                        <span className="font-extrabold text-white font-['Space_Grotesk'] text-sm">
                          ₹{order.finalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                        order.paymentStatus === 'Successful'
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                        {order.paymentStatus}
                      </span>

                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="p-6 divide-y divide-white/5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-14 h-14 rounded-xl object-cover bg-slate-950 border border-white/10 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-white text-sm truncate">{item.product.name}</h4>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Quantity: {item.quantity} × ₹{(item.product.discountPrice || item.product.price).toLocaleString('en-IN')}
                            </p>
                            {item.addedViaAI && (
                              <span className="text-[10px] text-amber-400">✨ Added with AI Assistant</span>
                            )}
                          </div>
                        </div>

                        <span className="font-bold text-white text-sm font-['Space_Grotesk']">
                          ₹{((item.product.discountPrice || item.product.price) * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer & Tracking info */}
                  <div className="px-6 py-3.5 bg-slate-950/40 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-amber-400" />
                      <span>Shipping to: {order.shippingAddress.fullName}, {order.shippingAddress.city} ({order.shippingAddress.postalCode})</span>
                    </div>

                    <button
                      onClick={() => onSelectOrder(order.id)}
                      className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 self-end sm:self-auto cursor-pointer"
                    >
                      View Receipt Details
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
