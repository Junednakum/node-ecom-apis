import prisma from '../config/db.js';

class CategoryRepository {
  async create(categoryData) {
    return prisma.category.create({
      data: categoryData,
    });
  }

  async findAll() {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id) {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  async findByName(name) {
    return prisma.category.findUnique({
      where: { name },
    });
  }

  async update(id, updateData) {
    return prisma.category.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id) {
    return prisma.category.delete({
      where: { id },
    });
  }
}

export default new CategoryRepository();
