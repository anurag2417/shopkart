import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import WishlistButton from '../components/WishlistButton';
import AddToCartButton from '../components/AddToCartButton';
import { fetchProductById } from '../services/api';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await fetchProductById(id);
                setProduct(res.data.product);
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load product');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-ink-950">
            <Navbar />

            <main className="w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-white mb-6 transition-colors"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                {loading && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="aspect-square bg-slate-200 rounded-2xl animate-pulse" />
                        <div className="space-y-4">
                            <div className="h-8 bg-slate-200 rounded w-3/4 animate-pulse" />
                            <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
                            <div className="h-4 bg-slate-200 rounded w-2/3 animate-pulse" />
                            <div className="h-10 bg-slate-200 rounded w-1/3 animate-pulse mt-6" />
                            <div className="h-12 bg-slate-200 rounded animate-pulse mt-4" />
                        </div>
                    </div>
                )}

                {!loading && error && (
                    <div className="card p-10 text-center max-w-lg mx-auto">
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
                            {error}
                        </h3>
                        <Link to="/products" className="btn-primary mt-4 inline-flex">
                            Back to Products
                        </Link>
                    </div>
                )}

                {!loading && !error && product && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 animate-fade-in">
                        <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                            <div className="aspect-square bg-slate-100">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src =
                                            'https://via.placeholder.com/600?text=No+Image';
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <span className="inline-flex self-start px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-medium">
                                {product.category}
                            </span>

                            <h1 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                                {product.name}
                            </h1>

                            <p className="mt-4 text-slate-600 leading-relaxed">
                                {product.description}
                            </p>

                            <div className="mt-6 flex items-baseline gap-4">
                                <p className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                                    ₹{product.price.toLocaleString('en-IN')}
                                </p>
                            </div>

                            <div className="mt-4">
                                {product.stock > 0 ? (
                                    <p className="text-sm text-green-600 font-medium">
                                        ✓ In stock - {product.stock} unit
                                        {product.stock !== 1 ? 's' : ''} available
                                    </p>
                                ) : (
                                    <p className="text-sm text-red-500 font-medium">
                                        ✕ Currently out of stock
                                    </p>
                                )}
                            </div>

                            <div className="mt-8 flex flex-col sm:flex-row gap-3">
                                <AddToCartButton product={product} variant="full" />
                                <WishlistButton product={product} variant="full" />
                            </div>

                            <div className="mt-6 px-4 py-3 rounded-lg bg-slate-50 dark:bg-ink-950 text-xs text-slate-500 dark:text-slate-400">
                                🚚 Free delivery on orders above ₹499 · 🔄 7-day returns
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProductDetails;
