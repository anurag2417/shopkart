import express from 'express';
import {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
    toggleWishlist,
    getWishlistCount,
} from '../controllers/wishlist.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All wishlist routes are protected
router.use(protect);

// Count must come BEFORE "/:productId" patterns
router.get('/count', getWishlistCount);

router.get('/', getWishlist);
router.post('/:productId', addToWishlist);
router.patch('/:productId/toggle', toggleWishlist);
router.delete('/:productId', removeFromWishlist);

export default router;
