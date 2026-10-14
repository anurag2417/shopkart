import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
    getWishlist,
    addToWishlist as addAPI,
    removeFromWishlist as removeAPI,
} from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Load wishlist when user logs in
    const refreshWishlist = useCallback(async () => {
        if (!user) {
            setWishlist([]);
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await getWishlist();
            setWishlist(res.data.wishlist || []);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        refreshWishlist();
    }, [refreshWishlist]);

    // Derived - Set of ids for O(1) lookup
    const wishlistIds = new Set(wishlist.map((p) => p._id));

    const isWishlisted = (productId) => wishlistIds.has(productId);

    // Add - optimistic with rollback
    const addProduct = async (product) => {
        const previous = wishlist;
        // optimistic
        setWishlist((prev) => [...prev, product]);
        try {
            await addAPI(product._id);
            return { success: true };
        } catch (err) {
            setWishlist(previous);
            throw err;
        }
    };

    // Remove - optimistic with rollback
    const removeProduct = async (productId) => {
        const previous = wishlist;
        setWishlist((prev) => prev.filter((p) => p._id !== productId));
        try {
            await removeAPI(productId);
            return { success: true };
        } catch (err) {
            setWishlist(previous);
            throw err;
        }
    };

    const toggleProduct = async (product) => {
        if (isWishlisted(product._id)) {
            return removeProduct(product._id);
        }
        return addProduct(product);
    };

    const count = wishlist.length;

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                loading,
                error,
                count,
                isWishlisted,
                addProduct,
                removeProduct,
                toggleProduct,
                refreshWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
    return ctx;
};
