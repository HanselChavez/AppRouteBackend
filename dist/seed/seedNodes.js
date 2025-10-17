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
const mongoose_1 = __importDefault(require("mongoose"));
const Node_1 = require("../models/Node");
// 👇 pega aquí tu JSON (el grande que me pasaste)
const graph = {
    "ENTRADA": { "PATIO_1": 3 },
    "PATIO_1": { "ENTRADA": 3, "CAFETERIA": 1, "A_ESCALERA_PISO1": 3, "PATIO_2": 14 },
    "CAFETERIA": { "PATIO_1": 1 },
    "A_ESCALERA_PISO1": { "PATIO_1": 3, "A_ESCALERA_POSTERIOR_PISO1": 14, "A_ESCALERA_PISO2": 3 },
    // ... 👉 el resto del JSON gigante
};
// 🔹 Convertir el JSON en nodos con el formato del Schema
const nodosData = Object.entries(graph).map(([codigo, conexiones]) => ({
    codigo,
    nombre: codigo.replace(/_/g, " "), // puedes poner nombres más bonitos si quieres
    conexiones: Object.entries(conexiones).map(([destino, peso]) => ({
        destino,
        peso,
    })),
}));
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect("mongodb://localhost:27017/tu_db"); // 🔹 cambia la URL
        console.log("Conectado a MongoDB ✅");
        // limpiar colección antes de insertar
        yield Node_1.Node.deleteMany({});
        console.log("Colección Nodo vaciada ✅");
        // insertar nuevos nodos
        yield Node_1.Node.insertMany(nodosData);
        console.log("Nodos insertados con éxito 🚀");
        mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error("Error al hacer seed:", error);
        mongoose_1.default.disconnect();
    }
});
seed();
//# sourceMappingURL=seedNodes.js.map