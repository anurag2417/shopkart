import mongoose from 'mongoose';
import Product from '../models/product.model.js';

// -----------------------------------------------------------
// @desc    Create a new product
// @route   POST /products
// @access  Public (admin auth will be added later)
// -----------------------------------------------------------
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, stock } = req.body;

        // Basic presence validation
        if (!name || !description || !category || !image) {
            return res.status(400).json({
                success: false,
                message: 'name, description, category and image are required',
            });
        }

        if (price === undefined || price === null || Number(price) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Price must be greater than 0',
            });
        }

        if (stock === undefined || stock === null || Number(stock) < 0) {
            return res.status(400).json({
                success: false,
                message: 'Stock cannot be negative',
            });
        }

        const product = await Product.create({
            name,
            description,
            price: Number(price),
            category,
            image,
            stock: Number(stock),
        });

        return res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product,
        });
    } catch (error) {
        console.error('Create product error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while creating product',
        });
    }
};

// -----------------------------------------------------------
// @desc    Get all products (with search, filter, sort)
// @route   GET /products
// @access  Public
// -----------------------------------------------------------
export const getProducts = async (req, res) => {
    try {
        const { search, category, sort } = req.query;

        const query = {};

        // Case-insensitive search on name
        if (search && search.trim()) {
            query.name = { $regex: search.trim(), $options: 'i' };
        }

        // Category filter (case-insensitive exact match)
        if (category && category.trim() && category !== 'All Categories') {
            query.category = { $regex: `^${category.trim()}$`, $options: 'i' };
        }

        // Sorting
        let sortOption = { createdAt: -1 }; // default: newest first
        if (sort === 'price_asc') sortOption = { price: 1 };
        else if (sort === 'price_desc') sortOption = { price: -1 };
        else if (sort === 'name_asc') sortOption = { name: 1 };
        else if (sort === 'name_desc') sortOption = { name: -1 };

        const products = await Product.find(query).sort(sortOption);

        return res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        console.error('Get products error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching products',
        });
    }
};

// -----------------------------------------------------------
// @desc    Get single product by ID
// @route   GET /products/:id
// @access  Public
// -----------------------------------------------------------
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID',
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        return res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        console.error('Get product error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching product',
        });
    }
};

// -----------------------------------------------------------
// @desc    Get distinct categories
// @route   GET /products/categories
// @access  Public
// -----------------------------------------------------------
export const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        return res.status(200).json({
            success: true,
            categories,
        });
    } catch (error) {
        console.error('Get categories error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching categories',
        });
    }
};
