"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationError = void 0;
const BaseError_1 = require("./BaseError");
class AuthenticationError extends BaseError_1.BaseError {
    constructor(message, name = 'AuthenticationError') {
        super(message, name, 401);
    }
}
exports.AuthenticationError = AuthenticationError;
//# sourceMappingURL=AuthenticationError.js.map