import type { Request, Response } from "express";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { generateJWT } from "../utils/jwt";
import {
    sendPasswordResetToken,
    sendConfirmationEmail,
} from "../emails/AuthEmail";
import { User } from "../models/User";
import Token from "../models/Token";
import bcrypt from "bcrypt";
export type GoogleUser = {
    displayName: string;
    email: string;
};
export const handleGoogleAuthFailure = (req, res, next) => {
    const state = req.query.state
        ? JSON.parse(req.query.state)
        : { redirectUrl: "/auth/sign-in" };
    const redirectUrl = state.redirectUrl || "/auth/sign-in";
    return res.redirect(`${process.env.FRONTEND_URL}${redirectUrl}?error=true`);
};
export const user = async (req: Request, res: Response): Promise<void> => {
    res.json(req.user);
    return;
};
export const googleAuth = async (req, res) => {
    const { email, displayName } = req.user;
    const user = await User.findOne({ email }).lean();

    if (!user) {
        const newUser = await User.create({
            name: displayName,
            email,
            password: null,
            role: "customer",
            confirmed: true,
            isGoogleUser: true,
        });
        const token = generateJWT({ id: newUser._id.toString() });
        return res.redirect(
            `${process.env.FRONTEND_URL}/auth/sign-in?token=${token}`
        );
    } else {
        const token = generateJWT({ id: user._id.toString() });
        return res.redirect(
            `${process.env.FRONTEND_URL}/auth/sign-in?token=${token}`
        );
    }
};
export const registerUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { nombre, email, password } = req.body;

    try {
        if (!nombre || !email || !password) {
            res.status(400).json({ message: "Datos incompletos o inválidos" });
            return;
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(409).json({ message: "El correo ya está registrado" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            nombre,
            email,
            role: "student",
            password: hashedPassword,
            confirmed: true,
        });
        const savedUser = await newUser.save();
        const token = generateJWT({ id: savedUser._id.toString() });
        
        res.status(201).json({
            token,
            user: {
                id: savedUser._id,
                nombre: savedUser.nombre,
                email: savedUser.email,
                telefono: "",
                foto: "",
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
export const verifyUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { token } = req.body;

    try {
        const existingToken = await Token.findOne({ token });
        if (!existingToken) {
            res.status(400).json({
                message: "Token inválido o expirado.",
            });
            return;
        }

        const user = await User.findById(existingToken.user);
        if (!user) {
            res.status(404).json({
                message: "Usuario no encontrado.",
            });
            return;
        }

        user.confirmed = true;
        await user.save();

        await Token.findByIdAndDelete(existingToken._id);

        res.status(200).json({
            message: "Cuenta verificada exitosamente.",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al verificar la cuenta.",
            error: error.message,
        });
    }
};
export const resendVerificationToken = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
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

        const verificationToken = generateToken();

        const token = new Token({
            token: verificationToken,
            user: user._id,
        });

        await token.save();

        res.status(200).json({
            message: "Nuevo token de verificación generado.",
            verificationToken,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al generar el token.",
            error: error.message,
        });
    }
};
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            res.status(400).json({ message: "Datos incompletos o inválidos" });
            return;
        }

        const user = await User.findOne({ email }).lean();
        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Credenciales inválidas" });
            return;
        }

        const token = generateJWT({ id: user._id.toString() });
        res.status(200).json({
            token,
            user: {
                id: user._id,
                nombre: user.nombre,
                email: user.email,
                telefono: user.telefono ?? "",
                foto: user.foto ?? "",
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
export const updateCurrentUserPassword = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    const isPasswordCorrect = await checkPassword(
        currentPassword,
        user.password
    );
    if (!isPasswordCorrect) {
        const error = new Error("El Password actual es incorrecto");
        res.status(401).json({ error: error.message });
        return;
    }

    try {
        user.password = await hashPassword(newPassword);
        await user.save();
        res.status(200).json({
            message: "El Password se modificó correctamente.",
        });
        return;
    } catch (error) {
        res.status(500).json({ error: "Hubo un error" });
    }
};
export const updatePasswordWithToken = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const tokenExists = await Token.findOne({ token });
        if (!tokenExists) {
            const error = new Error("Token no válido");
            res.status(404).json({ message: error.message });
            return;
        }

        const user = await User.findById(tokenExists.user);
        user.password = await hashPassword(password);

        await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

        res.status(200).json({
            message: "El Password se modificó correctamente.",
        });
        return;
    } catch (error) {
        res.status(500).json({ message: "Hubo un error" });
    }
};
export const updatePerfil = async (
    req: Request,
    res: Response
): Promise<void> => {
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

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { nombre, telefono, foto },
            { new: true } // devuelve el usuario actualizado
        ).lean();

        if (!updatedUser) {
            res.status(500).json({ message: "Error actualizando perfil" });
            return;
        }

        res.status(200).json({
            message: "Perfil actualizado correctamente",
            user: {
                id: updatedUser._id,
                nombre: updatedUser.nombre,
                email: updatedUser.email,
                telefono: updatedUser.telefono ?? "",
                foto: updatedUser.foto ?? "",
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error actualizando perfil" });
    }
};
export const getPerfil = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Token inválido o expirado" });
            return;
        }

        const userId = req.user.id;
        const user = await User.findById(userId).lean();

        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }

        res.status(200).json({
            id: user._id,
            nombre: user.nombre,
            email: user.email,
            telefono: user.telefono ?? "",
            foto: user.foto ?? "",
        });
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo perfil" });
    }
};
export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("El Usuario no esta registrado");
            res.status(404).json({ message: error.message });
            return;
        }
        const token = new Token();
        token.token = generateToken();
        token.user = user.id;
        await token.save();

        sendPasswordResetToken({
            email: user.email,
            name: user.nombre,
            token: token.token,
        });
        res.status(200).json({
            message: "Revisa tu email para instrucciones.",
        });
        return;
    } catch (error) {
        res.status(500).json({ message: "Hubo un error" });
    }
};
export const validateToken = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { token } = req.body;

        const tokenExists = await Token.findOne({ token });
        if (!tokenExists) {
            const error = new Error("Token no válido");
            res.status(404).json({ message: error.message });
            return;
        }
        res.status(200).json({
            message: "Token válido, Define tu nuevo password.",
        });
        return;
    } catch (error) {
        res.status(500).json({ message: "Hubo un error" });
    }
};
