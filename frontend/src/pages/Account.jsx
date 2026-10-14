import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import PageTransition from '../components/motion/PageTransition';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const Account = () => {
    const { user, logout } = useAuth();
    const { count: wishlistCount } = useWishlist();
    const { totalUnits: cartUnits } = useCart();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [loggingOut, setLoggingOut] = useState(false);

    const initials = (user?.fullName || 'S')
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const handleLogout = async () => {
        if (loggingOut) return;
        setLoggingOut(true);
        try {
            await logout();
            showToast('Signed out. See you soon!', 'info');
            navigate('/');
        } catch {
            showToast('Could not sign out. Try again.', 'error');
            setLoggingOut(false);
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen w-full bg-slate-50 dark:bg-ink-950 text-slate-900 dark:text-white">
                <Navbar />

                <main className="w-full px-4 sm:px-6 lg:px-10 py-8">
                    {/* Page heading */}
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold">Your account</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                            Manage your profile, orders, and preferences.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* ───── Left: Profile + Details ───── */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Profile header */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                className="card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5"
                            >
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 dark:from-ink-700 dark:to-ink-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0">
                                    {initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-xl font-semibold truncate">
                                        {user?.fullName || 'ShopKart Customer'}
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm truncate mt-1">
                                        {user?.email}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 text-xs font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                            Active
                                        </span>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 dark:bg-ink-800 text-slate-600 dark:text-slate-300 text-xs font-medium">
                                            Member since{' '}
                                            {user?.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString(
                                                      'en-IN',
                                                      {
                                                          month: 'short',
                                                          year: 'numeric',
                                                      },
                                                  )
                                                : '-'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Personal information */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
                                className="card p-6"
                            >
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-base font-semibold">
                                        Personal information
                                    </h3>
                                    <button
                                        onClick={() =>
                                            showToast(
                                                'Profile editing coming soon - stay tuned!',
                                                'info',
                                            )
                                        }
                                        className="text-xs font-medium text-brand-600 dark:text-ink-600 hover:underline"
                                    >
                                        Edit
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InfoField label="Full name" value={user?.fullName} />
                                    <InfoField label="Email address" value={user?.email} />
                                    <InfoField label="Phone number" value={user?.phone} />
                                    <InfoField
                                        label="Member since"
                                        value={
                                            user?.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString(
                                                      'en-IN',
                                                      {
                                                          day: 'numeric',
                                                          month: 'long',
                                                          year: 'numeric',
                                                      },
                                                  )
                                                : '-'
                                        }
                                    />
                                </div>
                            </motion.div>

                            {/* Recent activity summary */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
                                className="card p-6"
                            >
                                <h3 className="text-base font-semibold mb-4">At a glance</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <MetricCard
                                        label="Items in cart"
                                        value={cartUnits}
                                        to="/cart"
                                    />
                                    <MetricCard
                                        label="Saved items"
                                        value={wishlistCount}
                                        to="/wishlist"
                                    />
                                    <MetricCard
                                        label="Orders placed"
                                        value="→"
                                        to="/orders"
                                        isLink
                                    />
                                </div>
                            </motion.div>

                            {/* Danger zone */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
                                className="rounded-2xl border border-red-100 dark:border-red-950/60 bg-white dark:bg-ink-900 p-6"
                            >
                                <h3 className="text-base font-semibold text-red-600 dark:text-red-400 mb-1">
                                    Danger zone
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                    Actions here affect your account permanently.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={handleLogout}
                                        disabled={loggingOut}
                                        className="btn-secondary text-sm"
                                    >
                                        {loggingOut ? 'Signing out...' : 'Sign out'}
                                    </button>
                                    <button
                                        onClick={() =>
                                            showToast(
                                                'Account deletion requires support. Please contact help@shopkart.dev',
                                                'info',
                                                4000,
                                            )
                                        }
                                        className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-950/60 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                                    >
                                        Delete account
                                    </button>
                                </div>
                            </motion.div>
                        </div>

                        {/* ───── Right: Quick links ───── */}
                        <aside className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
                                className="card p-6 sticky top-24"
                            >
                                <h3 className="text-base font-semibold mb-4">Quick links</h3>
                                <div className="flex flex-col gap-1.5">
                                    <SideLink to="/products" label="Continue shopping" />
                                    <SideLink
                                        to="/orders"
                                        label="My orders"
                                        hint="Track and view past purchases"
                                    />
                                    <SideLink
                                        to="/wishlist"
                                        label="My wishlist"
                                        badge={wishlistCount}
                                    />
                                    <SideLink to="/cart" label="My cart" badge={cartUnits} />
                                    <button
                                        onClick={() =>
                                            showToast('Password change page coming soon', 'info')
                                        }
                                        className="text-left px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-ink-800 text-slate-700 dark:text-slate-200 text-sm font-medium flex items-center justify-between transition-colors"
                                    >
                                        <span>Change password</span>
                                        <span className="text-slate-400">→</span>
                                    </button>
                                    <button
                                        onClick={() =>
                                            showToast(
                                                'Support: help@shopkart.dev · Mon–Sat, 9am–7pm IST',
                                                'info',
                                                4000,
                                            )
                                        }
                                        className="text-left px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-ink-800 text-slate-700 dark:text-slate-200 text-sm font-medium flex items-center justify-between transition-colors"
                                    >
                                        <span>Help & support</span>
                                        <span className="text-slate-400">→</span>
                                    </button>
                                </div>

                                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-ink-800">
                                    <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                                        Need something we don't cover here? Drop us a line at{' '}
                                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                                            help@shopkart.dev
                                        </span>
                                        .
                                    </p>
                                </div>
                            </motion.div>
                        </aside>
                    </div>
                </main>
            </div>
        </PageTransition>
    );
};

/* ---------- subcomponents ---------- */

const InfoField = ({ label, value }) => (
    <div className="px-4 py-3 rounded-lg bg-slate-50 dark:bg-ink-800">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">
            {label}
        </p>
        <p className="text-sm text-slate-800 dark:text-white font-medium mt-1 truncate">
            {value || '-'}
        </p>
    </div>
);

const MetricCard = ({ label, value, to, isLink = false }) => (
    <Link
        to={to}
        className="px-4 py-4 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-ink-800 dark:hover:bg-ink-700 transition-colors text-center group"
    >
        <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-ink-600 transition-colors">
            {value}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</p>
        {isLink && <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">View all</p>}
    </Link>
);

const SideLink = ({ to, label, hint, badge = 0 }) => (
    <Link
        to={to}
        className="px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-ink-800 text-slate-700 dark:text-slate-200 flex flex-col transition-colors"
    >
        <span className="flex items-center justify-between w-full">
            <span className="text-sm font-medium flex items-center gap-2">
                {label}
                {badge > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-brand-600 dark:bg-ink-700 text-white text-[10px] font-bold">
                        {badge}
                    </span>
                )}
            </span>
            <span className="text-slate-400">→</span>
        </span>
        {hint && <span className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{hint}</span>}
    </Link>
);

export default Account;
