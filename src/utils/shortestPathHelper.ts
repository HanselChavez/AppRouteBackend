import { Node } from "../models/Node";
import { dijkstra } from "./dijkstra";

export const calculateShortestPath = async (
    origen: string,
    destino: string
) => {
    const [origenNode, destinoNode] = await Promise.all([
        Node.findOne({ code: origen }),
        Node.findOne({ code: destino }),
    ]);

    if (!origenNode || !destinoNode) {
        throw new Error("Alguno de los códigos no existe");
    }

    const nodes = await Node.find()
        .populate("connections.destination", "_id name code image description")
        .lean();

    if (!nodes.length) throw new Error("No existen nodos en la base de datos");

    const graph: Record<string, Record<string, number>> = {};
    for (const node of nodes) {
        const adj: Record<string, number> = {};
        for (const conn of node.connections) {
            const dest = conn.destination as any;
            if (dest?.code) adj[dest.code] = conn.weight;
        }
        graph[(node as any).code] = adj;
    }

    const result = dijkstra(graph, origen, destino);
    if (!result.path?.length)
        throw new Error("No hay ruta entre los nodos seleccionados");

    let pathNodes = await Node.find({ code: { $in: result.path } })
        .select("name code image description")
        .lean();

    pathNodes = pathNodes.sort(
        (a, b) => result.path.indexOf(a.code) - result.path.indexOf(b.code)
    );

    const nodos = pathNodes.map((node, index) => ({
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

    return {
        totalWeight: result.distance,
        path: result.path,
        nodos,
    };
};
