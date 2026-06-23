import jwt from 'jsonwebtoken';

/**
 * Generate JWT Access Token
 * @param {Object} user - User object containing id and role
 * @returns {String} Access token
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' }
  );
};

/**
 * Generate JWT Refresh Token
 * @param {Object} user - User object containing id and role
 * @returns {String} Refresh token
 */
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' }
  );
};

/**
 * Verify JWT Access Token
 * @param {String} token - Access token to verify
 * @returns {Object} Decoded payload
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Verify JWT Refresh Token
 * @param {String} token - Refresh token to verify
 * @returns {Object} Decoded payload
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};
