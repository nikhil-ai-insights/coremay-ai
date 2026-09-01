import React, { useState } from 'react';
import { 
  Sparkles, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  LayoutDashboard, 
  Store, 
  Package, 
  LogOut, 
  ShieldCheck, 
  Bot, 
  BarChart3,
  ListOrdered
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { user, profile, role, logout, switchDemoRole } = useAuth();
  const { totalItemsCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0D0D0D]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <button 
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.25)] group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white font-['Space_Grotesk']">
                  COREMAY<span className="text-amber-500">.ai</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                  AI Commerce
                </span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block">Autonomous Revenue Engine</p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => handleNav('/')}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                currentPath === '/' ? 'text-amber-500 bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('/#features')}
              className="px-3.5 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => handleNav('/#how-it-works')}
              className="px-3.5 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNav('/shop')}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentPath.startsWith('/shop') || currentPath.startsWith('/product')
                  ? 'text-amber-500 bg-amber-500/10 border border-amber-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Store className="w-4 h-4 text-amber-500" />
              Shop Experience
            </button>
            <button
              onClick={() => handleNav('/merchant/dashboard')}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentPath.startsWith('/merchant')
                  ? 'text-amber-500 bg-amber-500/10 border border-amber-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Merchant Hub
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Role Switcher Pill */}
            <div className="hidden md:flex items-center bg-[#161616] border border-white/10 p-0.5 rounded-xl text-xs">
              <button
                onClick={() => switchDemoRole('customer')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  role === 'customer'
                    ? 'bg-amber-500 text-black font-semibold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Switch to Customer Mode"
              >
                Shopper
              </button>
              <button
                onClick={() => switchDemoRole('merchant')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  role === 'merchant'
                    ? 'bg-amber-500 text-black font-semibold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Switch to Merchant Mode"
              >
                Merchant
              </button>
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => handleNav('/cart')}
              className="relative p-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 border border-white/10 transition-colors cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-black font-bold text-xs flex items-center justify-center shadow-lg animate-pulse">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* User Dropdown / Auth CTA */}
            {profile ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#161616] border border-white/10 hover:border-amber-500/40 text-gray-200 hover:text-white transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-black text-xs font-bold flex items-center justify-center">
                    {profile.name ? profile.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline-block max-w-[110px] truncate">
                    {profile.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-amber-400 capitalize font-mono">
                    {role}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-xl bg-[#161616] border border-white/15 shadow-2xl p-2 z-50 text-sm">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="font-semibold text-white truncate">{profile.name}</p>
                      <p className="text-xs text-gray-400 truncate">{profile.email}</p>
                    </div>

                    <button
                      onClick={() => handleNav('/shop')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 text-left cursor-pointer"
                    >
                      <Store className="w-4 h-4 text-amber-500" />
                      Browse Store
                    </button>

                    <button
                      onClick={() => handleNav('/customer/orders')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 text-left cursor-pointer"
                    >
                      <ListOrdered className="w-4 h-4 text-amber-500" />
                      My Orders
                    </button>

                    <div className="my-1 border-t border-white/10"></div>

                    <div className="px-3 py-1 text-[11px] font-semibold uppercase text-gray-400 tracking-wider">
                      Merchant Operations
                    </div>

                    <button
                      onClick={() => handleNav('/merchant/dashboard')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 text-left cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-amber-500" />
                      Overview Dashboard
                    </button>

                    <button
                      onClick={() => handleNav('/merchant/products')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 text-left cursor-pointer"
                    >
                      <Package className="w-4 h-4 text-amber-500" />
                      Product Inventory
                    </button>

                    <button
                      onClick={() => handleNav('/merchant/analytics')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 text-left cursor-pointer"
                    >
                      <BarChart3 className="w-4 h-4 text-amber-500" />
                      AI Analytics & ROI
                    </button>

                    <button
                      onClick={() => handleNav('/merchant/audit-logs')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 text-left cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-500" />
                      Audit Trail System
                    </button>

                    <div className="my-1 border-t border-white/10"></div>

                    <button
                      onClick={async () => {
                        await logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('/login')}
                  className="px-3.5 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNav('/signup')}
                  className="px-4 py-2 text-sm font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 border border-white/10 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A0A0A]/95 border-b border-white/10 px-4 pt-2 pb-6 space-y-2 backdrop-blur-xl">
          <div className="flex items-center justify-between py-2 border-b border-white/10 mb-2">
            <span className="text-xs font-semibold uppercase text-gray-400">Mode Switcher:</span>
            <div className="flex items-center bg-[#161616] border border-white/10 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => switchDemoRole('customer')}
                className={`px-3 py-1 rounded font-medium ${
                  role === 'customer' ? 'bg-amber-500 text-black font-bold' : 'text-gray-400'
                }`}
              >
                Shopper
              </button>
              <button
                onClick={() => switchDemoRole('merchant')}
                className={`px-3 py-1 rounded font-medium ${
                  role === 'merchant' ? 'bg-amber-500 text-black font-bold' : 'text-gray-400'
                }`}
              >
                Merchant
              </button>
            </div>
          </div>

          <button
            onClick={() => handleNav('/')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-200 hover:bg-white/5"
          >
            Home
          </button>
          <button
            onClick={() => handleNav('/shop')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-amber-500 bg-amber-500/10 flex items-center justify-between"
          >
            <span>Customer Shopping Experience</span>
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleNav('/cart')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-200 hover:bg-white/5 flex items-center justify-between"
          >
            <span>Cart ({totalItemsCount})</span>
            <ShoppingCart className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={() => handleNav('/customer/orders')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-200 hover:bg-white/5"
          >
            My Orders
          </button>

          <div className="pt-2 border-t border-white/10">
            <p className="px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Merchant Tools</p>
            <button
              onClick={() => handleNav('/merchant/dashboard')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-white/5"
            >
              Overview Dashboard
            </button>
            <button
              onClick={() => handleNav('/merchant/products')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-white/5"
            >
              Product Inventory
            </button>
            <button
              onClick={() => handleNav('/merchant/orders')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-white/5"
            >
              Order Management
            </button>
            <button
              onClick={() => handleNav('/merchant/analytics')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-white/5"
            >
              AI Performance Analytics
            </button>
            <button
              onClick={() => handleNav('/merchant/audit-logs')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-white/5"
            >
              Audit Trail System
            </button>
          </div>

          {!user && (
            <div className="pt-4 border-t border-white/10 flex gap-2">
              <button
                onClick={() => handleNav('/login')}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-center font-medium text-sm text-white hover:bg-white/5"
              >
                Login
              </button>
              <button
                onClick={() => handleNav('/signup')}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-center text-sm hover:bg-amber-400"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
