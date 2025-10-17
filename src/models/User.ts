import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "admin" | "student";
    confirmed: boolean;
    active:boolean;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: false },
        role: {
            type: String,
            enum: ["admin", "student"],
            required: true,
        },
        confirmed: {
            type: Boolean,
            default: false
        },
        active: {
            type: Boolean,
            default: true
        },
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
