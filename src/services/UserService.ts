import { Users } from "../Entities/Users";
import { UserRepository } from "../repositories/UserRepository";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAll(): Promise<Users[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<Users | null> {
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<Users | null> {
    return this.userRepository.findByEmail(email);
  }

  async createUser(user: Users): Promise<Users> {
    return this.userRepository.save(user);
  }

  async updateUser(id: number, data: Partial<Users>): Promise<Users | null> {
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
