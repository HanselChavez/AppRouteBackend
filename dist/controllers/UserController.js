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
exports.updateUserRole = exports.deleteUser = exports.updateUser = exports.updateInformation = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.find().select("-password -__v");
        res.status(200).json({
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener los usuarios.",
            error: error.message,
        });
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield User_1.User.findById(id).select("-password -__v");
        if (!user) {
            res.status(404).json({
                message: "Usuario no encontrado.",
            });
            return;
        }
        res.status(200).json({
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al obtener el usuario.",
            error: error.message,
        });
    }
});
exports.getUserById = getUserById;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = req.body;
    try {
        const existingUser = yield User_1.User.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                message: "El correo electrónico ya está registrado.",
            });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new User_1.User({
            name,
            email,
            password: hashedPassword,
            role,
        });
        const savedUser = yield newUser.save();
        res.status(201).json({
            message: "Usuario creado exitosamente.",
            data: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al crear el usuario.",
            error: error.message,
        });
    }
});
exports.createUser = createUser;
const updateInformation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { name, email, city, street } = req.body;
    if (!name || !email) {
        res.status(400).json({ message: "El nombre y el correo son obligatorios." });
        return;
    }
    try {
        const updatedUser = yield User_1.User.findByIdAndUpdate(id, {
            name,
            email,
            address: {
                street: street || "",
                city: city || "",
            },
        }, { new: true, runValidators: true });
        if (!updatedUser) {
            res.status(404).json({ message: "Usuario no encontrado." });
            return;
        }
        res.status(200).json({
            message: "Usuario actualizado exitosamente.",
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
                address: updatedUser.address,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error interno del servidor." });
    }
});
exports.updateInformation = updateInformation;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, email, role } = req.body;
    try {
        let updateData = { name, email, role };
        const updatedUser = yield User_1.User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).select("-password -__v");
        if (!updatedUser) {
            res.status(404).json({
                message: "Usuario no encontrado.",
            });
            return;
        }
        res.status(200).json({
            message: "Usuario actualizado exitosamente.",
            data: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al actualizar el usuario.",
            error: error.message,
        });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedUser = yield User_1.User.findByIdAndDelete(id);
        if (!deletedUser) {
            res.status(404).json({
                message: "Usuario no encontrado.",
            });
            return;
        }
        res.status(200).json({
            message: "Usuario eliminado exitosamente.",
            data: {
                id: deletedUser._id,
                name: deletedUser.name,
                email: deletedUser.email,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al eliminar el usuario.",
            error: error.message,
        });
    }
});
exports.deleteUser = deleteUser;
const updateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        const requestingUser = req.user;
        if (!requestingUser || requestingUser.role !== "admin") {
            res.status(403).json({ message: "No tienes permiso para realizar esta acción." });
            return;
        }
        const validRoles = ["admin", "customer", "employee"];
        if (!validRoles.includes(role)) {
            res.status(400).json({ message: "Rol inválido. Los roles válidos son: admin, customer, employee." });
            return;
        }
        const updatedUser = yield User_1.User.findByIdAndUpdate(userId, { role }, { new: true, runValidators: true });
        if (!updatedUser) {
            res.status(404).json({ message: "Usuario no encontrado." });
            return;
        }
        res.status(200).json({ message: "Rol actualizado correctamente.", user: updatedUser });
    }
    catch (error) {
        console.error("Error al actualizar el rol del usuario:", error);
        res.status(500).json({ message: "Error al actualizar el rol del usuario.", error });
    }
});
exports.updateUserRole = updateUserRole;
//# sourceMappingURL=UserController.js.map