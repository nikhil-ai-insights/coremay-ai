import React from 'react';
import { 
  Bot, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  ShoppingCart, 
  Zap, 
  CheckCircle2, 
  Store, 
  Layers, 
  Lock,
  Star,
  Cpu
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
  onSelectProduct: (productId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onSelectProduct }) => {
  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 overflow-hidden">
      
      {/* ========================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================= */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="text-center space-y-6 max-w-3xl mx-auto relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Autonomous Conversational Commerce Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-['Space_Grotesk'] leading-[1.1]">
            AI-Powered Growth for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
              Modern Commerce
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Increase your online store revenue with an autonomous conversational shopping agent, real-time upselling, cross-selling bundles, and transparent checkout.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('/shop')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all cursor-pointer group"
            >
              <span>Explore Customer Experience</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('/merchant/dashboard')}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/15 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Store className="w-4 h-4 text-amber-400" />
              <span>Launch Merchant Console</span>
            </button>
          </div>

          {/* Quick trust metrics */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Gemini 2.5 Flash Brain</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Razorpay Test Sandbox</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>Zero Unauthorized Charges</span>
            </div>
          </div>

        </div>

        {/* Hero Interactive UI Preview Mockup */}
        <div className="mt-16 rounded-3xl bg-slate-900/90 border border-white/15 p-4 sm:p-6 shadow-2xl backdrop-blur-xl relative max-w-5xl mx-auto overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              <span className="text-xs font-mono text-slate-500 ml-2">coremay.ai/preview</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              LIVE PLATFORM ARCHITECTURE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Box 1: AI Concierge */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm font-['Space_Grotesk']">1. Conversational Search</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                "Show me noise-cancelling headphones under ₹5,000" — Gemini matches exact catalog inventory without hallucinating non-existent items.
              </p>
            </div>

            {/* Box 2: Smart Upselling */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm font-['Space_Grotesk']">2. Explicit Cart Upsell</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Recommends curated accessories and bundles with 10% instant discounts. Requires explicit user approval before adding.
              </p>
            </div>

            {/* Box 3: Merchant Analytics */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm font-['Space_Grotesk']">3. Merchant Intelligence</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real-time attribution showing AI Conversion Lift, AOV gains, and full compliance event audit logs in Firestore.
              </p>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================= */}
      {/* 2. CORE CAPABILITIES */}
      {/* ========================================================= */}
      <section id="features" className="py-20 bg-slate-950/60 border-y border-white/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              Enterprise Grade AI E-Commerce
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk']">
              Engineered for Conversions & Trust
            </h2>
            <p className="text-sm text-slate-400">
              Coremay eliminates high bounce rates and cart abandonment by transforming passive catalog browsing into active sales consultations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4 hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-lg font-['Space_Grotesk']">Conversational Sales Agent</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Understands natural language inquiries, compares technical specs, and guides customers to the right product within their budget.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4 hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-lg font-['Space_Grotesk']">Dynamic Upsell Bundles</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Analyzes live cart items to offer complementary accessories with transparent pricing and instant 1-click bundle additions.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4 hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-lg font-['Space_Grotesk']">Razorpay Test Gateway</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full-featured Razorpay sandbox with UPI, Cards, NetBanking, simulated success and error flows, and immediate order receipts.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4 hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-lg font-['Space_Grotesk']">Audit & Governance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Detailed immutable audit trail logging all AI queries, recommendations, upselling decisions, cart changes, and transaction records.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. HOW IT WORKS */}
      {/* ========================================================= */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-16">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              Autonomous Growth Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk']">
              How Coremay Boosts Store Revenue
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center">
                01
              </div>
              <h3 className="font-bold text-white text-lg font-['Space_Grotesk']">Customer Inquires</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Shoppers describe what they need in plain English via the integrated Coremay AI Assistant.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center">
                02
              </div>
              <h3 className="font-bold text-white text-lg font-['Space_Grotesk']">AI Matches & Upsells</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gemini analyzes current stock and surfaces matching products plus smart high-margin accessories with explicit customer approval.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center">
                03
              </div>
              <h3 className="font-bold text-white text-lg font-['Space_Grotesk']">Settlement & Attribution</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Transparent confirmation screen locks in price, settles via Razorpay, and tracks ROI in the Merchant Revenue dashboard.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. BOTTOM CTA BANNER */}
      {/* ========================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 p-8 sm:p-12 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-black font-['Space_Grotesk']">
              Ready to experience Coremay?
            </h2>
            <p className="text-sm text-slate-900 font-medium max-w-lg">
              Explore the live store catalog or launch the merchant console to test AI-assisted conversions and Razorpay test mode.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('/shop')}
              className="px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <span>Explore Shop</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
            <button
              onClick={() => onNavigate('/merchant/dashboard')}
              className="px-6 py-3.5 rounded-xl bg-white/90 hover:bg-white text-slate-950 font-extrabold text-xs sm:text-sm transition-all cursor-pointer shadow-md"
            >
              Merchant Console
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
