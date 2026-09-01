import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShoppingCart, 
  ArrowRight, 
  Check, 
  TrendingUp, 
  RotateCcw, 
  Flame,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Product, ChatMessage } from '../../types';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { logAuditEvent } from '../../services/auditLogger';
import { useToast } from '../ui/Toast';

interface GrowthPilotAssistantProps {
  currentProduct?: Product | null;
  onSelectProduct?: (productId: string) => void;
  compact?: boolean;
}

const SAMPLE_PROMPTS = [
  "Headphones with ANC under ₹5000",
  "Best creator laptop with OLED screen",
  "Smartphone with 108MP camera under ₹30000",
  "Smartwatch with ECG and long battery",
  "Best accessories for my laptop desk setup"
];

export const GrowthPilotAssistant: React.FC<GrowthPilotAssistantProps> = ({ 
  currentProduct = null, 
  onSelectProduct,
  compact = false 
}) => {
  const { products } = useProducts();
  const { cart, addToCart } = useCart();
  const { profile } = useAuth();
  const { showToast } = useToast();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_msg',
      sender: 'assistant',
      text: "👋 Hi! I'm **Coremay AI Assistant**, your AI shopping concierge. I can match products to your exact budget, compare specs, find complementary accessories, or suggest the highest-value items in our verified store catalog. What are you looking for today?",
      timestamp: new Date().toISOString()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // When current product changes, offer contextual prompt
  useEffect(() => {
    if (currentProduct) {
      const promptText = `Looking at **${currentProduct.name}** (₹${currentProduct.discountPrice || currentProduct.price}). Would you like to see verified complementary accessories or compare alternatives?`;
      // Check if not already added
      const lastMsg = messages[messages.length - 1];
      if (!lastMsg || !lastMsg.text.includes(currentProduct.name)) {
        setMessages((prev) => [
          ...prev,
          {
            id: `context_${Date.now()}`,
            sender: 'assistant',
            text: promptText,
            timestamp: new Date().toISOString()
          }
        ]);
      }
    }
  }, [currentProduct?.id]);

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || loading) return;

    setInput('');

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    // Audit log customer search
    await logAuditEvent({
      userId: profile?.uid || 'guest_shopper',
      userEmail: profile?.email,
      userName: profile?.name,
      actionType: 'CUSTOMER_SEARCH',
      description: `Customer asked AI Assistant: "${queryText}"`,
      metadata: { query: queryText }
    });

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          history: messages.slice(-5),
          catalog: products,
          cart,
          currentProduct
        })
      });

      if (!res.ok) {
        throw new Error('AI service error');
      }

      const data = await res.json();
      
      // Match suggested product IDs to catalog
      const matchedProducts: Product[] = [];
      if (Array.isArray(data.suggestedProductIds)) {
        for (const pid of data.suggestedProductIds) {
          const found = products.find((p) => p.id === pid);
          if (found) matchedProducts.push(found);
        }
      }

      let upsellObj: { product: Product; reason: string } | undefined = undefined;
      if (data.upsellSuggestion && data.upsellSuggestion.productId) {
        const upsellFound = products.find((p) => p.id === data.upsellSuggestion.productId);
        if (upsellFound) {
          upsellObj = {
            product: upsellFound,
            reason: data.upsellSuggestion.reason || 'Pairs exceptionally well with your selection.'
          };
        }
      }

      const assistantReply: ChatMessage = {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "Here are the top matches from our verified product catalog:",
        timestamp: new Date().toISOString(),
        suggestedProducts: matchedProducts.length > 0 ? matchedProducts : undefined,
        upsellProduct: upsellObj
      };

      setMessages((prev) => [...prev, assistantReply]);

      if (matchedProducts.length > 0) {
        await logAuditEvent({
          userId: profile?.uid || 'guest_shopper',
          userEmail: profile?.email,
          userName: profile?.name,
          actionType: 'AI_RECOMMENDATION',
          description: `AI recommended ${matchedProducts.length} items: ${matchedProducts.map(p => p.name).join(', ')}`,
          metadata: { productIds: matchedProducts.map(p => p.id) }
        });
      }
    } catch (err: any) {
      console.warn('AI Assistant error, fallback:', err);
      // Fallback matching
      const lower = queryText.toLowerCase();
      const matched = products.filter(p => 
        p.name.toLowerCase().includes(lower) || 
        p.category.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
      ).slice(0, 3);

      setMessages((prev) => [
        ...prev,
        {
          id: `fallback_${Date.now()}`,
          sender: 'assistant',
          text: matched.length > 0 
            ? `I discovered ${matched.length} great option${matched.length > 1 ? 's' : ''} in our catalog matching your inquiry:`
            : `Here are our best-selling featured products right now:`,
          timestamp: new Date().toISOString(),
          suggestedProducts: matched.length > 0 ? matched : products.slice(0, 2)
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product, reason?: string) => {
    addToCart(product, 1, { viaAI: true, reason: reason || 'Added via Coremay AI Assistant' });
    showToast(`Added "${product.name}" to cart!`, 'success', 'Cart Updated');
  };

  return (
    <div className={`flex flex-col rounded-2xl bg-[#1A1A1A] border border-amber-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl overflow-hidden ${
      compact ? 'h-[520px]' : 'h-[620px] lg:h-[720px]'
    }`}>
      
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 border-b border-amber-500/30 flex items-center justify-between text-black">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5 text-amber-400 stroke-[2.5]" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-white border-2 border-black rounded-full animate-pulse"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-black text-sm font-['Space_Grotesk'] tracking-tight">Coremay AI Assistant</h3>
              <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-black text-amber-400 rounded uppercase font-mono tracking-widest">
                Gemini 2.5
              </span>
            </div>
            <p className="text-[11px] text-black/80 font-medium">Conversational Commerce & Cross-Sell Concierge</p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'welcome_reset',
                sender: 'assistant',
                text: "Chat cleared! How can I assist with your shopping today?",
                timestamp: new Date().toISOString()
              }
            ]);
          }}
          className="p-1.5 text-black/70 hover:text-black rounded-lg hover:bg-black/10 transition-colors cursor-pointer"
          title="Clear chat"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm bg-[#0F0F0F] scrollbar-thin scrollbar-thumb-white/10">
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAssistant ? 'items-start' : 'items-end justify-end'}`}
            >
              {isAssistant && (
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] space-y-3 ${isAssistant ? '' : 'text-right'}`}>
                
                {/* Text Bubble */}
                <div
                  className={`inline-block p-3.5 rounded-2xl text-left leading-relaxed ${
                    isAssistant
                      ? 'bg-[#161616] text-gray-200 border border-white/10 rounded-tl-sm'
                      : 'bg-amber-500 text-black font-semibold rounded-tr-sm shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* Suggested Product Cards */}
                {isAssistant && msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <p className="text-xs font-semibold uppercase text-amber-400 tracking-wider flex items-center gap-1.5 font-mono">
                      <Sparkles className="w-3.5 h-3.5" />
                      Recommended Catalog Matches:
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.suggestedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="p-2.5 rounded-xl bg-[#161616] border border-white/10 hover:border-amber-500/40 transition-all flex items-center gap-3 group"
                        >
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-14 h-14 rounded-lg object-cover bg-black shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-white text-xs truncate group-hover:text-amber-400 transition-colors">
                              {prod.name}
                            </h5>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-bold text-amber-400 text-sm font-['Space_Grotesk']">
                                ₹{(prod.discountPrice || prod.price).toLocaleString('en-IN')}
                              </span>
                              {prod.discountPrice && (
                                <span className="text-xs line-through text-gray-500">
                                  ₹{prod.price.toLocaleString('en-IN')}
                                </span>
                              )}
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 font-mono">
                                ★ {prod.rating}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-400 truncate mt-0.5">
                              {prod.features[0] || prod.category}
                            </p>
                          </div>

                          <div className="flex flex-col gap-1 shrink-0">
                            {onSelectProduct && (
                              <button
                                onClick={() => onSelectProduct(prod.id)}
                                className="px-2 py-1 text-[11px] font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                              >
                                View
                              </button>
                            )}
                            <button
                              onClick={() => handleAddToCart(prod, 'AI Recommendation')}
                              className="px-3 py-1.5 text-[11px] font-bold bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                            >
                              <Plus className="w-3 h-3" /> Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Smart Upsell Box */}
                {isAssistant && msg.upsellProduct && (
                  <div className="p-3 rounded-xl bg-[#161616] border border-amber-500/30 text-left space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase font-mono tracking-widest">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                      Smart Upsell Recommendation
                    </div>
                    <div className="flex items-center gap-3">
                      <img
                        src={msg.upsellProduct.product.image}
                        alt={msg.upsellProduct.product.name}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs text-white truncate">
                          {msg.upsellProduct.product.name}
                        </p>
                        <p className="text-xs text-gray-300 leading-snug mt-0.5">
                          {msg.upsellProduct.reason}
                        </p>
                        <p className="text-xs font-bold text-amber-400 mt-1 font-['Space_Grotesk']">
                          ₹{(msg.upsellProduct.product.discountPrice || msg.upsellProduct.product.price).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddToCart(msg.upsellProduct!.product, msg.upsellProduct!.reason)}
                      className="w-full py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add Recommended Accessory to Cart
                    </button>
                  </div>
                )}

              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-3 items-center text-gray-400 text-xs font-mono">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-[#161616] border border-white/10 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse delay-75"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse delay-150"></span>
              <span className="text-gray-300 ml-1">Analyzing store catalog with Gemini...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Query Chips */}
      <div className="px-4 py-2 bg-[#0A0A0A] border-t border-white/5 overflow-x-auto scrollbar-none flex gap-2">
        {SAMPLE_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={loading}
            className="shrink-0 text-[11px] px-3 py-1 rounded-full bg-[#161616] hover:bg-amber-500/20 text-gray-300 hover:text-amber-400 border border-white/10 hover:border-amber-500/30 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 font-mono"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-3.5 bg-[#0D0D0D] border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about products, budget, features..."
            disabled={loading}
            className="flex-1 bg-[#161616] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-black font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};

export const CoremayAssistant = GrowthPilotAssistant;
