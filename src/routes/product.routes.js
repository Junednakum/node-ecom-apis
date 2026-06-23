import { Router } from 'express';
import productController from '../controllers/product.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import validateRequest from '../middlewares/validation.middleware.js';
import {
  productValidation,
  productUpdateValidation,
} from '../validations/product.validation.js';

const router = Router();

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Admin-only routes
router.use(protect, restrictTo('admin'));
router.post('/', productValidation, validateRequest, productController.createProduct);
router.put('/:id', productUpdateValidation, validateRequest, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;
