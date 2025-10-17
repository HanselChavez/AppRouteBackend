import type { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";

export const getAllUsers = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const users = await User.find().select("-password -__v"); 
        res.status(200).json({
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener los usuarios.",
            error: error.message,
        });
    }
};

export const getUserById = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).select("-password -__v"); 

        if (!user) {
            res.status(404).json({
                message: "Usuario no encontrado.",
            });
            return;
        }

        res.status(200).json({
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener el usuario.",
            error: error.message,
        });
    }
};

export const createUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { name, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                message: "El correo electrónico ya está registrado.",
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            message: "Usuario creado exitosamente.",
            data: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al crear el usuario.",
            error: error.message,
        });
    }
};
export const updateInformation =  async (req: Request, res: Response):Promise<void> => {
    const { id } = req.user; 
    const { name, email} = req.body;

    if (!name || !email) {
         res.status(400).json({ message: "El nombre y el correo son obligatorios." });return
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                name,
                email               
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
             res.status(404).json({ message: "Usuario no encontrado." });return
        }

        res.status(200).json({
            message: "Usuario actualizado exitosamente.",
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor." });
    }
}

export const updateUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id } = req.params;
    const { name, email, role } = req.body;

    try {
        let updateData = { name, email, role };
        const updatedUser = await User.findByIdAndUpdate(id, updateData, {
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
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar el usuario.",
            error: error.message,
        });
    }
};
export const deleteUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);

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
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar el usuario.",
            error: error.message,
        });
    }
};
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
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
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            res.status(404).json({ message: "Usuario no encontrado." });
            return;
        }

        res.status(200).json({ message: "Rol actualizado correctamente.", user: updatedUser });
    } catch (error) {
        console.error("Error al actualizar el rol del usuario:", error);
        res.status(500).json({ message: "Error al actualizar el rol del usuario.", error });
    }
};