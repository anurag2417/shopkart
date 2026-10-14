import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
    getCart,
    addToCart as addAPI,
    updateCartQuantity as updateAPI,
    removeFromCart as removeAPI,
} from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mutating, setMutating] = useState({});

    const refreshCart = useCallback(async () => {
        if (!user) {
            setCart([]);
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await getCart();
            setCart(res.data.cart || []);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to load cart');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const setMutatingFor = (id, value) =>
        setMutating((prev) => {
            const next = { ...prev };
            if (value) next[id] = true;
            else delete next[id];
            return next;
        });

    const isMutating = (productId) => Boolean(mutating[productId]);

    const addProduct = async (productId) => {
        setMutatingFor(productId, true);
        try {
            const res = await addAPI(productId);
            setCart(res.data.cart || []);
            return { success: true };
        } catch (err) {
            throw err;
        } finally {
            setMutatingFor(productId, false);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        setMutatingFor(productId, true);
        const prev = cart;
        setCart((items) =>
            items.map((i) => (i.product._id === productId ? { ...i, quantity } : i)),
        );
        try {
            const res = await updateAPI(productId, quantity);
            setCart(res.data.cart || []);
            return { success: true };
        } catch (err) {
            setCart(prev);
            throw err;
        } finally {
            setMutatingFor(productId, false);
        }
    };

    const removeProduct = async (productId) => {
        setMutatingFor(productId, true);
        const prev = cart;
        setCart((items) => items.filter((i) => i.product._id !== productId));
        try {
            const res = await removeAPI(productId);
            setCart(res.data.cart || []);
            return { success: true };
        } catch (err) {
            setCart(prev);
            throw err;
        } finally {
            setMutatingFor(productId, false);
        }
    };

    // 🆕 Called after successful payment verification
    const clearCartLocal = () => setCart([]);

    const itemCount = cart.length;
    const totalUnits = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
    const subtotal = useMemo(
        () => cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0),
        [cart],
    );

    const getQuantity = (productId) => {
        const item = cart.find((i) => i.product._id === productId);
        return item?.quantity || 0;
    };

    const isInCart = (productId) => cart.some((i) => i.product._id === productId);

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                error,
                itemCount,
                totalUnits,
                subtotal,
                refreshCart,
                addProduct,
                updateQuantity,
                removeProduct,
                isMutating,
                getQuantity,
                isInCart,
                clearCartLocal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside CartProvider');
    return ctx;
};
