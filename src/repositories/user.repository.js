import prisma from '../config/db.js';

class UserRepository {
  async create(userData) {
    return prisma.user.create({
      data: userData,
    });
  }

  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id, updateData) {
    return prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateRefreshToken(id, token) {
    return prisma.user.update({
      where: { id },
      data: { refreshToken: token },
    });
  }
}

export default new UserRepository();
