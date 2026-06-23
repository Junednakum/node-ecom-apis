import { Router } from 'express';
import orderController from '../controllers/order.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect all order routes
router.use(protect);

router.post('/', orderController.createOrder);
router.get('/', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);

export default router;
