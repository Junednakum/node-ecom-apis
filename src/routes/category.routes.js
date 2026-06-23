import { Router } from 'express';
import categoryController from '../controllers/category.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import validateRequest from '../middlewares/validation.middleware.js';
import { categoryValidation } from '../validations/category.validation.js';

const router = Router();

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);

// Admin-only routes
router.use(protect, restrictTo('admin'));
router.post('/', categoryValidation, validateRequest, categoryController.createCategory);
router.put('/:id', categoryValidation, validateRequest, categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;
