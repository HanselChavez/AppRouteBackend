import mongoose, { Document, Types } from "mongoose";
interface IReport extends Document {
    type: "sales" | "inventory" | "customer";
    data: object;
    generatedBy: Types.ObjectId;
    createdAt: Date;
}
export declare const Report: mongoose.Model<IReport, {}, {}, {}, mongoose.Document<unknown, {}, IReport> & IReport & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export {};
