import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[Gemini AI] No GEMINI_API_KEY detected in environment. Using smart catalog heuristics fallback if needed.');
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// ----------------------------------------------------
// Healthcheck API
// ----------------------------------------------------
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'Coremay',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    razorpayConfigured: !!process.env.RAZORPAY_KEY_ID
  });
});

// ----------------------------------------------------
// AI Shopping Assistant Chat API
// ----------------------------------------------------
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], catalog = [], cart = [], currentProduct = null } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build catalog context for the AI
    const catalogSummary = (catalog || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.discountPrice || p.price,
      originalPrice: p.price,
      stock: p.stock,
      rating: p.rating,
      features: p.features || [],
      description: p.description,
      frequentlyBoughtWith: p.frequentlyBoughtWith || []
    }));

    const cartSummary = (cart || []).map((item: any) => ({
      id: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.discountPrice || item.product.price
    }));

    const systemPrompt = `You are "Coremay AI Assistant", an intelligent, courteous, and revenue-boosting AI e-commerce shopping concierge for the Coremay platform.

MISSION:
1. Help customers find, compare, and discover products in our real catalog.
2. Answer detailed technical and lifestyle questions about items.
3. Recommend exact matches within budgets (e.g., under ₹2000, under ₹30000, for college students, etc.).
4. Provide smart, contextual upselling or cross-selling suggestions when natural, explaining WHY complementary products add value.
5. STRICT RULE: NEVER invent fake products, models, or prices outside the catalog provided below. Always reference real catalog product IDs.

CURRENT STORE CATALOG:
${JSON.stringify(catalogSummary, null, 2)}

CURRENT CUSTOMER CART:
${JSON.stringify(cartSummary, null, 2)}

${currentProduct ? `CURRENT VIEWED PRODUCT:\n${JSON.stringify(currentProduct, null, 2)}` : ''}

RESPONSE FORMAT REQUIREMENT:
You MUST respond strictly with a valid JSON object matching this schema:
{
  "reply": "Your conversational, natural text reply to the customer (keep it engaging, concise, and helpful with markdown formatting if helpful).",
  "suggestedProductIds": ["prod_id_1", "prod_id_2"],
  "upsellSuggestion": {
    "productId": "prod_id_3",
    "reason": "Brief, compelling value explanation of why this complements their interest"
  } or null,
  "filterCategory": "Electronics" or null,
  "maxPriceFilter": 5000 or null
}

Do not include backticks, markdown code blocks (e.g. \`\`\`json), or any commentary outside the raw JSON string.`;

    const ai = getAI();
    if (ai) {
      // Build conversation context
      const chatContents: any[] = [];
      chatContents.push({ role: 'user', parts: [{ text: systemPrompt }] });
      chatContents.push({ role: 'model', parts: [{ text: '{"reply": "Understood! I am ready to guide customers using the exact Coremay catalog.", "suggestedProductIds": [], "upsellSuggestion": null}' }] });

      // Add recent history
      if (Array.isArray(history)) {
        for (const h of history.slice(-6)) {
          if (h.sender === 'user') {
            chatContents.push({ role: 'user', parts: [{ text: h.text }] });
          } else if (h.sender === 'assistant') {
            chatContents.push({ role: 'model', parts: [{ text: h.text }] });
          }
        }
      }

      chatContents.push({ role: 'user', parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: chatContents,
        config: {
          temperature: 0.3,
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '';
      try {
        const parsed = JSON.parse(responseText.trim());
        return res.json(parsed);
      } catch (parseErr) {
        console.warn('Failed to parse Gemini JSON output, attempting cleanup', parseErr);
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        return res.json(parsed);
      }
    } else {
      // Intelligent Rule-based Catalog Fallback if API Key not present in dev
      const lowerMsg = message.toLowerCase();
      let matchedProducts = catalogSummary.filter((p: any) => {
        return (
          p.name.toLowerCase().includes(lowerMsg) ||
          p.category.toLowerCase().includes(lowerMsg) ||
          p.description.toLowerCase().includes(lowerMsg) ||
          p.features.some((f: string) => f.toLowerCase().includes(lowerMsg))
        );
      });

      // Price extraction
      let priceLimit: number | null = null;
      const priceMatch = lowerMsg.match(/(?:under|below|less than|within|around)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i);
      if (priceMatch && priceMatch[1]) {
        priceLimit = parseInt(priceMatch[1], 10);
        matchedProducts = matchedProducts.filter((p: any) => p.price <= priceLimit!);
      }

      if (matchedProducts.length === 0) {
        if (priceLimit) {
          matchedProducts = catalogSummary.filter((p: any) => p.price <= priceLimit!).slice(0, 3);
        } else {
          matchedProducts = catalogSummary.slice(0, 3);
        }
      }

      const suggestedIds = matchedProducts.slice(0, 3).map((p: any) => p.id);
      let upsell = null;
      if (suggestedIds.length > 0) {
        const firstProd = catalogSummary.find((p: any) => p.id === suggestedIds[0]);
        if (firstProd && firstProd.frequentlyBoughtWith && firstProd.frequentlyBoughtWith.length > 0) {
          const upsellId = firstProd.frequentlyBoughtWith[0];
          const upsellProd = catalogSummary.find((p: any) => p.id === upsellId);
          if (upsellProd) {
            upsell = {
              productId: upsellProd.id,
              reason: `Pairs perfectly with the ${firstProd.name} for optimal performance and protection.`
            };
          }
        }
      }

      return res.json({
        reply: `Here are the best matching recommendations from our store based on your request "${message}". Each item includes our verified quality guarantee and fast delivery.`,
        suggestedProductIds: suggestedIds,
        upsellSuggestion: upsell,
        filterCategory: null,
        maxPriceFilter: priceLimit
      });
    }
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    res.status(500).json({
      error: 'Failed to process AI shopping query',
      details: error.message || String(error)
    });
  }
});

