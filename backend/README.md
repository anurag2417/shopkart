# ShopKart - Backend API

Node.js + Express + MongoDB backend for ShopKart.

🌐 **Live:** https://shopkart-api-g41f.onrender.com

---

## 🚀 Quick Start

```bash
npm install
cp .env.example .env       # fill in values
npm run dev                # nodemon on :5000
```

Seed products once:

```bash
node seedProducts.js
```

---

## 📜 Scripts

| Command                | Purpose                       |
| ---------------------- | ----------------------------- |
| `npm run dev`          | Start with Nodemon            |
| `npm start`            | Start production server       |
| `node seedProducts.js` | Reset + seed 10 demo products |

---

## 📁 Structure

```
backend/
├── config/
│   ├── db.js             # Mongoose connection + DNS fallback
│   ├── env.js            # Loads dotenv FIRST (import ordering)
│   └── razorpay.js       # Lazy Razorpay factory (crashes only on use)
├── controllers/          # One per resource
├── middlewares/
│   └── auth.middleware.js
├── models/               # Mongoose schemas
├── routes/               # Express routers
├── utils/
│   └── generateToken.js
├── seedProducts.js
├── .env.example
├── index.js
└── package.json
```

---

## 🔐 Environment Variables

| Key                   | Required | Notes                                                             |
| --------------------- | :------: | ----------------------------------------------------------------- |
| `PORT`                |    –     | Defaults to `5000`; Render sets it automatically                  |
| `NODE_ENV`            |    ✅    | `development` / `production` - toggles cookie `Secure`/`SameSite` |
| `MONGO_URI`           |    ✅    | Atlas connection string (SRV or direct)                           |
| `JWT_SECRET`          |    ✅    | Long random string                                                |
| `JWT_EXPIRES_IN`      |    –     | Default `7d`                                                      |
| `CLIENT_URL`          |    ✅    | Comma-separated list of allowed origins                           |
| `RAZORPAY_KEY_ID`     |    ✅    | Test Mode key                                                     |
| `RAZORPAY_KEY_SECRET` |    ✅    | Test Mode secret (never sent to client)                           |

---

## 🗄️ Models

### Customer

```js
{
  fullName: String (required),
  email: String (required, unique, lowercase),
  password: String (required, bcrypt hash, min 6),
  phone: String (required),
  wishlist: [ObjectId ref "Product"],
  cart: [{ product: ObjectId ref "Product", quantity: Number >= 1 }],
  createdAt, updatedAt
}
```

### Product

```js
{
  name: String (required),
  description: String (required),
  price: Number (required, > 0),
  category: String (required),
  image: String (required),
  stock: Number (required, >= 0),
  createdAt, updatedAt
}
```

### Order

```js
{
  user: ObjectId ref "Customer",
  items: [{
    product: ObjectId ref "Product",
    name, price, image,     // 🔒 snapshot
    quantity
  }],
  shippingAddress: {
    fullName, phone, addressLine1, city, state, pincode
  },
  totalAmount: Number,
  paymentStatus: "PENDING" | "PAID" | "FAILED",
  status: "PENDING_PAYMENT" | "PLACED" | "CONFIRMED" | "SHIPPED" | "DELIVERED",
  razorpayOrderId, razorpayPaymentId, razorpaySignature
}
```

> **Why snapshot?** Orders must reflect what the customer paid at purchase time, even if the product's name or price changes later.

---

## 🔑 Authentication

- JWT signed with `JWT_SECRET`, payload `{ id: customerId }`, expiry `7d`
- Delivered via **HttpOnly cookie** `token`
- Verified by `protect` middleware on every protected route
- Cookie flags:
    - `httpOnly: true` - JS cannot read (XSS-safe)
    - `secure: NODE_ENV === "production"`
    - `sameSite: "none"` in production (cross-site Vercel → Render), `"lax"` in dev
    - `maxAge: 7 days`

---

## 💳 Razorpay Integration

### Two-step flow

**Step 1 - `POST /orders/create-payment-order`**

- Validates shipping address
- Loads user's cart with populated products
- Checks stock for each item
- Computes `totalAmount` **on the server**
- Creates `Order` with `paymentStatus: PENDING`
- Creates Razorpay order (`amount` in **paise**)
- Saves `razorpayOrderId`, returns safe data

**Step 2 - `POST /orders/verify-payment`**

- Loads order, checks ownership
- Recomputes `HMAC-SHA256(order_id|payment_id, KEY_SECRET)`
- Compares with `razorpay_signature`
- On match: `paymentStatus=PAID`, `status=PLACED`, clears cart, decrements stock
- On mismatch: `paymentStatus=FAILED`, cart **not** cleared

### Why `crypto`, not the browser

The browser can be tampered with. Only the server knows `RAZORPAY_KEY_SECRET`, so only the server can produce a valid HMAC.

---

## 🧪 Testing with Postman

Import `../postman/ShopKart.postman_collection.json`.

1. Set collection variable `baseUrl` = `http://localhost:5000`
2. Run `POST /customers/register` with a fresh email
3. Run `POST /customers/login` - cookie `token` is auto-stored
4. Run `GET /customers/me` - should return the user
5. Test protected routes with/without the cookie to verify `401`

---

## 🚢 Deployment Notes

### Render

- **Root Directory**: `backend`
- **Build**: `npm install`
- **Start**: `npm start`
- Environment: `NODE_ENV=production`, all `.env` keys
- `app.set("trust proxy", 1)` in `index.js` - required for `secure` cookies behind Render's proxy

### MongoDB Atlas

- Whitelist Render's outbound IPs (or `0.0.0.0/0` for convenience)
- If your ISP/router blocks SRV lookups, use the **direct connection string** (see `.env.example`)

---

## 🛡️ Security Checklist

- [x] bcrypt for password hashing
- [x] JWT in HttpOnly cookie
- [x] `RAZORPAY_KEY_SECRET` server-only
- [x] HMAC verification before marking paid
- [x] Ownership checks on every user-scoped read
- [x] Server-side price/stock validation on checkout
- [x] CORS whitelist
- [x] Input validation on every endpoint
- [x] `.env` gitignored
