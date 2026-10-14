import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen w-full bg-slate-50">
            <Navbar />

            <main className="w-full px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
                {/* Hero */}
                <section className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-8 sm:p-12 lg:p-16 text-white overflow-hidden relative">
                    <div className="relative z-10 max-w-2xl">
                        <p className="text-brand-100 text-sm font-medium mb-2">Welcome back 👋</p>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                            Hey {user?.fullName?.split(' ')[0] || 'there'}, ready to shop?
                        </h1>
                        <p className="mt-4 text-brand-100 text-base sm:text-lg max-w-xl">
                            Discover thousands of products across electronics, fashion, books and
                            more — all in one place.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-700 font-semibold hover:bg-brand-50 transition-colors"
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
                        </div>
                    </div>

                    {/* decorative circle */}
                    <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10" />
                    <div className="absolute -bottom-32 -right-10 w-96 h-96 rounded-full bg-white/5" />
                </section>

                {/* Account Info Card */}
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

                    <div className="card p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Links</h2>
                        <div className="flex flex-col gap-2">
                            <Link
                                to="/products"
                                className="px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-sm flex items-center justify-between transition-colors"
                            >
                                Browse Products <span>→</span>
                            </Link>
                            <Link
                                to="/products?category=Electronics"
                                className="px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-sm flex items-center justify-between transition-colors"
                            >
                                Electronics <span>→</span>
                            </Link>
                            <Link
                                to="/products?category=Fashion"
                                className="px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-sm flex items-center justify-between transition-colors"
                            >
                                Fashion <span>→</span>
                            </Link>
                            <Link
                                to="/wishlist"
                                className="px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-sm flex items-center justify-between transition-colors"
                            >
                                My Wishlist <span>→</span>
                            </Link>
                            <Link
                                to="/cart"
                                className="px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-sm flex items-center justify-between transition-colors"
                            >
                                My Cart <span>→</span>
                            </Link>
                        </div>
                    </div>
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

export default Home;
