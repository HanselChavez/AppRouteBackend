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
exports.getShortestPath = void 0;
const Node_1 = require("../models/Node");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const aws_1 = require("../config/aws");
const dijkstra_1 = require("../utils/dijkstra");
const mongoose_1 = __importDefault(require("mongoose"));
const getShortestPath = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idOrigin, idDestination } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(idOrigin) ||
            !mongoose_1.default.Types.ObjectId.isValid(idDestination)) {
            res.status(400).json({ message: "IDs inválidos" });
            return;
        }
        // Obtener todos los nodos y sus conexiones
        const nodes = yield Node_1.Node.find()
            .populate("connections.destination", "_id name code")
            .lean();
        if (!nodes.length) {
            res.status(404).json({
                message: "No existen nodos en la base de datos",
            });
            return;
        }
        // Construimos el grafo como un objeto: { nodoId: { destinoId: peso } }
        const graph = {};
        for (const node of nodes) {
            const adjacents = {};
            for (const conn of node.connections) {
                if (conn.destination) {
                    adjacents[String(conn.destination._id)] = conn.weight;
                }
            }
            graph[String(node._id)] = adjacents;
        }
        // Aplicar Dijkstra
        const result = (0, dijkstra_1.dijkstra)(graph, idOrigin, idDestination);
        if (!result.path || result.path.length === 0) {
            res.status(404).json({
                message: "No hay ruta entre los nodos seleccionados",
            });
            return;
        }
        // Obtener los nodos de la ruta
        const pathNodes = yield Node_1.Node.find({ _id: { $in: result.path } })
            .select("name code image")
            .lean();
        res.status(200).json({
            totalWeight: result.distance,
            path: result.path,
            nodes: pathNodes,
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
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: aws_1.s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
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
//# sourceMappingURL=PathController.js.map