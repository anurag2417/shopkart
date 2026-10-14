import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/product.model.js';

dotenv.config();

const sampleProducts = [
    {
        name: 'Studio Pro Wireless Headphones',
        description:
            'Reference-grade over-ear headphones with hybrid active noise cancellation, 40-hour battery, and plush memory-foam earcups. Tuned by Grammy-winning engineers.',
        price: 8499,
        category: 'Audio',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=80',
        stock: 42,
    },
    {
        name: 'Tactile 68 Mechanical Keyboard',
        description:
            '65% hot-swappable mechanical keyboard with gasket mount, CNC aluminum chassis, and lubed linear switches. Includes PBT double-shot keycaps.',
        price: 6299,
        category: 'Peripherals',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1000&q=80',
        stock: 18,
    },
    {
        name: 'Glide Wireless Mouse',
        description:
            'Ultra-light 58g wireless mouse with 26K DPI sensor, 90-hour battery, and 8000Hz polling. Built for competitive gaming and long work sessions.',
        price: 3499,
        category: 'Peripherals',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1000&q=80',
        stock: 65,
    },
    {
        name: 'Trail Runner 3.0',
        description:
            'Breathable mesh running shoes with responsive foam midsole and 4mm drop. Designed for daily training on road and light trail.',
        price: 5999,
        category: 'Footwear',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&q=80',
        stock: 27,
    },
    {
        name: 'Heritage Leather Backpack',
        description:
            'Full-grain leather backpack with padded 16-inch laptop sleeve, water-resistant lining, and brass hardware. Ages beautifully.',
        price: 8999,
        category: 'Bags',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1000&q=80',
        stock: 12,
    },
    {
        name: 'The Pragmatic Programmer — 20th Anniversary',
        description:
            'Updated edition of the classic guide to software craftsmanship. Hardcover with new chapters on modern tooling and career growth.',
        price: 1499,
        category: 'Books',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1000&q=80',
        stock: 120,
    },
    {
        name: 'Designing Data-Intensive Applications',
        description:
            'The definitive guide to distributed systems, storage engines, and consistency models. Required reading for backend engineers.',
        price: 2199,
        category: 'Books',
        image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=1000&q=80',
        stock: 84,
    },
    {
        name: 'Ceramic Pour-Over Set',
        description:
            'Hand-thrown ceramic dripper with matching carafe. Even heat retention for a clean, bright cup. Dishwasher safe.',
        price: 1899,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=1000&q=80',
        stock: 55,
    },
    {
        name: 'Ember Soy Candle Trio',
        description:
            'Small-batch soy candles in Cedar, Vetiver, and Amber. 45-hour burn time each, cotton wicks, phthalate-free fragrance.',
        price: 1499,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=1000&q=80',
        stock: 33,
    },
    {
        name: 'Pulse Smartwatch Series 6',
        description:
            'AMOLED always-on display, dual-band GPS, ECG, SpO2, and 7-day battery. Titanium case with sapphire crystal.',
        price: 14999,
        category: 'Wearables',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&q=80',
        stock: 15,
    },
    {
        name: 'Merino Wool Crewneck',
        description:
            'Mid-weight 100% merino wool sweater, mulesing-free. Temperature-regulating and odor-resistant. Made in Portugal.',
        price: 4299,
        category: 'Apparel',
        image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=1000&q=80',
        stock: 40,
    },
    {
        name: 'Walnut Desk Organizer',
        description:
            'Solid American walnut organizer with slots for pens, cards, and a phone. Finished with natural oil and wax.',
        price: 2299,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1000&q=80',
        stock: 22,
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
