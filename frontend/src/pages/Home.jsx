import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import CategoryRail from '../components/home/CategoryRail';
import LazyHero3D from '../components/three/LazyHero3D';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { gsap, useGSAP } from '../lib/gsap';
import { fetchProducts } from '../services/api';

const Home = () => {
    const { user } = useAuth();
    const { totalUnits: cartUnits } = useCart();
    const { count: wishlistCount } = useWishlist();

    const heroRef = useRef(null);
    const [trending, setTrending] = useState([]);
    const [loadingTrending, setLoadingTrending] = useState(true);

    useEffect(() => {
        fetchProducts({ sort: 'price_desc' })
            .then((res) => setTrending((res.data.products || []).slice(0, 8)))
            .catch(() => {})
            .finally(() => setLoadingTrending(false));
    }, []);

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
                {/* Welcome strip - light personalization without clutter */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold">
                            Hey {user?.fullName?.split(' ')[0] || 'there'} 👋
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            Here's what's hot on ShopKart today.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        {cartUnits > 0 && (
                            <Link
                                to="/cart"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-ink-900 border border-slate-200 dark:border-ink-800 hover:border-brand-300 dark:hover:border-ink-700 transition-colors"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 dark:bg-ink-600" />
                                {cartUnits} in cart
                            </Link>
                        )}
                        {wishlistCount > 0 && (
                            <Link
                                to="/wishlist"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-ink-900 border border-slate-200 dark:border-ink-800 hover:border-red-300 dark:hover:border-ink-700 transition-colors"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                {wishlistCount} saved
                            </Link>
                        )}
                    </div>
                </div>

                {/* ───── HERO ───── */}
                <section
                    ref={heroRef}
                    className="bg-gradient-to-br from-brand-600 to-brand-800 dark:from-ink-900 dark:to-ink-800 rounded-3xl p-8 sm:p-12 lg:p-16 text-white overflow-hidden relative"
                >
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
                                Fresh picks, every week
                            </p>

                            <h2 className="hero-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                                Everyday things,
                                <br />
                                done brilliantly.
                            </h2>

                            <p className="hero-sub mt-4 text-brand-100 dark:text-slate-300 text-base sm:text-lg max-w-xl">
                                Curated audio, apparel, home, and essentials - from makers we'd buy
                                from ourselves.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    to="/products"
                                    className="hero-cta inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-ink-700 text-brand-700 dark:text-white font-semibold hover:bg-brand-50 dark:hover:bg-ink-600 active:scale-[0.98] transition-all shadow-sm"
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
                                    to="/orders"
                                    className="hero-cta inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 active:scale-[0.98] transition-all"
                                >
                                    My orders
                                </Link>
                            </div>
                        </div>

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

                {/* ───── TRENDING ───── */}
                <section className="mt-12">
                    <div className="flex items-end justify-between mb-5">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold">Trending now</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Top picks from across the catalog
                            </p>
                        </div>
                        <Link
                            to="/products?sort=price_desc"
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

export default Home;
