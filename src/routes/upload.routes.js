import { Router } from 'express';
import uploadController from '../controllers/upload.controller.js';
import upload from '../middlewares/upload.middleware.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect image upload. In a production environment, typically only admin can upload product images.
router.post(
  '/',
  protect,
  restrictTo('admin'),
  upload.single('image'),
  uploadController.uploadImage
);

export default router;
