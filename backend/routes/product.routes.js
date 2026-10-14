import express from 'express';
import {
    createProduct,
    getProducts,
    getProductById,
    getCategories,
} from '../controllers/product.controller.js';

const router = express.Router();

// Order matters - "/categories" must come BEFORE "/:id"
router.get('/categories', getCategories);

router.post('/', createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);

export default router;
