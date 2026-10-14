# ShopKart - Frontend

React + Vite + Tailwind + Framer Motion + GSAP + React Three Fiber.

🌐 **Live:** https://shopkart-delta-eight.vercel.app/

---

## 🚀 Quick Start

```bash
npm install
cp .env.example .env.local   # sets VITE_API_URL
npm run dev                  # :5173 (strict)
```

---

## 📜 Scripts

| Command           | Purpose                      |
| ----------------- | ---------------------------- |
| `npm run dev`     | Vite dev server (:5173)      |
| `npm run build`   | Production build → `dist/`   |
| `npm run preview` | Preview the production build |

---

## 🔑 Environment Variables

| Key            | Required | Notes                                                         |
| -------------- | :------: | ------------------------------------------------------------- |
| `VITE_API_URL` |    ✅    | Backend URL. Local: `http://localhost:5000`. Prod: Render URL |

> ⚠️ Only `VITE_*` variables are exposed to the browser. **Never** put secrets here.

---

## 📁 Structure

```
src/
├── components/
│   ├── motion/                 # Reusable animation primitives
│   │   ├── PageTransition.jsx  # Wraps each page
│   │   ├── FadeIn.jsx
│   │   ├── Stagger.jsx
│   │   └── PressButton.jsx
│   ├── three/                  # 3D hero
│   │   ├── Hero3D.jsx
│   │   └── LazyHero3D.jsx      # Loads Hero3D conditionally
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── ProductCard.jsx
│   ├── WishlistButton.jsx
│   ├── WishlistCard.jsx
│   ├── AddToCartButton.jsx
│   ├── CartItem.jsx
│   └── SearchBar.jsx
│
├── context/                    # Global state
│   ├── AuthContext.jsx         # user + login/register/logout
│   ├── ToastContext.jsx        # animated toasts
│   ├── WishlistContext.jsx     # wishlist items + toggle
│   └── CartContext.jsx         # cart items + derived totals
│
├── lib/
│   └── gsap.js                 # GSAP plugin registration
│
├── pages/                      # One file per route
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Home.jsx                # 3D hero + account summary
│   ├── Products.jsx            # Search + filter + sort
│   ├── ProductDetails.jsx
│   ├── Wishlist.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx            # Shipping form + Razorpay
│   ├── OrderSuccess.jsx
│   ├── Orders.jsx
│   └── OrderDetails.jsx
│
├── services/
│   └── api.js                  # Axios instance + all endpoints
│
├── utils/
│   └── loadRazorpay.js         # Dynamic script loader
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🧠 State Management

We use **React Context API** - no Redux needed. Four providers wrap the app:

```
<AuthProvider>         → user, login, register, logout
  <ToastProvider>      → showToast(message, type)
    <WishlistProvider> → wishlist items, isWishlisted, toggle
      <CartProvider>   → cart items, derived totals, mutations
        <App />
```

### Why Context?

- Cart, wishlist, and auth are **application-level** state
- Avoids prop drilling through 3 layers
- Simple mental model for a project this size
- Redux would be overkill

### Optimistic updates

Cart and wishlist mutations update local state **immediately**, then call the API. On failure, they **roll back**.

```js
// Simplified CartContext pattern
const removeProduct = async (productId) => {
    const prev = cart;
    setCart((items) => items.filter((i) => i.product._id !== productId)); // optimistic
    try {
        const res = await removeAPI(productId);
        setCart(res.data.cart); // authoritative
    } catch (err) {
        setCart(prev); // rollback
        throw err;
    }
};
```

### Derived state

Never stored - always computed:

```js
const totalUnits = cart.reduce((s, i) => s + i.quantity, 0);
const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
```

---

## 🔌 API Layer (`services/api.js`)

Single Axios instance:

```js
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    withCredentials: true, // 🔑 sends the JWT cookie cross-origin
    headers: { 'Content-Type': 'application/json' },
});
```

Every endpoint is a named export. Components never build URLs directly.

---

## 🎨 Animation Stack

### Framer Motion

- `<PageTransition>` wraps every page for entrance/exit fades
- Toasts animate via `<AnimatePresence>`
- Card hovers, button presses
- Navbar badge "pop" on count change
- `MotionConfig reducedMotion="user"` respects OS accessibility settings

### GSAP

- Home hero entrance timeline (sequential reveal)
- Hero parallax via `ScrollTrigger` scrub
- Products grid stagger reveal
- Registered once in `lib/gsap.js`

### React Three Fiber

- `Hero3D` - floating icosahedron with two directional lights
- `LazyHero3D` - loads only when:
    - `prefers-reduced-motion: no-preference`
    - Screen width ≥ 640px
    - Uses `React.lazy()` + `<Suspense>` so 3D never blocks first paint

---

## 📱 Responsive Design

- **Mobile**: single-column layouts, animated hamburger menu
- **Tablet**: 2-column product grid
- **Desktop**: 3–4 column grids, sticky order summary
- **Ultra-wide**: max container widths keep content readable

Tailwind breakpoints: `sm:640` `md:768` `lg:1024` `xl:1280`

---

## 🚢 Deployment (Vercel)

1. Import repo → **Root Directory**: `frontend`
2. Framework: **Vite** · Build: `npm run build` · Output: `dist`
3. Environment: `VITE_API_URL=https://shopkart-api-g41f.onrender.com`
4. Deploy

**`vercel.json`** rewrites all routes to `/index.html` (SPA):

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
```

Without this, refreshing `/products/123` would 404.

---

## 🧪 Local Verification

```bash
# Terminal 1 - backend
cd backend && npm run dev

# Terminal 2 - frontend
cd frontend && npm run dev
```

Open http://localhost:5173. Register → login → browse → cart → checkout → Razorpay test card.

---

## 🐛 Common Issues

| Issue                       | Fix                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------ |
| `ERESOLVE` on install       | Ensure `frontend/.npmrc` has `legacy-peer-deps=true` and drei is pinned to `9.114.3` |
| Port 5174 instead of 5173   | Kill whatever holds 5173, or add 5174 to backend `CLIENT_URL`                        |
| 3D hero doesn't render      | Check WebGL support; scene is disabled on small screens and reduced-motion           |
| Cart badge doesn't update   | Ensure `<CartProvider>` wraps your route component                                   |
| API requests fail on Vercel | Verify `VITE_API_URL` env is set and redeployed (env changes need a rebuild)         |
