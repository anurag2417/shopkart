import express from 'express';
import {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart,
    getCartCount,
} from '../controllers/cart.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All cart routes are protected
router.use(protect);

// Count must come before "/:productId" patterns
router.get('/count', getCartCount);

router.get('/', getCart);
router.post('/:productId', addToCart);
router.patch('/:productId', updateCartQuantity);
router.delete('/:productId', removeFromCart);

export default router;
