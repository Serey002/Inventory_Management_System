import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { BaseAuthService } from "./BaseAuthService";
import { UserRepository } from "../repositories/UserRepository";
import { RoleRepository } from "../repositories/RoleRepository";
import { Users } from "../entities/Users";
import { LoginDTO, RegisterDTO, AuthResult, JwtPayload } from "../types/authType";

/**
 * INHERITANCE: AuthService extends BaseAuthService,
 * providing concrete implementations for all abstract methods.
 *
 * POLYMORPHISM: login(), register(), validateToken() override
 * the abstract contract from BaseAuthService with specific behavior.
 */
export class AuthService extends BaseAuthService {
  private readonly SALT_ROUNDS = 12;
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: string;

  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository
  ) {
    super();
    this.JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";
  }

  /**
   * POLYMORPHISM: Concrete implementation of abstract login()
   */
  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    if (!user.isActive) {
      throw new Error("Account is inactive");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = this.generateToken(user);

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  /**
   * POLYMORPHISM: Concrete implementation of abstract register()
   */
  async register(data: RegisterDTO): Promise<AuthResult> {
    const emailTaken = await this.userRepository.emailExists(data.email);
    if (emailTaken) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS);

    const user = new Users();
    user.name = data.name;
    user.email = data.email;
    user.password = hashedPassword;
    user.isActive = true;

    if (data.roleId) {
      const role = await this.roleRepository.findById(data.roleId);
      if (!role) throw new Error("Role not found");
      user.role = role;
      user.roleId = role.id;
    }

    const saved = await this.userRepository.save(user);

    // Re-fetch to load relations
    const fullUser = await this.userRepository.findByEmail(saved.email);
    if (!fullUser) throw new Error("User creation failed");

    const token = this.generateToken(fullUser);

    return {
      token,
      user: this.sanitizeUser(fullUser),
    };
  }

  /**
   * POLYMORPHISM: Concrete implementation of abstract validateToken()
   */
  validateToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.JWT_SECRET) as JwtPayload;
    } catch {
      throw new Error("Invalid or expired token");
    }
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not found");
    return this.sanitizeUser(user);
  }

  private generateToken(user: Users): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role?.name ?? null,
    };
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  private sanitizeUser(user: Users) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role?.name ?? null,
      isActive: user.isActive,
    };
  }
}