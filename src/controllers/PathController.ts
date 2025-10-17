import { Request, Response } from "express";
import { Node } from "../models/Node";
import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../config/aws";
import { dijkstra } from "../utils/dijkstra";
import mongoose from "mongoose";

export const getShortestPath = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { idOrigin, idDestination } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(idOrigin) ||
            !mongoose.Types.ObjectId.isValid(idDestination)
        ) {
            res.status(400).json({ message: "IDs inválidos" });
            return;
        }

        // Obtener todos los nodos y sus conexiones
        const nodes = await Node.find()
            .populate("connections.destination", "_id name code")
            .lean();

        if (!nodes.length) {
            res.status(404).json({
                message: "No existen nodos en la base de datos",
            });
            return;
        }

        // Construimos el grafo como un objeto: { nodoId: { destinoId: peso } }
        const graph: Record<string, Record<string, number>> = {};
        for (const node of nodes) {
            const adjacents: Record<string, number> = {};
            for (const conn of node.connections) {
                if (conn.destination) {
                    adjacents[String(conn.destination._id)] = conn.weight;
                }
            }
            graph[String(node._id)] = adjacents;
        }

        // Aplicar Dijkstra
        const result = dijkstra(graph, idOrigin, idDestination);

        if (!result.path || result.path.length === 0) {
            res.status(404).json({
                message: "No hay ruta entre los nodos seleccionados",
            });
            return;
        }

        // Obtener los nodos de la ruta
        const pathNodes = await Node.find({ _id: { $in: result.path } })
            .select("name code image")
            .lean();

        res.status(200).json({
            totalWeight: result.distance,
            path: result.path,
            nodes: pathNodes,
        });
    } catch (error) {
        console.error("❌ Error al calcular ruta más corta:", error);
        res.status(500).json({
            message: "Error al calcular la ruta más corta",
            error,
        });
    }
};



const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME!,
        acl: "public-read",
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const fileName = `${Date.now()}-${file.originalname}`;
            cb(null, fileName);
        },
    }),
}).array("images");
