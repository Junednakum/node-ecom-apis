import { validationResult } from 'express-validator';

/**
 * Middleware to check express-validator validation results
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Standardize express-validator output to match required API response format
    const errorMsg = errors.array().map((err) => `${err.path}: ${err.msg}`).join(', ');
    return res.status(400).json({
      success: false,
      message: errorMsg,
    });
  }
  next();
};
export default validateRequest;
