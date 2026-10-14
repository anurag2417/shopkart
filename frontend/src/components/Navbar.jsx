import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { count: wishlistCount } = useWishlist();
    const { totalUnits: cartUnits } = useCart();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const initials = (user?.fullName || 'S')
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const linkClass = ({ isActive }) =>
        `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive
                ? 'bg-brand-50 text-brand-700 dark:bg-ink-800 dark:text-ink-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-ink-800'
        }`;

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-ink-950/80 backdrop-blur-md border-b border-slate-200 dark:border-ink-800">
            <nav className="w-full px-4 sm:px-6 lg:px-10">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/home" className="flex items-center gap-2 group">
                        <motion.div
                            whileHover={{ rotate: -6, scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            className="w-9 h-9 rounded-lg bg-brand-600 dark:bg-ink-700 flex items-center justify-center"
                        >
                            <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </motion.div>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                            ShopKart
                        </span>
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink to="/home" className={linkClass}>
                            Home
                        </NavLink>
                        <NavLink to="/products" className={linkClass}>
                            Products
                        </NavLink>
                        <NavLink to="/wishlist" className={linkClass}>
                            <span className="relative inline-flex items-center gap-1.5">
                                Wishlist
                                <AnimatePresence>
                                    {wishlistCount > 0 && (
                                        <motion.span
                                            key={wishlistCount}
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.5, opacity: 0 }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 500,
                                                damping: 25,
                                            }}
                                            className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold"
                                        >
                                            {wishlistCount}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </span>
                        </NavLink>
                        <NavLink to="/cart" className={linkClass}>
                            <span className="relative inline-flex items-center gap-1.5">
                                Cart
                                <AnimatePresence>
                                    {cartUnits > 0 && (
                                        <motion.span
                                            key={cartUnits}
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.5, opacity: 0 }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 500,
                                                damping: 25,
                                            }}
                                            className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-brand-600 dark:bg-ink-700 text-white text-[10px] font-bold"
                                        >
                                            {cartUnits}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </span>
                        </NavLink>
                        <NavLink to="/orders" className={linkClass}>
                            Orders
                        </NavLink>
                    </div>

                    {/* Right side */}
                    <div className="hidden md:flex items-center gap-3">
                        <ThemeToggle />
                        {user ? (
                            <NavLink
                                to="/account"
                                className={({ isActive }) =>
                                    `flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-colors ${
                                        isActive
                                            ? 'bg-brand-50 dark:bg-ink-800'
                                            : 'hover:bg-slate-100 dark:hover:bg-ink-800'
                                    }`
                                }
                                aria-label="Account"
                            >
                                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 dark:from-ink-700 dark:to-ink-600 flex items-center justify-center text-white text-xs font-bold">
                                    {initials}
                                </span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                    Account
                                </span>
                            </NavLink>
                        ) : (
                            <>
                                <Link to="/login" className="btn-secondary text-sm">
                                    Sign in
                                </Link>
                                <Link to="/register" className="btn-primary text-sm">
                                    Get started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-ink-800 relative"
                        onClick={() => setMobileOpen((v) => !v)}
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6 text-slate-700 dark:text-slate-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                        >
                            {mobileOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                        <AnimatePresence>
                            {cartUnits > 0 && !mobileOpen && (
                                <motion.span
                                    key={cartUnits}
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.5, opacity: 0 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 500,
                                        damping: 25,
                                    }}
                                    className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-brand-600 dark:bg-ink-700 text-white text-[10px] font-bold"
                                >
                                    {cartUnits}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="md:hidden overflow-hidden border-t border-slate-100 dark:border-ink-800"
                        >
                            <div className="py-3 flex flex-col gap-1">
                                {/* User strip (mobile) */}
                                {user && (
                                    <NavLink
                                        to="/account"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center gap-3 px-3 py-3 mb-2 rounded-lg bg-slate-50 dark:bg-ink-800"
                                    >
                                        <span className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 dark:from-ink-700 dark:to-ink-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                            {initials}
                                        </span>
                                        <span className="flex-1 min-w-0">
                                            <span className="block text-sm font-semibold text-slate-800 dark:text-white truncate">
                                                {user.fullName}
                                            </span>
                                            <span className="block text-xs text-slate-500 dark:text-slate-400 truncate">
                                                {user.email}
                                            </span>
                                        </span>
                                        <span className="text-slate-400">→</span>
                                    </NavLink>
                                )}

                                <NavLink
                                    to="/home"
                                    className={linkClass}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Home
                                </NavLink>
                                <NavLink
                                    to="/products"
                                    className={linkClass}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Products
                                </NavLink>
                                <NavLink
                                    to="/wishlist"
                                    className={linkClass}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <span className="inline-flex items-center gap-2">
                                        Wishlist
                                        {wishlistCount > 0 && (
                                            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                                                {wishlistCount}
                                            </span>
                                        )}
                                    </span>
                                </NavLink>
                                <NavLink
                                    to="/cart"
                                    className={linkClass}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <span className="inline-flex items-center gap-2">
                                        Cart
                                        {cartUnits > 0 && (
                                            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-brand-600 dark:bg-ink-700 text-white text-[10px] font-bold">
                                                {cartUnits}
                                            </span>
                                        )}
                                    </span>
                                </NavLink>
                                <NavLink
                                    to="/orders"
                                    className={linkClass}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Orders
                                </NavLink>

                                <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 dark:border-ink-800">
                                    <ThemeToggle />
                                    {user ? (
                                        <button
                                            onClick={() => {
                                                setMobileOpen(false);
                                                handleLogout();
                                            }}
                                            className="px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                                        >
                                            Sign out
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <NavLink
                                                to="/login"
                                                className={linkClass}
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                Sign in
                                            </NavLink>
                                            <NavLink
                                                to="/register"
                                                className={linkClass}
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                Get started
                                            </NavLink>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
};

export default Navbar;
