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
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                message: "El correo ya está registrado.",
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: "customer",
            confirmed: false,
        });

        const savedUser = await newUser.save();

        const verificationToken = generateToken();

        const token = new Token({
            token: verificationToken,
            user: savedUser._id,
        });
        await token.save();
        sendConfirmationEmail({
            email: savedUser.email,
            name: savedUser.name,
            token: token.token,
        });
        res.status(201).json({
            message: "Usuario registrado exitosamente. Verifique su correo.",
            userId: savedUser._id,
            verificationToken,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al registrar el usuario.",
            error: error.message,
        });
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
        const user = await User.findOne({ email }).lean();
        if (!user) {
            res.status(404).json({
                message: "El usuario no está registrado.",
            });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({
                message: "Correo electrónico o contraseña incorrectos.",
            });
            return;
        }

        if (!user.confirmed) {
            res.status(400).json({
                message:
                    "La cuenta no ha sido verificada. Por favor, revise su correo electrónico para completar la verificación.",
            });
            return;
        }

        const token = generateJWT({ id: user._id.toString() });
        res.status(200).json({
            token,
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({
            message: "Hubo un error al intentar iniciar sesión.",
            error: error.message,
        });
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
            name: user.name,
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
