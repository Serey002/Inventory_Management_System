"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const Users_1 = require("../Entities/Users");
class UserRepository extends BaseRepository_1.BaseRepository {
    constructor(dataSource) {
        super(Users_1.Users, dataSource);
    }
    async findByEmail(email) {
        return this.repository.findOne({
            where: { email },
            relations: { role: true },
        });
    }
    async findActiveUsers() {
        return this.repository.find({
            where: { isActive: true },
            relations: { role: true },
        });
    }
    async emailExists(email) {
        return this.repository.existsBy({ email });
    }
}
exports.UserRepository = UserRepository;
exports.default = UserRepository;
