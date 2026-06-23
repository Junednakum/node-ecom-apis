import { Router } from 'express';
import orderController from '../controllers/order.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import validateRequest from '../middlewares/validation.middleware.js';
import { updateOrderStatusValidation } from '../validations/order.validation.js';

const router = Router();

// Protect all admin routes and restrict to admins only
router.use(protect, restrictTo('admin'));

router.get('/orders', orderController.getAllOrdersAdmin);
router.put('/orders/:id/status', updateOrderStatusValidation, validateRequest, orderController.updateOrderStatusAdmin);

export default router;
