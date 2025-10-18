export const dijkstra = (
    graph: Record<string, Record<string, number>>,
    start: string,
    end: string
): { distance: number; path: string[] } => {
    const distances: Record<string, number> = {};
    const previous: Record<string, string | null> = {};
    const unvisited = new Set<string>(Object.keys(graph));

    // Inicializar todas las distancias con infinito excepto el nodo inicial
    for (const node in graph) {
        distances[node] = node === start ? 0 : Infinity;
        previous[node] = null;
    }

    while (unvisited.size > 0) {
        // Buscar el nodo con menor distancia entre los no visitados
        let currentNode: string | null = null;
        let smallestDistance = Infinity;

        for (const node of unvisited) {
            if (distances[node] < smallestDistance) {
                smallestDistance = distances[node];
                currentNode = node;
            }
        }

        // Si no hay nodo alcanzable o llegamos al destino, se detiene
        if (!currentNode || currentNode === end) break;

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
    const path: string[] = [];
    let current = end;

    while (current) {
        path.unshift(current);
        current = previous[current]!;
        if (current === null) break;
    }

    // Si el nodo inicial no está en el camino, no hay ruta válida
    if (!path.includes(start)) {
        return { distance: Infinity, path: [] };
    }

    return { distance: distances[end], path };
};
