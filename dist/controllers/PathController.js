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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShortestPath = void 0;
const Node_1 = require("../models/Node");
const dijkstra_1 = require("../utils/dijkstra");
const getShortestPath = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { origen, destino } = req.body;
        if (!origen || !destino) {
            res.status(400).json({ message: "Códigos inválidos" });
            return;
        }
        console.log("🔍 Calculando ruta más corta de", origen, "a", destino);
        // Buscar los nodos por código
        const origenNode = yield Node_1.Node.findOne({ code: origen });
        const destinoNode = yield Node_1.Node.findOne({ code: destino });
        if (!origenNode || !destinoNode) {
            res.status(404).json({
                message: "Alguno de los códigos no existe",
            });
            return;
        }
        // Obtener todos los nodos con sus conexiones
        const nodes = yield Node_1.Node.find()
            .populate("connections.destination", "_id name code")
            .lean();
        if (!nodes.length) {
            res.status(404).json({
                message: "No existen nodos en la base de datos",
            });
            return;
        }
        const graph = {};
        for (const node of nodes) {
            const adjacents = {};
            for (const conn of node.connections) {
                const destino = conn.destination;
                if (destino && destino.code) {
                    adjacents[destino.code] = conn.weight;
                }
            }
            graph[node.code] = adjacents;
        }
        const result = (0, dijkstra_1.dijkstra)(graph, origen, destino);
        if (!result.path || result.path.length === 0) {
            res.status(404).json({
                message: "No hay ruta entre los nodos seleccionados",
            });
            return;
        }
        // Obtener nodos de la ruta (por code)
        const pathNodes = yield Node_1.Node.find({ code: { $in: result.path } })
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
            mensaje: index === 0
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
    }
    catch (error) {
        console.error("❌ Error al calcular ruta más corta:", error);
        res.status(500).json({
            message: "Error al calcular la ruta más corta",
            error,
        });
    }
});
exports.getShortestPath = getShortestPath;
//# sourceMappingURL=PathController.js.map