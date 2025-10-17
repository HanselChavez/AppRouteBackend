"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const BaseError_1 = require("./BaseError");
const errorHandler = (err, req, res, next) => {
    if (err instanceof BaseError_1.BaseError) {
        res.status(err.status).json({ error: err.message });
    }
    if (err.name === 'PrismaClientInitializationError') {
        console.error({
            message: err.message,
            status: 400,
        });
        res.status(500).json({ error: 'Something went wrong' });
    }
    res.status(500).json({ error: err.message });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=ErrorHandler.js.map