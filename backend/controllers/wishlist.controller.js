import mongoose from 'mongoose';
import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';

// -----------------------------------------------------------
// @desc    Add a product to current user's wishlist
// @route   POST /wishlist/:productId
// @access  Protected
// -----------------------------------------------------------
export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        // 1. Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID',
            });
        }

        // 2. Ensure product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // 3. Get current user WITH wishlist
        const user = await Customer.findById(req.user._id);

        // 4. Duplicate check
        const alreadyAdded = user.wishlist.some((id) => id.toString() === productId.toString());

        if (alreadyAdded) {
            return res.status(409).json({
                success: false,
                message: 'Product already in wishlist',
            });
        }

        // 5. Add & save
        user.wishlist.push(product._id);
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Product added to wishlist',
        });
    } catch (error) {
        console.error('Add to wishlist error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while adding to wishlist',
        });
    }
};

// -----------------------------------------------------------
// @desc    Get current user's wishlist
// @route   GET /wishlist
// @access  Protected
// -----------------------------------------------------------
export const getWishlist = async (req, res) => {
    try {
        const user = await Customer.findById(req.user._id).populate({
            path: 'wishlist',
            select: 'name price category image stock description',
        });

        // Filter out any null refs (in case a product was deleted)
        const validItems = user.wishlist.filter((item) => item !== null);

        return res.status(200).json({
            success: true,
            count: validItems.length,
            wishlist: validItems,
        });
    } catch (error) {
        console.error('Get wishlist error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching wishlist',
        });
    }
};

// -----------------------------------------------------------
// @desc    Remove a product from wishlist
// @route   DELETE /wishlist/:productId
// @access  Protected
// -----------------------------------------------------------
export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID',
            });
        }

        const user = await Customer.findById(req.user._id);

        const exists = user.wishlist.some((id) => id.toString() === productId.toString());

        if (!exists) {
            return res.status(404).json({
                success: false,
                message: 'Product not in wishlist',
            });
        }

        user.wishlist = user.wishlist.filter((id) => id.toString() !== productId.toString());
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Product removed from wishlist',
        });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while removing from wishlist',
        });
    }
};

// -----------------------------------------------------------
// @desc    Toggle a product in wishlist (BONUS)
// @route   PATCH /wishlist/:productId/toggle
// @access  Protected
// -----------------------------------------------------------
export const toggleWishlist = async (req, res) => {
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

        const user = await Customer.findById(req.user._id);

        const alreadyAdded = user.wishlist.some((id) => id.toString() === productId.toString());

        if (alreadyAdded) {
            user.wishlist = user.wishlist.filter((id) => id.toString() !== productId.toString());
            await user.save();
            return res.status(200).json({
                success: true,
                saved: false,
                message: 'Product removed from wishlist',
            });
        }

        user.wishlist.push(product._id);
        await user.save();
        return res.status(200).json({
            success: true,
            saved: true,
            message: 'Product added to wishlist',
        });
    } catch (error) {
        console.error('Toggle wishlist error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while toggling wishlist',
        });
    }
};

// -----------------------------------------------------------
// @desc    Get wishlist count (for navbar badge)
// @route   GET /wishlist/count
// @access  Protected
// -----------------------------------------------------------
export const getWishlistCount = async (req, res) => {
    try {
        const user = await Customer.findById(req.user._id).select('wishlist');
        const count = user?.wishlist?.length || 0;
        return res.status(200).json({ success: true, count });
    } catch (error) {
        console.error('Wishlist count error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};
