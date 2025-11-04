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
exports.validateToken = exports.forgotPassword = exports.getPerfil = exports.updatePerfil = exports.updatePasswordWithToken = exports.updateCurrentUserPassword = exports.loginUser = exports.resendVerificationToken = exports.verifyUser = exports.registerUser = exports.googleAuth = exports.user = exports.handleGoogleAuthFailure = void 0;
const auth_1 = require("../utils/auth");
const token_1 = require("../utils/token");
const jwt_1 = require("../utils/jwt");
const AuthEmail_1 = require("../emails/AuthEmail");
const User_1 = require("../models/User");
const Token_1 = __importDefault(require("../models/Token"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const handleGoogleAuthFailure = (req, res, next) => {
    const state = req.query.state
        ? JSON.parse(req.query.state)
        : { redirectUrl: "/auth/sign-in" };
    const redirectUrl = state.redirectUrl || "/auth/sign-in";
    return res.redirect(`${process.env.FRONTEND_URL}${redirectUrl}?error=true`);
};
exports.handleGoogleAuthFailure = handleGoogleAuthFailure;
const user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(req.user);
    return;
});
exports.user = user;
const googleAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, displayName } = req.user;
    const user = yield User_1.User.findOne({ email }).lean();
    if (!user) {
        const newUser = yield User_1.User.create({
            name: displayName,
            email,
            password: null,
            role: "customer",
            confirmed: true,
            isGoogleUser: true,
        });
        const token = (0, jwt_1.generateJWT)({ id: newUser._id.toString() });
        return res.redirect(`${process.env.FRONTEND_URL}/auth/sign-in?token=${token}`);
    }
    else {
        const token = (0, jwt_1.generateJWT)({ id: user._id.toString() });
        return res.redirect(`${process.env.FRONTEND_URL}/auth/sign-in?token=${token}`);
    }
});
exports.googleAuth = googleAuth;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, email, password } = req.body;
    try {
        if (!nombre || !email || !password) {
            res.status(400).json({ message: "Datos incompletos o inválidos" });
            return;
        }
        const existingUser = yield User_1.User.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: "El correo ya está registrado" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new User_1.User({
            nombre,
            email,
            password: hashedPassword,
            confirmed: true,
        });
        const savedUser = yield newUser.save();
        const token = (0, jwt_1.generateJWT)({ id: savedUser._id.toString() });
        res.status(201).json({
            token,
            user: {
                id: savedUser._id,
                nombre: savedUser.name,
                email: savedUser.email,
                telefono: "",
                foto: "",
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error interno del servidor" });
    }
});
exports.registerUser = registerUser;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    try {
        const existingToken = yield Token_1.default.findOne({ token });
        if (!existingToken) {
            res.status(400).json({
                message: "Token inválido o expirado.",
            });
            return;
        }
        const user = yield User_1.User.findById(existingToken.user);
        if (!user) {
            res.status(404).json({
                message: "Usuario no encontrado.",
            });
            return;
        }
        user.confirmed = true;
        yield user.save();
        yield Token_1.default.findByIdAndDelete(existingToken._id);
        res.status(200).json({
            message: "Cuenta verificada exitosamente.",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al verificar la cuenta.",
            error: error.message,
        });
    }
});
exports.verifyUser = verifyUser;
const resendVerificationToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield User_1.User.findOne({ email });
        if (!user) {
            res.status(404).json({
                message: "Usuario no encontrado.",
            });
            return;
        }
        if (user.confirmed) {
            res.status(400).json({
                message: "La cuenta ya está verificada.",
            });
            return;
        }
        const verificationToken = (0, token_1.generateToken)();
        const token = new Token_1.default({
            token: verificationToken,
            user: user._id,
        });
        yield token.save();
        res.status(200).json({
            message: "Nuevo token de verificación generado.",
            verificationToken,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al generar el token.",
            error: error.message,
        });
    }
});
exports.resendVerificationToken = resendVerificationToken;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).json({ message: "Datos incompletos o inválidos" });
            return;
        }
        const user = yield User_1.User.findOne({ email }).lean();
        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Credenciales inválidas" });
            return;
        }
        const token = (0, jwt_1.generateJWT)({ id: user._id.toString() });
        res.status(200).json({
            token,
            user: {
                id: user._id,
                nombre: user.name,
                email: user.email,
                telefono: (_a = user.telefono) !== null && _a !== void 0 ? _a : "",
                foto: (_b = user.foto) !== null && _b !== void 0 ? _b : "",
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error interno del servidor" });
    }
});
exports.loginUser = loginUser;
const updateCurrentUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword } = req.body;
    const user = yield User_1.User.findById(req.user.id);
    const isPasswordCorrect = yield (0, auth_1.checkPassword)(currentPassword, user.password);
    if (!isPasswordCorrect) {
        const error = new Error("El Password actual es incorrecto");
        res.status(401).json({ error: error.message });
        return;
    }
    try {
        user.password = yield (0, auth_1.hashPassword)(newPassword);
        yield user.save();
        res.status(200).json({
            message: "El Password se modificó correctamente.",
        });
        return;
    }
    catch (error) {
        res.status(500).json({ error: "Hubo un error" });
    }
});
exports.updateCurrentUserPassword = updateCurrentUserPassword;
const updatePasswordWithToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const tokenExists = yield Token_1.default.findOne({ token });
        if (!tokenExists) {
            const error = new Error("Token no válido");
            res.status(404).json({ message: error.message });
            return;
        }
        const user = yield User_1.User.findById(tokenExists.user);
        user.password = yield (0, auth_1.hashPassword)(password);
        yield Promise.allSettled([user.save(), tokenExists.deleteOne()]);
        res.status(200).json({
            message: "El Password se modificó correctamente.",
        });
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Hubo un error" });
    }
});
exports.updatePasswordWithToken = updatePasswordWithToken;
const updatePerfil = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Validación de token
        if (!req.user) {
            res.status(401).json({ message: "Token inválido" });
            return;
        }
        const { nombre, telefono, foto } = req.body;
        // Validar que al menos un campo venga a actualizar
        if (!nombre && !telefono && !foto) {
            res.status(400).json({ message: "Datos inválidos" });
            return;
        }
        const userId = req.user.id;
        const updatedUser = yield User_1.User.findByIdAndUpdate(userId, { nombre, telefono, foto }, { new: true } // devuelve el usuario actualizado
        ).lean();
        if (!updatedUser) {
            res.status(500).json({ message: "Error actualizando perfil" });
            return;
        }
        res.status(200).json({
            message: "Perfil actualizado correctamente",
            user: {
                id: updatedUser._id,
                nombre: updatedUser.name,
                email: updatedUser.email,
                telefono: (_a = updatedUser.telefono) !== null && _a !== void 0 ? _a : "",
                foto: (_b = updatedUser.foto) !== null && _b !== void 0 ? _b : "",
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error actualizando perfil" });
    }
});
exports.updatePerfil = updatePerfil;
const getPerfil = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (!req.user) {
            res.status(401).json({ message: "Token inválido o expirado" });
            return;
        }
        const userId = req.user.id;
        const user = yield User_1.User.findById(userId).lean();
        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }
        res.status(200).json({
            id: user._id,
            nombre: user.name,
            email: user.email,
            telefono: (_a = user.telefono) !== null && _a !== void 0 ? _a : "",
            foto: (_b = user.foto) !== null && _b !== void 0 ? _b : "",
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error obteniendo perfil" });
    }
});
exports.getPerfil = getPerfil;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield User_1.User.findOne({ email });
        if (!user) {
            const error = new Error("El Usuario no esta registrado");
            res.status(404).json({ message: error.message });
            return;
        }
        const token = new Token_1.default();
        token.token = (0, token_1.generateToken)();
        token.user = user.id;
        yield token.save();
        (0, AuthEmail_1.sendPasswordResetToken)({
            email: user.email,
            name: user.name,
            token: token.token,
        });
        res.status(200).json({
            message: "Revisa tu email para instrucciones.",
        });
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Hubo un error" });
    }
});
exports.forgotPassword = forgotPassword;
const validateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        const tokenExists = yield Token_1.default.findOne({ token });
        if (!tokenExists) {
            const error = new Error("Token no válido");
            res.status(404).json({ message: error.message });
            return;
        }
        res.status(200).json({
            message: "Token válido, Define tu nuevo password.",
        });
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Hubo un error" });
    }
});
exports.validateToken = validateToken;
//# sourceMappingURL=AuthController.js.map