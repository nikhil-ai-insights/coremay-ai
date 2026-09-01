import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Eye, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Clock, 
  X, 
  Package, 
  Sparkles,
  MapPin,
  Mail,
  Phone,
  User,
  Filter
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { Order, OrderStatus } from '../../types';
import { useToast } from '../ui/Toast';

export const MerchantOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useOrders();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const STATUS_OPTIONS: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'All' && order.orderStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerEmail.toLowerCase().includes(q) ||
        (order.paymentDetails?.razorpayPaymentId && order.paymentDetails.razorpayPaymentId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, orderStatus: newStatus } : null);
    }
    showToast(`Order #${orderId.substring(0, 8)} status updated to ${newStatus}`, 'success');
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161616] p-6 rounded-2xl border border-white/5">
        <div>
          <div className="flex items-center gap-2 text-gray-500 text-xs font-mono uppercase tracking-widest mb-1">
            <ShoppingCart className="w-3.5 h-3.5 text-amber-500" />
            Fulfillment Pipeline
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
            Order Management ({orders.length})
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Track incoming transactions, inspect payment references, and manage shipping dispatch.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#161616] border border-white/5">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Customer, Email..."
            className="w-full pl-10 pr-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', ...STATUS_OPTIONS].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === status
                  ? 'bg-amber-500 text-black font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-[#161616] border border-white/5 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#0F0F0F] text-gray-500 uppercase text-[10px] font-mono border-b border-white/5">
                <th className="py-4 px-6 font-semibold">Order ID</th>
                <th className="py-4 px-4 font-semibold">Customer</th>
                <th className="py-4 px-4 font-semibold">Items</th>
                <th className="py-4 px-4 font-semibold">Total Amount</th>
                <th className="py-4 px-4 font-semibold">Payment</th>
                <th className="py-4 px-4 font-semibold">Fulfillment Status</th>
                <th className="py-4 px-6 text-right font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-400 font-mono text-xs">
                    <ShoppingCart className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    No customer orders found. When customers place orders, they will appear here in real time.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);

                  return (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      
                      <td className="py-4 px-6 font-mono font-bold text-amber-500">
                        #{order.id.substring(0, 8)}
                        {order.aiAssisted && (
                          <span className="block text-[10px] text-emerald-400 font-mono font-normal">✨ AI Assisted</span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <p className="font-bold text-white text-xs sm:text-sm">{order.customerName}</p>
                        <p className="text-[11px] text-gray-400">{order.customerEmail}</p>
                      </td>

                      <td className="py-4 px-4">
                        <span className="text-xs text-gray-300 font-medium font-mono">{totalItems} items</span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold text-white font-['Space_Grotesk'] text-sm">
                          ₹{order.finalAmount.toLocaleString('en-IN')}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-semibold border border-emerald-500/20 flex items-center gap-1 w-fit">
                          <ShieldCheck className="w-3 h-3" />
                          {order.paymentStatus}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className="bg-[#0F0F0F] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-amber-400 font-mono focus:outline-none focus:border-amber-500"
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-amber-500/20 text-gray-400 hover:text-amber-400 transition-colors cursor-pointer"
                          title="View complete order breakdown"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full rounded-2xl bg-[#161616] border border-white/10 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            
            <div className="p-6 bg-[#0F0F0F] border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-lg font-['Space_Grotesk']">
                    Order #{selectedOrder.id}
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 font-mono">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-sm text-gray-300 bg-[#161616]">
              
              {/* Customer and Shipping cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#0F0F0F] border border-white/5 space-y-2">
                  <h4 className="font-bold text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-amber-500" />
                    Customer Info
                  </h4>
                  <p className="font-semibold text-white">{selectedOrder.customerName}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-gray-500" /> {selectedOrder.customerEmail}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-gray-500" /> {selectedOrder.shippingAddress?.phone || '+91 98765 43210'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0F0F0F] border border-white/5 space-y-2">
                  <h4 className="font-bold text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    Shipping Destination
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.postalCode}
                  </p>
                  <p className="text-xs text-amber-400 font-semibold font-mono">
                    Country: {selectedOrder.shippingAddress?.country || 'India'}
                  </p>
                </div>
              </div>

              {/* Payment Reference */}
              <div className="p-4 rounded-xl bg-[#0F0F0F] border border-white/5 space-y-2">
                <h4 className="font-bold text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Transaction Details
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 block text-[10px] font-mono uppercase">Gateway Order ID:</span>
                    <span className="font-mono text-gray-300">{selectedOrder.paymentDetails?.razorpayOrderId || 'order_sec_001'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px] font-mono uppercase">Payment ID:</span>
                    <span className="font-mono text-emerald-400">{selectedOrder.paymentDetails?.razorpayPaymentId || 'pay_sec_9921'}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                <h4 className="font-bold text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-amber-500" />
                  Purchased Products
                </h4>
                <div className="divide-y divide-white/5 rounded-xl bg-[#0F0F0F] border border-white/5 p-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-black shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="text-xs font-semibold text-white truncate">{item.product.name}</p>
                          <p className="text-[11px] text-gray-400">{item.quantity} × ₹{(item.product.discountPrice || item.product.price).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-white font-['Space_Grotesk']">
                        ₹{((item.product.discountPrice || item.product.price) * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total calculations */}
              <div className="p-4 rounded-xl bg-[#0F0F0F] border border-white/5 space-y-2 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-₹{selectedOrder.discount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>GST Taxes</span>
                  <span>₹{selectedOrder.taxes.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm text-white">
                  <span>Total Paid</span>
                  <span className="text-amber-400 font-['Space_Grotesk'] text-base">₹{selectedOrder.finalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
