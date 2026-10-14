import mongoose from 'mongoose';
import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';

// -----------------------------------------------------------
// @desc    Add product to cart (or increment quantity)
// @route   POST /cart/:productId
// @access  Protected
// -----------------------------------------------------------
export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID',
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        if (product.stock <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Product is out of stock',
            });
        }

        const user = await Customer.findById(req.user._id);

        const existing = user.cart.find((item) => item.product.toString() === productId);

        if (existing) {
            // Increment by 1 - validate stock
            const nextQty = existing.quantity + 1;
            if (nextQty > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${product.stock} unit(s) available`,
                });
            }
            existing.quantity = nextQty;
        } else {
            user.cart.push({ product: product._id, quantity: 1 });
        }

        await user.save();
        await user.populate({
            path: 'cart.product',
            select: 'name price category image stock',
        });

        return res.status(200).json({
            success: true,
            message: 'Cart updated',
            cart: user.cart,
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while adding to cart',
        });
    }
};

// -----------------------------------------------------------
// @desc    Get current user's cart (populated)
// @route   GET /cart
// @access  Protected
// -----------------------------------------------------------
export const getCart = async (req, res) => {
    try {
        const user = await Customer.findById(req.user._id).populate({
            path: 'cart.product',
            select: 'name price category image stock description',
        });

        // Filter out items whose product has been deleted
        const validCart = user.cart.filter((item) => item.product);

        // Auto-clean orphaned entries in DB
        if (validCart.length !== user.cart.length) {
            user.cart = validCart;
            await user.save();
        }

        return res.status(200).json({
            success: true,
            cart: validCart,
        });
    } catch (error) {
        console.error('Get cart error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching cart',
        });
    }
};

// -----------------------------------------------------------
// @desc    Set exact quantity for a cart item
// @route   PATCH /cart/:productId
// @access  Protected
// -----------------------------------------------------------
export const updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID',
            });
        }

        if (
            quantity === undefined ||
            quantity === null ||
            isNaN(Number(quantity)) ||
            Number(quantity) < 1
        ) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1',
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        const user = await Customer.findById(req.user._id);

        const item = user.cart.find((i) => i.product.toString() === productId);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Product not in cart',
            });
        }

        if (Number(quantity) > product.stock) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} unit(s) available`,
            });
        }

        item.quantity = Number(quantity);
        await user.save();

        await user.populate({
            path: 'cart.product',
            select: 'name price category image stock',
        });

        return res.status(200).json({
            success: true,
            message: 'Quantity updated',
            cart: user.cart,
        });
    } catch (error) {
        console.error('Update cart quantity error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while updating quantity',
        });
    }
};

// -----------------------------------------------------------
// @desc    Remove product from cart
// @route   DELETE /cart/:productId
// @access  Protected
// -----------------------------------------------------------
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID',
            });
        }

        const user = await Customer.findById(req.user._id);

        const exists = user.cart.some((i) => i.product.toString() === productId);

        if (!exists) {
            return res.status(404).json({
                success: false,
                message: 'Product not in cart',
            });
        }

        user.cart = user.cart.filter((i) => i.product.toString() !== productId);
        await user.save();

        await user.populate({
            path: 'cart.product',
            select: 'name price category image stock',
        });

        return res.status(200).json({
            success: true,
            message: 'Product removed from cart',
            cart: user.cart,
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while removing from cart',
        });
    }
};

// -----------------------------------------------------------
// @desc    Get cart total units count (for navbar)
// @route   GET /cart/count
// @access  Protected
// -----------------------------------------------------------
export const getCartCount = async (req, res) => {
    try {
        const user = await Customer.findById(req.user._id).select('cart');
        const count = user?.cart?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
        return res.status(200).json({ success: true, count });
    } catch (error) {
        console.error('Cart count error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};
