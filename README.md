# 🚀 Coremay AI

### AI-Powered Commerce Platform for Smarter Shopping and Merchant Growth

Coremay AI is an intelligent commerce platform designed to transform the online shopping experience through Artificial Intelligence. It helps customers discover products through natural conversations while enabling merchants to increase revenue using personalized recommendations, intelligent upselling, cross-selling, and AI-powered insights.

---

## 🌟 Overview

Online customers often struggle to find the right products, while merchants face challenges in providing personalized shopping experiences and increasing conversions.

**Coremay AI solves this problem by introducing an intelligent AI-powered commerce assistant.**

The platform allows customers to interact naturally with an AI assistant, discover relevant products, receive personalized recommendations, and make informed purchasing decisions.

At the same time, merchants can manage their products, monitor orders, analyze business performance, and track AI-driven activities through a powerful dashboard.

---

## ✨ Key Features

### 🤖 AI Shopping Assistant

Coremay AI includes an intelligent conversational shopping assistant that helps customers:

- 🔍 Find relevant products
- 💬 Ask product-related questions
- 📊 Compare products
- 💡 Receive personalized recommendations
- 💰 Find products within their budget
- 🔄 Discover alternative products
- 🛍️ Get intelligent shopping suggestions

**Example**

> **User:** I need wireless headphones under ₹2,000.

The AI assistant analyzes the available product catalog and recommends relevant products based on the user's requirements.

---

### 🛒 Smart Product Discovery

Customers can explore products through:

- Product categories
- Search functionality
- AI-powered recommendations
- Personalized suggestions
- Budget-based product discovery

The AI assistant only recommends products available in the platform's catalog.

---

### 📈 Intelligent Upselling

Coremay AI analyzes customer preferences and shopping carts to suggest relevant premium or complementary products.

**Example**

```text
Customer adds → Laptop

Coremay AI suggests:
→ Wireless Mouse
→ Laptop Bag
→ USB Hub
```

The system helps merchants increase their Average Order Value (AOV) while maintaining a relevant and personalized customer experience.

---

### 🔗 Smart Cross-Selling

The platform recommends complementary products based on customer behavior and selected products.

```text
Smartphone
    ↓
Recommended Products
    ├── Phone Case
    ├── Screen Protector
    └── Wireless Earbuds
```

All recommendations require explicit customer approval before being added to the cart.

---

### 💳 Secure AI-Assisted Checkout

Coremay AI follows a transparent and controlled payment process.

The AI assistant can help guide customers through checkout, but it cannot independently charge a customer.

**Payment Flow**

```text
Customer
    ↓
Product Selection
    ↓
Shopping Cart
    ↓
AI Recommendations
    ↓
Order Review
    ↓
Customer Confirmation
    ↓
Razorpay Payment
    ↓
Payment Verification
    ↓
Order Confirmation
```

Every payment action requires explicit confirmation from the customer.

---

### 🔐 Authentication & User Management

Coremay AI uses Firebase Authentication to provide secure user management.

**Supported Authentication Methods**

- 📧 Email and Password Signup
- 🔑 Email and Password Login
- 🌐 Google Sign-In
- 🔄 Password Reset
- 🚪 Secure Logout

The application supports two primary user roles:

**🛍️ Customer**

Customers can:

- Browse products
- Interact with the AI assistant
- Add products to their cart
- Receive AI recommendations
- Place orders
- View their order history

**🏪 Merchant**

Merchants can:

- Manage products
- Add new products
- Update product information
- Monitor orders
- Track revenue
- Analyze customer activity
- Monitor AI performance
- View audit logs

---

### 🔒 User-Specific Data Isolation

Coremay AI implements user-specific data management using Firebase Authentication UID.

Each authenticated user can access only their own data.

**User-Specific Data Includes**

- 👤 User Profile
- 🛒 Shopping Cart
- 📦 Orders
- 💬 AI Conversations
- 💡 AI Recommendations
- 🔍 Search History
- 📊 Analytics
- 📋 Audit Logs

**Data Isolation Flow**

```text
User Signup/Login
        ↓
Firebase Authentication
        ↓
Unique Firebase UID
        ↓
Load Only User-Specific Data
        ↓
Secure Firestore Queries
```

