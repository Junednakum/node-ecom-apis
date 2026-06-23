import { body } from 'express-validator';

export const updateOrderStatusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Order status is required')
    .isIn(['pending', 'paid', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status. Allowed values: pending, paid, shipped, delivered, cancelled'),
];
