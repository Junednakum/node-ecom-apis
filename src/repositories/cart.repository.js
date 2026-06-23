import prisma from '../config/db.js';

class CartRepository {
  async findByUserId(userId) {
    // Return cart and create one if it doesn't exist
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    return cart;
  }

  async findItemById(id) {
    return prisma.cartItem.findUnique({
      where: { id },
      include: {
        cart: true,
      },
    });
  }

  async addItem(cartId, productId, quantity) {
    return prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        cartId,
        productId,
        quantity,
      },
    });
  }

  async updateItem(id, quantity) {
    return prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });
  }

  async removeItem(id) {
    return prisma.cartItem.delete({
      where: { id },
    });
  }

  async clearCart(cartId) {
    return prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
}

export default new CartRepository();