When a new user creates an account, the platform starts with a clean data state instead of displaying another user's information.

---

### 📊 Merchant Dashboard

The merchant dashboard provides important insights into business performance.

**Dashboard Metrics**

- 💰 Total Revenue
- 📦 Total Orders
- 👥 Total Customers
- 🤖 AI Conversations
- 💡 AI Recommendations
- 📈 AI-Assisted Sales
- 💵 Upsell Revenue
- 📊 Conversion Rate

The dashboard is designed to help merchants understand how AI interactions contribute to business growth.

---

### 📦 Product Management

Merchants can manage their products directly from the platform.

**Features**

- ➕ Add Products
- ✏️ Edit Products
- 🗑️ Delete Products
- 📦 Manage Stock
- 💰 Update Prices
- 🏷️ Add Discounts
- 🖼️ Manage Product Images

Each merchant's products are associated with their unique account.

---

### 📈 AI Performance Analytics

Coremay AI tracks the performance of AI-powered commerce interactions.

**Analytics Include**

- Total AI Conversations
- Products Recommended
- Accepted Recommendations
- Rejected Recommendations
- AI-Assisted Sales
- AI-Generated Revenue
- Upsell Revenue
- Cross-Sell Revenue
- Recommendation Conversion Rate

These insights help merchants understand the impact of AI on their business.

---

### 📋 Audit Trail System

Transparency is a core part of Coremay AI.

Every important commerce and AI interaction can be recorded in the audit trail.

**Example Audit Flow**

```text
Customer searched:
"Best headphones under ₹2,000"

        ↓

AI Action:
Recommended Product A and Product B

        ↓

Customer Action:
Added Product A to Cart

        ↓

AI Action:
Suggested Product C

        ↓

Customer Action:
Accepted Recommendation

        ↓

Customer:
Confirmed Payment

        ↓

Payment:
Successful
```

**Audit Log Data**

```json
{
  "userId": "user_uid",
  "actionType": "product_recommendation",
  "description": "AI recommended products based on customer budget.",
  "relatedProductId": "product_id",
  "relatedOrderId": "order_id",
  "timestamp": "timestamp",
  "metadata": {}
}
```

---

## 🏗️ Technology Stack

| Technology | Purpose |
|---|---|
| ⚛️ React | Frontend Development |
| 🟦 TypeScript | Type-Safe Development |
| 🎨 Tailwind CSS | UI Design and Styling |
| 🔥 Firebase Authentication | User Authentication |
| 🗄️ Firebase Firestore | Database |
| 🤖 Google Gemini AI | AI Shopping Assistant |
| 💳 Razorpay | Payment Processing |
| 📊 Chart Libraries | Business Analytics |
| ☁️ Firebase Hosting | Application Deployment |

---

## 🗂️ Project Architecture

```text
Coremay AI
│
├── 🎨 Frontend
│   ├── Landing Page
│   ├── Authentication
│   ├── Shopping Experience
│   ├── AI Assistant
│   ├── Shopping Cart
│   └── Merchant Dashboard
│
├── 🤖 AI Layer
│   ├── Gemini AI
│   ├── Product Recommendations
│   ├── Upselling
│   └── Cross-Selling
│
├── 🔥 Firebase
│   ├── Authentication
│   ├── Firestore
│   └── User Management
│
└── 💳 Payments
    └── Razorpay Test Mode
```

---

## 🗄️ Database Structure

Coremay AI uses Firebase Firestore for data management.

```text
Firestore Database

├── users
│   └── {userId}
│
├── products
│   └── {productId}
│
├── carts
│   └── {userId}
│
├── orders
│   └── {orderId}
│
├── conversations
│   └── {conversationId}
│
├── aiRecommendations
│   └── {recommendationId}
│
├── auditLogs
│   └── {auditId}
│
└── merchantAnalytics
    └── {analyticsId}
```

---

## 🔄 Application Workflow

