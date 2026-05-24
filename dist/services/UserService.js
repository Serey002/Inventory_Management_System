"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getAll() {
        return this.userRepository.findAll();
    }
    async getUserById(id) {
        return this.userRepository.findById(id);
    }
    async getUserByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
    async createUser(user) {
        return this.userRepository.save(user);
    }
    async updateUser(id, data) {
        const existing = await this.userRepository.findById(id);
        if (!existing)
            return null;
        Object.assign(existing, data);
        return this.userRepository.save(existing);
    }
    async deleteUser(id) {
        const existing = await this.userRepository.findById(id);
        if (!existing)
            return false;
        await this.userRepository.delete(id);
        return true;
    }
}
exports.UserService = UserService;
exports.default = UserService;
