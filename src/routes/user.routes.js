import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import validateRequest from '../middlewares/validation.middleware.js';
import {
  updateProfileValidation,
  changePasswordValidation,
} from '../validations/user.validation.js';

const router = Router();

// All user routes are protected
router.use(protect);

router.get('/profile', userController.getProfile);
router.put('/profile', updateProfileValidation, validateRequest, userController.updateProfile);
router.put('/change-password', changePasswordValidation, validateRequest, userController.changePassword);

export default router;
