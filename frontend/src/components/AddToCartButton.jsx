import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

/**
 * Props:
 *  - product: full product object
 *  - variant: "card" (compact) | "full" (large, on details page)
 *  - className: extra classes
 */
const AddToCartButton = ({ product, variant = 'card', className = '' }) => {
    const { addProduct, isInCart } = useCart();
    const { showToast } = useToast();
    const [busy, setBusy] = useState(false);

    const inCart = isInCart(product._id);
    const outOfStock = product.stock <= 0;

    const handleClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (busy || outOfStock) return;

        setBusy(true);
        try {
            await addProduct(product._id);
            showToast(inCart ? 'Quantity increased 🛒' : 'Added to cart 🛒', 'success');
        } catch (err) {
            showToast(
                err?.response?.data?.message || 'Unable to add to cart. Please try again.',
                'error',
            );
        } finally {
            setBusy(false);
        }
    };

    const label = busy
        ? 'Adding...'
        : outOfStock
          ? 'Out of Stock'
          : inCart
            ? 'Add Another'
            : 'Add to Cart';

    if (variant === 'full') {
        return (
            <button
                onClick={handleClick}
                disabled={busy || outOfStock}
                className={`btn-primary flex-1 ${className}`}
            >
                {label}
            </button>
        );
    }

    // Compact card variant
    return (
        <button
            onClick={handleClick}
            disabled={busy || outOfStock}
            className={`inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                outOfStock
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-ink-800 dark:text-slate-500'
                    : 'bg-brand-600 text-white hover:bg-brand-700 dark:bg-ink-700 dark:hover:bg-ink-600 active:scale-[0.98]'
            } ${className}`}
        >
            {label}
        </button>
    );
};

export default AddToCartButton;
