import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { BaseAuthService } from "./BaseAuthService";
import { UserRepository } from "../repositories/UserRepository";
import { RoleRepository } from "../repositories/RoleRepository";
import { Users } from "../Entities/Users";
import { UnauthorizedError } from "../errors/AppError";
import { RegisterDTO, AuthResult, JwtPayload, SafeRole, SafeUser } from "../types/authType";

export class AuthService extends BaseAuthService {
  private static readonly SALT_ROUNDS = 12;
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) {
    super();
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET env variable is not set");
    this.jwtSecret = process.env.JWT_SECRET;
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? "24h";
  }

  async login(email: string, password: string): Promise<AuthResult> {
    if (!email || !password) throw new UnauthorizedError("Email and password are required");

    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UnauthorizedError("Email not found");
    if (!user.isActive) throw new UnauthorizedError("Account is inactive");
    if (!await bcrypt.compare(password, user.password)) throw new UnauthorizedError("Incorrect password");

    return { token: this.generateToken(user), user: this.sanitizeUser(user) };
  }

  async register(data: RegisterDTO): Promise<AuthResult> {
    if (await this.userRepository.emailExists(data.email)) throw new Error("Email already in use");

    const user = Object.assign(new Users(), {
      name: data.name,
      email: data.email,
      password: await bcrypt.hash(data.password, AuthService.SALT_ROUNDS),
      isActive: true,
      lastLoginAt: null,
    });

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
    return jwt.verify(token, this.jwtSecret) as JwtPayload;
  }

  private generateToken(user: Users): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: this.sanitizeRole(user),
    };
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn } as jwt.SignOptions);
  }

  private sanitizeUser(user: Users): SafeUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: this.sanitizeRole(user),
      isActive: user.isActive,
    };
  }

  private sanitizeRole(user: Users): SafeRole | null {
    if (!user.role) return null;
    return {
      id: user.role.id,
      name: user.role.name,
      permissions: (user.role.permissions ?? []).map((p) => p.name),
    };
  }
}

export default AuthService;