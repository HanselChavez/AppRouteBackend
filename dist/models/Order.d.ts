import mongoose, { Types } from 'mongoose';
interface IOrder {
    customer: Types.ObjectId;
    products: {
        product: Types.ObjectId;
        quantity: number;
    }[];
    totalPrice: number;
    status: "pending" | "processed" | "shipped" | "delivered";
    deliveryMethod: "store_pickup" | "home_delivery";
    address?: {
        street: string;
        city: string;
        zip: string;
        country: string;
    };
}
export declare const Order: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder> & IOrder & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>;
export {};
