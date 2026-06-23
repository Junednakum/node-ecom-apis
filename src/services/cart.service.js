import cartRepository from '../repositories/cart.repository.js';
import productRepository from '../repositories/product.repository.js';
import NotFoundError from '../errors/NotFoundError.js';
import ForbiddenError from '../errors/ForbiddenError.js';
import BadRequestError from '../errors/BadRequestError.js';

class CartService {
  async getCart(userId) {
    return cartRepository.findByUserId(userId);
  }

  async addToCart(userId, productId, quantity) {
    // Check product existence and stock
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new NotFoundError(`Product with ID ${productId} not found`);
    }

    if (product.stock < quantity) {
      throw new BadRequestError(`Only ${product.stock} items left in stock`);
    }

    const cart = await cartRepository.findByUserId(userId);
    return cartRepository.addItem(cart.id, productId, quantity);
  }

  async updateCartItem(userId, cartItemId, quantity) {
    const cartItem = await cartRepository.findItemById(cartItemId);
    if (!cartItem) {
      throw new NotFoundError(`Cart item with ID ${cartItemId} not found`);
    }

    // Security: verify the cart item belongs to the calling user
    if (cartItem.cart.userId !== userId) {
      throw new ForbiddenError('You do not have access to this cart item');
    }

    // Check stock
    const product = await productRepository.findById(cartItem.productId);
    if (product.stock < quantity) {
      throw new BadRequestError(`Only ${product.stock} items left in stock`);
    }

    return cartRepository.updateItem(cartItemId, quantity);
  }

  async removeFromCart(userId, cartItemId) {
    const cartItem = await cartRepository.findItemById(cartItemId);
    if (!cartItem) {
      throw new NotFoundError(`Cart item with ID ${cartItemId} not found`);
    }

    if (cartItem.cart.userId !== userId) {
      throw new ForbiddenError('You do not have access to this cart item');
    }

    return cartRepository.removeItem(cartItemId);
  }

  async clearCart(userId) {
    const cart = await cartRepository.findByUserId(userId);
    return cartRepository.clearCart(cart.id);
  }
}

export default new CartService();
