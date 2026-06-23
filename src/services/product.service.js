import productRepository from '../repositories/product.repository.js';
import categoryRepository from '../repositories/category.repository.js';
import NotFoundError from '../errors/NotFoundError.js';
import BadRequestError from '../errors/BadRequestError.js';

class ProductService {
  async createProduct(productData) {
    // Verify category exists
    const category = await categoryRepository.findById(parseInt(productData.categoryId));
    if (!category) {
      throw new BadRequestError(`Category with ID ${productData.categoryId} does not exist`);
    }

    return productRepository.create(productData);
  }

  async getProducts(options) {
    return productRepository.findAll(options);
  }

  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }
    return product;
  }

  async updateProduct(id, updateData) {
    // Verify product exists
    await this.getProductById(id);

    if (updateData.categoryId) {
      const category = await categoryRepository.findById(parseInt(updateData.categoryId));
      if (!category) {
        throw new BadRequestError(`Category with ID ${updateData.categoryId} does not exist`);
      }
    }

    return productRepository.update(id, updateData);
  }

  async deleteProduct(id) {
    // Verify product exists
    await this.getProductById(id);
    return productRepository.delete(id);
  }
}

export default new ProductService();
