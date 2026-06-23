import cartService from '../services/cart.service.js';
import { sendResponse } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

class CartController {
  getCart = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const cart = await cartService.getCart(userId);

    return sendResponse(res, 200, 'Cart retrieved successfully', cart);
  });

  addToCart = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;
    const cartItem = await cartService.addToCart(userId, productId, quantity);

    return sendResponse(res, 201, 'Product added to cart successfully', cartItem);
  });

  updateCartItem = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const cartItemId = parseInt(req.params.id);
    const { quantity } = req.body;
    const cartItem = await cartService.updateCartItem(userId, cartItemId, quantity);

    return sendResponse(res, 200, 'Cart item updated successfully', cartItem);
  });

  removeFromCart = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const cartItemId = parseInt(req.params.id);
    await cartService.removeFromCart(userId, cartItemId);

    return sendResponse(res, 200, 'Cart item removed successfully');
  });

  clearCart = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    await cartService.clearCart(userId);

    return sendResponse(res, 200, 'Cart cleared successfully');
  });
}

export default new CartController();
