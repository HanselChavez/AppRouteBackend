"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireUser = exports.handleError = void 0;
const handleError = (res, error, message) => {
    console.error(`❌ ${message}:`, error);
    res.status(500).json({
        message,
        error: error.message || error,
    });
};
exports.handleError = handleError;
const requireUser = (req, res) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return null;
    }
    return userId;
};
exports.requireUser = requireUser;
//# sourceMappingURL=controllerUtils.js.map