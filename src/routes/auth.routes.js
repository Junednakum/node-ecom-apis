import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import validateRequest from '../middlewares/validation.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from '../validations/auth.validation.js';

const router = Router();

router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);
router.post('/logout', protect, authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', forgotPasswordValidation, validateRequest, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidation, validateRequest, authController.resetPassword);

export default router;
