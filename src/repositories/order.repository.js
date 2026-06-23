import prisma from '../config/db.js';

class OrderRepository {
  async createOrder({ userId, totalAmount, orderItems, cartId }) {
    return prisma.$transaction(async (tx) => {
      // 1. Create Order and OrderItems
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: 'pending',
          paymentStatus: 'unpaid',
          items: {
            create: orderItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // 2. Reduce stock for each product & check availability
      for (const item of orderItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`);
        }

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      // 3. Clear the Cart items
      await tx.cartItem.deleteMany({
        where: { cartId },
      });

      return order;
    });
  }

  async findAll() {
    return prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUserId(userId) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async updateStatus(id, status) {
    // If the status is being updated to paid, let's also update paymentStatus accordingly
    const updateData = { status };
    if (status === 'paid') {
      updateData.paymentStatus = 'paid';
    }

    return prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}

export default new OrderRepository();
