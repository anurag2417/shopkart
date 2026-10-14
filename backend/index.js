import './config/env.js'; // 🔑 MUST be the very first import

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
// Required for `secure` cookies behind a reverse proxy.
app.set('trust proxy', 1);

// ------------------ CORS ------------------
// Read CLIENT_URL at request time (not import time) so Render env changes
// are picked up immediately after a redeploy.
const getAllowedOrigins = () => {
    const raw = process.env.CLIENT_URL || 'http://localhost:5173';
    return raw
        .split(',')
        .map((s) => s.trim().replace(/\/$/, '')) // strip trailing slash
        .filter(Boolean);
};

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (Postman, curl, mobile apps, server-to-server)
        if (!origin) return callback(null, true);

        const allowed = getAllowedOrigins();
        const clean = origin.replace(/\/$/, '');

        if (allowed.includes(clean)) {
            return callback(null, true);
        }

        // 🚫 Do NOT throw - silently deny. Throwing causes a 500 error
        // which the browser reports as a CORS failure.
        console.warn(`⚠️ CORS blocked origin: ${origin}`);
        return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400, // Cache preflight for 24h
};

// Handle preflight for all routes
app.options('*', cors(corsOptions));

// Apply CORS to all requests
app.use(cors(corsOptions));

// ------------------ BODY PARSERS ------------------
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ------------------ HEALTH / ROOT ------------------
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🛒 ShopKart API is running',
        version: '1.0.0',
        env: process.env.NODE_ENV || 'development',
        allowedOrigins: getAllowedOrigins(), // 👈 helpful for debugging
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
    console.log(`🌍 CORS allowed origins: ${getAllowedOrigins().join(', ')}`);
});
