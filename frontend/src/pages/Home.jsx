import { Link } from 'react-router-dom';
import { useRef } from 'react';
import Navbar from '../components/Navbar';
import LazyHero3D from '../components/three/LazyHero3D';
import Stagger, { StaggerItem } from '../components/motion/Stagger';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { gsap, useGSAP } from '../lib/gsap';

const Home = () => {
    const { user } = useAuth();
    const { count: wishlistCount } = useWishlist();
    const { totalUnits: cartUnits } = useCart();

    const heroRef = useRef(null);

    // 🎬 GSAP entrance timeline
    useGSAP(
        () => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.from('.hero-label', { y: 20, opacity: 0, duration: 0.5 })
                .from('.hero-heading', { y: 40, opacity: 0, duration: 0.7 }, '-=0.3')
                .from('.hero-sub', { y: 20, opacity: 0, duration: 0.5 }, '-=0.4')
                .from('.hero-cta', { y: 20, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.3');

            // Parallax on scroll
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
        <div className="min-h-screen w-full bg-slate-50">
            <Navbar />

            <main className="w-full px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
                {/* 🚀 HERO */}
                <section
                    ref={heroRef}
                    className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-8 sm:p-12 lg:p-16 text-white overflow-hidden relative"
                >
                    {/* Subtle grid pattern */}
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
                            <p className="hero-label text-brand-100 text-sm font-medium mb-2">
                                Welcome back 👋
                            </p>

                            <h1 className="hero-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                                Hey {user?.fullName?.split(' ')[0] || 'there'}, ready to shop?
                            </h1>

                            <p className="hero-sub mt-4 text-brand-100 text-base sm:text-lg max-w-xl">
                                Discover thousands of products across electronics, fashion, books
                                and more — all in one place.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    to="/products"
                                    className="hero-cta inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-700 font-semibold hover:bg-brand-50 active:scale-[0.98] transition-transform"
                                >
                                    Browse Products
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
                                    className="hero-cta inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 active:scale-[0.98] transition-transform"
                                >
                                    Go to Cart
                                    {cartUnits > 0 && (
                                        <span className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full bg-white text-brand-700 text-xs font-bold">
                                            {cartUnits}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </div>

                        {/* 3D object */}
                        <div className="hero-3d-wrap relative w-full h-64 sm:h-80 lg:h-96">
                            <LazyHero3D />
                        </div>
                    </div>

                    {/* decorative circles */}
                    <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 pointer-events-none" />
                    <div className="absolute -bottom-32 -right-10 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
                </section>

                {/* Account Info */}
                <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="card p-6 lg:col-span-2">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Account</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoRow label="Full Name" value={user?.fullName} />
                            <InfoRow label="Email" value={user?.email} />
                            <InfoRow label="Phone" value={user?.phone} />
                            <InfoRow
                                label="Member Since"
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

                    {/* Quick Links with staggered animation */}
                    <Stagger className="card p-6 flex flex-col gap-2">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Links</h2>
                        <QuickLink to="/products" label="Browse Products" />
                        <QuickLink to="/wishlist" label="My Wishlist" badge={wishlistCount} />
                        <QuickLink to="/cart" label="My Cart" badge={cartUnits} />
                        <QuickLink to="/orders" label="My Orders" />
                    </Stagger>
                </section>
            </main>
        </div>
    );
};

const InfoRow = ({ label, value }) => (
    <div className="px-4 py-3 rounded-lg bg-slate-50">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm text-slate-800 font-medium mt-1 truncate">{value || '—'}</p>
    </div>
);

const QuickLink = ({ to, label, badge = 0 }) => (
    <StaggerItem>
        <Link
            to={to}
            className="px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-sm flex items-center justify-between transition-colors"
        >
            <span className="flex items-center gap-2">
                {label}
                {badge > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-brand-600 text-white text-[10px] font-bold">
                        {badge}
                    </span>
                )}
            </span>
            <span>→</span>
        </Link>
    </StaggerItem>
);

export default Home;
