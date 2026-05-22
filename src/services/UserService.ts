import { Users } from "../entities/Users";
import { AppDataSource } from "../config/database";
import { UserRepository } from "../repositories/UserRepository";


export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository(AppDataSource);
  }

  /**
   * Get all users
   */
  async getAll(): Promise<Users[]> {
    return this.userRepository.findAll();
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<Users | null> {
    return this.userRepository.findById(id);
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<Users | null> {
    return this.userRepository.findByEmail(email);
  }

  /**
   * Create new user
   */
  async createUser(user: Users): Promise<Users> {
    return this.userRepository.save(user);
  }

  /**
   * Update user
   */
  async updateUser(id: number, data: Partial<Users>): Promise<Users | null> {
    const existing = await this.userRepository.findById(id);
    if (!existing) return null;
    Object.assign(existing, data);
    return this.userRepository.save(existing);
  }

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<boolean> {
    const existing = await this.userRepository.findById(id);
    if (!existing) return false;
    await this.userRepository.delete(id);
    return true;
  }
}

export default UserService;