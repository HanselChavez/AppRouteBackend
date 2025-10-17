import mongoose, { Document, Types } from "mongoose";
interface IReview {
    user: Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
}
interface IProduct extends Document {
    name: string;
    description: string;
    images: string[];
    category: Types.ObjectId;
    variations: IVariation[];
    specifications: ISpecification[];
    materials: string[];
    reviews: IReview[];
    discount: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
interface ISpecification {
    key: string;
    value: string;
}
interface IVariation {
    color: string;
    size: string;
    price: number;
    stock: number;
    maxItemsPerUser?: number;
}
export declare const Product: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct> & IProduct & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export {};
