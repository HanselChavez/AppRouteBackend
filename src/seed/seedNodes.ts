
import mongoose from "mongoose";
import { Node } from "../models/Node";


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
  conexiones: Object.entries(conexiones as Record<string, number>).map(([destino, peso]) => ({
    destino,
    peso,
  })),
}));

const seed = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/tu_db"); // 🔹 cambia la URL
    console.log("Conectado a MongoDB ✅");

    // limpiar colección antes de insertar
    await Node.deleteMany({});
    console.log("Colección Nodo vaciada ✅");

    // insertar nuevos nodos
    await Node.insertMany(nodosData);
    console.log("Nodos insertados con éxito 🚀");

    mongoose.disconnect();
  } catch (error) {
    console.error("Error al hacer seed:", error);
    mongoose.disconnect();
  }
};

seed();