import { Request, Response } from "express";
import { Route } from "../models/Routes";
import { handleError, requireUser } from "../utils/controllerUtils";
import { calculateShortestPath } from "../utils/shortestPathHelper";
export const getRoutesRecent = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = requireUser(req, res);
        if (!userId) return;

        const routeDoc = await Route.findOne({ user: userId }).lean();
        if (!routeDoc || !routeDoc.routes.length) {
            res.status(200).json([]);
            return;
        }

        const sortedRoutes = [...routeDoc.routes]
            .sort(
                (a, b) =>
                    new Date(b.ultimoUso).getTime() -
                    new Date(a.ultimoUso).getTime()
            )
            .slice(0, 10);

        const recentRoutes = await Promise.all(
            sortedRoutes.map(async (r) => {
                const fechaObj = new Date(r.ultimoUso);
                const metadata = {
                    fecha: fechaObj.toISOString().split("T")[0],
                    hora: fechaObj.toTimeString().slice(0, 5),
                };
                const { nodos } = await calculateShortestPath(
                    r.origen,
                    r.destino
                );
                return { metadata, nodos };
            })
        );

        res.status(200).json(recentRoutes);
    } catch (error) {
        handleError(res, error, "Error al obtener rutas recientes");
    }
};
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

        const userId = requireUser(req, res);
        if (!userId) return;

        const { nodos, path, totalWeight } = await calculateShortestPath(
            origen,
            destino
        );

        const routeDoc = await Route.findOneAndUpdate(
            {
                user: userId,
                "routes.origen": origen,
                "routes.destino": destino,
            },
            {
                $inc: { "routes.$.count": 1 },
                $set: { "routes.$.ultimoUso": new Date() },
            },
            { new: true }
        );

        if (!routeDoc) {
            await Route.updateOne(
                { user: userId },
                {
                    $push: {
                        routes: {
                            origen,
                            destino,
                            count: 1,
                            ultimoUso: new Date(),
                        },
                    },
                },
                { upsert: true }
            );
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
    } catch (error) {
        handleError(res, error, "Error al calcular la ruta más corta");
    }
};
