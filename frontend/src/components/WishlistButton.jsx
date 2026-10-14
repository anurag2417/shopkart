import { useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

const WishlistButton = ({ product, variant = 'icon', className = '' }) => {
    const { isWishlisted, addProduct, removeProduct } = useWishlist();
    const { showToast } = useToast();
    const [busy, setBusy] = useState(false);

    const saved = isWishlisted(product._id);

    const handleClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (busy) return;

        setBusy(true);
        try {
            if (saved) {
                await removeProduct(product._id);
                showToast('Removed from wishlist', 'info');
            } else {
                await addProduct(product);
                showToast('Added to wishlist ❤️', 'success');
            }
        } catch (err) {
            showToast(
                err?.response?.data?.message || 'Unable to save product. Please try again.',
                'error',
            );
        } finally {
            setBusy(false);
        }
    };

    // Icon-only variant (for product card overlay)
    if (variant === 'icon') {
        return (
            <button
                onClick={handleClick}
                disabled={busy}
                aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur bg-white/90 shadow-sm hover:bg-white transition-all duration-200 disabled:opacity-60 ${
                    saved ? 'text-red-500' : 'text-slate-500 dark:text-slate-400 hover:text-red-500'
                } ${className}`}
            >
                <svg
                    className="w-5 h-5"
                    fill={saved ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                </svg>
            </button>
        );
    }

    // Full variant (for details page)
    return (
        <button
            onClick={handleClick}
            disabled={busy}
            className={`btn-secondary flex-1 ${saved ? 'text-red-600 border-red-200' : ''} ${className}`}
        >
            <span className="flex items-center justify-center gap-2">
                <svg
                    className="w-5 h-5"
                    fill={saved ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                </svg>
                {busy ? 'Saving...' : saved ? 'In Wishlist' : 'Add to Wishlist'}
            </span>
        </button>
    );
};

export default WishlistButton;
