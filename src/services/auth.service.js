import sendEmail from '../utils/sendEmail.js';
import userRepository from '../repositories/user.repository.js';
import BadRequestError from '../errors/BadRequestError.js';
import UnauthorizedError from '../errors/UnauthorizedError.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token.js';
import getTemplate from '../services/email.service.js';
import UserResource from '../resources/user.resource.js';
import { emailQueue } from '../queues/email.queue.js';

class AuthService {
  async register(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new BadRequestError('Email is already registered');
    }

    const hashedPassword = await hashPassword(userData.password);
    const user = await userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    // Create accessToken and refreshToken
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token to user
    await userRepository.updateRefreshToken(user.id, refreshToken);

    const html = getTemplate('accountCreated', {
      name: user.name,
      email: user.email,
    });

    // await sendEmail({
    //   to: user.email,
    //   subject: 'Account Created',
    //   html,
    // });

    // await emailQueue.add('send-email', {
    //   email: 'test@gmail.com',
    //   name: 'John'
    // });

    await emailQueue.add('send-email', {
      to: user.email,
      subject: 'Account Created',
      html,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await userRepository.updateRefreshToken(user.id, refreshToken);
    const userData = UserResource.transform(user);
    return {
      user: userData,
      accessToken,
      refreshToken,
    };
  }

  async logout(userId) {
    await userRepository.updateRefreshToken(userId, null);
    return true;
  }

  async refreshToken(token) {
    if (!token) {
      throw new UnauthorizedError('Refresh token is required');
    }

    try {
      const decoded = verifyRefreshToken(token);
      const user = await userRepository.findById(decoded.id);

      // Verify that the user still exists
      if (!user) {
        throw new UnauthorizedError('User no longer exists');
      }

      // Fetch the user's DB record to compare the refresh token
      const dbUser = await userRepository.findByEmail(user.email);
      if (dbUser.refreshToken !== token) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      const accessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      await userRepository.updateRefreshToken(user.id, newRefreshToken);

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  // Simulation of forgot password flow for production-grade capability
  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestError('No user found with that email address');
    }

    // Mock reset token generation
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    console.log(`[FORGOT PASSWORD] Password reset token for ${email}: ${resetToken}`);
    
    // In production, send email here. Return true for simulation.
    return { resetToken };
  }

  async resetPassword(email, resetToken, newPassword) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestError('User not found');
    }

    // In a real application, you'd verify the token from a cache/database.
    // For portfolio project, we simulate acceptance if token is provided.
    if (!resetToken) {
      throw new BadRequestError('Reset token is required');
    }

    const hashedPassword = await hashPassword(newPassword);
    await userRepository.update(user.id, {
      password: hashedPassword,
    });

    return true;
  }
}

export default new AuthService();
