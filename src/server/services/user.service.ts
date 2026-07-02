import { userRepository } from "../repositories/user.repository";

export class UserService {
  async getUserProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async registerUser(email: string, tenantId: string, roleId: string, name?: string) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new Error("User already exists");
    }
    return userRepository.create({ email, name, tenantId, roleId });
  }
}

export const userService = new UserService();
