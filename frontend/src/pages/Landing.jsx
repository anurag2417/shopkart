import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LandingNavbar from '../components/landing/LandingNavbar';
import LazyHero3D from '../components/three/LazyHero3D';
import { gsap, useGSAP } from '../lib/gsap';
import { fetchProducts } from '../services/api';
import { useState } from 'react';

const Landing = () => {
    const heroRef = useRef(null);
    const [featured, setFeatured] = useState([]);

    // Load 4 featured products (latest)
    useEffect(() => {
        fetchProducts()
            .then((res) => setFeatured((res.data.products || []).slice(0, 4)))
            .catch(() => {});
    }, []);

    useGSAP(
        () => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.from('.land-label', { y: 20, opacity: 0, duration: 0.5 })
                .from('.land-heading', { y: 40, opacity: 0, duration: 0.7 }, '-=0.3')
                .from('.land-sub', { y: 20, opacity: 0, duration: 0.5 }, '-=0.4')
                .from('.land-cta', { y: 20, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.3')
                .from(
                    '.land-stats > *',
                    { y: 20, opacity: 0, duration: 0.5, stagger: 0.08 },
                    '-=0.3',
                );

            gsap.to('.land-3d', {
                y: 80,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });
        },
        { scope: heroRef },
    );

    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-ink-950 dark:bg-ink-950 text-slate-900 dark:text-white dark:text-white">
            <LandingNavbar />

            {/* ─────────── HERO ─────────── */}
            <section
                ref={heroRef}
                className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-brand-50
                   dark:from-ink-950 dark:via-ink-950 dark:to-ink-900"
            >
                {/* Radial glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-brand-500/10 dark:bg-ink-600/20 blur-3xl" />
                    <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-brand-400/10 dark:bg-ink-700/20 blur-3xl" />
                </div>

                <div className="relative w-full px-4 sm:px-6 lg:px-10 py-16 sm:py-24 lg:py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
                        <div>
                            <div className="land-label inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-ink-900 border border-brand-100 dark:border-ink-800 text-xs font-medium text-brand-700 dark:text-ink-600 mb-6">
                                <span className="w-2 h-2 rounded-full bg-brand-500 dark:bg-ink-600 animate-pulse" />
                                Now shipping across India
                            </div>

                            <h1 className="land-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-white dark:text-white">
                                Everyday things,
                                <br />
                                <span className="text-brand-600 dark:text-ink-600">
                                    done brilliantly.
                                </span>
                            </h1>

                            <p className="land-sub mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                                Curated audio, apparel, home, and everyday essentials - from makers
                                we'd buy from ourselves. Free delivery over ₹499, easy 7-day
                                returns.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    to="/register"
                                    className="land-cta inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 dark:bg-ink-700 dark:hover:bg-ink-600 text-white font-semibold shadow-sm dark:shadow-[0_0_30px_-8px_#16DB65] transition-all active:scale-[0.98]"
                                >
                                    Start shopping
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                        />
                                    </svg>
                                </Link>
                                <a
                                    href="#features"
                                    className="land-cta inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 dark:border-ink-800 bg-white dark:bg-ink-900 text-slate-800 dark:text-white font-semibold hover:bg-slate-50 dark:bg-ink-950 dark:hover:bg-ink-800 transition-all"
                                >
                                    See how it works
                                </a>
                            </div>

                            <div className="land-stats mt-12 grid grid-cols-3 gap-6 max-w-md">
                                <Stat value="12K+" label="Happy customers" />
                                <Stat value="4.8★" label="Average rating" />
                                <Stat value="48h" label="Delivery time" />
                            </div>
                        </div>

                        {/* 3D Object */}
                        <div className="land-3d relative w-full h-72 sm:h-96 lg:h-[500px]">
                            <LazyHero3D />
                        </div>
                    </div>
                </div>
            </section>

            {/* ─────────── FEATURES ─────────── */}
            <section
                id="features"
                className="w-full px-4 sm:px-6 lg:px-10 py-20 bg-white dark:bg-ink-900/40 border-t border-slate-100 dark:border-ink-800"
            >
                <div className="max-w-7xl mx-auto">
                    <SectionHeading
                        label="Why ShopKart"
                        title="Built for people who care about details."
                        subtitle="A shopping experience that respects your time, your money, and your inbox."
                    />

                    <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon="truck"
                            title="Fast, free delivery"
                            body="Free shipping on orders over ₹499. Most metro pins delivered within 48 hours."
                        />
                        <FeatureCard
                            icon="shield"
                            title="Secure payments"
                            body="PCI-DSS compliant checkout powered by Razorpay. UPI, cards, and wallets supported."
                        />
                        <FeatureCard
                            icon="refresh"
                            title="Easy returns"
                            body="Changed your mind? 7-day no-questions returns with prepaid pickup."
                        />
                        <FeatureCard
                            icon="sparkles"
                            title="Curated catalog"
                            body="Every product hand-picked by our team. No drop-shipped junk, ever."
                        />
                        <FeatureCard
                            icon="heart"
                            title="Save for later"
                            body="Wishlist any product and we'll tell you when it's back in stock or on sale."
                        />
                        <FeatureCard
                            icon="chat"
                            title="Real human support"
                            body="Talk to a real person within 2 minutes. No bots, no runaround."
                        />
                    </div>
                </div>
            </section>

            {/* ─────────── CATEGORIES ─────────── */}
            <section
                id="categories"
                className="w-full px-4 sm:px-6 lg:px-10 py-20 bg-slate-50 dark:bg-ink-950 dark:bg-ink-950"
            >
                <div className="max-w-7xl mx-auto">
                    <SectionHeading
                        label="Browse by category"
                        title="Find exactly what you need."
                        subtitle="Six categories, thousands of products, one checkout."
                    />

                    <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            { name: 'Audio', emoji: '🎧' },
                            { name: 'Peripherals', emoji: '⌨️' },
                            { name: 'Footwear', emoji: '👟' },
                            { name: 'Books', emoji: '📚' },
                            { name: 'Home', emoji: '🏡' },
                            { name: 'Wearables', emoji: '⌚' },
                        ].map((c) => (
                            <Link
                                key={c.name}
                                to="/login"
                                className="group aspect-square rounded-2xl bg-white dark:bg-ink-900 border border-slate-100 dark:border-ink-800 flex flex-col items-center justify-center gap-3 hover:shadow-md dark:hover:shadow-[0_0_30px_-10px_#0A9548] hover:-translate-y-1 transition-all duration-300"
                            >
                                <span className="text-4xl">{c.emoji}</span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                    {c.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─────────── FEATURED PRODUCTS ─────────── */}
            {featured.length > 0 && (
                <section className="w-full px-4 sm:px-6 lg:px-10 py-20 bg-white dark:bg-ink-900/40 border-t border-slate-100 dark:border-ink-800">
                    <div className="max-w-7xl mx-auto">
                        <SectionHeading
                            label="Featured this week"
                            title="What people are buying."
                            subtitle="A small sample of what's trending on ShopKart right now."
                        />

                        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                            {featured.map((p) => (
                                <Link
                                    key={p._id}
                                    to="/login"
                                    className="group rounded-2xl overflow-hidden bg-white dark:bg-ink-900 border border-slate-100 dark:border-ink-800 hover:shadow-lg dark:hover:shadow-[0_0_30px_-10px_#0A9548] transition-all"
                                >
                                    <div className="aspect-square bg-slate-100 dark:bg-ink-800 overflow-hidden">
                                        <img
                                            src={p.image}
                                            alt={p.name}
                                            loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.src =
                                                    'https://via.placeholder.com/400?text=ShopKart';
                                            }}
                                        />
                                    </div>
                                    <div className="p-3 sm:p-4">
                                        <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400 mb-1">
                                            {p.category}
                                        </p>
                                        <p className="text-sm font-medium text-slate-800 dark:text-white line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-ink-600 transition-colors">
                                            {p.name}
                                        </p>
                                        <p className="mt-2 text-base font-bold text-slate-900 dark:text-white dark:text-white">
                                            ₹{p.price.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ─────────── CTA ─────────── */}
            <section
                id="about"
                className="w-full px-4 sm:px-6 lg:px-10 py-20 bg-slate-50 dark:bg-ink-950 dark:bg-ink-950"
            >
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white dark:text-white leading-tight">
                        Ready when you are.
                    </h2>
                    <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Create a free account in under 30 seconds. Your cart, wishlist, and orders
                        follow you across every device.
                    </p>
                    <div className="mt-10 flex flex-wrap justify-center gap-3">
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 dark:bg-ink-700 dark:hover:bg-ink-600 text-white font-semibold shadow-sm dark:shadow-[0_0_30px_-8px_#16DB65] transition-all active:scale-[0.98]"
                        >
                            Create free account
                        </Link>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-slate-200 dark:border-ink-800 bg-white dark:bg-ink-900 text-slate-800 dark:text-white font-semibold hover:bg-slate-50 dark:bg-ink-950 dark:hover:bg-ink-800 transition-all"
                        >
                            I already have one
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─────────── FOOTER ─────────── */}
            <footer className="w-full border-t border-slate-200 dark:border-ink-800 bg-white dark:bg-ink-950">
                <div className="w-full px-4 sm:px-6 lg:px-10 py-12 max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-brand-600 dark:bg-ink-700 flex items-center justify-center">
                                    <svg
                                        className="w-4 h-4 text-white"
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
                                <span className="text-base font-bold text-slate-900 dark:text-white dark:text-white">
                                    ShopKart
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400 leading-relaxed">
                                Everyday things, done brilliantly. Made in India.
                            </p>
                        </div>

                        <FooterCol
                            title="Shop"
                            links={[
                                { label: 'All products', to: '/login' },
                                { label: 'Audio', to: '/login' },
                                { label: 'Apparel', to: '/login' },
                                { label: 'Home', to: '/login' },
                            ]}
                        />
                        <FooterCol
                            title="Account"
                            links={[
                                { label: 'Sign in', to: '/login' },
                                { label: 'Create account', to: '/register' },
                                { label: 'My orders', to: '/login' },
                                { label: 'Wishlist', to: '/login' },
                            ]}
                        />
                        <FooterCol
                            title="Company"
                            links={[
                                { label: 'About us', to: '#about' },
                                { label: 'Contact', to: '#about' },
                                { label: 'Privacy', to: '#about' },
                                { label: 'Terms', to: '#about' },
                            ]}
                        />
                    </div>

                    <div className="mt-10 pt-6 border-t border-slate-100 dark:border-ink-800 flex flex-col sm:flex-row justify-between items-center gap-3">
                        <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400">
                            © {new Date().getFullYear()} ShopKart. All rights reserved.
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400">
                            Crafted with care in Bengaluru.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

/* ---------- subcomponents ---------- */

const Stat = ({ value, label }) => (
    <div>
        <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white dark:text-white">
            {value}
        </p>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 dark:text-slate-400 mt-1">
            {label}
        </p>
    </div>
);

const SectionHeading = ({ label, title, subtitle }) => (
    <div className="max-w-2xl">
        <p className="text-sm font-semibold text-brand-600 dark:text-ink-600 uppercase tracking-wider">
            {label}
        </p>
        <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white dark:text-white leading-tight">
            {title}
        </h2>
        {subtitle && <p className="mt-3 text-slate-600 dark:text-slate-300">{subtitle}</p>}
    </div>
);

const FeatureCard = ({ icon, title, body }) => {
    const icons = {
        truck: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a2 2 0 104 0m-6 0a2 2 0 11-4 0"
            />
        ),
        shield: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
            />
        ),
        refresh: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
        ),
        sparkles: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
        ),
        heart: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
        ),
        chat: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
        ),
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="p-6 rounded-2xl bg-white dark:bg-ink-900 border border-slate-100 dark:border-ink-800 hover:shadow-md dark:hover:shadow-[0_0_30px_-10px_#0A9548] transition-all"
        >
            <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-ink-800 flex items-center justify-center mb-4">
                <svg
                    className="w-5 h-5 text-brand-600 dark:text-ink-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    {icons[icon]}
                </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{body}</p>
        </motion.div>
    );
};

const FooterCol = ({ title, links }) => (
    <div>
        <h4 className="text-xs font-semibold text-slate-900 dark:text-white dark:text-white uppercase tracking-wider mb-3">
            {title}
        </h4>
        <ul className="space-y-2">
            {links.map((l) => (
                <li key={l.label}>
                    <Link
                        to={l.to}
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-ink-600 transition-colors"
                    >
                        {l.label}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

export default Landing;
