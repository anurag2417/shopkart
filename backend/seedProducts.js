import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/product.model.js';

dotenv.config();

const sampleProducts = [
    {
        name: 'Noise Cancelling Headphones',
        description:
            'Wireless over-ear headphones with active noise cancellation and 30-hour battery life.',
        price: 4999,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        stock: 25,
    },
    {
        name: 'Mechanical Keyboard',
        description: 'RGB mechanical keyboard with blue switches and aluminum frame.',
        price: 2999,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
        stock: 10,
    },
    {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with precision tracking and silent clicks.',
        price: 1499,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
        stock: 40,
    },
    {
        name: 'Running Sneakers',
        description: 'Lightweight running shoes with breathable mesh and cushioned soles.',
        price: 3499,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
        stock: 15,
    },
    {
        name: 'Leather Backpack',
        description: 'Premium leather backpack with laptop compartment and water resistance.',
        price: 2499,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
        stock: 8,
    },
    {
        name: 'Clean Code',
        description: 'A Handbook of Agile Software Craftsmanship by Robert C. Martin.',
        price: 899,
        category: 'Books',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
        stock: 30,
    },
    {
        name: 'Atomic Habits',
        description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones by James Clear.',
        price: 699,
        category: 'Books',
        image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&q=80',
        stock: 50,
    },
    {
        name: 'Ceramic Coffee Mug',
        description: 'Minimalist 350ml ceramic coffee mug, microwave and dishwasher safe.',
        price: 399,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
        stock: 100,
    },
    {
        name: 'Scented Candle Set',
        description: 'Set of 3 hand-poured soy wax candles with natural essential oils.',
        price: 1199,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=800&q=80',
        stock: 20,
    },
    {
        name: 'Smart Watch',
        description: 'Fitness smart watch with heart-rate monitoring, GPS and AMOLED display.',
        price: 6999,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        stock: 12,
    },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        await Product.deleteMany({});
        console.log('🧹 Cleared existing products');

        const inserted = await Product.insertMany(sampleProducts);
        console.log(`🌱 Seeded ${inserted.length} products`);

        await mongoose.disconnect();
        console.log('👋 Disconnected');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seed();
