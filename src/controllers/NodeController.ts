import { Request, Response } from "express";
import { Node } from "../models/Node"; // ajusta la ruta según tu estructura
import mongoose from "mongoose";

const isValidId = (id: string): boolean => mongoose.Types.ObjectId.isValid(id);

export const createNode = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { name, code, image, building, floor } = req.body;

        const existingNode = await Node.findOne({ $or: [{ name }, { code }] });
        if (existingNode) {
            res.status(400).json({
                message: "El nodo con ese nombre o código ya existe.",
            });
            return;
        }

        const newNode = new Node({ name, code, image, building, floor, connections: [] });
        await newNode.save();

        res.status(201).json(newNode);
    } catch (error) {
        console.error("❌ Error al crear nodo:", error);
        res.status(500).json({ message: "Error al crear el nodo", error });
    }
};

export const addConnection = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { idOrigin, idDestination, weight } = req.body;

        if (!isValidId(idOrigin) || !isValidId(idDestination)) {
            res.status(400).json({ message: "IDs inválidos" });
            return;
        }

        const [origin, destination] = await Promise.all([
            Node.findById(idOrigin),
            Node.findById(idDestination),
        ]);

        if (!origin || !destination) {
            res.status(404).json({
                message: "Nodo origen o destino no encontrado",
            });
            return;
        }

        const connectionExists = origin.connections.some((c) =>
            c.destination.equals(idDestination)
        );

        if (connectionExists) {
            res.status(400).json({
                message: "Ya existe una conexión entre estos nodos",
            });
            return;
        }

        origin.connections.push({ destination: idDestination, weight });
        await origin.save();

        res.status(200).json({
            message: "Conexión agregada correctamente",
            node: origin,
        });
    } catch (error) {
        console.error("❌ Error al agregar conexión:", error);
        res.status(500).json({ message: "Error al agregar conexión", error });
    }
};

export const editConnectionWeight = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { idOrigin, idDestination, newWeight } = req.body;

        const node = await Node.findById(idOrigin);
        if (!node) {
            res.status(404).json({ message: "Nodo origen no encontrado" });
            return;
        }

        const connection = node.connections.find((c) =>
            c.destination.equals(idDestination)
        );

        if (!connection) {
            res.status(404).json({ message: "Conexión no encontrada" });
            return;
        }

        connection.weight = newWeight;
        await node.save();

        res.status(200).json({
            message: "Peso actualizado correctamente",
            node,
        });
    } catch (error) {
        console.error("❌ Error al editar peso:", error);
        res.status(500).json({
            message: "Error al editar peso de conexión",
            error,
        });
    }
};

export const deleteConnection = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { idOrigin, idDestination } = req.body;

        const node = await Node.findById(idOrigin);
        if (!node) {
            res.status(404).json({ message: "Nodo origen no encontrado" });
            return;
        }

        node.connections = node.connections.filter(
            (c) => !c.destination.equals(idDestination)
        );
        await node.save();

        res.status(200).json({
            message: "Conexión eliminada correctamente",
            node,
        });
    } catch (error) {
        console.error("❌ Error al eliminar conexión:", error);
        res.status(500).json({ message: "Error al eliminar conexión", error });
    }
};

export const deleteNode = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { idNode } = req.params;

        const node = await Node.findByIdAndDelete(idNode);
        if (!node) {
            res.status(404).json({ message: "Nodo no encontrado" });
            return;
        }

        // 🔹 Limpia todas las referencias a este nodo en otras conexiones
        await Node.updateMany(
            {},
            { $pull: { connections: { destination: node._id } } }
        );

        res.status(200).json({
            message: "Nodo y referencias eliminados correctamente",
        });
    } catch (error) {
        console.error("❌ Error al eliminar nodo:", error);
        res.status(500).json({ message: "Error al eliminar nodo", error });
    }
};

export const getNode = async (req: Request, res: Response): Promise<void> => {
    try {
        const { idNode } = req.params;

        const node = await Node.findById(idNode)
            .populate("connections.destination", "name code image")
            .lean();

        if (!node) {
            res.status(404).json({ message: "Nodo no encontrado" });
            return;
        }

        res.status(200).json(node);
    } catch (error) {
        console.error("❌ Error al obtener nodo:", error);
        res.status(500).json({ message: "Error al obtener nodo", error });
    }
};

export const getNodes = async (req: Request, res: Response): Promise<void> => {
    try {
        const nodes = await Node.find()
            .populate("connections.destination", "name code image")
            .lean();

        if (!nodes || nodes.length === 0) {
            res.status(404).json({ message: "Grafo vacio" });
            return;
        }

        res.status(200).json(nodes);
    } catch (error) {
        console.error("❌ Error al obtener nodos:", error);
        res.status(500).json({ message: "Error al obtener nodos", error });
    }
};
