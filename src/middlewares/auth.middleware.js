import prisma from '../config/db.js';
import UnauthorizedError from '../errors/UnauthorizedError.js';
import ForbiddenError from '../errors/ForbiddenError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { verifyAccessToken } from '../utils/token.js';

/**
 * Middleware to protect routes and verify JWT access token
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  // Extract token from Authorization header or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(new UnauthorizedError('You are not logged in. Please log in to gain access.'));
  }

  try {
    // Verify token
    const decoded = verifyAccessToken(token);
    
    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return next(new UnauthorizedError('The user belonging to this token no longer exists.'));
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    return next(new UnauthorizedError('Invalid or expired token. Please log in again.'));
  }
});

/**
 * Middleware to restrict access based on roles
 * @param {...String} roles - Array of allowed roles
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permission to perform this action.'));
    }
    next();
  };
};
