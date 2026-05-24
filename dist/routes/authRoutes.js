"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthRouter = createAuthRouter;
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
function createAuthRouter(authController, authService) {
    const router = (0, express_1.Router)();
    const authMiddleware = (0, authMiddleware_1.createAuthMiddleware)(authService);
    router.post("/login", authController.login);
    router.post("/register", authController.register);
    return router;
}
