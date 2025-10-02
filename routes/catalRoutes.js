import { Router } from "express";
import { getDB } from "../config/db.js"; // <– lo usamos en el patch pero no estaba importado

// importamos la conexión a la base de datos y los controladores de catálogo
import {
  getinventario,
  getByCategoria,
  getById,
  searchByTitle,
  getByGenre
} from "../controllers/catalController.js";

import { requireAuth, requireAdmin } from "../middlewares/authMiddleware.js";


// función para obtener la base de datos y la colección para usar en las rutas
const router = Router();
router.patch("/:id/like", requireAuth, async (req, res, next) => {
  try {
    const db = getDB();
    const { action } = req.body; // aqui esperamos "like" o "dislike"
    const userId = req.user.id;  // ID del usuario autenticado

    const result = await db.collection("inventario").findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: { likes: userId, dislikes: userId }, // primero removemos cualquier reacción previa
        ...(action === "like" ? { $addToSet: { likes: userId } } : {}),
        ...(action === "dislike" ? { $addToSet: { dislikes: userId } } : {})
      },
      { returnDocument: "after" }
    );

    

    res.json({
      likes: result.value.likes?.length || 0,
      dislikes: result.value.dislikes?.length || 0
    });
  } catch (err) {
    next(err);
  }
});


// ================
//  Nuevos endpoints para funcionalidades adicionales
// ================


// endpoint para obtener los ítems más populares (ejemplo simple basado en un campo "popularity")
router.get("/popular", async (_req, res, next) => {
  try {
    const db = getDB();
    const items = await db.collection("inventario").find().sort({ "popularity": -1 }).limit(20).toArray();
    res.json(items);
  } catch (err) {
    next(err);
  }
});



// enpoint para obtener solo las películas 

router.get("/movies", async (req, res, next) => {
  try {
    const db = getDB();
    const items = await db.collection("inventario").find({ categoria: "movie" }).toArray();
    res.json(items);
  } catch (err) {
    next(err);
  }
});


// endpoint para obtener solo las series

router.get("/series", async (req, res, next)=> {
  try{
    const db = getDB();
    const items = await db.collection("inventario").find({ categoria: "serie" }).toArray();
    res.json(items);
  } catch(err){
    next(err);
  }
});


// endpoint para obtener solo los animes

router.get("/animes", async (req, res, next)=> {
  try{
    const db = getDB();
    const items = await db.collection("inventario").find({ categoria: "anime" }).toArray();
    res.json(items);
  } catch(err){
    next(err);
  }
});




// endpoint para obtener el ranking de ítems más populares, con filtros opcionales
router.get("/ranking", async (req, res, next) => {
  try {
    const db = getDB();
    const categoria = (req.query.categoria || "").toLowerCase().trim();
    const limit = Math.min(parseInt(req.query.limit || "10", 10) || 10, 100);

    const match = {};
    if (categoria) match.categoria = categoria;

    const items = await db.collection("inventario")
      .find(match)
      .sort({ vote_average: -1 }) // ordena por voto promedio descendente
      .limit(limit)
      .toArray();

    res.json(items);
  } catch (err) {
    next(err);
  }
});




// Rutas donde estan los endpoints del catálogo de películas y series 
router.get("/", getinventario);                   // coge todo el catálogo
router.get("/categoria/:categoria", getByCategoria); // filtro por categoría
router.get("/search", searchByTitle);           // búsqueda por título 
router.get("/genre/:genre", getByGenre);       // filtra por género
router.get("/findmovie/:id", getById);                    // coge un ítem por su ID


export default router;