import authService from '../services/auth.service.js';
import { sendResponse } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

const setTokenCookies = (res, accessToken, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  };

  // Set access token cookie (15 mins)
  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  // Set refresh token cookie (7 days)
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearTokenCookies = (res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  };

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
};

class AuthController {
  register = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    const result = await authService.register({ name, email, password, role });

    setTokenCookies(res, result.accessToken, result.refreshToken);

    return sendResponse(res, 201, 'User registered successfully', {
      user: result.user,
      accessToken: result.accessToken,
    });
  });


  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    setTokenCookies(res, result.accessToken, result.refreshToken);

    return sendResponse(res, 200, 'User logged in successfully', {
      user: result.user,
      accessToken: result.accessToken,
    });
  });

  logout = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    await authService.logout(userId);

    clearTokenCookies(res);

    return sendResponse(res, 200, 'User logged out successfully');
  });

  refreshToken = asyncHandler(async (req, res) => {
    // Attempt to read from cookies first, then fallback to body
    const token = req.cookies.refreshToken || req.body.refreshToken;
    const result = await authService.refreshToken(token);

    setTokenCookies(res, result.accessToken, result.refreshToken);

    return sendResponse(res, 200, 'Token refreshed successfully', {
      accessToken: result.accessToken,
    });
  });

  forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);

    return sendResponse(res, 200, 'Password reset instructions logged to console/simulated', {
      resetToken: result.resetToken,
    });
  });

  resetPassword = asyncHandler(async (req, res) => {
    const { email, resetToken, newPassword } = req.body;
    await authService.resetPassword(email, resetToken, newPassword);

    return sendResponse(res, 200, 'Password has been reset successfully');
  });
}

export default new AuthController();
