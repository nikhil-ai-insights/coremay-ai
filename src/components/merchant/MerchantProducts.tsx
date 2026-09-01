import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Check, 
  X, 
  Package, 
  Star, 
  DollarSign, 
  Layers,
  Wand2,
  Loader2
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { Product } from '../../types';
import { CATEGORIES } from '../../data/demoProducts';
import { useToast } from '../ui/Toast';

export const MerchantProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'Electronics',
    price: 9999,
    discountPrice: 7999,
    stock: 25,
    description: '',
    features: ['High durability chassis', 'Express charging support', '1-Year Warranty'],
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    tags: ['new', 'featured'],
    badge: 'Popular',
    rating: 4.8
  });

  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Electronics',
      price: 4999,
      discountPrice: 3999,
      stock: 20,
      description: '',
      features: ['Premium aluminum casing', 'Smart connectivity', '1-Year Brand Warranty'],
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
      tags: ['gadgets', 'bestseller'],
      badge: 'New Arrival',
      rating: 4.8
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIsModalOpen(true);
  };

  // AI Description & Feature Highlights Generator using backend API
  const handleGenerateAiDescription = async () => {
    if (!formData.name) {
      showToast('Please enter a product name first to generate AI copy', 'error');
      return;
    }

    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          price: formData.discountPrice || formData.price
        })
      });

      const data = await res.json();
      if (res.ok && data.description) {
        setFormData((prev) => ({
          ...prev,
          description: data.description,
          features: data.features && data.features.length > 0 ? data.features : prev.features
        }));
        showToast('Generated compelling product copy with Gemini AI!', 'success', 'AI Copy Ready');
      } else {
        throw new Error(data.error || 'Failed to generate copy');
      }
    } catch (e: any) {
      // Fallback generation
      setFormData((prev) => ({
        ...prev,
        description: `Experience ultimate performance and modern refinement with ${prev.name}. Engineered for discerning users who value reliability, exceptional battery endurance, and seamless day-to-day productivity.`,
        features: [
          'Precision tuned acoustic / hardware performance',
          'Next-generation power efficiency & rapid charging',
          'Industrial grade scratch-resistant finish'
        ]
      }));
      showToast('Applied AI copy template.', 'info');
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    if (editingProduct) {
      await updateProduct(editingProduct.id, formData);
      showToast(`Updated product "${formData.name}"`, 'success');
    } else {
      await addProduct({
        name: formData.name || 'New Product',
        category: formData.category || 'Electronics',
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        stock: Number(formData.stock || 10),
        description: formData.description || 'Premium store catalog item.',
        features: formData.features || ['Premium standard build'],
        image: formData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        tags: formData.tags || ['featured'],
        badge: formData.badge,
        rating: formData.rating || 4.8,
        reviewsCount: 36
      });
      showToast(`Created product "${formData.name}"`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}" from the store catalog?`)) {
      await deleteProduct(productId);
      showToast(`Deleted "${productName}" from store.`, 'info');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161616] p-6 rounded-2xl border border-white/5">
        <div>
          <div className="flex items-center gap-2 text-gray-500 text-xs font-mono uppercase tracking-widest mb-1">
            <Package className="w-3.5 h-3.5 text-amber-500" />
            Inventory Control
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
            Product Management
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Create, update, and manage pricing, stock levels, and AI-generated product descriptions.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#161616] border border-white/5">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by name or description..."
            className="w-full pl-10 pr-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-black font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-[#161616] border border-white/5 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#0F0F0F] text-gray-500 uppercase text-[10px] font-mono border-b border-white/5">
                <th className="py-4 px-6 font-semibold">Product</th>
                <th className="py-4 px-4 font-semibold">Category</th>
                <th className="py-4 px-4 font-semibold">Price</th>
                <th className="py-4 px-4 font-semibold">Stock</th>
                <th className="py-4 px-4 font-semibold">Rating</th>
                <th className="py-4 px-6 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-400 font-mono text-xs">
                    <Package className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    No products found. Click "Add New Product" above to add products to your store catalog.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const effectivePrice = product.discountPrice || product.price;

                  return (
                    <tr key={product.id} className="hover:bg-white/5 transition-colors">
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover bg-black shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-white text-xs sm:text-sm truncate">{product.name}</p>
                            <p className="text-[11px] text-gray-400 line-clamp-1">{product.description}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-amber-400 font-mono">
                          {product.category}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-white font-['Space_Grotesk']">
                            ₹{effectivePrice.toLocaleString('en-IN')}
                          </span>
                          {product.discountPrice && (
                            <span className="text-[11px] text-gray-500 line-through">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`font-mono text-xs font-semibold ${product.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {product.stock} in stock
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="flex items-center gap-1 text-amber-400 font-bold font-mono text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {product.rating}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-amber-500/20 text-gray-400 hover:text-amber-400 transition-colors cursor-pointer"
                            title="Edit product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full rounded-2xl bg-[#161616] border border-white/10 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 bg-[#0F0F0F] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-black font-bold">
                  <Package className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-lg font-['Space_Grotesk']">
                  {editingProduct ? 'Edit Product Details' : 'Add New Product to Store'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Scroll Area */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 text-sm bg-[#161616]">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-semibold">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500/60"
                    placeholder="e.g. Apex Ultra ANC Headphones"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-semibold">Category *</label>
                  <select
                    value={formData.category || 'Electronics'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500/60"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Stock Row */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-semibold">Original Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-semibold">Sale Price (₹)</label>
                  <input
                    type="number"
                    value={formData.discountPrice || ''}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-semibold">Inventory Stock *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock || 0}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold">Image URL</label>
                <input
                  type="url"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs"
                />
              </div>

              {/* AI Description Field with Magic Button */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs text-gray-400 font-semibold">Product Description</label>
                  <button
                    type="button"
                    onClick={handleGenerateAiDescription}
                    disabled={isAiGenerating}
                    className="px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isAiGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                    <span>Generate Copy with Gemini AI</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed specs and customer sales copy..."
                  className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl p-3 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500/60"
                />
              </div>

              {/* Features (Comma-separated) */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-semibold">Features (One per line)</label>
                <textarea
                  rows={2}
                  value={formData.features?.join('\n') || ''}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value.split('\n').filter(Boolean) })}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl p-3 text-white text-xs font-mono"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-500/20"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