```text
                    ┌─────────────────┐
                    │      User       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Firebase Auth   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Role Detection  │
                    └────────┬────────┘
                             │
               ┌─────────────┴─────────────┐
               ▼                           ▼
      ┌─────────────────┐         ┌─────────────────┐
      │    Customer     │         │    Merchant     │
      │     Portal      │         │    Dashboard    │
      └────────┬────────┘         └────────┬────────┘
               │                           │
               ▼                           ▼
      ┌─────────────────┐         ┌─────────────────┐
      │ AI Shopping     │         │ Business        │
      │ Assistant       │         │ Analytics       │
      └────────┬────────┘         └─────────────────┘
               │
               ▼
      ┌─────────────────┐
      │ Product Catalog │
      └────────┬────────┘
               │
               ▼
      ┌─────────────────┐
      │ Shopping Cart   │
      └────────┬────────┘
               │
               ▼
      ┌─────────────────┐
      │ AI Suggestions  │
      └────────┬────────┘
               │
               ▼
      ┌─────────────────┐
      │ Customer Review │
      └────────┬────────┘
               │
               ▼
      ┌─────────────────┐
      │ Razorpay        │
      │ Payment         │
      └─────────────────┘
```

---

## 🚀 Getting Started

Follow the steps below to run the project locally.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/coremay-ai-commerce.git
```

Navigate to the project directory:

```bash
cd coremay-ai-commerce
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory.

Add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Add your Gemini API key:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

Add your Razorpay Test Mode credentials:

```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

> ⚠️ Never upload secret keys or sensitive credentials to GitHub.

### 4️⃣ Configure Firebase

Create a Firebase project and enable:

- Firebase Authentication
  - Email/Password Authentication
  - Google Sign-In
- Cloud Firestore

Create appropriate Firestore security rules to ensure users can access only their own data.

### 5️⃣ Start the Development Server

```bash
npm run dev
```

The application will start on a local development server.

---

## 🔐 Security Principles

Coremay AI follows important security principles:

- 🔒 Firebase Authentication for user verification
- 👤 User-specific data access
- 🛡️ Role-based authorization
- 🚫 No access to other users' private data
- 💳 Explicit payment confirmation
- 🔑 Sensitive credentials stored in environment variables
- 📋 Important commerce actions recorded in audit logs

---

## 🎯 Core Problem Solved

Coremay AI addresses two important challenges in modern e-commerce.

**For Customers**

- ❌ Difficult product discovery
- ❌ Too many choices
- ❌ Lack of personalized recommendations

**For Merchants**

- ❌ Low conversion rates
- ❌ Limited personalization
- ❌ Missed upselling opportunities
- ❌ Lack of AI-powered insights

**Coremay AI Solution**

```text
AI Conversations
        +
Personalized Recommendations
        +
Smart Upselling
        +
Cross-Selling
        +
Business Analytics
        =
Smarter Commerce 🚀
```

---

## 🛣️ Future Roadmap

Future improvements for Coremay AI may include:

- [ ] Voice-based AI Shopping Assistant
- [ ] Multi-language support
- [ ] Advanced AI personalization
- [ ] WhatsApp commerce integration
- [ ] Automated inventory alerts
- [ ] Advanced merchant analytics
- [ ] AI-powered marketing campaigns
- [ ] Multiple payment gateways
- [ ] Mobile application
- [ ] Advanced recommendation engine

---

## 📸 Screenshots

Screenshots of the application can be added here.

```text
/screenshots
    ├── landing-page.png
    ├── ai-shopping.png
    ├── merchant-dashboard.png
    ├── product-management.png
    └── audit-logs.png
```

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

To contribute:

1. Fork the repository.
2. Create a new branch.
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes.
4. Commit your changes.
   ```bash
   git commit -m "Add your feature"
   ```
5. Push the branch.
   ```bash
   git push origin feature/your-feature-name
   ```
6. Create a Pull Request.

---

## 📄 License

This project is currently intended for educational, learning, and project demonstration purposes.

---

## 👨‍💻 Developer

Developed by **Nikhil Kumar**

<div align="center">

⭐ If you like Coremay AI, consider giving this repository a star!

🚀 **Building the Future of AI-Powered Commerce**

*Coremay AI • Conversational Commerce • Intelligent Growth*

</div>
