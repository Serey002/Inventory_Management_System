import { User } from "../Entities/Users";
import { UserRepository } from "../repositories/UserRepository";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async createUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | null> {
    const existing = await this.userRepository.findById(id);
    if (!existing) return null;
    Object.assign(existing, data);
    return this.userRepository.save(existing);
  }

  async deleteUser(id: number): Promise<boolean> {
    const exists = await this.userRepository.existsById(id);
    if (!exists) return false;
    await this.userRepository.delete(id);
    return true;
  }
}

export default UserService;