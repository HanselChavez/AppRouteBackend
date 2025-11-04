"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dijkstra = void 0;
const dijkstra = (graph, start, end) => {
    const distances = {};
    const previous = {};
    const unvisited = new Set(Object.keys(graph));
    // Inicializar todas las distancias con infinito excepto el nodo inicial
    for (const node in graph) {
        distances[node] = node === start ? 0 : Infinity;
        previous[node] = null;
    }
    while (unvisited.size > 0) {
        // Buscar el nodo con menor distancia entre los no visitados
        let currentNode = null;
        let smallestDistance = Infinity;
        for (const node of unvisited) {
            if (distances[node] < smallestDistance) {
                smallestDistance = distances[node];
                currentNode = node;
            }
        }
        // Si no hay nodo alcanzable o llegamos al destino, se detiene
        if (!currentNode || currentNode === end)
            break;
        unvisited.delete(currentNode);
        // Revisar los nodos adyacentes
        for (const [neighbor, weight] of Object.entries(graph[currentNode])) {
            const alt = distances[currentNode] + weight;
            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                previous[neighbor] = currentNode;
            }
        }
    }
    // Reconstruir el camino
    const path = [];
    let current = end;
    while (current) {
        path.unshift(current);
        current = previous[current];
        if (current === null)
            break;
    }
    // Si el nodo inicial no está en el camino, no hay ruta válida
    if (!path.includes(start)) {
        return { distance: Infinity, path: [] };
    }
    return { distance: distances[end], path };
};
exports.dijkstra = dijkstra;
//# sourceMappingURL=dijkstra.js.map