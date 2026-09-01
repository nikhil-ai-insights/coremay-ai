import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Building2, 
  Wallet, 
  X, 
  AlertTriangle, 
  Lock, 
  CheckCircle2,
  Loader2
} from 'lucide-react';

interface RazorpayModalProps {
  isOpen: boolean;
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
  onFailure: (errorMessage: string) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  orderId,
  amount,
  customerName,
  customerEmail,
  onClose,
  onSuccess,
  onFailure
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('789');
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSimulatePayment = async (shouldFail = false) => {
    setProcessing(true);
    try {
      const res = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpayOrderId: orderId,
          razorpayPaymentId: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          simulateFailure: shouldFail
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTimeout(() => {
          setProcessing(false);
          onSuccess(data.paymentId);
        }, 1200);
      } else {
        setTimeout(() => {
          setProcessing(false);
          onFailure(data.message || 'Payment simulation declined by issuer.');
        }, 1000);
      }
    } catch (err: any) {
      setTimeout(() => {
        setProcessing(false);
        onFailure(err.message || 'Network error during payment verification.');
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-white/15 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Razorpay Header */}
        <div className="p-5 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-xs shadow-md">
              RZP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm font-['Space_Grotesk']">Razorpay Test Gateway</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono uppercase">
                  Sandbox
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Order #{orderId}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={processing}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount bar */}
        <div className="px-6 py-4 bg-slate-950 flex items-center justify-between border-b border-white/5">
          <span className="text-xs text-slate-400">Total Payable Amount</span>
          <span className="text-xl font-black text-amber-400 font-['Space_Grotesk']">
            ₹{amount.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Payment Methods */}
        <div className="p-6 space-y-5">
          
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setSelectedMethod('upi')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                selectedMethod === 'upi'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                  : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-5 h-5" />
              <span>UPI / QR</span>
            </button>
            <button
              onClick={() => setSelectedMethod('card')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                selectedMethod === 'card'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                  : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setSelectedMethod('netbanking')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                selectedMethod === 'netbanking'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                  : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span>NetBanking</span>
            </button>
          </div>

          {/* Tab Form */}
          {selectedMethod === 'upi' && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-3">
              <label className="block text-xs text-slate-400">Enter Virtual Payment Address (VPA / UPI ID)</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <div className="flex items-center gap-2 text-[11px] text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Test Mode auto-approval ready</span>
              </div>
            </div>
          )}

          {selectedMethod === 'card' && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Card Number (Test)</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Expiry</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">CVV</label>
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'netbanking' && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-2 text-xs text-slate-300">
              <p className="font-semibold text-white">Select Popular Bank (Test Mode):</p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((bank, i) => (
                  <button
                    key={i}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-blue-600/20 text-slate-300 hover:text-white border border-white/5 text-left truncate"
                  >
                    {bank}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => handleSimulatePayment(false)}
              disabled={processing}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authorizing via Razorpay...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹{amount.toLocaleString('en-IN')} (Success Test)</span>
                </>
              )}
            </button>

            {/* Simulate Failure Button to test error states */}
            <button
              onClick={() => handleSimulatePayment(true)}
              disabled={processing}
              className="w-full py-2 rounded-xl bg-slate-950 hover:bg-rose-950/40 text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Simulate Failed Payment Flow
            </button>
          </div>

          <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            256-Bit SSL Encrypted Mock Gateway Sandbox
          </p>

        </div>

      </div>
    </div>
  );
};
