import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/motion/PageTransition';
import PressButton from '../components/motion/PressButton';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const { showToast } = useToast();

    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location.state?.registered) {
            setSuccess('Account created - sign in to continue.');
        }
        if (location.state?.from) {
            setError('Please sign in to continue.');
        }
    }, [location.state]);

    const handleChange = (e) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            setError('Please enter both email and password');
            return;
        }

        setLoading(true);
        try {
            await login(form);
            showToast('Welcome back!', 'success');
            navigate('/home');
        } catch (err) {
            const msg =
                err?.response?.data?.message || "Those credentials don't match. Please try again.";
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen w-full flex bg-slate-50 dark:bg-ink-950 dark:bg-ink-950">
                {/* Left - decorative panel */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-600 to-brand-800 dark:from-ink-900 dark:to-ink-800 relative overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-[0.12]"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                            backgroundSize: '32px 32px',
                        }}
                    />
                    <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-lg bg-white/15 dark:bg-ink-700/40 flex items-center justify-center">
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
                            </div>
                            <span className="text-lg font-bold">ShopKart</span>
                        </Link>

                        <div>
                            <h2 className="text-3xl xl:text-4xl font-bold leading-tight max-w-md">
                                Pick up right where you left off.
                            </h2>
                            <p className="mt-4 text-brand-100 dark:text-slate-300 max-w-md">
                                Your cart, wishlist, and orders are exactly where you left them -
                                across every device you sign in on.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 max-w-md">
                            <Stat value="12K+" label="Happy customers" />
                            <Stat value="4.8★" label="Average rating" />
                            <Stat value="48h" label="Delivery time" />
                        </div>

                        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
                    </div>
                </div>

                {/* Right - form */}
                <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-8">
                    <div className="w-full max-w-md">
                        <div className="flex items-center justify-between mb-10">
                            <Link to="/" className="lg:hidden flex items-center gap-2">
                                <div className="w-9 h-9 rounded-lg bg-brand-600 dark:bg-ink-700 flex items-center justify-center">
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
                                </div>
                                <span className="text-lg font-bold text-slate-900 dark:text-white dark:text-white">
                                    ShopKart
                                </span>
                            </Link>
                            <div className="ml-auto">
                                <ThemeToggle />
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white dark:text-white">
                                Welcome back
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 dark:text-slate-400 mt-2 text-sm">
                                Sign in to continue shopping.
                            </p>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-5 animate-fade-in">
                            {success && (
                                <div className="px-4 py-3 rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-900/60 text-green-700 dark:text-green-300 text-sm">
                                    {success}
                                </div>
                            )}
                            {error && (
                                <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/60 text-red-700 dark:text-red-300 text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    className="input-field"
                                />
                            </div>

                            <PressButton
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </PressButton>

                            <p className="text-center text-sm text-slate-500 dark:text-slate-400 dark:text-slate-400">
                                New to ShopKart?{' '}
                                <Link
                                    to="/register"
                                    className="text-brand-600 dark:text-ink-600 font-medium hover:underline"
                                >
                                    Create an account
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

const Stat = ({ value, label }) => (
    <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-brand-100 dark:text-slate-300 mt-1">{label}</p>
    </div>
);

export default Login;
