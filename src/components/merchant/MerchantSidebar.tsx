import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  ShieldCheck, 
  Sparkles, 
  Bot, 
  ArrowLeft,
  Store,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MerchantSidebarProps {
  activeTab: 'dashboard' | 'products' | 'orders' | 'analytics' | 'audit-logs';
  onSelectTab: (tab: 'dashboard' | 'products' | 'orders' | 'analytics' | 'audit-logs') => void;
  onNavigate: (path: string) => void;
}

export const MerchantSidebar: React.FC<MerchantSidebarProps> = ({
  activeTab,
  onSelectTab,
  onNavigate
}) => {
  const { profile } = useAuth();

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Inventory', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'analytics', label: 'AI Analytics', icon: BarChart3 },
    { id: 'audit-logs', label: 'Audit Trail', icon: ShieldCheck }
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#0F0F0F] border-b lg:border-b-0 lg:border-r border-white/10 p-4 lg:p-6 flex lg:flex-col justify-between shrink-0 overflow-x-auto">
      
      <div className="space-y-6 w-full">
        {/* Merchant Badge Header */}
        <div className="hidden lg:flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Store className="w-4 h-4 text-black font-bold" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm font-['Space_Grotesk'] tracking-tight">Merchant HQ</h2>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Admin Console</span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex lg:flex-col gap-1.5 w-full">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as any)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all text-left whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white/5 text-amber-500 font-semibold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b] hidden lg:block" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Return Button */}
      <div className="hidden lg:block pt-6 border-t border-white/10 space-y-3">
        {/* User Card */}
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-black font-bold text-sm shrink-0">
            {profile?.name ? profile.name[0].toUpperCase() : 'M'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{profile?.name || 'Store Merchant'}</p>
            <p className="text-[10px] font-mono text-gray-500 truncate">Pro Merchant Tier</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('/shop')}
          className="w-full py-2.5 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-500 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Switch to Storefront</span>
        </button>
      </div>

    </aside>
  );
};
