import axios from 'axios';

// 🔑 Uses VITE_API_URL in production (set on Vercel).
//    Falls back to localhost for local dev.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

// -----------------------------------------------------------
// AUTH
// -----------------------------------------------------------
export const registerCustomer = (data) => api.post('/customers/register', data);
export const loginCustomer = (data) => api.post('/customers/login', data);
export const getMyProfile = () => api.get('/customers/me');
export const logoutCustomer = () => api.post('/customers/logout');
export const changePassword = (data) => api.patch('/customers/change-password', data);

// -----------------------------------------------------------
// PRODUCTS
// -----------------------------------------------------------
export const fetchProducts = (params = {}) => api.get('/products', { params });
export const fetchProductById = (id) => api.get(`/products/${id}`);
export const fetchCategories = () => api.get('/products/categories');

// -----------------------------------------------------------
// WISHLIST
// -----------------------------------------------------------
export const getWishlist = () => api.get('/wishlist');
export const addToWishlist = (productId) => api.post(`/wishlist/${productId}`);
export const removeFromWishlist = (productId) => api.delete(`/wishlist/${productId}`);
export const toggleWishlist = (productId) => api.patch(`/wishlist/${productId}/toggle`);
export const getWishlistCount = () => api.get('/wishlist/count');

// -----------------------------------------------------------
// CART
// -----------------------------------------------------------
export const getCart = () => api.get('/cart');
export const addToCart = (productId) => api.post(`/cart/${productId}`);
export const updateCartQuantity = (productId, quantity) =>
    api.patch(`/cart/${productId}`, { quantity });
export const removeFromCart = (productId) => api.delete(`/cart/${productId}`);
export const getCartCount = () => api.get('/cart/count');

// -----------------------------------------------------------
// ORDERS
// -----------------------------------------------------------
export const createPaymentOrder = (shippingAddress) =>
    api.post('/orders/create-payment-order', { shippingAddress });
export const verifyPayment = (payload) => api.post('/orders/verify-payment', payload);
export const getMyOrders = () => api.get('/orders');
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, { status });

export default api;
