import productService from '../services/product.service.js';
import { sendResponse } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

class ProductController {
  createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, stock, categoryId, image } = req.body;
    const product = await productService.createProduct({
      name,
      description,
      price,
      stock,
      categoryId,
      image,
    });

    return sendResponse(res, 201, 'Product created successfully', product);
  });

  getProducts = asyncHandler(async (req, res) => {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      categoryId,
      minPrice,
      maxPrice,
    } = req.query;

    const result = await productService.getProducts({
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      categoryId,
      minPrice,
      maxPrice,
    });

    return sendResponse(res, 200, 'Products retrieved successfully', result);
  });

  getProductById = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const product = await productService.getProductById(id);

    return sendResponse(res, 200, 'Product retrieved successfully', product);
  });

  updateProduct = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const product = await productService.updateProduct(id, req.body);

    return sendResponse(res, 200, 'Product updated successfully', product);
  });

  deleteProduct = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    await productService.deleteProduct(id);

    return sendResponse(res, 200, 'Product deleted successfully');
  });
}

export default new ProductController();
