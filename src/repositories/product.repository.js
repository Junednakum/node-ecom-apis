import prisma from '../config/db.js';

class ProductRepository {
  async create(productData) {
    return prisma.product.create({
      data: {
        ...productData,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock),
        categoryId: parseInt(productData.categoryId),
      },
    });
  }

  async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      categoryId,
      minPrice,
      maxPrice,
    } = options;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        where.price.gte = parseFloat(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        where.price.lte = parseFloat(maxPrice);
      }
    }

    const products = await prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const total = await prisma.product.count({ where });

    return {
      products,
      total,
      page: parseInt(page),
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async findById(id) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async update(id, updateData) {
    const data = { ...updateData };
    if (data.price !== undefined) data.price = parseFloat(data.price);
    if (data.stock !== undefined) data.stock = parseInt(data.stock);
    if (data.categoryId !== undefined) data.categoryId = parseInt(data.categoryId);

    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return prisma.product.delete({
      where: { id },
    });
  }
}

export default new ProductRepository();
