import mongoose, { Schema,Types, Document } from "mongoose";

export interface IConexion {
    destination:  Types.ObjectId, 
    weight: number;
}

export interface INode extends Document {
    name: string;
    code:string;
    building?: string;
    floor?: string;
    image?: string;
    connections: IConexion[];
}

const NodeSchema = new Schema<INode>({
    code: { type: String, unique: true, required: true },
    name: { type: String, unique: true, required: true },
    image: { type: String },
    building: { type: String },
    floor: { type: String },
    connections:  [
    {
        destination: { type: Schema.Types.ObjectId, ref: "Node", required: true }, 
        weight: { type: Number, required: true },   
      }
    ],
});

export const Node = mongoose.model<INode>("Node", NodeSchema);