import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    nombre: string;
    email: string;
    password: string;
    role: "admin" | "student";
    confirmed: boolean;
    telefono: string;
    foto: string;
    active: boolean;
}

const UserSchema = new Schema<IUser>(
    {
        nombre: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: false },
        telefono: { type: String },
        foto: { type: String },
        role: {
            type: String,
            enum: ["admin", "student"],
            required: true,
        },
        confirmed: {
            type: Boolean,
            default: false,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
