import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/motion/PageTransition';
import PressButton from '../components/motion/PressButton';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const { showToast } = useToast();

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
        setError('');
    };

    const validate = () => {
        if (!form.fullName.trim()) return 'Please enter your full name';
        if (!form.email.trim()) return 'Email is required';
        if (!/^\S+@\S+\.\S+$/.test(form.email)) return "That email doesn't look right";
        if (form.password.length < 6) return 'Password needs at least 6 characters';
        if (!/^\d{10}$/.test(form.phone.replace(/\s+/g, '')))
            return 'Phone number should be 10 digits';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            await register({
                ...form,
                phone: form.phone.replace(/\s+/g, ''),
            });
            showToast('Account created - welcome aboard!', 'success');
            navigate('/login', { state: { registered: true } });
        } catch (err) {
            const msg =
                err?.response?.data?.message || "Couldn't create your account. Please try again.";
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen w-full flex bg-slate-50 dark:bg-ink-950 dark:bg-ink-950">
                {/* Left - form */}
                <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-8">
                    <div className="w-full max-w-md">
                        {/* Top bar */}
                        <div className="flex items-center justify-between mb-10">
                            <Link to="/" className="flex items-center gap-2">
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
                            <ThemeToggle />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white dark:text-white">
                                Create your account
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 dark:text-slate-400 mt-2 text-sm">
                                Track orders, save favourites, and check out faster.
                            </p>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-5 animate-fade-in">
                            {error && (
                                <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/60 text-red-700 dark:text-red-300 text-sm">
                                    {error}
                                </div>
                            )}

                            <Field
                                label="Full Name"
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                placeholder="Aarav Mehta"
                                autoComplete="name"
                            />

                            <Field
                                label="Email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                autoComplete="email"
                            />

                            <Field
                                label="Password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="At least 6 characters"
                                autoComplete="new-password"
                            />

                            <Field
                                label="Phone"
                                name="phone"
                                type="tel"
                                inputMode="numeric"
                                maxLength={10}
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="98765 43210"
                                autoComplete="tel"
                            />

                            <PressButton
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full mt-2"
                            >
                                {loading ? 'Creating account...' : 'Create account'}
                            </PressButton>

                            <p className="text-center text-sm text-slate-500 dark:text-slate-400 dark:text-slate-400">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="text-brand-600 dark:text-ink-600 font-medium hover:underline"
                                >
                                    Log in
                                </Link>
                            </p>

                            <p className="text-center text-xs text-slate-400 dark:text-slate-500 dark:text-slate-400 leading-relaxed pt-2">
                                By continuing you agree to our{' '}
                                <Link
                                    to="/"
                                    className="underline hover:text-slate-600 dark:hover:text-slate-300"
                                >
                                    Terms
                                </Link>{' '}
                                and{' '}
                                <Link
                                    to="/"
                                    className="underline hover:text-slate-600 dark:hover:text-slate-300"
                                >
                                    Privacy Policy
                                </Link>
                                .
                            </p>
                        </form>
                    </div>
                </div>

                {/* Right - decorative panel (hidden on mobile) */}
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
                        <div>
                            <p className="text-sm font-medium text-brand-100 dark:text-ink-600 uppercase tracking-wider">
                                Join ShopKart
                            </p>
                            <h2 className="mt-4 text-3xl xl:text-4xl font-bold leading-tight max-w-md">
                                Everything you love, in one tidy place.
                            </h2>
                            <p className="mt-4 text-brand-100 dark:text-slate-300 max-w-md">
                                Save favourites across devices, track every order, and get notified
                                the moment something you wanted is back in stock.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {[
                                'Curated products from makers we trust',
                                'Free delivery on orders above ₹499',
                                '7-day easy returns, no questions asked',
                                'Real human support in under 2 minutes',
                            ].map((line) => (
                                <div key={line} className="flex items-center gap-3 text-sm">
                                    <span className="inline-flex w-5 h-5 rounded-full bg-white/15 dark:bg-ink-700/40 items-center justify-center flex-shrink-0">
                                        <svg
                                            className="w-3 h-3"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </span>
                                    <span className="text-brand-50 dark:text-slate-200">
                                        {line}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

/* ---------- subcomponents ---------- */

const Field = ({ label, className = '', ...rest }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            {label}
        </label>
        <input className="input-field" {...rest} />
    </div>
);

export default Register;
