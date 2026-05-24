"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const BaseAuthService_1 = require("./BaseAuthService");
const Users_1 = require("../Entities/Users");
class AuthService extends BaseAuthService_1.BaseAuthService {
    constructor(userRepository, roleRepository) {
        super();
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.SALT_ROUNDS = 12;
        if (!process.env.JWT_SECRET)
            throw new Error("JWT_SECRET is not set");
        this.JWT_SECRET = process.env.JWT_SECRET;
        this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "24h";
    }
    async login(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user || !user.isActive)
            throw new Error("Invalid credentials");
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid)
            throw new Error("Invalid credentials");
        return { token: this.generateToken(user), user: this.sanitizeUser(user) };
    }
    async register(data) {
        if (await this.userRepository.emailExists(data.email)) {
            throw new Error("Email already in use");
        }
        const user = new Users_1.Users();
        user.name = data.name;
        user.email = data.email;
        user.password = await bcryptjs_1.default.hash(data.password, this.SALT_ROUNDS);
        user.isActive = true;
        if (data.roleId) {
            const role = await this.roleRepository.findById(data.roleId);
            if (!role)
                throw new Error("Role not found");
            user.role = role;
            user.roleId = role.id;
        }
        const saved = await this.userRepository.save(user);
        const fullUser = await this.userRepository.findByEmail(saved.email);
        if (!fullUser)
            throw new Error("User creation failed");
        return { token: this.generateToken(fullUser), user: this.sanitizeUser(fullUser) };
    }
    validateToken(token) {
        return jsonwebtoken_1.default.verify(token, this.JWT_SECRET);
    }
    async getProfile(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user)
            throw new Error("User not found");
        return this.sanitizeUser(user);
    }
    generateToken(user) {
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role?.name ?? null,
        };
        return jsonwebtoken_1.default.sign(payload, this.JWT_SECRET, {
            expiresIn: this.JWT_EXPIRES_IN,
        });
    }
    sanitizeUser(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role?.name ?? null,
            isActive: user.isActive,
        };
    }
}
exports.AuthService = AuthService;
exports.default = AuthService;
