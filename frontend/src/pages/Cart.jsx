import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cart, loading, error, subtotal, totalUnits, refreshCart } = useCart();
    const navigate = useNavigate();

    const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 49;
    const total = subtotal + deliveryFee;

    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-ink-950">
            <Navbar />

            <main className="w-full px-4 sm:px-6 lg:px-10 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                        My Cart
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                        {loading
                            ? 'Loading...'
                            : `${totalUnits} item${totalUnits !== 1 ? 's' : ''} in your cart`}
                    </p>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex gap-4 p-5 bg-white dark:bg-ink-900 border border-slate-100 dark:border-ink-800 rounded-2xl animate-pulse"
                                >
                                    <div className="w-28 h-28 rounded-xl bg-slate-200 dark:bg-ink-800" />
                                    <div className="flex-1 space-y-3">
                                        <div className="h-4 bg-slate-200 dark:bg-ink-800 rounded w-2/3" />
                                        <div className="h-4 bg-slate-200 dark:bg-ink-800 rounded w-1/3" />
                                        <div className="h-9 bg-slate-200 dark:bg-ink-800 rounded w-32 mt-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white dark:bg-ink-900 border border-slate-100 dark:border-ink-800 rounded-2xl p-5 h-64 animate-pulse" />
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
                            Unable to load your cart
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">{error}</p>
                        <button onClick={refreshCart} className="btn-primary">
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && cart.length === 0 && (
                    <div className="card p-10 sm:p-16 text-center max-w-lg mx-auto">
                        <div className="text-5xl mb-4">🛒</div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                            Your cart is empty
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                            Looks like you haven't added anything yet.
                        </p>
                        <Link to="/products" className="btn-primary inline-flex">
                            Browse Products
                        </Link>
                    </div>
                )}

                {/* Main grid */}
                {!loading && !error && cart.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                        {/* Cart items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <CartItem key={item.product._id} item={item} />
                            ))}

                            <div className="flex justify-between pt-2">
                                <Link to="/products" className="btn-secondary text-sm">
                                    ← Continue Shopping
                                </Link>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <aside className="lg:col-span-1">
                            <div className="bg-white dark:bg-ink-900 rounded-2xl border border-slate-100 dark:border-ink-800 shadow-sm p-5 sm:p-6 sticky top-24">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                                    Order Summary
                                </h2>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                                        <span>Items ({totalUnits})</span>
                                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                                        <span>Delivery</span>
                                        <span
                                            className={
                                                deliveryFee === 0
                                                    ? 'text-green-600 font-medium'
                                                    : ''
                                            }
                                        >
                                            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                        </span>
                                    </div>
                                    <div className="border-t border-slate-100 dark:border-ink-800 pt-3 flex justify-between text-base font-semibold text-slate-900 dark:text-white">
                                        <span>Total</span>
                                        <span>₹{total.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                {deliveryFee > 0 && (
                                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                                        Add ₹{(499 - subtotal).toLocaleString('en-IN')} more for
                                        free delivery
                                    </p>
                                )}

                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="btn-primary w-full mt-6"
                                >
                                    Proceed to Checkout
                                </button>

                                <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-3">
                                    Secure checkout · 🔒 SSL encrypted
                                </p>
                            </div>
                        </aside>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Cart;
