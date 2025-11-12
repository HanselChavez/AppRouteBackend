import mongoose, { Document, Types } from "mongoose";
export interface IRouteItem {
    origen: string;
    destino: string;
    count: number;
    ultimoUso: Date;
}
export interface IRoute extends Document {
    user: Types.ObjectId;
    routes: IRouteItem[];
}
export declare const Route: mongoose.Model<IRoute, {}, {}, {}, mongoose.Document<unknown, {}, IRoute> & IRoute & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
