import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const CartItem = ({ item }) => {
    const { updateQuantity, removeProduct, isMutating } = useCart();
    const { showToast } = useToast();

    const { product, quantity } = item;
    const busy = isMutating(product._id);

    const atMaxStock = quantity >= product.stock;

    const handleInc = async () => {
        if (busy || atMaxStock) return;
        try {
            await updateQuantity(product._id, quantity + 1);
        } catch (err) {
            showToast(err?.response?.data?.message || 'Could not update quantity', 'error');
        }
    };

    const handleDec = async () => {
        if (busy || quantity <= 1) return;
        try {
            await updateQuantity(product._id, quantity - 1);
        } catch (err) {
            showToast(err?.response?.data?.message || 'Could not update quantity', 'error');
        }
    };

    const handleRemove = async () => {
        if (busy) return;
        try {
            await removeProduct(product._id);
            showToast('Removed from cart', 'info');
        } catch (err) {
            showToast(err?.response?.data?.message || 'Could not remove item', 'error');
        }
    };

    const lineTotal = product.price * quantity;

    return (
        <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 bg-white dark:bg-ink-900 rounded-2xl border border-slate-100 dark:border-ink-800 shadow-sm">
            {/* Image */}
            <Link
                to={`/products/${product._id}`}
                className="w-full sm:w-28 h-40 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-ink-800"
            >
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200?text=No+Image';
                    }}
                />
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <Link to={`/products/${product._id}`}>
                            <h3 className="font-semibold text-slate-900 dark:text-white truncate hover:text-brand-600 transition-colors">
                                {product.name}
                            </h3>
                        </Link>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {product.category}
                        </p>
                    </div>

                    <button
                        onClick={handleRemove}
                        disabled={busy}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1 -mt-1 disabled:opacity-50"
                        aria-label="Remove from cart"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
                            />
                        </svg>
                    </button>
                </div>

                <div className="mt-auto pt-3 flex flex-wrap items-center justify-between gap-3">
                    {/* Quantity controls */}
                    <div className="inline-flex items-center border border-slate-200 dark:border-ink-800 rounded-lg overflow-hidden">
                        <button
                            onClick={handleDec}
                            disabled={busy || quantity <= 1}
                            className="w-9 h-9 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-ink-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>
                        <span className="w-10 h-9 flex items-center justify-center text-sm font-semibold text-slate-900 dark:text-white border-x border-slate-200 dark:border-ink-800">
                            {quantity}
                        </span>
                        <button
                            onClick={handleInc}
                            disabled={busy || atMaxStock}
                            className="w-9 h-9 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-ink-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                    </div>

                    {/* Line total */}
                    <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        ₹{lineTotal.toLocaleString('en-IN')}
                    </p>
                </div>

                {atMaxStock && (
                    <p className="text-xs text-amber-600 mt-2">
                        Maximum available quantity reached
                    </p>
                )}
            </div>
        </div>
    );
};

export default CartItem;
