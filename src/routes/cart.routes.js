import { Router } from 'express';
import cartController from '../controllers/cart.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import validateRequest from '../middlewares/validation.middleware.js';
import {
  cartAddValidation,
  cartUpdateValidation,
} from '../validations/cart.validation.js';

const router = Router();

// All cart routes are protected for authenticated users
router.use(protect);

router.get('/', cartController.getCart);
router.post('/add', cartAddValidation, validateRequest, cartController.addToCart);
router.put('/update/:id', cartUpdateValidation, validateRequest, cartController.updateCartItem);
router.delete('/remove/:id', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

export default router;
