"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodes = exports.getNode = exports.deleteNode = exports.deleteConnection = exports.editConnectionWeight = exports.addConnection = exports.createNode = void 0;
const Node_1 = require("../models/Node"); // ajusta la ruta según tu estructura
const mongoose_1 = __importDefault(require("mongoose"));
const isValidId = (id) => mongoose_1.default.Types.ObjectId.isValid(id);
const createNode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, code, image, building, floor } = req.body;
        const existingNode = yield Node_1.Node.findOne({ $or: [{ name }, { code }] });
        if (existingNode) {
            res.status(400).json({
                message: "El nodo con ese nombre o código ya existe.",
            });
            return;
        }
        const newNode = new Node_1.Node({ name, code, image, building, floor, connections: [] });
        yield newNode.save();
        res.status(201).json(newNode);
    }
    catch (error) {
        console.error("❌ Error al crear nodo:", error);
        res.status(500).json({ message: "Error al crear el nodo", error });
    }
});
exports.createNode = createNode;
const addConnection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idOrigin, idDestination, weight } = req.body;
        if (!isValidId(idOrigin) || !isValidId(idDestination)) {
            res.status(400).json({ message: "IDs inválidos" });
            return;
        }
        const [origin, destination] = yield Promise.all([
            Node_1.Node.findById(idOrigin),
            Node_1.Node.findById(idDestination),
        ]);
        if (!origin || !destination) {
            res.status(404).json({
                message: "Nodo origen o destino no encontrado",
            });
            return;
        }
        const connectionExists = origin.connections.some((c) => c.destination.equals(idDestination));
        if (connectionExists) {
            res.status(400).json({
                message: "Ya existe una conexión entre estos nodos",
            });
            return;
        }
        origin.connections.push({ destination: idDestination, weight });
        yield origin.save();
        res.status(200).json({
            message: "Conexión agregada correctamente",
            node: origin,
        });
    }
    catch (error) {
        console.error("❌ Error al agregar conexión:", error);
        res.status(500).json({ message: "Error al agregar conexión", error });
    }
});
exports.addConnection = addConnection;
const editConnectionWeight = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idOrigin, idDestination, newWeight } = req.body;
        const node = yield Node_1.Node.findById(idOrigin);
        if (!node) {
            res.status(404).json({ message: "Nodo origen no encontrado" });
            return;
        }
        const connection = node.connections.find((c) => c.destination.equals(idDestination));
        if (!connection) {
            res.status(404).json({ message: "Conexión no encontrada" });
            return;
        }
        connection.weight = newWeight;
        yield node.save();
        res.status(200).json({
            message: "Peso actualizado correctamente",
            node,
        });
    }
    catch (error) {
        console.error("❌ Error al editar peso:", error);
        res.status(500).json({
            message: "Error al editar peso de conexión",
            error,
        });
    }
});
exports.editConnectionWeight = editConnectionWeight;
const deleteConnection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idOrigin, idDestination } = req.body;
        const node = yield Node_1.Node.findById(idOrigin);
        if (!node) {
            res.status(404).json({ message: "Nodo origen no encontrado" });
            return;
        }
        node.connections = node.connections.filter((c) => !c.destination.equals(idDestination));
        yield node.save();
        res.status(200).json({
            message: "Conexión eliminada correctamente",
            node,
        });
    }
    catch (error) {
        console.error("❌ Error al eliminar conexión:", error);
        res.status(500).json({ message: "Error al eliminar conexión", error });
    }
});
exports.deleteConnection = deleteConnection;
const deleteNode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idNode } = req.params;
        const node = yield Node_1.Node.findByIdAndDelete(idNode);
        if (!node) {
            res.status(404).json({ message: "Nodo no encontrado" });
            return;
        }
        // 🔹 Limpia todas las referencias a este nodo en otras conexiones
        yield Node_1.Node.updateMany({}, { $pull: { connections: { destination: node._id } } });
        res.status(200).json({
            message: "Nodo y referencias eliminados correctamente",
        });
    }
    catch (error) {
        console.error("❌ Error al eliminar nodo:", error);
        res.status(500).json({ message: "Error al eliminar nodo", error });
    }
});
exports.deleteNode = deleteNode;
const getNode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idNode } = req.params;
        const node = yield Node_1.Node.findById(idNode)
            .populate("connections.destination", "name code image")
            .lean();
        if (!node) {
            res.status(404).json({ message: "Nodo no encontrado" });
            return;
        }
        res.status(200).json(node);
    }
    catch (error) {
        console.error("❌ Error al obtener nodo:", error);
        res.status(500).json({ message: "Error al obtener nodo", error });
    }
});
exports.getNode = getNode;
const getNodes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nodes = yield Node_1.Node.find()
            .populate("connections.destination", "name code image")
            .lean();
        if (!nodes || nodes.length === 0) {
            res.status(404).json({ message: "Grafo vacio" });
            return;
        }
        res.status(200).json(nodes);
    }
    catch (error) {
        console.error("❌ Error al obtener nodos:", error);
        res.status(500).json({ message: "Error al obtener nodos", error });
    }
});
exports.getNodes = getNodes;
//# sourceMappingURL=NodeController.js.map