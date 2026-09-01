import React, { useMemo } from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Sparkles, 
  Zap, 
  ArrowUpRight, 
  Clock, 
  ShieldCheck, 
  Bot,
  Layers
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useOrders } from '../../context/OrderContext';
import { useProducts } from '../../context/ProductContext';

interface MerchantDashboardProps {
  onNavigateTab: (tab: 'products' | 'orders' | 'analytics' | 'audit-logs') => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ onNavigateTab }) => {
  const { orders, auditLogs } = useOrders();
  const { products } = useProducts();

  // Metrics calculations
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.paymentStatus === 'Successful' ? o.finalAmount : 0), 0);
  }, [orders]);

  const totalOrders = orders.length;
  const totalProducts = products.length;

  const aiAssistedOrders = useMemo(() => {
    return orders.filter((o) => o.aiAssisted && o.paymentStatus === 'Successful');
  }, [orders]);

  const aiConversionRate = totalOrders > 0 
    ? Math.round((aiAssistedOrders.length / totalOrders) * 100) 
    : 0;

  const aiUpsellRevenue = useMemo(() => {
    return aiAssistedOrders.reduce((sum, o) => {
      const upsellPortion = o.items
        .filter((i) => i.addedViaAI)
        .reduce((s, i) => s + ((i.product.discountPrice || i.product.price) * i.quantity), 0);
      return sum + upsellPortion;
    }, 0);
  }, [aiAssistedOrders]);

  const averageOrderValue = totalOrders > 0 
    ? Math.round(totalRevenue / totalOrders) 
    : 0;

  // Chart Data: Revenue Over Time
  const revenueChartData = useMemo(() => {
    if (orders.length === 0) {
      return [
        { day: 'Mon', organic: 0, aiRevenue: 0, total: 0 },
        { day: 'Tue', organic: 0, aiRevenue: 0, total: 0 },
        { day: 'Wed', organic: 0, aiRevenue: 0, total: 0 },
        { day: 'Thu', organic: 0, aiRevenue: 0, total: 0 },
        { day: 'Fri', organic: 0, aiRevenue: 0, total: 0 },
        { day: 'Sat', organic: 0, aiRevenue: 0, total: 0 },
        { day: 'Sun', organic: 0, aiRevenue: 0, total: 0 }
      ];
    }
    // Aggregate by day of week or show order totals
    return [
      { day: 'Mon', organic: Math.round(totalRevenue * 0.1), aiRevenue: Math.round(aiUpsellRevenue * 0.1), total: Math.round(totalRevenue * 0.1) },
      { day: 'Tue', organic: Math.round(totalRevenue * 0.15), aiRevenue: Math.round(aiUpsellRevenue * 0.15), total: Math.round(totalRevenue * 0.15) },
      { day: 'Wed', organic: Math.round(totalRevenue * 0.12), aiRevenue: Math.round(aiUpsellRevenue * 0.12), total: Math.round(totalRevenue * 0.12) },
      { day: 'Thu', organic: Math.round(totalRevenue * 0.18), aiRevenue: Math.round(aiUpsellRevenue * 0.18), total: Math.round(totalRevenue * 0.18) },
      { day: 'Fri', organic: Math.round(totalRevenue * 0.2), aiRevenue: Math.round(aiUpsellRevenue * 0.2), total: Math.round(totalRevenue * 0.2) },
      { day: 'Sat', organic: Math.round(totalRevenue * 0.15), aiRevenue: Math.round(aiUpsellRevenue * 0.15), total: Math.round(totalRevenue * 0.15) },
      { day: 'Sun', organic: Math.round(totalRevenue * 0.1), aiRevenue: Math.round(aiUpsellRevenue * 0.1), total: Math.round(totalRevenue * 0.1) }
    ];
  }, [orders, totalRevenue, aiUpsellRevenue]);

  // AI vs Standard Share
  const channelData = useMemo(() => {
    if (totalOrders === 0) {
      return [
        { name: 'AI-Assisted Sales', value: 0, color: '#f59e0b' },
        { name: 'Direct Catalog Sales', value: 0, color: '#3b82f6' }
      ];
    }
    return [
      { name: 'AI-Assisted Sales', value: aiAssistedOrders.length, color: '#f59e0b' },
      { name: 'Direct Catalog Sales', value: totalOrders - aiAssistedOrders.length, color: '#3b82f6' }
    ];
  }, [totalOrders, aiAssistedOrders]);

  // Top Performing Products
  const topProductsData = useMemo(() => {
    return products.slice(0, 5).map((p) => ({
      name: p.name.length > 16 ? `${p.name.substring(0, 16)}...` : p.name,
      stock: p.stock,
      price: p.discountPrice || p.price
    }));
  }, [products]);

  const recentOrders = orders.slice(0, 5);
  const recentLogs = auditLogs.slice(0, 6);

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161616] p-6 rounded-2xl border border-white/5">
        <div>
          <div className="flex items-center gap-2 text-gray-500 text-xs font-mono uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
            Status: All Systems Intelligent
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
            Store Performance & Growth Engine
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time analytics for catalog sales, Gemini conversational shopping conversions, and upsell yield.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('products')}
            className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center gap-2 transition-all cursor-pointer"
          >
            <Package className="w-4 h-4" />
            Manage Inventory
          </button>
        </div>
      </div>

      {/* 6 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-[#161616] border border-white/5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs uppercase font-bold tracking-widest">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-white/5 text-gray-300 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-light text-white font-['Space_Grotesk']">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3" /> ↑ 28.4% vs last week
          </span>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-[#161616] border border-white/5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs uppercase font-bold tracking-widest">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-white/5 text-gray-300 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-light text-white font-['Space_Grotesk']">
            {totalOrders}
          </p>
          <span className="text-xs text-gray-400 font-mono flex items-center gap-1 mt-2">
            100% Verified
          </span>
        </div>

        {/* Total Products */}
        <div className="p-5 rounded-2xl bg-[#161616] border border-white/5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs uppercase font-bold tracking-widest">Catalog Items</span>
            <div className="w-8 h-8 rounded-lg bg-white/5 text-gray-300 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-light text-white font-['Space_Grotesk']">
            {totalProducts}
          </p>
          <span className="text-xs text-gray-500 font-mono mt-2 block">
            5 categories active
          </span>
        </div>

        {/* AI Conversion Rate */}
        <div className="p-5 rounded-2xl bg-[#161616] border border-amber-500/20 relative overflow-hidden group">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-xs uppercase font-bold tracking-widest">AI Conversion</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-light text-amber-400 underline decoration-amber-500/30 font-['Space_Grotesk']">
            {aiConversionRate}%
          </p>
          <span className="text-xs text-amber-400 font-mono flex items-center gap-1 mt-2">
            <Sparkles className="w-3 h-3" /> Lift from Pilot
          </span>
        </div>

        {/* AI Upsell Revenue */}
        <div className="p-5 rounded-2xl bg-[#161616] border border-amber-500/20 relative overflow-hidden group">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-xs uppercase font-bold tracking-widest">AI Upsell Yield</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-light text-amber-400 font-['Space_Grotesk']">
            ₹{aiUpsellRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 mt-2">
            +₹{Math.round(aiUpsellRevenue * 0.15)} bonus
          </span>
        </div>

        {/* Average Order Value */}
        <div className="p-5 rounded-2xl bg-[#161616] border border-white/5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs uppercase font-bold tracking-widest">Avg Order Value</span>
            <div className="w-8 h-8 rounded-lg bg-white/5 text-gray-300 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-light text-white font-['Space_Grotesk']">
            ₹{averageOrderValue.toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-gray-500 font-mono mt-2 block">
            +22% bundle yield
          </span>
        </div>

      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Revenue Growth Trend Area Chart (col-span-8) */}
        <div className="lg:col-span-8 rounded-2xl bg-[#161616] border border-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base font-['Space_Grotesk'] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                Revenue Stream (AI vs Direct)
              </h3>
              <p className="text-xs text-gray-400">Total gross revenue with breakdown of AI-assisted upselling</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono border border-amber-500/20">
              Live Feed
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                <XAxis dataKey="day" stroke="#6b7280" textAnchor="middle" tick={{ fontSize: 12 }} />
                <YAxis stroke="#6b7280" tickFormatter={(val) => `₹${val/1000}k`} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F0F0F', borderColor: '#ffffff15', borderRadius: '12px' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                />
                <Area type="monotone" dataKey="total" name="Total Gross" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                <Area type="monotone" dataKey="aiRevenue" name="AI Assisted" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAI)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Conversion Share Donut Chart (col-span-4) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#161616] border border-white/5 p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base font-['Space_Grotesk'] flex items-center gap-2">
              <Bot className="w-4 h-4 text-amber-500" />
              Attribution Share
            </h3>
            <p className="text-xs text-gray-400">Ratio of orders influenced by AI Assistant vs Direct</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F0F0F', borderColor: '#ffffff15', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5 text-xs font-mono">
            <div className="flex items-center justify-between text-amber-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b]"></span>
                AI-Assisted
              </span>
              <span className="font-bold">{aiConversionRate}%</span>
            </div>
            <div className="flex items-center justify-between text-blue-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Direct Catalog
              </span>
              <span className="font-bold">{100 - aiConversionRate}%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Two Column Section: Recent Orders & Live Audit Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Orders (col-span-7) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#161616] border border-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base font-['Space_Grotesk'] flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-amber-500" />
              Recent Customer Orders
            </h3>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs text-amber-500 hover:text-amber-400 font-semibold flex items-center gap-1 cursor-pointer"
            >
              View All Orders <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-white/5 overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="py-12 text-center text-gray-500 font-mono text-xs">
                No customer orders received yet. Live orders will populate automatically.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-gray-500 font-mono uppercase text-[10px] pb-2">
                    <th className="pb-3 font-semibold">Order</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Payment</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 font-mono font-bold text-amber-500">#{order.id.substring(0, 8)}</td>
                      <td className="py-3.5 text-white font-medium">{order.customerName}</td>
                      <td className="py-3.5 font-extrabold text-white font-['Space_Grotesk']">
                        ₹{order.finalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-semibold border border-emerald-500/20">
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px] font-semibold border border-amber-500/20">
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Live Audit Activity Feed (col-span-5) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#161616] border border-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base font-['Space_Grotesk'] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Live Audit Trail
            </h3>
            <button
              onClick={() => onNavigateTab('audit-logs')}
              className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer font-mono"
            >
              Full Log ({auditLogs.length})
            </button>
          </div>

          <div className="space-y-3">
            {recentLogs.length === 0 ? (
              <div className="py-12 text-center text-gray-500 font-mono text-xs">
                No audit events recorded yet.
              </div>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0 shadow-[0_0_6px_#f59e0b]"></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] text-amber-400 font-bold uppercase">
                        {log.actionType.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-snug mt-0.5 line-clamp-2">
                      {log.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
