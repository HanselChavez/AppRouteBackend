export declare const calculateShortestPath: (origen: string, destino: string) => Promise<{
    totalWeight: number;
    path: string[];
    nodos: {
        id: import("mongoose").FlattenMaps<unknown>;
        nombre: string;
        descripcion: string;
        imagen: string;
        mensaje: string;
    }[];
}>;
