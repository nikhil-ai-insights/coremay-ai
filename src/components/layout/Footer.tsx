import React from 'react';
import { Bot, Shield, Sparkles, Cpu, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-white/10 bg-[#080b11] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/20">
                <Bot className="w-4 h-4 text-slate-950 font-bold" />
              </div>
              <span className="font-bold text-lg text-white font-['Space_Grotesk']">
                COREMAY<span className="text-amber-400">.ai</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              AI-Powered Growth for Modern Commerce. An intelligent commerce agent that helps merchants increase revenue through personalized recommendations, conversational shopping, and AI-assisted sales.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Gemini 2.5 Flash Engine Active
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                <Shield className="w-3 h-3 text-amber-400" />
                Razorpay Test Mode
              </span>
            </div>
          </div>

          {/* Product Col */}
          <div>
            <h4 className="font-semibold text-white uppercase text-xs tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('/shop')} className="hover:text-amber-400 transition-colors">
                  Customer Shop
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/#features')} className="hover:text-amber-400 transition-colors">
                  AI Shopping Assistant
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/#how-it-works')} className="hover:text-amber-400 transition-colors">
                  Smart Upselling
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/#features')} className="hover:text-amber-400 transition-colors">
                  Cross-Selling Matrix
                </button>
              </li>
            </ul>
          </div>

          {/* Merchant Col */}
          <div>
            <h4 className="font-semibold text-white uppercase text-xs tracking-wider mb-4">Merchant Hub</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('/merchant/dashboard')} className="hover:text-amber-400 transition-colors">
                  Revenue Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/merchant/products')} className="hover:text-amber-400 transition-colors">
                  Product Inventory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/merchant/orders')} className="hover:text-amber-400 transition-colors">
                  Order Management
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/merchant/analytics')} className="hover:text-amber-400 transition-colors">
                  AI Conversion Analytics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/merchant/audit-logs')} className="hover:text-amber-400 transition-colors">
                  Audit Trail & Compliance
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Tech Col */}
          <div>
            <h4 className="font-semibold text-white uppercase text-xs tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-300 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-amber-400" /> Firebase Firestore
                </span>
              </li>
              <li>
                <span className="text-slate-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Google GenAI
                </span>
              </li>
              <li>
                <span className="text-slate-400">Privacy Policy</span>
              </li>
              <li>
                <span className="text-slate-400">Terms of Service</span>
              </li>
              <li>
                <span className="text-slate-400">Merchant SLA</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Coremay. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">Autonomous Commerce Engine</span>
            <span className="text-amber-400/80 font-mono">v2.4.0-prod</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
