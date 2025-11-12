import mongoose, { Schema, Document, Types } from "mongoose";

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

const RouteItemSchema = new Schema<IRouteItem>(
    {
        origen: { type: String, required: true },
        destino: { type: String, required: true },
        count: { type: Number, default: 1 },
        ultimoUso: { type: Date, default: Date.now },
    },
    { _id: false }
);

const RouteSchema = new Schema<IRoute>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        routes: [RouteItemSchema],
    },
    { timestamps: true }
);

export const Route = mongoose.model<IRoute>("Route", RouteSchema);
