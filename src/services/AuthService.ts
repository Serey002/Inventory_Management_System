import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { BaseAuthService } from "./BaseAuthService";
import { UserRepository } from "../repositories/UserRepository";
import { RoleRepository } from "../repositories/RoleRepository";
import { Users } from "../Entities/Users";
import { RegisterDTO, AuthResult, JwtPayload, SafeUser } from "../types/authType";
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
    this.jwtSecret     = process.env.JWT_SECRET;
    this.jwtExpiresIn  = process.env.JWT_EXPIRES_IN ?? "24h";
  }

  // ── Public contract (implements BaseAuthService) ──────────────────────────

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.isActive) throw new Error("Invalid credentials");

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) throw new Error("Invalid credentials");

    return { token: this.generateToken(user), user: this.sanitizeUser(user) };
  }

  async register(data: RegisterDTO): Promise<AuthResult> {
    if (await this.userRepository.emailExists(data.email)) {
      throw new Error("Email already in use");
    }

    const user        = new Users();
    user.name         = data.name;
    user.email        = data.email;
    user.password     = await bcrypt.hash(data.password, AuthService.SALT_ROUNDS);
    user.isActive     = true;
    user.lastLoginAt  = null;

    if (data.roleId) {
      const role = await this.roleRepository.findById(data.roleId);
      if (!role) throw new Error("Role not found");
      user.role   = role;
      user.roleId = role.id;
    }

    const saved    = await this.userRepository.save(user);
    const fullUser = await this.userRepository.findByEmail(saved.email);
    if (!fullUser) throw new Error("User creation failed");

    return { token: this.generateToken(fullUser), user: this.sanitizeUser(fullUser) };
  }

  validateToken(token: string): JwtPayload {
    return jwt.verify(token, this.jwtSecret) as JwtPayload;
  }

  async getProfile(userId: number): Promise<SafeUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not found");
    return this.sanitizeUser(user);
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private generateToken(user: Users): string {
    const payload: JwtPayload = {
      userId: user.id,
      email:  user.email,
      role:   user.role?.name ?? null,
    };
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    } as jwt.SignOptions);
  }

  private sanitizeUser(user: Users): SafeUser {
    return {
      id:       user.id,
      name:     user.name,
      email:    user.email,
      role:     user.role?.name ?? null,
      isActive: user.isActive,
    };
  }
}

export default AuthService;
