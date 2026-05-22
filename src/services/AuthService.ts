import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { BaseAuthService } from "./BaseAuthService";
import { UserRepository } from "../repositories/UserRepository";
import { RoleRepository } from "../repositories/RoleRepository";
import { Users } from "../Entities/Users";
import { RegisterDTO, AuthResult, JwtPayload } from "../types/authType";

export class AuthService extends BaseAuthService {
  private readonly SALT_ROUNDS = 12;
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: string;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) {
    super();
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set");
    this.JWT_SECRET = process.env.JWT_SECRET;
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "24h";
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(email);

    if (!user || !user.isActive) throw new Error("Invalid credentials");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    return { token: this.generateToken(user), user: this.sanitizeUser(user) };
  }

  async register(data: RegisterDTO): Promise<AuthResult> {
    if (await this.userRepository.emailExists(data.email)) {
      throw new Error("Email already in use");
    }

    const user = new Users();
    user.name = data.name;
    user.email = data.email;
    user.password = await bcrypt.hash(data.password, this.SALT_ROUNDS);
    user.isActive = true;

    if (data.roleId) {
      const role = await this.roleRepository.findById(data.roleId);
      if (!role) throw new Error("Role not found");
      user.role = role;
      user.roleId = role.id;
    }

    const saved = await this.userRepository.save(user);
    const fullUser = await this.userRepository.findByEmail(saved.email);
    if (!fullUser) throw new Error("User creation failed");

    return { token: this.generateToken(fullUser), user: this.sanitizeUser(fullUser) };
  }

  validateToken(token: string): JwtPayload {
    return jwt.verify(token, this.JWT_SECRET) as JwtPayload;
  }

  async getProfile(userId: number): Promise<AuthResult["user"]> {
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

  private sanitizeUser(user: Users): AuthResult["user"] {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role?.name ?? null,
      isActive: user.isActive,
    };
  }
}

export default AuthService;
