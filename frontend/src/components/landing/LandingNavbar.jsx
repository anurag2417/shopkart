import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../ThemeToggle';

const LandingNavbar = () => {
    const [open, setOpen] = useState(false);

    const links = [
        { to: '#features', label: 'Features' },
        { to: '#categories', label: 'Categories' },
        { to: '#about', label: 'About' },
    ];

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-ink-950/70 border-b border-slate-200 dark:border-ink-800">
            <nav className="w-full px-4 sm:px-6 lg:px-10">
                <div className="flex items-center justify-between h-16">
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

                    <div className="hidden md:flex items-center gap-8">
                        {links.map((l) => (
                            <a
                                key={l.label}
                                href={l.to}
                                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white dark:hover:text-white transition-colors"
                            >
                                {l.label}
                            </a>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <ThemeToggle />
                        <Link
                            to="/login"
                            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:text-white dark:hover:text-white transition-colors"
                        >
                            Sign in
                        </Link>
                        <Link
                            to="/register"
                            className="px-5 py-2 rounded-lg text-sm font-semibold bg-brand-600 hover:bg-brand-700 dark:bg-ink-700 dark:hover:bg-ink-600 text-white transition-colors"
                        >
                            Get started
                        </Link>
                    </div>

                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-ink-800"
                        onClick={() => setOpen((v) => !v)}
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6 text-slate-700 dark:text-slate-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                        >
                            {open ? (
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
                    </button>
                </div>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="md:hidden overflow-hidden border-t border-slate-100 dark:border-ink-800"
                        >
                            <div className="py-4 flex flex-col gap-2">
                                {links.map((l) => (
                                    <a
                                        key={l.label}
                                        href={l.to}
                                        onClick={() => setOpen(false)}
                                        className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-ink-800"
                                    >
                                        {l.label}
                                    </a>
                                ))}
                                <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-ink-800">
                                    <ThemeToggle />
                                    <div className="flex gap-2">
                                        <Link
                                            to="/login"
                                            className="px-4 py-2 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-ink-800"
                                            onClick={() => setOpen(false)}
                                        >
                                            Sign in
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="px-4 py-2 rounded-lg text-sm font-semibold bg-brand-600 hover:bg-brand-700 dark:bg-ink-700 dark:hover:bg-ink-600 text-white"
                                            onClick={() => setOpen(false)}
                                        >
                                            Get started
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
};

export default LandingNavbar;
