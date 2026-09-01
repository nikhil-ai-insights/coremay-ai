import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Star, 
  ShoppingCart, 
  Sparkles, 
  Bot, 
  Check, 
  ArrowUpDown,
  Filter,
  X,
  Tag
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { CATEGORIES } from '../../data/demoProducts';
import { Product } from '../../types';
import { GrowthPilotAssistant } from '../ai/GrowthPilotAssistant';
import { useToast } from '../ui/Toast';

interface ShopPageProps {
  onSelectProduct: (productId: string) => void;
  onNavigate: (path: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onSelectProduct, onNavigate }) => {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(75000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedProductForAi, setSelectedProductForAi] = useState<Product | null>(null);
  const [mobileAiOpen, setMobileAiOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesTags = product.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesTags) {
          return false;
        }
      }
      // Price filter
      const effectivePrice = product.discountPrice || product.price;
      if (effectivePrice > maxPrice) {
        return false;
      }
      // Stock filter
      if (inStockOnly && product.stock <= 0) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // 'featured' retains catalog order
    });
  }, [products, selectedCategory, searchQuery, maxPrice, sortBy, inStockOnly]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, 1);
    showToast(`Added "${product.name}" to cart`, 'success');
  };

  const handleAskAiAboutProduct = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    setSelectedProductForAi(product);
    setMobileAiOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 pb-20">
      
      {/* Header Banner */}
      <div className="border-b border-white/5 bg-[#0D0D0D] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-gray-500 text-xs font-mono uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              AI-Curated Real-Time Catalog
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
              Explore Store Products
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-xl">
              Browse premium electronics, accessories, and creator gear with our conversational AI assistant.
            </p>
          </div>

          {/* Quick search input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands, features..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Layout: 3 Columns (Left: Filters, Center: Product Grid, Right: AI Assistant) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Mobile Filter & AI Toggle Buttons */}
        <div className="flex lg:hidden items-center justify-between gap-3 mb-6">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#161616] border border-white/10 text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#1A1A1A]"
          >
            <Filter className="w-4 h-4 text-amber-500" />
            Filters & Sorting ({filteredProducts.length})
          </button>
          <button
            onClick={() => setMobileAiOpen(true)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Bot className="w-4 h-4 stroke-[2.5]" />
            Coremay AI
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ========================================================= */}
          {/* LEFT SIDEBAR: Filters (col-span-3) */}
          {/* ========================================================= */}
          <aside className={`lg:col-span-3 space-y-6 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
            
            {/* Category Filter */}
            <div className="p-5 rounded-2xl bg-[#161616] border border-white/5">
              <h3 className="font-bold text-white text-xs font-mono uppercase tracking-wider mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-500" />
                Categories
              </h3>
              <div className="space-y-1.5">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  const count = cat === 'All' 
                    ? products.length 
                    : products.filter((p) => p.category === cat).length;

                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-black font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                          : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                        isSelected ? 'bg-black/20 text-black font-bold' : 'bg-white/5 text-gray-400'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="p-5 rounded-2xl bg-[#161616] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                  Max Budget
                </h3>
                <span className="font-mono text-sm font-bold text-amber-500">
                  ₹{maxPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={500}
                max={75000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-amber-500 bg-[#0F0F0F] h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-500 font-mono">
                <span>₹500</span>
                <span>₹35,000</span>
                <span>₹75,000</span>
              </div>
            </div>

            {/* Availability & Sorting */}
            <div className="p-5 rounded-2xl bg-[#161616] border border-white/5 space-y-4">
              <h3 className="font-bold text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-amber-500" />
                Sort & Stock
              </h3>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-mono">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-amber-500/50 font-mono"
                >
                  <option value="featured">Featured / AI Ranked</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Customer Rating</option>
                </select>
              </div>

              <label className="flex items-center gap-3 pt-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#0F0F0F] border-white/20 accent-amber-500"
                />
                <span>In-Stock Only</span>
              </label>
            </div>

            {/* AI Guarantee Badge */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-gray-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-400 font-mono">
                <Bot className="w-4 h-4" />
                Coremay Guarantee
              </div>
              <p className="text-gray-400 leading-relaxed">
                All recommendations are dynamically computed against verified inventory with transparent pricing and live delivery SLA.
              </p>
            </div>

          </aside>

          {/* ========================================================= */}
          {/* MAIN SECTION: Product Grid (col-span-5 or col-span-6) */}
          {/* ========================================================= */}
          <main className="lg:col-span-5 xl:col-span-5 space-y-6">
            
            {/* Results bar */}
            <div className="flex items-center justify-between px-1">
              <p className="text-sm text-gray-400">
                Showing <span className="font-bold text-white">{filteredProducts.length}</span> products
                {selectedCategory !== 'All' && <span> in <span className="text-amber-500 font-semibold">{selectedCategory}</span></span>}
              </p>
              {(selectedCategory !== 'All' || searchQuery || maxPrice < 75000 || inStockOnly) && (
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                    setMaxPrice(75000);
                    setInStockOnly(false);
                  }}
                  className="text-xs text-amber-500 hover:text-amber-400 font-mono font-medium cursor-pointer"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#161616] border border-white/5 space-y-4">
                <Bot className="w-12 h-12 text-gray-600 mx-auto" />
                <h3 className="font-bold text-lg text-white">No products found</h3>
                <p className="text-sm text-gray-400 max-w-sm mx-auto">
                  Try adjusting your budget slider or searching for other keywords like "headphones", "laptop", or "charger".
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                    setMaxPrice(75000);
                  }}
                  className="px-4 py-2 bg-amber-500 text-black font-bold text-sm rounded-xl hover:bg-amber-400 cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredProducts.map((product) => {
                  const effectivePrice = product.discountPrice || product.price;
                  const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;
                  const discountPercent = hasDiscount 
                    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100) 
                    : 0;

                  return (
                    <div
                      key={product.id}
                      onClick={() => onSelectProduct(product.id)}
                      className="group rounded-2xl bg-[#161616] border border-white/5 hover:border-amber-500/40 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 cursor-pointer"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square w-full bg-[#0F0F0F] overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {product.badge && (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500 text-black shadow-md font-mono">
                              {product.badge}
                            </span>
                          )}
                          {hasDiscount && (
                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-500/90 text-white backdrop-blur-sm font-mono">
                              {discountPercent}% OFF
                            </span>
                          )}
                        </div>

                        {/* Ask AI overlay button */}
                        <button
                          onClick={(e) => handleAskAiAboutProduct(e, product)}
                          className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/80 hover:bg-amber-500 hover:text-black text-amber-500 border border-amber-500/30 backdrop-blur-md transition-all shadow-md cursor-pointer"
                          title="Ask AI Assistant about this product"
                        >
                          <Bot className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                            <span className="uppercase font-mono text-[10px] text-amber-500">
                              {product.category}
                            </span>
                            <span className="flex items-center gap-1 text-amber-400 font-medium font-mono">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                              {product.rating}
                              <span className="text-gray-500 text-[11px]">({product.reviewsCount || 48})</span>
                            </span>
                          </div>

                          <h3 className="font-bold text-white text-sm line-clamp-2 group-hover:text-amber-400 transition-colors">
                            {product.name}
                          </h3>

                          <p className="text-xs text-gray-400 line-clamp-2 mt-1.5">
                            {product.description}
                          </p>
                        </div>

                        {/* Pricing & Cart Action */}
                        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-extrabold text-lg text-white font-['Space_Grotesk']">
                                ₹{effectivePrice.toLocaleString('en-IN')}
                              </span>
                              {hasDiscount && (
                                <span className="text-xs text-gray-500 line-through font-mono">
                                  ₹{product.price.toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                            <span className={`text-[10px] font-mono ${product.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </span>
                          </div>

                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={product.stock <= 0}
                            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/10 transition-all cursor-pointer"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Add
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </main>

          {/* ========================================================= */}
          {/* RIGHT SIDEBAR: Embedded Coremay AI Assistant (col-span-4) */}
          {/* ========================================================= */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-4 sticky top-24 self-start">
            <GrowthPilotAssistant
              currentProduct={selectedProductForAi}
              onSelectProduct={onSelectProduct}
            />
          </aside>

        </div>
      </div>

      {/* Mobile AI Assistant Drawer Modal */}
      {mobileAiOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-lg bg-[#161616] rounded-t-3xl sm:rounded-2xl border border-white/15 overflow-hidden shadow-2xl">
            <div className="p-3 bg-[#0F0F0F] flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-white text-sm font-['Space_Grotesk']">Coremay AI Assistant</span>
              </div>
              <button
                onClick={() => setMobileAiOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <GrowthPilotAssistant
              currentProduct={selectedProductForAi}
              onSelectProduct={(id) => {
                setMobileAiOpen(false);
                onSelectProduct(id);
              }}
              compact
            />
          </div>
        </div>
      )}

    </div>
  );
};
