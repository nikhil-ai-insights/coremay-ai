import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  ShoppingCart, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Sparkles,
  Bot
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { ShippingAddress, PaymentStatus } from '../../types';
import { RazorpayModal } from './RazorpayModal';
import { logAuditEvent } from '../../services/auditLogger';
import { useToast } from '../ui/Toast';

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
  onOrderCompleted: (orderId: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate, onOrderCompleted }) => {
  const { cart, subtotal, discount, taxes, finalAmount, clearCart } = useCart();
  const { profile } = useAuth();
  const { createOrder } = useOrders();
  const { showToast } = useToast();

  const [customerName, setCustomerName] = useState(profile?.name || 'Alex Shopper');
  const [customerEmail, setCustomerEmail] = useState(profile?.email || 'alex.shopper@gmail.com');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: profile?.name || 'Alex Shopper',
    phone: '+91 98765 43210',
    street: '702 Silicon Palms, 80 Feet Road, Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560034',
    country: 'India'
  });

  const [hasConfirmedReview, setHasConfirmedReview] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Pending');
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [razorpayOrderId, setRazorpayOrderId] = useState('');
  const [paymentErrorMessage, setPaymentErrorMessage] = useState('');

  if (cart.length === 0 && paymentStatus !== 'Processing') {
    return (
      <div className="min-h-[70vh] bg-[#0b0f17] flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-white/10 p-8 text-center space-y-6">
          <ShoppingCart className="w-12 h-12 text-slate-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Your Cart is Empty</h2>
          <button
            onClick={() => onNavigate('/shop')}
            className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm"
          >
            Return to Store
          </button>
        </div>
      </div>
    );
  }

  // Handle explicit Customer Review & Order Initiation
  const handleProceedToPayment = async () => {
    if (!hasConfirmedReview) {
      showToast('Please check the confirmation box to review your final amount.', 'error');
      return;
    }

    if (!customerName || !customerEmail || !address.street || !address.city || !address.postalCode) {
      showToast('Please fill all required shipping and contact details.', 'error');
      return;
    }

    setPaymentStatus('Processing');
    setPaymentErrorMessage('');

    // Audit log explicit checkout review
    await logAuditEvent({
      userId: profile?.uid || 'guest_user',
      userEmail: customerEmail,
      userName: customerName,
      actionType: 'CHECKOUT_REVIEW',
      description: `Customer explicitly reviewed final amount (₹${finalAmount.toLocaleString('en-IN')}) and initiated payment gateway`,
      metadata: { finalAmount, itemCount: cart.length }
    });

    try {
      // Create Razorpay Order
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          currency: 'INR',
          notes: {
            customerName,
            customerEmail
          }
        })
      });

      const data = await res.json();
      if (res.ok && data.orderId) {
        setRazorpayOrderId(data.orderId);
        setIsRazorpayModalOpen(true);
      } else {
        throw new Error(data.error || 'Failed to initialize payment gateway');
      }
    } catch (err: any) {
      console.warn('Payment init error:', err);
      setPaymentStatus('Failed');
      setPaymentErrorMessage(err.message || 'Could not connect to payment gateway.');
    }
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    setIsRazorpayModalOpen(false);
    setPaymentStatus('Successful');

    const aiUpsellCount = cart.filter((i) => i.addedViaAI).length;

    const newOrder = await createOrder({
      userId: profile?.uid || 'guest_user',
      customerName,
      customerEmail,
      items: [...cart],
      subtotal,
      discount,
      taxes,
      shippingFee: 0,
      finalAmount,
      shippingAddress: { ...address, fullName: customerName, phone: customerPhone },
      paymentStatus: 'Successful',
      orderStatus: 'Processing',
      paymentDetails: {
        razorpayOrderId,
        razorpayPaymentId: paymentId,
        method: 'Razorpay Test Gateway',
        currency: 'INR',
        isTestMode: true
      },
      estimatedDelivery: new Date(Date.now() + 86400000 * 3).toISOString(),
      aiAssisted: aiUpsellCount > 0,
      aiUpsellCount
    });

    clearCart();
    showToast('Payment successful! Your order has been placed.', 'success', 'Order Confirmed');
    onOrderCompleted(newOrder.id);
  };

  const handlePaymentFailure = async (errorMsg: string) => {
    setIsRazorpayModalOpen(false);
    setPaymentStatus('Failed');
    setPaymentErrorMessage(errorMsg || 'Your payment could not be completed. No successful order has been created. You can safely try again.');

    await logAuditEvent({
      userId: profile?.uid || 'guest_user',
      userEmail: customerEmail,
      userName: customerName,
      actionType: 'PAYMENT_FAILED',
      description: `Payment attempt declined for order: ${errorMsg}`,
      metadata: { amount: finalAmount }
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 pb-24">
      
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-950/60 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('/cart')}
            className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Cart
          </button>
          
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
            <Lock className="w-3.5 h-3.5" />
            256-Bit SSL Encrypted Checkout
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* PAYMENT FAILED ALERT (Friendly Retry screen per prompt) */}
        {paymentStatus === 'Failed' && (
          <div className="mb-8 p-6 rounded-3xl bg-rose-950/40 border border-rose-500/40 space-y-4 animate-in fade-in">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-white text-base">Payment Not Completed</h3>
                <p className="text-sm text-rose-200 leading-relaxed">
                  Your payment could not be completed. No successful order has been created. You can safely try again.
                </p>
                {paymentErrorMessage && (
                  <p className="text-xs text-rose-300 font-mono pt-1">Reason: {paymentErrorMessage}</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleProceedToPayment}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Try Again
              </button>
              <button
                onClick={() => onNavigate('/cart')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-white/10 transition-colors cursor-pointer"
              >
                Return to Cart
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* ========================================================= */}
          {/* LEFT: Customer Details & Shipping Address (col-span-7) */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Customer Information */}
            <div className="rounded-2xl bg-slate-900/80 border border-white/10 p-6 space-y-4">
              <h3 className="font-bold text-white text-base font-['Space_Grotesk'] flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" />
                1. Customer Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-2xl bg-slate-900/80 border border-white/10 p-6 space-y-4">
              <h3 className="font-bold text-white text-base font-['Space_Grotesk'] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                2. Shipping Address
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Street Address / House No.</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">City</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">State</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs text-slate-400 mb-1.5">PIN Code</label>
                    <input
                      type="text"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Confirmation Compliance Notice */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <ShieldCheck className="w-4 h-4" />
                Coremay AI Financial Safety Policy
              </div>
              <p className="text-slate-400 leading-relaxed">
                Coremay AI adheres to strict zero-unauthorized charge protocols. The AI assistant cannot and will never auto-charge or initiate payments without explicit manual customer confirmation.
              </p>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT: Transparent Confirmation Checkpoint (col-span-5) */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="rounded-3xl bg-slate-900 border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl sticky top-24">
              
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  Step 3 of 3
                </span>
                <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  Please review your order before proceeding.
                </h2>
              </div>

              {/* Itemized Mini List */}
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1 divide-y divide-white/5 scrollbar-thin">
                {cart.map((item) => (
                  <div key={item.product.id} className="pt-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span className="font-bold text-amber-400">{item.quantity}x</span>
                      <span className="text-slate-200 truncate">{item.product.name}</span>
                    </div>
                    <span className="font-semibold text-white whitespace-nowrap">
                      ₹{((item.product.discountPrice || item.product.price) * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Exact Breakdown Requested in Prompt */}
              <div className="space-y-2.5 text-sm pt-4 border-t border-white/10">
                <div className="flex justify-between text-slate-300 text-xs">
                  <span>Items:</span>
                  <span className="font-medium text-white">{cart.reduce((s, i) => s + i.quantity, 0)} items</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Discount:</span>
                  <span className="font-semibold">{discount > 0 ? `-₹${discount.toLocaleString('en-IN')}` : '₹0'}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Taxes (18% GST):</span>
                  <span className="font-semibold text-white">₹{taxes.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                  <span className="text-base font-bold text-white">Final Amount:</span>
                  <span className="text-2xl font-black text-amber-400 font-['Space_Grotesk']">
                    ₹{finalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Mandatory Review Checkbox */}
              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950 border border-white/10 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={hasConfirmedReview}
                  onChange={(e) => setHasConfirmedReview(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-white/20 accent-amber-400 mt-0.5 cursor-pointer"
                />
                <span className="text-xs text-slate-300 group-hover:text-white leading-relaxed">
                  I have verified the item list and agree to authorize payment of <strong className="text-amber-400">₹{finalAmount.toLocaleString('en-IN')}</strong> via Razorpay Test Gateway.
                </span>
              </label>

              {/* Explicit CTA Button */}
              <button
                onClick={handleProceedToPayment}
                disabled={!hasConfirmedReview || paymentStatus === 'Processing'}
                className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Confirm and Proceed to Payment</span>
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Razorpay Test Mode Payment Gateway Modal */}
      <RazorpayModal
        isOpen={isRazorpayModalOpen}
        orderId={razorpayOrderId}
        amount={finalAmount}
        customerName={customerName}
        customerEmail={customerEmail}
        onClose={() => setIsRazorpayModalOpen(false)}
        onSuccess={handlePaymentSuccess}
        onFailure={handlePaymentFailure}
      />

    </div>
  );
};
