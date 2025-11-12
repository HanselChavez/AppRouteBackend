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
exports.getShortestPath = exports.getRoutesRecent = void 0;
const Routes_1 = require("../models/Routes");
const controllerUtils_1 = require("../utils/controllerUtils");
const shortestPathHelper_1 = require("../utils/shortestPathHelper");
const getRoutesRecent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = (0, controllerUtils_1.requireUser)(req, res);
        if (!userId)
            return;
        const routeDoc = yield Routes_1.Route.findOne({ user: userId }).lean();
        if (!routeDoc || !routeDoc.routes.length) {
            res.status(200).json([]);
            return;
        }
        const sortedRoutes = [...routeDoc.routes]
            .sort((a, b) => new Date(b.ultimoUso).getTime() -
            new Date(a.ultimoUso).getTime())
            .slice(0, 10);
        const recentRoutes = yield Promise.all(sortedRoutes.map((r) => __awaiter(void 0, void 0, void 0, function* () {
            const fechaObj = new Date(r.ultimoUso);
            const metadata = {
                fecha: fechaObj.toISOString().split("T")[0],
                hora: fechaObj.toTimeString().slice(0, 5),
            };
            const { nodos } = yield (0, shortestPathHelper_1.calculateShortestPath)(r.origen, r.destino);
            return { metadata, nodos };
        })));
        res.status(200).json(recentRoutes);
    }
    catch (error) {
        (0, controllerUtils_1.handleError)(res, error, "Error al obtener rutas recientes");
    }
});
exports.getRoutesRecent = getRoutesRecent;
const getShortestPath = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { origen, destino } = req.body;
        if (!origen || !destino) {
            res.status(400).json({ message: "Códigos inválidos" });
            return;
        }
        const userId = (0, controllerUtils_1.requireUser)(req, res);
        if (!userId)
            return;
        const { nodos, path, totalWeight } = yield (0, shortestPathHelper_1.calculateShortestPath)(origen, destino);
        const routeDoc = yield Routes_1.Route.findOneAndUpdate({
            user: userId,
            "routes.origen": origen,
            "routes.destino": destino,
        }, {
            $inc: { "routes.$.count": 1 },
            $set: { "routes.$.ultimoUso": new Date() },
        }, { new: true });
        if (!routeDoc) {
            yield Routes_1.Route.updateOne({ user: userId }, {
                $push: {
                    routes: {
                        origen,
                        destino,
                        count: 1,
                        ultimoUso: new Date(),
                    },
                },
            }, { upsert: true });
        }
        const fecha = new Date();
        const metadata = {
            fecha: fecha.toISOString().split("T")[0],
            hora: fecha.toTimeString().slice(0, 5),
        };
        res.status(200).json({
            metadata,
            totalWeight,
            path,
            nodos,
        });
    }
    catch (error) {
        (0, controllerUtils_1.handleError)(res, error, "Error al calcular la ruta más corta");
    }
});
exports.getShortestPath = getShortestPath;
//# sourceMappingURL=PathController.js.map