// ----------------------------------------------------
// AI Cart Smart Recommendations & Upselling API
// ----------------------------------------------------
app.post('/api/ai/recommendations', async (req: Request, res: Response) => {
  try {
    const { cartItems = [], currentProductId = null, catalog = [] } = req.body;

    const catalogSummary = (catalog || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.discountPrice || p.price,
      features: p.features || [],
      frequentlyBoughtWith: p.frequentlyBoughtWith || []
    }));

    const ai = getAI();
    if (ai && (cartItems.length > 0 || currentProductId)) {
      const prompt = `Analyze this shopping cart / product context and select the top 2-3 most relevant, high-converting complementary cross-sell or upsell products strictly from this catalog:

CATALOG:
${JSON.stringify(catalogSummary, null, 2)}

CURRENT CART ITEMS:
${JSON.stringify(cartItems, null, 2)}

CURRENT PRODUCT ID:
${currentProductId || 'None'}

Return ONLY a valid JSON array of objects:
[
  {
    "productId": "prod_id",
    "reason": "1 concise sentence explaining why this specific accessory/complement increases value for the customer"
  }
]`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      });

      const responseText = (response.text || '[]').trim();
      const parsed = JSON.parse(responseText);
      return res.json({ recommendations: parsed });
    }

    // Fallback recommendation logic using catalog relations
    const targetProductIds: string[] = [];
    if (currentProductId) {
      targetProductIds.push(currentProductId);
    }
    for (const item of cartItems) {
      if (item.product?.id && !targetProductIds.includes(item.product.id)) {
        targetProductIds.push(item.product.id);
      }
    }

    const recs: { productId: string; reason: string }[] = [];
    for (const pid of targetProductIds) {
      const p = catalogSummary.find((item: any) => item.id === pid);
      if (p && p.frequentlyBoughtWith) {
        for (const complementId of p.frequentlyBoughtWith) {
          if (!targetProductIds.includes(complementId) && !recs.some(r => r.productId === complementId)) {
            const compProd = catalogSummary.find((item: any) => item.id === complementId);
            if (compProd) {
              recs.push({
                productId: compProd.id,
                reason: `Popular companion item frequently paired with ${p.name}.`
              });
            }
          }
        }
      }
    }

    // If still empty, suggest top accessories
    if (recs.length === 0) {
      const accessories = catalogSummary.filter((p: any) => p.category === 'Accessories').slice(0, 2);
      for (const acc of accessories) {
        recs.push({
          productId: acc.id,
          reason: 'Trending accessory to upgrade your setup.'
        });
      }
    }

    return res.json({ recommendations: recs.slice(0, 3) });
  } catch (error: any) {
    console.error('Error in /api/ai/recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// ----------------------------------------------------
// Razorpay Test Mode Order Creation API
// ----------------------------------------------------
app.post('/api/razorpay/create-order', async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid order amount' });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_growthpilot_demo';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'secret_growthpilot_demo';
    const isCustomKeysProvided = !!process.env.RAZORPAY_KEY_ID;

    // Create a deterministic / standard Razorpay Test Order ID
    const randomSuffix = Math.random().toString(36).substring(2, 9).toUpperCase();
    const razorpayOrderId = `order_${Date.now()}_${randomSuffix}`;

    return res.json({
      success: true,
      orderId: razorpayOrderId,
      amount: Math.round(amount * 100), // in paise (e.g. 199900 for ₹1999)
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      keyId,
      isTestMode: true,
      isCustomKeysProvided,
      notes: notes || {}
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});

// ----------------------------------------------------
// Razorpay Payment Verification API
// ----------------------------------------------------
app.post('/api/razorpay/verify-payment', async (req: Request, res: Response) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, simulateFailure } = req.body;

    if (simulateFailure) {
      return res.status(400).json({
        success: false,
        status: 'Failed',
        message: 'Payment simulation was declined by user or issuing bank.'
      });
    }

    // Generate verified payment ID if simulated
    const paymentId = razorpayPaymentId || `pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    return res.json({
      success: true,
      status: 'Successful',
      paymentId,
      orderId: razorpayOrderId,
      verifiedAt: new Date().toISOString(),
      method: 'Razorpay Test Gateway (UPI / Card / NetBanking)'
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// ----------------------------------------------------
// Vite Middleware setup for Dev & Production
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Coremay] Server successfully running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
