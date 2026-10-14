import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            default: 1,
            min: [1, 'Quantity cannot be less than 1'],
        },
    },
    { _id: false }, // no extra _id for each cart entry
);

const customerSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        // ❤️ Wishlist - array of Product refs
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                default: [],
            },
        ],
        // 🛒 Cart - array of { product, quantity }
        cart: {
            type: [cartItemSchema],
            default: [],
        },
    },
    { timestamps: true },
);

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
