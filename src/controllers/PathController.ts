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
        const { origen, destino } = req.body;

        if (!origen || !destino) {
            res.status(400).json({ message: "Códigos inválidos" });
            return;
        }

        console.log("🔍 Calculando ruta más corta de", origen, "a", destino);

        // Buscar los nodos por código
        const origenNode = await Node.findOne({ code: origen });
        const destinoNode = await Node.findOne({ code: destino });

        if (!origenNode || !destinoNode) {
            res.status(404).json({
                message: "Alguno de los códigos no existe",
            });
            return;
        }

        // Obtener todos los nodos con sus conexiones
        const nodes = await Node.find()
            .populate("connections.destination", "_id name code")
            .lean();

        if (!nodes.length) {
            res.status(404).json({
                message: "No existen nodos en la base de datos",
            });
            return;
        }

        const graph: Record<string, Record<string, number>> = {};

        for (const node of nodes) {
            const adjacents: Record<string, number> = {};

            for (const conn of node.connections) {
                const destino = conn.destination as any;
                if (destino && destino.code) {
                    adjacents[destino.code] = conn.weight;
                }
            }

            graph[(node as any).code] = adjacents;
        }

        const result = dijkstra(graph, origen, destino);

        if (!result.path || result.path.length === 0) {
            res.status(404).json({
                message: "No hay ruta entre los nodos seleccionados",
            });
            return;
        }

        // Obtener nodos de la ruta (por code)
        const pathNodes = await Node.find({ code: { $in: result.path } })
            .select("name code image description")
            .lean();
        const fecha = new Date();
        const metadata = {
            fecha: fecha.toISOString().split("T")[0], // YYYY-MM-DD
            hora: fecha.toTimeString().slice(0, 5), // HH:mm
        };
        // Adaptar los datos al formato del frontend
        const formattedNodes = pathNodes.map((node, index) => ({
            id: node._id,
            nombre: node.code || "Sin nombre",
            descripcion: node.name || `Descripción del nodo ${node.code}`,
            imagen: node.image || "https://picsum.photos/200/200",
            mensaje:
                index === 0
                    ? "Aquí comienza tu ruta"
                    : index === pathNodes.length - 1
                    ? "Has llegado a tu destino"
                    : "Dirígete al siguiente punto",
        }));

        res.status(200).json({
            metadata,
            totalWeight: result.distance,
            path: result.path,
            nodos: formattedNodes, // 👈 coincide con lo que espera el frontend
        });
    } catch (error) {
        console.error("❌ Error al calcular ruta más corta:", error);
        res.status(500).json({
            message: "Error al calcular la ruta más corta",
            error,
        });
    }
};
