import mongoose, { Document, Types } from "mongoose";
interface IStore extends Document {
    name: string;
    address: string;
    city: string;
    stock: {
        product: Types.ObjectId;
        quantity: number;
    }[];
}
export declare const Store: mongoose.Model<IStore, {}, {}, {}, mongoose.Document<unknown, {}, IStore> & IStore & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export {};
