import mongoose, { Document, Types } from "mongoose";
export interface ICartItem {
    product: Types.ObjectId;
    quantity: number;
    selectedVariation?: {
        color?: string;
        size?: string;
        price?: number;
    };
}
export interface ICart extends Document {
    user: Types.ObjectId;
    items: ICartItem[];
    totalPrice: number;
    updatedAt: Date;
}
export declare const Cart: mongoose.Model<ICart, {}, {}, {}, mongoose.Document<unknown, {}, ICart> & ICart & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
