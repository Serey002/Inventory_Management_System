import bcrypt from "bcryptjs";
import { Users } from "../Entities/Users";
import { UserRepository } from "../repositories/UserRepository";
import { SafeUser } from "../types/authType";
import { ValidationError, NotFoundError, ConflictError } from "../errors/AppError";

export class UserService {
  private static readonly SALT_ROUNDS = 12;

  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Get all users (returns sanitized data without passwords)
   */
  async getAll(): Promise<SafeUser[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => this.sanitizeUser(user));
  }

  /**
   * Get user by ID (returns sanitized data)
   */
  async getUserById(id: number): Promise<SafeUser | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    return this.sanitizeUser(user);
  }

  /**
   * Get user by email (returns sanitized data)
   */
  async getUserByEmail(email: string): Promise<SafeUser | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;
    return this.sanitizeUser(user);
  }

  /**
   * Create user with password hashing
   */
  async createUser(data: Partial<Users>): Promise<SafeUser> {
    // Validate required fields
    if (!data.name || !data.email || !data.password) {
      throw new ValidationError("Name, email, and password are required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new ValidationError("Invalid email format");
    }

    // Check if user already exists
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new ConflictError("Email already in use");
    }

    // Validate password strength
    if (!this.isStrongPassword(data.password)) {
      throw new ValidationError(
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, UserService.SALT_ROUNDS);

    const user = new Users();
    user.name = data.name.trim();
    user.email = data.email.toLowerCase().trim();
    user.password = hashedPassword;
    user.isActive = true;
    user.lastLoginAt = null;

    if (data.roleId) {
      user.roleId = data.roleId;
    }

    const saved = await this.userRepository.save(user);
    return this.sanitizeUser(saved);
  }

  /**
   * Update user - with restricted field updates and password hashing
   */
  async updateUser(id: number, data: Partial<Users>): Promise<SafeUser | null> {
    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("User not found");
    }

    // Only allow updating specific fields
    const allowedFields = ["name", "password", "isActive"];
    const updates: Partial<Users> = {};

    for (const field of allowedFields) {
      if (field in data) {
        if (field === "name" && typeof data.name === "string") {
          updates.name = data.name.trim();
        } else if (field === "password" && typeof data.password === "string") {
          if (!this.isStrongPassword(data.password)) {
            throw new ValidationError(
              "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
            );
          }
          updates.password = await bcrypt.hash(data.password, UserService.SALT_ROUNDS);
        } else if (field === "isActive" && typeof data.isActive === "boolean") {
          updates.isActive = data.isActive;
        }
      }
    }

    Object.assign(existing, updates);
    const saved = await this.userRepository.save(existing);
    return this.sanitizeUser(saved);
  }

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<boolean> {
    const exists = await this.userRepository.existsById(id);
    if (!exists) {
      throw new NotFoundError("User not found");
    }
    await this.userRepository.delete(id);
    return true;
  }

  /**
   * Sanitize user data - remove sensitive fields
   */
  private sanitizeUser(user: Users): SafeUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role?.name ?? null,
      isActive: user.isActive,
    };
  }

  /**
   * Check password strength
   * Requirements: 8+ chars, uppercase, lowercase, number, special char
   */
  private isStrongPassword(password: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }
}

export default UserService;
