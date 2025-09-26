import { getDB } from "../config/db.js";

// Controlador para obtener todos los usuarios
// Manejando asi los errores usando el middleware de manejo de errores
export const obtenerUsers = async (req, res, next) => {
  try {
    const db = getDB();
    const users = await db.collection("user").find().toArray();
    res.json(users);
  } catch (err) {
    next(err);
  }
};