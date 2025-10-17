"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateToken = () => crypto_1.default.randomBytes(32).toString("hex");
exports.generateToken = generateToken;
//# sourceMappingURL=token.js.map