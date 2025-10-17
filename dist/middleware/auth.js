"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
require("multer");
const verifyUserToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bearer = req.headers.authorization;
    if (!bearer) {
        res.status(401).json({ error: "No Autorizado" });
        return;
    }
    const [, token] = bearer.split(" ");
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === "object" && decoded.id) {
            const user = yield User_1.User.findById(decoded.id).select("_id name email role address");
            if (!user) {
                res.status(401).json({ error: "Token No Válido" });
                return;
            }
            req.user = user;
            return next();
        }
        res.status(401).json({ error: "Token No Válido" });
        return;
    }
    catch (error) {
        res.status(401).json({ error: "Token No Válido" });
        return;
    }
});
exports.verifyUserToken = verifyUserToken;
//# sourceMappingURL=auth.js.map