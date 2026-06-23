import userService from '../services/user.service.js';
import { sendResponse } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

class UserController {
  getProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const user = await userService.getProfile(userId);

    return sendResponse(res, 200, 'User profile retrieved successfully', user);
  });

  updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const updatedUser = await userService.updateProfile(userId, req.body);

    return sendResponse(res, 200, 'User profile updated successfully', updatedUser);
  });

  changePassword = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(userId, currentPassword, newPassword);

    return sendResponse(res, 200, 'Password changed successfully');
  });
}

export default new UserController();
