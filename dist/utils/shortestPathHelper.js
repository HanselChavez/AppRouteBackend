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
exports.calculateShortestPath = void 0;
const Node_1 = require("../models/Node");
const dijkstra_1 = require("./dijkstra");
const calculateShortestPath = (origen, destino) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const [origenNode, destinoNode] = yield Promise.all([
        Node_1.Node.findOne({ code: origen }),
        Node_1.Node.findOne({ code: destino }),
    ]);
    if (!origenNode || !destinoNode) {
        throw new Error("Alguno de los códigos no existe");
    }
    const nodes = yield Node_1.Node.find()
        .populate("connections.destination", "_id name code image description")
        .lean();
    if (!nodes.length)
        throw new Error("No existen nodos en la base de datos");
    const graph = {};
    for (const node of nodes) {
        const adj = {};
        for (const conn of node.connections) {
            const dest = conn.destination;
            if (dest === null || dest === void 0 ? void 0 : dest.code)
                adj[dest.code] = conn.weight;
        }
        graph[node.code] = adj;
    }
    const result = (0, dijkstra_1.dijkstra)(graph, origen, destino);
    if (!((_a = result.path) === null || _a === void 0 ? void 0 : _a.length))
        throw new Error("No hay ruta entre los nodos seleccionados");
    let pathNodes = yield Node_1.Node.find({ code: { $in: result.path } })
        .select("name code image description")
        .lean();
    pathNodes = pathNodes.sort((a, b) => result.path.indexOf(a.code) - result.path.indexOf(b.code));
    const nodos = pathNodes.map((node, index) => ({
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
    return {
        totalWeight: result.distance,
        path: result.path,
        nodos,
    };
});
exports.calculateShortestPath = calculateShortestPath;
//# sourceMappingURL=shortestPathHelper.js.map