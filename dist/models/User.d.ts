import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "admin" | "customer" | "employee";
    confirmed: boolean;
    active: boolean;
    isGoogleUser: boolean;
    address?: {
        street: string;
        city: string;
        zip: string;
        country: string;
    };
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
