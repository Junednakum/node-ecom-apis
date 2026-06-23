import orderRepository from '../repositories/order.repository.js';
import cartRepository from '../repositories/cart.repository.js';
import productRepository from '../repositories/product.repository.js';
import BadRequestError from '../errors/BadRequestError.js';
import NotFoundError from '../errors/NotFoundError.js';
import ForbiddenError from '../errors/ForbiddenError.js';

class OrderService {
  async createOrder(userId) {
    // 1. Fetch user's cart
    const cart = await cartRepository.findByUserId(userId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestError('Cannot create an order with an empty cart');
    }

    // 2. Calculate total amount and prepare order items with current prices
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = await productRepository.findById(item.productId);
      if (!product) {
        throw new NotFoundError(`Product with ID ${item.productId} in your cart no longer exists`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestError(`Insufficient stock for product "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`);
      }

      const price = parseFloat(product.price);
      totalAmount += price * item.quantity;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: price,
      });
    }

    // 3. Create order, subtract stock, and clear cart inside Repository Transaction
    return orderRepository.createOrder({
      userId,
      totalAmount,
      orderItems,
      cartId: cart.id,
    });
  }

  async getMyOrders(userId) {
    return orderRepository.findByUserId(userId);
  }

  async getOrderById(orderId, userId, userRole) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError(`Order with ID ${orderId} not found`);
    }

    // Security: restrict user from viewing other users' orders
    if (userRole !== 'admin' && order.userId !== userId) {
      throw new ForbiddenError('You do not have access to view this order');
    }

    return order;
  }

  async getAllOrdersAdmin() {
    return orderRepository.findAll();
  }

  async updateOrderStatusAdmin(orderId, status) {
    const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestError(`Invalid order status. Allowed: ${validStatuses.join(', ')}`);
    }

    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError(`Order with ID ${orderId} not found`);
    }

    return orderRepository.updateStatus(orderId, status);
  }
}

export default new OrderService();
