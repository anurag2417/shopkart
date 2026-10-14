import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Account from './pages/Account';

/**
 * PublicOnlyRoute
 * ---------------------------------------------------------
 * Wraps marketing / auth pages (`/`, `/login`, `/register`).
 *
 * - While auth is loading → show a spinner (avoids flash).
 * - If a user is already signed in → redirect to `/home`
 *   (Amazon/Flipkart behavior: skip marketing when logged in).
 */
const PublicOnlyRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-ink-950">
                <div className="w-10 h-10 border-4 border-brand-500 dark:border-ink-700 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (user) return <Navigate to="/home" replace />;
    return children;
};

/**
 * AnimatedRoutes
 * ---------------------------------------------------------
 * Reads `location` from the router and drives `AnimatePresence`
 * so page transitions run on route changes.
 */
const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
                {/* ─────────── Public / marketing ─────────── */}
                <Route
                    path="/"
                    element={
                        <PublicOnlyRoute>
                            <Landing />
                        </PublicOnlyRoute>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <PublicOnlyRoute>
                            <Login />
                        </PublicOnlyRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicOnlyRoute>
                            <Register />
                        </PublicOnlyRoute>
                    }
                />

                {/* ─────────── Protected app ─────────── */}
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/products"
                    element={
                        <ProtectedRoute>
                            <Products />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/products/:id"
                    element={
                        <ProtectedRoute>
                            <ProductDetails />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/wishlist"
                    element={
                        <ProtectedRoute>
                            <Wishlist />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <Cart />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute>
                            <Checkout />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/order-success/:id"
                    element={
                        <ProtectedRoute>
                            <OrderSuccess />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute>
                            <Orders />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/orders/:id"
                    element={
                        <ProtectedRoute>
                            <OrderDetails />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/account"
                    element={
                        <ProtectedRoute>
                            <Account />
                        </ProtectedRoute>
                    }
                />

                {/* ─────────── Fallback ─────────── */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AnimatePresence>
    );
};

/**
 * App
 * ---------------------------------------------------------
 * Provider order (outermost → innermost):
 *
 *   ThemeProvider    → theme class on <html> (dark/light)
 *   MotionConfig     → reduced-motion respect at app root
 *   BrowserRouter    → router context
 *   AuthProvider     → user + login/register/logout
 *   ToastProvider    → global toasts
 *   WishlistProvider → wishlist state
 *   CartProvider     → cart state + derived totals
 *   AnimatedRoutes   → routes + page transitions
 *
 * AuthProvider must be OUTSIDE WishlistProvider and CartProvider
 * because those read `useAuth()` to know when to fetch/clear.
 */
function App() {
    return (
        <ThemeProvider>
            <MotionConfig reducedMotion="user">
                <BrowserRouter>
                    <AuthProvider>
                        <ToastProvider>
                            <WishlistProvider>
                                <CartProvider>
                                    <AnimatedRoutes />
                                </CartProvider>
                            </WishlistProvider>
                        </ToastProvider>
                    </AuthProvider>
                </BrowserRouter>
            </MotionConfig>
        </ThemeProvider>
    );
}

export default App;
