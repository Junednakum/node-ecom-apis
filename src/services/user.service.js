import userRepository from '../repositories/user.repository.js';
import BadRequestError from '../errors/BadRequestError.js';
import { hashPassword, comparePassword } from '../utils/hash.js';

class UserService {
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new BadRequestError('User not found');
    }
    return user;
  }

  async updateProfile(userId, profileData) {
    // Prevent email and password update through general profile update
    const { email, password, role, ...allowedUpdates } = profileData;
    
    // Check email availability if they try to update email (or block email updates completely)
    // Here we enforce that email and role cannot be changed via profile update route.
    return userRepository.update(userId, allowedUpdates);
  }

  async changePassword(userId, currentPassword, newPassword) {
    // To check password, we need the hashed password field, which findById excludes by default.
    // So we fetch user using findByEmail (or fetch whole db record).
    const userProfile = await userRepository.findById(userId);
    const user = await userRepository.findByEmail(userProfile.email);

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestError('Current password is incorrect');
    }

    const hashedNewPassword = await hashPassword(newPassword);
    await userRepository.update(userId, {
      password: hashedNewPassword,
    });

    return true;
  }
}

export default new UserService();
