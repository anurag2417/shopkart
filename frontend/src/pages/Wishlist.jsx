import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import WishlistCard from '../components/WishlistCard';
import { useWishlist } from '../context/WishlistContext';

const Wishlist = () => {
    const { wishlist, loading, error, refreshWishlist } = useWishlist();

    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-ink-950">
            <Navbar />

            <main className="w-full px-4 sm:px-6 lg:px-10 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                        My Wishlist
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                        {loading
                            ? 'Loading...'
                            : `${wishlist.length} product${wishlist.length !== 1 ? 's' : ''} saved`}
                    </p>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="card overflow-hidden animate-pulse">
                                <div className="aspect-[4/3] bg-slate-200" />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                                    <div className="h-6 bg-slate-200 rounded w-1/2" />
                                    <div className="h-10 bg-slate-200 rounded mt-3" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="card p-10 text-center max-w-md mx-auto">
                        <div className="inline-flex w-14 h-14 rounded-full bg-red-50 items-center justify-center mb-4">
                            <svg
                                className="w-7 h-7 text-red-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                            Unable to load wishlist
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">{error}</p>
                        <button onClick={refreshWishlist} className="btn-primary">
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && wishlist.length === 0 && (
                    <div className="card p-10 sm:p-16 text-center max-w-lg mx-auto">
                        <div className="text-5xl mb-4">❤️</div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                            Your wishlist is empty
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                            Save products you love and find them here later.
                        </p>
                        <Link to="/products" className="btn-primary inline-flex">
                            Browse Products
                        </Link>
                    </div>
                )}

                {/* Grid */}
                {!loading && !error && wishlist.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fade-in">
                        {wishlist.map((p) => (
                            <WishlistCard key={p._id} product={p} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Wishlist;
