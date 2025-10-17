export const dijkstra = (
    graph: Record<string, Record<string, number>>,
    start: string,
    end: string
): { distance: number; path: string[] } => {
    const distances: Record<string, number> = {};
    const previous: Record<string, string | null> = {};
    const unvisited = new Set(Object.keys(graph));

    // Inicializar distancias
    for (const node of Object.keys(graph)) {
        distances[node] = node === start ? 0 : Infinity;
        previous[node] = null;
    }

    while (unvisited.size > 0) {
        // Nodo con menor distancia
        const current = Array.from(unvisited).reduce((min, node) =>
            distances[node] < distances[min] ? node : min
        );

        unvisited.delete(current);

        if (current === end) break;

        for (const [neighbor, weight] of Object.entries(graph[current] || {})) {
            const alt = distances[current] + weight;
            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                previous[neighbor] = current;
            }
        }
    }

    // Reconstruir camino
    const path: string[] = [];
    let current: string | null = end;
    while (current) {
        path.unshift(current);
        current = previous[current];
    }

    return {
        distance: distances[end],
        path: distances[end] === Infinity ? [] : path,
    };
};
