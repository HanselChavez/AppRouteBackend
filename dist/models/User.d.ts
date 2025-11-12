import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    _id: string;
    nombre: string;
    email: string;
    password: string;
    role: "admin" | "student";
    confirmed: boolean;
    telefono: string;
    foto: string;
    active: boolean;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
