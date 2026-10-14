import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

const WishlistCard = ({ product }) => {
    const { removeProduct } = useWishlist();
    const { showToast } = useToast();
    const [removing, setRemoving] = useState(false);

    const inStock = product.stock > 0;

    const handleRemove = async () => {
        if (removing) return;
        setRemoving(true);
        try {
            await removeProduct(product._id);
            showToast('Removed from wishlist', 'info');
        } catch (err) {
            showToast(err?.response?.data?.message || 'Unable to remove product.', 'error');
        } finally {
            setRemoving(false);
        }
    };

    return (
        <div className="card overflow-hidden flex flex-col">
            <Link to={`/products/${product._id}`}>
                <div className="relative aspect-[4/3] bg-slate-100 dark:bg-ink-800 overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 dark:bg-ink-950/90 backdrop-blur text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm">
                        {product.category}
                    </span>
                </div>
            </Link>

            <div className="p-4 flex flex-col flex-1">
                <Link to={`/products/${product._id}`}>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base line-clamp-2 hover:text-brand-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-3 flex items-center justify-between">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                        ₹{product.price.toLocaleString('en-IN')}
                    </p>
                    <p
                        className={`text-xs font-medium ${inStock ? 'text-green-600' : 'text-red-500'}`}
                    >
                        {inStock ? `${product.stock} in stock` : 'Out of stock'}
                    </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link to={`/products/${product._id}`} className="btn-primary text-sm py-2">
                        View
                    </Link>
                    <button
                        onClick={handleRemove}
                        disabled={removing}
                        className="btn-secondary text-sm py-2 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/60 dark:hover:bg-red-950/40"
                    >
                        {removing ? 'Removing...' : 'Remove'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WishlistCard;
