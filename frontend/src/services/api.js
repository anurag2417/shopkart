import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
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

export default api;
