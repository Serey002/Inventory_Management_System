"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const Roles_1 = require("../Entities/Roles");
class RoleRepository extends BaseRepository_1.BaseRepository {
    constructor(dataSource) {
        super(Roles_1.Role, dataSource);
    }
    async findByName(name) {
        return this.repository.findOne({ where: { name } });
    }
}
exports.RoleRepository = RoleRepository;
exports.default = RoleRepository;
