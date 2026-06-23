import categoryService from '../services/category.service.js';
import { sendResponse } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

class CategoryController {
  createCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const category = await categoryService.createCategory({ name, description });

    return sendResponse(res, 201, 'Category created successfully', category);
  });

  getCategories = asyncHandler(async (req, res) => {
    const categories = await categoryService.getCategories();
    return sendResponse(res, 200, 'Categories retrieved successfully', categories);
  });

  getCategoryById = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const category = await categoryService.getCategoryById(id);

    return sendResponse(res, 200, 'Category retrieved successfully', category);
  });

  updateCategory = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;
    const category = await categoryService.updateCategory(id, { name, description });

    return sendResponse(res, 200, 'Category updated successfully', category);
  });

  deleteCategory = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    await categoryService.deleteCategory(id);
    console.log('Category deleted successfully');
    // return sendResponse(res, 200, 'Category deleted successfully');
  });
}

export default new CategoryController();
