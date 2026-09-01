# 🔐 Security

Security and user privacy are important priorities for **Coremay AI**. The platform is designed with security practices to protect user accounts, application data, and commerce-related activities.

---

## 🔑 Authentication

Coremay AI uses **Firebase Authentication** for secure user authentication.

Supported authentication methods include:

- 📧 Email and Password Authentication
- 🔐 Secure User Login
- 🌐 Google Sign-In
- 🔄 Password Reset
- 🚪 Secure Logout

Each authenticated user is identified using a unique Firebase User ID (UID).

---

## 👤 User Data Isolation

Coremay AI is designed to ensure that users can only access their own data.

User-specific data includes:

- User profiles
- Shopping carts
- Orders
- AI conversations
- Recommendations
- Activity history
- Analytics
- Audit logs

The authenticated user's Firebase UID is used to associate and retrieve data belonging to that specific user.

---

## 🛡️ Role-Based Access Control

The application supports different user roles, including:

### 🛍️ Customer

Customers can access:

- Their profile
- Their shopping cart
- Their orders
- Their AI conversations
- Their recommendations

### 🏪 Merchant

Merchants can access:

- Their products
- Their business orders
- Their analytics
- Their revenue insights
- Their AI activity
- Their audit logs

Role-based access control helps prevent unauthorized access to restricted sections of the application.

---

## 🔥 Firestore Security

Firestore security rules should be configured to enforce data ownership at the database level.

The application should not rely solely on frontend restrictions for data security.

Users should only be allowed to read or modify data that belongs to their authenticated account.

---

## 💳 Payment Security

Coremay AI follows a controlled and transparent payment workflow.

- The AI cannot independently charge a customer.
- Customers must explicitly confirm their order before payment.
- Sensitive payment information is not stored by the application.
- Payments should be processed through Razorpay's secure payment infrastructure.
- Payment actions and status updates can be recorded for auditing purposes.

For development and testing, Razorpay Test Mode should be used.

---

## 🤖 AI Safety

The AI assistant is designed to assist users with product discovery and recommendations.

The AI:

- Recommends products based on the available catalog.
- Should not invent unavailable products.
- Cannot automatically add products without user approval.
- Cannot initiate payments without explicit customer confirmation.
- Does not have unrestricted access to sensitive user information.

---

## 📋 Audit Logging

Important actions can be recorded to improve transparency and traceability.

Examples include:

- Product recommendations
- Cart modifications
- AI-generated suggestions
- Checkout confirmation
- Payment status changes
- Order creation

Audit logs help track important activities within the platform.

---

## 🔐 Environment Variables

Sensitive configuration values should never be hardcoded directly into the application source code.

Use environment variables for configuration such as:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id

VITE_GEMINI_API_KEY=your_gemini_api_key

VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

> ⚠️ Never commit secret credentials, private API keys, service account files, or payment secrets to a public GitHub repository.

---

## 🚨 Reporting Security Vulnerabilities

If you discover a security vulnerability in Coremay AI, please do not publicly disclose sensitive details.

Instead, contact the project maintainer directly with:

- A description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested mitigation, if available

Please allow sufficient time for the issue to be investigated and addressed before publicly discussing the vulnerability.

---

## ⚠️ Security Disclaimer

Coremay AI is currently an educational and project-based application. Before using the platform in a production environment, additional security testing, backend validation, secure payment verification, and infrastructure hardening should be implemented.

---

🔒 **Security is a continuous process.**

We welcome responsible security suggestions and contributions that help make Coremay AI safer for everyone.
