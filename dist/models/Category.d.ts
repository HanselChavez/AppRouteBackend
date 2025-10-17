import mongoose, { Document, Types } from "mongoose";
interface ICategory extends Document {
    name: string;
    description?: string;
    image?: string;
    parent?: Types.ObjectId;
}
export declare const Category: mongoose.Model<ICategory, {}, {}, {}, mongoose.Document<unknown, {}, ICategory> & ICategory & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export {};
