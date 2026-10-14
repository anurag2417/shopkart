import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WishlistButton from './WishlistButton';
import AddToCartButton from './AddToCartButton';

const ProductCard = ({ product }) => {
    const inStock = product.stock > 0;
    const lowStock = product.stock > 0 && product.stock <= 5;

    return (
        <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="card overflow-hidden group flex flex-col h-full"
        >
            <div className="relative">
                <Link to={`/products/${product._id}`} className="block">
                    <div className="relative aspect-[4/3] bg-slate-100 dark:bg-ink-800 overflow-hidden">
                        <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                            }}
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 dark:bg-ink-950/90 backdrop-blur text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm">
                            {product.category}
                        </span>
                        {!inStock && (
                            <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-red-500 text-white text-xs font-medium shadow-sm">
                                Out of Stock
                            </span>
                        )}
                        {lowStock && (
                            <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-medium shadow-sm">
                                Only {product.stock} left
                            </span>
                        )}
                    </div>
                </Link>

                <div className="absolute top-3 right-3">
                    <WishlistButton product={product} variant="icon" />
                </div>
            </div>

            <div className="p-4 flex flex-col flex-1">
                <Link to={`/products/${product._id}`}>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base line-clamp-2 hover:text-brand-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 flex-1">
                    {product.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                        ₹{product.price.toLocaleString('en-IN')}
                    </p>
                    <p
                        className={`text-xs font-medium ${
                            inStock ? 'text-green-600' : 'text-red-500'
                        }`}
                    >
                        {inStock ? `${product.stock} in stock` : 'Unavailable'}
                    </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                        to={`/products/${product._id}`}
                        className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-slate-200 dark:border-ink-800 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-900 dark:hover:bg-ink-800 hover:text-white hover:border-slate-900 dark:hover:border-ink-800 transition-all duration-200"
                    >
                        View
                    </Link>
                    <AddToCartButton product={product} variant="card" />
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
