"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseError = void 0;
class BaseError extends Error {
    constructor(message, errorType, status, name = 'BaseError') {
        super(message);
        this.status = status;
        this.name = name;
        this.errorType = errorType;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.BaseError = BaseError;
//# sourceMappingURL=BaseError.js.map