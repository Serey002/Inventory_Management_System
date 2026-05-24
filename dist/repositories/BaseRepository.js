"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(entity, dataSource) {
        this.repository = dataSource.getRepository(entity);
    }
    async findAll() {
        return this.repository.find();
    }
    async findById(id) {
        return this.repository.findOne({
            where: { id },
        });
    }
    async save(entity) {
        return this.repository.save(entity);
    }
    async delete(id) {
        await this.repository.delete(id);
    }
}
exports.BaseRepository = BaseRepository;
exports.default = BaseRepository;
