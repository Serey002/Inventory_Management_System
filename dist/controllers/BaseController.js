"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
class BaseController {
    sendSuccess(res, data, statusCode = 200) {
        res.status(statusCode).json({ success: true, data });
    }
    sendError(res, message, statusCode = 400) {
        res.status(statusCode).json({ success: false, message });
    }
    sendCreated(res, data) {
        this.sendSuccess(res, data, 201);
    }
    resolveError(error, fallback) {
        return error instanceof Error ? error.message : fallback;
    }
}
exports.BaseController = BaseController;
