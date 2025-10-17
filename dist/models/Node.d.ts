import mongoose, { Types, Document } from "mongoose";
export interface IConexion {
    destination: Types.ObjectId;
    weight: number;
}
export interface INode extends Document {
    name: string;
    code: string;
    building?: string;
    floor?: string;
    image?: string;
    connections: IConexion[];
}
export declare const Node: mongoose.Model<INode, {}, {}, {}, mongoose.Document<unknown, {}, INode> & INode & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
