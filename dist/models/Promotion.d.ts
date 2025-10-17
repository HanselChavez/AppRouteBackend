import mongoose, { Document, Types } from "mongoose";
interface IPromotion extends Document {
    title: string;
    description?: string;
    discountPercentage: number;
    startDate: Date;
    endDate: Date;
    applicableProducts: Types.ObjectId[];
}
export declare const Promotion: mongoose.Model<IPromotion, {}, {}, {}, mongoose.Document<unknown, {}, IPromotion> & IPromotion & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export {};
