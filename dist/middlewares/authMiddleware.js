"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class BaseAuthMiddleware {
    constructor() {
        this.handle = (req, res, next) => {
            const token = this.extractToken(req);
            if (!token) {
                res.status(401).json({ success: false, message: "No token provided" });
                return;
            }
            try {
                req.user = this.authenticate(token);
                next();
            }
            catch (error) {
                res.status(401).json({ success: false, message: this.resolveError(error) });
            }
        };
    }
    extractToken(req) {
        const header = req.headers.authorization;
        return header?.startsWith("Bearer ") ? header.slice(7) : null;
    }
    resolveError(error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError)
            return "Token has expired";
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError)
            return "Invalid token";
        return "Authentication failed";
    }
}
class JwtAuthMiddleware extends BaseAuthMiddleware {
    constructor(authService) {
        super();
        this.authService = authService;
    }
    authenticate(token) {
        return this.authService.validateToken(token);
    }
}
// Resolved from server.ts via createAuthMiddleware()
const createAuthMiddleware = (authService) => new JwtAuthMiddleware(authService).handle;
exports.createAuthMiddleware = createAuthMiddleware;
