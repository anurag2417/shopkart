import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import CategoryRail from '../components/home/CategoryRail';
import LazyHero3D from '../components/three/LazyHero3D';
import Stagger, { StaggerItem } from '../components/motion/Stagger';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { gsap, useGSAP } from '../lib/gsap';
import { fetchProducts } from '../services/api';

const Home = () => {
    const { user } = useAuth();
    const { count: wishlistCount } = useWishlist();
    const { totalUnits: cartUnits } = useCart();

    const heroRef = useRef(null);
    const [trending, setTrending] = useState([]);
    const [loadingTrending, setLoadingTrending] = useState(true);

    // Load trending products
    useEffect(() => {
        fetchProducts({ sort: 'price_desc' })
            .then((res) => setTrending((res.data.products || []).slice(0, 8)))
            .catch(() => {})
            .finally(() => setLoadingTrending(false));
    }, []);

    // Hero entrance + parallax
    useGSAP(
        () => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.from('.hero-label', { y: 20, opacity: 0, duration: 0.5 })
                .from('.hero-heading', { y: 40, opacity: 0, duration: 0.7 }, '-=0.3')
                .from('.hero-sub', { y: 20, opacity: 0, duration: 0.5 }, '-=0.4')
                .from('.hero-cta', { y: 20, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.3');

            gsap.to('.hero-3d-wrap', {
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
        <div className="min-h-screen w-full bg-slate-50 dark:bg-ink-950 text-slate-900 dark:text-white">
            <Navbar />

            <main className="w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
                {/* ───── HERO ───── */}
                <section
                    ref={heroRef}
                    className="bg-gradient-to-br from-brand-600 to-brand-800 dark:from-ink-900 dark:to-ink-800 rounded-3xl p-8 sm:p-12 lg:p-16 text-white overflow-hidden relative"
                >
                    {/* grid pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.12]"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                            backgroundSize: '32px 32px',
                        }}
                    />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
                        <div>
                            <p className="hero-label text-brand-100 dark:text-ink-600 text-sm font-medium mb-2">
                                Welcome back, {user?.fullName?.split(' ')[0] || 'shopper'} 👋
                            </p>

                            <h1 className="hero-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                                Your everyday picks,
                                <br />
                                ready when you are.
                            </h1>

                            <p className="hero-sub mt-4 text-brand-100 dark:text-slate-300 text-base sm:text-lg max-w-xl">
                                Jump back into what's trending, revisit saved favourites, or finish
                                the purchase you left behind.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    to="/products"
                                    className="hero-cta inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-ink-700 text-brand-700 dark:text-white font-semibold hover:bg-brand-50 dark:hover:bg-ink-600 active:scale-[0.98] transition-all"
                                >
                                    Browse products
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
                                <Link
                                    to="/cart"
                                    className="hero-cta inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 active:scale-[0.98] transition-all"
                                >
                                    Go to cart
                                    {cartUnits > 0 && (
                                        <span className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full bg-white dark:bg-ink-600 text-brand-700 dark:text-white text-xs font-bold">
                                            {cartUnits}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </div>

                        {/* 3D */}
                        <div className="hero-3d-wrap relative w-full h-64 sm:h-80 lg:h-96">
                            <LazyHero3D />
                        </div>
                    </div>

                    <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 pointer-events-none" />
                    <div className="absolute -bottom-32 -right-10 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
                </section>

                {/* ───── CATEGORY RAIL ───── */}
                <section className="mt-10">
                    <div className="flex items-end justify-between mb-4">
                        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Shop by category
                        </h2>
                        <Link
                            to="/products"
                            className="text-sm font-medium text-brand-600 dark:text-ink-600 hover:underline"
                        >
                            View all →
                        </Link>
                    </div>
                    <CategoryRail />
                </section>

                {/* ───── ACCOUNT + QUICK LINKS ───── */}
                <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="card p-6 lg:col-span-2">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                            Your account
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoRow label="Full name" value={user?.fullName} />
                            <InfoRow label="Email" value={user?.email} />
                            <InfoRow label="Phone" value={user?.phone} />
                            <InfoRow
                                label="Member since"
                                value={
                                    user?.createdAt
                                        ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                                              day: 'numeric',
                                              month: 'long',
                                              year: 'numeric',
                                          })
                                        : '—'
                                }
                            />
                        </div>
                    </div>

                    <Stagger className="card p-6 flex flex-col gap-2">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                            Quick links
                        </h2>
                        <QuickLink to="/products" label="Browse products" />
                        <QuickLink to="/wishlist" label="My wishlist" badge={wishlistCount} />
                        <QuickLink to="/cart" label="My cart" badge={cartUnits} />
                        <QuickLink to="/orders" label="My orders" />
                    </Stagger>
                </section>

                {/* ───── TRENDING ───── */}
                <section className="mt-12">
                    <div className="flex items-end justify-between mb-5">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                Trending now
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Top picks across the catalog
                            </p>
                        </div>
                        <Link
                            to="/products"
                            className="text-sm font-medium text-brand-600 dark:text-ink-600 hover:underline"
                        >
                            View all →
                        </Link>
                    </div>

                    {loadingTrending ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="card overflow-hidden">
                                    <div className="aspect-[4/3] shimmer" />
                                    <div className="p-4 space-y-3">
                                        <div className="h-4 rounded w-3/4 shimmer" />
                                        <div className="h-3 rounded w-full shimmer" />
                                        <div className="h-10 rounded mt-3 shimmer" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : trending.length === 0 ? (
                        <div className="card p-8 text-center">
                            <p className="text-slate-500 dark:text-slate-400">
                                Nothing to show yet. Check back soon.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {trending.map((p) => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

/* ---------- subcomponents ---------- */

const InfoRow = ({ label, value }) => (
    <div className="px-4 py-3 rounded-lg bg-slate-50 dark:bg-ink-800">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">
            {label}
        </p>
        <p className="text-sm text-slate-800 dark:text-white font-medium mt-1 truncate">
            {value || '—'}
        </p>
    </div>
);

const QuickLink = ({ to, label, badge = 0 }) => (
    <StaggerItem>
        <Link
            to={to}
            className="px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-ink-800 dark:hover:bg-ink-700 text-slate-700 dark:text-slate-200 font-medium text-sm flex items-center justify-between transition-colors"
        >
            <span className="flex items-center gap-2">
                {label}
                {badge > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-brand-600 dark:bg-ink-700 text-white text-[10px] font-bold">
                        {badge}
                    </span>
                )}
            </span>
            <span>→</span>
        </Link>
    </StaggerItem>
);

export default Home;
