import './config/env.js';

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import connectDB from './config/db.js';
import customerRoutes from './routes/customer.routes.js';
import productRoutes from './routes/product.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';

connectDB();

const app = express();

// ------------------ TRUST PROXY (Render / Vercel) ------------------
// Needed so `secure` cookies work behind a reverse proxy.
app.set('trust proxy', 1);

// ------------------ CORS ------------------
// CLIENT_URL can be a single URL or a comma-separated list.
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim());

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (Postman, curl, mobile apps)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error(`CORS blocked: ${origin}`));
        },
        credentials: true,
    }),
);

// ------------------ BODY PARSERS ------------------
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ------------------ HEALTH CHECK ------------------
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🛒 ShopKart API is running',
        version: '1.0.0',
        env: process.env.NODE_ENV || 'development',
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// ------------------ ROUTES ------------------
app.use('/customers', customerRoutes);
app.use('/products', productRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

// ------------------ 404 ------------------
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

// ------------------ GLOBAL ERROR ------------------
app.use((err, req, res, next) => {
    console.error('Global error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 CORS allowed origins: ${allowedOrigins.join(', ')}`);
});
