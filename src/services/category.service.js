import categoryRepository from '../repositories/category.repository.js';
import productRepository from '../repositories/product.repository.js';
import BadRequestError from '../errors/BadRequestError.js';
import NotFoundError from '../errors/NotFoundError.js';

class CategoryService {
  async createCategory(categoryData) {
    const existing = await categoryRepository.findByName(categoryData.name);
    if (existing) {
      throw new BadRequestError(`Category "${categoryData.name}" already exists`);
    }
    return categoryRepository.create(categoryData);
  }

  async getCategories() {
    return categoryRepository.findAll();
  }

  async getCategoryById(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError(`Category with ID ${id} not found`);
    }
    return category;
  }

  async updateCategory(id, updateData) {
    // Check if category exists
    await this.getCategoryById(id);

    if (updateData.name) {
      const existing = await categoryRepository.findByName(updateData.name);
      if (existing && existing.id !== id) {
        throw new BadRequestError(`Category name "${updateData.name}" is already taken`);
      }
    }

    return categoryRepository.update(id, updateData);
  }

  async deleteCategory(id) {
    // Check if category exists
    await this.getCategoryById(id);
    const productCount = await productRepository.findById(id);

    if (productCount > 0) {
      throw new BadRequestError('Cannot delete category. Please delete all products associated with this category first.');
    }
    return categoryRepository.delete(id);
  }
}

export default new CategoryService();
