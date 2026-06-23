import orderService from '../services/order.service.js';
import { sendResponse } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

class OrderController {
  createOrder = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const order = await orderService.createOrder(userId);

    return sendResponse(res, 201, 'Order created successfully', order);
  });

  getMyOrders = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const orders = await orderService.getMyOrders(userId);

    return sendResponse(res, 200, 'Orders retrieved successfully', orders);
  });

  getOrderById = asyncHandler(async (req, res) => {
    const orderId = parseInt(req.params.id);
    const userId = req.user.id;
    const userRole = req.user.role;
    
    const order = await orderService.getOrderById(orderId, userId, userRole);

    return sendResponse(res, 200, 'Order details retrieved successfully', order);
  });

  getAllOrdersAdmin = asyncHandler(async (req, res) => {
    const orders = await orderService.getAllOrdersAdmin();
    return sendResponse(res, 200, 'All orders retrieved successfully', orders);
  });

  updateOrderStatusAdmin = asyncHandler(async (req, res) => {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    const order = await orderService.updateOrderStatusAdmin(orderId, status);

    return sendResponse(res, 200, 'Order status updated successfully', order);
  });
}

export default new OrderController();
